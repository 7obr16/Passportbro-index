-- ============================================================
--  Community Ratings Setup
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── 1. Add community average columns to Countries ───────────
alter table "Countries"
  add column if not exists community_dating_avg      numeric default null,
  add column if not exists community_safety_avg      numeric default null,
  add column if not exists community_friendliness_avg numeric default null,
  add column if not exists community_cost_avg        numeric default null,
  add column if not exists community_rating_count    integer default 0;

-- ─── 2. Create country_ratings table ─────────────────────────
create table if not exists country_ratings (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  country_slug        text not null references "Countries"(slug) on delete cascade,
  dating_rating       integer not null check (dating_rating between 0 and 10),
  safety_rating       integer not null check (safety_rating between 0 and 10),
  friendliness_rating integer not null check (friendliness_rating between 0 and 10),
  cost_rating         integer not null check (cost_rating between 1 and 5),
  comment             text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, country_slug)
);

-- ─── 3. Auto-update updated_at on change ─────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists country_ratings_updated_at on country_ratings;
create trigger country_ratings_updated_at
  before update on country_ratings
  for each row execute function set_updated_at();

-- ─── 4. Function: recalculate averages in Countries ──────────
create or replace function recalculate_country_averages()
returns trigger language plpgsql security definer as $$
declare
  target_slug text;
begin
  -- Determine which country slug changed
  if tg_op = 'DELETE' then
    target_slug := old.country_slug;
  else
    target_slug := new.country_slug;
  end if;

  update "Countries"
  set
    community_dating_avg       = (select avg(dating_rating)       from country_ratings where country_slug = target_slug),
    community_safety_avg       = (select avg(safety_rating)       from country_ratings where country_slug = target_slug),
    community_friendliness_avg = (select avg(friendliness_rating) from country_ratings where country_slug = target_slug),
    community_cost_avg         = (select avg(cost_rating)         from country_ratings where country_slug = target_slug),
    community_rating_count     = (select count(*)                 from country_ratings where country_slug = target_slug)
  where slug = target_slug;

  return null;
end;
$$;

drop trigger if exists after_rating_change on country_ratings;
create trigger after_rating_change
  after insert or update or delete on country_ratings
  for each row execute function recalculate_country_averages();

-- ─── 5. Row Level Security ────────────────────────────────────
alter table country_ratings enable row level security;

-- Anyone can read ratings
drop policy if exists "Public read ratings" on country_ratings;
create policy "Public read ratings"
  on country_ratings for select
  using (true);

-- Authenticated users can insert their own ratings
drop policy if exists "Users insert own ratings" on country_ratings;
create policy "Users insert own ratings"
  on country_ratings for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Authenticated users can update their own ratings
drop policy if exists "Users update own ratings" on country_ratings;
create policy "Users update own ratings"
  on country_ratings for update
  to authenticated
  using (auth.uid() = user_id);

-- Authenticated users can delete their own ratings
drop policy if exists "Users delete own ratings" on country_ratings;
create policy "Users delete own ratings"
  on country_ratings for delete
  to authenticated
  using (auth.uid() = user_id);
