import { describe, expect, it, vi } from 'vitest';
import { expandHitbox } from '../../input/pointer';

describe('expandHitbox', () => {
  it('расширяет маленький rect до минимального размера по центру', () => {
    const expanded = expandHitbox(
      { x: 100, y: 200, width: 30, height: 20 },
      44,
      44,
    );

    expect(expanded.width).toBe(44);
    expect(expanded.height).toBe(44);
    expect(expanded.x).toBe(93);
    expect(expanded.y).toBe(188);
  });
});

vi.mock('../../input/pointer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../input/pointer')>();
  return {
    ...actual,
    getCanvasPoint: () => ({ x: 160, y: 220 }),
  };
});

describe('handleSplashPress', () => {
  it('не вызывает startGame повторно при isStartingGame', async () => {
    const startGame = vi.fn();
    const host = {
      canvas: {} as HTMLCanvasElement,
      viewport: {
        logicalWidth: 320,
        logicalHeight: 480,
      },
      playBtn: { x: 110, y: 200, width: 100, height: 40 },
      recordsBtn: { x: 0, y: 400, width: 0, height: 0 },
      settingsBtn: { x: 0, y: 400, width: 0, height: 0 },
      difficultyTabBtns: [],
      isStartingGame: true,
      nextStartAllowedAtMs: 0,
      haptic: { pulse: vi.fn() },
      startGame,
    };

    const { handleSplashPress } = await import('./splash');
    const evt = {
      preventDefault: vi.fn(),
    } as unknown as PointerEvent;

    handleSplashPress(host as never, evt);

    expect(startGame).not.toHaveBeenCalled();
  });
});
