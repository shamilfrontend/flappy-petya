import { SOUND_EVENTS } from '../audio/sound';
import { HAPTIC_EVENTS } from '../input/haptic';
import { saveRecord } from '../lib/storage';
import { announceGameMessage } from '../ui/game-announcer';
import {
  COUNTDOWN_STEP_DURATION,
  COUNTDOWN_STEPS,
  FG_TILE_WIDTH,
  GROUND_HEIGHT,
} from './config';
import { startActiveGame, triggerDeath } from './game-auth';
import type { GameHost } from './game-host';
import { GAME_STATES } from './states';

export function updateGame(host: GameHost, dt: number): void {
  const { logicalHeight } = host.viewport;
  host.frames += dt;

  if (
    host.currentState !== GAME_STATES.Score
    && host.currentState !== GAME_STATES.Paused
  ) {
    host.fgpos =
      (host.fgpos - host.fgScrollSpeed * dt) % FG_TILE_WIDTH;
  }

  if (host.shakeTimer > 0) {
    host.shakeTimer = Math.max(0, host.shakeTimer - dt);
  }

  if (host.currentState === GAME_STATES.Score && host.deathAnimTimer > 0) {
    host.deathAnimTimer = Math.max(0, host.deathAnimTimer - dt);
  }

  if (host.currentState === GAME_STATES.Score && !host.hasSavedCurrentScore) {
    host.isNewBest = host.score > host.personalBest;

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

    host.personalBest = Math.max(host.personalBest, host.score);
    host.hasSavedCurrentScore = true;
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
      dt,
      () => {
        triggerDeath(host);
      },
      () => {
        host.score += 1;
        host.sound.play(SOUND_EVENTS.Score);
        host.haptic.pulse(HAPTIC_EVENTS.Score);
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
