-- Allow leaderboard queries to resolve player names under RLS.
-- Only players that already have leaderboard entries become publicly readable.

drop policy if exists players_select_for_leaderboard on public.players;

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

grant select on public.players to anon;
