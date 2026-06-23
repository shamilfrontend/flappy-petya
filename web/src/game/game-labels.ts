export const PLAY_BUTTON_LABEL = 'Играть';
export const PLAY_BUTTON_LOADING_LABEL = 'Загрузка...';

export function resolvePlayButtonLabel(isStartingGame: boolean): string {
  return isStartingGame ? PLAY_BUTTON_LOADING_LABEL : PLAY_BUTTON_LABEL;
}
