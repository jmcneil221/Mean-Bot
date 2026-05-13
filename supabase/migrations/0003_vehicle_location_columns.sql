-- Migration 0003: Add location columns to vehicles table
-- Enables granular filtering by dealer name, city, and state
-- without relying on free-text description field.

alter table public.vehicles
  add column if not exists dealer_name text,
  add column if not exists city text,
  add column if not exists state text default 'CT';

-- Index for location-based queries
create index if not exists vehicles_state_city_idx on public.vehicles(state, city);
create index if not exists vehicles_dealer_name_idx on public.vehicles(dealer_name);

-- Backfill existing seed rows from known VINs
update public.vehicles set dealer_name = 'Fairfield County Toyota', city = 'Stamford',   state = 'CT' where vin = '4T1G11AK8NU000123';
update public.vehicles set dealer_name = 'North Haven Motors',       city = 'North Haven', state = 'CT' where vin = '2HKRW2H55MH600456';
update public.vehicles set dealer_name = 'Rocky Hill Auto Group',    city = 'Rocky Hill',  state = 'CT' where vin = '1FTFW1E81NFA00789';
update public.vehicles set dealer_name = 'Hartford Chevrolet',       city = 'Hartford',    state = 'CT' where vin = '2GNAXUEV7L6200321';
update public.vehicles set dealer_name = 'Milford Hyundai',          city = 'Milford',     state = 'CT' where vin = '5NMJB3AE6NH100654';
update public.vehicles set dealer_name = 'Stamford Motorcar Collection', city = 'Stamford', state = 'CT' where vin = '1N4BL4BV5MN300987';
