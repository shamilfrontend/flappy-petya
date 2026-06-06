import {
  getCountdownY,
  getPauseButtonRect,
  getRecordsLayout,
  getScoreBadgeY,
  getScoreLayout,
  getSettingsLayout,
  getSettingsPanelHeight,
  getSplashLayout,
  layoutSettingsToggles,
  layoutSplashFooterButtons,
} from './ui-layout';
import { getRecordsPanelWidth } from './ui-text';

describe('ui layout', () => {
  const height = 480;

  it('computes splash layout from viewport height', () => {
    const layout = getSplashLayout(height);

    expect(layout.titleY).toBe(60);
    expect(layout.subtitleY).toBeCloseTo(99.84);
    expect(layout.difficultyTabsY).toBeCloseTo(149.76);
    expect(layout.playButtonY).toBeCloseTo(201.76);
    expect(layout.footerStartY).toBeCloseTo(316.8);
  });

  it('lays out splash footer buttons in a row', () => {
    const centerX = 160;
    const viewportWidth = 320;
    const panelWidth = getRecordsPanelWidth(viewportWidth);
    const panelX = centerX - panelWidth / 2;
    const tabWidth = (panelWidth - 6) / 2;
    const buttons = layoutSplashFooterButtons(centerX, 300, viewportWidth);

    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toEqual({
      x: panelX,
      y: 300,
      width: tabWidth,
      height: 36,
    });
    expect(buttons[1].x).toBeCloseTo(panelX + tabWidth + 6);
  });

  it('computes settings layout from viewport height', () => {
    const layout = getSettingsLayout(height);

    expect(layout.titleY).toBeCloseTo(38.4);
    expect(layout.panelStartY).toBeCloseTo(105.6);
    expect(layout.backButtonY).toBeCloseTo(422.4);
  });

  it('lays out settings toggle rows inside panel', () => {
    const centerX = 160;
    const viewportWidth = 320;
    const panelWidth = getRecordsPanelWidth(viewportWidth);
    const panelX = centerX - panelWidth / 2;
    const toggles = layoutSettingsToggles(centerX, 120, viewportWidth);

    expect(toggles).toHaveLength(2);
    expect(toggles[0]).toEqual({
      x: panelX + 12,
      y: 120,
      width: panelWidth - 24,
      height: 44,
    });
    expect(toggles[1].y).toBe(164);
  });

  it('computes settings panel height from row count', () => {
    expect(getSettingsPanelHeight(2)).toBe(88);
  });

  it('computes countdown y from viewport height', () => {
    expect(getCountdownY(height)).toBeCloseTo(201.6);
  });

  it('computes pause button rect near score badge', () => {
    const badgeY = getScoreBadgeY(height);

    expect(getPauseButtonRect(320, badgeY)).toEqual({
      x: 264,
      y: 16,
      width: 40,
      height: 40,
    });
  });

  it('computes score layout from viewport height', () => {
    const layout = getScoreLayout(height);

    expect(layout.subtitleY).toBe(60);
    expect(layout.imageY).toBeCloseTo(134.4);
    expect(layout.imageHeight).toBeCloseTo(100.8);
    expect(layout.panelY).toBeCloseTo(235.2);
    expect(layout.retryButtonY).toBeCloseTo(326.4);
  });

  it('computes records layout from viewport height', () => {
    const layout = getRecordsLayout(height);

    expect(layout.titleY).toBeCloseTo(38.4);
    expect(layout.tabsY).toBeCloseTo(67.2);
    expect(layout.tableStartY).toBeCloseTo(123.2);
    expect(layout.backButtonY).toBeCloseTo(422.4);
  });

  it('computes score badge y from viewport height', () => {
    expect(getScoreBadgeY(height)).toBe(36);
  });
});
