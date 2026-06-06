import { MEDAL_TYPES } from '../game/medals';
import {
  drawButton,
  drawCountdown,
  drawPauseButton,
  drawPauseOverlay,
  drawGameOverImage,
  drawHint,
  drawPlayerNameButton,
  drawRecordsTab,
  drawRecordsTable,
  drawScoreBadge,
  drawScorePanel,
  drawSoundButton,
  drawSubtitle,
  drawTitle,
  drawTitleWithLogo,
  getRecordsPanelWidth,
  layoutRecordsTabs,
  measureButton,
  measurePauseButton,
  measurePlayerNameButton,
  measureSoundButton,
} from './ui-text';

function createMockContext(textWidth: number): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    font: '',
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    lineJoin: 'round',
    textAlign: 'center',
    textBaseline: 'middle',
    beginPath: vi.fn(),
    roundRect: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    stroke: vi.fn(),
    strokeText: vi.fn(),
    fillText: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    drawImage: vi.fn(),
    measureText: vi.fn((text: string) => ({
      width: text.length > 20 ? textWidth * 2 : textWidth,
    })),
  } as unknown as CanvasRenderingContext2D;
}

describe('ui-text helpers', () => {
  describe('measureSoundButton', () => {
    it('returns fixed square button size', () => {
      expect(measureSoundButton()).toEqual({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
      });
    });
  });

  describe('measurePauseButton', () => {
    it('matches sound button size', () => {
      expect(measurePauseButton()).toEqual(measureSoundButton());
    });
  });

  describe('measureButton', () => {
    it('computes button size from label width', () => {
      const ctx = createMockContext(80);

      expect(measureButton(ctx, 'Играть')).toEqual({
        x: 0,
        y: 0,
        width: 128,
        height: 48,
      });
    });
  });

  describe('measurePlayerNameButton', () => {
    it('includes icon slot in button width', () => {
      const ctx = createMockContext(60);

      expect(measurePlayerNameButton(ctx, 'Петя')).toEqual({
        x: 0,
        y: 0,
        width: 138,
        height: 48,
      });
    });
  });

  describe('getRecordsPanelWidth', () => {
    it('clamps panel width between min and max', () => {
      expect(getRecordsPanelWidth(500)).toBe(320);
      expect(getRecordsPanelWidth(220)).toBe(200);
      expect(getRecordsPanelWidth(280)).toBe(256);
    });
  });

  describe('layoutRecordsTabs', () => {
    it('distributes tabs evenly inside panel width', () => {
      const centerX = 160;
      const viewportWidth = 320;
      const panelWidth = getRecordsPanelWidth(viewportWidth);
      const panelX = centerX - panelWidth / 2;
      const tabWidth = (panelWidth - 6 * 2) / 3;
      const tabs = layoutRecordsTabs(centerX, 100, viewportWidth, 3);

      expect(tabs).toHaveLength(3);
      expect(tabs[0].x).toBe(panelX);
      expect(tabs[0].y).toBe(100);
      expect(tabs[0].width).toBeCloseTo(tabWidth);
      expect(tabs[0].height).toBe(36);
      expect(tabs[1].x).toBeCloseTo(panelX + tabWidth + 6);
      expect(tabs[2].x).toBeCloseTo(panelX + (tabWidth + 6) * 2);
    });
  });

  describe('draw functions', () => {
    const rect = { x: 10, y: 20, width: 120, height: 48 };

    it('draws title and subtitle text', () => {
      const ctx = createMockContext(80);

      drawTitle(ctx, 'Flappy Petya', 160, 50);
      drawSubtitle(ctx, 'Выбери уровень', 160, 90);
      drawHint(ctx, 'Тапни чтобы играть', 160, 130);

      expect(ctx.strokeText).toHaveBeenCalled();
      expect(ctx.fillText).toHaveBeenCalled();
    });

    it('draws score badge with rounded background', () => {
      const ctx = createMockContext(24);

      drawScoreBadge(ctx, 42, 160, 40);

      expect(ctx.roundRect).toHaveBeenCalled();
      expect(ctx.fillText).toHaveBeenCalledWith('42', 160, 40);
    });

    it('draws score panel and returns panel size', () => {
      const ctx = createMockContext(40);

      expect(drawScorePanel(ctx, 7, 15, 160, 200)).toEqual({
        width: 200,
        height: 90,
      });
      expect(ctx.fillText).toHaveBeenCalledWith('Счёт', 80, 185);
      expect(ctx.fillText).toHaveBeenCalledWith('7', 240, 185);
    });

    it('draws score panel with medal row', () => {
      const ctx = createMockContext(40);

      expect(drawScorePanel(ctx, 25, 25, 160, 200, {
        medal: MEDAL_TYPES.Silver,
      })).toEqual({
        width: 200,
        height: 118,
      });
      expect(ctx.fillText).toHaveBeenCalledWith('Медаль', 80, 235);
      expect(ctx.fillText).toHaveBeenCalledWith('Серебро', 240, 235);
    });

    it('draws sound button with mute state', () => {
      const ctx = createMockContext(20);

      drawSoundButton(ctx, { x: 10, y: 10, width: 40, height: 40 }, false);
      drawSoundButton(ctx, { x: 10, y: 10, width: 40, height: 40 }, true);

      expect(ctx.fillText).toHaveBeenCalledWith('🔊', 30, 30);
      expect(ctx.fillText).toHaveBeenCalledWith('🔇', 30, 30);
    });

    it('draws pause button and overlay', () => {
      const ctx = createMockContext(20);

      drawPauseButton(ctx, rect);
      drawPauseOverlay(ctx, 320, 480, 160, 240);

      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 320, 480);
      expect(ctx.fillText).toHaveBeenCalledWith('Пауза', 160, 240);
    });

    it('draws countdown labels by step', () => {
      const ctx = createMockContext(40);

      drawCountdown(ctx, 160, 200, 0);
      drawCountdown(ctx, 160, 200, 3);

      expect(ctx.fillText).toHaveBeenCalledWith('3', 160, 200);
      expect(ctx.fillText).toHaveBeenCalledWith('Поехали!', 160, 200);
    });

    it('draws default and selected buttons', () => {
      const ctx = createMockContext(60);

      drawButton(ctx, 'Играть', rect, false);
      drawButton(ctx, 'Играть', rect, true);

      expect(ctx.roundRect).toHaveBeenCalledTimes(2);
      expect(ctx.fillText).toHaveBeenCalledTimes(2);
    });

    it('draws game over image with aspect ratio', () => {
      const ctx = createMockContext(0);
      const img = {
        naturalWidth: 200,
        naturalHeight: 100,
      } as HTMLImageElement;

      drawGameOverImage(ctx, img, 160, 120, 80);

      expect(ctx.drawImage).toHaveBeenCalledWith(
        img,
        80,
        80,
        160,
        80,
      );
    });

    it('draws records tab with compact font for narrow tabs', () => {
      const ctx = createMockContext(40);

      drawRecordsTab(ctx, 'Лёгкий', { x: 0, y: 0, width: 80, height: 36 }, true);

      expect(ctx.fillText).toHaveBeenCalledWith(
        'Лёгкий',
        40,
        18,
      );
    });

    it('draws empty records table placeholder', () => {
      const ctx = createMockContext(60);

      drawRecordsTable(ctx, [], 160, 100, 320);

      expect(ctx.fillText).toHaveBeenCalledWith(
        'Пока нет рекордов',
        160,
        148,
      );
    });

    it('draws loading placeholder in records table', () => {
      const ctx = createMockContext(60);

      drawRecordsTable(ctx, [], 160, 100, 320, true);

      expect(ctx.fillText).toHaveBeenCalledWith(
        'Загрузка...',
        160,
        148,
      );
    });

    it('draws records rows and truncates long names', () => {
      const ctx = createMockContext(200);

      drawRecordsTable(
        ctx,
        [
          { name: 'ОченьДлинноеИмяИгрокаКотороеНеПомещается', level: 'easy', score: 99 },
          { name: 'Петя', level: 'easy', score: 12 },
        ],
        160,
        100,
        220,
      );

      expect(ctx.fillText).toHaveBeenCalledWith('12', 248, 180);
    });

    it('draws title with logo above text', () => {
      const ctx = createMockContext(30);
      const logo = {
        naturalWidth: 40,
        naturalHeight: 20,
      } as HTMLImageElement;

      drawTitleWithLogo(ctx, 'Flappy Petya', logo, 160, 80, 320);

      expect(ctx.drawImage).toHaveBeenCalled();
      expect(ctx.fillText).toHaveBeenCalledWith('Flappy Petya', 160, 80);
    });

    it('draws player name button with icon slot', () => {
      const ctx = createMockContext(50);

      drawPlayerNameButton(ctx, 'Петя', rect);

      expect(ctx.roundRect).toHaveBeenCalled();
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.fillText).toHaveBeenCalledWith('Петя', 85, 44);
    });
  });
});
