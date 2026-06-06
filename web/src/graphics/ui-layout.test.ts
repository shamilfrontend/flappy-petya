import {
  getRecordsLayout,
  getScoreBadgeY,
  getScoreLayout,
  getSplashLayout,
} from './ui-layout';

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
