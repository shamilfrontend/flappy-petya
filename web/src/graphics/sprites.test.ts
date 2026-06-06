import { Sprite } from './sprite';
import { initSprites } from './sprites';

describe('initSprites', () => {
  it('creates goose animation frames and splash sprite', () => {
    const gooseImg = new Image();
    const splashImg = new Image();
    const sprites = initSprites(gooseImg, splashImg);

    expect(sprites.goose).toHaveLength(3);
    sprites.goose.forEach((frame) => {
      expect(frame).toBeInstanceOf(Sprite);
      expect(frame.img).toBe(gooseImg);
    });

    expect(sprites.petyaSplash).toBeInstanceOf(Sprite);
    expect(sprites.petyaSplash.img).toBe(splashImg);
    expect(sprites.petyaSplash.width).toBe(110);
    expect(sprites.petyaSplash.height).toBe(200);
  });
});
