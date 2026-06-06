import { MEDAL_LABELS, MEDAL_TYPES, type MedalType } from '../game/medals';
import { THEME } from './theme';
import { TOP_RECORDS_PER_LEVEL, type GameRecord } from '../lib/records';

interface TextStyle {
  font: string;
  fill: string;
  strokeWidth: number;
}

export interface ButtonRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const BUTTON_PADDING_X = 24;
const BUTTON_PADDING_Y = 12;
const BUTTON_FONT = 'bold 18px system-ui, sans-serif';
const USER_ICON_SIZE = 20;
const USER_ICON_TEXT_GAP = 10;

function drawOutlinedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  style: TextStyle,
  align: CanvasTextAlign = 'center',
): void {
  ctx.save();
  ctx.font = style.font;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = style.strokeWidth;
  ctx.strokeStyle = THEME.outline;
  ctx.fillStyle = style.fill;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  ctx.restore();
}

const TITLE_FONT = 'bold 28px "Arial Rounded MT Bold", system-ui, sans-serif';
const TITLE_TEXT_HEIGHT = 28;
const TITLE_LOGO_GAP = 6;
const TITLE_LOGO_MAX_HEIGHT = 24;
const TITLE_SIDE_PADDING = 16;
const LOGO_BRAND_TEXT = 'ППР';
const LOGO_ICON_SOURCE_WIDTH = 20;
const LOGO_TEXT_GAP = 4;

export function drawTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
): void {
  drawOutlinedText(ctx, text, centerX, y, {
    font: TITLE_FONT,
    fill: THEME.accent,
    strokeWidth: 5,
  });
}

function getLogoBrandFont(logoHeight: number): string {
  const fontSize = Math.max(10, Math.round(logoHeight * 0.75));
  return `bold ${fontSize}px "Arial Rounded MT Bold", system-ui, sans-serif`;
}

function measureLogoBrand(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement,
  logoHeight: number,
): { width: number; iconWidth: number; textWidth: number } {
  const iconWidth = logoHeight * (LOGO_ICON_SOURCE_WIDTH / logo.naturalHeight);
  const logoFont = getLogoBrandFont(logoHeight);

  ctx.save();
  ctx.font = logoFont;
  const textWidth = ctx.measureText(LOGO_BRAND_TEXT).width;
  ctx.restore();

  return {
    width: iconWidth + LOGO_TEXT_GAP + textWidth,
    iconWidth,
    textWidth,
  };
}

function drawLogoBrand(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement,
  centerX: number,
  centerY: number,
  logoHeight: number,
): void {
  const { width, iconWidth, textWidth } = measureLogoBrand(ctx, logo, logoHeight);
  const groupLeft = centerX - width / 2;
  const logoY = centerY - logoHeight / 2;
  const logoFont = getLogoBrandFont(logoHeight);

  ctx.drawImage(
    logo,
    0,
    0,
    LOGO_ICON_SOURCE_WIDTH,
    logo.naturalHeight,
    groupLeft,
    logoY,
    iconWidth,
    logoHeight,
  );

  drawOutlinedText(
    ctx,
    LOGO_BRAND_TEXT,
    groupLeft + iconWidth + LOGO_TEXT_GAP + textWidth / 2,
    centerY,
    {
      font: logoFont,
      fill: THEME.text,
      strokeWidth: 4,
    },
  );
}

export function drawTitleWithLogo(
  ctx: CanvasRenderingContext2D,
  text: string,
  logo: HTMLImageElement,
  centerX: number,
  y: number,
  maxWidth: number,
): void {
  const maxLogoWidth = maxWidth - TITLE_SIDE_PADDING * 2;
  let logoHeight = TITLE_LOGO_MAX_HEIGHT;
  const brandWidth = measureLogoBrand(ctx, logo, logoHeight).width;

  if (brandWidth > maxLogoWidth) {
    logoHeight = Math.max(
      12,
      Math.round(logoHeight * (maxLogoWidth / brandWidth)),
    );
  }

  const logoCenterY =
    y - TITLE_TEXT_HEIGHT / 2 - TITLE_LOGO_GAP - logoHeight / 2;

  drawLogoBrand(ctx, logo, centerX, logoCenterY, logoHeight);

  drawOutlinedText(ctx, text, centerX, y, {
    font: TITLE_FONT,
    fill: THEME.accent,
    strokeWidth: 5,
  });
}

