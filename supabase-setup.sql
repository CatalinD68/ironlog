-- ═══════════════════════════════════════════════
-- IRONLOG — Supabase Database Setup
-- Run this in your Supabase SQL Editor (one time)
-- ═══════════════════════════════════════════════

-- 1. WORKOUTS TABLE
create table public.workouts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  data jsonb not null default '{}',
  created_at timestamptz default now()
);

-- 2. NOTES TABLE
create table public.notes (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null unique,
  text text not null default '',
  created_at timestamptz default now()
);

-- Add unique constraint so one note per user per date
alter table public.notes drop constraint if exists notes_date_key;
alter table public.notes add constraint notes_user_date_unique unique (user_id, date);

-- 3. ENABLE ROW LEVEL SECURITY
alter table public.workouts enable row level security;
alter table public.notes enable row level security;

-- 4. RLS POLICIES — users can only see/edit their own data

-- Workouts: SELECT
create policy "Users can read own workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

-- Workouts: INSERT
create policy "Users can insert own workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

-- Workouts: DELETE
create policy "Users can delete own workouts"
  on public.workouts for delete
  using (auth.uid() = user_id);

-- Notes: SELECT
create policy "Users can read own notes"
  on public.notes for select
  using (auth.uid() = user_id);

-- Notes: INSERT
create policy "Users can insert own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

-- Notes: UPDATE
create policy "Users can update own notes"
  on public.notes for update
  using (auth.uid() = user_id);

-- Notes: DELETE
create policy "Users can delete own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- 5. INDEXES for fast queries
create index idx_workouts_user_date on public.workouts (user_id, date);
create index idx_notes_user_date on public.notes (user_id, date);
