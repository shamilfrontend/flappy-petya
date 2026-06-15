interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  gravity: number;
  text?: string;
}

const SCORE_COLORS = ['#FFE066', '#FFD23F', '#FFF3B0', '#FFFFFF'];
const FEATHER_COLORS = ['#F5F5F0', '#E8E8E0', '#D9D4C5', '#FFFFFF'];
const FLAP_COLORS = ['#FFFFFF', '#F0F0F0', '#E8E8E8'];

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Лёгкая система частиц для визуальных эффектов (очки, столкновение, «+1»). */
export class ParticleSystem {
  private particles: Particle[] = [];

  /** Пыльца/пёрышки при взмахе крыльев. */
  emitFlap(x: number, y: number): void {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x - 8 + Math.random() * 4,
        y: y + (Math.random() - 0.5) * 10,
        vx: -random(0.8, 2.2),
        vy: random(-0.5, 0.8),
        life: random(10, 18),
        maxLife: 18,
        size: random(1.5, 3),
        color: pick(FLAP_COLORS),
        gravity: 0.04,
      });
    }
  }

  /** Искры/звёздочки при наборе очка. */
  emitScore(x: number, y: number): void {
    for (let i = 0; i < 10; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(0.6, 2.4);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        life: random(18, 30),
        maxLife: 30,
        size: random(2, 4),
        color: pick(SCORE_COLORS),
        gravity: 0.05,
      });
    }
  }

  /** Разлёт перьев при столкновении. */
  emitDeath(x: number, y: number): void {
    for (let i = 0; i < 16; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 4);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: random(24, 40),
        maxLife: 40,
        size: random(3, 6),
        color: pick(FEATHER_COLORS),
        gravity: 0.12,
      });
    }
  }

  /** Всплывающий текст «+1» у гуся. */
  emitScorePopup(x: number, y: number, text: string): void {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: -1.1,
      life: 40,
      maxLife: 40,
      size: 18,
      color: '#FFE066',
      gravity: 0,
      text,
    });
  }

  update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.life -= dt;

      if (p.life <= 0) {
        const lastIndex = this.particles.length - 1;
        if (i !== lastIndex) {
          this.particles[i] = this.particles[lastIndex];
        }
        this.particles.pop();
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.particles.length === 0) {
      return;
    }

    ctx.save();
    for (const p of this.particles) {
      const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
      ctx.globalAlpha = alpha;

      if (p.text) {
        ctx.fillStyle = p.color;
        ctx.strokeStyle = 'rgba(42, 42, 42, 0.8)';
        ctx.lineWidth = 3;
        ctx.font = `bold ${p.size}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(p.text, p.x, p.y);
        ctx.fillText(p.text, p.x, p.y);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  clear(): void {
    this.particles = [];
  }

  get count(): number {
    return this.particles.length;
  }
}
