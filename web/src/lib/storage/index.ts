import type { DifficultyLevel } from '../../game/difficulty';
import {
  getFirestoreDb,
  initFirebaseApp,
  isFirebaseEnabled,
} from '../firebase/app';
import {
  getCurrentUid,
  initAuth,
  signInAnonymouslyUser,
  signOutUser,
  waitForAuthReady,
} from '../firebase/auth';
import { isFirestorePermissionError } from '../firebase/errors';
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
import { getLocalPlayerName, saveLocalPlayerName } from './local';
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
  hasMinWallClockElapsed,
  isValidGameFrames,
  isValidScoreValue,
} from './score-validation';
import {
  clearCachedSession,
  completeGameSession,
  getCachedActiveSession,
  startGameSession,
} from './session-store';
import {
  createDefaultProfile,
  deduplicateLeaderboardByName,
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

const QUEUE_RETRY_BASE_MS = 2000;
const QUEUE_RETRY_MAX_MS = 30000;

const pendingTasks: StorageTask[] = [];
let isProcessingQueue = false;
let currentUid: string | null = null;
let queueRetryTimer: ReturnType<typeof setTimeout> | null = null;
let queueRetryAttempt = 0;
let isRecoveringAuthSession = false;
const ONLINE_HANDLER_KEY = '__flappyPetyaStorageOnlineHandler';

function resetStorageCache(): void {
  setCacheProfile(createDefaultProfile());
  clearLeaderboardCache();
}

function clearQueueRetryTimer(): void {
  if (queueRetryTimer !== null) {
    clearTimeout(queueRetryTimer);
    queueRetryTimer = null;
  }
}

function clearQueueState(): void {
  pendingTasks.length = 0;
  isProcessingQueue = false;
  queueRetryAttempt = 0;
  clearQueueRetryTimer();
}

function scheduleQueueRetry(): void {
  clearQueueRetryTimer();

  const delay = Math.min(
    QUEUE_RETRY_BASE_MS * 2 ** queueRetryAttempt,
    QUEUE_RETRY_MAX_MS,
  );
  queueRetryAttempt += 1;

  queueRetryTimer = setTimeout(() => {
    queueRetryTimer = null;
    void processQueue();
  }, delay);
}

function handleOnline(): void {
  if (pendingTasks.length === 0) {
    return;
  }

  queueRetryAttempt = 0;
  clearQueueRetryTimer();
  void processQueue();
}

function registerOnlineListener(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const windowState = window as typeof window & Record<string, (() => void) | undefined>;
  const previousHandler = windowState[ONLINE_HANDLER_KEY];

  if (previousHandler) {
    window.removeEventListener('online', previousHandler);
  }

  windowState[ONLINE_HANDLER_KEY] = handleOnline;
  window.addEventListener('online', handleOnline);
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
  let hadFailure = false;

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
      hadFailure = true;
      break;
    }
  }

  isProcessingQueue = false;

  if (hadFailure && pendingTasks.length > 0) {
    scheduleQueueRetry();
  } else if (pendingTasks.length === 0) {
    queueRetryAttempt = 0;
    clearQueueRetryTimer();
  }
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

async function clearStaleAuthSession(): Promise<void> {
  if (isRecoveringAuthSession) {
    console.warn('Auth session recovery already in progress, skipping retry');
    return;
  }

  isRecoveringAuthSession = true;

  try {
    clearQueueState();
    clearCachedSession();
    currentUid = null;
    resetStorageCache();
    await signOutUser();

    const user = await signInAnonymouslyUser();
    if (user?.uid) {
      await loadStorageForUser(user.uid);
    }
  } catch (error) {
    console.error('Failed to restore anonymous session', error);
  } finally {
    isRecoveringAuthSession = false;
  }
}

