import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
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
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      currentUser = user;
      unsubscribe();
      resolve();
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

export function getAuthDisplayName(): string {
  if (!currentUser) {
    return '';
  }

  const displayName = currentUser.displayName?.trim();
  if (displayName) {
    return displayName;
  }

  const emailPrefix = currentUser.email?.split('@')[0]?.trim();
  return emailPrefix ?? '';
}

export function getAuthErrorMessage(error: unknown): string {
  const code = error && typeof error === 'object' && 'code' in error
    ? String((error as { code: string }).code)
    : '';

  switch (code) {
    case 'auth/operation-not-allowed':
      return 'Вход через Google не включён в Firebase. Откройте Firebase Console → Authentication → Sign-in method и включите Google.';
    case 'auth/popup-closed-by-user':
      return 'Вход отменён.';
    case 'auth/popup-blocked':
      return 'Браузер заблокировал окно входа. Разрешите всплывающие окна для этого сайта.';
    default:
      return 'Не удалось войти через Google. Попробуйте ещё раз.';
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  if (!isFirebaseEnabled()) {
    return null;
  }

  initAuth();
  await waitForAuthReady();

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const credential = await signInWithPopup(auth, provider);
    currentUser = credential.user;
    return credential.user;
  } catch (error) {
    console.error('Google sign-in failed', error);
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
