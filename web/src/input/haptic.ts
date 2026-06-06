export const HAPTIC_EVENTS = {
  Jump: 'jump',
  Score: 'score',
  Hit: 'hit',
} as const;

export type HapticEvent = (typeof HAPTIC_EVENTS)[keyof typeof HAPTIC_EVENTS];

export interface HapticManager {
  pulse(event: HapticEvent): void;
  isSupported(): boolean;
  isEnabled(): boolean;
  setEnabled(enabled: boolean): void;
  toggleEnabled(): boolean;
}

const HAPTIC_ENABLED_KEY = 'flappy-petya-haptic-enabled';

const HAPTIC_PATTERNS: Record<HapticEvent, number | number[]> = {
  [HAPTIC_EVENTS.Jump]: 10,
  [HAPTIC_EVENTS.Score]: 15,
  [HAPTIC_EVENTS.Hit]: 30,
};

type VibrateFn = (pattern: number | number[]) => boolean;

export interface HapticDependencies {
  vibrateFactory?: () => VibrateFn | null;
  nativeImpact?: (event: HapticEvent) => Promise<void>;
  skipCapacitorProbe?: boolean;
}

function readEnabledPreference(): boolean {
  try {
    const stored = localStorage.getItem(HAPTIC_ENABLED_KEY);
    if (stored === null) {
      return true;
    }

    return stored === '1';
  } catch {
    return true;
  }
}

function writeEnabledPreference(enabled: boolean): void {
  try {
    localStorage.setItem(HAPTIC_ENABLED_KEY, enabled ? '1' : '0');
  } catch {
    // private mode or storage disabled
  }
}

function getBrowserVibrate(): VibrateFn | null {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return null;
  }

  return navigator.vibrate.bind(navigator);
}

export function createHapticManager(deps: HapticDependencies = {}): HapticManager {
  const vibrate = (deps.vibrateFactory ?? getBrowserVibrate)();
  const injectedNativeImpact = deps.nativeImpact;
  let nativeProbeDone = Boolean(injectedNativeImpact) || deps.skipCapacitorProbe;
  let nativePulse: ((event: HapticEvent) => Promise<void>) | null = injectedNativeImpact ?? null;
  let nativeAvailable = Boolean(injectedNativeImpact);
  let enabled = readEnabledPreference();

  async function ensureNativePulse(): Promise<void> {
    if (nativeProbeDone) {
      return;
    }

    nativeProbeDone = true;

    try {
      const { Capacitor } = await import('@capacitor/core');
      if (!Capacitor.isNativePlatform()) {
        return;
      }

      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      nativePulse = async (event: HapticEvent) => {
        const style = event === HAPTIC_EVENTS.Hit
          ? ImpactStyle.Heavy
          : ImpactStyle.Light;
        await Haptics.impact({ style });
      };
      nativeAvailable = true;
    } catch {
      nativePulse = null;
    }
  }

  function pulseWithVibrate(event: HapticEvent): void {
    if (!vibrate) {
      return;
    }

    try {
      vibrate(HAPTIC_PATTERNS[event]);
    } catch {
      // unsupported or blocked by browser policy
    }
  }

  return {
    pulse(event: HapticEvent): void {
      if (!enabled) {
        return;
      }

      void ensureNativePulse().then(() => {
        if (nativePulse) {
          void nativePulse(event).catch(() => {
            pulseWithVibrate(event);
          });
          return;
        }

        pulseWithVibrate(event);
      });
    },

    isSupported(): boolean {
      return vibrate !== null || nativeAvailable;
    },

    isEnabled(): boolean {
      return enabled;
    },

    setEnabled(nextEnabled: boolean): void {
      enabled = nextEnabled;
      writeEnabledPreference(nextEnabled);
    },

    toggleEnabled(): boolean {
      enabled = !enabled;
      writeEnabledPreference(enabled);
      return enabled;
    },
  };
}

let hapticManager: HapticManager | null = null;

export function getHapticManager(): HapticManager {
  if (!hapticManager) {
    hapticManager = createHapticManager();
  }

  return hapticManager;
}

export function resetHapticManagerForTests(): void {
  hapticManager = null;
}
