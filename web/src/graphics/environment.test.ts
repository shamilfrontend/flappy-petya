import { GROUND_HEIGHT } from '../game/config';
import { drawGround, drawObstacle, drawSky } from './environment';

function createMockContext(): CanvasRenderingContext2D & {
  calls: string[];
} {
  const calls: string[] = [];
  const gradient = {
    addColorStop: vi.fn(),
  };

  return {
    calls,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    createLinearGradient: vi.fn(() => gradient),
    fillRect: vi.fn(() => calls.push('fillRect')),
    strokeRect: vi.fn(() => calls.push('strokeRect')),
    roundRect: vi.fn(() => calls.push('roundRect')),
    beginPath: vi.fn(() => calls.push('beginPath')),
    ellipse: vi.fn(() => calls.push('ellipse')),
    fill: vi.fn(() => calls.push('fill')),
    save: vi.fn(() => calls.push('save')),
    restore: vi.fn(() => calls.push('restore')),
    rect: vi.fn(() => calls.push('rect')),
    clip: vi.fn(() => calls.push('clip')),
    moveTo: vi.fn(() => calls.push('moveTo')),
    lineTo: vi.fn(() => calls.push('lineTo')),
    stroke: vi.fn(() => calls.push('stroke')),
  } as unknown as CanvasRenderingContext2D & { calls: string[] };
}

describe('environment drawing', () => {
  it('draws sky gradient and clouds', () => {
    const ctx = createMockContext();

    drawSky(ctx, 320, 480);

    expect(ctx.createLinearGradient).toHaveBeenCalledWith(0, 0, 0, 480 - GROUND_HEIGHT);
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 320, 480 - GROUND_HEIGHT);
    expect(ctx.calls.filter((call) => call === 'ellipse')).toHaveLength(9);
  });

  it('draws ground with stripe and tiled pattern', () => {
    const ctx = createMockContext();

    drawGround(ctx, 320, 480, 14);

    expect(ctx.fillRect).toHaveBeenCalledWith(0, 480 - GROUND_HEIGHT, 320, GROUND_HEIGHT);
    expect(ctx.save).toHaveBeenCalled();
    expect(ctx.clip).toHaveBeenCalled();
    expect(ctx.restore).toHaveBeenCalled();
    expect(ctx.calls.filter((call) => call === 'stroke').length).toBeGreaterThan(0);
  });

  it('draws obstacle body and cap', () => {
    const ctx = createMockContext();

    drawObstacle(ctx, 100, 200, 400, true);

    expect(ctx.fillRect).toHaveBeenCalled();
    expect(ctx.strokeRect).toHaveBeenCalled();
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalled();
  });
});
