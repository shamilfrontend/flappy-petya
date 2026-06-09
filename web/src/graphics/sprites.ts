import { Sprite } from './sprite';

export interface Sprites {
  goose: Sprite[];
}

export function initSprites(gooseImg: HTMLImageElement): Sprites {
  return {
    goose: [
      new Sprite(gooseImg, 0, 0, 32, 24),
      new Sprite(gooseImg, 32, 0, 32, 24),
      new Sprite(gooseImg, 64, 0, 32, 24),
    ],
  };
}
