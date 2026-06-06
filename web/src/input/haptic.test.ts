import {
  createHapticManager,
  getHapticManager,
  HAPTIC_EVENTS,
  resetHapticManagerForTests,
} from './haptic';

describe('createHapticManager', () => {
  beforeEach(() => {
    resetHapticManagerForTests();
  });

  it('pulses with event-specific patterns when supported', () => {
    const vibrate = vi.fn(() => true);
    const haptic = createHapticManager(() => vibrate);

    haptic.pulse(HAPTIC_EVENTS.Jump);
    haptic.pulse(HAPTIC_EVENTS.Score);
    haptic.pulse(HAPTIC_EVENTS.Hit);

    expect(vibrate).toHaveBeenNthCalledWith(1, 10);
    expect(vibrate).toHaveBeenNthCalledWith(2, 15);
    expect(vibrate).toHaveBeenNthCalledWith(3, 30);
    expect(haptic.isSupported()).toBe(true);
  });

  it('is a no-op when vibration is unavailable', () => {
    const haptic = createHapticManager(() => null);

    expect(() => haptic.pulse(HAPTIC_EVENTS.Jump)).not.toThrow();
    expect(haptic.isSupported()).toBe(false);
  });

  it('ignores vibrate errors gracefully', () => {
    const vibrate = vi.fn(() => {
      throw new Error('blocked');
    });
    const haptic = createHapticManager(() => vibrate);

    expect(() => haptic.pulse(HAPTIC_EVENTS.Hit)).not.toThrow();
  });
});

describe('getHapticManager', () => {
  beforeEach(() => {
    resetHapticManagerForTests();
  });

  it('returns the same singleton instance', () => {
    const first = getHapticManager();
    const second = getHapticManager();

    expect(first).toBe(second);
  });
});
