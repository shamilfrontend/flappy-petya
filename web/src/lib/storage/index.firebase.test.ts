const firebaseMocks = vi.hoisted(() => ({
  isFirebaseEnabled: vi.fn(() => true),
  initFirebaseApp: vi.fn(),
  getFirestoreDb: vi.fn(() => ({ id: 'db' })),
}));

const authMocks = vi.hoisted(() => ({
  initAuth: vi.fn(),
  waitForAuthReady: vi.fn(() => Promise.resolve()),
  getCurrentUid: vi.fn(() => 'uid-1'),
  signInAnonymouslyUser: vi.fn(),
  signOutUser: vi.fn(() => Promise.resolve()),
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

const sessionState = vi.hoisted(() => ({
  level: 'easy' as 'easy' | 'medium' | 'hard',
}));

const sessionStoreMocks = vi.hoisted(() => ({
  startGameSession: vi.fn(() => Promise.resolve()),
  completeGameSession: vi.fn(() => Promise.resolve()),
  getCachedActiveSession: vi.fn<
    () => {
      level: 'easy' | 'medium' | 'hard';
      status: 'active';
      startedAtMs: number;
    } | null
  >(() => ({
    level: sessionState.level,
    status: 'active' as const,
    startedAtMs: Date.now() - 10_000_000,
  })),
  clearCachedSession: vi.fn(),
}));

vi.mock('../firebase/app', () => firebaseMocks);
vi.mock('../firebase/auth', () => authMocks);
vi.mock('./player-store', () => playerStoreMocks);
vi.mock('./records-store', () => recordsStoreMocks);
vi.mock('./migrate', () => migrateMocks);
vi.mock('./session-store', () => sessionStoreMocks);

function validGameFrames(score: number): number {
  if (score <= 0) {
    return 0;
  }

  if (score === 1) {
    return 250;
  }

  return 250 + (score - 1) * 120;
}

import {
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
    sessionState.level = 'easy';
    firebaseMocks.isFirebaseEnabled.mockReturnValue(true);
    firebaseMocks.getFirestoreDb.mockReturnValue(db);
    authMocks.getCurrentUid.mockReturnValue('uid-1');
    authMocks.signInAnonymouslyUser.mockResolvedValue({ uid: 'uid-1' });
    playerStoreMocks.fetchPlayerProfile.mockResolvedValue(null);
    playerStoreMocks.updatePlayerName.mockImplementation(
      async (_db, _uid, name: string, currentProfile) => ({
        ...currentProfile,
        name,
      }),
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
    expect(authMocks.initAuth).toHaveBeenCalled();
    expect(authMocks.waitForAuthReady).toHaveBeenCalled();
  });

  it('migrates legacy data when profile has no name', async () => {
    const { initStorage } = await loadStorageModule();

    await initStorage();

    expect(migrateMocks.migrateLocalDataToFirestore).toHaveBeenCalledWith(
      db,
      'uid-1',
    );
  });

  it('does not sync existing profile bests to leaderboard on init', async () => {
    playerStoreMocks.fetchPlayerProfile.mockResolvedValue({
      name: 'Петя',
      bests: { easy: 5, medium: 0, hard: 3 },
    });
    const { initStorage } = await loadStorageModule();

    await initStorage();

    expect(migrateMocks.migrateLocalDataToFirestore).not.toHaveBeenCalled();
    expect(recordsStoreMocks.upsertLeaderboardEntry).not.toHaveBeenCalled();
  });

  it('uses firebase profile bests as source of truth on init', async () => {
    playerStoreMocks.fetchPlayerProfile.mockResolvedValue({
      name: 'Петя',
      bests: { easy: 49, medium: 0, hard: 0 },
    });
    const { initStorage, getPersonalBest } = await loadStorageModule();

    await initStorage();

    expect(playerStoreMocks.savePlayerProfile).not.toHaveBeenCalled();
    expect(getPersonalBest('Петя', 'easy')).toBe(49);
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
    sessionState.level = 'medium';
    saveRecord('Петя', 'medium', 15, validGameFrames(15));

    await vi.waitFor(() => {
      expect(recordsStoreMocks.upsertLeaderboardEntry).toHaveBeenCalledWith(
        db,
        'uid-1',
        'medium',
        'Петя',
        15,
        validGameFrames(15),
      );
    });

    await vi.waitFor(() => {
      expect(sessionStoreMocks.completeGameSession).toHaveBeenCalledWith(db, 'uid-1');
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

  it('shows profile cache when firestore db is unavailable', async () => {
    firebaseMocks.getFirestoreDb.mockReturnValue(null as never);
    const { initStorage, savePlayerName, saveRecord, getTopRecordsByLevel } =
      await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 12, validGameFrames(12));

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
    saveRecord('Петя', 'easy', 7, validGameFrames(7));

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
    sessionState.level = 'medium';
    saveRecord('Петя', 'medium', 3, validGameFrames(3));

    const records = getTopRecordsByLevel('medium');

    expect(records).toHaveLength(10);
    expect(records).toEqual(
      expect.arrayContaining([{ name: 'Петя', level: 'medium', score: 3 }]),
    );
  });

  it('logs and keeps failed firebase task in queue', async () => {
    const taskError = new Error('network failed');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    recordsStoreMocks.upsertLeaderboardEntry.mockRejectedValueOnce(taskError);
    const { initStorage, savePlayerName, saveRecord } = await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 5, validGameFrames(5));

    await vi.waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Firebase storage task failed',
        taskError,
      );
    });

    consoleError.mockRestore();
  });

  it('retries failed firebase task after backoff delay', async () => {
    vi.useFakeTimers();
    const taskError = new Error('network failed');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { initStorage, savePlayerName, saveRecord } = await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');

    await vi.waitFor(() => {
      expect(playerStoreMocks.updatePlayerName).toHaveBeenCalled();
    });

    recordsStoreMocks.upsertLeaderboardEntry.mockClear();
    recordsStoreMocks.upsertLeaderboardEntry
      .mockRejectedValueOnce(taskError)
      .mockResolvedValue(undefined);
    saveRecord('Петя', 'easy', 5, validGameFrames(5));

    await vi.waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Firebase storage task failed',
        taskError,
      );
    });

    expect(recordsStoreMocks.upsertLeaderboardEntry).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(2000);

    await vi.waitFor(() => {
      expect(recordsStoreMocks.upsertLeaderboardEntry).toHaveBeenCalledTimes(2);
    });

    consoleError.mockRestore();
    vi.useRealTimers();
  });

  it('retries firebase queue immediately when browser goes online', async () => {
    const taskError = new Error('network failed');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { initStorage, savePlayerName, saveRecord } = await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');

    await vi.waitFor(() => {
      expect(playerStoreMocks.updatePlayerName).toHaveBeenCalled();
    });

    recordsStoreMocks.upsertLeaderboardEntry.mockClear();
    recordsStoreMocks.upsertLeaderboardEntry
      .mockRejectedValueOnce(taskError)
      .mockResolvedValue(undefined);
    saveRecord('Петя', 'easy', 5, validGameFrames(5));

    await vi.waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Firebase storage task failed',
        taskError,
      );
    });

    expect(recordsStoreMocks.upsertLeaderboardEntry).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event('online'));

    await vi.waitFor(() => {
      expect(recordsStoreMocks.upsertLeaderboardEntry).toHaveBeenCalledTimes(2);
    });

    consoleError.mockRestore();
  });

  it('clears loading flag when leaderboard fetch fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    recordsStoreMocks.fetchLeaderboard.mockRejectedValue(new Error('fetch failed'));
    const { initStorage, isLeaderboardLoading } = await loadStorageModule();

    await initStorage();

    expect(isLeaderboardLoading()).toBe(false);
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to load leaderboards',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('enqueues firebase save when selected difficulty changes', async () => {
    const { initStorage, saveSelectedDifficulty } = await loadStorageModule();

    await initStorage();
    saveSelectedDifficulty('hard');

    await vi.waitFor(() => {
      expect(playerStoreMocks.savePlayerProfile).toHaveBeenCalledWith(
        db,
        'uid-1',
        expect.objectContaining({ selectedDifficulty: 'hard' }),
      );
    });
  });

  it('reports pending sync while firebase tasks are queued', async () => {
    recordsStoreMocks.upsertLeaderboardEntry.mockImplementation(
      () => new Promise(() => {}),
    );
    const {
      initStorage,
      savePlayerName,
      saveRecord,
      isFirebaseSyncPending,
    } = await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    saveRecord('Петя', 'easy', 5, validGameFrames(5));

    await vi.waitFor(() => {
      expect(isFirebaseSyncPending()).toBe(true);
    });
  });

  it('merges profile bests when refreshing leaderboard', async () => {
    const {
      initStorage,
      refreshLeaderboard,
      getTopRecordsByLevel,
    } = await loadStorageModule();
    const { setCacheProfile: setProfile } = await import('./cache');
    await initStorage();
    setProfile({
      name: 'Петя',
      bests: { easy: 15, medium: 0, hard: 0 },
    });
    recordsStoreMocks.fetchLeaderboard.mockResolvedValue([]);
    await refreshLeaderboard('easy');

    expect(getTopRecordsByLevel('easy')).toEqual(
      expect.arrayContaining([{ name: 'Петя', level: 'easy', score: 15 }]),
    );
  });

  it('returns error when game session cannot start', async () => {
    sessionStoreMocks.startGameSession.mockRejectedValueOnce({
      code: 'permission-denied',
      message: 'Missing or insufficient permissions.',
    });
    const { prepareGameSession } = await loadStorageModule();

    await expect(prepareGameSession('easy')).resolves.toEqual({
      ok: false,
      errorMessage:
        'Не удалось начать игровую сессию. Проверьте подключение и правила Firestore.',
    });
  });

  it('returns error when firestore db is unavailable for session start', async () => {
    firebaseMocks.getFirestoreDb.mockReturnValue(null as never);
    const { prepareGameSession } = await loadStorageModule();

    await expect(prepareGameSession('easy')).resolves.toEqual({
      ok: false,
      errorMessage: 'Не удалось подключиться к серверу рекордов.',
    });
  });

  it('rejects saveRecord when wall clock is too short', async () => {
    sessionStoreMocks.getCachedActiveSession.mockReturnValue({
      level: 'easy',
      status: 'active',
      startedAtMs: Date.now(),
    });
    const { initStorage, savePlayerName, saveRecord } = await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    recordsStoreMocks.upsertLeaderboardEntry.mockClear();
    saveRecord('Петя', 'easy', 5, validGameFrames(5));

    expect(recordsStoreMocks.upsertLeaderboardEntry).not.toHaveBeenCalled();
  });

  it('rejects saveRecord without active session', async () => {
    sessionStoreMocks.getCachedActiveSession.mockReturnValue(null);
    const { initStorage, savePlayerName, saveRecord } = await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    recordsStoreMocks.upsertLeaderboardEntry.mockClear();
    saveRecord('Петя', 'easy', 5, validGameFrames(5));

    expect(recordsStoreMocks.upsertLeaderboardEntry).not.toHaveBeenCalled();
  });

  it('rejects saveRecord with invalid gameFrames', async () => {
    const { initStorage, savePlayerName, saveRecord } = await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    recordsStoreMocks.upsertLeaderboardEntry.mockClear();
    saveRecord('Петя', 'easy', 5, 1);

    expect(recordsStoreMocks.upsertLeaderboardEntry).not.toHaveBeenCalled();
  });

  it('rejects scores above MAX_VALID_SCORE', async () => {
    const { initStorage, savePlayerName, saveRecord, getTopRecordsByLevel } =
      await loadStorageModule();

    await initStorage();
    savePlayerName('Петя');
    recordsStoreMocks.upsertLeaderboardEntry.mockClear();
    saveRecord('Петя', 'easy', 10000, validGameFrames(10000));

    expect(
      getTopRecordsByLevel('easy').find((record) => record.name === 'Петя'),
    ).toBeUndefined();
    expect(recordsStoreMocks.upsertLeaderboardEntry).not.toHaveBeenCalled();
  });

  it('restores anonymous session when firestore profile access is denied', async () => {
    const permissionError = {
      code: 'permission-denied',
      message: 'Missing or insufficient permissions.',
    };
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    authMocks.signOutUser.mockResolvedValue(undefined);
    authMocks.signInAnonymouslyUser.mockResolvedValue({ uid: 'uid-2' });
    playerStoreMocks.fetchPlayerProfile
      .mockRejectedValueOnce(permissionError)
      .mockResolvedValue(null);
    migrateMocks.migrateLocalDataToFirestore.mockResolvedValue(
      createDefaultProfile(),
    );
    const { initStorage } = await loadStorageModule();

    await initStorage();

    expect(authMocks.signOutUser).toHaveBeenCalled();
    expect(authMocks.signInAnonymouslyUser).toHaveBeenCalled();
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('Firestore access denied'),
      permissionError,
    );
    consoleWarn.mockRestore();
  });
});
