export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

function readEnv(key: keyof ImportMetaEnv): string {
  return import.meta.env[key]?.trim() ?? '';
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    readEnv('VITE_FIREBASE_API_KEY')
    && readEnv('VITE_FIREBASE_AUTH_DOMAIN')
    && readEnv('VITE_FIREBASE_PROJECT_ID')
    && readEnv('VITE_FIREBASE_APP_ID'),
  );
}

export function getFirebaseConfig(): FirebaseWebConfig {
  return {
    apiKey: readEnv('VITE_FIREBASE_API_KEY'),
    authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: readEnv('VITE_FIREBASE_APP_ID'),
  };
}
