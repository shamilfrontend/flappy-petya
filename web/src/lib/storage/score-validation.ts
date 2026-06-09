import { MAX_VALID_SCORE } from './types';

/** Minimum logical game frames required for a given score (generous lower bound). */
export function minGameFrames(score: number): number {
  if (score <= 0) {
    return 0;
  }

  if (score === 1) {
    return 250;
  }

  return 250 + (score - 1) * 120;
}

/** Maximum logical game frames allowed for a given score (lag/pause buffer). */
export function maxGameFrames(score: number): number {
  if (score <= 0) {
    return 0;
  }

  return 250 + score * 400;
}

/** Minimum wall-clock time (ms) from session start before a score may be saved. */
export function minWallClockMs(score: number): number {
  if (score <= 0) {
    return 0;
  }

  if (score === 1) {
    return 4000;
  }

  return 4000 + (score - 1) * 1800;
}

export function isValidScoreValue(score: number): boolean {
  return Number.isFinite(score) && score >= 1 && score <= MAX_VALID_SCORE;
}

export function isValidGameFrames(score: number, gameFrames: number): boolean {
  if (!Number.isFinite(gameFrames) || gameFrames < 0) {
    return false;
  }

  if (score <= 0) {
    return gameFrames === 0;
  }

  return gameFrames >= minGameFrames(score) && gameFrames <= maxGameFrames(score);
}

export function hasMinWallClockElapsed(
  sessionStartedAtMs: number,
  nowMs: number,
  score: number,
): boolean {
  if (score <= 0) {
    return true;
  }

  return nowMs - sessionStartedAtMs >= minWallClockMs(score);
}
