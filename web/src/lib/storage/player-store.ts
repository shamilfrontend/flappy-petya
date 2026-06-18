import type { SupabaseClient } from '@supabase/supabase-js';
import type { DifficultyLevel } from '../../game/difficulty';
import { isSupabaseUniqueViolation } from '../supabase/errors';
import {
  createDefaultProfile,
  createEmptyBests,
  type PlayerProfile,
} from './types';

interface PlayerRow {
  name: string | null;
}

export const PLAYER_NAME_CLAIM_STATUS = {
  Success: 'success',
  Taken: 'taken',
  Error: 'error',
} as const;

export type PlayerNameClaimStatus =
  typeof PLAYER_NAME_CLAIM_STATUS[keyof typeof PLAYER_NAME_CLAIM_STATUS];

export interface PlayerNameClaimResult {
  status: PlayerNameClaimStatus;
  profile?: PlayerProfile;
  error?: unknown;
}

function parseProfile(data: Partial<PlayerRow>): PlayerProfile {
  const profile: PlayerProfile = {
    name: typeof data.name === 'string' ? data.name.trim() : '',
    bests: createEmptyBests(),
  };

  return profile;
}

export async function fetchPlayerProfile(
  db: SupabaseClient,
  uid: string,
): Promise<PlayerProfile | null> {
  const { data, error } = await db
    .from('players')
    .select('name')
    .eq('user_id', uid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return parseProfile(data as Partial<PlayerRow>);
}

export async function savePlayerProfile(
  db: SupabaseClient,
  uid: string,
  profile: PlayerProfile,
): Promise<void> {
  const trimmedName = profile.name.trim();
  if (!trimmedName) {
    return;
  }

  const { error } = await db
    .from('players')
    .upsert({
      user_id: uid,
      name: trimmedName,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    throw error;
  }
}

export async function updatePlayerName(
  db: SupabaseClient,
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

export async function claimPlayerName(
  db: SupabaseClient,
  uid: string,
  name: string,
  currentProfile: PlayerProfile,
): Promise<PlayerNameClaimResult> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return {
      status: PLAYER_NAME_CLAIM_STATUS.Error,
      error: new Error('Player name is empty'),
    };
  }

  const profile: PlayerProfile = {
    ...currentProfile,
    name: trimmedName,
  };

  try {
    await savePlayerProfile(db, uid, profile);

    return {
      status: PLAYER_NAME_CLAIM_STATUS.Success,
      profile,
    };
  } catch (error) {
    if (isSupabaseUniqueViolation(error)) {
      return {
        status: PLAYER_NAME_CLAIM_STATUS.Taken,
      };
    }

    return {
      status: PLAYER_NAME_CLAIM_STATUS.Error,
      error,
    };
  }
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
