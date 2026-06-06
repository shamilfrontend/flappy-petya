export const BASE_WIDTH = 320;
export const BASE_HEIGHT = 480;

export interface ViewportState {
  cssWidth: number;
  cssHeight: number;
  bufferWidth: number;
  bufferHeight: number;
  dpr: number;
  scale: number;
  logicalWidth: number;
  logicalHeight: number;
}

function getDisplaySize(): { width: number; height: number } {
  const root = document.documentElement;

  return {
    width: root.clientWidth || window.innerWidth,
    height: root.clientHeight || window.innerHeight,
  };
}

export function getViewportState(
  width = getDisplaySize().width,
  height = getDisplaySize().height,
): ViewportState {
  const cssWidth = Math.max(1, Math.round(width));
  const cssHeight = Math.max(1, Math.round(height));
  const dpr = window.devicePixelRatio || 1;
  const scale = cssHeight / BASE_HEIGHT;
  const logicalWidth = cssWidth / scale;
  const logicalHeight = BASE_HEIGHT;

  return {
    cssWidth,
    cssHeight,
    bufferWidth: Math.round(cssWidth * dpr),
    bufferHeight: Math.round(cssHeight * dpr),
    dpr,
    scale,
    logicalWidth,
    logicalHeight,
  };
}

export function applyCanvasSize(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  state: ViewportState,
): void {
  canvas.style.width = `${state.cssWidth}px`;
  canvas.style.height = `${state.cssHeight}px`;
  canvas.width = state.bufferWidth;
  canvas.height = state.bufferHeight;
  ctx.setTransform(state.dpr * state.scale, 0, 0, state.dpr * state.scale, 0, 0);
}

export function toLogicalPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  state: ViewportState,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 0, y: 0 };
  }

  const viewport = window.visualViewport;
  const offsetX = viewport?.offsetLeft ?? 0;
  const offsetY = viewport?.offsetTop ?? 0;
  const x = clientX - offsetX;
  const y = clientY - offsetY;

  return {
    x: ((x - rect.left) / rect.width) * state.logicalWidth,
    y: ((y - rect.top) / rect.height) * state.logicalHeight,
  };
}
