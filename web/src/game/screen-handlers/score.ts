import { getCanvasPoint, isPointInRect, type PressEvent } from '../../input/pointer';
import { beginGame } from '../game-auth';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';
import { transitionToState } from '../state-transition';

export function handleScorePress(host: GameHost, evt: PressEvent): void {
  if (host.deathAnimTimer > 0 || !host.hasSavedCurrentScore) {
    return;
  }

  const point = getCanvasPoint(host.canvas, evt, host.viewport);
  if (!point) {
    return;
  }

  if (isPointInRect(point, host.scoreHomeBtn)) {
    host.pipes.reset();
    transitionToState(host, GAME_STATES.Splash, {
      reason: 'score_go_home',
      lockStartForMs: 450,
    });
    host.score = 0;
    host.hasSavedCurrentScore = false;
    host.isResolvingLevelTop = false;
    host.deathAnimTimer = 0;
    host.shakeTimer = 0;
    host.layoutUi();
    return;
  }

  if (!isPointInRect(point, host.scoreRetryBtn)) {
    return;
  }

  if (host.isStartingGame || !host.playerName.trim()) {
    return;
  }

  void beginGame(host, host.playerName, { skipSessionPrepare: true });
}
