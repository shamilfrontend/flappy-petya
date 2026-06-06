import {
  BASE_WIDTH,
  GOOSE_X,
  GROUND_HEIGHT,
  OBSTACLE_BODY_HEIGHT,
  OBSTACLE_WIDTH,
  PIPE_GAP,
  PIPE_SPAWN_INTERVAL,
  PIPE_SPAWN_MARGIN,
  PIPE_SPAWN_OFFSET_MIN,
  PIPE_SPAWN_OFFSET_RANGE,
  PIPE_SPEED,
  PIPE_START_DELAY,
} from '../game/config';
import type { DifficultySettings } from '../game/difficulty';
import { drawObstacle } from '../graphics/environment';
import type { Goose } from './goose';

export interface Pipe {
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
}

/** Доля компенсации широкого экрана: 0 — как раньше, 1 — как на базовой ширине. */
const WIDE_SCREEN_SEED_BLEND = 0.4;

export class Pipes {
  private pipes: Pipe[] = [];
  private pipeGap = PIPE_GAP;
  private pipeSpeed = PIPE_SPEED;
  private spawnFrames = 0;

  setDifficulty(settings: DifficultySettings): void {
    this.pipeGap = settings.pipeGap;
    this.pipeSpeed = settings.pipeSpeed;
  }

  reset(): void {
    this.pipes = [];
    this.spawnFrames = 0;
  }

  /** Смещает первый столбец ближе на широких экранах, не ломая базовый ритм спавна. */
  seedInitial(width: number, height: number): void {
    const baseSpawnX = BASE_WIDTH + PIPE_SPAWN_MARGIN;
    const wideSpawnX = width + PIPE_SPAWN_MARGIN;

    if (wideSpawnX <= baseSpawnX) {
      return;
    }

    const firstSpawnFrame = PIPE_START_DELAY + PIPE_SPAWN_INTERVAL;
    const targetXAtFirstSpawn =
      baseSpawnX + WIDE_SCREEN_SEED_BLEND * (wideSpawnX - baseSpawnX);
    const seedX = targetXAtFirstSpawn + firstSpawnFrame * this.pipeSpeed;

    this.pipes.push(this.createPipe(height, seedX));
  }

  update(
    width: number,
    height: number,
    goose: Goose,
    dt: number,
    onCollision: () => void,
    onScore: () => void,
  ): void {
    const previousSpawnFrames = this.spawnFrames;
    this.spawnFrames += dt;

    if (this.spawnFrames >= PIPE_START_DELAY) {
      const previousInterval = Math.floor(
        (Math.max(previousSpawnFrames, PIPE_START_DELAY) - PIPE_START_DELAY) /
          PIPE_SPAWN_INTERVAL,
      );
      const currentInterval = Math.floor(
        (this.spawnFrames - PIPE_START_DELAY) / PIPE_SPAWN_INTERVAL,
      );

      for (let i = previousInterval; i < currentInterval; i++) {
        this.pipes.push(this.createPipe(height, width + PIPE_SPAWN_MARGIN));
      }
    }

    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i];

      if (i === 0) {
        if (!pipe.passed && pipe.x + pipe.width < GOOSE_X) {
          pipe.passed = true;
          onScore();
        }

        if (this.checkCollision(goose, pipe)) {
          onCollision();
        }
      }

      pipe.x -= this.pipeSpeed * dt;

      if (pipe.x < -pipe.width) {
        this.pipes.splice(i, 1);
        i--;
      }
    }
  }

  private createPipe(height: number, x: number): Pipe {
    const y =
      height -
      (OBSTACLE_BODY_HEIGHT +
        GROUND_HEIGHT +
        PIPE_SPAWN_OFFSET_MIN +
        PIPE_SPAWN_OFFSET_RANGE * Math.random());

    return {
      x,
      y,
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_BODY_HEIGHT,
      passed: false,
    };
  }

  private checkCollision(goose: Goose, pipe: Pipe): boolean {
    const cx = Math.min(
      Math.max(goose.x, pipe.x),
      pipe.x + pipe.width,
    );
    const cy1 = Math.min(
      Math.max(goose.y, pipe.y),
      pipe.y + pipe.height,
    );
    const cy2 = Math.min(
      Math.max(goose.y, pipe.y + pipe.height + this.pipeGap),
      pipe.y + 2 * pipe.height + this.pipeGap,
    );

    const dx = goose.x - cx;
    const dy1 = goose.y - cy1;
    const dy2 = goose.y - cy2;
    const d1 = dx * dx + dy1 * dy1;
    const d2 = dx * dx + dy2 * dy2;
    const r = goose.radius * goose.radius;

    return r > d1 || r > d2;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const pipe of this.pipes) {
      drawObstacle(ctx, pipe.x, pipe.y, pipe.height, true);
      drawObstacle(
        ctx,
        pipe.x,
        pipe.y + this.pipeGap + pipe.height,
        pipe.height,
        false,
      );
    }
  }
}
