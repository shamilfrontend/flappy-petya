-- Flappy Petya: minimal schema (players + leaderboard).

create table if not exists public.players (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 24),
  updated_at timestamptz not null default now()
);

create unique index if not exists players_name_ci_unique_idx
  on public.players ((lower(trim(name))));

create table if not exists public.leaderboard_scores (
  level text not null check (level in ('easy', 'medium', 'hard')),
  user_id uuid not null references public.players (user_id) on delete cascade,
  score integer not null check (score between 1 and 9999),
  updated_at timestamptz not null default now(),
  primary key (level, user_id)
);

create index if not exists leaderboard_scores_level_score_idx
  on public.leaderboard_scores (level, score desc);

create index if not exists leaderboard_scores_user_id_idx
  on public.leaderboard_scores (user_id);

alter table public.players enable row level security;
alter table public.leaderboard_scores enable row level security;

create policy players_select_own
on public.players
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy players_select_for_leaderboard
on public.players
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.leaderboard_scores ls
    where ls.user_id = players.user_id
  )
);

create policy players_insert_own
on public.players
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy players_update_own
on public.players
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy leaderboard_scores_select_public
on public.leaderboard_scores
for select
to anon, authenticated
using (true);

create policy leaderboard_scores_insert_own
on public.leaderboard_scores
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and score between 1 and 9999
);

create policy leaderboard_scores_update_own
on public.leaderboard_scores
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and score between 1 and 9999
);

grant usage on schema public to anon, authenticated;
grant select on public.leaderboard_scores to anon;
grant select on public.players to anon;
grant select, insert, update on public.players to authenticated;
grant select, insert, update on public.leaderboard_scores to authenticated;
