import { Sprite } from './sprite';

describe('Sprite', () => {
  it('doubles sprite sheet coordinates and dimensions', () => {
    const img = new Image();
    const sprite = new Sprite(img, 10, 20, 30, 40);

    expect(sprite.img).toBe(img);
    expect(sprite.x).toBe(20);
    expect(sprite.y).toBe(40);
    expect(sprite.width).toBe(60);
    expect(sprite.height).toBe(80);
  });

  it('draws image region at target position', () => {
    const img = new Image();
    const sprite = new Sprite(img, 0, 0, 16, 16);
    const ctx = {
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    sprite.draw(ctx, 100, 200);

    expect(ctx.drawImage).toHaveBeenCalledWith(
      img,
      0,
      0,
      32,
      32,
      100,
      200,
      32,
      32,
    );
  });
});
