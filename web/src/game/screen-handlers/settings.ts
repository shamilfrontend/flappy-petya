import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';
import { transitionToState } from '../state-transition';

export function handleSettingsPress(host: GameHost, evt: PressEvent): void {
  const point = getCanvasPoint(host.canvas, evt, host.viewport);
  if (!point) {
    return;
  }

  if (isPointInRect(point, host.backBtn)) {
    transitionToState(host, GAME_STATES.Splash, {
      reason: 'close_settings',
      lockStartForMs: 450,
    });
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
