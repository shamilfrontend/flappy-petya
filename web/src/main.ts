import { registerSW } from 'virtual:pwa-register';
import { Game } from './game/game';

if (import.meta.env.PROD) {
  registerSW({ immediate: true });
}

const game = new Game();

game.start();
