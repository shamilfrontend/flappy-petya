import type { DifficultyLevel } from '../../game/difficulty';
import {
  getSupabaseClient,
  initSupabaseClient,
  isSupabaseEnabled,
} from '../supabase/client';
import {
  getCurrentUid,
  initAuth,
  signInAnonymouslyUser,
  signOutUser,
  waitForAuthReady,
} from '../supabase/auth';
import { isSupabasePermissionError } from '../supabase/errors';
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
  clearLocalPlayerName,
  getLocalPlayerName,
  getLocalSelectedDifficulty,
  getLocalSelectedRecordsLevel,
  saveLocalPlayerName,
  saveLocalSelectedDifficulty,
  saveLocalSelectedRecordsLevel,
} from './local';
import {
  claimPlayerName,
  fetchPlayerProfile,
  savePlayerProfile,
  updatePlayerName,
  PLAYER_NAME_CLAIM_STATUS,
} from './player-store';
import {
  fetchLeaderboard,
  upsertLeaderboardEntry,
} from './records-store';
import { isValidScoreValue } from './score-validation';
import {
  createDefaultProfile,
  MAX_PLAYER_NAME_LENGTH,
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

function shouldRetryQueueTask(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return true;
  }

  const supabaseError = error as {
    status?: number;
    code?: string;
    message?: string;
    details?: string;
  };

  if (isSupabasePermissionError(error)) {
    return false;
  }

  const { status } = supabaseError;
  if (typeof status === 'number') {
    if (status >= 500 || status === 429) {
      return true;
    }

    if (status >= 400) {
      return false;
    }
  }

  const message = `${supabaseError.message ?? ''} ${supabaseError.details ?? ''}`
    .toLowerCase();

  if (
    message.includes('violates check constraint')
    || message.includes('violates not-null constraint')
    || message.includes('invalid input syntax')
  ) {
    return false;
  }

  return true;
}

async function processQueue(): Promise<void> {
  if (isProcessingQueue || pendingTasks.length === 0) {
    return;
  }

  if (!isSupabaseEnabled() || !currentUid) {
    return;
  }

  const db = getSupabaseClient();
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
      console.error('Supabase storage task failed', error);
      if (shouldRetryQueueTask(error)) {
        pendingTasks.unshift(task);
        hadFailure = true;
      }
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

function hasPendingQueueWork(): boolean {
  return isProcessingQueue || pendingTasks.length > 0;
}

async function drainQueueForLeaderboardSync(timeoutMs = 1500): Promise<void> {
  const startedAt = Date.now();

  while (hasPendingQueueWork()) {
    await processQueue();

    if (!hasPendingQueueWork()) {
      return;
    }

    if (Date.now() - startedAt >= timeoutMs) {
      return;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, 50);
    });
  }
}

const LEADERBOARD_FETCH_ATTEMPTS = 3;
const LEADERBOARD_FETCH_RETRY_MS = 400;

async function loadAllLeaderboards(): Promise<void> {
  const db = getSupabaseClient();
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
    currentUid = null;
    resetStorageCache();
    clearLocalPlayerName();
    await signOutUser();

    const anonymousUser = await signInAnonymouslyUser();
    const restoredUid = anonymousUser?.uid ?? getCurrentUid();
    if (!restoredUid) {
      console.warn('Failed to restore anonymous session: user id is missing');
      return;
    }

    await loadStorageForUser(restoredUid);
  } catch (error) {
    console.error('Failed to restore anonymous session', error);
  } finally {
    isRecoveringAuthSession = false;
  }
}

