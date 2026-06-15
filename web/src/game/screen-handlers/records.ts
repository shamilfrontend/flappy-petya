import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import { saveSelectedRecordsLevel } from '../../lib/storage';
import { DIFFICULTIES } from '../difficulty';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';
import { transitionToState } from '../state-transition';

export function handleRecordsPress(host: GameHost, evt: PressEvent): void {
  const point = getCanvasPoint(host.canvas, evt, host.viewport);
  if (!point) {
    return;
  }

  if (isPointInRect(point, host.backBtn)) {
    transitionToState(host, GAME_STATES.Splash, {
      reason: 'close_records',
      lockStartForMs: 450,
    });
    return;
  }

  const tabIndex = host.recordsTabBtns.findIndex((btn) =>
    isPointInRect(point, btn),
  );

  if (tabIndex >= 0) {
    const level = DIFFICULTIES[tabIndex].id;
    if (host.recordsLevelTab !== level) {
      host.recordsLevelTab = level;
      host.recordsUiTimer = 0;
      saveSelectedRecordsLevel(level);
    }
  }
}
