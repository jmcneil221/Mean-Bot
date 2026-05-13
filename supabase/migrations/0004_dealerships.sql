-- Migration: 0004_dealerships.sql
-- Multi-tenant dealership architecture with RLS
-- ─────────────────────────────────────────────

begin;

-- ══════════════════════════════════════════════
-- 1. dealerships table
-- ══════════════════════════════════════════════

create table if not exists public.dealerships (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text unique not null,
  plan           text not null default 'standard'
                   check (plan in ('founding_30','boutique','small','enterprise','standard')),

  -- Contact
  phone          text,
  email          text,
  website        text,

  -- Location
  address_line1  text,
  address_line2  text,
  city           text not null default 'CT',
  state          text not null default 'CT',
  zip            text,

  -- Branding
  logo_url       text,
  primary_color  text,

  -- Founding 30 fields
  founding_tranche_1_paid boolean not null default false,
  founding_tranche_2_paid boolean not null default false,
  founding_signed_at      timestamptz,

  -- Status
  status         text not null default 'pending'
                   check (status in ('pending','active','suspended','churned')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.dealerships enable row level security;

create index dealerships_slug_idx   on public.dealerships (slug);
create index dealerships_plan_idx   on public.dealerships (plan);
create index dealerships_status_idx on public.dealerships (status);


-- ══════════════════════════════════════════════
-- 2. Link profiles → dealerships
-- ══════════════════════════════════════════════

alter table public.profiles
  add column if not exists dealership_id uuid references public.dealerships(id) on delete set null;

create index profiles_dealership_idx on public.profiles (dealership_id);


-- ══════════════════════════════════════════════
-- 3. Link vehicles → dealerships
-- ══════════════════════════════════════════════

alter table public.vehicles
  add column if not exists dealership_id uuid references public.dealerships(id) on delete set null;

create index vehicles_dealership_idx on public.vehicles (dealership_id);


-- ══════════════════════════════════════════════
-- 4. Link credit applications → vehicles
-- ══════════════════════════════════════════════

alter table public.credit_applications
  add column if not exists interested_vehicle_id uuid references public.vehicles(id) on delete set null;

create index ca_vehicle_idx on public.credit_applications (interested_vehicle_id);


-- ══════════════════════════════════════════════
-- 5. Helper: current_dealership_id()
--    Returns the dealership_id for the logged-in
--    user, or NULL if they aren't a dealer.
-- ══════════════════════════════════════════════

create or replace function public.current_dealership_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select dealership_id
  from public.profiles
  where id = auth.uid()
$$;


-- ══════════════════════════════════════════════
-- 6. Helper: is_admin()
-- ══════════════════════════════════════════════

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  )
$$;


-- ══════════════════════════════════════════════
-- 7. RLS — dealerships
-- ══════════════════════════════════════════════

-- Dealers see their own dealership; admins see all
create policy "dealerships_select"
  on public.dealerships for select
  using (
    id = current_dealership_id()
    or is_admin()
  );

-- Only admins can insert/update/delete dealerships
create policy "dealerships_admin_insert"
  on public.dealerships for insert
  with check ( is_admin() );

create policy "dealerships_admin_update"
  on public.dealerships for update
  using ( is_admin() );

create policy "dealerships_admin_delete"
  on public.dealerships for delete
  using ( is_admin() );


-- ══════════════════════════════════════════════
-- 8. RLS — vehicles (replace old dealer_id policies)
-- ══════════════════════════════════════════════

-- Drop the old per-user policies
drop policy if exists "vehicles read active"   on public.vehicles;
drop policy if exists "vehicles dealer write"  on public.vehicles;
drop policy if exists "vehicles dealer update" on public.vehicles;
drop policy if exists "vehicles dealer delete" on public.vehicles;

-- Anyone can read active vehicles; dealers also see their own non-active
create policy "vehicles_select"
  on public.vehicles for select
  using (
    status = 'active'
    or dealership_id = current_dealership_id()
    or is_admin()
  );

-- Dealers insert vehicles scoped to their dealership
create policy "vehicles_dealer_insert"
  on public.vehicles for insert
  with check (
    dealership_id = current_dealership_id()
    or is_admin()
  );

-- Dealers update only their dealership's vehicles
create policy "vehicles_dealer_update"
  on public.vehicles for update
  using (
    dealership_id = current_dealership_id()
    or is_admin()
  );

-- Dealers delete only their dealership's vehicles
create policy "vehicles_dealer_delete"
  on public.vehicles for delete
  using (
    dealership_id = current_dealership_id()
    or is_admin()
  );


-- ══════════════════════════════════════════════
-- 9. RLS — credit_applications (add dealer read)
-- ══════════════════════════════════════════════

-- Dealers can read applications tied to their vehicles
create policy "ca_dealer_read"
  on public.credit_applications for select
  using (
    exists (
      select 1 from public.vehicles v
      where v.id = credit_applications.interested_vehicle_id
        and v.dealership_id = current_dealership_id()
    )
  );


-- ══════════════════════════════════════════════
-- 10. RLS — profiles (add dealership-scoped read)
-- ══════════════════════════════════════════════

-- Dealers can read profiles of users who applied to their vehicles
-- (needed for the leads dashboard)
create policy "profiles_dealer_read_applicants"
  on public.profiles for select
  using (
    exists (
      select 1 from public.credit_applications ca
      join public.vehicles v on v.id = ca.interested_vehicle_id
      where ca.user_id = profiles.id
        and v.dealership_id = current_dealership_id()
    )
  );


-- ══════════════════════════════════════════════
-- 11. updated_at trigger for dealerships
-- ══════════════════════════════════════════════

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger dealerships_updated_at
  before update on public.dealerships
  for each row execute function public.set_updated_at();

-- Also apply to vehicles and profiles if not already present
drop trigger if exists vehicles_updated_at on public.vehicles;
create trigger vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();


commit;
