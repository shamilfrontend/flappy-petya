import { SOUND_EVENTS } from '../audio/sound';
import { HAPTIC_EVENTS } from '../input/haptic';
import { refreshLeaderboard, resolveLevelTopScore, saveRecord } from '../lib/storage';
import { announceGameMessage } from '../ui/game-announcer';
import {
  COUNTDOWN_STEP_DURATION,
  COUNTDOWN_STEPS,
  GROUND_HEIGHT,
  SCORE_PULSE_DURATION,
  SCORE_UI_ANIM_DURATION,
  TRANSITION_DURATION,
} from './config';
import { startActiveGame, triggerDeath } from './game-auth';
import type { GameHost } from './game-host';
import { GAME_STATES } from './states';

function finalizeScoreScreen(host: GameHost, levelTopScore: number): void {
  if (host.currentState !== GAME_STATES.Score || host.hasSavedCurrentScore) {
    host.isResolvingLevelTop = false;
    return;
  }

  const baselineTopScore = Math.max(0, levelTopScore);
  host.isNewBest = host.score > 0 && host.score > baselineTopScore;
  host.levelTopScore = Math.max(baselineTopScore, host.score);

  if (host.score > 0 && host.playerName.trim()) {
    saveRecord(
      host.playerName,
      host.selectedDifficulty,
      host.score,
      host.gameFrames,
    );
    host.lastScoredLevel = host.selectedDifficulty;
  }

  if (host.isNewBest) {
    host.sound.play(SOUND_EVENTS.NewBest);
    announceGameMessage(`Новый рекорд! Счёт: ${host.score}`);
  } else {
    announceGameMessage(`Игра окончена. Счёт: ${host.score}`);
  }

  host.hasSavedCurrentScore = true;
  host.isResolvingLevelTop = false;
}

function startScoreResolution(host: GameHost): void {
  host.isResolvingLevelTop = true;
  const baselineTopScore = host.levelTopScore;

  void resolveLevelTopScore(host.selectedDifficulty)
    .then((freshTopScore) => {
      finalizeScoreScreen(host, Math.max(baselineTopScore, freshTopScore));
    })
    .catch((error) => {
      console.error('Failed to resolve score screen leaderboard', error);
      finalizeScoreScreen(host, baselineTopScore);
    });
}

export function updateGame(host: GameHost, dt: number): void {
  const { logicalHeight } = host.viewport;
  host.frames += dt;

  if (host.currentState === GAME_STATES.Records) {
    const shouldRefreshRecords =
      host.previousState !== GAME_STATES.Records
      || host.recordsRefreshLevel !== host.recordsLevelTab;

    if (shouldRefreshRecords) {
      host.recordsRefreshLevel = host.recordsLevelTab;
      void refreshLeaderboard(host.recordsLevelTab);
    }
  }

  if (host.currentState !== host.previousState) {
    host.transitionTimer = TRANSITION_DURATION;
    if (host.currentState === GAME_STATES.Records) {
      host.recordsUiTimer = 0;
    }
    host.previousState = host.currentState;
  } else if (host.transitionTimer > 0) {
    host.transitionTimer = Math.max(0, host.transitionTimer - dt);
  }

  if (
    host.currentState !== GAME_STATES.Score
    && host.currentState !== GAME_STATES.Paused
  ) {
    host.fgpos -= host.fgScrollSpeed * dt;
  }

  if (host.shakeTimer > 0) {
    host.shakeTimer = Math.max(0, host.shakeTimer - dt);
  }

  host.particles.update(dt);

  if (host.scorePulseTimer > 0) {
    host.scorePulseTimer = Math.max(0, host.scorePulseTimer - dt);
  }

  if (host.currentState === GAME_STATES.Game) {
    host.gooseTrail.push(host.goose.x, host.goose.y, dt);
  } else {
    host.gooseTrail.update(dt);
  }

  if (host.currentState === GAME_STATES.Score && host.hasSavedCurrentScore) {
    host.scoreUiTimer += dt;
  }

  if (host.currentState === GAME_STATES.Records) {
    host.recordsUiTimer = Math.min(
      SCORE_UI_ANIM_DURATION,
      host.recordsUiTimer + dt,
    );
  }

  if (host.currentState === GAME_STATES.Score && host.deathAnimTimer > 0) {
    host.deathAnimTimer = Math.max(0, host.deathAnimTimer - dt);
  }

  if (
    host.currentState === GAME_STATES.Score
    && !host.hasSavedCurrentScore
    && !host.isResolvingLevelTop
  ) {
    startScoreResolution(host);
  }

  if (host.currentState === GAME_STATES.Countdown) {
    host.countdownTimer += dt;

    if (host.countdownTimer >= COUNTDOWN_STEP_DURATION) {
      host.countdownTimer = 0;
      host.countdownStep += 1;
      host.sound.play(SOUND_EVENTS.Tick);

      if (host.countdownStep >= COUNTDOWN_STEPS) {
        startActiveGame(host);
      }
    }
  }

  if (host.currentState === GAME_STATES.Game) {
    host.gameFrames += dt;

    host.pipes.update(
      host.viewport.logicalWidth,
      logicalHeight,
      host.goose,
      host.score,
      dt,
      () => {
        triggerDeath(host);
      },
      () => {
        host.score += 1;
        host.scorePulseTimer = SCORE_PULSE_DURATION;
        host.sound.play(SOUND_EVENTS.Score);
        host.haptic.pulse(HAPTIC_EVENTS.Score);
        host.particles.emitScore(host.goose.x, host.goose.y);
        host.particles.emitScorePopup(host.goose.x, host.goose.y - 24, '+1');
        announceGameMessage(`Счёт: ${host.score}`);
      },
    );
  }

  host.goose.update(
    host.currentState,
    logicalHeight,
    GROUND_HEIGHT,
    host.frames,
    dt,
    () => {
      if (host.currentState === GAME_STATES.Game) {
        triggerDeath(host);
      }
    },
  );
}
