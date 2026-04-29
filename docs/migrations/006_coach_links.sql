-- Run in Supabase SQL Editor
-- https://supabase.com/dashboard/project/lvxckqqmnnwzugzbolvf/sql

-- Add links column to coach_profiles
-- Each link: { label: string, url: string }
alter table public.coach_profiles
  add column if not exists links jsonb not null default '[]';
