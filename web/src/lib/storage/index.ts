import type { DifficultyLevel } from '../../game/difficulty';
import {
  getFirestoreDb,
  initFirebaseApp,
  isFirebaseEnabled,
} from '../firebase/app';
import { ensureAnonymousAuth, getCurrentUid } from '../firebase/auth';
import {
  getCacheLeaderboard,
  getCacheLocalRecords,
  getCacheProfile,
  isLeaderboardCacheLoading,
  isStorageCacheReady,
  setCacheLeaderboard,
  setCacheLocalRecords,
  setCacheProfile,
  setLeaderboardCacheLoading,
  setStorageCacheReady,
} from './cache';
import {
  getLocalPersonalBest,
  getLocalPlayerName,
  getLocalRecords,
  saveLocalPlayerName,
  upsertLocalRecord,
} from './local';
import { migrateLocalDataToFirestore } from './migrate';
import {
  fetchPlayerProfile,
  savePlayerProfile,
  updatePlayerBest,
  updatePlayerName,
} from './player-store';
import {
  fetchLeaderboard,
  updateLeaderboardName,
  upsertLeaderboardEntry,
} from './records-store';
import {
  createDefaultProfile,
  deduplicateLeaderboardByName,
  TOP_RECORDS_PER_LEVEL,
  type GameRecord,
  type PlayerProfile,
} from './types';

export { TOP_RECORDS_PER_LEVEL, type GameRecord } from './types';

type StorageTask = () => Promise<void>;

const pendingTasks: StorageTask[] = [];
let isProcessingQueue = false;
let currentUid: string | null = null;

function hydrateFromLocalStorage(): void {
  const localName = getLocalPlayerName();
  const localRecords = getLocalRecords();
  const profile = createDefaultProfile(localName);

  if (localName) {
    const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
    levels.forEach((level) => {
      profile.bests[level] = getLocalPersonalBest(localName, level);
    });
  }

  setCacheProfile(profile);
  setCacheLocalRecords(localRecords);
}

function enqueueTask(task: StorageTask): void {
  pendingTasks.push(task);
  void processQueue();
}

async function processQueue(): Promise<void> {
  if (isProcessingQueue || pendingTasks.length === 0) {
    return;
  }

  if (!isFirebaseEnabled() || !currentUid) {
    return;
  }

  const db = getFirestoreDb();
  if (!db) {
    return;
  }

  isProcessingQueue = true;

  while (pendingTasks.length > 0) {
    const task = pendingTasks.shift();
    if (!task) {
      continue;
    }

    try {
      await task();
    } catch (error) {
      console.error('Firebase storage task failed', error);
      pendingTasks.unshift(task);
      break;
    }
  }

  isProcessingQueue = false;
}

async function loadAllLeaderboards(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    return;
  }

  setLeaderboardCacheLoading(true);

  try {
    const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
    const results = await Promise.all(
      levels.map(async (level) => ({
        level,
        records: await fetchLeaderboard(db, level),
      })),
    );

    results.forEach(({ level, records }) => {
      setCacheLeaderboard(level, records);
    });
  } catch (error) {
    console.error('Failed to load leaderboards', error);
  } finally {
    setLeaderboardCacheLoading(false);
  }
}

export async function initStorage(): Promise<void> {
  hydrateFromLocalStorage();

  if (!isFirebaseEnabled()) {
    setStorageCacheReady(true);
    return;
  }

  try {
    initFirebaseApp();
    currentUid = await ensureAnonymousAuth();

    const db = getFirestoreDb();
    if (!db || !currentUid) {
      setStorageCacheReady(true);
      return;
    }

    let profile = await fetchPlayerProfile(db, currentUid);
    if (!profile?.name) {
      profile = await migrateLocalDataToFirestore(db, currentUid);
    } else {
      await syncProfileBestsToLeaderboard(currentUid, profile);
    }

    setCacheProfile(profile);
    await loadAllLeaderboards();
    void processQueue();
  } catch (error) {
    console.error('Storage initialization failed', error);
  } finally {
    setStorageCacheReady(true);
  }
}

export function isStorageReady(): boolean {
  return isStorageCacheReady();
}

export function isLeaderboardLoading(): boolean {
  return isLeaderboardCacheLoading();
}

export function getSavedPlayerName(): string {
  return getCacheProfile().name || getLocalPlayerName();
}

export function getSelectedDifficulty(): DifficultyLevel | undefined {
  return getCacheProfile().selectedDifficulty;
}

export function savePlayerName(name: string): void {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return;
  }

  const profile = {
    ...getCacheProfile(),
    name: trimmedName,
  };

  setCacheProfile(profile);
  saveLocalPlayerName(trimmedName);

  const uid = currentUid ?? getCurrentUid();
  if (!uid || !isFirebaseEnabled()) {
    return;
  }

  enqueueTask(async () => {
    const db = getFirestoreDb();
    if (!db) {
      return;
    }

    const updatedProfile = await updatePlayerName(
      db,
      uid,
      trimmedName,
      getCacheProfile(),
    );
    setCacheProfile(updatedProfile);
    await updateLeaderboardName(db, uid, trimmedName);
    await loadAllLeaderboards();
  });
}

export function saveSelectedDifficulty(level: DifficultyLevel): void {
  const profile: PlayerProfile = {
    ...getCacheProfile(),
    selectedDifficulty: level,
  };

  setCacheProfile(profile);

  const uid = currentUid ?? getCurrentUid();
  if (!uid || !isFirebaseEnabled()) {
    return;
  }

  enqueueTask(async () => {
    const db = getFirestoreDb();
    if (!db) {
      return;
    }

    await savePlayerProfile(db, uid, profile);
  });
}

