-- Game sessions + server-side score validation via RPC.
-- Direct INSERT/UPDATE on leaderboard_scores is revoked for clients.

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.players (user_id) on delete cascade,
  level text not null check (level in ('easy', 'medium', 'hard')),
  started_at timestamptz not null default now(),
  status text not null default 'active'
    check (status in ('active', 'completed', 'expired')),
  unique (user_id, level)
);

create index if not exists game_sessions_user_level_status_idx
  on public.game_sessions (user_id, level, status);

alter table public.game_sessions enable row level security;

create or replace function public.fp_min_game_frames(p_score integer)
returns integer
language sql
immutable
as $$
  select case
    when p_score <= 0 then 0
    when p_score = 1 then 250
    else 250 + (p_score - 1) * 120
  end;
$$;

create or replace function public.fp_max_game_frames(p_score integer)
returns integer
language sql
immutable
as $$
  select case
    when p_score <= 0 then 0
    else 250 + p_score * 400
  end;
$$;

create or replace function public.fp_min_wall_clock_ms(p_score integer)
returns integer
language sql
immutable
as $$
  select case
    when p_score <= 0 then 0
    when p_score = 1 then 4000
    else 4000 + (p_score - 1) * 1800
  end;
$$;

create or replace function public.start_game_session(p_level text)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_started_at timestamptz := now();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  if p_level not in ('easy', 'medium', 'hard') then
    raise exception 'invalid level';
  end if;

  if not exists (
    select 1
    from public.players
    where user_id = v_uid
  ) then
    raise exception 'player profile required';
  end if;

  insert into public.game_sessions (user_id, level, started_at, status)
  values (v_uid, p_level, v_started_at, 'active')
  on conflict (user_id, level) do update
    set started_at = excluded.started_at,
        status = 'active';

  return v_started_at;
end;
$$;

create or replace function public.submit_leaderboard_score(
  p_level text,
  p_score integer,
  p_game_frames integer
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

  if p_game_frames < public.fp_min_game_frames(p_score)
    or p_game_frames > public.fp_max_game_frames(p_score) then
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

create policy game_sessions_select_own
on public.game_sessions
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists leaderboard_scores_insert_own on public.leaderboard_scores;
drop policy if exists leaderboard_scores_update_own on public.leaderboard_scores;

revoke insert, update on public.leaderboard_scores from authenticated;

grant execute on function public.start_game_session(text) to authenticated;
grant execute on function public.submit_leaderboard_score(text, integer, integer)
  to authenticated;
