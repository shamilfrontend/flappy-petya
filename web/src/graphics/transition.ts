/**
 * Короткий fade-overlay при смене экрана.
 * progress: 1 — сразу после перехода, 0 — переход завершён.
 */
export function drawScreenTransition(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  overlayColor: string,
): void {
  if (progress <= 0) {
    return;
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const eased = clampedProgress * clampedProgress;
  const alpha = eased * 0.45;
  ctx.save();
  ctx.fillStyle = overlayColor;
  ctx.globalAlpha = alpha;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
