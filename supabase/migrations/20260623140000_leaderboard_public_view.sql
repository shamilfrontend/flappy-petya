-- Fast public leaderboard reads without RLS join recursion.
-- security_invoker = false runs as view owner and bypasses RLS on the join.

create or replace view public.leaderboard_entries
with (security_invoker = false) as
select
  ls.level,
  ls.user_id,
  ls.score,
  ls.updated_at,
  p.name as player_name
from public.leaderboard_scores ls
join public.players p on p.user_id = ls.user_id;

grant select on public.leaderboard_entries to anon, authenticated;
