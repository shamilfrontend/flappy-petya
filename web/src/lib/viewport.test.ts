import {
  BASE_HEIGHT,
  applyCanvasSize,
  getViewportState,
  toLogicalPoint,
} from './viewport';

describe('getViewportState', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 2,
    });
  });

  it('computes viewport dimensions from explicit width and height', () => {
    const state = getViewportState(640, 960);

    expect(state.cssWidth).toBe(640);
    expect(state.cssHeight).toBe(960);
    expect(state.dpr).toBe(2);
    expect(state.scale).toBe(960 / BASE_HEIGHT);
    expect(state.logicalWidth).toBe(640 / (960 / BASE_HEIGHT));
    expect(state.logicalHeight).toBe(BASE_HEIGHT);
    expect(state.bufferWidth).toBe(1280);
    expect(state.bufferHeight).toBe(1920);
  });

  it('clamps dimensions to at least 1', () => {
    const state = getViewportState(0, -10);

    expect(state.cssWidth).toBe(1);
    expect(state.cssHeight).toBe(1);
  });
});

describe('toLogicalPoint', () => {
  it('maps client coordinates to logical canvas space', () => {
    const canvas = document.createElement('canvas');
    canvas.getBoundingClientRect = () => ({
      x: 100,
      y: 50,
      width: 320,
      height: 480,
      top: 50,
      left: 100,
      right: 420,
      bottom: 530,
      toJSON: () => ({}),
    });

    const state = getViewportState(320, 480);
    const point = toLogicalPoint(canvas, 260, 290, state);

    expect(point.x).toBeCloseTo(160);
    expect(point.y).toBeCloseTo(240);
  });

  it('returns origin when canvas rect has zero size', () => {
    const canvas = document.createElement('canvas');
    canvas.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      toJSON: () => ({}),
    });

    const state = getViewportState(320, 480);

    expect(toLogicalPoint(canvas, 100, 100, state)).toEqual({ x: 0, y: 0 });
  });
});

describe('applyCanvasSize', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 2,
    });
  });

  it('applies css size, buffer size and canvas transform', () => {
    const canvas = document.createElement('canvas');
    const ctx = {
      setTransform: vi.fn(),
    } as unknown as CanvasRenderingContext2D;
    const state = getViewportState(320, 480);

    applyCanvasSize(canvas, ctx, state);

    expect(canvas.style.width).toBe('320px');
    expect(canvas.style.height).toBe('480px');
    expect(canvas.width).toBe(640);
    expect(canvas.height).toBe(960);
    expect(ctx.setTransform).toHaveBeenCalledWith(
      state.dpr * state.scale,
      0,
      0,
      state.dpr * state.scale,
      0,
      0,
    );
  });
});
