const {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} = vi.hoisted(() => ({
  getAuth: vi.fn(() => ({ app: 'auth' })),
  onAuthStateChanged: vi.fn(),
  signInAnonymously: vi.fn(),
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
}));

describe('firebase auth', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('returns null when firebase is disabled', async () => {
    isFirebaseEnabled.mockReturnValue(false);
    const { ensureAnonymousAuth, getCurrentUid } = await import('./auth');

    await expect(ensureAnonymousAuth()).resolves.toBeNull();
    expect(getCurrentUid()).toBeNull();
    expect(initFirebaseApp).not.toHaveBeenCalled();
  });

  it('returns existing auth user uid', async () => {
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback({ uid: 'existing-uid' }));
      return vi.fn();
    });

    const { ensureAnonymousAuth, getCurrentUid } = await import('./auth');

    await expect(ensureAnonymousAuth()).resolves.toBe('existing-uid');
    expect(getCurrentUid()).toBe('existing-uid');
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it('signs in anonymously when no user is present', async () => {
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback(null));
      return vi.fn();
    });
    signInAnonymously.mockResolvedValue({
      user: { uid: 'anonymous-uid' },
    });

    const { ensureAnonymousAuth, getCurrentUid } = await import('./auth');

    await expect(ensureAnonymousAuth()).resolves.toBe('anonymous-uid');
    expect(getCurrentUid()).toBe('anonymous-uid');
    expect(signInAnonymously).toHaveBeenCalledOnce();
  });

  it('returns null when anonymous sign-in fails', async () => {
    const authError = new Error('auth failed');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback(null));
      return vi.fn();
    });
    signInAnonymously.mockRejectedValue(authError);

    const { ensureAnonymousAuth, getCurrentUid } = await import('./auth');

    await expect(ensureAnonymousAuth()).resolves.toBeNull();
    expect(getCurrentUid()).toBeNull();
    expect(consoleError).toHaveBeenCalledWith(
      'Firebase anonymous auth failed',
      authError,
    );
    consoleError.mockRestore();
  });
});
