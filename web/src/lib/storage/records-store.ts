import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import type { DifficultyLevel } from '../../game/difficulty';
import {
  deduplicateLeaderboardByName,
  TOP_RECORDS_PER_LEVEL,
  type GameRecord,
  type LeaderboardEntry,
} from './types';

const LEADERBOARD_FETCH_BUFFER = 5;

function leaderboardCollection(db: Firestore, level: DifficultyLevel) {
  return collection(db, 'leaderboard', level, 'scores');
}

function leaderboardDoc(db: Firestore, level: DifficultyLevel, uid: string) {
  return doc(db, 'leaderboard', level, 'scores', uid);
}

export async function fetchLeaderboard(
  db: Firestore,
  level: DifficultyLevel,
  maxEntries = TOP_RECORDS_PER_LEVEL,
): Promise<GameRecord[]> {
  const fetchLimit = Math.max(maxEntries * LEADERBOARD_FETCH_BUFFER, maxEntries);
  const snapshot = await getDocs(
    query(
      leaderboardCollection(db, level),
      orderBy('score', 'desc'),
      limit(fetchLimit),
    ),
  );

  const records = snapshot.docs
    .map((item) => {
      const data = item.data() as Partial<LeaderboardEntry>;
      if (typeof data.name !== 'string' || typeof data.score !== 'number') {
        return null;
      }

      return {
        name: data.name.trim(),
        level,
        score: data.score,
      };
    })
    .filter((record): record is GameRecord => Boolean(record?.name));

  return deduplicateLeaderboardByName(records, maxEntries);
}

export async function upsertLeaderboardEntry(
  db: Firestore,
  uid: string,
  level: DifficultyLevel,
  name: string,
  score: number,
): Promise<void> {
  const ref = leaderboardDoc(db, level, uid);
  const snapshot = await getDoc(ref);
  const currentScore = snapshot.exists()
    ? Number(snapshot.data().score) || 0
    : 0;
  const nextScore = Math.max(currentScore, score);

  if (nextScore <= 0) {
    return;
  }

  await setDoc(
    ref,
    {
      name,
      score: nextScore,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updateLeaderboardName(
  db: Firestore,
  uid: string,
  name: string,
): Promise<void> {
  const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  await Promise.all(
    levels.map(async (level) => {
      const ref = leaderboardDoc(db, level, uid);
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        return;
      }

      await setDoc(
        ref,
        {
          name,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }),
  );
}
