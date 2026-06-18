import type { SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseUniqueViolation } from '../supabase/errors';
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

export async function migrateLocalDataToSupabase(
  db: SupabaseClient,
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

  try {
    await savePlayerProfile(db, uid, profile);
  } catch (error) {
    if (isSupabaseUniqueViolation(error)) {
      return buildProfileFromLocal('', createEmptyBests());
    }

    throw error;
  }

  return profile;
}
