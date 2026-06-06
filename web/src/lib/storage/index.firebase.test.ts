const firebaseMocks = vi.hoisted(() => ({
  isFirebaseEnabled: vi.fn(() => true),
  initFirebaseApp: vi.fn(),
  getFirestoreDb: vi.fn(() => ({ id: 'db' })),
}));

const authMocks = vi.hoisted(() => ({
  ensureAnonymousAuth: vi.fn(() => Promise.resolve('uid-1')),
  getCurrentUid: vi.fn(() => 'uid-1'),
}));

const playerStoreMocks = vi.hoisted(() => ({
  fetchPlayerProfile: vi.fn(),
  savePlayerProfile: vi.fn(() => Promise.resolve()),
  updatePlayerName: vi.fn(),
  updatePlayerBest: vi.fn(),
}));

const recordsStoreMocks = vi.hoisted(() => ({
  fetchLeaderboard: vi.fn<
    (_db: unknown, _level: string) => Promise<Array<{ name: string; level: string; score: number }>>
  >(async () => []),
  updateLeaderboardName: vi.fn(() => Promise.resolve()),
  upsertLeaderboardEntry: vi.fn(() => Promise.resolve()),
}));

const migrateMocks = vi.hoisted(() => ({
  migrateLocalDataToFirestore: vi.fn(),
}));

vi.mock('../firebase/app', () => firebaseMocks);
vi.mock('../firebase/auth', () => authMocks);
vi.mock('./player-store', () => playerStoreMocks);
vi.mock('./records-store', () => recordsStoreMocks);
vi.mock('./migrate', () => migrateMocks);

import {
  setCacheLocalRecords,
  setCacheProfile,
  setLeaderboardCacheLoading,
  setStorageCacheReady,
} from './cache';
import { createDefaultProfile, type GameRecord } from './types';

async function loadStorageModule() {
  return import('./index');
}

function resetStorageCache(): void {
  setCacheProfile(createDefaultProfile());
  setCacheLocalRecords([]);
  setStorageCacheReady(false);
  setLeaderboardCacheLoading(false);
}

