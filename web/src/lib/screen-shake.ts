import { SHAKE_DURATION } from '../game/config';

const SHAKE_OFFSET_COUNT = SHAKE_DURATION;

export const SCREEN_SHAKE_OFFSETS = Array.from(
  { length: SHAKE_OFFSET_COUNT },
  (_, index) => ({
    x: Math.sin(index * 1.7) * 0.5,
    y: Math.cos(index * 2.3) * 0.5,
  }),
);

export function getScreenShakeOffset(
  shakeTimer: number,
  shakeIntensity: number,
): { x: number; y: number } {
  const progress = shakeTimer / SHAKE_DURATION;
  const intensity = shakeIntensity * progress;
  const index = Math.max(0, SHAKE_OFFSET_COUNT - Math.ceil(shakeTimer));
  const offset = SCREEN_SHAKE_OFFSETS[index % SHAKE_OFFSET_COUNT];

  return {
    x: offset.x * 2 * intensity,
    y: offset.y * 2 * intensity,
  };
}
