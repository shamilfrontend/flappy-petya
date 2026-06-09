import { SOUND_EVENTS } from '../audio/sound';
import { HAPTIC_EVENTS } from '../input/haptic';
import {
  getPersonalBest,
  getSavedPlayerName,
  prepareGameSession,
  refreshLeaderboard,
  savePlayerName,
} from '../lib/storage';
import {
  DEATH_ANIM_DURATION,
  SHAKE_DURATION,
  SHAKE_INTENSITY,
} from './config';
import type { GameHost } from './game-host';
import { GAME_STATES } from './states';

export async function startGameWithAuth(host: GameHost): Promise<void> {
  let name = getSavedPlayerName();
  if (!name) {
    const result = await host.nameInputOverlay.prompt();
    if (!result.confirmed) {
      return;
    }

    savePlayerName(result.name);
    host.syncStateFromStorage();
    host.layoutUi();
    name = getSavedPlayerName();
    if (!name) {
      return;
    }
  }

  await beginGame(host, name);
}

export async function openRecordsScreen(host: GameHost): Promise<void> {
  host.recordsLevelTab =
    host.lastScoredLevel ?? host.selectedDifficulty;
  host.currentState = GAME_STATES.Records;

  void refreshLeaderboard(host.recordsLevelTab);
}

export async function beginGame(host: GameHost, name: string): Promise<void> {
  const sessionResult = await prepareGameSession(host.selectedDifficulty);
  if (!sessionResult.ok) {
    if (sessionResult.errorMessage) {
      host.messageOverlay.show(sessionResult.errorMessage);
    }
    return;
  }

  host.playerName = name;
  host.personalBest = getPersonalBest(host.playerName, host.selectedDifficulty);
  host.score = 0;
  host.gameFrames = 0;
  host.hasSavedCurrentScore = false;
  host.deathAnimTimer = 0;
  host.shakeTimer = 0;
  host.isNewBest = false;
  host.layoutUi();
  host.currentState = GAME_STATES.Countdown;
  host.countdownStep = 0;
  host.countdownTimer = 0;
  host.pipes.reset();
  host.pipes.seedInitial(host.viewport.logicalWidth, host.viewport.logicalHeight);
}

export function startActiveGame(host: GameHost): void {
  host.currentState = GAME_STATES.Game;
  host.countdownStep = -1;
  host.countdownTimer = 0;
  host.goose.jump();
  host.sound.play(SOUND_EVENTS.Jump);
  host.haptic.pulse(HAPTIC_EVENTS.Jump);
}

export function triggerDeath(host: GameHost): void {
  host.currentState = GAME_STATES.Score;
  host.deathAnimTimer = DEATH_ANIM_DURATION;
  host.shakeTimer = SHAKE_DURATION;
  host.shakeIntensity = SHAKE_INTENSITY;
  host.sound.play(SOUND_EVENTS.Hit);
  host.haptic.pulse(HAPTIC_EVENTS.Hit);
}
