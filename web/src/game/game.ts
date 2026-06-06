import { getSoundManager, SOUND_EVENTS } from '../audio/sound';
import { getHapticManager, HAPTIC_EVENTS } from '../input/haptic';
import { Goose } from '../entities/goose';
import { Pipes } from '../entities/pipes';
import { drawGround, drawSky } from '../graphics/environment';
import {
  FOOTER_BUTTON_GAP,
  getCountdownY,
  getPauseButtonRect,
  getScoreBadgeY,
  getRecordsLayout,
  getScoreLayout,
  getSettingsLayout,
  getSplashLayout,
  layoutSettingsToggles,
  layoutSplashFooterButtons,
} from '../graphics/ui-layout';
import { initSprites, type Sprites } from '../graphics/sprites';
import {
  drawButton,
  drawCountdown,
  drawPauseButton,
  drawPauseOverlay,
  drawGameOverImage,
  drawRecordsTab,
  drawRecordsTable,
  drawScoreBadge,
  drawScorePanel,
  drawSettingsPanel,
  drawSettingsToggleRow,
  drawSubtitle,
  drawTitle,
  drawTitleWithLogo,
  layoutRecordsTabs,
  drawPlayerNameButton,
  measureButton,
  measurePlayerNameButton,
  type ButtonRect,
} from '../graphics/ui-text';
import { loadImage } from '../lib/load-image';
import { bindGameKeyboard } from '../input/keyboard';
import { getCanvasPoint, isPointInRect, type PressEvent } from '../input/pointer';
import {
  getPersonalBest,
  getSavedPlayerName,
  getSelectedDifficulty,
  getTopRecordsByLevel,
  initStorage,
  isLeaderboardLoading,
  refreshLeaderboard,
  savePlayerName,
  saveRecord,
  saveSelectedDifficulty,
} from '../lib/storage';
import { hideAppLoader } from '../ui/app-loader';
import { NameInputOverlay } from '../ui/name-input';
import {
  applyCanvasSize,
  getViewportState,
  type ViewportState,
} from '../lib/viewport';
import {
  FG_TILE_WIDTH,
  GROUND_HEIGHT,
  MAX_FRAME_DELTA,
  MS_PER_FRAME,
} from './config';
import {
  DIFFICULTIES,
  DIFFICULTY_LEVELS,
  getDifficultyById,
  type DifficultyLevel,
} from './difficulty';
import { getMedal } from './medals';
import { GAME_STATES, type GameState } from './states';

export const RESIZE_DEBOUNCE_MS = 100;
const COUNTDOWN_STEP_DURATION = 45;
const COUNTDOWN_STEPS = 4;

const GOOSE_URL = `${import.meta.env.BASE_URL}static/goose.png`;
const SPLASH_URL = `${import.meta.env.BASE_URL}static/petya-splash.png`;
const GAME_OVER_URL = `${import.meta.env.BASE_URL}static/game-over-goose.png`;
const LOGO_URL = `${import.meta.env.BASE_URL}static/logo.png`;
const RETRY_BUTTON_LABEL = 'Ещё раз';
const PLAY_BUTTON_LABEL = 'Играть';
const RECORDS_BUTTON_LABEL = 'Рекорды';
const SETTINGS_BUTTON_LABEL = 'Настройки';
const BACK_BUTTON_LABEL = 'Назад';

export class Game {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private viewport!: ViewportState;
  private sprites!: Sprites;
  private gameOverImg!: HTMLImageElement;
  private logoImg!: HTMLImageElement;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;
  private resizeObserver: ResizeObserver | null = null;

  private readonly goose = new Goose();
  private readonly pipes = new Pipes();
  private readonly nameInput = new NameInputOverlay();
  private readonly sound = getSoundManager();
  private readonly haptic = getHapticManager();

