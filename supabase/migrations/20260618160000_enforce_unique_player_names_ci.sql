-- Ensure case-insensitive unique usernames in players.
-- Also resolves pre-existing duplicates before creating the unique index.

do $$
declare
  renamed_user_ids uuid[];
begin
  with duplicate_players as (
    select
      p.user_id,
      row_number() over (
        partition by lower(trim(p.name))
        order by p.updated_at desc, p.user_id
      ) as duplicate_rank
    from public.players p
  ),
  renamed_players as (
    update public.players p
    set
      name = left(trim(p.name), 17) || '-' || right(replace(p.user_id::text, '-', ''), 6),
      updated_at = now()
    from duplicate_players d
    where p.user_id = d.user_id
      and d.duplicate_rank > 1
    returning p.user_id
  )
  select coalesce(array_agg(user_id), '{}')
  into renamed_user_ids
  from renamed_players;

  if cardinality(renamed_user_ids) > 0 then
    update public.leaderboard_scores ls
    set name = p.name
    from public.players p
    where ls.user_id = p.user_id
      and ls.user_id = any(renamed_user_ids);
  end if;
end;
$$;

create unique index if not exists players_name_ci_unique_idx
  on public.players ((lower(trim(name))));
