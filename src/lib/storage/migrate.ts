import type { Firestore } from 'firebase/firestore';
import type { DifficultyLevel } from '../../game/difficulty';
import {
  getLocalPersonalBest,
  getLocalPlayerName,
  getLocalRecords,
} from './local';
import {
  buildProfileFromLocal,
  fetchPlayerProfile,
  savePlayerProfile,
} from './player-store';
import { upsertLeaderboardEntry } from './records-store';
import { createEmptyBests, type PlayerProfile } from './types';

function collectLocalBests(name: string): Record<DifficultyLevel, number> {
  const bests = createEmptyBests();
  const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  levels.forEach((level) => {
    bests[level] = getLocalPersonalBest(name, level);
  });

  return bests;
}

export async function migrateLocalDataToFirestore(
  db: Firestore,
  uid: string,
): Promise<PlayerProfile> {
  const existingProfile = await fetchPlayerProfile(db, uid);
  if (existingProfile?.name) {
    return existingProfile;
  }

  const localName = getLocalPlayerName();
  const profile = buildProfileFromLocal(
    localName,
    localName ? collectLocalBests(localName) : createEmptyBests(),
  );

  await savePlayerProfile(db, uid, profile);

  if (!localName) {
    return profile;
  }

  const localRecords = getLocalRecords().filter(
    (record) => record.name === localName,
  );

  await Promise.all(
    localRecords.map((record) =>
      upsertLeaderboardEntry(
        db,
        uid,
        record.level,
        localName,
        record.score,
      ),
    ),
  );

  return profile;
}
