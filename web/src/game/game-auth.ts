import { SOUND_EVENTS } from '../audio/sound';
import { HAPTIC_EVENTS } from '../input/haptic';
import {
  ensureRandomPlayerNameForSession,
  getSavedPlayerName,
  PLAYER_NAME_VALIDATION_STATUS,
  getTopRecordsByLevel,
  prepareGameSession,
  resolveLevelTopScore,
  validatePlayerNameForStart,
  waitForStorageReady,
} from '../lib/storage';
import {
  DEATH_ANIM_DURATION,
  SHAKE_DURATION,
  SHAKE_INTENSITY,
} from './config';
import type { GameHost } from './game-host';
import { GAME_STATES } from './states';
import { transitionToState } from './state-transition';

const START_REENTRY_LOCK_MS = 450;
const LEGACY_DEFAULT_PLAYER_NAME = 'Игрок';

function isLegacyDefaultPlayerName(name: string): boolean {
  return name.trim().toLowerCase() === LEGACY_DEFAULT_PLAYER_NAME.toLowerCase();
}

async function validateSessionPlayerName(name: string): Promise<string | null> {
  const normalizedName = name.trim();
  if (!normalizedName || isLegacyDefaultPlayerName(normalizedName)) {
    return null;
  }

  const validation = await validatePlayerNameForStart(normalizedName);
  if (validation.status !== PLAYER_NAME_VALIDATION_STATUS.Success) {
    return null;
  }

  return getSavedPlayerName().trim() || normalizedName;
}

export async function startGameSession(host: GameHost): Promise<void> {
  const startAttemptAt = performance.now();
  if (host.currentState !== GAME_STATES.Splash) {
    console.warn('[game-start] Blocked start outside splash', {
      state: host.currentState,
      reason: 'state_guard',
    });
    return;
  }

  if (host.isStartingGame) {
    if (import.meta.env.DEV) {
      console.warn('[game-start] Blocked concurrent start attempt');
    }
    return;
  }

  host.isStartingGame = true;

  try {
    const prepareStartedAt = performance.now();
    const sessionResult = await prepareGameSession(host.selectedDifficulty);
    const prepareSessionMs = performance.now() - prepareStartedAt;
    if (!sessionResult.ok) {
      if (sessionResult.errorMessage) {
        host.messageOverlay.show(sessionResult.errorMessage);
      }

      if (import.meta.env.DEV) {
        console.info('[game-start][perf]', {
          result: 'blocked_session_prepare',
          prepareSessionMs: Number(prepareSessionMs.toFixed(1)),
          totalMs: Number((performance.now() - startAttemptAt).toFixed(1)),
        });
      }
      return;
    }

    const resolveNameStartedAt = performance.now();
    const name = await ensurePlayerNameForSession(host);
    const resolveNameMs = performance.now() - resolveNameStartedAt;
    if (!name) {
      host.messageOverlay.show('Имя игрока обязательно для начала игры.');

      if (import.meta.env.DEV) {
        console.info('[game-start][perf]', {
          result: 'cancelled_no_name',
          resolveNameMs: Number(resolveNameMs.toFixed(1)),
          totalMs: Number((performance.now() - startAttemptAt).toFixed(1)),
        });
      }
      return;
    }

    const beginGameStartedAt = performance.now();
    await beginGame(host, name, {
      skipSessionPrepare: true,
      prepareSessionMs,
    });
    const beginGameMs = performance.now() - beginGameStartedAt;
    const { currentState } = host as GameHost;

    if (import.meta.env.DEV) {
      console.info('[game-start][perf]', {
        result:
          currentState === GAME_STATES.Countdown
            ? 'started'
            : 'blocked_before_countdown',
        resolveNameMs: Number(resolveNameMs.toFixed(1)),
        beginGameMs: Number(beginGameMs.toFixed(1)),
        totalMs: Number((performance.now() - startAttemptAt).toFixed(1)),
      });
    }
  } catch (error) {
    console.error('Failed to start game session', error);
    host.messageOverlay.show('Не удалось начать игру. Попробуйте снова.');
  } finally {
    host.isStartingGame = false;
  }
}

