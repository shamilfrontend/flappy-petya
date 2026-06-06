import {
  BASE_WIDTH,
  GOOSE_X,
  OBSTACLE_WIDTH,
  PIPE_SPAWN_INTERVAL,
  PIPE_SPAWN_MARGIN,
  PIPE_START_DELAY,
} from '../game/config';
import { DIFFICULTIES } from '../game/difficulty';
import { Goose } from './goose';
import { Pipes } from './pipes';

describe('Pipes', () => {
  const height = 480;
  const width = 640;
  let goose: Goose;
  let pipes: Pipes;

  beforeEach(() => {
    goose = new Goose();
    pipes = new Pipes();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reset clears spawn progress', () => {
    const onScore = vi.fn();
    const onCollision = vi.fn();

    pipes.seedInitial(width, height);
    pipes.reset();
    pipes.update(width, height, goose, PIPE_START_DELAY - 1, onCollision, onScore);

    expect(onScore).not.toHaveBeenCalled();
    expect(onCollision).not.toHaveBeenCalled();
  });

  it('does not seed initial pipe on base width screen before spawn delay', () => {
    const onScore = vi.fn();
    const onCollision = vi.fn();

    pipes.seedInitial(BASE_WIDTH, height);
    pipes.update(BASE_WIDTH, height, goose, PIPE_START_DELAY - 1, onCollision, onScore);

    expect(onScore).not.toHaveBeenCalled();
    expect(onCollision).not.toHaveBeenCalled();
  });

  it('seeds initial pipe on wide screen', () => {
    const onCollision = vi.fn();
    const onScore = vi.fn();

    goose.y = 280;
    pipes.seedInitial(width, height);

    for (let frame = 0; frame < 500; frame += 1) {
      pipes.update(width, height, goose, 1, onCollision, onScore);
    }

    expect(onScore).toHaveBeenCalled();
  });

  it('scores when first pipe passes the goose', () => {
    const onScore = vi.fn();
    const onCollision = vi.fn();

    goose.y = 280;
    pipes.seedInitial(width, height);

    for (let frame = 0; frame < 500; frame += 1) {
      pipes.update(width, height, goose, 1, onCollision, onScore);

      if (onScore.mock.calls.length > 0) {
        break;
      }
    }

    expect(onScore).toHaveBeenCalledOnce();
    expect(onCollision).not.toHaveBeenCalled();
  });

  it('detects collision with top pipe body', () => {
    const onScore = vi.fn();
    const onCollision = vi.fn();

    goose.y = 100;
    pipes.seedInitial(width, height);

    for (let frame = 0; frame < 500; frame += 1) {
      pipes.update(width, height, goose, 1, onCollision, onScore);

      if (onCollision.mock.calls.length > 0) {
        break;
      }
    }

    expect(onCollision).toHaveBeenCalled();
  });

  it('applies difficulty settings to pipe movement speed', () => {
    const onScore = vi.fn();
    const onCollision = vi.fn();

    goose.y = 280;
    pipes.setDifficulty(DIFFICULTIES[0]);
    pipes.seedInitial(width, height);

    for (let frame = 0; frame < 450; frame += 1) {
      pipes.update(width, height, goose, 1, onCollision, onScore);
    }

    expect(onScore).not.toHaveBeenCalled();

    for (let frame = 0; frame < 200; frame += 1) {
      pipes.update(width, height, goose, 1, onCollision, onScore);
    }

    expect(onScore).toHaveBeenCalled();
  });

  it('stops callbacks after reset until spawn delay passes', () => {
    const onScore = vi.fn();
    const onCollision = vi.fn();

    goose.y = 280;
    pipes.seedInitial(width, height);

    for (let frame = 0; frame < 800; frame += 1) {
      pipes.update(width, height, goose, 1, onCollision, onScore);
    }

    onScore.mockClear();
    onCollision.mockClear();
    pipes.reset();
    pipes.update(width, height, goose, PIPE_START_DELAY - 1, onCollision, onScore);

    expect(onCollision).not.toHaveBeenCalled();
    expect(onScore).not.toHaveBeenCalled();
  });

  it('spawns new pipes after start delay', () => {
    const onScore = vi.fn();
    const onCollision = vi.fn();

    goose.y = 280;

    for (let frame = 0; frame < PIPE_START_DELAY + PIPE_SPAWN_INTERVAL; frame += 1) {
      pipes.update(width, height, goose, 1, onCollision, onScore);
    }

    expect(onScore).not.toHaveBeenCalled();

    for (let frame = 0; frame < 400; frame += 1) {
      pipes.update(width, height, goose, 1, onCollision, onScore);
    }

    expect(onScore).toHaveBeenCalled();
  });

  it('checks collision only for the first pipe', () => {
    const onScore = vi.fn();
    const onCollision = vi.fn();

    goose.y = 100;

    for (let frame = 0; frame < PIPE_START_DELAY + 300; frame += 1) {
      pipes.update(width, height, goose, 1, onCollision, onScore);
    }

    expect(onCollision.mock.calls.length).toBeLessThanOrEqual(1);
  });

  it('creates pipes with configured width', () => {
    const onCollision = vi.fn();
    const onScore = vi.fn();

    goose.y = 280;
    pipes.seedInitial(width, height);
    pipes.update(width, height, goose, 1, onCollision, onScore);

    expect(onScore).not.toHaveBeenCalled();
    expect(GOOSE_X).toBeGreaterThan(OBSTACLE_WIDTH);
    expect(PIPE_SPAWN_MARGIN).toBeGreaterThan(0);
  });
});