  private currentState: GameState = GAME_STATES.Splash;
  private fgpos = 0;
  private frames = 0;
  private score = 0;
  private playerName = getSavedPlayerName();
  private personalBest = 0;
  private isAwaitingName = false;
  private okBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  private recordsBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  private playerNameBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  private backBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  private recordsTabBtns: ButtonRect[] = [];
  private recordsLevelTab: DifficultyLevel = DIFFICULTY_LEVELS.Medium;
  private difficultyTabBtns: ButtonRect[] = [];
  private playBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  private settingsBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  private soundToggleBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  private hapticToggleBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  private pauseBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  private selectedDifficulty: DifficultyLevel = DIFFICULTY_LEVELS.Medium;
  private countdownStep = -1;
  private countdownTimer = 0;
  private isNewBest = false;
  private fgScrollSpeed = getDifficultyById(DIFFICULTY_LEVELS.Medium).fgScrollSpeed;
  private hasSavedCurrentScore = false;
  private lastScoredLevel: DifficultyLevel | undefined;
  private lastFrameTime = 0;
  start(): void {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('role', 'application');
    this.canvas.setAttribute(
      'aria-label',
      'Flappy Petya — нажмите Space для прыжка',
    );
    this.canvas.tabIndex = 0;
    this.viewport = getViewportState();

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      alert("Your browser doesn't support HTML5, please update to latest version");
      return;
    }
    this.ctx = ctx;

    applyCanvasSize(this.canvas, this.ctx, this.viewport);
    document.body.appendChild(this.canvas);
    this.bindInput();
    this.bindResizeTracking();

