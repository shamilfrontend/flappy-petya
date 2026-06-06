import { getViewportState } from '../lib/viewport';
import { getCanvasPoint, isPointInRect } from './pointer';

describe('isPointInRect', () => {
  const rect = { x: 10, y: 20, width: 100, height: 50 };

  it('returns true when point is inside rect', () => {
    expect(isPointInRect({ x: 50, y: 40 }, rect)).toBe(true);
  });

  it('returns false when point is outside rect', () => {
    expect(isPointInRect({ x: 5, y: 40 }, rect)).toBe(false);
    expect(isPointInRect({ x: 120, y: 40 }, rect)).toBe(false);
    expect(isPointInRect({ x: 50, y: 10 }, rect)).toBe(false);
    expect(isPointInRect({ x: 50, y: 80 }, rect)).toBe(false);
  });

  it('returns false when point is on rect boundary', () => {
    expect(isPointInRect({ x: 10, y: 40 }, rect)).toBe(false);
    expect(isPointInRect({ x: 110, y: 40 }, rect)).toBe(false);
    expect(isPointInRect({ x: 50, y: 20 }, rect)).toBe(false);
    expect(isPointInRect({ x: 50, y: 70 }, rect)).toBe(false);
  });
});

describe('getCanvasPoint', () => {
  const viewport = getViewportState(320, 480);

  function createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 320,
      height: 480,
      top: 0,
      left: 0,
      right: 320,
      bottom: 480,
      toJSON: () => ({}),
    });

    return canvas;
  }

  it('maps mouse event to logical canvas coordinates', () => {
    const canvas = createCanvas();
    const event = new MouseEvent('click', { clientX: 160, clientY: 240 });

    expect(getCanvasPoint(canvas, event, viewport)).toEqual({
      x: 160,
      y: 240,
    });
  });

  it('maps touch event to logical canvas coordinates', () => {
    const canvas = createCanvas();
    const touch = {
      clientX: 80,
      clientY: 120,
      identifier: 0,
      target: canvas,
    } as unknown as Touch;
    const event = new TouchEvent('touchstart', { touches: [touch] });

    expect(getCanvasPoint(canvas, event, viewport)).toEqual({
      x: 80,
      y: 120,
    });
  });

  it('returns null for touch event without touch points', () => {
    const canvas = createCanvas();
    const event = new TouchEvent('touchend', { touches: [] });

    expect(getCanvasPoint(canvas, event, viewport)).toBeNull();
  });
});