export function drawSubtitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
): void {
  drawOutlinedText(ctx, text, centerX, y, {
    font: 'bold 22px "Arial Rounded MT Bold", system-ui, sans-serif',
    fill: THEME.text,
    strokeWidth: 4,
  });
}

export function drawHint(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
): void {
  drawOutlinedText(ctx, text, centerX, y, {
    font: '16px system-ui, sans-serif',
    fill: THEME.text,
    strokeWidth: 3,
  });
}

export function drawScoreBadge(
  ctx: CanvasRenderingContext2D,
  score: number,
  centerX: number,
  y: number,
): void {
  const text = score.toString();
  ctx.save();
  ctx.font = 'bold 32px system-ui, sans-serif';
  const textWidth = ctx.measureText(text).width;
  const padX = 14;
  const boxW = textWidth + padX * 2;
  const boxH = 40;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.beginPath();
  ctx.roundRect(centerX - boxW / 2, y - boxH / 2, boxW, boxH, 8);
  ctx.fill();

  drawOutlinedText(ctx, text, centerX, y, {
    font: 'bold 32px system-ui, sans-serif',
    fill: THEME.text,
    strokeWidth: 4,
  });
  ctx.restore();
}

export function drawGameOverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  centerX: number,
  centerY: number,
  displayHeight: number,
): void {
  const aspect = img.naturalWidth / img.naturalHeight;
  const displayWidth = displayHeight * aspect;

  ctx.drawImage(
    img,
    centerX - displayWidth / 2,
    centerY - displayHeight / 2,
    displayWidth,
    displayHeight,
  );
}

export interface ScorePanelOptions {
  medal?: MedalType;
}

export function drawScorePanel(
  ctx: CanvasRenderingContext2D,
  score: number,
  best: number,
  centerX: number,
  y: number,
  options: ScorePanelOptions = {},
): { width: number; height: number } {
  const medal = options.medal ?? MEDAL_TYPES.None;
  const hasMedal = medal !== MEDAL_TYPES.None;
  const panelW = 200;
  const panelH = hasMedal ? 118 : 90;
  const panelX = centerX - panelW / 2;
  const panelY = y - panelH / 2;

  ctx.fillStyle = THEME.panel;
  ctx.strokeStyle = THEME.panelBorder;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelW, panelH, 10);
  ctx.fill();
  ctx.stroke();

  const labelFont = '14px system-ui, sans-serif';
  const valueFont = 'bold 22px system-ui, sans-serif';
  const row1Y = panelY + 30;
  const row2Y = panelY + 62;
  const row3Y = panelY + 94;

  ctx.save();
  ctx.font = labelFont;
  ctx.fillStyle = THEME.outline;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Счёт', panelX + 20, row1Y);
  ctx.fillText('Рекорд', panelX + 20, row2Y);

  if (hasMedal) {
    ctx.fillText('Медаль', panelX + 20, row3Y);
  }

  ctx.font = valueFont;
  ctx.textAlign = 'right';
  ctx.fillText(score.toString(), panelX + panelW - 20, row1Y);
  ctx.fillText(best.toString(), panelX + panelW - 20, row2Y);

  if (hasMedal) {
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(MEDAL_LABELS[medal], panelX + panelW - 20, row3Y);
  }

  ctx.restore();

  return { width: panelW, height: panelH };
}

const PAUSE_BUTTON_SIZE = 40;

export function measurePauseButton(): ButtonRect {
  return {
    x: 0,
    y: 0,
    width: PAUSE_BUTTON_SIZE,
    height: PAUSE_BUTTON_SIZE,
  };
}

const SETTINGS_ROW_FONT = 'bold 16px system-ui, sans-serif';
const SETTINGS_SWITCH_WIDTH = 48;
const SETTINGS_SWITCH_HEIGHT = 26;
const SETTINGS_SWITCH_KNOB = 20;

