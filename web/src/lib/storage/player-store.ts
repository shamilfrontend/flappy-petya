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
  const bests = createEmptyBests();
  const rawBests = data.bests;

  if (rawBests && typeof rawBests === 'object') {
    const source = rawBests as Record<string, unknown>;
    if (typeof source.easy === 'number') {
      bests.easy = source.easy;
    }
    if (typeof source.medium === 'number') {
      bests.medium = source.medium;
    }
    if (typeof source.hard === 'number') {
      bests.hard = source.hard;
    }
  }

  const profile: PlayerProfile = {
    name: typeof data.name === 'string' ? data.name.trim() : '',
    bests,
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
      bests: profile.bests,
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

export async function updatePlayerBest(
  db: Firestore,
  uid: string,
  level: DifficultyLevel,
  score: number,
  currentProfile: PlayerProfile,
): Promise<PlayerProfile> {
  const profile: PlayerProfile = {
    ...currentProfile,
    bests: {
      ...currentProfile.bests,
      [level]: Math.max(currentProfile.bests[level], score),
    },
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
