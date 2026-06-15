import { GROUND_HEIGHT } from '../game/config';
import { DEFAULT_PALETTE, type Palette } from './theme';

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
}

/** Детерминированные позиции звёзд (доли ширины/высоты неба). */
const STARS: Star[] = [
  { x: 0.08, y: 0.12, size: 1.6, phase: 0 },
  { x: 0.18, y: 0.28, size: 1.1, phase: 1.3 },
  { x: 0.27, y: 0.08, size: 1.4, phase: 2.1 },
  { x: 0.36, y: 0.22, size: 1, phase: 0.7 },
  { x: 0.47, y: 0.14, size: 1.8, phase: 3.4 },
  { x: 0.58, y: 0.3, size: 1.2, phase: 1.9 },
  { x: 0.66, y: 0.1, size: 1.5, phase: 2.7 },
  { x: 0.74, y: 0.24, size: 1, phase: 0.4 },
  { x: 0.83, y: 0.16, size: 1.7, phase: 3.1 },
  { x: 0.92, y: 0.3, size: 1.2, phase: 1.1 },
  { x: 0.5, y: 0.05, size: 1.3, phase: 2.4 },
  { x: 0.13, y: 0.4, size: 1, phase: 0.9 },
];

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

function drawSun(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  alpha: number,
): void {
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 2.4);
  glow.addColorStop(0, withAlpha(color, 0.45 * alpha));
  glow.addColorStop(1, withAlpha(color, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 2.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = withAlpha(color, alpha);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawMoon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  alpha: number,
): void {
  const glow = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 2);
  glow.addColorStop(0, withAlpha(color, 0.35 * alpha));
  glow.addColorStop(1, withAlpha(color, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = withAlpha(color, alpha);
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = withAlpha('#C7CFE6', 0.5 * alpha);
  ctx.beginPath();
  ctx.arc(cx - radius * 0.35, cy - radius * 0.2, radius * 0.22, 0, Math.PI * 2);
  ctx.arc(cx + radius * 0.25, cy + radius * 0.1, radius * 0.16, 0, Math.PI * 2);
  ctx.arc(cx + radius * 0.05, cy - radius * 0.4, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  skyHeight: number,
  frames: number,
  color: string,
  nightFactor: number,
): void {
  for (let i = 0; i < STARS.length; i++) {
    const star = STARS[i];
    const twinkle = 0.55 + 0.45 * Math.sin(frames * 0.05 + star.phase);
    ctx.fillStyle = withAlpha(color, twinkle * nightFactor);
    ctx.beginPath();
    ctx.arc(width * star.x, skyHeight * star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Небесные тела: солнце (днём) и луна со звёздами (ночью).
 * Прозрачность управляется nightFactor (0 — день, 1 — ночь).
 */
export function drawCelestial(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frames: number,
  nightFactor: number,
  palette: Palette = DEFAULT_PALETTE,
): void {
  const skyHeight = height - GROUND_HEIGHT;
  const dayFactor = 1 - nightFactor;
  const cx = width * 0.78;
  const cy = skyHeight * 0.24;

  if (dayFactor > 0.01) {
    drawSun(ctx, cx, cy, 26, palette.sun, dayFactor);
  }

  if (nightFactor > 0.01) {
    drawStars(ctx, width, skyHeight, frames, palette.star, nightFactor);
    drawMoon(ctx, cx, cy, 22, palette.moon, nightFactor);
  }
}