    Promise.all([
      loadImage(GOOSE_URL),
      loadImage(SPLASH_URL),
      loadImage(GAME_OVER_URL),
      loadImage(LOGO_URL),
      initStorage(),
    ])
      .then(([gooseImg, splashImg, gameOverImg, logoImg]) => {
        this.sprites = initSprites(gooseImg, splashImg);
        this.gameOverImg = gameOverImg;
        this.logoImg = logoImg;
        this.syncStateFromStorage();
        this.layoutUi();
        hideAppLoader();
        this.run();
      })
      .catch((err) => {
        console.error(err);
        hideAppLoader();
        alert('Не удалось загрузить игровые ресурсы');
      });
  }

  private layoutUi(): void {
    const { logicalWidth, logicalHeight } = this.viewport;
    const scoreLayout = getScoreLayout(logicalHeight);
    const splashLayout = getSplashLayout(logicalHeight);
    const recordsLayout = getRecordsLayout(logicalHeight);

    const retryBtnSize = measureButton(this.ctx, RETRY_BUTTON_LABEL);
    this.okBtn = {
      x: (logicalWidth - retryBtnSize.width) / 2,
      y: scoreLayout.retryButtonY,
      width: retryBtnSize.width,
      height: retryBtnSize.height,
    };

    const [recordsBtn, settingsBtn] = layoutSplashFooterButtons(
      logicalWidth / 2,
      splashLayout.footerStartY,
      logicalWidth,
    );
    this.recordsBtn = recordsBtn;
    this.settingsBtn = settingsBtn;

    if (this.playerName) {
      const playerNameBtnSize = measurePlayerNameButton(this.ctx, this.playerName);
      this.playerNameBtn = {
        x: (logicalWidth - playerNameBtnSize.width) / 2,
        y: this.recordsBtn.y + this.recordsBtn.height + FOOTER_BUTTON_GAP,
        width: playerNameBtnSize.width,
        height: playerNameBtnSize.height,
      };
    }

    const settingsLayout = getSettingsLayout(logicalHeight);
    const backBtnSize = measureButton(this.ctx, BACK_BUTTON_LABEL);
    this.backBtn = {
      x: (logicalWidth - backBtnSize.width) / 2,
      y: recordsLayout.backButtonY,
      width: backBtnSize.width,
      height: backBtnSize.height,
    };

    const [soundToggleBtn, hapticToggleBtn] = layoutSettingsToggles(
      logicalWidth / 2,
      settingsLayout.panelStartY,
      logicalWidth,
    );
    this.soundToggleBtn = soundToggleBtn;
    this.hapticToggleBtn = hapticToggleBtn;

    this.recordsTabBtns = layoutRecordsTabs(
      logicalWidth / 2,
      recordsLayout.tabsY,
      logicalWidth,
      DIFFICULTIES.length,
    );

    this.difficultyTabBtns = layoutRecordsTabs(
      logicalWidth / 2,
      splashLayout.difficultyTabsY,
      logicalWidth,
      DIFFICULTIES.length,
    );

    const playBtnSize = measureButton(this.ctx, PLAY_BUTTON_LABEL);
    this.playBtn = {
      x: (logicalWidth - playBtnSize.width) / 2,
      y: splashLayout.playButtonY,
      width: playBtnSize.width,
      height: playBtnSize.height,
    };

    this.pauseBtn = getPauseButtonRect(
      logicalWidth,
      getScoreBadgeY(logicalHeight),
    );
  }

  private bindInput(): void {
    const opts: AddEventListenerOptions = { passive: false };

    if (window.PointerEvent) {
      this.canvas.addEventListener('pointerdown', this.onPress, opts);
    } else {
      this.canvas.addEventListener('mousedown', this.onPress);
      this.canvas.addEventListener('touchstart', this.onPress, opts);
    }

    bindGameKeyboard({
      jump: () => this.performJump(),
      pause: () => this.togglePause(),
      canJump: () => this.currentState === GAME_STATES.Game && !this.isAwaitingName,
      canPause: () =>
        !this.isAwaitingName
        && (this.currentState === GAME_STATES.Game
          || this.currentState === GAME_STATES.Paused),
    });
  }

  private performJump(): void {
    this.goose.jump();
    this.sound.play(SOUND_EVENTS.Jump);
    this.haptic.pulse(HAPTIC_EVENTS.Jump);
  }

  private togglePause(): void {
    if (this.currentState === GAME_STATES.Game) {
      this.currentState = GAME_STATES.Paused;
      return;
    }

    if (this.currentState === GAME_STATES.Paused) {
      this.currentState = GAME_STATES.Game;
    }
  }

  private bindResizeTracking(): void {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('orientationchange', this.onResize);
    window.visualViewport?.addEventListener('resize', this.onResize);
    window.visualViewport?.addEventListener('scroll', this.onResize);

    this.resizeObserver = new ResizeObserver(() => {
      this.onResize();
    });
    this.resizeObserver.observe(document.documentElement);

    requestAnimationFrame(() => {
      this.resize();
    });
  }

  private readonly onResize = (): void => {
    if (this.resizeTimer !== null) {
      clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = setTimeout(() => {
      this.resizeTimer = null;
      this.resize();
    }, RESIZE_DEBOUNCE_MS);
  };

  private resize(): void {
    this.viewport = getViewportState();
    applyCanvasSize(this.canvas, this.ctx, this.viewport);
    this.layoutUi();
  }

  private syncStateFromStorage(): void {
    this.playerName = getSavedPlayerName();

    const savedDifficulty = getSelectedDifficulty();
    if (savedDifficulty) {
      this.applyDifficulty(savedDifficulty, false);
    } else {
      this.applyDifficulty(this.selectedDifficulty, false);
    }

    if (this.playerName) {
      this.personalBest = getPersonalBest(
        this.playerName,
        this.selectedDifficulty,
      );
    }
  }

  private applyDifficulty(level: DifficultyLevel, persist = true): void {
    const settings = getDifficultyById(level);
    this.selectedDifficulty = level;
    this.fgScrollSpeed = settings.fgScrollSpeed;
    this.pipes.setDifficulty(settings);

    if (persist) {
      saveSelectedDifficulty(level);
    }
  }

  private readonly onPress = (evt: PressEvent): void => {
    if (this.isAwaitingName) {
      return;
    }

    if (evt.cancelable) {
      evt.preventDefault();
    }

    switch (this.currentState) {
      case GAME_STATES.Splash: {
        const point = getCanvasPoint(this.canvas, evt, this.viewport);
        if (!point) {
          break;
        }

        if (isPointInRect(point, this.recordsBtn)) {
          this.recordsLevelTab =
            this.lastScoredLevel ?? this.selectedDifficulty;
          this.currentState = GAME_STATES.Records;
          void refreshLeaderboard(this.recordsLevelTab);
          break;
        }

        if (this.playerName && isPointInRect(point, this.playerNameBtn)) {
          void this.editPlayerName();
          break;
        }

        if (isPointInRect(point, this.settingsBtn)) {
          this.currentState = GAME_STATES.Settings;
          break;
        }

        if (isPointInRect(point, this.playBtn)) {
          void this.startGameWithNamePrompt();
          break;
        }

        const selectedIndex = this.difficultyTabBtns.findIndex((btn) =>
          isPointInRect(point, btn),
        );

        if (selectedIndex >= 0) {
          this.applyDifficulty(DIFFICULTIES[selectedIndex].id);
        }
        break;
      }

      case GAME_STATES.Settings: {
        const point = getCanvasPoint(this.canvas, evt, this.viewport);
        if (!point) {
          break;
        }

        if (isPointInRect(point, this.backBtn)) {
          this.currentState = GAME_STATES.Splash;
          break;
        }

        if (isPointInRect(point, this.soundToggleBtn)) {
          this.sound.toggleMuted();
          break;
        }

        if (
          this.haptic.isSupported()
          && isPointInRect(point, this.hapticToggleBtn)
        ) {
          this.haptic.toggleEnabled();
        }
        break;
      }

      case GAME_STATES.Records: {
        const point = getCanvasPoint(this.canvas, evt, this.viewport);
        if (!point) {
          break;
        }

        if (isPointInRect(point, this.backBtn)) {
          this.currentState = GAME_STATES.Splash;
          break;
        }

        const tabIndex = this.recordsTabBtns.findIndex((btn) =>
          isPointInRect(point, btn),
        );

        if (tabIndex >= 0) {
          this.recordsLevelTab = DIFFICULTIES[tabIndex].id;
          void refreshLeaderboard(this.recordsLevelTab);
        }
        break;
      }

      case GAME_STATES.Countdown:
        break;

      case GAME_STATES.Game: {
        const point = getCanvasPoint(this.canvas, evt, this.viewport);

        if (point && isPointInRect(point, this.pauseBtn)) {
          this.togglePause();
          break;
        }

        this.performJump();
        break;
      }

      case GAME_STATES.Paused:
        this.togglePause();
        break;

      case GAME_STATES.Score: {
        const point = getCanvasPoint(this.canvas, evt, this.viewport);
        if (point && isPointInRect(point, this.okBtn)) {
          this.pipes.reset();
          this.currentState = GAME_STATES.Splash;
          this.score = 0;
          this.hasSavedCurrentScore = false;
          this.layoutUi();
        }
        break;
      }
    }
  };

  private async editPlayerName(): Promise<void> {
    if (this.isAwaitingName) {
      return;
    }

    this.isAwaitingName = true;

    const result = await this.nameInput.prompt(this.playerName, {
      submitLabel: 'Сохранить',
    });
    this.isAwaitingName = false;

    if (!result.confirmed) {
      return;
    }

    this.playerName = result.name;
    savePlayerName(result.name);
    this.layoutUi();
  }

  private async startGameWithNamePrompt(): Promise<void> {
    if (this.isAwaitingName) {
      return;
    }

    if (this.playerName) {
      this.beginGame(this.playerName);
      return;
    }

    this.isAwaitingName = true;

    const result = await this.nameInput.prompt('');
    this.isAwaitingName = false;

    if (!result.confirmed) {
      return;
    }

    this.beginGame(result.name);
  }

  private beginGame(name: string): void {
    this.playerName = name;
    savePlayerName(name);
    this.personalBest = getPersonalBest(this.playerName, this.selectedDifficulty);
    this.score = 0;
    this.hasSavedCurrentScore = false;
    this.isNewBest = false;
    this.layoutUi();
    this.currentState = GAME_STATES.Countdown;
    this.countdownStep = 0;
    this.countdownTimer = 0;
    this.pipes.reset();
    this.pipes.seedInitial(this.viewport.logicalWidth, this.viewport.logicalHeight);
  }

  private startActiveGame(): void {
    this.currentState = GAME_STATES.Game;
    this.countdownStep = -1;
    this.countdownTimer = 0;
    this.goose.jump();
    this.sound.play(SOUND_EVENTS.Jump);
    this.haptic.pulse(HAPTIC_EVENTS.Jump);
  }

  private run(): void {
    const loop = (timestamp: number): void => {
      if (this.lastFrameTime === 0) {
        this.lastFrameTime = timestamp;
      }

      const deltaMs = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;
      const dt = Math.min(deltaMs / MS_PER_FRAME, MAX_FRAME_DELTA);

      this.update(dt);
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private update(dt: number): void {
    const { logicalHeight } = this.viewport;
    this.frames += dt;

    if (
      this.currentState !== GAME_STATES.Score
      && this.currentState !== GAME_STATES.Paused
    ) {
      this.fgpos =
        (this.fgpos - this.fgScrollSpeed * dt) % FG_TILE_WIDTH;
    }

    if (this.currentState === GAME_STATES.Score && !this.hasSavedCurrentScore) {
      this.isNewBest = this.score > this.personalBest;

      if (this.score > 0 && this.playerName.trim()) {
        saveRecord(this.playerName, this.selectedDifficulty, this.score);
        this.lastScoredLevel = this.selectedDifficulty;
      }

      if (this.isNewBest) {
        this.sound.play(SOUND_EVENTS.NewBest);
      }

      this.personalBest = Math.max(this.personalBest, this.score);
      this.hasSavedCurrentScore = true;
    }

    if (this.currentState === GAME_STATES.Countdown) {
      this.countdownTimer += dt;

      if (this.countdownTimer >= COUNTDOWN_STEP_DURATION) {
        this.countdownTimer = 0;
        this.countdownStep += 1;
        this.sound.play(SOUND_EVENTS.Tick);

        if (this.countdownStep >= COUNTDOWN_STEPS) {
          this.startActiveGame();
        }
      }
    }

    if (this.currentState === GAME_STATES.Game) {
      this.pipes.update(
        this.viewport.logicalWidth,
        logicalHeight,
        this.goose,
        dt,
        () => {
          this.currentState = GAME_STATES.Score;
          this.sound.play(SOUND_EVENTS.Hit);
          this.haptic.pulse(HAPTIC_EVENTS.Hit);
        },
        () => {
          this.score++;
          this.sound.play(SOUND_EVENTS.Score);
          this.haptic.pulse(HAPTIC_EVENTS.Score);
        },
      );
    }

    this.goose.update(
      this.currentState,
      logicalHeight,
      GROUND_HEIGHT,
      this.frames,
      dt,
      () => {
        if (this.currentState === GAME_STATES.Game) {
          this.currentState = GAME_STATES.Score;
          this.sound.play(SOUND_EVENTS.Hit);
          this.haptic.pulse(HAPTIC_EVENTS.Hit);
        }
      },
    );
  }

  private render(): void {
    const { ctx, viewport, sprites } = this;
    const { logicalWidth, logicalHeight } = viewport;
    const centerX = logicalWidth / 2;
    const splashLayout = getSplashLayout(logicalHeight);
    const scoreLayout = getScoreLayout(logicalHeight);
    const recordsLayout = getRecordsLayout(logicalHeight);
    const settingsLayout = getSettingsLayout(logicalHeight);

    drawSky(ctx, logicalWidth, logicalHeight);
    this.pipes.draw(ctx);

    if (
      this.currentState !== GAME_STATES.Splash
      && this.currentState !== GAME_STATES.Records
      && this.currentState !== GAME_STATES.Settings
    ) {
      this.goose.draw(ctx, sprites);
    }

    drawGround(ctx, logicalWidth, logicalHeight, this.fgpos);

    if (this.currentState === GAME_STATES.Splash) {
      drawTitleWithLogo(
        ctx,
        'Flappy Petya',
        this.logoImg,
        centerX,
        splashLayout.titleY,
        logicalWidth,
      );
      drawSubtitle(ctx, 'Выбери уровень', centerX, splashLayout.subtitleY);

      DIFFICULTIES.forEach((difficulty, index) => {
        drawRecordsTab(
          ctx,
          difficulty.label,
          this.difficultyTabBtns[index],
          difficulty.id === this.selectedDifficulty,
        );
      });

      drawButton(ctx, PLAY_BUTTON_LABEL, this.playBtn, true);
      drawRecordsTab(ctx, RECORDS_BUTTON_LABEL, this.recordsBtn, false);
      drawRecordsTab(ctx, SETTINGS_BUTTON_LABEL, this.settingsBtn, false);

      if (this.playerName) {
        drawPlayerNameButton(ctx, this.playerName, this.playerNameBtn);
      }
    }

    if (this.currentState === GAME_STATES.Countdown) {
      drawCountdown(
        ctx,
        centerX,
        getCountdownY(logicalHeight),
        this.countdownStep,
      );
    }

    if (this.currentState === GAME_STATES.Settings) {
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
        this.soundToggleBtn,
        !this.sound.isMuted(),
      );
      drawSettingsToggleRow(
        ctx,
        'Вибрация',
        this.hapticToggleBtn,
        this.haptic.isEnabled(),
        !this.haptic.isSupported(),
      );
      drawButton(ctx, BACK_BUTTON_LABEL, this.backBtn);
    }

    if (this.currentState === GAME_STATES.Records) {
      drawTitle(ctx, 'Рекорды', centerX, recordsLayout.titleY);

      DIFFICULTIES.forEach((difficulty, index) => {
        drawRecordsTab(
          ctx,
          difficulty.label,
          this.recordsTabBtns[index],
          difficulty.id === this.recordsLevelTab,
        );
      });

      drawRecordsTable(
        ctx,
        getTopRecordsByLevel(this.recordsLevelTab),
        centerX,
        recordsLayout.tableStartY,
        logicalWidth,
        isLeaderboardLoading()
          && getTopRecordsByLevel(this.recordsLevelTab).length === 0,
        this.playerName,
      );
      drawButton(ctx, BACK_BUTTON_LABEL, this.backBtn);
    }

    if (this.currentState === GAME_STATES.Score) {
      drawSubtitle(
        ctx,
        this.isNewBest ? 'Новый рекорд!' : 'Игра окончена',
        centerX,
        scoreLayout.subtitleY,
      );
      drawGameOverImage(
        ctx,
        this.gameOverImg,
        centerX,
        scoreLayout.imageY,
        scoreLayout.imageHeight,
      );
      drawScorePanel(
        ctx,
        this.score,
        this.personalBest,
        centerX,
        scoreLayout.panelY,
        { medal: getMedal(this.score) },
      );
      drawButton(ctx, RETRY_BUTTON_LABEL, this.okBtn);
    } else if (this.currentState === GAME_STATES.Game) {
      const badgeY = getScoreBadgeY(logicalHeight);
      drawScoreBadge(ctx, this.score, centerX, badgeY);
      drawPauseButton(ctx, this.pauseBtn);
    } else if (this.currentState === GAME_STATES.Paused) {
      drawScoreBadge(ctx, this.score, centerX, getScoreBadgeY(logicalHeight));
      drawPauseButton(ctx, this.pauseBtn);
      drawPauseOverlay(ctx, logicalWidth, logicalHeight, centerX, logicalHeight * 0.5);
    }
  }
}
