import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import { refreshLeaderboard } from '../../lib/storage';
import { DIFFICULTIES } from '../difficulty';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';

export function handleRecordsPress(host: GameHost, evt: PressEvent): void {
  const point = getCanvasPoint(host.canvas, evt, host.viewport);
  if (!point) {
    return;
  }

  if (isPointInRect(point, host.backBtn)) {
    host.currentState = GAME_STATES.Splash;
    return;
  }

  const tabIndex = host.recordsTabBtns.findIndex((btn) =>
    isPointInRect(point, btn),
  );

  if (tabIndex >= 0) {
    host.recordsLevelTab = DIFFICULTIES[tabIndex].id;
    void refreshLeaderboard(host.recordsLevelTab);
  }
}