async function loadStorageForUser(uid: string): Promise<void> {
  currentUid = uid;

  const db = getSupabaseClient();
  if (!db) {
    return;
  }

  try {
    let profile = await fetchPlayerProfile(db, uid);
    if (!profile) {
      profile = createDefaultProfile();
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
    if (isSupabasePermissionError(error)) {
      console.warn(
        'Supabase access denied — сессия сброшена. Проверьте RLS-политики и Anonymous Auth.',
        error,
      );
      await clearStaleAuthSession();
      return;
    }

    throw error;
  }
}

function hydrateProfileFromLocalStorage(): void {
  const localSelectedDifficulty = getLocalSelectedDifficulty();
  const localSelectedRecordsLevel = getLocalSelectedRecordsLevel();

  if (!localSelectedDifficulty && !localSelectedRecordsLevel) {
    return;
  }

  const currentProfile = getCacheProfile();
  setCacheProfile({
    ...currentProfile,
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

  if (!isSupabaseEnabled()) {
    setStorageCacheReady(true);
    return;
  }

  try {
    initSupabaseClient();
    initAuth();
    await waitForAuthReady();
    let uid = getCurrentUid();
    if (!uid) {
      const anonymousUser = await signInAnonymouslyUser();
      uid = anonymousUser?.uid ?? getCurrentUid();
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

export function isRemoteSyncPending(): boolean {
  return pendingTasks.length > 0 || isProcessingQueue;
}

export function isFirebaseSyncPending(): boolean {
  return isRemoteSyncPending();
}

export function getSavedPlayerName(): string {
  return getLocalPlayerName() || getCacheProfile().name;
}

export function hasActiveAccountSession(): boolean {
  return Boolean(currentUid ?? getCurrentUid());
}

export function getSelectedDifficulty(): DifficultyLevel | undefined {
  return getCacheProfile().selectedDifficulty;
}

export function getSelectedRecordsLevel(): DifficultyLevel | undefined {
  return getCacheProfile().selectedRecordsLevel;
}

export function savePlayerName(name: string): void {
  const trimmedName = normalizePlayerName(name);
  if (!trimmedName) {
    return;
  }

  if (isPlayerNameTooLong(trimmedName)) {
    console.warn('Player name is too long and will not be saved', {
      maxLength: MAX_PLAYER_NAME_LENGTH,
      actualLength: trimmedName.length,
    });
    return;
  }

  const profile = {
    ...getCacheProfile(),
    name: trimmedName,
  };

  setCacheProfile(profile);
  saveLocalPlayerName(trimmedName);

  const uid = currentUid ?? getCurrentUid();
  if (!uid || !isSupabaseEnabled()) {
    return;
  }

  enqueueTask(async () => {
    const db = getSupabaseClient();
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
    await loadAllLeaderboards();
  });
}

export const PLAYER_NAME_VALIDATION_STATUS = {
  Success: 'success',
  Taken: 'taken',
  Unavailable: 'unavailable',
} as const;

export type PlayerNameValidationStatus =
  typeof PLAYER_NAME_VALIDATION_STATUS[keyof typeof PLAYER_NAME_VALIDATION_STATUS];

export interface PlayerNameValidationResult {
  status: PlayerNameValidationStatus;
  message?: string;
}

const PLAYER_NAME_TAKEN_MESSAGE =
  'такой пользователь уже есть, введите другое имя';
const PLAYER_NAME_UNAVAILABLE_MESSAGE =
  'Не удалось проверить имя. Попробуйте снова.';
const PLAYER_NAME_TOO_LONG_MESSAGE =
  `Имя слишком длинное (максимум ${MAX_PLAYER_NAME_LENGTH} символов).`;
const SESSION_PREPARE_ERROR_MESSAGE = 'Не удалось подготовить игровую сессию.';
const ANONYMOUS_NAME_PREFIX = 'Неопознанный';
const ANONYMOUS_NAME_CODE_LENGTH = 5;
const ANONYMOUS_NAME_SUFFIXES = [
  'енот',
  'суслик',
  'бобр',
  'ежик',
  'выдра',
  'лисенок',
  'пингвин',
  'лемур',
  'барсук',
  'котик',
  'сурикат',
  'ястреб',
  'волк',
  'рысь',
  'тигр',
  'леопард',
  'ягуар',
  'пума',
  'заяц',
  'кролик',
  'хомяк',
  'шиншилла',
  'норка',
  'ласка',
  'куница',
  'соболь',
  'ондатра',
  'манул',
  'койот',
  'шакал',
  'муравьед',
  'тапир',
  'кенгуру',
  'коала',
  'кабарга',
  'олень',
  'лось',
  'кабан',
  'бурундук',
  'белка',
  'дятел',
  'сокол',
  'орел',
  'филин',
  'чайка',
  'цапля',
  'аист',
  'альбатрос',
  'тюлень',
  'морж',
] as const;
const RANDOM_NAME_CLAIM_ATTEMPTS = 30;

function normalizePlayerName(name: string): string {
  return name.trim();
}

function isPlayerNameTooLong(name: string): boolean {
  return name.length > MAX_PLAYER_NAME_LENGTH;
}

function pickRandomAnonymousSuffix(): string {
  const index = Math.floor(Math.random() * ANONYMOUS_NAME_SUFFIXES.length);
  return ANONYMOUS_NAME_SUFFIXES[index] ?? ANONYMOUS_NAME_SUFFIXES[0];
}

function generateAnonymousNameCode(): string {
  const randomValue = Math.floor(Math.random() * (36 ** ANONYMOUS_NAME_CODE_LENGTH));
  return randomValue
    .toString(36)
    .padStart(ANONYMOUS_NAME_CODE_LENGTH, '0');
}

function buildRandomAnonymousName(): string {
  const randomAnimal = pickRandomAnonymousSuffix();
  const uniqueCode = generateAnonymousNameCode();
  const maxTailLength = Math.max(
    1,
    MAX_PLAYER_NAME_LENGTH - ANONYMOUS_NAME_PREFIX.length - 1,
  );
  const maxAnimalLength = Math.max(
    1,
    maxTailLength - uniqueCode.length - 1,
  );
  const animalPart = randomAnimal.slice(0, maxAnimalLength);
  const tail = `${animalPart}-${uniqueCode}`;

  return `${ANONYMOUS_NAME_PREFIX} ${tail}`.trim();
}

export async function ensureRandomPlayerNameForSession(): Promise<string | null> {
  const existingName = getSavedPlayerName().trim();
  if (existingName) {
    return existingName;
  }

  if (!isSupabaseEnabled()) {
    const fallbackName = buildRandomAnonymousName();
    savePlayerName(fallbackName);
    return fallbackName;
  }

  const uid = currentUid ?? getCurrentUid();
  const db = getSupabaseClient();
  if (!uid || !db) {
    return null;
  }

  for (let attempt = 0; attempt < RANDOM_NAME_CLAIM_ATTEMPTS; attempt += 1) {
    const candidate = buildRandomAnonymousName();
    const claimResult = await claimPlayerName(db, uid, candidate, getCacheProfile());

    if (
      claimResult.status === PLAYER_NAME_CLAIM_STATUS.Success
      && claimResult.profile
    ) {
      setCacheProfile(claimResult.profile);
      saveLocalPlayerName(claimResult.profile.name);
      return claimResult.profile.name;
    }

    if (claimResult.status === PLAYER_NAME_CLAIM_STATUS.Error) {
      console.error('Failed to claim random anonymous player name', claimResult.error);
      return null;
    }
  }

  return null;
}

export async function validatePlayerNameForStart(
  name: string,
): Promise<PlayerNameValidationResult> {
  const trimmedName = normalizePlayerName(name);
  if (!trimmedName) {
    return {
      status: PLAYER_NAME_VALIDATION_STATUS.Unavailable,
      message: 'Введите имя',
    };
  }

  if (isPlayerNameTooLong(trimmedName)) {
    return {
      status: PLAYER_NAME_VALIDATION_STATUS.Unavailable,
      message: PLAYER_NAME_TOO_LONG_MESSAGE,
    };
  }

  const uid = currentUid ?? getCurrentUid();
  const profile = getCacheProfile();

  // Если имя уже принадлежит текущему пользователю, повторная проверка не нужна.
  if (
    profile.name
    && profile.name.trim().toLowerCase() === trimmedName.toLowerCase()
  ) {
    return {
      status: PLAYER_NAME_VALIDATION_STATUS.Success,
    };
  }

  if (!isSupabaseEnabled()) {
    savePlayerName(trimmedName);
    return {
      status: PLAYER_NAME_VALIDATION_STATUS.Success,
    };
  }

  if (!uid) {
    return {
      status: PLAYER_NAME_VALIDATION_STATUS.Unavailable,
      message: PLAYER_NAME_UNAVAILABLE_MESSAGE,
    };
  }

  const db = getSupabaseClient();
  if (!db) {
    return {
      status: PLAYER_NAME_VALIDATION_STATUS.Unavailable,
      message: PLAYER_NAME_UNAVAILABLE_MESSAGE,
    };
  }

  const claimResult = await claimPlayerName(
    db,
    uid,
    trimmedName,
    profile,
  );

  if (claimResult.status === PLAYER_NAME_CLAIM_STATUS.Taken) {
    return {
      status: PLAYER_NAME_VALIDATION_STATUS.Taken,
      message: PLAYER_NAME_TAKEN_MESSAGE,
    };
  }

  if (
    claimResult.status === PLAYER_NAME_CLAIM_STATUS.Error
    || !claimResult.profile
  ) {
    console.error('Failed to validate player name', claimResult.error);
    return {
      status: PLAYER_NAME_VALIDATION_STATUS.Unavailable,
      message: PLAYER_NAME_UNAVAILABLE_MESSAGE,
    };
  }

  setCacheProfile(claimResult.profile);
  saveLocalPlayerName(trimmedName);

  return {
    status: PLAYER_NAME_VALIDATION_STATUS.Success,
  };
}

export function saveSelectedDifficulty(level: DifficultyLevel): void {
  const profile: PlayerProfile = {
    ...getCacheProfile(),
    selectedDifficulty: level,
  };

  setCacheProfile(profile);
  saveLocalSelectedDifficulty(level);

  const uid = currentUid ?? getCurrentUid();
  if (!uid || !isSupabaseEnabled() || !profile.name.trim()) {
    return;
  }

  enqueueTask(async () => {
    const db = getSupabaseClient();
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
  if (!uid || !isSupabaseEnabled() || !profile.name.trim()) {
    return;
  }

  enqueueTask(async () => {
    const db = getSupabaseClient();
    if (!db) {
      return;
    }

    await savePlayerProfile(db, uid, profile);
  });
}

export async function signOutCurrentPlayer(): Promise<void> {
  clearQueueState();
  currentUid = null;
  resetStorageCache();
  clearRecordSyncStatus();
  clearLocalPlayerName();

  if (!isSupabaseEnabled()) {
    return;
  }

  try {
    await signOutUser();
  } catch (error) {
    console.error('Failed to sign out current player', error);
  }
}

export function getPersonalBest(
  name: string,
  level: DifficultyLevel,
): number {
  const trimmedName = name.trim();
  const normalizedName = trimmedName.toLowerCase();
  if (!trimmedName) {
    return 0;
  }

  const record = (getCacheLeaderboard(level) ?? []).find(
    (item) => item.name.toLowerCase() === normalizedName && item.level === level,
  );

  return record?.score ?? 0;
}

const inflightLeaderboardFetches = new Map<
  DifficultyLevel,
  Promise<GameRecord[]>
>();

function invalidateInflightLeaderboard(level: DifficultyLevel): void {
  inflightLeaderboardFetches.delete(level);
}

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
  if (!isSupabaseEnabled()) {
    return getCacheLeaderboard(level) ?? [];
  }

  const inflight = inflightLeaderboardFetches.get(level);
  if (inflight) {
    return inflight;
  }

  const promise = (async () => {
    await waitForAuthReady();

    const db = getSupabaseClient();
    if (!db) {
      throw new Error('Supabase client is not initialized');
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

async function ensureAnonymousSessionReady(): Promise<boolean> {
  if (!isSupabaseEnabled()) {
    return false;
  }

  const existingUid = currentUid ?? getCurrentUid();
  if (existingUid) {
    return true;
  }

  try {
    const anonymousUser = await signInAnonymouslyUser();
    const uid = anonymousUser?.uid ?? getCurrentUid();
    if (!uid) {
      return false;
    }

    await loadStorageForUser(uid);
    return true;
  } catch (error) {
    console.error('Failed to restore anonymous session for game start', error);
    return false;
  }
}

export async function prepareGameSession(
  level: DifficultyLevel,
): Promise<PrepareGameSessionResult> {
  if (!isSupabaseEnabled()) {
    return {
      ok: false,
      errorMessage: SESSION_PREPARE_ERROR_MESSAGE,
    };
  }

  if (!(await ensureAnonymousSessionReady())) {
    return {
      ok: false,
      errorMessage: SESSION_PREPARE_ERROR_MESSAGE,
    };
  }

  void refreshLeaderboard(level).catch((error) => {
    console.error('Failed to refresh leaderboard before game', error);
  });

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
  void gameFrames;

  const normalizedName = normalizePlayerName(name);
  if (!normalizedName) {
    setRecordSyncStatus(
      RECORD_SYNC_STATUS.Rejected,
      level,
      'Рекорд не синхронизирован: имя игрока не задано.',
    );
    return;
  }

  if (isPlayerNameTooLong(normalizedName)) {
    setRecordSyncStatus(
      RECORD_SYNC_STATUS.Rejected,
      level,
      `Рекорд не синхронизирован: имя длиннее ${MAX_PLAYER_NAME_LENGTH} символов.`,
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
  const usesRemoteStorage = Boolean(uid && isSupabaseEnabled());

  if (!usesRemoteStorage) {
    setRecordSyncStatus(
      RECORD_SYNC_STATUS.Rejected,
      level,
      'Рекорд не синхронизирован: сервер рекордов недоступен.',
    );
    return;
  }

  setRecordSyncStatus(
    RECORD_SYNC_STATUS.Pending,
    level,
    'Обновление...',
  );

  enqueueTask(async () => {
    const db = getSupabaseClient();
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
        score,
      );

      invalidateInflightLeaderboard(level);
      const records = await fetchAndCacheLeaderboard(level);
      applyLeaderboardCache(level, records);
      setRecordSyncStatus(
        RECORD_SYNC_STATUS.Synced,
        level,
        'Рекорд синхронизирован с leaderboard.',
      );
    } catch (error) {
      if (isSupabasePermissionError(error)) {
        console.warn('Record sync rejected by Supabase RLS', error);
        setRecordSyncStatus(
          RECORD_SYNC_STATUS.Rejected,
          level,
          'Рекорд отклонён сервером: проверьте права доступа.',
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
  if (!isSupabaseEnabled()) {
    return getTopRecordsByLevel(level);
  }

  const uid = currentUid ?? getCurrentUid();
  if (!uid) {
    return getTopRecordsByLevel(level);
  }

  beginLeaderboardLoading();

  try {
    await drainQueueForLeaderboardSync();
    invalidateInflightLeaderboard(level);
    await fetchAndCacheLeaderboard(level);
  } catch (error) {
    console.error('Failed to refresh leaderboard', error);
  } finally {
    endLeaderboardLoading();
  }

  return getTopRecordsByLevel(level);
}
