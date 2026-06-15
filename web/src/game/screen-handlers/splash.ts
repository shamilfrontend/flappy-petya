import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import { DIFFICULTIES } from '../difficulty';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';
import { transitionToState } from '../state-transition';

const SPLASH_START_TOUCH_REENTRY_LOCK_MS = 450;

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

  if (isPointInRect(point, host.playBtn)) {
    const now = performance.now();
    if (now < host.nextStartAllowedAtMs) {
      return;
    }

    host.nextStartAllowedAtMs = now + SPLASH_START_TOUCH_REENTRY_LOCK_MS;
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
