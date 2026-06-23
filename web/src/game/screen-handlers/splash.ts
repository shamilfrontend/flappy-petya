import { HAPTIC_EVENTS } from '../../input/haptic';
import {
  expandHitbox,
  getCanvasPoint,
  isPointInRect,
  type PressEvent,
} from '../../input/pointer';
import { DIFFICULTIES } from '../difficulty';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';
import { transitionToState } from '../state-transition';

const PLAY_BUTTON_MIN_TOUCH_SIZE = 44;

export function isSplashHoverTarget(host: GameHost, evt: PressEvent): boolean {
  const point = getCanvasPoint(host.canvas, evt, host.viewport);
  if (!point) {
    return false;
  }

  const playHitbox = expandHitbox(
    host.playBtn,
    PLAY_BUTTON_MIN_TOUCH_SIZE,
    PLAY_BUTTON_MIN_TOUCH_SIZE,
  );

  if (
    isPointInRect(point, playHitbox)
    || isPointInRect(point, host.recordsBtn)
    || isPointInRect(point, host.settingsBtn)
  ) {
    return true;
  }

  return host.difficultyTabBtns.some((btn) => isPointInRect(point, btn));
}

export function handleSplashPress(host: GameHost, evt: PressEvent): void {
  const point = getCanvasPoint(host.canvas, evt, host.viewport);
  if (!point) {
    return;
  }

  if (isPointInRect(point, host.recordsBtn)) {
    void host.openRecords();
    return;
  }

  if (isPointInRect(point, host.settingsBtn)) {
    transitionToState(host, GAME_STATES.Settings, { reason: 'open_settings' });
    return;
  }

  const playHitbox = expandHitbox(
    host.playBtn,
    PLAY_BUTTON_MIN_TOUCH_SIZE,
    PLAY_BUTTON_MIN_TOUCH_SIZE,
  );

  if (isPointInRect(point, playHitbox)) {
    if (host.playBtn.width <= 0 || host.playBtn.height <= 0) {
      console.warn('[game-start] Blocked start: invalid play button hitbox', {
        playBtn: host.playBtn,
      });
      return;
    }

    if (host.isStartingGame) {
      return;
    }

    if (performance.now() < host.nextStartAllowedAtMs) {
      return;
    }

    host.haptic.pulse(HAPTIC_EVENTS.Jump);
    void host.startGame();
    return;
  }

  const selectedIndex = host.difficultyTabBtns.findIndex((btn) =>
    isPointInRect(point, btn),
  );

  if (selectedIndex >= 0) {
    host.applyDifficulty(DIFFICULTIES[selectedIndex].id);
  }
}
