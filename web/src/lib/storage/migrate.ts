import type { Firestore } from 'firebase/firestore';
import { getLocalPlayerName } from './local';
import {
  buildProfileFromLocal,
  fetchPlayerProfile,
  savePlayerProfile,
} from './player-store';
import {
  createEmptyBests,
  type PlayerProfile,
} from './types';

export async function migrateLocalDataToFirestore(
  db: Firestore,
  uid: string,
): Promise<PlayerProfile> {
  const existingProfile = await fetchPlayerProfile(db, uid);
  if (existingProfile?.name) {
    return existingProfile;
  }

  const trimmedName = getLocalPlayerName();
  const profile = buildProfileFromLocal(
    trimmedName,
    createEmptyBests(),
  );

  if (!trimmedName) {
    return profile;
  }

  await savePlayerProfile(db, uid, profile);

  return profile;
}
