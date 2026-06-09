import { getScreenShakeOffset, SCREEN_SHAKE_OFFSETS } from './screen-shake';

describe('screen shake offsets', () => {
  it('provides deterministic offsets', () => {
    expect(SCREEN_SHAKE_OFFSETS).toHaveLength(12);
    expect(getScreenShakeOffset(6, 4)).toEqual({
      x: expect.any(Number),
      y: expect.any(Number),
    });
  });

  it('returns zero offset when timer is zero', () => {
    expect(getScreenShakeOffset(0, 4)).toEqual({ x: 0, y: 0 });
  });
});
