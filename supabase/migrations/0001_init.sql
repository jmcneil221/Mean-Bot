-- CarBuyingHub.com — initial schema
-- Run in Supabase SQL Editor (Database → SQL Editor → New query → paste → Run)
-- Idempotent: safe to re-run.

------------------------------------------------------------------------
-- Extensions
------------------------------------------------------------------------
create extension if not exists "pgcrypto";

------------------------------------------------------------------------
-- profiles — public-facing user data, 1:1 with auth.users
------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role text not null default 'buyer' check (role in ('buyer','dealer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

------------------------------------------------------------------------
-- credit_applications — sensitive PII tokenized in app layer (src/security/)
------------------------------------------------------------------------
create table if not exists public.credit_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'submitted'
    check (status in ('draft','submitted','reviewing','approved','denied','withdrawn')),

  -- Tokenized / encrypted fields. Plaintext PII NEVER lives in this table.
  ssn_token text not null,             -- opaque token; vault holds encrypted SSN
  ssn_last4 text not null check (length(ssn_last4) = 4),
  encrypted_dob text not null,         -- AES-256-GCM ciphertext (JSON envelope)
  encrypted_address text not null,
  encrypted_employment text not null,

  -- Non-sensitive fields safe to query/index
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  annual_income_cents bigint not null check (annual_income_cents >= 0),
  requested_amount_cents bigint check (requested_amount_cents >= 0),

  -- Audit
  ip_address inet,
  user_agent text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id),

  -- Retention (GLBA: 7 years)
  expires_at timestamptz not null default (now() + interval '7 years')
);

create index if not exists credit_applications_user_idx on public.credit_applications(user_id);
create index if not exists credit_applications_status_idx on public.credit_applications(status);
create index if not exists credit_applications_submitted_idx on public.credit_applications(submitted_at desc);

------------------------------------------------------------------------
-- vehicles — dealer inventory (stub)
------------------------------------------------------------------------
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid references public.profiles(id) on delete cascade,
  vin text unique,
  year int not null check (year between 1900 and 2100),
  make text not null,
  model text not null,
  trim text,
  mileage int check (mileage >= 0),
  price_cents bigint not null check (price_cents >= 0),
  body_style text,
  exterior_color text,
  interior_color text,
  transmission text,
  drivetrain text,
  fuel_type text,
  description text,
  photos text[] default '{}',
  status text not null default 'active' check (status in ('active','sold','pending','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicles_dealer_idx on public.vehicles(dealer_id);
create index if not exists vehicles_status_idx on public.vehicles(status);
create index if not exists vehicles_make_model_idx on public.vehicles(make, model);
create index if not exists vehicles_price_idx on public.vehicles(price_cents);

------------------------------------------------------------------------
-- dealer_subscriptions — billing tier per dealer
------------------------------------------------------------------------
create table if not exists public.dealer_subscriptions (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null unique references public.profiles(id) on delete cascade,
  tier text not null check (tier in ('starter','growth','pro')),
  status text not null default 'active' check (status in ('active','past_due','canceled','trialing')),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

------------------------------------------------------------------------
-- audit_log — chained-hash tamper-evident log (mirrors src/security/auditLog.js)
------------------------------------------------------------------------
create table if not exists public.audit_log (
  id bigserial primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid references auth.users(id),
  action text not null,
  resource_type text,
  resource_id text,
  metadata jsonb default '{}'::jsonb,
  prev_hash text,
  hash text not null
);

create index if not exists audit_log_actor_idx on public.audit_log(actor_id);
create index if not exists audit_log_resource_idx on public.audit_log(resource_type, resource_id);

------------------------------------------------------------------------
-- Row-Level Security
------------------------------------------------------------------------
alter table public.profiles              enable row level security;
alter table public.credit_applications   enable row level security;
alter table public.vehicles              enable row level security;
alter table public.dealer_subscriptions  enable row level security;
alter table public.audit_log             enable row level security;

-- profiles: users see/update their own row; vehicles search needs public-read of dealer profiles
drop policy if exists "profiles read own"   on public.profiles;
drop policy if exists "profiles read dealers" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles read own"     on public.profiles for select using (auth.uid() = id);
create policy "profiles read dealers" on public.profiles for select using (role = 'dealer');
create policy "profiles update own"   on public.profiles for update using (auth.uid() = id);

-- credit_applications: buyer reads/inserts own; admins read all (admin checks handled server-side)
drop policy if exists "ca read own"   on public.credit_applications;
drop policy if exists "ca insert own" on public.credit_applications;
create policy "ca read own"   on public.credit_applications for select using (auth.uid() = user_id);
create policy "ca insert own" on public.credit_applications for insert with check (auth.uid() = user_id);

-- vehicles: anyone can read active inventory; only the owning dealer can write
drop policy if exists "vehicles read active" on public.vehicles;
drop policy if exists "vehicles dealer write" on public.vehicles;
drop policy if exists "vehicles dealer update" on public.vehicles;
drop policy if exists "vehicles dealer delete" on public.vehicles;
create policy "vehicles read active"  on public.vehicles for select using (status = 'active' or auth.uid() = dealer_id);
create policy "vehicles dealer write" on public.vehicles for insert with check (auth.uid() = dealer_id);
create policy "vehicles dealer update" on public.vehicles for update using (auth.uid() = dealer_id);
create policy "vehicles dealer delete" on public.vehicles for delete using (auth.uid() = dealer_id);

-- dealer_subscriptions: dealer reads own
drop policy if exists "subs read own" on public.dealer_subscriptions;
create policy "subs read own" on public.dealer_subscriptions for select using (auth.uid() = dealer_id);

-- audit_log: no client-side access at all. Service role only (bypasses RLS).
-- (Intentionally no policies → all client reads/writes denied.)
