import { beforeEach, describe, expect, it, vi } from 'vitest';

const firestoreMocks = vi.hoisted(() => ({
  getDoc: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => ({ seconds: 1_700_000_000, nanoseconds: 0 })),
  doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
}));

vi.mock('firebase/firestore', () => firestoreMocks);

import {
  clearCachedSession,
  completeGameSession,
  fetchGameSession,
  getCachedActiveSession,
  startGameSession,
  syncCachedSessionFromRemote,
} from './session-store';

describe('session-store', () => {
  const db = { id: 'db' } as never;
  const uid = 'uid-1';

  beforeEach(() => {
    vi.clearAllMocks();
    clearCachedSession();
  });

  it('starts a game session and caches it as active', async () => {
    await startGameSession(db, uid, 'hard');

    expect(firestoreMocks.setDoc).toHaveBeenCalledWith(
      { path: 'gameSessions/uid-1' },
      expect.objectContaining({
        level: 'hard',
        status: 'active',
        startedAt: expect.anything(),
        completedAt: null,
      }),
      { merge: true },
    );

    const cached = getCachedActiveSession();
    expect(cached).not.toBeNull();
    expect(cached?.level).toBe('hard');
    expect(cached?.status).toBe('active');
    expect(cached?.startedAtMs).toBeGreaterThan(0);
  });

  it('completes a game session and updates cache', async () => {
    await startGameSession(db, uid, 'medium');
    await completeGameSession(db, uid);

    expect(firestoreMocks.setDoc).toHaveBeenLastCalledWith(
      { path: 'gameSessions/uid-1' },
      expect.objectContaining({
        status: 'completed',
        completedAt: expect.anything(),
      }),
      { merge: true },
    );
    expect(getCachedActiveSession()).toBeNull();
  });

  it('fetches a valid remote session', async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        level: 'easy',
        status: 'active',
        startedAt: { toMillis: () => 1_700_000_000_000 },
      }),
    });

    const session = await fetchGameSession(db, uid);
    expect(session).toEqual({
      level: 'easy',
      status: 'active',
      startedAt: { toMillis: expect.any(Function) },
    });
  });

  it('returns null for invalid remote session', async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ level: 'invalid', status: 'active' }),
    });

    expect(await fetchGameSession(db, uid)).toBeNull();
  });

  it('syncs cached session from remote data', () => {
    syncCachedSessionFromRemote({
      level: 'hard',
      status: 'active',
      startedAt: { toMillis: () => 1_700_000_000_000 } as never,
    });

    const cached = getCachedActiveSession();
    expect(cached?.level).toBe('hard');
    expect(cached?.startedAtMs).toBe(1_700_000_000_000);
  });
});
