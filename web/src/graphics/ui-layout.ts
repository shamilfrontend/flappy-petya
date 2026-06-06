import { getRecordsPanelWidth, type ButtonRect } from './ui-text';

export const FOOTER_BUTTON_GAP = 12;

const SPLASH_TAB_HEIGHT = 36;
const SPLASH_PLAY_GAP = 16;
const FOOTER_TAB_HEIGHT = 36;
const FOOTER_TAB_GAP = 6;
const SETTINGS_ROW_HEIGHT = 44;
const SETTINGS_TOGGLE_COUNT = 2;

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

export interface SettingsLayout {
  titleY: number;
  panelStartY: number;
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

export function layoutSplashFooterButtons(
  centerX: number,
  y: number,
  viewportWidth: number,
): ButtonRect[] {
  const panelW = getRecordsPanelWidth(viewportWidth);
  const panelX = centerX - panelW / 2;
  const tabWidth = (panelW - FOOTER_TAB_GAP) / 2;

  return [
    {
      x: panelX,
      y,
      width: tabWidth,
      height: FOOTER_TAB_HEIGHT,
    },
    {
      x: panelX + tabWidth + FOOTER_TAB_GAP,
      y,
      width: tabWidth,
      height: FOOTER_TAB_HEIGHT,
    },
  ];
}

export function getSettingsLayout(height: number): SettingsLayout {
  return {
    titleY: height * 0.08,
    panelStartY: height * 0.22,
    backButtonY: height * 0.88,
  };
}

export function layoutSettingsToggles(
  centerX: number,
  panelStartY: number,
  viewportWidth: number,
): ButtonRect[] {
  const panelW = getRecordsPanelWidth(viewportWidth);
  const panelX = centerX - panelW / 2;
  const innerPad = 12;

  return Array.from({ length: SETTINGS_TOGGLE_COUNT }, (_, index) => ({
    x: panelX + innerPad,
    y: panelStartY + index * SETTINGS_ROW_HEIGHT,
    width: panelW - innerPad * 2,
    height: SETTINGS_ROW_HEIGHT,
  }));
}

export function getSettingsPanelHeight(rowCount: number): number {
  return rowCount * SETTINGS_ROW_HEIGHT;
}

export function getCountdownY(height: number): number {
  return height * 0.42;
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

const PAUSE_BUTTON_SIZE = 40;
const PAUSE_BUTTON_MARGIN = 16;

export function getPauseButtonRect(width: number, badgeY: number): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  return {
    x: width - PAUSE_BUTTON_SIZE - PAUSE_BUTTON_MARGIN,
    y: badgeY - PAUSE_BUTTON_SIZE / 2,
    width: PAUSE_BUTTON_SIZE,
    height: PAUSE_BUTTON_SIZE,
  };
}
