import type { DifficultyLevel } from '../../game/difficulty';
import {
  createDefaultProfile,
  type GameRecord,
  type PlayerProfile,
} from './types';

interface StorageCache {
  profile: PlayerProfile;
  leaderboards: Partial<Record<DifficultyLevel, GameRecord[]>>;
  isReady: boolean;
  isLeaderboardLoading: boolean;
}

const cache: StorageCache = {
  profile: createDefaultProfile(),
  leaderboards: {},
  isReady: false,
  isLeaderboardLoading: false,
};

export function getCacheProfile(): PlayerProfile {
  return cache.profile;
}

export function setCacheProfile(profile: PlayerProfile): void {
  cache.profile = profile;
}

export function getCacheLeaderboard(level: DifficultyLevel): GameRecord[] | undefined {
  return cache.leaderboards[level];
}

export function setCacheLeaderboard(
  level: DifficultyLevel,
  records: GameRecord[],
): void {
  cache.leaderboards[level] = records;
}

export function isStorageCacheReady(): boolean {
  return cache.isReady;
}

export function setStorageCacheReady(value: boolean): void {
  cache.isReady = value;
}

export function isLeaderboardCacheLoading(): boolean {
  return cache.isLeaderboardLoading;
}

export function setLeaderboardCacheLoading(value: boolean): void {
  cache.isLeaderboardLoading = value;
}

export function clearLeaderboardCache(): void {
  cache.leaderboards = {};
}
