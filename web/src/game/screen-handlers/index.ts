import type { PressEvent } from '../../input/pointer';
import type { GameHost } from '../game-host';
import { GAME_STATES } from '../states';
import { handleGameplayPress } from './gameplay';
import { handleRecordsPress } from './records';
import { handleScorePress } from './score';
import { handleSettingsPress } from './settings';
import { handleSplashPress } from './splash';

export function handleScreenPress(host: GameHost, evt: PressEvent): void {
  if (host.isAwaitingAuth) {
    return;
  }

  if (evt.cancelable) {
    evt.preventDefault();
  }

  switch (host.currentState) {
    case GAME_STATES.Splash:
      handleSplashPress(host, evt);
      break;
    case GAME_STATES.Settings:
      handleSettingsPress(host, evt);
      break;
    case GAME_STATES.Records:
      handleRecordsPress(host, evt);
      break;
    case GAME_STATES.Countdown:
    case GAME_STATES.Game:
    case GAME_STATES.Paused:
      handleGameplayPress(host, evt);
      break;
    case GAME_STATES.Score:
      handleScorePress(host, evt);
      break;
    default:
      break;
  }
}
