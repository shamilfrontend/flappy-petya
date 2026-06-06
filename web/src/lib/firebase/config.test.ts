import {
  getFirebaseConfig,
  isFirebaseConfigured,
} from './config';

describe('firebase config', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns false when required env vars are missing', () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', '');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', '');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', '');
    vi.stubEnv('VITE_FIREBASE_APP_ID', '');

    expect(isFirebaseConfigured()).toBe(false);
  });

  it('returns true when all required env vars are set', () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-key');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project');
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'test-app');

    expect(isFirebaseConfigured()).toBe(true);
  });

  it('trims env values and ignores whitespace-only entries', () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', '  ');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'domain');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'project');
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'app');

    expect(isFirebaseConfigured()).toBe(false);
  });

  it('reads firebase web config from env', () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'key');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'domain');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'project');
    vi.stubEnv('VITE_FIREBASE_STORAGE_BUCKET', 'bucket');
    vi.stubEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'sender');
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'app');

    expect(getFirebaseConfig()).toEqual({
      apiKey: 'key',
      authDomain: 'domain',
      projectId: 'project',
      storageBucket: 'bucket',
      messagingSenderId: 'sender',
      appId: 'app',
    });
  });
});
