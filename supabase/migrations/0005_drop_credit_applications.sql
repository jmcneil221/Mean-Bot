-- Migration: 0005_drop_credit_applications.sql
-- Architectural pivot: CarBuyingHub becomes a pass-through routing engine.
-- Zero PII retention. Credit applications are emailed directly to dealers
-- and never persisted in our database.
-- ─────────────────────────────────────────────

begin;

-- ══════════════════════════════════════════════
-- 1. Drop RLS policies that reference credit_applications
-- ══════════════════════════════════════════════

-- From 0004: dealer can read applications tied to their vehicles
drop policy if exists "ca_dealer_read" on public.credit_applications;

-- From 0004: dealer can read profiles of applicants
drop policy if exists "profiles_dealer_read_applicants" on public.profiles;

-- From 0001/0002: original credit_applications policies
drop policy if exists "ca read own"       on public.credit_applications;
drop policy if exists "ca insert own"     on public.credit_applications;
drop policy if exists "ca admin read all" on public.credit_applications;
drop policy if exists "ca admin update"   on public.credit_applications;


-- ══════════════════════════════════════════════
-- 2. Drop indexes
-- ══════════════════════════════════════════════

drop index if exists public.credit_applications_user_idx;
drop index if exists public.credit_applications_status_idx;
drop index if exists public.credit_applications_submitted_idx;
drop index if exists public.ca_vehicle_idx;


-- ══════════════════════════════════════════════
-- 3. Drop the table (CASCADE handles any remaining FK refs)
-- ══════════════════════════════════════════════

drop table if exists public.credit_applications cascade;

commit;
