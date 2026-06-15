import { MEDAL_COLORS, MEDAL_LABELS, MEDAL_TYPES, type MedalType } from '../game/medals';
import { SCORE_UI_ANIM_DURATION } from '../game/config';
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

function shade(color: string, amount: number): string {
  if (!color.startsWith('#')) {
    return color;
  }
  const hex = color.slice(1);
  const clamp = (v: number): number => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(parseInt(hex.slice(0, 2), 16) + amount);
  const g = clamp(parseInt(hex.slice(2, 4), 16) + amount);
  const b = clamp(parseInt(hex.slice(4, 6), 16) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

interface PanelStyle {
  topColor: string;
  bottomColor: string;
  border?: string;
  lineWidth?: number;
  shadow?: boolean;
}

/** Рисует скруглённую панель с мягкой тенью и вертикальным градиентом. */
function fillRoundedPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  style: PanelStyle,
): void {
  ctx.save();
  if (style.shadow !== false) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
  }

  const gradient = ctx.createLinearGradient(0, y, 0, y + h);
  gradient.addColorStop(0, style.topColor);
  gradient.addColorStop(1, style.bottomColor);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
  ctx.restore();

  if (style.border) {
    ctx.strokeStyle = style.border;
    ctx.lineWidth = style.lineWidth ?? 3;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.stroke();
  }
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

/** Анимированный заголовок «Новый рекорд!» с золотым свечением и искрами. */
export function drawNewBestSubtitle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  uiTimer: number,
): void {
  const entrance = Math.min(1, uiTimer / 15);
  const pulse = 1 + 0.07 * Math.sin(uiTimer / 6);
  const scale = (0.75 + 0.25 * entrance) * pulse;

  ctx.save();
  ctx.translate(centerX, y);
  ctx.scale(scale, scale);

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + uiTimer * 0.1;
    const dist = 52 + 8 * Math.sin(uiTimer / 5 + i);
    const alpha = (0.35 + 0.35 * Math.sin(uiTimer / 4 + i)) * entrance;
    ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawOutlinedText(ctx, 'Новый рекорд!', 0, 0, {
    font: 'bold 24px "Arial Rounded MT Bold", system-ui, sans-serif',
    fill: '#FFD700',
    strokeWidth: 5,
  });

  ctx.restore();
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
  pulse = 0,
): void {
  const text = score.toString();
  const scale = 1 + pulse * 0.18;
  const glowStrength = Math.max(0, Math.min(1, pulse));

  ctx.save();
  ctx.translate(centerX, y);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -y);
  ctx.font = 'bold 32px system-ui, sans-serif';
  const textWidth = ctx.measureText(text).width;
  const padX = 14;
  const boxW = textWidth + padX * 2;
  const boxH = 40;

  if (glowStrength > 0.01) {
    // Короткий золотистый акцент при +1, чтобы счёт читался выразительнее.
    ctx.shadowColor = `rgba(255, 224, 102, ${0.45 * glowStrength})`;
    ctx.shadowBlur = 8 + glowStrength * 10;
    ctx.shadowOffsetY = 0;
  }

  fillRoundedPanel(ctx, centerX - boxW / 2, y - boxH / 2, boxW, boxH, boxH / 2, {
    topColor: 'rgba(0, 0, 0, 0.28)',
    bottomColor: 'rgba(0, 0, 0, 0.12)',
    border: 'rgba(255, 255, 255, 0.35)',
    lineWidth: 1.5,
  });

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
  uiTimer?: number;
}

function drawMedalIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  medal: Exclude<MedalType, 'none'>,
  uiTimer: number,
): void {
  const entrance = Math.min(1, uiTimer / 18);
  const scale = 0.4 + 0.6 * entrance;
  const shimmer = 0.75 + 0.25 * Math.sin(uiTimer / 7);
  const color = MEDAL_COLORS[medal];
  const radius = 14;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.shadowColor = color;
  ctx.shadowBlur = 8 * shimmer;
  ctx.fillStyle = color;
  ctx.strokeStyle = THEME.outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = `rgba(255, 255, 255, ${0.35 * shimmer})`;
  ctx.beginPath();
  ctx.ellipse(-4, -5, 5, 3, -0.4, 0, Math.PI * 2);
  ctx.fill();

  if (medal === MEDAL_TYPES.Gold) {
    drawGoldMedalStarTrail(ctx, uiTimer, entrance);
  }

  ctx.restore();
}

