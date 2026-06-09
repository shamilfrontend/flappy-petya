import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';

export function handleGameplayPress(host: GameHost, evt: PressEvent): void {
  if (host.currentState === GAME_STATES.Countdown) {
    return;
  }

  if (host.currentState === GAME_STATES.Game) {
    const point = getCanvasPoint(host.canvas, evt, host.viewport);

    if (point && isPointInRect(point, host.pauseBtn)) {
      host.togglePause();
      return;
    }

    host.performJump();
    return;
  }

  if (host.currentState === GAME_STATES.Paused) {
    host.togglePause();
  }
}
