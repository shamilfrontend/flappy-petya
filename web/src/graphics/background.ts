import { GROUND_HEIGHT } from '../game/config';
import { DEFAULT_PALETTE, type Palette } from './theme';

interface BackgroundCloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
}

const CLOUDS: BackgroundCloud[] = [
  { x: 0.1, y: 0.14, scale: 1, speed: 0.12 },
  { x: 0.45, y: 0.1, scale: 1.3, speed: 0.08 },
  { x: 0.72, y: 0.2, scale: 0.85, speed: 0.16 },
  { x: 0.9, y: 0.12, scale: 1.1, speed: 0.1 },
];

/** Рисует силуэт холмов в виде синусоидальной гряды со скроллингом. */
function drawHills(
  ctx: CanvasRenderingContext2D,
  width: number,
  baseY: number,
  amplitude: number,
  wavelength: number,
  scroll: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, baseY + amplitude);

  for (let x = 0; x <= width; x += 8) {
    const y =
      baseY - amplitude * Math.sin((x + scroll) / wavelength) * 0.5
      - amplitude * 0.5;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(width, baseY + amplitude);
  ctx.closePath();
  ctx.fill();
}

function drawCloud(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
): void {
  const w = 70 * scale;
  const h = 26 * scale;

  ctx.beginPath();
  ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.ellipse(cx - w * 0.28, cy + 5, w * 0.3, h * 0.4, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + w * 0.28, cy + 5, w * 0.34, h * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Многослойный параллакс-фон: плывущие облака и две гряды холмов,
 * скроллящиеся с разной скоростью относительно переднего плана.
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scroll: number,
  frames: number,
  palette: Palette = DEFAULT_PALETTE,
): void {
  const skyHeight = height - GROUND_HEIGHT;

  ctx.fillStyle = palette.cloud;
  for (const cloud of CLOUDS) {
    const drift = (frames * cloud.speed) % (width + 140);
    const cx = ((width * cloud.x + drift) % (width + 140)) - 70;
    drawCloud(ctx, cx, skyHeight * cloud.y, cloud.scale);
  }

  drawHills(ctx, width, skyHeight, 70, 220, scroll * 0.3, palette.hillFar);
  drawHills(ctx, width, skyHeight + 24, 56, 150, scroll * 0.6, palette.hillNear);
}
