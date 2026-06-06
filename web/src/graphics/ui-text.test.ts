import {
  getRecordsPanelWidth,
  layoutRecordsTabs,
  measureButton,
  measurePlayerNameButton,
} from './ui-text';

function createMockContext(textWidth: number): CanvasRenderingContext2D {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    font: '',
    measureText: vi.fn(() => ({ width: textWidth })),
  } as unknown as CanvasRenderingContext2D;
}

describe('ui-text helpers', () => {
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
});
