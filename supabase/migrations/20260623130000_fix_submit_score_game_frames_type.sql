-- Accept fractional game_frames from client (logical dt accumulator) and round server-side.

drop function if exists public.submit_leaderboard_score(text, integer, integer);

create or replace function public.submit_leaderboard_score(
  p_level text,
  p_score integer,
  p_game_frames double precision
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_session public.game_sessions%rowtype;
  v_elapsed_ms bigint;
  v_current_score integer := 0;
  v_next_score integer;
  v_game_frames integer := round(p_game_frames)::integer;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  if p_level not in ('easy', 'medium', 'hard') then
    raise exception 'invalid level';
  end if;

  if p_score < 1 or p_score > 9999 then
    raise exception 'invalid score';
  end if;

  if v_game_frames < public.fp_min_game_frames(p_score)
    or v_game_frames > public.fp_max_game_frames(p_score) then
    raise exception 'invalid game frames';
  end if;

  select *
  into v_session
  from public.game_sessions
  where user_id = v_uid
    and level = p_level
    and status = 'active'
  for update;

  if not found then
    raise exception 'no active game session';
  end if;

  v_elapsed_ms := floor(
    extract(epoch from (now() - v_session.started_at)) * 1000
  )::bigint;

  if v_elapsed_ms < public.fp_min_wall_clock_ms(p_score) then
    raise exception 'min play time not reached';
  end if;

  select coalesce(ls.score, 0)
  into v_current_score
  from public.leaderboard_scores ls
  where ls.user_id = v_uid
    and ls.level = p_level;

  v_next_score := greatest(coalesce(v_current_score, 0), p_score);

  if v_next_score < 1 then
    update public.game_sessions
    set status = 'completed'
    where id = v_session.id;

    return;
  end if;

  insert into public.leaderboard_scores (user_id, level, score, updated_at)
  values (v_uid, p_level, v_next_score, now())
  on conflict (level, user_id) do update
    set score = greatest(public.leaderboard_scores.score, excluded.score),
        updated_at = now();

  update public.game_sessions
  set status = 'completed'
  where id = v_session.id;
end;
$$;

revoke all on function public.submit_leaderboard_score(text, integer, double precision)
  from public;
grant execute on function public.submit_leaderboard_score(text, integer, double precision)
  to authenticated;
