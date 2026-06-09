import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';

export function handleSettingsPress(host: GameHost, evt: PressEvent): void {
  const point = getCanvasPoint(host.canvas, evt, host.viewport);
  if (!point) {
    return;
  }

  if (isPointInRect(point, host.backBtn)) {
    host.currentState = GAME_STATES.Splash;
    return;
  }

  if (isPointInRect(point, host.soundToggleBtn)) {
    host.sound.toggleMuted();
    return;
  }

  if (
    host.haptic.isSupported()
    && isPointInRect(point, host.hapticToggleBtn)
  ) {
    host.haptic.toggleEnabled();
  }
}
