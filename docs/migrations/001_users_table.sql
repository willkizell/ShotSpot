-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/lvxckqqmnnwzugzbolvf/sql

-- Create role enum
create type public.user_role as enum ('athlete', 'coach', 'admin');

-- Create users table extending auth.users
create table public.users (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role public.user_role not null,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Users can read their own record
create policy "users: select own"
  on public.users for select
  using (auth.uid() = id);

-- Users can update their own record
create policy "users: update own"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Only the trigger (service role) can insert
create policy "users: insert own"
  on public.users for insert
  with check (auth.uid() = id);

-- Auto-create user record on signup via trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    (new.raw_user_meta_data->>'role')::public.user_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
