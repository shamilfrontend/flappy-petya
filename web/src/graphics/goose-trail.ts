interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

const MAX_POINTS = 10;
const MAX_AGE = 28;
const PUSH_INTERVAL = 3;

/** Короткий след за гусем во время полёта. */
export class GooseTrail {
  private points: TrailPoint[] = [];
  private pushAccumulator = 0;

  push(x: number, y: number, dt: number): void {
    this.pushAccumulator += dt;

    if (this.pushAccumulator >= PUSH_INTERVAL) {
      this.pushAccumulator = 0;
      this.points.unshift({ x, y, age: 0 });

      if (this.points.length > MAX_POINTS) {
        this.points.pop();
      }
    }

    for (const point of this.points) {
      point.age += dt;
    }

    while (
      this.points.length > 0
      && this.points[this.points.length - 1].age >= MAX_AGE
    ) {
      this.points.pop();
    }
  }

  update(dt: number): void {
    for (const point of this.points) {
      point.age += dt;
    }

    while (
      this.points.length > 0
      && this.points[this.points.length - 1].age >= MAX_AGE
    ) {
      this.points.pop();
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const life = 1 - point.age / MAX_AGE;
      const alpha = life * 0.35;
      const size = 4 + (1 - i / MAX_POINTS) * 6;
      const offsetX = i * 4;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x - offsetX, point.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  clear(): void {
    this.points = [];
    this.pushAccumulator = 0;
  }

  get count(): number {
    return this.points.length;
  }
}