export function drawSettingsPanel(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  startY: number,
  viewportWidth: number,
  rowCount: number,
): void {
  const panelW = getRecordsPanelWidth(viewportWidth);
  const panelX = centerX - panelW / 2;
  const panelH = rowCount * 44;

  ctx.fillStyle = THEME.panel;
  ctx.strokeStyle = THEME.panelBorder;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(panelX, startY, panelW, panelH, 10);
  ctx.fill();
  ctx.stroke();
}

export function drawSettingsToggleRow(
  ctx: CanvasRenderingContext2D,
  label: string,
  rect: ButtonRect,
  isOn: boolean,
  isDisabled = false,
): void {
  const centerY = rect.y + rect.height / 2;
  const switchX = rect.x + rect.width - SETTINGS_SWITCH_WIDTH;
  const switchY = centerY - SETTINGS_SWITCH_HEIGHT / 2;
  const labelColor = isDisabled ? THEME.panelBorder : THEME.outline;

  ctx.save();
  ctx.font = SETTINGS_ROW_FONT;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = labelColor;
  ctx.fillText(label, rect.x, centerY);
  ctx.restore();

  if (isDisabled) {
    ctx.fillStyle = THEME.panelBorder;
  } else if (isOn) {
    ctx.fillStyle = THEME.accent;
  } else {
    ctx.fillStyle = THEME.panel;
  }
  ctx.strokeStyle = isDisabled ? THEME.panelBorder : THEME.outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(switchX, switchY, SETTINGS_SWITCH_WIDTH, SETTINGS_SWITCH_HEIGHT, 13);
  ctx.fill();
  ctx.stroke();

  const knobX = isOn
    ? switchX + SETTINGS_SWITCH_WIDTH - SETTINGS_SWITCH_KNOB - 3
    : switchX + 3;
  const knobY = switchY + (SETTINGS_SWITCH_HEIGHT - SETTINGS_SWITCH_KNOB) / 2;

  ctx.fillStyle = isDisabled ? THEME.panel : THEME.text;
  ctx.beginPath();
  ctx.arc(
    knobX + SETTINGS_SWITCH_KNOB / 2,
    knobY + SETTINGS_SWITCH_KNOB / 2,
    SETTINGS_SWITCH_KNOB / 2,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

export function drawPauseButton(
  ctx: CanvasRenderingContext2D,
  rect: ButtonRect,
): void {
  ctx.fillStyle = THEME.panel;
  ctx.strokeStyle = THEME.panelBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 8);
  ctx.fill();
  ctx.stroke();

  const barWidth = 6;
  const barHeight = 18;
  const gap = 6;
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;

  ctx.save();
  ctx.fillStyle = THEME.outline;
  ctx.fillRect(
    centerX - gap / 2 - barWidth,
    centerY - barHeight / 2,
    barWidth,
    barHeight,
  );
  ctx.fillRect(centerX + gap / 2, centerY - barHeight / 2, barWidth, barHeight);
  ctx.restore();
}

export function drawPauseOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
): void {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  drawSubtitle(ctx, 'Пауза', centerX, centerY);
}

const COUNTDOWN_LABELS = ['3', '2', '1', 'Поехали!'] as const;

export function drawCountdown(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  step: number,
): void {
  const label = COUNTDOWN_LABELS[Math.min(step, COUNTDOWN_LABELS.length - 1)] ?? '3';

  drawOutlinedText(ctx, label, centerX, y, {
    font: 'bold 56px system-ui, sans-serif',
    fill: THEME.accent,
    strokeWidth: 4,
  });
}

export function measureButton(
  ctx: CanvasRenderingContext2D,
  label: string,
): ButtonRect {
  ctx.save();
  ctx.font = BUTTON_FONT;
  const textWidth = ctx.measureText(label).width;
  ctx.restore();

  return {
    x: 0,
    y: 0,
    width: textWidth + BUTTON_PADDING_X * 2,
    height: 36 + BUTTON_PADDING_Y,
  };
}

