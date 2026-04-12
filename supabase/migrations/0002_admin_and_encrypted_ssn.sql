-- 0002: Add encrypted_ssn column + admin role support
-- Run in Supabase SQL Editor (Database → SQL Editor → New query → paste → Run)
-- Idempotent: safe to re-run.

------------------------------------------------------------------------
-- encrypted_ssn: persist SSN as AES-256-GCM ciphertext alongside the
-- opaque vault token. The in-memory TokenVault loses state on restart,
-- so this column is the durable way for admins to decrypt the full SSN.
------------------------------------------------------------------------
alter table public.credit_applications
  add column if not exists encrypted_ssn text;

-- Future applications will always populate this. Existing rows (if any)
-- that pre-date this migration will have NULL — they can only show last4.

------------------------------------------------------------------------
-- Admin: promote a user to admin role.
-- Replace YOUR_USER_ID with the UUID from auth.users (visible in
-- Supabase Dashboard → Authentication → Users).
--
-- Example:
--   update public.profiles set role = 'admin' where email = 'jmcneil221@gmail.com';
------------------------------------------------------------------------
-- Uncomment and run once with your email:
-- update public.profiles set role = 'admin' where email = 'jmcneil221@gmail.com';

------------------------------------------------------------------------
-- RLS: admins can read all credit applications (server helper also checks
-- role, but defense-in-depth at the DB layer is important).
------------------------------------------------------------------------
drop policy if exists "ca admin read all" on public.credit_applications;
create policy "ca admin read all" on public.credit_applications
  for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Admins can update status (approve/deny/review)
drop policy if exists "ca admin update" on public.credit_applications;
create policy "ca admin update" on public.credit_applications
  for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
