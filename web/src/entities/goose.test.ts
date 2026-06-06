import {
  GOOSE_GRAVITY,
  GOOSE_JUMP,
  GOOSE_RADIUS,
  GROUND_OFFSET,
  SPLASH_GOOSE_BASE_OFFSET,
  SPLASH_GOOSE_HOVER_AMPLITUDE,
} from '../game/config';
import { GAME_STATES } from '../game/states';
import { Goose } from './goose';

describe('Goose', () => {
  const height = 480;
  const fgHeight = 112;

  it('jump sets upward velocity', () => {
    const goose = new Goose();

    goose.jump();

    expect(goose.velocity).toBe(-GOOSE_JUMP);
  });

  it('hovers on splash screen with zero rotation', () => {
    const goose = new Goose();
    const frames = 20;

    goose.update(GAME_STATES.Splash, height, fgHeight, frames, 1);

    expect(goose.rotation).toBe(0);
    expect(goose.y).toBe(
      height
      - SPLASH_GOOSE_BASE_OFFSET
      + SPLASH_GOOSE_HOVER_AMPLITUDE * Math.cos(frames / 10),
    );
  });

  it('hovers on records screen the same way as splash', () => {
    const goose = new Goose();

    goose.update(GAME_STATES.Records, height, fgHeight, 0, 1);

    expect(goose.rotation).toBe(0);
    expect(goose.y).toBe(height - SPLASH_GOOSE_BASE_OFFSET + SPLASH_GOOSE_HOVER_AMPLITUDE);
  });

  it('applies gravity during game state', () => {
    const goose = new Goose();
    goose.y = 200;
    goose.velocity = 0;

    goose.update(GAME_STATES.Game, height, fgHeight, 0, 1);

    expect(goose.velocity).toBe(GOOSE_GRAVITY);
    expect(goose.y).toBe(200 + GOOSE_GRAVITY);
  });

  it('clamps position and velocity at ceiling', () => {
    const goose = new Goose();
    goose.y = GOOSE_RADIUS;
    goose.velocity = -10;

    goose.update(GAME_STATES.Game, height, fgHeight, 0, 1);

    expect(goose.y).toBe(GOOSE_RADIUS);
    expect(goose.velocity).toBe(0);
  });

  it('calls onGroundHit when landing during game', () => {
    const goose = new Goose();
    const groundY = height - fgHeight - GROUND_OFFSET;
    const onGroundHit = vi.fn();

    goose.y = groundY;
    goose.update(GAME_STATES.Game, height, fgHeight, 0, 1, onGroundHit);

    expect(onGroundHit).toHaveBeenCalledOnce();
    expect(goose.y).toBe(groundY);
    expect(goose.velocity).toBe(GOOSE_JUMP);
  });

  it('does not call onGroundHit on splash screen', () => {
    const goose = new Goose();
    const onGroundHit = vi.fn();

    goose.update(GAME_STATES.Splash, height, fgHeight, 0, 1, onGroundHit);

    expect(onGroundHit).not.toHaveBeenCalled();
  });
});
