import { FG_TILE_WIDTH, GROUND_HEIGHT, OBSTACLE_WIDTH } from '../game/config';
import { DEFAULT_PALETTE, type Palette } from './theme';

const CAP_HEIGHT = 24;
const STRIPE_HEIGHT = 8;
const GRASS_HEIGHT = 10;

interface GradientCacheEntry {
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  skyKey: string;
  sky: CanvasGradient | null;
  groundKey: string;
  ground: CanvasGradient | null;
}

const gradientCache: GradientCacheEntry = {
  ctx: null,
  width: 0,
  height: 0,
  skyKey: '',
  sky: null,
  groundKey: '',
  ground: null,
};

function positiveMod(value: number, period: number): number {
  return ((value % period) + period) % period;
}

function getSkyGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: Palette,
): CanvasGradient {
  const skyHeight = height - GROUND_HEIGHT;
  const skyKey = `${palette.skyTop}|${palette.skyBottom}`;
  if (
    gradientCache.ctx !== ctx
    || gradientCache.width !== width
    || gradientCache.height !== height
    || gradientCache.sky === null
    || gradientCache.skyKey !== skyKey
  ) {
    const gradient = ctx.createLinearGradient(0, 0, 0, skyHeight);
    gradient.addColorStop(0, palette.skyTop);
    gradient.addColorStop(1, palette.skyBottom);
    gradientCache.ctx = ctx;
    gradientCache.width = width;
    gradientCache.height = height;
    gradientCache.skyKey = skyKey;
    gradientCache.sky = gradient;
  }

  return gradientCache.sky;
}

function getGroundGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: Palette,
): CanvasGradient {
  const groundKey = `${palette.ground}|${palette.groundDark}`;
  if (
    gradientCache.ctx !== ctx
    || gradientCache.width !== width
    || gradientCache.height !== height
    || gradientCache.ground === null
    || gradientCache.groundKey !== groundKey
  ) {
    const groundY = height - GROUND_HEIGHT;
    const gradient = ctx.createLinearGradient(0, groundY, 0, height);
    gradient.addColorStop(0, palette.ground);
    gradient.addColorStop(1, palette.groundDark);
    gradientCache.ctx = ctx;
    gradientCache.width = width;
    gradientCache.height = height;
    gradientCache.groundKey = groundKey;
    gradientCache.ground = gradient;
  }

  return gradientCache.ground;
}

export function drawSky(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: Palette = DEFAULT_PALETTE,
): void {
  const skyHeight = height - GROUND_HEIGHT;
  ctx.fillStyle = getSkyGradient(ctx, width, height, palette);
  ctx.fillRect(0, 0, width, skyHeight);
}

export function drawGround(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scrollOffset: number,
  palette: Palette = DEFAULT_PALETTE,
): void {
  const groundY = height - GROUND_HEIGHT;
  ctx.fillStyle = getGroundGradient(ctx, width, height, palette);
  ctx.fillRect(0, groundY, width, GROUND_HEIGHT);

  ctx.fillStyle = palette.grassDark;
  ctx.fillRect(0, groundY, width, GRASS_HEIGHT + STRIPE_HEIGHT);

  drawGrassEdge(ctx, width, groundY, scrollOffset, palette);

  ctx.fillStyle = palette.groundStripe;
  ctx.fillRect(0, groundY + GRASS_HEIGHT, width, STRIPE_HEIGHT);

  drawGroundDecor(ctx, width, groundY, scrollOffset, palette);

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, groundY + GRASS_HEIGHT + STRIPE_HEIGHT, width, GROUND_HEIGHT);
  ctx.clip();

  const patternTop = groundY + GRASS_HEIGHT + STRIPE_HEIGHT;
  const tileSize = FG_TILE_WIDTH * 2;
  const phase = positiveMod(scrollOffset, tileSize);

  ctx.translate(phase, 0);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.lineWidth = 2;

  for (let x = -tileSize; x < width + tileSize * 2; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, patternTop);
    ctx.lineTo(x + tileSize, patternTop + tileSize);
    ctx.stroke();
  }

  ctx.restore();
}

