import {
  getCacheLeaderboard,
  getCacheLocalRecords,
  getCacheProfile,
  isLeaderboardCacheLoading,
  isStorageCacheReady,
  setCacheLeaderboard,
  setCacheLocalRecords,
  setCacheProfile,
  setLeaderboardCacheLoading,
  setStorageCacheReady,
} from './cache';
import { createDefaultProfile } from './types';

describe('storage cache', () => {
  beforeEach(() => {
    setCacheProfile(createDefaultProfile());
    setCacheLocalRecords([]);
    setStorageCacheReady(false);
    setLeaderboardCacheLoading(false);
    setCacheLeaderboard('easy', []);
    setCacheLeaderboard('medium', []);
    setCacheLeaderboard('hard', []);
  });

  it('stores and returns player profile', () => {
    const profile = createDefaultProfile('Alice');

    setCacheProfile(profile);

    expect(getCacheProfile()).toEqual(profile);
  });

  it('stores and returns local records', () => {
    const records = [{ name: 'Alice', level: 'easy' as const, score: 10 }];

    setCacheLocalRecords(records);

    expect(getCacheLocalRecords()).toEqual(records);
  });

  it('stores and returns leaderboard by level', () => {
    const records = [{ name: 'Bob', level: 'hard' as const, score: 20 }];

    setCacheLeaderboard('hard', records);

    expect(getCacheLeaderboard('hard')).toEqual(records);
    expect(getCacheLeaderboard('easy')).toEqual([]);
  });

  it('tracks storage readiness flag', () => {
    expect(isStorageCacheReady()).toBe(false);

    setStorageCacheReady(true);

    expect(isStorageCacheReady()).toBe(true);
  });

  it('tracks leaderboard loading flag', () => {
    expect(isLeaderboardCacheLoading()).toBe(false);

    setLeaderboardCacheLoading(true);

    expect(isLeaderboardCacheLoading()).toBe(true);
  });
});
