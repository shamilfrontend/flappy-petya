const {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
} = vi.hoisted(() => ({
  getAuth: vi.fn(() => ({ app: 'auth' })),
  onAuthStateChanged: vi.fn(),
  signInAnonymously: vi.fn(),
  signOut: vi.fn(),
}));

const { isFirebaseEnabled, initFirebaseApp } = vi.hoisted(() => ({
  isFirebaseEnabled: vi.fn(),
  initFirebaseApp: vi.fn(),
}));

vi.mock('./app', () => ({
  isFirebaseEnabled,
  initFirebaseApp,
}));

vi.mock('firebase/auth', () => ({
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
}));

describe('firebase auth', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('returns null uid when firebase is disabled', async () => {
    isFirebaseEnabled.mockReturnValue(false);
    const { getCurrentUid, isUserAuthenticated } = await import('./auth');

    expect(getCurrentUid()).toBeNull();
    expect(isUserAuthenticated()).toBe(false);
    expect(initFirebaseApp).not.toHaveBeenCalled();
  });

  it('waits for existing auth user', async () => {
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback({
        uid: 'anon-uid',
      }));
      return vi.fn();
    });

    const { waitForAuthReady, getCurrentUid } = await import('./auth');

    await waitForAuthReady();

    expect(getCurrentUid()).toBe('anon-uid');
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it('signs in anonymously', async () => {
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback(null));
      return vi.fn();
    });
    signInAnonymously.mockResolvedValue({
      user: {
        uid: 'anon-uid',
      },
    });

    const { waitForAuthReady, signInAnonymouslyUser, getCurrentUid } = await import('./auth');

    await waitForAuthReady();
    await expect(signInAnonymouslyUser()).resolves.toEqual(
      expect.objectContaining({ uid: 'anon-uid' }),
    );
    expect(getCurrentUid()).toBe('anon-uid');
  });

  it('maps operation-not-allowed to setup hint', async () => {
    const { getAuthErrorMessage } = await import('./auth');

    expect(getAuthErrorMessage({ code: 'auth/operation-not-allowed' })).toContain(
      'Anonymous',
    );
  });

  it('maps default auth errors', async () => {
    const { getAuthErrorMessage } = await import('./auth');

    expect(getAuthErrorMessage({ code: 'auth/unknown' })).toContain(
      'Не удалось выполнить вход',
    );
    expect(getAuthErrorMessage(null)).toContain('Не удалось выполнить вход');
  });

  it('rethrows anonymous sign-in errors', async () => {
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback(null));
      return vi.fn();
    });
    signInAnonymously.mockRejectedValue({ code: 'auth/network-request-failed' });

    const { waitForAuthReady, signInAnonymouslyUser } = await import('./auth');

    await waitForAuthReady();
    await expect(signInAnonymouslyUser()).rejects.toEqual({
      code: 'auth/network-request-failed',
    });
  });

  it('signs out current user', async () => {
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback({ uid: 'anon-uid' }));
      return vi.fn();
    });
    signOut.mockResolvedValue(undefined);

    const { waitForAuthReady, signOutUser, isUserAuthenticated } = await import('./auth');

    await waitForAuthReady();
    await signOutUser();

    expect(signOut).toHaveBeenCalledOnce();
    expect(isUserAuthenticated()).toBe(false);
  });
});
