import type { SupabaseClient } from '@supabase/supabase-js';
import type { DifficultyLevel } from '../../game/difficulty';
import {
  createEmptyBests,
  deduplicateLeaderboardByName,
  TOP_RECORDS_PER_LEVEL,
  type GameRecord,
} from './types';

const LEADERBOARD_FETCH_BUFFER = 5;

export async function fetchPlayerLeaderboardScore(
  db: SupabaseClient,
  uid: string,
  level: DifficultyLevel,
): Promise<number> {
  const { data, error } = await db
    .from('leaderboard_scores')
    .select('score')
    .eq('user_id', uid)
    .eq('level', level)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return 0;
  }

  const score = Number(data.score);

  return Number.isFinite(score) && score > 0 ? score : 0;
}

export async function fetchPlayerLeaderboardScores(
  db: SupabaseClient,
  uid: string,
): Promise<Record<DifficultyLevel, number>> {
  const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  const bests = createEmptyBests();

  await Promise.all(
    levels.map(async (level) => {
      bests[level] = await fetchPlayerLeaderboardScore(db, uid, level);
    }),
  );

  return bests;
}

interface LeaderboardScoreRow {
  user_id: string | null;
  players?:
    | {
      name: string | null;
    }
    | Array<{
      name: string | null;
    }>
    | null;
  score: number | null;
}

function fallbackPlayerName(userId: string | null | undefined): string {
  if (!userId) {
    return '';
  }

  const trimmedUserId = userId.trim();
  if (!trimmedUserId) {
    return '';
  }

  return `Игрок ${trimmedUserId.slice(0, 8)}`;
}

function resolvePlayerName(players: LeaderboardScoreRow['players']): string {
  if (!players) {
    return '';
  }

  if (Array.isArray(players)) {
    const firstPlayer = players[0];
    return (firstPlayer?.name ?? '').trim();
  }

  return (players.name ?? '').trim();
}

function mapLeaderboardRows(
  rows: Partial<LeaderboardScoreRow>[],
  level: DifficultyLevel,
  maxEntries: number,
): GameRecord[] {
  const records = rows
    .map((item) => {
      const playerName = resolvePlayerName(item.players)
        || fallbackPlayerName(item.user_id);
      const normalizedScore = Number(item.score);
      if (!playerName || !Number.isFinite(normalizedScore)) {
        return null;
      }

      return {
        name: playerName,
        level,
        score: normalizedScore,
      };
    })
    .filter((record): record is GameRecord => Boolean(record?.name));

  return deduplicateLeaderboardByName(records, maxEntries);
}

export async function fetchLeaderboard(
  db: SupabaseClient,
  level: DifficultyLevel,
  maxEntries = TOP_RECORDS_PER_LEVEL,
): Promise<GameRecord[]> {
  const fetchLimit = Math.max(maxEntries * LEADERBOARD_FETCH_BUFFER, maxEntries);

  const { data, error } = await db
    .from('leaderboard_scores')
    .select('user_id, score, players(name)')
    .eq('level', level)
    .order('score', { ascending: false })
    .limit(fetchLimit);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as Partial<LeaderboardScoreRow>[];
  return mapLeaderboardRows(rows, level, maxEntries);
}

export async function upsertLeaderboardEntry(
  db: SupabaseClient,
  uid: string,
  level: DifficultyLevel,
  score: number,
): Promise<void> {
  if (score <= 0) {
    return;
  }

  const { data: currentData, error: readError } = await db
    .from('leaderboard_scores')
    .select('score')
    .eq('user_id', uid)
    .eq('level', level)
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  const currentScore = currentData?.score ? Number(currentData.score) : 0;
  const nextScore = Math.max(currentScore, score);
  if (nextScore <= 0) {
    return;
  }

  const { error: upsertError } = await db
    .from('leaderboard_scores')
    .upsert({
      user_id: uid,
      level,
      score: nextScore,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'level,user_id' });

  if (upsertError) {
    throw upsertError;
  }
}

