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

interface LeaderboardEntryRow {
  user_id: string | null;
  player_name: string | null;
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

function mapLeaderboardRows(
  rows: Partial<LeaderboardEntryRow>[],
  level: DifficultyLevel,
  maxEntries: number,
): GameRecord[] {
  const records = rows
    .map((item) => {
      const playerName = (item.player_name ?? '').trim()
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
    .from('leaderboard_entries')
    .select('user_id, score, player_name')
    .eq('level', level)
    .order('score', { ascending: false })
    .limit(fetchLimit);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as unknown as Partial<LeaderboardEntryRow>[];
  return mapLeaderboardRows(rows, level, maxEntries);
}

export async function startGameSession(
  db: SupabaseClient,
  level: DifficultyLevel,
): Promise<string> {
  const { data, error } = await db.rpc('start_game_session', {
    p_level: level,
  });

  if (error) {
    throw error;
  }

  if (typeof data !== 'string' || !data) {
    throw new Error('start_game_session returned empty started_at');
  }

  return data;
}

export async function submitLeaderboardScore(
  db: SupabaseClient,
  level: DifficultyLevel,
  score: number,
  gameFrames: number,
): Promise<void> {
  if (score <= 0) {
    return;
  }

  const normalizedGameFrames = Math.round(gameFrames);

  const { error } = await db.rpc('submit_leaderboard_score', {
    p_level: level,
    p_score: score,
    p_game_frames: normalizedGameFrames,
  });

  if (error) {
    throw error;
  }
}

