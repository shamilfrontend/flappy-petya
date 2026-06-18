import { drawAtmosphere } from '../graphics/atmosphere';
import { drawBackground } from '../graphics/background';
import { drawCelestial } from '../graphics/celestial';
import { drawGround, drawSky } from '../graphics/environment';
import { getNightFactor, getPalette } from '../graphics/theme';
import { drawScreenTransition } from '../graphics/transition';
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
  drawNewBestSubtitle,
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
} from '../graphics/ui-text';
import {
  getRecordSyncStatus,
  getTopRecordsByLevel,
  isFirebaseSyncPending,
  isLeaderboardLoading,
  RECORD_SYNC_STATUS,
} from '../lib/storage';
import { getScreenShakeOffset } from '../lib/screen-shake';
import {
  COUNTDOWN_STEP_DURATION,
  SCORE_PULSE_DURATION,
  SCORE_UI_ANIM_DURATION,
  TRANSITION_DURATION,
} from './config';
import { DIFFICULTIES } from './difficulty';
import type { GameHost } from './game-host';
import { getMedal } from './medals';
import { GAME_STATES } from './states';

const SCORE_HOME_BUTTON_LABEL = 'На главную';
const SCORE_RETRY_BUTTON_LABEL = 'Сыграть ещё';
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

  const palette = getPalette(host.score);
  const nightFactor = getNightFactor(host.score);

  drawSky(ctx, logicalWidth, logicalHeight, palette);
  drawCelestial(ctx, logicalWidth, logicalHeight, host.frames, nightFactor, palette);
  drawBackground(ctx, logicalWidth, logicalHeight, host.frames, host.frames, palette);
  drawAtmosphere(ctx, logicalWidth, logicalHeight, host.frames, nightFactor);
  host.pipes.draw(ctx, palette);

  if (
    host.currentState !== GAME_STATES.Splash
    && host.currentState !== GAME_STATES.Records
    && host.currentState !== GAME_STATES.Settings
  ) {
    host.gooseTrail.draw(ctx);
    host.goose.draw(ctx, sprites);
  }

  host.particles.draw(ctx);

  drawGround(ctx, logicalWidth, logicalHeight, host.fgpos, palette);

  if (host.currentState === GAME_STATES.Splash) {
    drawTitle(ctx, 'Flappy Petya', centerX, splashLayout.titleY);
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

    drawButton(
      ctx,
      host.getPlayButtonLabel(),
      host.playBtn,
      true,
      0.5 + 0.5 * Math.sin(host.frames / 12),
    );
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
    const recordsEntrance = Math.max(
      0,
      Math.min(1, host.recordsUiTimer / SCORE_UI_ANIM_DURATION),
    );

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
    const syncStatus = getRecordSyncStatus(host.recordsLevelTab);
    const syncStatusMessage = syncStatus?.message ?? '';
    const isSyncStatusError = syncStatus?.state === RECORD_SYNC_STATUS.Rejected;
    const shouldShowSpinner = isSyncing || (
      syncStatus?.state === RECORD_SYNC_STATUS.Pending
    );

    drawRecordsTable(
      ctx,
      records,
      centerX,
      recordsLayout.tableStartY,
      logicalWidth,
      isLoading,
      host.playerName,
      shouldShowSpinner,
      syncStatusMessage,
      isSyncStatusError,
      recordsEntrance,
      host.frames,
    );
    drawButton(ctx, BACK_BUTTON_LABEL, host.backBtn, false, 0, recordsEntrance);
  }

  if (host.currentState === GAME_STATES.Score && host.deathAnimTimer <= 0) {
    drawGameOverImage(
      ctx,
      host.gameOverImg,
      centerX,
      scoreLayout.imageY,
      scoreLayout.imageHeight,
    );

    if (host.hasSavedCurrentScore) {
      const subtitleEntrance = Math.max(
        0,
        Math.min(1, host.scoreUiTimer / SCORE_UI_ANIM_DURATION),
      );

      if (host.isNewBest) {
        drawNewBestSubtitle(ctx, centerX, scoreLayout.subtitleY, host.scoreUiTimer);
      } else {
        ctx.save();
        ctx.globalAlpha = subtitleEntrance * subtitleEntrance;
        drawSubtitle(
          ctx,
          'Игра окончена',
          centerX,
          scoreLayout.subtitleY,
        );
        ctx.restore();
      }
      drawScorePanel(
        ctx,
        host.score,
        host.levelTopScore,
        centerX,
        scoreLayout.panelY,
        { medal: getMedal(host.score), uiTimer: host.scoreUiTimer },
      );
      const retryDelay = 6;
      const retryEntrance = Math.max(
        0,
        Math.min(1, (host.scoreUiTimer - retryDelay) / SCORE_UI_ANIM_DURATION),
      );
      drawButton(
        ctx,
        SCORE_HOME_BUTTON_LABEL,
        host.scoreHomeBtn,
        false,
        0,
        retryEntrance,
      );
      drawButton(
        ctx,
        SCORE_RETRY_BUTTON_LABEL,
        host.scoreRetryBtn,
        false,
        0,
        retryEntrance,
      );
    } else {
      drawSubtitle(
        ctx,
        host.isResolvingLevelTop ? 'Загрузка...' : 'Игра окончена',
        centerX,
        scoreLayout.subtitleY,
      );
    }
  } else if (host.currentState === GAME_STATES.Game) {
    const badgeY = getScoreBadgeY(logicalHeight);
    const pulse = host.scorePulseTimer / SCORE_PULSE_DURATION;
    drawScoreBadge(ctx, host.score, centerX, badgeY, pulse);
    drawPauseButton(ctx, host.pauseBtn);
  } else if (host.currentState === GAME_STATES.Paused) {
    drawScoreBadge(ctx, host.score, centerX, getScoreBadgeY(logicalHeight));
    drawPauseButton(ctx, host.pauseBtn);
    drawPauseOverlay(ctx, logicalWidth, logicalHeight, centerX, logicalHeight * 0.5);
  }

  if (host.transitionTimer > 0) {
    drawScreenTransition(
      ctx,
      logicalWidth,
      logicalHeight,
      host.transitionTimer / TRANSITION_DURATION,
      palette.skyTop,
    );
  }

  ctx.restore();
}
