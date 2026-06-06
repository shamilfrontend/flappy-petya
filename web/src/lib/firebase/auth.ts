import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from 'firebase/auth';
import { initFirebaseApp, isFirebaseEnabled } from './app';

let currentUser: User | null = null;
let authReadyPromise: Promise<string | null> | null = null;

function waitForAuthState(auth: ReturnType<typeof getAuth>): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export function getCurrentUid(): string | null {
  return currentUser?.uid ?? null;
}

export async function ensureAnonymousAuth(): Promise<string | null> {
  if (!isFirebaseEnabled()) {
    return null;
  }

  if (currentUser) {
    return currentUser.uid;
  }

  if (authReadyPromise) {
    return authReadyPromise;
  }

  authReadyPromise = (async () => {
    initFirebaseApp();
    const auth = getAuth();
    let user = await waitForAuthState(auth);

    if (!user) {
      const credential = await signInAnonymously(auth);
      user = credential.user;
    }

    currentUser = user;
    return user.uid;
  })();

  try {
    return await authReadyPromise;
  } catch (error) {
    console.error('Firebase anonymous auth failed', error);
    return null;
  } finally {
    authReadyPromise = null;
  }
}