export function drawButton(
  ctx: CanvasRenderingContext2D,
  label: string,
  rect: ButtonRect,
  isSelected = false,
): void {
  ctx.fillStyle = isSelected ? THEME.accent : THEME.panel;
  ctx.strokeStyle = isSelected ? THEME.outline : THEME.panelBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 8);
  ctx.fill();
  ctx.stroke();

  drawOutlinedText(
    ctx,
    label,
    rect.x + rect.width / 2,
    rect.y + rect.height / 2,
    {
      font: BUTTON_FONT,
      fill: isSelected ? THEME.text : THEME.outline,
      strokeWidth: 2,
    },
  );
}

function drawUserIcon(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  size: number,
): void {
  const headRadius = size * 0.22;
  const headCenterY = centerY - size * 0.2;
  const bodyWidth = size * 0.82;
  const bodyHeight = size * 0.4;
  const bodyTop = centerY + size * 0.02;
  const bodyLeft = centerX - bodyWidth / 2;

  ctx.save();
  ctx.fillStyle = THEME.accent;
  ctx.strokeStyle = THEME.outline;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.arc(centerX, headCenterY, headRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(bodyLeft, bodyTop, bodyWidth, bodyHeight, bodyHeight / 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function measurePlayerNameButton(
  ctx: CanvasRenderingContext2D,
  name: string,
): ButtonRect {
  const iconSlot = USER_ICON_SIZE + USER_ICON_TEXT_GAP;

  ctx.save();
  ctx.font = BUTTON_FONT;
  const textWidth = ctx.measureText(name).width;
  ctx.restore();

  return {
    x: 0,
    y: 0,
    width: BUTTON_PADDING_X * 2 + iconSlot + textWidth,
    height: 36 + BUTTON_PADDING_Y,
  };
}

export function drawPlayerNameButton(
  ctx: CanvasRenderingContext2D,
  name: string,
  rect: ButtonRect,
): void {
  ctx.fillStyle = THEME.panel;
  ctx.strokeStyle = THEME.panelBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 8);
  ctx.fill();
  ctx.stroke();

  const centerY = rect.y + rect.height / 2;
  const iconColor = THEME.outline;

  ctx.save();
  ctx.font = BUTTON_FONT;
  const textWidth = ctx.measureText(name).width;
  const contentWidth = USER_ICON_SIZE + USER_ICON_TEXT_GAP + textWidth;
  const startX = rect.x + (rect.width - contentWidth) / 2;

  drawUserIcon(ctx, startX + USER_ICON_SIZE / 2, centerY, USER_ICON_SIZE);

  drawOutlinedText(
    ctx,
    name,
    startX + USER_ICON_SIZE + USER_ICON_TEXT_GAP + textWidth / 2,
    centerY,
    {
      font: BUTTON_FONT,
      fill: iconColor,
      strokeWidth: 2,
    },
  );
  ctx.restore();
}

const RECORDS_ROW_HEIGHT = 32;
const RECORDS_PANEL_MAX_WIDTH = 320;
const RECORDS_PANEL_MIN_WIDTH = 200;
const RECORDS_PANEL_PADDING = 12;
const RECORDS_TAB_HEIGHT = 36;
const RECORDS_TAB_GAP = 6;

export function getRecordsPanelWidth(viewportWidth: number): number {
  return Math.max(
    RECORDS_PANEL_MIN_WIDTH,
    Math.min(RECORDS_PANEL_MAX_WIDTH, viewportWidth - RECORDS_PANEL_PADDING * 2),
  );
}

export function layoutRecordsTabs(
  centerX: number,
  y: number,
  viewportWidth: number,
  tabCount: number,
): ButtonRect[] {
  const panelW = getRecordsPanelWidth(viewportWidth);
  const panelX = centerX - panelW / 2;
  const tabWidth = (panelW - RECORDS_TAB_GAP * (tabCount - 1)) / tabCount;

  return Array.from({ length: tabCount }, (_, index) => ({
    x: panelX + index * (tabWidth + RECORDS_TAB_GAP),
    y,
    width: tabWidth,
    height: RECORDS_TAB_HEIGHT,
  }));
}

export function drawRecordsTab(
  ctx: CanvasRenderingContext2D,
  label: string,
  rect: ButtonRect,
  isSelected: boolean,
): void {
  const fontSize = rect.width < 88 ? 12 : 14;

  ctx.fillStyle = isSelected ? THEME.accent : THEME.panel;
  ctx.strokeStyle = isSelected ? THEME.outline : THEME.panelBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 8);
  ctx.fill();
  ctx.stroke();

  drawOutlinedText(
    ctx,
    label,
    rect.x + rect.width / 2,
    rect.y + rect.height / 2,
    {
      font: `bold ${fontSize}px system-ui, sans-serif`,
      fill: isSelected ? THEME.text : THEME.outline,
      strokeWidth: 2,
    },
  );
}

function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }

  let truncated = text;
  while (truncated.length > 1 && ctx.measureText(`${truncated}…`).width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }

  return `${truncated}…`;
}

