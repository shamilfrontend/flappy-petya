import { describe, expect, it } from 'vitest';
import {
  hasMinWallClockElapsed,
  isValidGameFrames,
  isValidScoreValue,
  maxGameFrames,
  minGameFrames,
  minWallClockMs,
} from './score-validation';

describe('score-validation', () => {
  it('computes minGameFrames with first-score overhead', () => {
    expect(minGameFrames(0)).toBe(0);
    expect(minGameFrames(1)).toBe(250);
    expect(minGameFrames(2)).toBe(370);
    expect(minGameFrames(10)).toBe(1330);
  });

  it('computes maxGameFrames with generous upper bound', () => {
    expect(maxGameFrames(0)).toBe(0);
    expect(maxGameFrames(1)).toBe(650);
    expect(maxGameFrames(10)).toBe(4250);
  });

  it('computes minWallClockMs with first-score overhead', () => {
    expect(minWallClockMs(0)).toBe(0);
    expect(minWallClockMs(1)).toBe(4000);
    expect(minWallClockMs(2)).toBe(5800);
    expect(minWallClockMs(10)).toBe(20_200);
  });

  it('validates score range', () => {
    expect(isValidScoreValue(0)).toBe(false);
    expect(isValidScoreValue(1)).toBe(true);
    expect(isValidScoreValue(9999)).toBe(true);
    expect(isValidScoreValue(10_000)).toBe(false);
  });

  it('validates gameFrames within bounds', () => {
    expect(isValidGameFrames(1, 249)).toBe(false);
    expect(isValidGameFrames(1, 250)).toBe(true);
    expect(isValidGameFrames(1, 650)).toBe(true);
    expect(isValidGameFrames(1, 651)).toBe(false);
    expect(isValidGameFrames(0, 0)).toBe(true);
    expect(isValidGameFrames(0, 1)).toBe(false);
  });

  it('checks wall-clock elapsed time', () => {
    const startedAt = 1_000_000;
    expect(hasMinWallClockElapsed(startedAt, startedAt + 3999, 1)).toBe(false);
    expect(hasMinWallClockElapsed(startedAt, startedAt + 4000, 1)).toBe(true);
    expect(hasMinWallClockElapsed(startedAt, startedAt + 5799, 2)).toBe(false);
    expect(hasMinWallClockElapsed(startedAt, startedAt + 5800, 2)).toBe(true);
    expect(hasMinWallClockElapsed(startedAt, startedAt, 0)).toBe(true);
  });

  it('rejects non-finite and negative gameFrames', () => {
    expect(isValidGameFrames(5, Number.NaN)).toBe(false);
    expect(isValidGameFrames(5, -1)).toBe(false);
  });
});
