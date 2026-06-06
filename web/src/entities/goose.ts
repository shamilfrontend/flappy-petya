import {
  GOOSE_GRAVITY,
  GOOSE_JUMP,
  GOOSE_RADIUS,
  GOOSE_X,
  GROUND_OFFSET,
  SPLASH_GOOSE_BASE_OFFSET,
  SPLASH_GOOSE_HOVER_AMPLITUDE,
} from '../game/config';
import { GAME_STATES, type GameState } from '../game/states';
import type { Sprites } from '../graphics/sprites';

const ANIMATION_SEQUENCE = [0, 1, 2, 1];

export class Goose {
  readonly x = GOOSE_X;
  readonly radius = GOOSE_RADIUS;
  readonly animation = ANIMATION_SEQUENCE;

  y = 0;
  frame = 0;
  velocity = 0;
  rotation = 0;
  private animAccumulator = 0;

  jump(): void {
    this.velocity = -GOOSE_JUMP;
  }

  update(
    state: GameState,
    height: number,
    fgHeight: number,
    frames: number,
    dt: number,
    onGroundHit?: () => void,
  ): void {
    const animInterval =
      state === GAME_STATES.Splash
      || state === GAME_STATES.Records
      || state === GAME_STATES.Countdown
        ? 10
        : 5;
    this.animAccumulator += dt;

    while (this.animAccumulator >= animInterval) {
      this.animAccumulator -= animInterval;
      this.frame = (this.frame + 1) % this.animation.length;
    }

    if (state === GAME_STATES.Paused) {
      return;
    }

    if (state === GAME_STATES.Score) {
      this.velocity += GOOSE_GRAVITY * 0.5 * dt;
      this.y += this.velocity * dt;
      this.rotation += 0.15 * dt;

      const groundY = height - fgHeight - GROUND_OFFSET;
      if (this.y >= groundY) {
        this.y = groundY;
        this.velocity = 0;
      }

      return;
    }

    if (
      state === GAME_STATES.Splash
      || state === GAME_STATES.Records
      || state === GAME_STATES.Countdown
    ) {
      this.y =
        height -
        SPLASH_GOOSE_BASE_OFFSET +
        SPLASH_GOOSE_HOVER_AMPLITUDE * Math.cos(frames / 10);
      this.rotation = 0;
      return;
    }

    this.velocity += GOOSE_GRAVITY * dt;
    this.y += this.velocity * dt;

    const ceilingY = this.radius;
    if (this.y <= ceilingY) {
      this.y = ceilingY;
      this.velocity = 0;
    }

    const groundY = height - fgHeight - GROUND_OFFSET;
    if (this.y >= groundY) {
      this.y = groundY;
      if (state === GAME_STATES.Game) {
        onGroundHit?.();
      }
      this.velocity = GOOSE_JUMP;
    }

    if (this.velocity >= GOOSE_JUMP) {
      this.frame = 1;
      this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3 * dt);
    } else {
      this.rotation = -0.3;
    }
  }

  draw(ctx: CanvasRenderingContext2D, sprites: Sprites): void {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    const frameIndex = this.animation[this.frame];
    const sprite = sprites.goose[frameIndex];
    sprite.draw(ctx, -sprite.width / 2, -sprite.height / 2 + 6);

    ctx.restore();
  }
}
