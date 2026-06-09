import { registerSW } from 'virtual:pwa-register';
import { Game } from './game/game';
import { registerGlobalErrorHandlers } from './lib/global-error-handlers';
import { bindNativeBackButton } from './lib/native-back-button';

if (import.meta.env.PROD) {
  registerSW({ immediate: true });
}

registerGlobalErrorHandlers();

const game = new Game();
let unbindNativeBackButton: (() => void) | null = null;

void bindNativeBackButton(game).then((unbind) => {
  unbindNativeBackButton = unbind;
});

game.start();

window.addEventListener('beforeunload', () => {
  unbindNativeBackButton?.();
  game.destroy();
});
