import { RESIZE_DEBOUNCE_MS } from './config';
import { GameLoop } from './game-loop';

describe('GameLoop', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces resize handling', () => {
    vi.useFakeTimers();
    const onResize = vi.fn();
    const loop = new GameLoop(
      { update: vi.fn(), render: vi.fn() },
      { onResize },
    );

    vi.stubGlobal('requestAnimationFrame', vi.fn());
    loop.bindResizeTracking();
    onResize.mockClear();
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));

    expect(onResize).not.toHaveBeenCalled();

    vi.advanceTimersByTime(RESIZE_DEBOUNCE_MS);

    expect(onResize).toHaveBeenCalledOnce();
    loop.destroy();
    vi.unstubAllGlobals();
  });

  it('resets frame time when tab becomes visible again', () => {
    const loop = new GameLoop(
      { update: vi.fn(), render: vi.fn() },
      { onResize: vi.fn() },
    );
    const internals = loop as unknown as { lastFrameTime: number };

    loop.bindVisibilityTracking();
    internals.lastFrameTime = 5000;

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: 'visible',
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(internals.lastFrameTime).toBe(0);
    loop.destroy();
  });

  it('stops animation frame loop on destroy', () => {
    const cancelSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
    const loop = new GameLoop(
      { update: vi.fn(), render: vi.fn() },
      { onResize: vi.fn() },
    );

    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 42));
    loop.start();
    loop.destroy();

    expect(cancelSpy).toHaveBeenCalledWith(42);
    cancelSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