/** Звёздный след вокруг золотой медали. */
function drawGoldMedalStarTrail(
  ctx: CanvasRenderingContext2D,
  uiTimer: number,
  entrance: number,
): void {
  const starCount = 8;

  for (let trail = 0; trail < 4; trail++) {
    const trailFade = 1 - trail * 0.22;

    for (let i = 0; i < starCount; i++) {
      const angle = (i / starCount) * Math.PI * 2 + (uiTimer - trail * 4) * 0.12;
      const dist = 20 + trail * 5 + 4 * Math.sin(uiTimer / 6 + i);
      const alpha = trailFade * (0.45 + 0.55 * Math.sin(uiTimer / 5 + i * 0.9)) * entrance;
      const size = 2.4 - trail * 0.35;

      ctx.fillStyle = `rgba(255, 230, 100, ${alpha})`;
      ctx.beginPath();
      ctx.arc(
        Math.cos(angle) * dist,
        Math.sin(angle) * dist,
        size,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
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
  const uiTimer = options.uiTimer ?? 0;
  const entrance = Math.max(0, Math.min(1, uiTimer / SCORE_UI_ANIM_DURATION));
  const easedEntrance = entrance * entrance;
  const scale = 0.92 + easedEntrance * 0.08;

  ctx.save();
  ctx.translate(centerX, y);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -y);
  ctx.globalAlpha = easedEntrance;

  fillRoundedPanel(ctx, panelX, panelY, panelW, panelH, 10, {
    topColor: '#FFFFFF',
    bottomColor: THEME.panel,
    border: THEME.panelBorder,
    lineWidth: 3,
  });

  const labelFont = '14px system-ui, sans-serif';
  const valueFont = 'bold 22px system-ui, sans-serif';
  const row1Y = panelY + 30;
  const row2Y = panelY + 62;
  const row3Y = panelY + 94;

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
    const medalX = panelX + panelW - 52;
    drawMedalIcon(ctx, medalX, row3Y, medal, uiTimer);
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

  fillRoundedPanel(ctx, panelX, startY, panelW, panelH, 10, {
    topColor: '#FFFFFF',
    bottomColor: THEME.panel,
    border: THEME.panelBorder,
    lineWidth: 3,
  });
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
  progress = 0,
): void {
  const label = COUNTDOWN_LABELS[Math.min(step, COUNTDOWN_LABELS.length - 1)] ?? '3';
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const scale = 1 + 0.2 * (1 - clampedProgress);

  ctx.save();
  ctx.translate(centerX, y);
  ctx.scale(scale, scale);
  drawOutlinedText(ctx, label, 0, 0, {
    font: 'bold 56px system-ui, sans-serif',
    fill: THEME.accent,
    strokeWidth: 4,
  });
  ctx.restore();
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
  pulse = 0,
  entrance = 1,
): void {
  const clampedEntrance = Math.max(0, Math.min(1, entrance));
  const easedEntrance = clampedEntrance * clampedEntrance;
  const entranceScale = 0.94 + easedEntrance * 0.06;

  ctx.save();
  const cx = rect.x + rect.width / 2;
  const cy = rect.y + rect.height / 2;
  ctx.translate(cx, cy);
  ctx.scale(entranceScale, entranceScale);
  ctx.translate(-cx, -cy);
  ctx.globalAlpha = easedEntrance;

  if (pulse > 0) {
    const scale = 1 + pulse * 0.06;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
  }

  fillRoundedPanel(ctx, rect.x, rect.y, rect.width, rect.height, 8, {
    topColor: isSelected ? shade(THEME.accent, 28) : '#FFFFFF',
    bottomColor: isSelected ? THEME.accent : THEME.panel,
    border: isSelected ? THEME.outline : THEME.panelBorder,
    lineWidth: 2,
  });

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
  ctx.restore();
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
  _ctx: CanvasRenderingContext2D,
  _name: string,
  viewportWidth: number,
): ButtonRect {
  return {
    x: 0,
    y: 0,
    width: getRecordsPanelWidth(viewportWidth),
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

  const iconSlot = USER_ICON_SIZE + USER_ICON_TEXT_GAP;
  const maxTextWidth = rect.width - BUTTON_PADDING_X * 2 - iconSlot;

  ctx.save();
  ctx.font = BUTTON_FONT;
  const displayName = truncateText(ctx, name, maxTextWidth);
  const textWidth = ctx.measureText(displayName).width;
  const contentWidth = iconSlot + textWidth;
  const startX = rect.x + (rect.width - contentWidth) / 2;

  drawUserIcon(ctx, startX + USER_ICON_SIZE / 2, centerY, USER_ICON_SIZE);

  drawOutlinedText(
    ctx,
    displayName,
    startX + iconSlot + textWidth / 2,
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
const RECORDS_RANK_SLOT = 20;
const TOP_RANK_STYLES = [
  {
    nameColor: '#8A6B00',
    scoreColor: '#6F5500',
    rowFill: 'rgba(255, 215, 0, 0.14)',
  },
  {
    nameColor: '#5C6472',
    scoreColor: '#494F5A',
    rowFill: 'rgba(192, 198, 210, 0.16)',
  },
  {
    nameColor: '#7A4E2D',
    scoreColor: '#633E24',
    rowFill: 'rgba(205, 127, 50, 0.14)',
  },
] as const;

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
  isSyncing = false,
  entrance = 1,
  frames = 0,
): void {
  const clampedEntrance = Math.max(0, Math.min(1, entrance));
  const easedEntrance = clampedEntrance * clampedEntrance;
  const panelW = getRecordsPanelWidth(viewportWidth);
  const panelX = centerX - panelW / 2;
  const headerHeight = 32;
  const fontSize = panelW < 260 ? 12 : 14;
  const headerFont = `bold ${fontSize}px system-ui, sans-serif`;
  const rowFont = `${fontSize}px system-ui, sans-serif`;
  const visibleRecords = records.slice(0, TOP_RECORDS_PER_LEVEL);
  const rowCount = Math.max(visibleRecords.length, 1);
  const panelH = headerHeight + rowCount * RECORDS_ROW_HEIGHT;
  const panelCenterX = panelX + panelW / 2;
  const panelCenterY = startY + panelH / 2;
  const entranceScale = 0.94 + easedEntrance * 0.06;

  ctx.save();
  ctx.translate(panelCenterX, panelCenterY);
  ctx.scale(entranceScale, entranceScale);
  ctx.translate(-panelCenterX, -panelCenterY);
  ctx.globalAlpha = easedEntrance;

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
  const nameTextX = colNameX + RECORDS_RANK_SLOT;
  const nameMaxWidth = panelW * 0.68 - RECORDS_RANK_SLOT;
  const headerY = startY + headerHeight / 2;

  ctx.save();
  ctx.font = headerFont;
  ctx.fillStyle = THEME.outline;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('Игрок', nameTextX, headerY);
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
    ctx.restore();
    return;
  }

  const trimmedHighlight = highlightName.trim();

  visibleRecords.forEach((record, index) => {
    const rowTop = startY + headerHeight + index * RECORDS_ROW_HEIGHT;
    const rowY = rowTop + RECORDS_ROW_HEIGHT / 2;
    const isHighlighted = trimmedHighlight.length > 0 && record.name === trimmedHighlight;
    const rankStyle = TOP_RANK_STYLES[index];

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
    } else if (rankStyle) {
      ctx.fillStyle = rankStyle.rowFill;
      ctx.beginPath();
      ctx.roundRect(
        panelX + innerPad / 2,
        rowTop + 2,
        panelW - innerPad,
        RECORDS_ROW_HEIGHT - 4,
        6,
      );
      ctx.fill();
    }

    const nameColor = isHighlighted
      ? THEME.outline
      : (rankStyle?.nameColor ?? THEME.outline);
    const scoreColor = isHighlighted
      ? THEME.outline
      : (rankStyle?.scoreColor ?? THEME.outline);
    const isTopRank = Boolean(rankStyle);

    if (rankStyle) {
      const rankCenterX = colNameX + RECORDS_RANK_SLOT / 2;
      const isGoldRank = index === 0;
      const pulse = isGoldRank ? 0.5 + 0.5 * Math.sin(frames / 12) : 0;
      const rankRadius = isGoldRank ? 7 + pulse * 0.8 : 7;

      if (isGoldRank) {
        ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
        ctx.shadowBlur = 4 + pulse * 2;
      }

      ctx.fillStyle = rankStyle.rowFill;
      ctx.strokeStyle = rankStyle.nameColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(rankCenterX, rowY, rankRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = rankStyle.nameColor;
      ctx.font = `bold ${Math.max(fontSize - 1, 11)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), rankCenterX, rowY);
    }

    ctx.fillStyle = nameColor;
    ctx.font = isHighlighted || isTopRank ? `bold ${rowFont}` : rowFont;
    ctx.textAlign = 'left';
    ctx.fillText(truncateText(ctx, record.name, nameMaxWidth), nameTextX, rowY);

    ctx.fillStyle = scoreColor;
    ctx.font = isTopRank ? `bold ${rowFont}` : rowFont;
    ctx.textAlign = 'right';
    ctx.fillText(record.score.toString(), colScoreX, rowY);
  });

  if (isSyncing) {
    ctx.textAlign = 'center';
    ctx.font = `${Math.max(fontSize - 2, 11)}px system-ui, sans-serif`;
    ctx.fillStyle = THEME.outline;
    ctx.globalAlpha = 0.7;
    ctx.fillText(
      'Обновление...',
      centerX,
      startY + panelH + 14,
    );
    ctx.globalAlpha = 1;
  }

  ctx.restore();
  ctx.restore();
}
