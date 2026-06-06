const {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} = vi.hoisted(() => ({
  getAuth: vi.fn(() => ({ app: 'auth' })),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: class MockGoogleAuthProvider {},
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
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
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
        uid: 'google-uid',
        displayName: 'Петя',
        email: 'petya@example.com',
      }));
      return vi.fn();
    });

    const { waitForAuthReady, getCurrentUid, getAuthDisplayName } = await import('./auth');

    await waitForAuthReady();

    expect(getCurrentUid()).toBe('google-uid');
    expect(getAuthDisplayName()).toBe('Петя');
    expect(signInWithPopup).not.toHaveBeenCalled();
  });

  it('signs in with google popup', async () => {
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback(null));
      return vi.fn();
    });
    signInWithPopup.mockResolvedValue({
      user: {
        uid: 'google-uid',
        displayName: 'Петя',
        email: 'petya@example.com',
      },
    });

    const { waitForAuthReady, signInWithGoogle, getCurrentUid } = await import('./auth');

    await waitForAuthReady();
    await expect(signInWithGoogle()).resolves.toEqual(
      expect.objectContaining({ uid: 'google-uid' }),
    );
    expect(getCurrentUid()).toBe('google-uid');
  });

  it('falls back to email prefix when display name is missing', async () => {
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback({
        uid: 'google-uid',
        displayName: '',
        email: 'player@example.com',
      }));
      return vi.fn();
    });

    const { waitForAuthReady, getAuthDisplayName } = await import('./auth');

    await waitForAuthReady();

    expect(getAuthDisplayName()).toBe('player');
  });

  it('maps operation-not-allowed to setup hint', async () => {
    const { getAuthErrorMessage } = await import('./auth');

    expect(getAuthErrorMessage({ code: 'auth/operation-not-allowed' })).toContain(
      'Firebase',
    );
  });

  it('signs out current user', async () => {
    isFirebaseEnabled.mockReturnValue(true);
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      queueMicrotask(() => callback({ uid: 'google-uid', displayName: 'Петя' }));
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
