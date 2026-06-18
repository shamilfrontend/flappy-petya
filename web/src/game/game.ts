import { getSoundManager, SOUND_EVENTS } from '../audio/sound';
import { getHapticManager, HAPTIC_EVENTS } from '../input/haptic';
import { Goose } from '../entities/goose';
import { Pipes } from '../entities/pipes';
import { GooseTrail } from '../graphics/goose-trail';
import { ParticleSystem } from '../graphics/particles';
import { initSprites, type Sprites } from '../graphics/sprites';
import { loadImageWithFallback } from '../lib/load-image-with-fallback';
import {
  getSavedPlayerName,
  getSelectedRecordsLevel,
  getSelectedDifficulty,
  initStorage,
  saveSelectedDifficulty,
} from '../lib/storage';
import { hideAppLoader } from '../ui/app-loader';
import { MessageOverlay } from '../ui/message-overlay';
import {
  applyCanvasSize,
  getViewportState,
  type ViewportState,
} from '../lib/viewport';
import {
  DIFFICULTY_LEVELS,
  getDifficultyById,
  type DifficultyLevel,
} from './difficulty';
import {
  beginGame as beginGameSession,
  openRecordsScreen,
  startActiveGame as startActiveGameSession,
  startGameSession,
  triggerDeath as triggerGameDeath,
} from './game-auth';
import type { GameHost } from './game-host';
import { bindGameInput, unbindGameInput, type GameInputBindings } from './game-input';
import { layoutGameUi } from './game-layout';
import { GameLoop } from './game-loop';
import { renderGame } from './game-renderer';
import { updateGame } from './game-updater';
import { GAME_STATES, type GameState } from './states';
import { transitionToState } from './state-transition';
import type { ButtonRect } from '../graphics/ui-text';

export { RESIZE_DEBOUNCE_MS } from './config';

const GOOSE_URL = `${import.meta.env.BASE_URL}static/goose.png`;
const GAME_OVER_URL = `${import.meta.env.BASE_URL}static/game-over-goose.png`;
const LOGO_URL = `${import.meta.env.BASE_URL}static/logo.png`;
const PLAY_BUTTON_LABEL = 'Играть';

export class Game implements GameHost {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  viewport!: ViewportState;
  sprites!: Sprites;
  gameOverImg!: HTMLImageElement;
  logoImg!: HTMLImageElement;

  private gameLoop: GameLoop | null = null;
  private inputBindings: GameInputBindings | null = null;

  readonly goose = new Goose();
  readonly pipes = new Pipes();
  readonly particles = new ParticleSystem();
  readonly gooseTrail = new GooseTrail();
  readonly sound = getSoundManager();
  readonly haptic = getHapticManager();
  readonly messageOverlay = new MessageOverlay();

  currentState: GameState = GAME_STATES.Splash;
  previousState: GameState = GAME_STATES.Splash;
  transitionTimer = 0;
  scorePulseTimer = 0;
  scoreUiTimer = 0;
  recordsUiTimer = 0;
  fgpos = 0;
  frames = 0;
  gameFrames = 0;
  score = 0;
  playerName = getSavedPlayerName();
  levelTopScore = 0;
  isResolvingLevelTop = false;
  selectedDifficulty: DifficultyLevel = DIFFICULTY_LEVELS.Medium;
  recordsLevelTab: DifficultyLevel = DIFFICULTY_LEVELS.Medium;
  recordsRefreshLevel: DifficultyLevel | null = null;
  countdownStep = -1;
  countdownTimer = 0;
  isNewBest = false;
  fgScrollSpeed = getDifficultyById(DIFFICULTY_LEVELS.Medium).fgScrollSpeed;
  hasSavedCurrentScore = false;
  lastScoredLevel: DifficultyLevel | undefined;
  deathAnimTimer = 0;
  shakeTimer = 0;
  shakeIntensity = 0;
  nextStartAllowedAtMs = 0;
  isStartingGame = false;

  scoreHomeBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  scoreRetryBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  recordsBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  playerNameBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  backBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  recordsTabBtns: ButtonRect[] = [];
  difficultyTabBtns: ButtonRect[] = [];
  playBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  settingsBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  soundToggleBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  hapticToggleBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };
  pauseBtn: ButtonRect = { x: 0, y: 0, width: 0, height: 0 };

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
      hideAppLoader();
      this.messageOverlay.show(
        'Ваш браузер не поддерживает HTML5 Canvas. Обновите браузер до последней версии.',
        {
          actionLabel: 'Обновить',
          onAction: () => window.location.reload(),
        },
      );
      return;
    }
    this.ctx = ctx;

    applyCanvasSize(this.canvas, this.ctx, this.viewport);
    document.body.appendChild(this.canvas);
    if (import.meta.env.DEV) {
      (window as Window & { flappyPetyaGameDebug?: Game }).flappyPetyaGameDebug = this;
    }
    this.inputBindings = bindGameInput(this, this.canvas);

    this.gameLoop = new GameLoop(
      {
        update: (dt) => updateGame(this, dt),
        render: () => renderGame(this),
      },
      { onResize: () => this.resize() },
    );
    this.gameLoop.bindResizeTracking();
    this.gameLoop.bindVisibilityTracking();

    void initStorage()
      .then(() => {
        this.syncStateFromStorage();
      })
      .catch((err) => {
        console.error('Storage initialization failed', err);
      });

    Promise.all([
      loadImageWithFallback(GOOSE_URL),
      loadImageWithFallback(GAME_OVER_URL),
      loadImageWithFallback(LOGO_URL),
    ])
      .then(([gooseImg, gameOverImg, logoImg]) => {
        this.sprites = initSprites(gooseImg);
        this.gameOverImg = gameOverImg;
        this.logoImg = logoImg;
        this.syncStateFromStorage();
        this.layoutUi();
        hideAppLoader();
        this.gameLoop?.start();
      })
      .catch((err) => {
        console.error(err);
        hideAppLoader();
        this.messageOverlay.show('Не удалось загрузить игровые ресурсы', {
          actionLabel: 'Обновить',
          onAction: () => window.location.reload(),
        });
      });
  }

  destroy(): void {
    this.gameLoop?.destroy();
    this.gameLoop = null;

    if (this.canvas && this.inputBindings) {
      unbindGameInput(this.canvas, this.inputBindings);
    }
    this.inputBindings = null;

    this.canvas?.remove();
    this.messageOverlay.hide();
  }

  layoutUi(): void {
    layoutGameUi(this);
  }

  getPlayButtonLabel(): string {
    return PLAY_BUTTON_LABEL;
  }

  syncStateFromStorage(): void {
    this.playerName = getSavedPlayerName();

    const savedDifficulty = getSelectedDifficulty();
    if (savedDifficulty) {
      this.applyDifficulty(savedDifficulty, false);
    } else {
      this.applyDifficulty(this.selectedDifficulty, false);
    }

    const savedRecordsLevel = getSelectedRecordsLevel();
    this.recordsLevelTab = savedRecordsLevel ?? this.selectedDifficulty;

  }

  applyDifficulty(level: DifficultyLevel, persist = true): void {
    const settings = getDifficultyById(level);
    this.selectedDifficulty = level;
    this.fgScrollSpeed = settings.fgScrollSpeed;
    this.pipes.setDifficulty(settings);
    if (persist) {
      saveSelectedDifficulty(level);
    }
  }

  performJump(): void {
    this.goose.jump();
    this.particles.emitFlap(this.goose.x, this.goose.y);
    this.sound.play(SOUND_EVENTS.Jump);
    this.haptic.pulse(HAPTIC_EVENTS.Jump);
  }

  togglePause(): void {
    if (this.currentState === GAME_STATES.Game) {
      transitionToState(this, GAME_STATES.Paused, { reason: 'toggle_pause' });
      return;
    }

    if (this.currentState === GAME_STATES.Paused) {
      transitionToState(this, GAME_STATES.Game, { reason: 'toggle_resume' });
    }
  }

  triggerDeath(): void {
    triggerGameDeath(this);
  }

  startActiveGame(): void {
    startActiveGameSession(this);
  }

  beginGame(name: string): Promise<void> {
    return beginGameSession(this, name);
  }

  startGame(): Promise<void> {
    return startGameSession(this);
  }

  openRecords(): Promise<void> {
    return openRecordsScreen(this);
  }

  handleBackPress(): boolean {
    switch (this.currentState) {
      case GAME_STATES.Game:
        transitionToState(this, GAME_STATES.Paused, {
          reason: 'native_back_pause',
        });
        return true;
      case GAME_STATES.Paused:
        transitionToState(this, GAME_STATES.Splash, {
          reason: 'native_back_to_splash',
          lockStartForMs: 450,
        });
        this.score = 0;
        this.pipes.reset();
        this.layoutUi();
        return true;
      case GAME_STATES.Records:
      case GAME_STATES.Settings:
        transitionToState(this, GAME_STATES.Splash, {
          reason: 'native_back_overlay_to_splash',
          lockStartForMs: 450,
        });
        return true;
      case GAME_STATES.Score:
        if (this.deathAnimTimer > 0 || !this.hasSavedCurrentScore) {
          return true;
        }

        transitionToState(this, GAME_STATES.Splash, {
          reason: 'native_back_score_to_splash',
          lockStartForMs: 450,
        });
        this.score = 0;
        this.hasSavedCurrentScore = false;
        this.isResolvingLevelTop = false;
        this.pipes.reset();
        this.layoutUi();
        return true;
      default:
        return false;
    }
  }

  private resize(): void {
    this.viewport = getViewportState();
    applyCanvasSize(this.canvas, this.ctx, this.viewport);
    this.layoutUi();
  }
}
