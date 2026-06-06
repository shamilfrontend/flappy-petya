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
