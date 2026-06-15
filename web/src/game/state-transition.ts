import type { GameHost } from './game-host';
import { GAME_STATES, type GameState } from './states';

export interface StateTransitionOptions {
  reason: string;
  lockStartForMs?: number;
}

function isUnexpectedRestartTransition(from: GameState, to: GameState): boolean {
  const leavesActiveRun =
    from === GAME_STATES.Game || from === GAME_STATES.Paused;
  const reopensStartFlow =
    to === GAME_STATES.Splash || to === GAME_STATES.Countdown;

  return leavesActiveRun && reopensStartFlow;
}

export function transitionToState(
  host: GameHost,
  nextState: GameState,
  options: StateTransitionOptions,
): void {
  const { reason, lockStartForMs = 0 } = options;
  const prevState = host.currentState;
  if (prevState === nextState) {
    return;
  }

  host.currentState = nextState;

  if (lockStartForMs > 0) {
    host.nextStartAllowedAtMs = performance.now() + lockStartForMs;
  }

  if (isUnexpectedRestartTransition(prevState, nextState)) {
    console.warn('[game-state] Active run interrupted', {
      from: prevState,
      to: nextState,
      reason,
    });
    return;
  }

  if (import.meta.env.DEV) {
    console.debug('[game-state] Transition', {
      from: prevState,
      to: nextState,
      reason,
    });
  }
}