export function drawRecordsTable(
  ctx: CanvasRenderingContext2D,
  records: GameRecord[],
  centerX: number,
  startY: number,
  viewportWidth: number,
  isLoading = false,
  highlightName = '',
): void {
  const panelW = getRecordsPanelWidth(viewportWidth);
  const panelX = centerX - panelW / 2;
  const headerHeight = 32;
  const fontSize = panelW < 260 ? 12 : 14;
  const headerFont = `bold ${fontSize}px system-ui, sans-serif`;
  const rowFont = `${fontSize}px system-ui, sans-serif`;
  const visibleRecords = records.slice(0, TOP_RECORDS_PER_LEVEL);
  const rowCount = Math.max(visibleRecords.length, 1);
  const panelH = headerHeight + rowCount * RECORDS_ROW_HEIGHT;

  ctx.fillStyle = THEME.panel;
  ctx.strokeStyle = THEME.panelBorder;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(panelX, startY, panelW, panelH, 10);
  ctx.fill();
  ctx.stroke();

  const innerPad = 12;
  const colNameX = panelX + innerPad;
  const colScoreX = panelX + panelW - innerPad;
  const nameMaxWidth = panelW * 0.68;
  const headerY = startY + headerHeight / 2;

  ctx.save();
  ctx.font = headerFont;
  ctx.fillStyle = THEME.outline;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('Игрок', colNameX, headerY);
  ctx.textAlign = 'right';
  ctx.fillText('Очки', colScoreX, headerY);

  ctx.strokeStyle = THEME.panelBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(panelX + innerPad, startY + headerHeight);
  ctx.lineTo(panelX + panelW - innerPad, startY + headerHeight);
  ctx.stroke();

  ctx.font = rowFont;

  if (visibleRecords.length === 0) {
    ctx.textAlign = 'center';
    ctx.fillText(
      isLoading ? 'Загрузка...' : 'Пока нет рекордов',
      centerX,
      startY + headerHeight + RECORDS_ROW_HEIGHT / 2,
    );
    ctx.restore();
    return;
  }

  const trimmedHighlight = highlightName.trim();

  visibleRecords.forEach((record, index) => {
    const rowTop = startY + headerHeight + index * RECORDS_ROW_HEIGHT;
    const rowY = rowTop + RECORDS_ROW_HEIGHT / 2;
    const isHighlighted = trimmedHighlight.length > 0 && record.name === trimmedHighlight;

    if (isHighlighted) {
      ctx.fillStyle = THEME.accent;
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.roundRect(
        panelX + innerPad / 2,
        rowTop + 2,
        panelW - innerPad,
        RECORDS_ROW_HEIGHT - 4,
        6,
      );
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = THEME.outline;
    ctx.font = isHighlighted ? `bold ${rowFont}` : rowFont;
    ctx.textAlign = 'left';
    ctx.fillText(truncateText(ctx, record.name, nameMaxWidth), colNameX, rowY);
    ctx.textAlign = 'right';
    ctx.fillText(record.score.toString(), colScoreX, rowY);
  });

  ctx.restore();
}
