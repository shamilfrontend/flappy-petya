import { Sprite } from './sprite';
import { initSprites } from './sprites';

describe('initSprites', () => {
  it('creates goose animation frames', () => {
    const gooseImg = new Image();
    const sprites = initSprites(gooseImg);

    expect(sprites.goose).toHaveLength(3);
    sprites.goose.forEach((frame) => {
      expect(frame).toBeInstanceOf(Sprite);
      expect(frame.img).toBe(gooseImg);
    });
  });
});
