import type { Game } from '../game/game';

export async function bindNativeBackButton(game: Game): Promise<() => void> {
  const { Capacitor } = await import('@capacitor/core');
  if (!Capacitor.isNativePlatform()) {
    return () => {};
  }

  const { App } = await import('@capacitor/app');
  const listener = await App.addListener('backButton', () => {
    if (game.handleBackPress()) {
      return;
    }

    void App.exitApp();
  });

  return () => {
    void listener.remove();
  };
}
