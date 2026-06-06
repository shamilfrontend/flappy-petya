vi.mock('../firebase/app', () => ({
  isFirebaseEnabled: vi.fn(() => false),
  initFirebaseApp: vi.fn(),
  getFirestoreDb: vi.fn(() => null),
}));

vi.mock('../firebase/auth', () => ({
  initAuth: vi.fn(),
  waitForAuthReady: vi.fn(),
  getCurrentUid: vi.fn(() => null),
  getAuthDisplayName: vi.fn(() => ''),
  isUserAuthenticated: vi.fn(() => false),
  signInWithGoogle: vi.fn(),
  signOutUser: vi.fn(),
}));

import {
  getPersonalBest,
  getSavedPlayerName,
  getSelectedDifficulty,
  getTopRecordsByLevel,
  initStorage,
  isStorageReady,
  savePlayerName,
  saveRecord,
  saveSelectedDifficulty,
} from './index';
import {
  setCacheLeaderboard,
  setCacheProfile,
  setStorageCacheReady,
} from './cache';
import { createDefaultProfile } from './types';

describe('storage index (offline mode)', () => {
  beforeEach(async () => {
    localStorage.clear();
    setCacheProfile(createDefaultProfile());
    setStorageCacheReady(false);
    await initStorage();
  });

  it('marks storage ready after hydration', () => {
    expect(isStorageReady()).toBe(true);
  });

  it('starts with empty profile in offline mode', async () => {
    setStorageCacheReady(false);

    await initStorage();

    expect(getSavedPlayerName()).toBe('');
  });

  it('saves player name to cache', () => {
    savePlayerName('  Петя  ');

    expect(getSavedPlayerName()).toBe('Петя');
  });

  it('ignores empty player name', () => {
    savePlayerName('   ');

    expect(getSavedPlayerName()).toBe('');
  });

  it('saves and reads selected difficulty', () => {
    saveSelectedDifficulty('medium');

    expect(getSelectedDifficulty()).toBe('medium');
  });

  it('returns personal best from profile for current player', () => {
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 15);

    expect(getPersonalBest('Петя', 'easy')).toBe(15);
  });

  it('returns personal best from leaderboard cache for other players', () => {
    savePlayerName('Петя');
    setCacheLeaderboard('hard', [
      { name: 'Alice', level: 'hard', score: 42 },
    ]);

    expect(getPersonalBest('Alice', 'hard')).toBe(42);
  });

  it('shows current player records from profile cache', () => {
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 20);

    expect(getTopRecordsByLevel('easy')).toEqual([
      { name: 'Петя', level: 'easy', score: 20 },
    ]);
  });

  it('ignores invalid saveRecord input', () => {
    saveRecord('', 'easy', 10);
    saveRecord('Alice', 'easy', 0);
    saveRecord('Alice', 'easy', 10000);

    expect(getTopRecordsByLevel('easy')).toEqual([]);
  });

  it('reports no pending firebase sync in offline mode', async () => {
    const { isFirebaseSyncPending } = await import('./index');

    expect(isFirebaseSyncPending()).toBe(false);
  });

  it('does not update profile bests for other player names', () => {
    savePlayerName('Петя');
    saveRecord('Alice', 'medium', 12);

    expect(getPersonalBest('Петя', 'medium')).toBe(0);
    expect(getTopRecordsByLevel('medium')).toEqual([]);
  });

  it('syncs profile name and bests when profile name is empty', () => {
    saveRecord('Петя', 'easy', 12);

    expect(getPersonalBest('Петя', 'easy')).toBe(12);
    expect(getSavedPlayerName()).toBe('Петя');
    expect(getTopRecordsByLevel('easy')).toEqual([
      { name: 'Петя', level: 'easy', score: 12 },
    ]);
  });

  it('shows player in easy leaderboard after savePlayerName and saveRecord', () => {
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 17);

    expect(getTopRecordsByLevel('easy')).toEqual([
      { name: 'Петя', level: 'easy', score: 17 },
    ]);
  });

  it('hides player in leaderboard when profile name is empty', () => {
    setCacheProfile({
      name: '',
      bests: { easy: 5, medium: 0, hard: 0 },
    });

    expect(getTopRecordsByLevel('easy')).toEqual([]);
  });

  it('does not lower personal best when saving a worse score', () => {
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 49);
    saveRecord('Петя', 'easy', 13);

    expect(getPersonalBest('Петя', 'easy')).toBe(49);
    expect(getTopRecordsByLevel('easy')).toEqual([
      { name: 'Петя', level: 'easy', score: 49 },
    ]);
  });

  it('uses profile bests as source of truth for current player', () => {
    savePlayerName('Петя');
    setCacheProfile({
      name: 'Петя',
      bests: { easy: 49, medium: 0, hard: 0 },
    });

    expect(getPersonalBest('Петя', 'easy')).toBe(49);
    expect(getTopRecordsByLevel('easy')).toEqual([
      { name: 'Петя', level: 'easy', score: 49 },
    ]);
  });
});
