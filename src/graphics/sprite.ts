export class Sprite {
  readonly img: HTMLImageElement;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;

  constructor(
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height,
      x,
      y,
      this.width,
      this.height,
    );
  }
}
