import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import { DIFFICULTIES } from '../difficulty';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';
import { transitionToState } from '../state-transition';

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
    if (host.playBtn.width <= 0 || host.playBtn.height <= 0) {
      console.warn('[game-start] Blocked start: invalid play button hitbox', {
        playBtn: host.playBtn,
      });
      return;
    }

    if (performance.now() < host.nextStartAllowedAtMs) {
      return;
    }

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
