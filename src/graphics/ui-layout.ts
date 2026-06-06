export const FOOTER_BUTTON_GAP = 12;

const SPLASH_TAB_HEIGHT = 36;
const SPLASH_PLAY_GAP = 16;

export interface SplashLayout {
  titleY: number;
  subtitleY: number;
  difficultyTabsY: number;
  playButtonY: number;
  footerStartY: number;
}

export interface ScoreLayout {
  subtitleY: number;
  imageY: number;
  imageHeight: number;
  panelY: number;
  retryButtonY: number;
}

export interface RecordsLayout {
  titleY: number;
  tabsY: number;
  tableStartY: number;
  backButtonY: number;
}

export function getSplashLayout(height: number): SplashLayout {
  const difficultyTabsY = height * 0.312;

  return {
    titleY: height * 0.125,
    subtitleY: height * 0.208,
    difficultyTabsY,
    playButtonY: difficultyTabsY + SPLASH_TAB_HEIGHT + SPLASH_PLAY_GAP,
    footerStartY: height * 0.66,
  };
}

const RECORDS_TAB_HEIGHT = 36;
const RECORDS_TABLE_GAP = 20;

export function getRecordsLayout(height: number): RecordsLayout {
  const tabsY = height * 0.14;

  return {
    titleY: height * 0.08,
    tabsY,
    tableStartY: tabsY + RECORDS_TAB_HEIGHT + RECORDS_TABLE_GAP,
    backButtonY: height * 0.88,
  };
}

export function getScoreLayout(height: number): ScoreLayout {
  return {
    subtitleY: height * 0.125,
    imageY: height * 0.28,
    imageHeight: height * 0.21,
    panelY: height * 0.49,
    retryButtonY: height * 0.68,
  };
}

export function getScoreBadgeY(height: number): number {
  return height * 0.075;
}
