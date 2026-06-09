import type { DifficultyLevel } from '../../game/difficulty';

export interface GameRecord {
  name: string;
  level: DifficultyLevel;
  score: number;
}

export interface PlayerProfile {
  name: string;
  bests: Record<DifficultyLevel, number>;
  selectedDifficulty?: DifficultyLevel;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
}

export const TOP_RECORDS_PER_LEVEL = 10;
export const MAX_VALID_SCORE = 9999;
export const MAX_PLAYER_NAME_LENGTH = 30;

export function deduplicateLeaderboardByName(
  records: GameRecord[],
  maxEntries = TOP_RECORDS_PER_LEVEL,
): GameRecord[] {
  const byName = new Map<string, GameRecord>();

  for (const record of records) {
    const trimmedName = record.name.trim();
    if (!trimmedName) {
      continue;
    }

    const normalized: GameRecord = {
      name: trimmedName,
      level: record.level,
      score: record.score,
    };
    const existing = byName.get(trimmedName);

    if (!existing || normalized.score > existing.score) {
      byName.set(trimmedName, normalized);
    }
  }

  return [...byName.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxEntries);
}

export function createEmptyBests(): Record<DifficultyLevel, number> {
  return {
    easy: 0,
    medium: 0,
    hard: 0,
  };
}

export function createDefaultProfile(name = ''): PlayerProfile {
  return {
    name,
    bests: createEmptyBests(),
  };
}
