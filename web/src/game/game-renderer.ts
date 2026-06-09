import { drawGround, drawSky } from '../graphics/environment';
import {
  getCountdownY,
  getRecordsLayout,
  getScoreBadgeY,
  getScoreLayout,
  getSettingsLayout,
  getSplashLayout,
} from '../graphics/ui-layout';
import {
  drawButton,
  drawCountdown,
  drawGameOverImage,
  drawPauseButton,
  drawPauseOverlay,
  drawPlayerNameButton,
  drawRecordsTab,
  drawRecordsTable,
  drawScoreBadge,
  drawScorePanel,
  drawSettingsPanel,
  drawSettingsToggleRow,
  drawSubtitle,
  drawTitle,
  drawTitleWithLogo,
} from '../graphics/ui-text';
import {
  getTopRecordsByLevel,
  isFirebaseSyncPending,
  isLeaderboardLoading,
} from '../lib/storage';
import { getScreenShakeOffset } from '../lib/screen-shake';
import { COUNTDOWN_STEP_DURATION } from './config';
import { DIFFICULTIES } from './difficulty';
import type { GameHost } from './game-host';
import { getMedal } from './medals';
import { GAME_STATES } from './states';

const RETRY_BUTTON_LABEL = 'Ещё раз';
const RECORDS_BUTTON_LABEL = 'Рекорды';
const SETTINGS_BUTTON_LABEL = 'Настройки';
const BACK_BUTTON_LABEL = 'Назад';

export function renderGame(host: GameHost): void {
  const { ctx, viewport, sprites } = host;
  const { logicalWidth, logicalHeight } = viewport;
  const centerX = logicalWidth / 2;

  ctx.save();

  if (host.shakeTimer > 0) {
    const { x: shakeX, y: shakeY } = getScreenShakeOffset(
      host.shakeTimer,
      host.shakeIntensity,
    );
    ctx.translate(shakeX, shakeY);
  }

  const splashLayout = getSplashLayout(logicalHeight);
  const scoreLayout = getScoreLayout(logicalHeight);
  const recordsLayout = getRecordsLayout(logicalHeight);
  const settingsLayout = getSettingsLayout(logicalHeight);

  drawSky(ctx, logicalWidth, logicalHeight);
  host.pipes.draw(ctx);

  if (
    host.currentState !== GAME_STATES.Splash
    && host.currentState !== GAME_STATES.Records
    && host.currentState !== GAME_STATES.Settings
  ) {
    host.goose.draw(ctx, sprites);
  }

  drawGround(ctx, logicalWidth, logicalHeight, host.fgpos);

  if (host.currentState === GAME_STATES.Splash) {
    drawTitleWithLogo(
      ctx,
      'Flappy Petya',
      host.logoImg,
      centerX,
      splashLayout.titleY,
      logicalWidth,
    );
    drawSubtitle(
      ctx,
      'Выбери уровень',
      centerX,
      splashLayout.subtitleY,
    );

    DIFFICULTIES.forEach((difficulty, index) => {
      drawRecordsTab(
        ctx,
        difficulty.label,
        host.difficultyTabBtns[index],
        difficulty.id === host.selectedDifficulty,
      );
    });

    drawButton(ctx, host.getPlayButtonLabel(), host.playBtn, true);
    drawRecordsTab(ctx, RECORDS_BUTTON_LABEL, host.recordsBtn, false);
    drawRecordsTab(ctx, SETTINGS_BUTTON_LABEL, host.settingsBtn, false);

    if (host.playerName) {
      drawPlayerNameButton(ctx, host.playerName, host.playerNameBtn);
    }
  }

  if (host.currentState === GAME_STATES.Countdown) {
    drawCountdown(
      ctx,
      centerX,
      getCountdownY(logicalHeight),
      host.countdownStep,
      host.countdownTimer / COUNTDOWN_STEP_DURATION,
    );
  }

  if (host.currentState === GAME_STATES.Settings) {
    drawTitle(ctx, 'Настройки', centerX, settingsLayout.titleY);
    drawSettingsPanel(
      ctx,
      centerX,
      settingsLayout.panelStartY,
      logicalWidth,
      2,
    );
    drawSettingsToggleRow(
      ctx,
      'Звук',
      host.soundToggleBtn,
      !host.sound.isMuted(),
    );
    drawSettingsToggleRow(
      ctx,
      'Вибрация',
      host.hapticToggleBtn,
      host.haptic.isEnabled(),
      !host.haptic.isSupported(),
    );
    drawButton(ctx, BACK_BUTTON_LABEL, host.backBtn);
  }

  if (host.currentState === GAME_STATES.Records) {
    drawTitle(ctx, 'Рекорды', centerX, recordsLayout.titleY);

    DIFFICULTIES.forEach((difficulty, index) => {
      drawRecordsTab(
        ctx,
        difficulty.label,
        host.recordsTabBtns[index],
        difficulty.id === host.recordsLevelTab,
      );
    });

    const records = getTopRecordsByLevel(host.recordsLevelTab);
    const isLoading = isLeaderboardLoading() && records.length === 0;
    const isSyncing = (
      isFirebaseSyncPending() || isLeaderboardLoading()
    ) && records.length > 0;

    drawRecordsTable(
      ctx,
      records,
      centerX,
      recordsLayout.tableStartY,
      logicalWidth,
      isLoading,
      host.playerName,
      isSyncing,
    );
    drawButton(ctx, BACK_BUTTON_LABEL, host.backBtn);
  }

  if (host.currentState === GAME_STATES.Score && host.deathAnimTimer <= 0) {
    drawSubtitle(
      ctx,
      host.isNewBest ? 'Новый рекорд!' : 'Игра окончена',
      centerX,
      scoreLayout.subtitleY,
    );
    drawGameOverImage(
      ctx,
      host.gameOverImg,
      centerX,
      scoreLayout.imageY,
      scoreLayout.imageHeight,
    );
    drawScorePanel(
      ctx,
      host.score,
      host.personalBest,
      centerX,
      scoreLayout.panelY,
      { medal: getMedal(host.score) },
    );
    drawButton(ctx, RETRY_BUTTON_LABEL, host.okBtn);
  } else if (host.currentState === GAME_STATES.Game) {
    const badgeY = getScoreBadgeY(logicalHeight);
    drawScoreBadge(ctx, host.score, centerX, badgeY);
    drawPauseButton(ctx, host.pauseBtn);
  } else if (host.currentState === GAME_STATES.Paused) {
    drawScoreBadge(ctx, host.score, centerX, getScoreBadgeY(logicalHeight));
    drawPauseButton(ctx, host.pauseBtn);
    drawPauseOverlay(ctx, logicalWidth, logicalHeight, centerX, logicalHeight * 0.5);
  }

  ctx.restore();
}
