import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Firestore,
} from 'firebase/firestore';
import type { DifficultyLevel } from '../../game/difficulty';
import {
  createDefaultProfile,
  createEmptyBests,
  type PlayerProfile,
} from './types';

function playerDocRef(db: Firestore, uid: string) {
  return doc(db, 'players', uid);
}

function parseProfile(data: Record<string, unknown>): PlayerProfile {
  const profile: PlayerProfile = {
    name: typeof data.name === 'string' ? data.name.trim() : '',
    bests: createEmptyBests(),
  };

  if (
    data.selectedDifficulty === 'easy'
    || data.selectedDifficulty === 'medium'
    || data.selectedDifficulty === 'hard'
  ) {
    profile.selectedDifficulty = data.selectedDifficulty;
  }

  if (
    data.selectedRecordsLevel === 'easy'
    || data.selectedRecordsLevel === 'medium'
    || data.selectedRecordsLevel === 'hard'
  ) {
    profile.selectedRecordsLevel = data.selectedRecordsLevel;
  }

  return profile;
}

export async function fetchPlayerProfile(
  db: Firestore,
  uid: string,
): Promise<PlayerProfile | null> {
  const snapshot = await getDoc(playerDocRef(db, uid));
  if (!snapshot.exists()) {
    return null;
  }

  return parseProfile(snapshot.data() as Record<string, unknown>);
}

export async function savePlayerProfile(
  db: Firestore,
  uid: string,
  profile: PlayerProfile,
): Promise<void> {
  await setDoc(
    playerDocRef(db, uid),
    {
      name: profile.name,
      // Рекорды хранятся только в leaderboard.
      bests: createEmptyBests(),
      selectedDifficulty: profile.selectedDifficulty ?? null,
      selectedRecordsLevel: profile.selectedRecordsLevel ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function updatePlayerName(
  db: Firestore,
  uid: string,
  name: string,
  currentProfile: PlayerProfile,
): Promise<PlayerProfile> {
  const profile: PlayerProfile = {
    ...currentProfile,
    name,
  };

  await savePlayerProfile(db, uid, profile);
  return profile;
}

export function buildProfileFromLocal(
  name: string,
  bests: Record<DifficultyLevel, number>,
  selectedDifficulty?: DifficultyLevel,
): PlayerProfile {
  return {
    ...createDefaultProfile(name),
    name,
    bests,
    selectedDifficulty,
  };
}