describe('storage index (firebase mode)', () => {
  const db = { id: 'db' } as never;

  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    resetStorageCache();
    vi.clearAllMocks();
    firebaseMocks.isFirebaseEnabled.mockReturnValue(true);
    firebaseMocks.getFirestoreDb.mockReturnValue(db);
    authMocks.ensureAnonymousAuth.mockResolvedValue('uid-1');
    authMocks.getCurrentUid.mockReturnValue('uid-1');
    playerStoreMocks.fetchPlayerProfile.mockResolvedValue(null);
    playerStoreMocks.updatePlayerName.mockImplementation(
      async (_db, _uid, name: string) => createDefaultProfile(name),
    );
    playerStoreMocks.updatePlayerBest.mockImplementation(
      async (_db, _uid, level, score, profile) => ({
        ...profile,
        bests: {
          ...profile.bests,
          [level]: Math.max(profile.bests[level], score),
        },
      }),
    );
    recordsStoreMocks.fetchLeaderboard.mockResolvedValue([
      { name: 'Alice', level: 'easy', score: 10 },
    ] as GameRecord[]);
    migrateMocks.migrateLocalDataToFirestore.mockResolvedValue(
      createDefaultProfile('Петя'),
    );
  });

  it('marks storage ready after firebase initialization', async () => {
    const { initStorage, isStorageReady } = await loadStorageModule();

    await initStorage();

    expect(isStorageReady()).toBe(true);
    expect(firebaseMocks.initFirebaseApp).toHaveBeenCalled();
    expect(authMocks.ensureAnonymousAuth).toHaveBeenCalled();
  });

  it('migrates local data when profile has no name', async () => {
    const { initStorage } = await loadStorageModule();

    await initStorage();

    expect(migrateMocks.migrateLocalDataToFirestore).toHaveBeenCalledWith(
      db,
      'uid-1',
    );
  });

  it('syncs existing profile bests to leaderboard', async () => {
    playerStoreMocks.fetchPlayerProfile.mockResolvedValue({
      name: 'Петя',
      bests: { easy: 5, medium: 0, hard: 3 },
    });
    const { initStorage } = await loadStorageModule();

    await initStorage();

    expect(migrateMocks.migrateLocalDataToFirestore).not.toHaveBeenCalled();
    expect(recordsStoreMocks.upsertLeaderboardEntry).toHaveBeenCalledTimes(3);
  });

  it('loads leaderboards for all difficulty levels on init', async () => {
    const { initStorage, getTopRecordsByLevel } = await loadStorageModule();

    await initStorage();

    expect(recordsStoreMocks.fetchLeaderboard).toHaveBeenCalledTimes(3);
    expect(getTopRecordsByLevel('easy')).toEqual([
      { name: 'Alice', level: 'easy', score: 10 },
    ]);
  });

  it('enqueues firebase tasks when saving player name', async () => {
    const { initStorage, savePlayerName, getSavedPlayerName } = await loadStorageModule();

    await initStorage();
    savePlayerName('Новый');

    await vi.waitFor(() => {
      expect(playerStoreMocks.updatePlayerName).toHaveBeenCalled();
    });

    expect(getSavedPlayerName()).toBe('Новый');
    expect(recordsStoreMocks.updateLeaderboardName).toHaveBeenCalledWith(
      db,
      'uid-1',
      'Новый',
    );
  });

  it('enqueues firebase tasks when saving records', async () => {
    const { initStorage, savePlayerName, saveRecord } = await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    saveRecord('Петя', 'medium', 15);

    await vi.waitFor(() => {
      expect(recordsStoreMocks.upsertLeaderboardEntry).toHaveBeenCalledWith(
        db,
        'uid-1',
        'medium',
        'Петя',
        15,
      );
    });

    expect(playerStoreMocks.updatePlayerBest).toHaveBeenCalledWith(
      db,
      'uid-1',
      'medium',
      15,
      expect.objectContaining({ name: 'Петя' }),
    );
    expect(recordsStoreMocks.fetchLeaderboard).toHaveBeenCalledWith(db, 'medium');
  });

  it('refreshes leaderboard for selected level', async () => {
    const { initStorage, refreshLeaderboard, getTopRecordsByLevel, isLeaderboardLoading } =
      await loadStorageModule();

    await initStorage();
    recordsStoreMocks.fetchLeaderboard.mockResolvedValueOnce([
      { name: 'Bob', level: 'hard', score: 99 },
    ] as GameRecord[]);

    await refreshLeaderboard('hard');

    expect(recordsStoreMocks.fetchLeaderboard).toHaveBeenCalledWith(db, 'hard');
    expect(getTopRecordsByLevel('hard')).toEqual([
      { name: 'Bob', level: 'hard', score: 99 },
    ]);
    expect(isLeaderboardLoading()).toBe(false);
  });

  it('shows local records when firestore db is unavailable', async () => {
    firebaseMocks.getFirestoreDb.mockReturnValue(null as never);
    const { initStorage, savePlayerName, saveRecord, getTopRecordsByLevel } =
      await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 12);

    expect(recordsStoreMocks.fetchLeaderboard).not.toHaveBeenCalled();
    expect(getTopRecordsByLevel('easy')).toEqual([
      { name: 'Петя', level: 'easy', score: 12 },
    ]);
  });

  it('shows freshly saved record before remote leaderboard cache updates', async () => {
    const { initStorage, savePlayerName, saveRecord, getTopRecordsByLevel } =
      await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 7);

    expect(getTopRecordsByLevel('easy')).toEqual(
      expect.arrayContaining([{ name: 'Петя', level: 'easy', score: 7 }]),
    );
  });

  it('keeps current player visible when score is outside remote top 10', async () => {
    const { initStorage, savePlayerName, saveRecord, getTopRecordsByLevel } =
      await loadStorageModule();
    const { setCacheLeaderboard } = await import('./cache');
    const remoteTop = Array.from({ length: 10 }, (_, index) => ({
      name: `Player${index}`,
      level: 'medium' as const,
      score: 100 - index,
    }));

    await initStorage();
    setCacheLeaderboard('medium', remoteTop);
    savePlayerName('Петя');
    saveRecord('Петя', 'medium', 3);

    const records = getTopRecordsByLevel('medium');

    expect(records).toHaveLength(10);
    expect(records).toEqual(
      expect.arrayContaining([{ name: 'Петя', level: 'medium', score: 3 }]),
    );
  });
});
