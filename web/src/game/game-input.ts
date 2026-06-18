import { bindGameKeyboard } from '../input/keyboard';
import type { PressEvent } from '../input/pointer';
import type { GameHost } from './game-host';
import { handleScreenPress, shouldUsePointerCursor } from './screen-handlers';
import { GAME_STATES } from './states';

export interface GameInputBindings {
  unbindKeyboard: (() => void) | null;
  usesPointerEvents: boolean;
  onPress: (evt: PressEvent) => void;
  onHover: (evt: PointerEvent | MouseEvent) => void;
  onHoverLeave: () => void;
}

export function bindGameInput(
  host: GameHost,
  canvas: HTMLCanvasElement,
): GameInputBindings {
  const onPress = (evt: PressEvent): void => {
    handleScreenPress(host, evt);
  };
  const onHover = (evt: PointerEvent | MouseEvent): void => {
    if ('pointerType' in evt && evt.pointerType === 'touch') {
      return;
    }

    canvas.style.cursor = shouldUsePointerCursor(host, evt) ? 'pointer' : 'default';
  };
  const onHoverLeave = (): void => {
    canvas.style.cursor = 'default';
  };

  const opts: AddEventListenerOptions = { passive: false };
  let usesPointerEvents = false;

  if (window.PointerEvent) {
    usesPointerEvents = true;
    canvas.addEventListener('pointerdown', onPress, opts);
    canvas.addEventListener('pointermove', onHover, opts);
    canvas.addEventListener('pointerleave', onHoverLeave, opts);
  } else {
    canvas.addEventListener('mousedown', onPress);
    canvas.addEventListener('touchstart', onPress, opts);
    canvas.addEventListener('mousemove', onHover);
    canvas.addEventListener('mouseleave', onHoverLeave);
  }

  const unbindKeyboard = bindGameKeyboard({
    jump: () => host.performJump(),
    pause: () => host.togglePause(),
    canJump: () => host.currentState === GAME_STATES.Game,
    canPause: () =>
      host.currentState === GAME_STATES.Game
      || host.currentState === GAME_STATES.Paused,
  });

  const onSplashKeyDown = (event: KeyboardEvent): void => {
    if (
      event.key === 'Enter'
      && host.currentState === GAME_STATES.Splash
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
    onHover,
    onHoverLeave,
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
    canvas.removeEventListener('pointermove', bindings.onHover, opts);
    canvas.removeEventListener('pointerleave', bindings.onHoverLeave, opts);
  } else {
    canvas.removeEventListener('mousedown', bindings.onPress);
    canvas.removeEventListener('touchstart', bindings.onPress, opts);
    canvas.removeEventListener('mousemove', bindings.onHover);
    canvas.removeEventListener('mouseleave', bindings.onHoverLeave);
  }

  canvas.style.cursor = 'default';
}
