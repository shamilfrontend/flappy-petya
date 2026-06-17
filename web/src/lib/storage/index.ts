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
import {
  getLocalPlayerName,
  getLocalSelectedDifficulty,
  getLocalSelectedRecordsLevel,
  saveLocalPlayerName,
  saveLocalSelectedDifficulty,
  saveLocalSelectedRecordsLevel,
} from './local';
import { migrateLocalDataToFirestore } from './migrate';
import {
  fetchPlayerProfile,
  savePlayerProfile,
  updatePlayerName,
} from './player-store';
import {
  fetchLeaderboard,
  updateLeaderboardName,
  upsertLeaderboardEntry,
} from './records-store';
import {
  getScoreValidationFailure,
  isValidScoreValue,
  SCORE_VALIDATION_FAILURES,
} from './score-validation';
import {
  clearCachedSession,
  completeGameSession,
  getCachedActiveSession,
  startGameSession,
} from './session-store';
import {
  createDefaultProfile,
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

export const RECORD_SYNC_STATUS = {
  Idle: 'idle',
  Pending: 'pending',
  Synced: 'synced',
  Rejected: 'rejected',
} as const;

export type RecordSyncState =
  typeof RECORD_SYNC_STATUS[keyof typeof RECORD_SYNC_STATUS];

export interface RecordSyncStatus {
  state: RecordSyncState;
  level: DifficultyLevel;
  message: string;
  updatedAtMs: number;
}

const QUEUE_RETRY_BASE_MS = 2000;
const QUEUE_RETRY_MAX_MS = 30000;

const pendingTasks: StorageTask[] = [];
let isProcessingQueue = false;
let currentUid: string | null = null;
let queueRetryTimer: ReturnType<typeof setTimeout> | null = null;
let queueRetryAttempt = 0;
let isRecoveringAuthSession = false;
let leaderboardLoadingCount = 0;
const ONLINE_HANDLER_KEY = '__flappyPetyaStorageOnlineHandler';
const SYNC_STATUS_TTL_MS = 10000;
let lastRecordSyncStatus: RecordSyncStatus | null = null;

function setRecordSyncStatus(
  state: RecordSyncState,
  level: DifficultyLevel,
  message: string,
): void {
  lastRecordSyncStatus = {
    state,
    level,
    message,
    updatedAtMs: Date.now(),
  };
}

function clearRecordSyncStatus(): void {
  lastRecordSyncStatus = null;
}

export function getRecordSyncStatus(
  level: DifficultyLevel,
): RecordSyncStatus | null {
  if (!lastRecordSyncStatus || lastRecordSyncStatus.level !== level) {
    return null;
  }

  if (Date.now() - lastRecordSyncStatus.updatedAtMs > SYNC_STATUS_TTL_MS) {
    clearRecordSyncStatus();
    return null;
  }

  return lastRecordSyncStatus;
}

function getScoreValidationMessage(
  failure: ReturnType<typeof getScoreValidationFailure>,
): string {
  if (failure === SCORE_VALIDATION_FAILURES.InvalidGameFrames) {
    return 'Рекорд не синхронизирован: проверка времени игры не пройдена.';
  }

  if (failure === SCORE_VALIDATION_FAILURES.MinWallClockNotReached) {
    return 'Рекорд не синхронизирован: партия завершилась слишком быстро.';
  }

  return 'Рекорд не синхронизирован: некорректные данные счёта.';
}

function beginLeaderboardLoading(): void {
  leaderboardLoadingCount += 1;
  setLeaderboardCacheLoading(true);
}

function endLeaderboardLoading(): void {
  leaderboardLoadingCount = Math.max(0, leaderboardLoadingCount - 1);
  setLeaderboardCacheLoading(leaderboardLoadingCount > 0);
}

function resetStorageCache(): void {
  setCacheProfile(createDefaultProfile());
  clearLeaderboardCache();
  clearRecordSyncStatus();
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

const LEADERBOARD_FETCH_ATTEMPTS = 3;
const LEADERBOARD_FETCH_RETRY_MS = 400;

async function loadAllLeaderboards(): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    return;
  }

  beginLeaderboardLoading();

  try {
    const levels: DifficultyLevel[] = ['easy', 'medium', 'hard'];
    await Promise.all(levels.map((level) => fetchAndCacheLeaderboard(level)));
  } catch (error) {
    console.error('Failed to load leaderboards', error);
  } finally {
    endLeaderboardLoading();
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

    const localSelectedDifficulty = getLocalSelectedDifficulty();
    const localSelectedRecordsLevel = getLocalSelectedRecordsLevel();

    if (localSelectedDifficulty && !profile.selectedDifficulty) {
      profile = {
        ...profile,
        selectedDifficulty: localSelectedDifficulty,
      };
    }

    if (localSelectedRecordsLevel && !profile.selectedRecordsLevel) {
      profile = {
        ...profile,
        selectedRecordsLevel: localSelectedRecordsLevel,
      };
    }

    if (profile.selectedDifficulty) {
      saveLocalSelectedDifficulty(profile.selectedDifficulty);
    }

    if (profile.selectedRecordsLevel) {
      saveLocalSelectedRecordsLevel(profile.selectedRecordsLevel);
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
  const localSelectedDifficulty = getLocalSelectedDifficulty();
  const localSelectedRecordsLevel = getLocalSelectedRecordsLevel();

  if (!localName && !localSelectedDifficulty && !localSelectedRecordsLevel) {
    return;
  }

  const currentProfile = getCacheProfile();
  setCacheProfile({
    ...currentProfile,
    name: localName || currentProfile.name,
    selectedDifficulty:
      localSelectedDifficulty ?? currentProfile.selectedDifficulty,
    selectedRecordsLevel:
      localSelectedRecordsLevel ?? currentProfile.selectedRecordsLevel,
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

export async function waitForStorageReady(
  timeoutMs = 10000,
): Promise<void> {
  if (isStorageCacheReady()) {
    return;
  }

  const startedAt = Date.now();

  await new Promise<void>((resolve) => {
    const timer = setInterval(() => {
      if (isStorageCacheReady() || Date.now() - startedAt >= timeoutMs) {
        clearInterval(timer);
        resolve();
      }
    }, 50);
  });
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

export function getSelectedRecordsLevel(): DifficultyLevel | undefined {
  return getCacheProfile().selectedRecordsLevel;
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
  saveLocalSelectedDifficulty(level);

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

export function saveSelectedRecordsLevel(level: DifficultyLevel): void {
  const profile: PlayerProfile = {
    ...getCacheProfile(),
    selectedRecordsLevel: level,
  };

  setCacheProfile(profile);
  saveLocalSelectedRecordsLevel(level);

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
  const trimmedName = name.trim();
  if (!trimmedName) {
    return 0;
  }

  const record = (getCacheLeaderboard(level) ?? []).find(
    (item) => item.name === trimmedName && item.level === level,
  );

  return record?.score ?? 0;
}

const inflightLeaderboardFetches = new Map<
  DifficultyLevel,
  Promise<GameRecord[]>
>();

function applyLeaderboardCache(
  level: DifficultyLevel,
  records: GameRecord[],
): GameRecord[] {
  const previousRecords = getCacheLeaderboard(level);

  if (records.length === 0) {
    return previousRecords ?? [];
  }

  setCacheLeaderboard(level, records);

  return records;
}

async function fetchAndCacheLeaderboard(
  level: DifficultyLevel,
): Promise<GameRecord[]> {
  if (!isFirebaseEnabled()) {
    return getCacheLeaderboard(level) ?? [];
  }

  const inflight = inflightLeaderboardFetches.get(level);
  if (inflight) {
    return inflight;
  }

  const promise = (async () => {
    await waitForAuthReady();

    const db = getFirestoreDb();
    if (!db) {
      throw new Error('Firestore is not initialized');
    }

    for (let attempt = 0; attempt < LEADERBOARD_FETCH_ATTEMPTS; attempt += 1) {
      const records = await fetchLeaderboard(db, level);
      const cachedRecords = applyLeaderboardCache(level, records);

      if (cachedRecords.length > 0) {
        return cachedRecords;
      }

      if (attempt < LEADERBOARD_FETCH_ATTEMPTS - 1) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, LEADERBOARD_FETCH_RETRY_MS * (attempt + 1));
        });
      }
    }

    return getCacheLeaderboard(level) ?? [];
  })();

  inflightLeaderboardFetches.set(level, promise);

  try {
    return await promise;
  } finally {
    if (inflightLeaderboardFetches.get(level) === promise) {
      inflightLeaderboardFetches.delete(level);
    }
  }
}

export async function resolveLevelTopScore(
  level: DifficultyLevel,
): Promise<number> {
  const records = await fetchAndCacheLeaderboard(level);

  return records[0]?.score ?? 0;
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

  try {
    await refreshLeaderboard(level);
  } catch (error) {
    console.error('Failed to refresh leaderboard before game', error);
  }

  return { ok: true };
}

export function getTopRecordsByLevel(
  level: DifficultyLevel,
  limit = TOP_RECORDS_PER_LEVEL,
): GameRecord[] {
  return (getCacheLeaderboard(level) ?? []).slice(0, limit);
}

export function saveRecord(
  name: string,
  level: DifficultyLevel,
  score: number,
  gameFrames: number,
): void {
  const trimmedName = name.trim();
  if (!trimmedName) {
    setRecordSyncStatus(
      RECORD_SYNC_STATUS.Rejected,
      level,
      'Рекорд не синхронизирован: имя игрока не задано.',
    );
    return;
  }

  if (!isValidScoreValue(score)) {
    setRecordSyncStatus(
      RECORD_SYNC_STATUS.Rejected,
      level,
      'Рекорд не синхронизирован: некорректное значение очков.',
    );
    return;
  }

  const uid = currentUid ?? getCurrentUid();
  const usesFirebase = Boolean(uid && isFirebaseEnabled());

  if (!usesFirebase) {
    setRecordSyncStatus(
      RECORD_SYNC_STATUS.Rejected,
      level,
      'Рекорд не синхронизирован: Firebase недоступен.',
    );
    return;
  }

  const session = getCachedActiveSession();
  if (!session || session.level !== level) {
    setRecordSyncStatus(
      RECORD_SYNC_STATUS.Rejected,
      level,
      'Рекорд не синхронизирован: не найдена активная сессия уровня.',
    );
    return;
  }

  const validationFailure = getScoreValidationFailure(
    score,
    gameFrames,
    session.startedAtMs,
    Date.now(),
  );
  if (validationFailure) {
    setRecordSyncStatus(
      RECORD_SYNC_STATUS.Rejected,
      level,
      getScoreValidationMessage(validationFailure),
    );
    return;
  }

  setRecordSyncStatus(
    RECORD_SYNC_STATUS.Pending,
    level,
    'Обновление...',
  );

  enqueueTask(async () => {
    const db = getFirestoreDb();
    if (!db || !uid) {
      setRecordSyncStatus(
        RECORD_SYNC_STATUS.Rejected,
        level,
        'Рекорд не синхронизирован: нет подключения к серверу.',
      );
      return;
    }

    try {
      await upsertLeaderboardEntry(
        db,
        uid,
        level,
        trimmedName,
        score,
        gameFrames,
      );

      await completeGameSession(db, uid);
      const records = await fetchAndCacheLeaderboard(level);
      applyLeaderboardCache(level, records);
      setRecordSyncStatus(
        RECORD_SYNC_STATUS.Synced,
        level,
        'Рекорд синхронизирован с leaderboard.',
      );
    } catch (error) {
      if (isFirestorePermissionError(error)) {
        console.warn('Record sync rejected by Firestore rules', error);
        setRecordSyncStatus(
          RECORD_SYNC_STATUS.Rejected,
          level,
          'Рекорд отклонён сервером: проверьте имя и условия сессии.',
        );
        return;
      }

      setRecordSyncStatus(
        RECORD_SYNC_STATUS.Pending,
        level,
        'Синхронизация временно недоступна, повторим автоматически...',
      );
      throw error;
    }
  });
}

export async function refreshLeaderboard(
  level: DifficultyLevel,
): Promise<GameRecord[]> {
  if (!isFirebaseEnabled()) {
    return getTopRecordsByLevel(level);
  }

  const uid = currentUid ?? getCurrentUid();
  if (!uid) {
    return getTopRecordsByLevel(level);
  }

  beginLeaderboardLoading();

  try {
    await fetchAndCacheLeaderboard(level);
    void processQueue();
  } catch (error) {
    console.error('Failed to refresh leaderboard', error);
  } finally {
    endLeaderboardLoading();
  }

  return getTopRecordsByLevel(level);
}
