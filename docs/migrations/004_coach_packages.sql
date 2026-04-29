-- Run in Supabase SQL Editor
-- https://supabase.com/dashboard/project/lvxckqqmnnwzugzbolvf/sql

-- Add packages column to coach_profiles
-- Each package: { id, name, description, price, billing_cadence, includes[] }
alter table public.coach_profiles
  add column if not exists packages jsonb not null default '[]';