function drawGrassEdge(
  ctx: CanvasRenderingContext2D,
  width: number,
  groundY: number,
  scrollOffset: number,
  palette: Palette,
): void {
  const toothWidth = 8;
  const period = toothWidth * 2;
  const phase = positiveMod(scrollOffset, period);

  ctx.save();
  ctx.translate(phase, 0);
  ctx.fillStyle = palette.grass;
  ctx.beginPath();
  ctx.moveTo(-period, groundY + GRASS_HEIGHT);

  for (let x = -period; x < width + period * 2; x += toothWidth) {
    ctx.lineTo(x, groundY);
    ctx.lineTo(x + toothWidth / 2, groundY + GRASS_HEIGHT * 0.5);
  }

  ctx.lineTo(width + period * 2, groundY + GRASS_HEIGHT);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const DECOR_SPACING = 64;
const FLOWER_COLORS = ['#FF7E9D', '#FFD23F', '#FF9F45', '#FFFFFF'];

/** Пучки травы и цветы у кромки, скроллятся вместе с землёй. */
function drawGroundDecor(
  ctx: CanvasRenderingContext2D,
  width: number,
  groundY: number,
  scrollOffset: number,
  palette: Palette,
): void {
  const halfSpacing = DECOR_SPACING / 2;
  const firstIndex = Math.floor((-scrollOffset - halfSpacing) / DECOR_SPACING);
  const lastIndex = Math.ceil((width - scrollOffset + halfSpacing) / DECOR_SPACING);
  const flowers: Array<{ x: number; colorIndex: number }> = [];

  ctx.strokeStyle = palette.grassDark;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let worldIndex = firstIndex; worldIndex <= lastIndex; worldIndex += 1) {
    const baseX = worldIndex * DECOR_SPACING + halfSpacing + scrollOffset;
    const kind = ((worldIndex % 3) + 3) % 3;

    if (kind === 0) {
      ctx.moveTo(baseX - 4, groundY + 2);
      ctx.lineTo(baseX - 6, groundY - 6);
      ctx.moveTo(baseX, groundY + 2);
      ctx.lineTo(baseX, groundY - 9);
      ctx.moveTo(baseX + 4, groundY + 2);
      ctx.lineTo(baseX + 6, groundY - 6);
      continue;
    }

    if (kind === 1) {
      ctx.moveTo(baseX, groundY + 2);
      ctx.lineTo(baseX, groundY - 8);
      flowers.push({ x: baseX, colorIndex: worldIndex });
    }
  }

  ctx.stroke();

  for (const flower of flowers) {
    ctx.fillStyle = FLOWER_COLORS[flower.colorIndex % FLOWER_COLORS.length];
    ctx.beginPath();
    ctx.arc(flower.x, groundY - 10, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  bodyHeight: number,
  capAtBottom: boolean,
  palette: Palette = DEFAULT_PALETTE,
  variant = 0,
): void {
  const bodyY = capAtBottom ? y + CAP_HEIGHT : y;
  const bodyH = bodyHeight - CAP_HEIGHT;
  const bodyX = x + 2;
  const bodyW = OBSTACLE_WIDTH - 4;
  const capRadius = variant === 1 ? 10 : 6;

  const bodyGradient = ctx.createLinearGradient(bodyX, 0, bodyX + bodyW, 0);
  bodyGradient.addColorStop(0, palette.obstacleLight);
  bodyGradient.addColorStop(0.35, palette.obstacle);
  bodyGradient.addColorStop(1, palette.obstacleDark);

  ctx.fillStyle = bodyGradient;
  ctx.fillRect(bodyX, bodyY, bodyW, bodyH);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillRect(bodyX + 4, bodyY, variant === 1 ? 8 : 5, bodyH);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fillRect(bodyX + bodyW - 6, bodyY, 6, bodyH);

  if (variant === 1) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(bodyX + 2, bodyY + bodyH * 0.35, bodyW - 4, 6);
  }

  if (variant === 2) {
    drawMossPatch(ctx, bodyX + 8, bodyY + bodyH * 0.25, palette);
    drawMossPatch(ctx, bodyX + bodyW - 16, bodyY + bodyH * 0.55, palette);
  }

  if (variant === 3) {
    drawBodyDrips(ctx, bodyX, bodyY, bodyW, bodyH);
  }

  if (variant === 4) {
    drawBodyVine(ctx, bodyX, bodyY, bodyH, palette);
  }

  const capY = capAtBottom ? y + bodyHeight - CAP_HEIGHT : y;
  const capGradient = ctx.createLinearGradient(x, 0, x + OBSTACLE_WIDTH, 0);
  capGradient.addColorStop(0, palette.obstacleLight);
  capGradient.addColorStop(0.4, palette.obstacleCap);
  capGradient.addColorStop(1, palette.obstacleDark);

  ctx.fillStyle = capGradient;
  ctx.beginPath();
  ctx.roundRect(x, capY, OBSTACLE_WIDTH, CAP_HEIGHT, capRadius);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.roundRect(x + 4, capY + 4, OBSTACLE_WIDTH - 8, 5, 3);
  ctx.fill();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(x + 2, capAtBottom ? capY : capY + CAP_HEIGHT - 4, OBSTACLE_WIDTH - 4, 4);

  drawCapLeaf(ctx, x, capY, capAtBottom, palette, variant === 2);

  if (variant === 3) {
    drawCapDrips(ctx, x, capY, capAtBottom);
  }
}

function drawBodyDrips(
  ctx: CanvasRenderingContext2D,
  bodyX: number,
  bodyY: number,
  bodyW: number,
  bodyH: number,
): void {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  for (let i = 0; i < 4; i++) {
    const dx = bodyX + 10 + (i * (bodyW - 20)) / 3;
    const dy = bodyY + bodyH * (0.2 + i * 0.18);
    ctx.beginPath();
    ctx.ellipse(dx, dy, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBodyVine(
  ctx: CanvasRenderingContext2D,
  bodyX: number,
  bodyY: number,
  bodyH: number,
  palette: Palette,
): void {
  ctx.strokeStyle = palette.grassDark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bodyX + 10, bodyY + 8);
  ctx.bezierCurveTo(
    bodyX + 22,
    bodyY + bodyH * 0.35,
    bodyX + 6,
    bodyY + bodyH * 0.65,
    bodyX + 14,
    bodyY + bodyH - 8,
  );
  ctx.stroke();
}

function drawCapDrips(
  ctx: CanvasRenderingContext2D,
  x: number,
  capY: number,
  capAtBottom: boolean,
): void {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  const rimY = capAtBottom ? capY : capY + CAP_HEIGHT;
  const dir = capAtBottom ? 1 : -1;

  for (let i = 0; i < 3; i++) {
    const dx = x + 12 + i * 14;
    ctx.beginPath();
    ctx.ellipse(dx, rimY + dir * 6, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMossPatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  palette: Palette,
): void {
  ctx.fillStyle = palette.grassDark;
  ctx.beginPath();
  ctx.ellipse(x, y, 6, 4, 0.3, 0, Math.PI * 2);
  ctx.fill();
}

/** Небольшой лист-акцент у края шапки, детерминированно от позиции. */
function drawCapLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  capY: number,
  capAtBottom: boolean,
  palette: Palette,
  doubleLeaf = false,
): void {
  const onLeft = Math.floor(x / OBSTACLE_WIDTH) % 2 === 0;
  const leafX = onLeft ? x + 8 : x + OBSTACLE_WIDTH - 8;
  const rimY = capAtBottom ? capY : capY + CAP_HEIGHT;
  const dir = capAtBottom ? 1 : -1;

  ctx.fillStyle = palette.grass;
  ctx.beginPath();
  ctx.ellipse(
    leafX,
    rimY + dir * 5,
    7,
    3,
    onLeft ? -0.6 : 0.6,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  if (doubleLeaf) {
    ctx.beginPath();
    ctx.ellipse(
      onLeft ? leafX + 14 : leafX - 14,
      rimY + dir * 7,
      5,
      2.5,
      onLeft ? 0.5 : -0.5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
}
