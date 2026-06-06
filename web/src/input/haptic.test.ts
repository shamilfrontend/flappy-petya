import {
  createHapticManager,
  getHapticManager,
  HAPTIC_EVENTS,
  resetHapticManagerForTests,
} from './haptic';

describe('createHapticManager', () => {
  beforeEach(() => {
    resetHapticManagerForTests();
    localStorage.clear();
  });

  it('pulses with event-specific patterns when supported', async () => {
    const vibrate = vi.fn(() => true);
    const haptic = createHapticManager({
      vibrateFactory: () => vibrate,
      skipCapacitorProbe: true,
    });

    haptic.pulse(HAPTIC_EVENTS.Jump);
    haptic.pulse(HAPTIC_EVENTS.Score);
    haptic.pulse(HAPTIC_EVENTS.Hit);

    await vi.waitFor(() => {
      expect(vibrate).toHaveBeenCalledTimes(3);
    });
    expect(vibrate).toHaveBeenNthCalledWith(1, 10);
    expect(vibrate).toHaveBeenNthCalledWith(2, 15);
    expect(vibrate).toHaveBeenNthCalledWith(3, 30);
    expect(haptic.isSupported()).toBe(true);
  });

  it('is a no-op when vibration is unavailable', () => {
    const haptic = createHapticManager({
      vibrateFactory: () => null,
      skipCapacitorProbe: true,
    });

    expect(() => haptic.pulse(HAPTIC_EVENTS.Jump)).not.toThrow();
    expect(haptic.isSupported()).toBe(false);
  });

  it('ignores vibrate errors gracefully', () => {
    const vibrate = vi.fn(() => {
      throw new Error('blocked');
    });
    const haptic = createHapticManager({
      vibrateFactory: () => vibrate,
      skipCapacitorProbe: true,
    });

    expect(() => haptic.pulse(HAPTIC_EVENTS.Hit)).not.toThrow();
  });

  it('uses injected native impact when provided', async () => {
    const nativeImpact = vi.fn(() => Promise.resolve());
    const vibrate = vi.fn(() => true);
    const haptic = createHapticManager({
      vibrateFactory: () => vibrate,
      nativeImpact,
      skipCapacitorProbe: true,
    });

    haptic.pulse(HAPTIC_EVENTS.Jump);

    await vi.waitFor(() => {
      expect(nativeImpact).toHaveBeenCalledWith(HAPTIC_EVENTS.Jump);
    });
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('does not pulse when disabled', async () => {
    const vibrate = vi.fn(() => true);
    const haptic = createHapticManager({
      vibrateFactory: () => vibrate,
      skipCapacitorProbe: true,
    });

    haptic.setEnabled(false);
    haptic.pulse(HAPTIC_EVENTS.Jump);

    await vi.waitFor(() => {
      expect(vibrate).not.toHaveBeenCalled();
    });
  });

  it('persists enabled preference in localStorage', () => {
    const haptic = createHapticManager({
      vibrateFactory: () => vi.fn(() => true),
      skipCapacitorProbe: true,
    });

    haptic.toggleEnabled();
    expect(localStorage.getItem('flappy-petya-haptic-enabled')).toBe('0');
    expect(haptic.isEnabled()).toBe(false);

    haptic.toggleEnabled();
    expect(localStorage.getItem('flappy-petya-haptic-enabled')).toBe('1');
    expect(haptic.isEnabled()).toBe(true);
  });

  it('falls back to vibrate when native impact fails', async () => {
    const nativeImpact = vi.fn(() => Promise.reject(new Error('native failed')));
    const vibrate = vi.fn(() => true);
    const haptic = createHapticManager({
      vibrateFactory: () => vibrate,
      nativeImpact,
      skipCapacitorProbe: true,
    });

    haptic.pulse(HAPTIC_EVENTS.Hit);

    await vi.waitFor(() => {
      expect(vibrate).toHaveBeenCalledWith(30);
    });
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
