import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { getSupabaseClient, initSupabaseClient, isSupabaseEnabled } from './client';

export interface AuthenticatedUser {
  uid: string;
}

let currentUid: string | null = null;
let authInitialized = false;
let authReadyPromise: Promise<void> | null = null;

function applySession(session: Session | null): void {
  currentUid = session?.user?.id ?? null;
}

function ensureAuthReadyPromise(): Promise<void> {
  if (authReadyPromise) {
    return authReadyPromise;
  }

  const client = getSupabaseClient();
  if (!client) {
    return Promise.resolve();
  }

  authReadyPromise = new Promise((resolve) => {
    let isResolved = false;

    function resolveOnce(): void {
      if (isResolved) {
        return;
      }

      isResolved = true;
      resolve();
    }

    client.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Failed to read Supabase auth session', error);
      } else {
        applySession(data.session);
      }

      resolveOnce();
    });

    client.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        applySession(session);
        resolveOnce();
      },
    );
  });

  return authReadyPromise;
}

export function initAuth(): void {
  if (!isSupabaseEnabled() || authInitialized) {
    return;
  }

  initSupabaseClient();
  authInitialized = true;
  void ensureAuthReadyPromise();
}

export async function waitForAuthReady(): Promise<void> {
  if (!isSupabaseEnabled()) {
    return;
  }

  initAuth();
  await ensureAuthReadyPromise();
}

export function getCurrentUid(): string | null {
  return currentUid;
}

export async function signInAnonymouslyUser(): Promise<AuthenticatedUser | null> {
  if (!isSupabaseEnabled()) {
    return null;
  }

  initAuth();
  await waitForAuthReady();

  if (currentUid) {
    return { uid: currentUid };
  }

  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const { data, error } = await client.auth.signInAnonymously();
  if (error) {
    console.error('Supabase anonymous sign-in failed', error);
    throw error;
  }

  currentUid = data.user?.id ?? null;
  return currentUid ? { uid: currentUid } : null;
}

export async function signOutUser(): Promise<void> {
  if (!isSupabaseEnabled()) {
    return;
  }

  initAuth();

  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  const { error } = await client.auth.signOut();
  if (error) {
    console.error('Supabase sign-out failed', error);
    throw error;
  }

  currentUid = null;
}
