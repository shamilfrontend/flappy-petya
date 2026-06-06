export const HAPTIC_EVENTS = {
  Jump: 'jump',
  Score: 'score',
  Hit: 'hit',
} as const;

export type HapticEvent = (typeof HAPTIC_EVENTS)[keyof typeof HAPTIC_EVENTS];

export interface HapticManager {
  pulse(event: HapticEvent): void;
  isSupported(): boolean;
}

const HAPTIC_PATTERNS: Record<HapticEvent, number | number[]> = {
  [HAPTIC_EVENTS.Jump]: 10,
  [HAPTIC_EVENTS.Score]: 15,
  [HAPTIC_EVENTS.Hit]: 30,
};

type VibrateFn = (pattern: number | number[]) => boolean;

function getBrowserVibrate(): VibrateFn | null {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return null;
  }

  return navigator.vibrate.bind(navigator);
}

export function createHapticManager(
  vibrateFactory: () => VibrateFn | null = getBrowserVibrate,
): HapticManager {
  const vibrate = vibrateFactory();

  return {
    pulse(event: HapticEvent): void {
      if (!vibrate) {
        return;
      }

      try {
        vibrate(HAPTIC_PATTERNS[event]);
      } catch {
        // unsupported or blocked by browser policy
      }
    },

    isSupported(): boolean {
      return vibrate !== null;
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
