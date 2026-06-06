import { FG_TILE_WIDTH, GROUND_HEIGHT, OBSTACLE_WIDTH } from '../game/config';
import { THEME } from './theme';

const CAP_HEIGHT = 24;
const STRIPE_HEIGHT = 8;

const CLOUDS = [
  { x: 0.15, y: 0.18, w: 70, h: 28 },
  { x: 0.55, y: 0.12, w: 90, h: 32 },
  { x: 0.78, y: 0.25, w: 60, h: 24 },
];

export function drawSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const skyHeight = height - GROUND_HEIGHT;

  const gradient = ctx.createLinearGradient(0, 0, 0, skyHeight);
  gradient.addColorStop(0, THEME.skyTop);
  gradient.addColorStop(1, THEME.skyBottom);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, skyHeight);

  ctx.fillStyle = THEME.cloud;
  for (const cloud of CLOUDS) {
    const cx = width * cloud.x;
    const cy = skyHeight * cloud.y;
    ctx.beginPath();
    ctx.ellipse(cx, cy, cloud.w / 2, cloud.h / 2, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - cloud.w * 0.25, cy + 4, cloud.w * 0.3, cloud.h * 0.4, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + cloud.w * 0.25, cy + 4, cloud.w * 0.35, cloud.h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawGround(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scrollOffset: number,
): void {
  const groundY = height - GROUND_HEIGHT;

  ctx.fillStyle = THEME.ground;
  ctx.fillRect(0, groundY, width, GROUND_HEIGHT);

  ctx.fillStyle = THEME.groundStripe;
  ctx.fillRect(0, groundY, width, STRIPE_HEIGHT);

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, groundY + STRIPE_HEIGHT, width, GROUND_HEIGHT - STRIPE_HEIGHT);
  ctx.clip();

  const patternTop = groundY + STRIPE_HEIGHT;
  const tileSize = FG_TILE_WIDTH * 2;
  const offset = scrollOffset % tileSize;

  ctx.strokeStyle = 'rgba(180, 160, 120, 0.35)';
  ctx.lineWidth = 2;

  for (let x = -tileSize + offset; x < width + tileSize; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, patternTop);
    ctx.lineTo(x + tileSize, patternTop + tileSize);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  bodyHeight: number,
  capAtBottom: boolean,
): void {
  const bodyY = capAtBottom ? y + CAP_HEIGHT : y;
  const bodyH = bodyHeight - CAP_HEIGHT;

  ctx.fillStyle = THEME.obstacle;
  ctx.strokeStyle = THEME.outline;
  ctx.lineWidth = 2;

  ctx.fillRect(x + 2, bodyY, OBSTACLE_WIDTH - 4, bodyH);
  ctx.strokeRect(x + 2, bodyY, OBSTACLE_WIDTH - 4, bodyH);

  ctx.fillStyle = THEME.obstacleCap;
  const capY = capAtBottom ? y + bodyHeight - CAP_HEIGHT : y;

  ctx.beginPath();
  ctx.roundRect(x, capY, OBSTACLE_WIDTH, CAP_HEIGHT, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(x + 6, bodyY + 4, 6, bodyH - 8);
}
