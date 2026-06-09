import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore';
import type { DifficultyLevel } from '../../game/difficulty';

export type GameSessionStatus = 'active' | 'completed';

export interface GameSession {
  level: DifficultyLevel;
  status: GameSessionStatus;
  startedAt: Timestamp;
  completedAt?: Timestamp;
}

interface CachedSession {
  level: DifficultyLevel;
  status: GameSessionStatus;
  startedAtMs: number;
}

let cachedSession: CachedSession | null = null;

function sessionDocRef(db: Firestore, uid: string) {
  return doc(db, 'gameSessions', uid);
}

export function getCachedActiveSession(): CachedSession | null {
  if (cachedSession?.status === 'active') {
    return cachedSession;
  }

  return null;
}

export function clearCachedSession(): void {
  cachedSession = null;
}

function setCachedSession(
  level: DifficultyLevel,
  status: GameSessionStatus,
  startedAtMs: number,
): void {
  cachedSession = { level, status, startedAtMs };
}

export async function fetchGameSession(
  db: Firestore,
  uid: string,
): Promise<GameSession | null> {
  const snapshot = await getDoc(sessionDocRef(db, uid));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Partial<GameSession>;
  if (
    (data.status !== 'active' && data.status !== 'completed')
    || (data.level !== 'easy' && data.level !== 'medium' && data.level !== 'hard')
    || !data.startedAt
  ) {
    return null;
  }

  return {
    level: data.level,
    status: data.status,
    startedAt: data.startedAt,
    completedAt: data.completedAt,
  };
}

export async function startGameSession(
  db: Firestore,
  uid: string,
  level: DifficultyLevel,
): Promise<void> {
  const startedAtMs = Date.now();

  await setDoc(
    sessionDocRef(db, uid),
    {
      level,
      status: 'active',
      startedAt: serverTimestamp(),
      completedAt: null,
    },
    { merge: true },
  );

  setCachedSession(level, 'active', startedAtMs);
}

export async function completeGameSession(
  db: Firestore,
  uid: string,
): Promise<void> {
  await setDoc(
    sessionDocRef(db, uid),
    {
      status: 'completed',
      completedAt: serverTimestamp(),
    },
    { merge: true },
  );

  if (cachedSession) {
    cachedSession = { ...cachedSession, status: 'completed' };
  }
}

export function syncCachedSessionFromRemote(session: GameSession): void {
  setCachedSession(
    session.level,
    session.status,
    session.startedAt.toMillis(),
  );
}
