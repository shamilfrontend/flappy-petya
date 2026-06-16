import { bindGameKeyboard } from '../input/keyboard';
import type { PressEvent } from '../input/pointer';
import type { GameHost } from './game-host';
import { handleScreenPress } from './screen-handlers';
import { GAME_STATES } from './states';

export interface GameInputBindings {
  unbindKeyboard: (() => void) | null;
  usesPointerEvents: boolean;
  onPress: (evt: PressEvent) => void;
}

export function bindGameInput(
  host: GameHost,
  canvas: HTMLCanvasElement,
): GameInputBindings {
  const onPress = (evt: PressEvent): void => {
    handleScreenPress(host, evt);
  };

  const opts: AddEventListenerOptions = { passive: false };
  let usesPointerEvents = false;

  if (window.PointerEvent) {
    usesPointerEvents = true;
    canvas.addEventListener('pointerdown', onPress, opts);
  } else {
    canvas.addEventListener('mousedown', onPress);
    canvas.addEventListener('touchstart', onPress, opts);
  }

  const unbindKeyboard = bindGameKeyboard({
    jump: () => host.performJump(),
    pause: () => host.togglePause(),
    canJump: () => host.currentState === GAME_STATES.Game && !host.isAwaitingAuth,
    canPause: () =>
      !host.isAwaitingAuth
      && (host.currentState === GAME_STATES.Game
        || host.currentState === GAME_STATES.Paused),
  });

  const onSplashKeyDown = (event: KeyboardEvent): void => {
    if (
      event.key === 'Enter'
      && host.currentState === GAME_STATES.Splash
      && !host.isAwaitingAuth
    ) {
      const now = performance.now();
      if (now < host.nextStartAllowedAtMs) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      void host.startGame();
    }
  };

  window.addEventListener('keydown', onSplashKeyDown);

  const previousUnbind = unbindKeyboard;
  const combinedUnbind = (): void => {
    previousUnbind();
    window.removeEventListener('keydown', onSplashKeyDown);
  };

  return {
    unbindKeyboard: combinedUnbind,
    usesPointerEvents,
    onPress,
  };
}

export function unbindGameInput(
  canvas: HTMLCanvasElement,
  bindings: GameInputBindings,
): void {
  bindings.unbindKeyboard?.();

  const opts: AddEventListenerOptions = { passive: false };

  if (bindings.usesPointerEvents) {
    canvas.removeEventListener('pointerdown', bindings.onPress, opts);
  } else {
    canvas.removeEventListener('mousedown', bindings.onPress);
    canvas.removeEventListener('touchstart', bindings.onPress, opts);
  }
}
