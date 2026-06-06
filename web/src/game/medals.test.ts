import { getMedal, MEDAL_LABELS, MEDAL_TYPES } from './medals';

describe('getMedal', () => {
  it('returns none below bronze threshold', () => {
    expect(getMedal(0)).toBe(MEDAL_TYPES.None);
    expect(getMedal(9)).toBe(MEDAL_TYPES.None);
  });

  it('returns bronze at 10+', () => {
    expect(getMedal(10)).toBe(MEDAL_TYPES.Bronze);
    expect(getMedal(24)).toBe(MEDAL_TYPES.Bronze);
  });

  it('returns silver at 25+', () => {
    expect(getMedal(25)).toBe(MEDAL_TYPES.Silver);
    expect(getMedal(49)).toBe(MEDAL_TYPES.Silver);
  });

  it('returns gold at 50+', () => {
    expect(getMedal(50)).toBe(MEDAL_TYPES.Gold);
    expect(getMedal(999)).toBe(MEDAL_TYPES.Gold);
  });
});

describe('MEDAL_LABELS', () => {
  it('maps medal types to Russian labels', () => {
    expect(MEDAL_LABELS[MEDAL_TYPES.Bronze]).toBe('Бронза');
    expect(MEDAL_LABELS[MEDAL_TYPES.Silver]).toBe('Серебро');
    expect(MEDAL_LABELS[MEDAL_TYPES.Gold]).toBe('Золото');
    expect(MEDAL_LABELS[MEDAL_TYPES.None]).toBe('');
  });
});
