const SOUND_MUTED_KEY = 'flappy-petya-sound-muted';

export const SOUND_EVENTS = {
  Jump: 'jump',
  Score: 'score',
  Hit: 'hit',
  NewBest: 'newBest',
  Tick: 'tick',
} as const;

export type SoundEvent = (typeof SOUND_EVENTS)[keyof typeof SOUND_EVENTS];

export interface SoundManager {
  play(event: SoundEvent): void;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
  toggleMuted(): boolean;
}

const SOUND_TONES: Record<SoundEvent, { frequency: number; duration: number }[]> = {
  [SOUND_EVENTS.Jump]: [{ frequency: 520, duration: 0.08 }],
  [SOUND_EVENTS.Score]: [{ frequency: 880, duration: 0.06 }],
  [SOUND_EVENTS.Hit]: [{ frequency: 180, duration: 0.2 }],
  [SOUND_EVENTS.NewBest]: [
    { frequency: 660, duration: 0.08 },
    { frequency: 880, duration: 0.1 },
  ],
  [SOUND_EVENTS.Tick]: [{ frequency: 440, duration: 0.05 }],
};

function readMutedPreference(): boolean {
  try {
    return localStorage.getItem(SOUND_MUTED_KEY) === '1';
  } catch {
    return false;
  }
}

function writeMutedPreference(muted: boolean): void {
  try {
    localStorage.setItem(SOUND_MUTED_KEY, muted ? '1' : '0');
  } catch {
    // private mode or storage disabled
  }
}

export function createSoundManager(
  audioContextFactory: () => AudioContext | null = createBrowserAudioContext,
): SoundManager {
  let muted = readMutedPreference();
  let audioContext: AudioContext | null = null;

  function getAudioContext(): AudioContext | null {
    if (audioContext) {
      return audioContext;
    }

    audioContext = audioContextFactory();
    return audioContext;
  }

  function playTone(frequency: number, duration: number): void {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.08;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const startAt = ctx.currentTime;
    oscillator.start(startAt);
    oscillator.stop(startAt + duration);
  }

  return {
    play(event: SoundEvent): void {
      if (muted) {
        return;
      }

      SOUND_TONES[event].forEach(({ frequency, duration }, index) => {
        const delayMs = index * 100;

        if (delayMs === 0) {
          playTone(frequency, duration);
          return;
        }

        window.setTimeout(() => playTone(frequency, duration), delayMs);
      });
    },

    setMuted(nextMuted: boolean): void {
      muted = nextMuted;
      writeMutedPreference(nextMuted);
    },

    isMuted(): boolean {
      return muted;
    },

    toggleMuted(): boolean {
      muted = !muted;
      writeMutedPreference(muted);
      return muted;
    },
  };
}

function createBrowserAudioContext(): AudioContext | null {
  try {
    const AudioContextCtor = window.AudioContext
      ?? (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    return new AudioContextCtor();
  } catch {
    return null;
  }
}

let soundManager: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!soundManager) {
    soundManager = createSoundManager();
  }

  return soundManager;
}

export function resetSoundManagerForTests(): void {
  soundManager = null;
}
