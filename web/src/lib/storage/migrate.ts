import type { Firestore } from 'firebase/firestore';
import type { DifficultyLevel } from '../../game/difficulty';
import {
  buildProfileFromLocal,
  fetchPlayerProfile,
  savePlayerProfile,
} from './player-store';
import { upsertLeaderboardEntry } from './records-store';
import {
  createEmptyBests,
  type GameRecord,
  type PlayerProfile,
} from './types';

const LEGACY_RECORDS_KEY = 'flappy-petya-records';

function isGameRecord(value: unknown): value is GameRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Partial<GameRecord>;
  return (
    typeof record.name === 'string'
    && typeof record.level === 'string'
    && typeof record.score === 'number'
    && record.score >= 0
  );
}

function getLegacyLocalRecords(): GameRecord[] {
  try {
    const raw = localStorage.getItem(LEGACY_RECORDS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isGameRecord);
  } catch {
    return [];
  }
}

function collectLegacyBests(name: string): Record<DifficultyLevel, number> {
  const bests = createEmptyBests();
  const trimmedName = name.trim();

  getLegacyLocalRecords()
    .filter((record) => record.name === trimmedName)
    .forEach((record) => {
      bests[record.level] = Math.max(bests[record.level], record.score);
    });

  return bests;
}

export async function migrateLocalDataToFirestore(
  db: Firestore,
  uid: string,
  displayName: string,
): Promise<PlayerProfile> {
  const existingProfile = await fetchPlayerProfile(db, uid);
  if (existingProfile?.name) {
    return existingProfile;
  }

  const trimmedName = displayName.trim();
  const profile = buildProfileFromLocal(
    trimmedName,
    trimmedName ? collectLegacyBests(trimmedName) : createEmptyBests(),
  );

  await savePlayerProfile(db, uid, profile);

  if (!trimmedName) {
    return profile;
  }

  const legacyRecords = getLegacyLocalRecords().filter(
    (record) => record.name === trimmedName,
  );

  await Promise.all(
    legacyRecords.map((record) =>
      upsertLeaderboardEntry(
        db,
        uid,
        record.level,
        trimmedName,
        record.score,
      ),
    ),
  );

  return profile;
}
