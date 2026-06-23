import { toLogicalPoint, type ViewportState } from '../lib/viewport';

export interface CanvasPoint {
  x: number;
  y: number;
}

export type PressEvent = PointerEvent | MouseEvent | TouchEvent;

function isTouchEvent(evt: PressEvent): evt is TouchEvent {
  return 'touches' in evt;
}

function getClientCoords(evt: PressEvent): { x: number; y: number } | null {
  if (isTouchEvent(evt)) {
    const touch = evt.touches[0] ?? evt.changedTouches[0];
    if (!touch) {
      return null;
    }

    return { x: touch.clientX, y: touch.clientY };
  }

  return { x: evt.clientX, y: evt.clientY };
}

export function getCanvasPoint(
  canvas: HTMLCanvasElement,
  evt: PressEvent,
  viewport: ViewportState,
): CanvasPoint | null {
  const coords = getClientCoords(evt);
  if (!coords) {
    return null;
  }

  return toLogicalPoint(canvas, coords.x, coords.y, viewport);
}

export function expandHitbox(
  rect: { x: number; y: number; width: number; height: number },
  minWidth: number,
  minHeight: number,
): { x: number; y: number; width: number; height: number } {
  const width = Math.max(rect.width, minWidth);
  const height = Math.max(rect.height, minHeight);

  return {
    x: rect.x - (width - rect.width) / 2,
    y: rect.y - (height - rect.height) / 2,
    width,
    height,
  };
}

export function isPointInRect(
  point: CanvasPoint,
  rect: { x: number; y: number; width: number; height: number },
): boolean {
  if (
    !Number.isFinite(rect.x)
    || !Number.isFinite(rect.y)
    || !Number.isFinite(rect.width)
    || !Number.isFinite(rect.height)
    || rect.width <= 0
    || rect.height <= 0
  ) {
    return false;
  }

  return (
    point.x >= rect.x
    && point.x <= rect.x + rect.width
    && point.y >= rect.y
    && point.y <= rect.y + rect.height
  );
}
