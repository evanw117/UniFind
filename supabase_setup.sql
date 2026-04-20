-- UniFind baseline schema with reward support
-- Run this in your Supabase SQL Editor

create table if not exists public.users (
    id uuid primary key references auth.users(id) on delete cascade,
    points int not null default 0,
    created_at timestamp with time zone default now()
);

create table if not exists public.lost_and_found_items (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default now(),
    campus_slug text not null,
    title text not null,
    description text not null,
    category text not null,
    location text not null,
    date_reported date not null,
    status boolean not null, -- true = lost, false = found
    image_url text,
    contact_name text,
    contact_email text,
    reporter_user_id uuid references auth.users(id) on delete set null,
    item_value_tier text,
    estimated_points int,
    classification_reason text,
    returned_at timestamp with time zone,
    returned_by_user_id uuid references auth.users(id) on delete set null,
    return_points_awarded int default 0,
    owner_claim_user_id uuid references auth.users(id) on delete set null,
    owner_confirmed_at timestamp with time zone,
    reward_review_status text default 'not_started',
    reward_review_reason text
);

alter table public.lost_and_found_items
    add column if not exists reporter_user_id uuid references auth.users(id) on delete set null,
    add column if not exists item_value_tier text,
    add column if not exists estimated_points int,
    add column if not exists classification_reason text,
    add column if not exists returned_at timestamp with time zone,
    add column if not exists returned_by_user_id uuid references auth.users(id) on delete set null,
    add column if not exists return_points_awarded int default 0,
    add column if not exists owner_claim_user_id uuid references auth.users(id) on delete set null,
    add column if not exists owner_confirmed_at timestamp with time zone,
    add column if not exists reward_review_status text default 'not_started',
    add column if not exists reward_review_reason text;

alter table public.users
    add column if not exists points int not null default 0;

create index if not exists idx_lost_and_found_campus_slug on public.lost_and_found_items(campus_slug);
create index if not exists idx_lost_and_found_date_reported on public.lost_and_found_items(date_reported desc);
create index if not exists idx_lost_and_found_reporter_user_id on public.lost_and_found_items(reporter_user_id);

alter table public.users enable row level security;
alter table public.lost_and_found_items enable row level security;

drop policy if exists "Enable read access for all users" on public.lost_and_found_items;
drop policy if exists "Enable insert for all users" on public.lost_and_found_items;
drop policy if exists "Enable reporter update" on public.lost_and_found_items;
drop policy if exists "Enable reporter delete" on public.lost_and_found_items;
drop policy if exists "Enable users self read" on public.users;
drop policy if exists "Enable users self insert" on public.users;
drop policy if exists "Enable users self update" on public.users;

create policy "Enable read access for all users"
on public.lost_and_found_items for select
using (true);

create policy "Enable insert for all users"
on public.lost_and_found_items for insert
with check (true);

create policy "Enable reporter update"
on public.lost_and_found_items for update
using (auth.uid() = reporter_user_id)
with check (auth.uid() = reporter_user_id);

create policy "Enable reporter delete"
on public.lost_and_found_items for delete
using (auth.uid() = reporter_user_id);

create policy "Enable users self read"
on public.users for select
using (auth.uid() = id);

create policy "Enable users self insert"
on public.users for insert
with check (auth.uid() = id);

create policy "Enable users self update"
on public.users for update
using (auth.uid() = id)
with check (auth.uid() = id);
