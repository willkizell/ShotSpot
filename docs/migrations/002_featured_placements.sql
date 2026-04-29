-- Run in Supabase SQL Editor when ready to monetize featured placements
-- https://supabase.com/dashboard/project/lvxckqqmnnwzugzbolvf/sql

create table public.featured_placements (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references public.users(id) on delete cascade not null,
  slot_type text not null default 'homepage_hero', -- 'homepage_hero' | 'event_top' | 'sidebar'
  event_context text, -- null = all events, 'shot_put' | 'discus' etc. for event-specific slots
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  stripe_subscription_id text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.featured_placements enable row level security;

-- Coaches can see their own placements
create policy "featured_placements: select own"
  on public.featured_placements for select
  using (auth.uid() = coach_id);

-- Public can see active placements (for marketplace display)
create policy "featured_placements: select active"
  on public.featured_placements for select
  using (active = true and ends_at > now());
