import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';

export function handleScorePress(host: GameHost, evt: PressEvent): void {
  const point = getCanvasPoint(host.canvas, evt, host.viewport);
  if (!point || !isPointInRect(point, host.okBtn)) {
    return;
  }

  host.pipes.reset();
  host.currentState = GAME_STATES.Splash;
  host.score = 0;
  host.hasSavedCurrentScore = false;
  host.isResolvingLevelTop = false;
  host.deathAnimTimer = 0;
  host.shakeTimer = 0;
  host.layoutUi();
}
