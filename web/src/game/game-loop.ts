import {
  MAX_FRAME_DELTA,
  MS_PER_FRAME,
  RESIZE_DEBOUNCE_MS,
} from './config';

export interface GameLoopFrameCallbacks {
  update: (dt: number) => void;
  render: () => void;
}

export interface GameLoopResizeCallbacks {
  onResize: () => void;
}

export class GameLoop {
  private rafId: number | null = null;
  private lastFrameTime = 0;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private readonly frameCallbacks: GameLoopFrameCallbacks;
  private readonly resizeCallbacks: GameLoopResizeCallbacks;

  constructor(
    frameCallbacks: GameLoopFrameCallbacks,
    resizeCallbacks: GameLoopResizeCallbacks,
  ) {
    this.frameCallbacks = frameCallbacks;
    this.resizeCallbacks = resizeCallbacks;
  }

  start(): void {
    const loop = (timestamp: number): void => {
      if (this.lastFrameTime === 0) {
        this.lastFrameTime = timestamp;
      }

      const deltaMs = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;
      const dt = Math.min(deltaMs / MS_PER_FRAME, MAX_FRAME_DELTA);

      this.frameCallbacks.update(dt);
      this.frameCallbacks.render();
      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resetFrameTime(): void {
    this.lastFrameTime = 0;
  }

  bindResizeTracking(): void {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
    window.visualViewport?.addEventListener('resize', this.onResize);
    window.visualViewport?.addEventListener('scroll', this.onResize);

    this.resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });
    this.resizeObserver.observe(document.documentElement);

    requestAnimationFrame(() => {
      this.resizeCallbacks.onResize();
    });
  }

  bindVisibilityTracking(): void {
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  destroy(): void {
    this.stop();

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('orientationchange', this.onResize);
    window.visualViewport?.removeEventListener('resize', this.onResize);
    window.visualViewport?.removeEventListener('scroll', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.resizeTimer !== null) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
  }

  private readonly onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      this.resetFrameTime();
    }
  };

  private readonly onResize = (): void => {
    if (this.resizeTimer !== null) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = setTimeout(() => {
      this.resizeTimer = null;
      this.resizeCallbacks.onResize();
    }, RESIZE_DEBOUNCE_MS);
  };
}
