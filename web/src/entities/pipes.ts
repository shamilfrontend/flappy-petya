import {
  BASE_WIDTH,
  GOOSE_X,
  GROUND_HEIGHT,
  OBSTACLE_BODY_HEIGHT,
  OBSTACLE_WIDTH,
  PIPE_DIFFICULTY_RAMP_SCORE,
  PIPE_GAP,
  PIPE_MAX_SPEED_BOOST,
  PIPE_SPAWN_INTERVAL,
  PIPE_SPAWN_MARGIN,
  PIPE_SPAWN_OFFSET_MIN,
  PIPE_SPAWN_OFFSET_RANGE,
  PIPE_SPEED,
  PIPE_START_DELAY,
  PIPE_VARIANT_COUNT,
} from '../game/config';
import type { DifficultySettings } from '../game/difficulty';
import { drawObstacle } from '../graphics/environment';
import type { Palette } from '../graphics/theme';
import type { Goose } from './goose';

export interface Pipe {
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
  variant: number;
}

/** Доля компенсации широкого экрана: 0 — как раньше, 1 — как на базовой ширине. */
const WIDE_SCREEN_SEED_BLEND = 0.4;

/** Горизонтальный зазор между seed-столбцом и первым обычным спавном (для тестов). */
export function getSeedGapAtFirstSpawn(
  width: number,
  pipeSpeed: number = PIPE_SPEED,
): number | null {
  const baseSpawnX = BASE_WIDTH + PIPE_SPAWN_MARGIN;
  const wideSpawnX = width + PIPE_SPAWN_MARGIN;

  if (wideSpawnX <= baseSpawnX) {
    return null;
  }

  const minGap = PIPE_SPAWN_INTERVAL * pipeSpeed;
  const maxTargetX = wideSpawnX - OBSTACLE_WIDTH - minGap;
  const desiredTargetX =
    baseSpawnX + WIDE_SCREEN_SEED_BLEND * (wideSpawnX - baseSpawnX);
  const targetXAtFirstSpawn = Math.min(desiredTargetX, maxTargetX);

  return wideSpawnX - (targetXAtFirstSpawn + OBSTACLE_WIDTH);
}

export class Pipes {
  private pipes: Pipe[] = [];
  private pipeGap = PIPE_GAP;
  private pipeSpeed = PIPE_SPEED;
  private basePipeSpeed = PIPE_SPEED;
  private spawnFrames = 0;

  setDifficulty(settings: DifficultySettings): void {
    this.pipeGap = settings.pipeGap;
    this.pipeSpeed = settings.pipeSpeed;
    this.basePipeSpeed = settings.pipeSpeed;
  }

  reset(): void {
    this.pipes = [];
    this.spawnFrames = 0;
  }

  /** Смещает первый столбец ближе на широких экранах, не ломая базовый ритм спавна. */
  seedInitial(width: number, height: number): void {
    const targetXAtFirstSpawn = this.getSeedTargetAtFirstSpawn(width);

    if (targetXAtFirstSpawn === null) {
      return;
    }

    const firstSpawnFrame = PIPE_START_DELAY + PIPE_SPAWN_INTERVAL;
    const seedX = targetXAtFirstSpawn + firstSpawnFrame * this.pipeSpeed;

    this.pipes.push(this.createPipe(height, seedX));
  }

  private getHorizontalPipeSpacing(): number {
    return PIPE_SPAWN_INTERVAL * this.pipeSpeed;
  }

  private getSeedTargetAtFirstSpawn(width: number): number | null {
    const gap = getSeedGapAtFirstSpawn(width, this.pipeSpeed);

    if (gap === null) {
      return null;
    }

    const wideSpawnX = width + PIPE_SPAWN_MARGIN;

    return wideSpawnX - OBSTACLE_WIDTH - gap;
  }

  update(
    width: number,
    height: number,
    goose: Goose,
    score: number,
    dt: number,
    onCollision: () => void,
    onScore: () => void,
  ): void {
    const speedScale = this.getDifficultySpeedScale(score);
    this.pipeSpeed = this.basePipeSpeed * speedScale;

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

      const spacing = this.getHorizontalPipeSpacing();

      for (let i = previousInterval; i < currentInterval; i++) {
        const spawnOffset = (currentInterval - 1 - i) * spacing;
        this.pipes.push(
          this.createPipe(height, width + PIPE_SPAWN_MARGIN + spawnOffset),
        );
      }
    }

    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i];

      if (i === 0 && !pipe.passed && pipe.x + pipe.width < GOOSE_X) {
        pipe.passed = true;
        onScore();
      }

      if (this.checkCollision(goose, pipe)) {
        onCollision();
        return;
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
      variant: Math.floor(Math.random() * PIPE_VARIANT_COUNT),
    };
  }

  private getDifficultySpeedScale(score: number): number {
    const clampedScore = Math.max(0, score);
    const rampProgress = Math.min(1, clampedScore / PIPE_DIFFICULTY_RAMP_SCORE);
    return 1 + PIPE_MAX_SPEED_BOOST * rampProgress;
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

  draw(ctx: CanvasRenderingContext2D, palette?: Palette): void {
    for (const pipe of this.pipes) {
      drawObstacle(ctx, pipe.x, pipe.y, pipe.height, true, palette, pipe.variant);
      drawObstacle(
        ctx,
        pipe.x,
        pipe.y + this.pipeGap + pipe.height,
        pipe.height,
        false,
        palette,
        pipe.variant,
      );
    }
  }
}
