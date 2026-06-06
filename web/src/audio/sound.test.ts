import {
  createSoundManager,
  getSoundManager,
  resetSoundManagerForTests,
  SOUND_EVENTS,
} from './sound';

describe('createSoundManager', () => {
  beforeEach(() => {
    localStorage.clear();
    resetSoundManagerForTests();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not play tones when muted', () => {
    const start = vi.fn();
    const stop = vi.fn();
    const connect = vi.fn();
    const createOscillator = vi.fn(() => ({
      type: 'square',
      frequency: { value: 0 },
      connect,
      start,
      stop,
    }));
    const createGain = vi.fn(() => ({
      gain: { value: 0 },
      connect,
    }));
    const audioContext = {
      currentTime: 0,
      destination: {},
      createOscillator,
      createGain,
    } as unknown as AudioContext;

    const sound = createSoundManager(() => audioContext);
    sound.setMuted(true);
    sound.play(SOUND_EVENTS.Jump);

    expect(createOscillator).not.toHaveBeenCalled();
  });

  it('plays tones when unmuted', () => {
    const start = vi.fn();
    const stop = vi.fn();
    const connect = vi.fn();
    const createOscillator = vi.fn(() => ({
      type: 'square',
      frequency: { value: 0 },
      connect,
      start,
      stop,
    }));
    const createGain = vi.fn(() => ({
      gain: { value: 0 },
      connect,
    }));
    const audioContext = {
      currentTime: 0,
      destination: {},
      createOscillator,
      createGain,
    } as unknown as AudioContext;

    const sound = createSoundManager(() => audioContext);
    sound.play(SOUND_EVENTS.Jump);

    expect(createOscillator).toHaveBeenCalledOnce();
    expect(start).toHaveBeenCalledOnce();
    expect(stop).toHaveBeenCalledOnce();
  });

  it('persists muted preference in localStorage', () => {
    const sound = createSoundManager(() => null);

    sound.setMuted(true);
    expect(localStorage.getItem('flappy-petya-sound-muted')).toBe('1');
    expect(sound.isMuted()).toBe(true);

    sound.setMuted(false);
    expect(localStorage.getItem('flappy-petya-sound-muted')).toBe('0');
    expect(sound.isMuted()).toBe(false);
  });

  it('toggleMuted flips state and returns new value', () => {
    const sound = createSoundManager(() => null);

    expect(sound.toggleMuted()).toBe(true);
    expect(sound.isMuted()).toBe(true);
    expect(sound.toggleMuted()).toBe(false);
    expect(sound.isMuted()).toBe(false);
  });

  it('gracefully handles unavailable AudioContext', () => {
    const sound = createSoundManager(() => null);

    expect(() => sound.play(SOUND_EVENTS.Hit)).not.toThrow();
  });

  it('does not play countdown tick when muted', () => {
    const createOscillator = vi.fn();
    const audioContext = {
      currentTime: 0,
      destination: {},
      createOscillator,
      createGain: vi.fn(() => ({ gain: { value: 0 }, connect: vi.fn() })),
    } as unknown as AudioContext;
    const sound = createSoundManager(() => audioContext);

    sound.setMuted(true);
    sound.play(SOUND_EVENTS.Tick);

    expect(createOscillator).not.toHaveBeenCalled();
  });

  it('plays delayed tone for newBest event', () => {
    const createOscillator = vi.fn(() => ({
      type: 'square',
      frequency: { value: 0 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }));
    const audioContext = {
      currentTime: 0,
      destination: {},
      createOscillator,
      createGain: vi.fn(() => ({ gain: { value: 0 }, connect: vi.fn() })),
    } as unknown as AudioContext;
    const sound = createSoundManager(() => audioContext);

    sound.play(SOUND_EVENTS.NewBest);
    expect(createOscillator).toHaveBeenCalledOnce();

    vi.advanceTimersByTime(100);
    expect(createOscillator).toHaveBeenCalledTimes(2);
  });
});

describe('getSoundManager', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    resetSoundManagerForTests();
  });

  it('returns the same singleton instance', () => {
    resetSoundManagerForTests();
    const first = getSoundManager();
    const second = getSoundManager();

    expect(first).toBe(second);
  });

  it('falls back when browser AudioContext is unavailable', () => {
    resetSoundManagerForTests();
    vi.stubGlobal('AudioContext', undefined);
    vi.stubGlobal('webkitAudioContext', undefined);

    expect(() => getSoundManager().play(SOUND_EVENTS.Tick)).not.toThrow();
  });
});
