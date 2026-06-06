export const GAME_STATES = {
  Splash: 'splash',
  Game: 'game',
  Score: 'score',
  Records: 'records',
} as const;

export type GameState = (typeof GAME_STATES)[keyof typeof GAME_STATES];