async function loadStorageForUser(uid: string): Promise<void> {
  currentUid = uid;

  const db = getFirestoreDb();
  if (!db) {
    return;
  }

  try {
    const localName = getLocalPlayerName();
    let profile = await fetchPlayerProfile(db, uid);

    if (!profile?.name) {
      profile = await migrateLocalDataToFirestore(db, uid);
    } else if (!profile.name.trim() && localName) {
      profile = { ...profile, name: localName };
      await savePlayerProfile(db, uid, profile);
    }

    if (profile.name.trim() && !localName) {
      saveLocalPlayerName(profile.name);
    }

    setCacheProfile(profile);
    await loadAllLeaderboards();
    void processQueue();
  } catch (error) {
    if (isFirestorePermissionError(error)) {
      console.warn(
        'Firestore access denied — сессия сброшена. Проверьте деплой firestore.rules и Anonymous Auth.',
        error,
      );
      await clearStaleAuthSession();
      return;
    }

    throw error;
  }
}

function hydrateProfileFromLocalStorage(): void {
  const localName = getLocalPlayerName();
  if (!localName) {
    return;
  }

  setCacheProfile({
    ...getCacheProfile(),
    name: localName,
  });
}

export async function initStorage(): Promise<void> {
  resetStorageCache();
  registerOnlineListener();
  hydrateProfileFromLocalStorage();

  if (!isFirebaseEnabled()) {
    setStorageCacheReady(true);
    return;
  }

  try {
    initFirebaseApp();
    initAuth();
    await waitForAuthReady();

    let uid = getCurrentUid();
    if (!uid) {
      const user = await signInAnonymouslyUser();
      uid = user?.uid ?? null;
    }

    if (uid) {
      await loadStorageForUser(uid);
    }
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

export function isFirebaseSyncPending(): boolean {
  return pendingTasks.length > 0 || isProcessingQueue;
}

export function getSavedPlayerName(): string {
  return getLocalPlayerName() || getCacheProfile().name;
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

export interface PrepareGameSessionResult {
  ok: boolean;
  errorMessage?: string;
}

export async function prepareGameSession(
  level: DifficultyLevel,
): Promise<PrepareGameSessionResult> {
  if (!isFirebaseEnabled()) {
    return { ok: true };
  }

  const uid = currentUid ?? getCurrentUid();
  if (!uid) {
    return { ok: true };
  }

  const db = getFirestoreDb();
  if (!db) {
    return { ok: false, errorMessage: 'Не удалось подключиться к серверу рекордов.' };
  }

  try {
    await startGameSession(db, uid, level);
    return { ok: true };
  } catch (error) {
    console.error('Failed to start game session', error);
    if (isFirestorePermissionError(error)) {
      return {
        ok: false,
        errorMessage: 'Не удалось начать игровую сессию. Проверьте подключение и правила Firestore.',
      };
    }

    return {
      ok: false,
      errorMessage: 'Не удалось начать игровую сессию. Попробуйте позже.',
    };
  }
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
  gameFrames: number,
): void {
  const trimmedName = name.trim();
  if (!trimmedName || !isValidScoreValue(score)) {
    return;
  }

  const uid = currentUid ?? getCurrentUid();
  const usesFirebase = Boolean(uid && isFirebaseEnabled());

  if (usesFirebase) {
    const session = getCachedActiveSession();
    if (!session || session.level !== level) {
      return;
    }

    if (!isValidGameFrames(score, gameFrames)) {
      return;
    }

    if (!hasMinWallClockElapsed(session.startedAtMs, Date.now(), score)) {
      return;
    }
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

  if (!usesFirebase) {
    return;
  }

  enqueueTask(async () => {
    const db = getFirestoreDb();
    if (!db || !uid) {
      return;
    }

    const currentProfile = getCacheProfile();
    const profileForSave = currentProfile.name === trimmedName
      ? currentProfile
      : { ...currentProfile, name: trimmedName };

    await upsertLeaderboardEntry(
      db,
      uid,
      level,
      trimmedName,
      score,
      gameFrames,
    );

    const updatedProfile = await updatePlayerBest(
      db,
      uid,
      level,
      score,
      profileForSave,
    );
    setCacheProfile(updatedProfile);

    await completeGameSession(db, uid);

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