export function getPersonalBest(
  name: string,
  level: DifficultyLevel,
): number {
  const profile = getCacheProfile();
  const trimmedName = name.trim();

  if (profile.name && profile.name === trimmedName) {
    return profile.bests[level] ?? 0;
  }

  return getLocalPersonalBest(trimmedName, level);
}

function getProfileLeaderboardRecords(profile: PlayerProfile): GameRecord[] {
  const trimmedName = profile.name.trim();
  if (!trimmedName) {
    return [];
  }

  const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  return levels
    .filter((item) => profile.bests[item] > 0)
    .map((item) => ({
      name: trimmedName,
      level: item,
      score: profile.bests[item],
    }));
}

async function syncProfileBestsToLeaderboard(
  uid: string,
  profile: PlayerProfile,
): Promise<void> {
  const trimmedName = profile.name.trim();
  if (!trimmedName) {
    return;
  }

  const db = getFirestoreDb();
  if (!db) {
    return;
  }

  const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  await Promise.all(
    levels.map((level) =>
      upsertLeaderboardEntry(
        db,
        uid,
        level,
        trimmedName,
        profile.bests[level],
      ),
    ),
  );
}

function mergeTopRecords(
  level: DifficultyLevel,
  ...sources: GameRecord[][]
): GameRecord[] {
  const combined = sources
    .flat()
    .filter((record) => record.level === level);

  return deduplicateLeaderboardByName(combined);
}

function getLocalLeaderboardSources(level: DifficultyLevel): GameRecord[][] {
  const localRecords = getCacheLocalRecords().filter(
    (record) => record.level === level,
  );
  const profileRecords = getProfileLeaderboardRecords(getCacheProfile());

  return [localRecords, profileRecords];
}

function ensureCurrentPlayerVisible(
  records: GameRecord[],
  level: DifficultyLevel,
  limit: number,
): GameRecord[] {
  const trimmedName =
    getCacheProfile().name.trim() || getSavedPlayerName().trim();

  if (!trimmedName) {
    return records.slice(0, limit);
  }

  const top = records.slice(0, limit);
  const playerInTop = top.some(
    (record) => record.name === trimmedName && record.level === level,
  );

  if (playerInTop) {
    return top;
  }

  const playerBest = Math.max(
    getCacheProfile().bests[level] ?? 0,
    getLocalPersonalBest(trimmedName, level),
  );

  if (playerBest <= 0) {
    return top;
  }

  const playerRecord: GameRecord = {
    name: trimmedName,
    level,
    score: playerBest,
  };

  if (top.length < limit) {
    return deduplicateLeaderboardByName([...top, playerRecord], limit);
  }

  return deduplicateLeaderboardByName(
    [...top.slice(0, limit - 1), playerRecord],
    limit,
  );
}

export function getTopRecordsByLevel(
  level: DifficultyLevel,
  limit = TOP_RECORDS_PER_LEVEL,
): GameRecord[] {
  const sources = getLocalLeaderboardSources(level);

  if (isFirebaseEnabled()) {
    const leaderboard = getCacheLeaderboard(level);
    if (leaderboard !== undefined) {
      sources.unshift(leaderboard);
    }
  }

  const merged = mergeTopRecords(level, ...sources);

  return ensureCurrentPlayerVisible(merged, level, limit);
}

export function saveRecord(
  name: string,
  level: DifficultyLevel,
  score: number,
): void {
  const trimmedName = name.trim();
  if (!trimmedName || score <= 0) {
    return;
  }

  const localRecords = upsertLocalRecord(trimmedName, level, score);
  setCacheLocalRecords(localRecords);

  const profile = getCacheProfile();
  const profileName = profile.name.trim();
  const isCurrentPlayer =
    profileName === trimmedName || profileName.length === 0;

  if (isCurrentPlayer) {
    setCacheProfile({
      ...profile,
      name: profileName.length === 0 ? trimmedName : profile.name,
      bests: {
        ...profile.bests,
        [level]: Math.max(profile.bests[level], score),
      },
    });
  }

  const uid = currentUid ?? getCurrentUid();
  if (!uid || !isFirebaseEnabled()) {
    return;
  }

  enqueueTask(async () => {
    const db = getFirestoreDb();
    if (!db) {
      return;
    }

    const currentProfile = getCacheProfile();
    const profileForSave = currentProfile.name === trimmedName
      ? currentProfile
      : { ...currentProfile, name: trimmedName };

    await upsertLeaderboardEntry(db, uid, level, trimmedName, score);

    const updatedProfile = await updatePlayerBest(
      db,
      uid,
      level,
      score,
      profileForSave,
    );
    setCacheProfile(updatedProfile);

    const records = await fetchLeaderboard(db, level);
    setCacheLeaderboard(level, records);
  });
}

export async function refreshLeaderboard(level: DifficultyLevel): Promise<void> {
  if (!isFirebaseEnabled()) {
    return;
  }

  const db = getFirestoreDb();
  const uid = currentUid ?? getCurrentUid();
  if (!db || !uid) {
    return;
  }

  setLeaderboardCacheLoading(true);

  try {
    const records = await fetchLeaderboard(db, level);
    setCacheLeaderboard(level, records);
    void processQueue();
  } catch (error) {
    console.error('Failed to refresh leaderboard', error);
  } finally {
    setLeaderboardCacheLoading(false);
  }
}
