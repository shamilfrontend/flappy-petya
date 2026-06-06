vi.mock('../firebase/app', () => ({
  isFirebaseEnabled: vi.fn(() => false),
  initFirebaseApp: vi.fn(),
  getFirestoreDb: vi.fn(() => null),
}));

vi.mock('../firebase/auth', () => ({
  ensureAnonymousAuth: vi.fn(),
  getCurrentUid: vi.fn(() => null),
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
  setCacheLocalRecords,
  setCacheProfile,
  setStorageCacheReady,
} from './cache';
import { createDefaultProfile } from './types';

describe('storage index (local mode)', () => {
  beforeEach(async () => {
    localStorage.clear();
    setCacheProfile(createDefaultProfile());
    setCacheLocalRecords([]);
    setStorageCacheReady(false);
    await initStorage();
  });

  it('marks storage ready after local hydration', () => {
    expect(isStorageReady()).toBe(true);
  });

  it('hydrates player name from localStorage on init', async () => {
    localStorage.setItem('flappy-petya-player-name', 'Петя');
    setStorageCacheReady(false);

    await initStorage();

    expect(getSavedPlayerName()).toBe('Петя');
  });

  it('saves player name to cache and localStorage', () => {
    savePlayerName('  Петя  ');

    expect(getSavedPlayerName()).toBe('Петя');
    expect(localStorage.getItem('flappy-petya-player-name')).toBe('Петя');
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

  it('returns personal best from local records for other players', () => {
    saveRecord('Alice', 'hard', 42);

    expect(getPersonalBest('Alice', 'hard')).toBe(42);
  });

  it('merges local and profile records for leaderboard', () => {
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 20);
    saveRecord('Alice', 'easy', 30);
    saveRecord('Alice', 'easy', 25);

    expect(getTopRecordsByLevel('easy')).toEqual([
      { name: 'Alice', level: 'easy', score: 30 },
      { name: 'Петя', level: 'easy', score: 20 },
    ]);
  });

  it('ignores invalid saveRecord input', () => {
    saveRecord('', 'easy', 10);
    saveRecord('Alice', 'easy', 0);

    expect(getTopRecordsByLevel('easy')).toEqual([]);
  });

  it('updates profile bests only for matching player name', () => {
    savePlayerName('Петя');
    saveRecord('Alice', 'medium', 12);

    expect(getPersonalBest('Петя', 'medium')).toBe(0);
    expect(getTopRecordsByLevel('medium')).toEqual([
      { name: 'Alice', level: 'medium', score: 12 },
    ]);
  });
});