export async function ensurePlayerNameForSession(
  host: GameHost,
): Promise<string | null> {
  const existingName = getSavedPlayerName().trim();
  const validatedExistingName = await validateSessionPlayerName(existingName);
  if (validatedExistingName) {
    return validatedExistingName;
  }

  await waitForStorageReady();

  const syncedName = getSavedPlayerName().trim();
  const validatedSyncedName = await validateSessionPlayerName(syncedName);
  if (validatedSyncedName) {
    return validatedSyncedName;
  }

  const resolvedName = await ensureRandomPlayerNameForSession();
  const validatedResolvedName = await validateSessionPlayerName(resolvedName ?? '');
  if (!validatedResolvedName) {
    return null;
  }

  host.syncStateFromStorage();
  host.layoutUi();
  return validatedResolvedName;
}

export async function openRecordsScreen(host: GameHost): Promise<void> {
  await waitForStorageReady();

  host.recordsLevelTab =
    host.lastScoredLevel ?? host.selectedDifficulty;
  host.recordsRefreshLevel = null;
  host.layoutUi();
  transitionToState(host, GAME_STATES.Records, { reason: 'open_records' });
}

interface BeginGameOptions {
  skipSessionPrepare?: boolean;
  prepareSessionMs?: number;
}

export async function beginGame(
  host: GameHost,
  name: string,
  options?: BeginGameOptions,
): Promise<void> {
  let prepareSessionMs = options?.prepareSessionMs ?? 0;
  if (!options?.skipSessionPrepare) {
    const prepareStartedAt = performance.now();
    const sessionResult = await prepareGameSession(host.selectedDifficulty);
    prepareSessionMs = performance.now() - prepareStartedAt;

    if (!sessionResult.ok) {
      if (sessionResult.errorMessage) {
        host.messageOverlay.show(sessionResult.errorMessage);
      }

      if (import.meta.env.DEV) {
        console.info('[game-start][perf]', {
          result: 'blocked_session_prepare',
          prepareSessionMs: Number(prepareSessionMs.toFixed(1)),
        });
      }

      return;
    }
  }

  host.playerName = name;
  host.isResolvingLevelTop = false;
  host.levelTopScore = getTopRecordsByLevel(host.selectedDifficulty)[0]?.score ?? 0;
  host.score = 0;
  host.gameFrames = 0;
  host.hasSavedCurrentScore = false;
  host.deathAnimTimer = 0;
  host.shakeTimer = 0;
  host.isNewBest = false;
  host.scoreUiTimer = 0;
  host.layoutUi();
  transitionToState(host, GAME_STATES.Countdown, {
    reason: 'begin_game',
    lockStartForMs: START_REENTRY_LOCK_MS,
  });
  host.countdownStep = 0;
  host.countdownTimer = 0;
  host.particles.clear();
  host.gooseTrail.clear();
  host.pipes.reset();
  host.pipes.seedInitial(host.viewport.logicalWidth, host.viewport.logicalHeight);

  if (import.meta.env.DEV) {
    console.info('[game-start][perf]', {
      result: 'countdown_entered',
      prepareSessionMs: Number(prepareSessionMs.toFixed(1)),
    });
  }

  const startedLevel = host.selectedDifficulty;
  void resolveLevelTopScore(startedLevel)
    .then((topScore) => {
      if (host.selectedDifficulty !== startedLevel) {
        return;
      }

      host.levelTopScore = topScore;
    })
    .catch((error) => {
      console.error('Failed to resolve level top score at game start', error);
    });
}

export function startActiveGame(host: GameHost): void {
  transitionToState(host, GAME_STATES.Game, { reason: 'countdown_done' });
  host.countdownStep = -1;
  host.countdownTimer = 0;
  host.goose.jump();
  host.particles.emitFlap(host.goose.x, host.goose.y);
  host.sound.play(SOUND_EVENTS.Jump);
  host.haptic.pulse(HAPTIC_EVENTS.Jump);
}

export function triggerDeath(host: GameHost): void {
  transitionToState(host, GAME_STATES.Score, { reason: 'collision_or_ground' });
  host.deathAnimTimer = DEATH_ANIM_DURATION;
  host.scoreUiTimer = 0;
  host.shakeTimer = SHAKE_DURATION;
  host.shakeIntensity = SHAKE_INTENSITY;
  host.particles.emitDeath(host.goose.x, host.goose.y);
  host.sound.play(SOUND_EVENTS.Hit);
  host.haptic.pulse(HAPTIC_EVENTS.Hit);
}
