import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  type User,
} from 'firebase/auth';
import { initFirebaseApp, isFirebaseEnabled } from './app';

let currentUser: User | null = null;
let authInitialized = false;
let authReadyPromise: Promise<void> | null = null;

function ensureAuthReadyPromise(): Promise<void> {
  if (authReadyPromise) {
    return authReadyPromise;
  }

  authReadyPromise = new Promise((resolve) => {
    let isFirstAuthState = true;

    onAuthStateChanged(getAuth(), (user) => {
      currentUser = user;

      if (isFirstAuthState) {
        isFirstAuthState = false;
        resolve();
      }
    });
  });

  return authReadyPromise;
}

export function initAuth(): void {
  if (!isFirebaseEnabled() || authInitialized) {
    return;
  }

  initFirebaseApp();
  authInitialized = true;
  void ensureAuthReadyPromise();
}

export async function waitForAuthReady(): Promise<void> {
  if (!isFirebaseEnabled()) {
    return;
  }

  initAuth();
  await ensureAuthReadyPromise();
}

export function getCurrentUser(): User | null {
  return currentUser;
}

export function getCurrentUid(): string | null {
  return currentUser?.uid ?? null;
}

export function isUserAuthenticated(): boolean {
  return currentUser !== null;
}

export function getAuthErrorMessage(error: unknown): string {
  const code = error && typeof error === 'object' && 'code' in error
    ? String((error as { code: string }).code)
    : '';

  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Анонимный вход не включён в Firebase. Откройте Firebase Console → Authentication → Sign-in method и включите Anonymous.';
    default:
      return 'Не удалось выполнить вход. Попробуйте ещё раз.';
  }
}

export async function signInAnonymouslyUser(): Promise<User | null> {
  if (!isFirebaseEnabled()) {
    return null;
  }

  initAuth();
  await waitForAuthReady();

  const auth = getAuth();

  try {
    const credential = await signInAnonymously(auth);
    currentUser = credential.user;
    return credential.user;
  } catch (error) {
    console.error('Anonymous sign-in failed', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  if (!isFirebaseEnabled()) {
    return;
  }

  initAuth();
  await signOut(getAuth());
  currentUser = null;
}
