export const GAME_STATES = {
  Splash: 'splash',
  Countdown: 'countdown',
  Game: 'game',
  Paused: 'paused',
  Score: 'score',
  Records: 'records',
  Settings: 'settings',
} as const;

export type GameState = (typeof GAME_STATES)[keyof typeof GAME_STATES];
