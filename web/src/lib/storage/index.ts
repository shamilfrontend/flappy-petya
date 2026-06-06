import type { DifficultyLevel } from '../../game/difficulty';
import {
  getFirestoreDb,
  initFirebaseApp,
  isFirebaseEnabled,
} from '../firebase/app';
import {
  getAuthDisplayName,
  getAuthErrorMessage,
  getCurrentUid,
  initAuth,
  isUserAuthenticated,
  signInWithGoogle,
  signOutUser,
  waitForAuthReady,
} from '../firebase/auth';
import {
  clearLeaderboardCache,
  getCacheLeaderboard,
  getCacheProfile,
  isLeaderboardCacheLoading,
  isStorageCacheReady,
  setCacheLeaderboard,
  setCacheProfile,
  setLeaderboardCacheLoading,
  setStorageCacheReady,
} from './cache';
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
  MAX_VALID_SCORE,
  TOP_RECORDS_PER_LEVEL,
  type GameRecord,
  type PlayerProfile,
} from './types';

export {
  MAX_VALID_SCORE,
  TOP_RECORDS_PER_LEVEL,
  type GameRecord,
} from './types';

type StorageTask = () => Promise<void>;

const pendingTasks: StorageTask[] = [];
let isProcessingQueue = false;
let currentUid: string | null = null;

function resetStorageCache(): void {
  setCacheProfile(createDefaultProfile());
  clearLeaderboardCache();
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
      syncLeaderboardCache(level, records);
    });
  } catch (error) {
    console.error('Failed to load leaderboards', error);
  } finally {
    setLeaderboardCacheLoading(false);
  }
}

async function loadStorageForUser(uid: string): Promise<void> {
  currentUid = uid;

  const db = getFirestoreDb();
  if (!db) {
    return;
  }

  const googleName = getAuthDisplayName();
  let profile = await fetchPlayerProfile(db, uid);

  if (!profile?.name) {
    profile = await migrateLocalDataToFirestore(db, uid, googleName);
  } else if (!profile.name.trim() && googleName) {
    profile = { ...profile, name: googleName };
    await savePlayerProfile(db, uid, profile);
  } else {
    await syncProfileBestsToLeaderboard(uid, profile);
  }

  setCacheProfile(profile);
  await loadAllLeaderboards();
  void processQueue();
}

export async function initStorage(): Promise<void> {
  resetStorageCache();

  if (!isFirebaseEnabled()) {
    setStorageCacheReady(true);
    return;
  }

  try {
    initFirebaseApp();
    initAuth();
    await waitForAuthReady();

    const uid = getCurrentUid();
    if (uid) {
      await loadStorageForUser(uid);
    }
  } catch (error) {
    console.error('Storage initialization failed', error);
  } finally {
    setStorageCacheReady(true);
  }
}

export function isAuthRequired(): boolean {
  return isFirebaseEnabled();
}

export function isUserSignedIn(): boolean {
  return isFirebaseEnabled() && isUserAuthenticated();
}

export interface SignInResult {
  ok: boolean;
  errorMessage?: string;
}

export async function signInWithGoogleAccount(): Promise<SignInResult> {
  if (!isFirebaseEnabled()) {
    return { ok: false, errorMessage: 'Firebase не настроен.' };
  }

  try {
    const user = await signInWithGoogle();
    if (!user) {
      return { ok: false };
    }

    await loadStorageForUser(user.uid);
    return { ok: true };
  } catch (error) {
    console.error('Google account sign-in failed', error);
    return { ok: false, errorMessage: getAuthErrorMessage(error) };
  }
}

export async function signOutFromGame(): Promise<void> {
  pendingTasks.length = 0;
  isProcessingQueue = false;
  currentUid = null;
  resetStorageCache();

  if (isFirebaseEnabled()) {
    await signOutUser();
  }
}

export function isStorageReady(): boolean {
  return isStorageCacheReady();
}

export function isLeaderboardLoading(): boolean {
  return isLeaderboardCacheLoading();
}

export function isFirebaseSyncPending(): boolean {
  return pendingTasks.length > 0 || isProcessingQueue;
}

export function getSavedPlayerName(): string {
  if (isFirebaseEnabled()) {
    return getCacheProfile().name || getAuthDisplayName();
  }

  return getCacheProfile().name;
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

function isCurrentPlayerName(name: string): boolean {
  const trimmedName = name.trim();
  const profile = getCacheProfile();
  const profileName = profile.name.trim();
  const savedName = getSavedPlayerName().trim();

  return (
    (profileName.length > 0 && profileName === trimmedName)
    || (profileName.length === 0 && savedName === trimmedName)
  );
}

export function getPersonalBest(
  name: string,
  level: DifficultyLevel,
): number {
  const trimmedName = name.trim();

  if (isCurrentPlayerName(trimmedName)) {
    return getCacheProfile().bests[level] ?? 0;
  }

  const leaderboard = getCacheLeaderboard(level) ?? [];
  const record = leaderboard.find(
    (item) => item.name === trimmedName && item.level === level,
  );

  return record?.score ?? 0;
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

function syncLeaderboardCache(
  level: DifficultyLevel,
  remoteRecords: GameRecord[],
): void {
  setCacheLeaderboard(
    level,
    mergeTopRecords(
      level,
      remoteRecords,
      getProfileLeaderboardRecords(getCacheProfile()),
    ),
  );
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

  const playerBest = getPersonalBest(trimmedName, level);

  if (playerBest <= 0) {
    return records.slice(0, limit);
  }

  const withoutPlayer = records.filter(
    (record) => record.name !== trimmedName,
  );
  const playerRecord: GameRecord = {
    name: trimmedName,
    level,
    score: playerBest,
  };
  const merged = deduplicateLeaderboardByName(
    [...withoutPlayer, playerRecord],
    limit,
  );

  if (merged.some((record) => record.name === trimmedName)) {
    return merged;
  }

  const top = withoutPlayer.slice(0, limit);

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
  const sources: GameRecord[][] = [
    getProfileLeaderboardRecords(getCacheProfile()),
  ];

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
  if (!trimmedName || score <= 0 || score > MAX_VALID_SCORE) {
    return;
  }

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
    syncLeaderboardCache(level, records);
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
    syncLeaderboardCache(level, records);
    void processQueue();
  } catch (error) {
    console.error('Failed to refresh leaderboard', error);
  } finally {
    setLeaderboardCacheLoading(false);
  }
}
