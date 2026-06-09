import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import { DIFFICULTIES } from '../difficulty';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';

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
    host.currentState = GAME_STATES.Settings;
    return;
  }

  if (isPointInRect(point, host.playBtn)) {
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
