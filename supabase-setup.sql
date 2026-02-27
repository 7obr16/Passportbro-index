-- ⚠️  Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Drops old Cities table, creates new Countries table for the Passport Bro Index.

drop table if exists "Cities";
drop table if exists "Countries";

create table "Countries" (
  id                bigint generated always as identity primary key,
  slug              text unique not null,
  name              text not null,
  region            text not null,
  dating_ease       text not null,
  dating_ease_score integer not null,
  reddit_pros       text not null default '',
  reddit_cons       text not null default '',
  avg_height_male   text not null default '',
  avg_height_female text not null default '',
  gdp_per_capita    text not null default '',
  majority_religion text not null default '',
  image_url         text not null default '',
  flag_emoji        text not null default ''
);

alter table "Countries" enable row level security;

create policy "Public read"   on "Countries" for select using (true);
create policy "Public insert" on "Countries" for insert with check (true);
create policy "Public update" on "Countries" for update using (true);
