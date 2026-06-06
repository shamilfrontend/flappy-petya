const { initializeApp } = vi.hoisted(() => ({
  initializeApp: vi.fn(() => ({ name: 'firebase-app' })),
}));

const { getFirestore } = vi.hoisted(() => ({
  getFirestore: vi.fn(() => ({ id: 'firestore-db' })),
}));

const { isFirebaseConfigured, getFirebaseConfig } = vi.hoisted(() => ({
  isFirebaseConfigured: vi.fn(),
  getFirebaseConfig: vi.fn(() => ({
    apiKey: 'key',
    authDomain: 'domain',
    projectId: 'project',
    appId: 'app',
  })),
}));

vi.mock('firebase/app', () => ({
  initializeApp,
}));

vi.mock('firebase/firestore', () => ({
  getFirestore,
}));

vi.mock('./config', () => ({
  isFirebaseConfigured,
  getFirebaseConfig,
}));

describe('firebase app', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('isFirebaseEnabled mirrors isFirebaseConfigured', async () => {
    isFirebaseConfigured.mockReturnValue(true);
    const { isFirebaseEnabled } = await import('./app');

    expect(isFirebaseEnabled()).toBe(true);

    vi.resetModules();
    isFirebaseConfigured.mockReturnValue(false);
    const { isFirebaseEnabled: disabled } = await import('./app');

    expect(disabled()).toBe(false);
  });

  it('getFirestoreDb returns null before initialization', async () => {
    const { getFirestoreDb } = await import('./app');

    expect(getFirestoreDb()).toBeNull();
  });

  it('initFirebaseApp initializes firebase once when configured', async () => {
    isFirebaseConfigured.mockReturnValue(true);
    const { initFirebaseApp, getFirestoreDb } = await import('./app');

    initFirebaseApp();

    expect(initializeApp).toHaveBeenCalledWith(getFirebaseConfig());
    expect(getFirestore).toHaveBeenCalledOnce();
    expect(getFirestoreDb()).toEqual({ id: 'firestore-db' });

    initFirebaseApp();

    expect(initializeApp).toHaveBeenCalledOnce();
    expect(getFirestore).toHaveBeenCalledOnce();
  });

  it('initFirebaseApp is a no-op when firebase is not configured', async () => {
    isFirebaseConfigured.mockReturnValue(false);
    const { initFirebaseApp, getFirestoreDb } = await import('./app');

    initFirebaseApp();

    expect(initializeApp).not.toHaveBeenCalled();
    expect(getFirestore).not.toHaveBeenCalled();
    expect(getFirestoreDb()).toBeNull();
  });
});
