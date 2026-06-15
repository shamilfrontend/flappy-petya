import { GROUND_HEIGHT } from '../game/config';

const FIREFLY_COUNT = 14;
const MOTE_COUNT = 10;

/**
 * Атмосферные частицы без сохранения состояния: позиции вычисляются
 * детерминированно из frames и индекса, поэтому эффект плавный и не течёт память.
 */
export function drawAtmosphere(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frames: number,
  nightFactor: number,
): void {
  const skyHeight = height - GROUND_HEIGHT;
  const clampedNight = Math.max(0, Math.min(1, nightFactor));
  const dayFactor = 1 - clampedNight;
  const duskBand = 1 - Math.min(1, Math.abs(clampedNight - 0.5) / 0.5);

  if (dayFactor > 0.01) {
    for (let i = 0; i < MOTE_COUNT; i++) {
      const seed = i * 2.399;
      const drift = (i / MOTE_COUNT) * width + frames * 0.15;
      const baseX = (drift + Math.sin(frames * 0.01 + seed) * 30) % width;
      const x = (baseX + width) % width;
      const y =
        skyHeight * (0.2 + 0.6 * ((i * 0.211) % 1))
        + Math.sin(frames * 0.015 + seed) * 24;
      const alpha = 0.12 + 0.1 * Math.abs(Math.sin(frames * 0.03 + seed));

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * dayFactor})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (clampedNight > 0.01) {
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const seed = i * 1.618;
      const baseX = ((i / FIREFLY_COUNT) * width + Math.sin(frames * 0.012 + seed) * 40) % width;
      const x = (baseX + width) % width;
      const y =
        skyHeight * (0.35 + 0.5 * ((i * 0.137) % 1))
        + Math.cos(frames * 0.02 + seed) * 18;
      const glow = 0.4 + 0.6 * Math.abs(Math.sin(frames * 0.06 + seed));
      const warmGlow = 0.25 + 0.75 * duskBand;

      const red = Math.round(190 + warmGlow * 65);
      const green = Math.round(255 - warmGlow * 45);
      const blue = Math.round(150 - warmGlow * 45);
      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${glow * clampedNight})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
