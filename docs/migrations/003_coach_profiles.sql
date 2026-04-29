-- Run in Supabase SQL Editor
-- https://supabase.com/dashboard/project/lvxckqqmnnwzugzbolvf/sql

-- ─── Coach profiles ───────────────────────────────────────────────────────────
create table public.coach_profiles (
  id uuid primary key references public.users(id) on delete cascade,

  -- Identity
  full_name        text not null,
  slug             text unique,          -- used for /coaches/[slug] once we migrate from UUID
  avatar_url       text,
  banner_url       text,

  -- Bio
  short_bio        text,                 -- ~150 chars, shown on marketplace cards
  full_bio         text,                 -- shown on profile page

  organization     text,

  -- Location
  location         text,
  remote           boolean not null default true,

  -- Coaching details
  events           text[]  not null default '{}',  -- 'shot_put'|'discus'|'hammer'|'javelin'
  years_coaching   integer not null default 0,

  -- Coaching history — array of {role, organization, start_year, end_year, description}
  coaching_history jsonb   not null default '[]',

  -- Proof / credibility tags
  proof_tags       text[]  not null default '{}',
  has_elite_athletes boolean not null default false,

  -- Marketplace settings
  intake_mode      text    not null default 'application_required'
                   check (intake_mode in ('instant_join','application_required')),
  availability     text    not null default 'open'
                   check (availability in ('open','limited','waitlist','closed')),
  athlete_count    integer not null default 0,
  athlete_capacity integer not null default 20,

  -- Pricing (base — full packages added in Phase 6)
  starting_price   integer,              -- USD whole dollars
  billing_cadence  text    check (billing_cadence in ('monthly','weekly','one_time')),

  -- Response
  response_time    text,                 -- '24hr' | '48hr' | '72hr'

  -- Admin approval
  status           text    not null default 'pending'
                   check (status in ('pending','approved','rejected','suspended')),
  reviewed_by      uuid    references public.users(id),
  reviewed_at      timestamptz,
  rejection_reason text,

  -- Timestamps
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger coach_profiles_updated_at
  before update on public.coach_profiles
  for each row execute function public.set_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table public.coach_profiles enable row level security;

-- Anyone can read approved profiles
create policy "coach_profiles: public read approved"
  on public.coach_profiles for select
  using (status = 'approved');

-- Coaches can read their own profile regardless of status
create policy "coach_profiles: own read"
  on public.coach_profiles for select
  using (auth.uid() = id);

-- Coaches can insert their own profile
create policy "coach_profiles: own insert"
  on public.coach_profiles for insert
  with check (auth.uid() = id);

-- Coaches can update their own profile (status stays as-is — only admin changes it)
create policy "coach_profiles: own update"
  on public.coach_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and status = (select status from public.coach_profiles where id = auth.uid()));

-- Admins can do everything
create policy "coach_profiles: admin all"
  on public.coach_profiles for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- ─── Storage buckets ─────────────────────────────────────────────────────────
-- Run these separately in the Supabase Storage UI or via API:
--
-- 1. Create bucket "coach-avatars"  (public: true)
-- 2. Create bucket "coach-banners"  (public: true)
--
-- Or via SQL (requires pg_storage extension):
-- select storage.create_bucket('coach-avatars', '{"public": true}');
-- select storage.create_bucket('coach-banners', '{"public": true}');
