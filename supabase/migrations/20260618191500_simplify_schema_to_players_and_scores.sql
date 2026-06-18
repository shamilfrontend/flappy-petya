-- Simplify schema to two core tables:
-- 1) players(user_id, name)
-- 2) leaderboard_scores(user_id, level, score)

drop policy if exists game_sessions_select_own on public.game_sessions;
drop policy if exists game_sessions_insert_own on public.game_sessions;
drop policy if exists game_sessions_update_own on public.game_sessions;

drop policy if exists leaderboard_scores_insert_own on public.leaderboard_scores;
drop policy if exists leaderboard_scores_update_own on public.leaderboard_scores;

drop function if exists public.fp_min_game_frames(integer);
drop function if exists public.fp_max_game_frames(integer);
drop function if exists public.fp_min_wall_clock_ms(integer);
drop function if exists public.fp_has_active_session_for_level(uuid, text);
drop function if exists public.fp_has_min_play_time(uuid, integer);
drop function if exists public.fp_is_best_score_update(text, uuid, integer);

drop table if exists public.game_sessions;

alter table public.players
  drop column if exists bests,
  drop column if exists selected_difficulty,
  drop column if exists selected_records_level;

alter table public.leaderboard_scores
  drop constraint if exists leaderboard_scores_user_id_fkey,
  add constraint leaderboard_scores_user_id_fkey
    foreign key (user_id) references public.players (user_id) on delete cascade;

alter table public.leaderboard_scores
  drop column if exists name,
  drop column if exists game_frames;

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

grant select, insert, update on public.players to authenticated;
grant select, insert, update on public.leaderboard_scores to authenticated;
