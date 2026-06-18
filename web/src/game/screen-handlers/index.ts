import {
  getCanvasPoint,
  isPointInRect,
  type PressEvent,
} from '../../input/pointer';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';
import { handleGameplayPress } from './gameplay';
import { handleRecordsPress } from './records';
import { handleScorePress } from './score';
import { handleSettingsPress } from './settings';
import { handleSplashPress, isSplashHoverTarget } from './splash';

export function handleScreenPress(host: GameHost, evt: PressEvent): void {
  if (evt.cancelable) {
    evt.preventDefault();
  }

  switch (host.currentState) {
    case GAME_STATES.Splash:
      handleSplashPress(host, evt);
      break;
    case GAME_STATES.Settings:
      handleSettingsPress(host, evt);
      break;
    case GAME_STATES.Records:
      handleRecordsPress(host, evt);
      break;
    case GAME_STATES.Countdown:
    case GAME_STATES.Game:
    case GAME_STATES.Paused:
      handleGameplayPress(host, evt);
      break;
    case GAME_STATES.Score:
      handleScorePress(host, evt);
      break;
    default:
      break;
  }
}

export function shouldUsePointerCursor(
  host: GameHost,
  evt: PointerEvent | MouseEvent,
): boolean {
  if (host.currentState === GAME_STATES.Splash) {
    return isSplashHoverTarget(host, evt);
  }

  if (
    host.currentState === GAME_STATES.Records
    || host.currentState === GAME_STATES.Settings
  ) {
    const point = getCanvasPoint(host.canvas, evt, host.viewport);
    return Boolean(point && isPointInRect(point, host.backBtn));
  }

  if (
    host.currentState === GAME_STATES.Score
    && host.deathAnimTimer <= 0
    && host.hasSavedCurrentScore
  ) {
    const point = getCanvasPoint(host.canvas, evt, host.viewport);
    return Boolean(
      point
      && (
        isPointInRect(point, host.scoreHomeBtn)
        || isPointInRect(point, host.scoreRetryBtn)
      ),
    );
  }

  return false;
}
