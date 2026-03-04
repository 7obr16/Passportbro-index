-- profiles table
-- One row per auth.users entry. Tracks payment status.
-- Run this once in the Supabase SQL editor.

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  has_paid    boolean not null default false,
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- Automatically create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security: users can only read their own profile.
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Service-role key bypasses RLS, so the webhook can always write.
