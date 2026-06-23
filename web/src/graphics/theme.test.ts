import { describe, expect, it } from 'vitest';
import { getNightFactor, getPalette } from './theme';

const CYCLE_LENGTH = 80;
const DAY = '#8ED4EA';
const DUSK = '#F6A96B';
const NIGHT = '#1B2A4A';

describe('getPalette', () => {
  it('возвращает одинаковую палитру для начала цикла (0 и 80 очков)', () => {
    const atStart = getPalette(0);
    const atCycleWrap = getPalette(CYCLE_LENGTH);

    expect(atCycleWrap.skyTop).toBe(atStart.skyTop);
    expect(atCycleWrap.skyBottom).toBe(atStart.skyBottom);
  });

  it('держит палитру дня на всём отрезке 0–9', () => {
    const atZero = getPalette(0);

    expect(getPalette(5).skyTop).toBe(atZero.skyTop);
    expect(getPalette(9).skyTop).toBe(atZero.skyTop);
    expect(atZero.skyTop).toBe(DAY);
  });

  it('держит палитру заката на отрезке 20–29', () => {
    expect(getPalette(22).skyTop).toBe(DUSK);
    expect(getPalette(29).skyTop).toBe(DUSK);
  });

  it('держит палитру ночи на отрезке 40–49', () => {
    expect(getPalette(45).skyTop).toBe(NIGHT);
  });
});

describe('getNightFactor', () => {
  it('равен 0 в начале цикла', () => {
    expect(getNightFactor(0)).toBe(0);
    expect(getNightFactor(CYCLE_LENGTH)).toBe(0);
  });

  it('остаётся постоянным в стабильных фазах', () => {
    const holdScores = [3, 22, 45, 63];

    for (const score of holdScores) {
      expect(getNightFactor(score)).toBe(getNightFactor(score + 1));
    }
  });

  it('равен 0.5 на удержании заката (20–29)', () => {
    expect(getNightFactor(25)).toBe(0.5);
  });

  it('равен 1 на удержании ночи (40–49)', () => {
    expect(getNightFactor(45)).toBe(1);
  });

  it('плавно меняется только в переходных фазах', () => {
    for (let score = 10; score < 19; score += 1) {
      const current = getNightFactor(score);
      const next = getNightFactor(score + 1);
      expect(next).toBeGreaterThan(current);
    }
  });
});
