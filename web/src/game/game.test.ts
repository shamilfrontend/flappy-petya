const storageMocks = vi.hoisted(() => ({
  getSavedPlayerName: vi.fn(() => ''),
  getSelectedDifficulty: vi.fn((): undefined => undefined),
  getPersonalBest: vi.fn(() => 0),
  getTopRecordsByLevel: vi.fn(() => []),
  initStorage: vi.fn(() => Promise.resolve()),
  isLeaderboardLoading: vi.fn(() => false),
  isFirebaseSyncPending: vi.fn(() => false),
  refreshLeaderboard: vi.fn(() => Promise.resolve()),
  savePlayerName: vi.fn(),
  saveRecord: vi.fn(),
  prepareGameSession: vi.fn(
    (): Promise<{ ok: boolean; errorMessage?: string }> =>
      Promise.resolve({ ok: true }),
  ),
  saveSelectedDifficulty: vi.fn(),
}));

const getCanvasPointMock = vi.hoisted(() => vi.fn());
const resizeObserverDisconnectMock = vi.hoisted(() => vi.fn());

const soundMocks = vi.hoisted(() => ({
  play: vi.fn(),
  setMuted: vi.fn(),
  isMuted: vi.fn(() => false),
  toggleMuted: vi.fn(() => true),
}));

const hapticMocks = vi.hoisted(() => ({
  pulse: vi.fn(),
  isSupported: vi.fn(() => true),
  isEnabled: vi.fn(() => true),
  setEnabled: vi.fn(),
  toggleEnabled: vi.fn(() => false),
}));

vi.mock('../audio/sound', () => ({
  getSoundManager: () => soundMocks,
  SOUND_EVENTS: {
    Jump: 'jump',
    Score: 'score',
    Hit: 'hit',
    NewBest: 'newBest',
    Tick: 'tick',
  },
}));

vi.mock('../input/haptic', () => ({
  getHapticManager: () => hapticMocks,
  HAPTIC_EVENTS: {
    Jump: 'jump',
    Score: 'score',
    Hit: 'hit',
  },
}));

vi.mock('../lib/storage', () => storageMocks);

vi.mock('../ui/app-loader', () => ({
  hideAppLoader: vi.fn(),
}));

vi.mock('../graphics/environment', () => ({
  drawSky: vi.fn(),
  drawGround: vi.fn(),
}));

vi.mock('../graphics/ui-text', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../graphics/ui-text')>();

  return {
    ...actual,
    measureButton: vi.fn(() => ({ x: 0, y: 0, width: 100, height: 40 })),
    measurePlayerNameButton: vi.fn(() => ({ x: 0, y: 0, width: 120, height: 40 })),
    layoutRecordsTabs: vi.fn((_centerX: number, y: number, _width: number, count: number) =>
      Array.from({ length: count }, (_, index) => ({
        x: index * 106,
        y,
        width: 100,
        height: 36,
      })),
    ),
    drawButton: vi.fn(),
    drawTitle: vi.fn(),
    drawSubtitle: vi.fn(),
    drawTitleWithLogo: vi.fn(),
    drawRecordsTab: vi.fn(),
    drawRecordsTable: vi.fn(),
    drawPlayerNameButton: vi.fn(),
    drawScoreBadge: vi.fn(),
    drawScorePanel: vi.fn(),
    drawGameOverImage: vi.fn(),
    drawSettingsPanel: vi.fn(),
    drawSettingsToggleRow: vi.fn(),
    drawCountdown: vi.fn(),
    drawPauseButton: vi.fn(),
    drawPauseOverlay: vi.fn(),
  };
});

vi.mock('../graphics/sprites', () => ({
  initSprites: vi.fn(() => ({
    goose: [{ draw: vi.fn() }, { draw: vi.fn() }, { draw: vi.fn() }],
  })),
}));

vi.mock('../input/pointer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../input/pointer')>();

  return {
    ...actual,
    getCanvasPoint: getCanvasPointMock,
  };
});

import {
  drawCountdown,
  drawPauseOverlay,
  drawRecordsTable,
  drawScoreBadge,
  drawScorePanel,
} from '../graphics/ui-text';
import { hideAppLoader } from '../ui/app-loader';
import {
  getSavedPlayerName,
  getSelectedDifficulty,
  getTopRecordsByLevel,
  initStorage,
  isLeaderboardLoading,
  refreshLeaderboard,
  saveRecord,
  saveSelectedDifficulty,
} from '../lib/storage';
import { DEATH_ANIM_DURATION, GOOSE_JUMP, SHAKE_DURATION } from './config';
import { DIFFICULTIES, DIFFICULTY_LEVELS } from './difficulty';
import { Game } from './game';
import { renderGame } from './game-renderer';
import { updateGame } from './game-updater';
import { handleScreenPress } from './screen-handlers';
import type { MessageOverlay } from '../ui/message-overlay';
import { GAME_STATES } from './states';

interface GamePrivate {
  currentState: typeof GAME_STATES[keyof typeof GAME_STATES];
  score: number;
  playerName: string;
  hasSavedCurrentScore: boolean;
  personalBest: number;
  isNewBest: boolean;
  selectedDifficulty: typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];
  recordsLevelTab: typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];
  lastScoredLevel: typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS] | undefined;
  deathAnimTimer: number;
  shakeTimer: number;
  countdownStep: number;
  countdownTimer: number;
  goose: { velocity: number; y: number };
  canvas: HTMLCanvasElement;
  inputBindings: { unbindKeyboard: (() => void) | null } | null;
  recordsBtn: { x: number; y: number; width: number; height: number };
  playerNameBtn: { x: number; y: number; width: number; height: number };
  backBtn: { x: number; y: number; width: number; height: number };
  settingsBtn: { x: number; y: number; width: number; height: number };
  soundToggleBtn: { x: number; y: number; width: number; height: number };
  hapticToggleBtn: { x: number; y: number; width: number; height: number };
  pauseBtn: { x: number; y: number; width: number; height: number };
  fgpos: number;
  messageOverlay: MessageOverlay;
  gameFrames: number;
}

function accessGame(game: Game): GamePrivate {
  return game as unknown as GamePrivate;
}

function centerOf(rect: { x: number; y: number; width: number; height: number }): {
  x: number;
  y: number;
} {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function createMockImage(this: {
  listeners: Map<string, Array<() => void>>;
  source: string;
  src: string;
  addEventListener: (event: string, listener: () => void) => void;
}) {
  this.listeners = new Map();
  this.source = '';

  Object.defineProperty(this, 'src', {
    configurable: true,
    enumerable: true,
    get() {
      return this.source;
    },
    set(value: string) {
      this.source = value;
      queueMicrotask(() => {
        this.listeners.get('load')?.forEach((listener: () => void) => listener());
      });
    },
  });

  this.addEventListener = (event: string, listener: () => void) => {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(listener);
    this.listeners.set(event, handlers);
  };
}

describe('Game', () => {
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    document.body.innerHTML = '';
    mockContext = {
      setTransform: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      drawImage: vi.fn(),
      font: '',
      measureText: vi.fn(() => ({ width: 80 })),
    } as unknown as CanvasRenderingContext2D;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockContext);
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 320,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 480,
    });
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 1,
    });

    vi.stubGlobal('Image', createMockImage as unknown as typeof Image);
    resizeObserverDisconnectMock.mockClear();
    vi.stubGlobal('ResizeObserver', class MockResizeObserver {
      observe = vi.fn();

      disconnect = resizeObserverDisconnectMock;
    });
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));

    vi.clearAllMocks();
    storageMocks.getSavedPlayerName.mockReturnValue('');
    storageMocks.getSelectedDifficulty.mockReturnValue(undefined);
    storageMocks.getPersonalBest.mockReturnValue(0);
    getCanvasPointMock.mockReturnValue(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function startGame(playerName = ''): Promise<Game> {
    vi.mocked(getSavedPlayerName).mockReturnValue(playerName);

    const game = new Game();
    game.start();

    await vi.waitFor(() => {
      expect(initStorage).toHaveBeenCalled();
      expect(hideAppLoader).toHaveBeenCalled();
    });

    return game;
  }

  function press(game: Game): void {
    handleScreenPress(game, {
      clientX: 0,
      clientY: 0,
      cancelable: true,
      preventDefault: vi.fn(),
    } as unknown as MouseEvent);
  }

  function runUpdate(game: Game, dt = 1): void {
    updateGame(game, dt);
  }

  function render(game: Game): void {
    renderGame(game);
  }

  function finishCountdown(game: Game): void {
    const internals = accessGame(game);

    for (let frame = 0; frame < 200; frame += 1) {
      runUpdate(game, 1);

      if (internals.currentState === GAME_STATES.Game) {
        return;
      }
    }
  }

  async function pressPlay(game: Game): Promise<void> {
    getCanvasPointMock.mockReturnValue({ x: 160, y: 222 });
    press(game);
    await vi.waitFor(() => {
      expect(accessGame(game).currentState).toBe(GAME_STATES.Countdown);
    });
  }

  async function startActiveGame(playerName = 'Петя'): Promise<Game> {
    const game = await startGame(playerName);
    await pressPlay(game);
    finishCountdown(game);
    return game;
  }

  it('loads assets, initializes storage and hides app loader', async () => {
    await startGame();

    expect(initStorage).toHaveBeenCalledOnce();
    expect(hideAppLoader).toHaveBeenCalledOnce();
    expect(document.querySelector('canvas')).not.toBeNull();
  });

  it('starts on splash screen', async () => {
    const game = await startGame();

    expect(accessGame(game).currentState).toBe(GAME_STATES.Splash);
  });

  it('syncs saved player name and difficulty from storage', async () => {
    vi.mocked(getSavedPlayerName).mockReturnValue('Петя');
    vi.mocked(getSelectedDifficulty).mockReturnValue('hard');

    const game = await startGame('Петя');

    expect(accessGame(game).playerName).toBe('Петя');
    expect(accessGame(game).selectedDifficulty).toBe('hard');
  });

  it('starts game when player name already exists', async () => {
    const game = await startGame('Петя');

    await pressPlay(game);

    expect(accessGame(game).currentState).toBe(GAME_STATES.Countdown);
  });

  it('prompts for name and starts game when player name is empty', async () => {
    storageMocks.savePlayerName.mockImplementation((name: string) => {
      storageMocks.getSavedPlayerName.mockReturnValue(name);
    });

    const game = await startGame('');
    getCanvasPointMock.mockReturnValue({ x: 160, y: 222 });
    press(game);

    await vi.waitFor(() => {
      expect(document.querySelector('.name-overlay')?.getAttribute('hidden')).toBeNull();
    });

    const input = document.querySelector('.name-dialog__input') as HTMLInputElement;
    const button = document.querySelector('.name-dialog__button') as HTMLButtonElement;
    input.value = 'НовыйИгрок';
    button.click();

    await vi.waitFor(() => {
      expect(storageMocks.savePlayerName).toHaveBeenCalledWith('НовыйИгрок');
      expect(accessGame(game).currentState).toBe(GAME_STATES.Countdown);
    });
  });

  it('shows message overlay when asset loading fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.stubGlobal('Image', function FailingImage(this: {
      listeners: Map<string, Array<() => void>>;
      source: string;
      addEventListener: (event: string, listener: () => void) => void;
    }) {
      this.listeners = new Map();
      Object.defineProperty(this, 'src', {
        configurable: true,
        enumerable: true,
        get() {
          return this.source;
        },
        set(value: string) {
          this.source = value;
          queueMicrotask(() => {
            this.listeners.get('error')?.forEach((listener: () => void) => listener());
          });
        },
      });
      this.addEventListener = (event: string, listener: () => void) => {
        const handlers = this.listeners.get(event) ?? [];
        handlers.push(listener);
        this.listeners.set(event, handlers);
      };
    } as unknown as typeof Image);

    const game = new Game();
    game.start();

    await vi.waitFor(() => {
      expect(hideAppLoader).toHaveBeenCalled();
    });

    const message = document.querySelector('.message-dialog__message');
    expect(message?.textContent).toBe('Не удалось загрузить игровые ресурсы');
    expect(document.querySelector('canvas')).not.toBeNull();

    game.destroy();
    expect(document.querySelector('canvas')).toBeNull();
    expect(consoleError).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('Failed to load') }),
    );

    consoleError.mockRestore();
  });

  it('shows message overlay when canvas context is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    const game = new Game();
    game.start();

    const message = document.querySelector('.message-dialog__message');
    expect(message?.textContent).toContain('не поддерживает HTML5 Canvas');
    expect(document.querySelector('canvas')).toBeNull();

    game.destroy();
  });

  it('opens records screen and refreshes leaderboard', async () => {
    const game = await startGame();
    getCanvasPointMock.mockReturnValue(centerOf(accessGame(game).recordsBtn));

    press(game);

    await vi.waitFor(() => {
      expect(accessGame(game).currentState).toBe(GAME_STATES.Records);
    });
    expect(refreshLeaderboard).toHaveBeenCalledWith(DIFFICULTY_LEVELS.Medium);
  });

  it('returns to splash from records on back button', async () => {
    const game = await startGame();
    const internals = accessGame(game);
    getCanvasPointMock.mockReturnValueOnce(centerOf(internals.recordsBtn));
    press(game);
    getCanvasPointMock.mockReturnValueOnce(centerOf(internals.backBtn));

    press(game);

    expect(accessGame(game).currentState).toBe(GAME_STATES.Splash);
  });

  it('changes difficulty from splash tabs', async () => {
    const game = await startGame();
    getCanvasPointMock.mockReturnValue({ x: 53, y: 168 });

    press(game);

    expect(accessGame(game).selectedDifficulty).toBe(DIFFICULTIES[0].id);
    expect(saveSelectedDifficulty).toHaveBeenCalledWith(DIFFICULTIES[0].id);
  });

  it('makes goose jump during active game', async () => {
    const game = await startGame('Петя');
    await pressPlay(game);
    finishCountdown(game);

    const internals = accessGame(game);
    expect(internals.currentState).toBe(GAME_STATES.Game);

    getCanvasPointMock.mockReturnValue(null);
    press(game);

    expect(internals.goose.velocity).toBe(-GOOSE_JUMP);
    expect(soundMocks.play).toHaveBeenCalledWith('jump');
    expect(hapticMocks.pulse).toHaveBeenCalledWith('jump');
  });

  it('does not start countdown when game session preparation fails', async () => {
    storageMocks.prepareGameSession.mockResolvedValueOnce({
      ok: false,
      errorMessage: 'Сессия недоступна',
    });

    const game = await startGame('Петя');
    const internals = accessGame(game);
    const showMessage = vi.spyOn(internals.messageOverlay, 'show');
    getCanvasPointMock.mockReturnValue({ x: 160, y: 222 });
    press(game);

    await vi.waitFor(() => {
      expect(storageMocks.prepareGameSession).toHaveBeenCalled();
    });

    expect(internals.currentState).toBe(GAME_STATES.Splash);
    expect(showMessage).toHaveBeenCalledWith('Сессия недоступна');
  });

  it('increments gameFrames only during active gameplay', async () => {
    const game = await startActiveGame('Петя');
    const internals = accessGame(game);
    const framesAfterStart = internals.gameFrames;

    runUpdate(game, 1);
    expect(internals.gameFrames).toBe(framesAfterStart + 1);

    internals.currentState = GAME_STATES.Paused;
    runUpdate(game, 1);
    expect(internals.gameFrames).toBe(framesAfterStart + 1);

    internals.currentState = GAME_STATES.Game;
    runUpdate(game, 2);
    expect(internals.gameFrames).toBe(framesAfterStart + 3);
  });

  it('saves score once when entering score screen', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Score;
    internals.score = 7;

    runUpdate(game, 1);

    expect(saveRecord).toHaveBeenCalledWith(
      'Петя',
      DIFFICULTY_LEVELS.Medium,
      7,
      0,
    );
    expect(saveRecord).toHaveBeenCalledOnce();

    runUpdate(game, 1);

    expect(saveRecord).toHaveBeenCalledOnce();
  });

  it('returns to splash from score screen on retry', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Score;
    internals.score = 3;
    getCanvasPointMock.mockReturnValue({ x: 160, y: 350 });

    press(game);

    expect(internals.currentState).toBe(GAME_STATES.Splash);
    expect(internals.score).toBe(0);
  });

  it('transitions to score screen on pipe collision', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const game = await startGame('Петя');
    await pressPlay(game);
    finishCountdown(game);

    const internals = accessGame(game);
    internals.goose.y = 100;

    for (let frame = 0; frame < 500; frame += 1) {
      runUpdate(game, 1);

      if (internals.currentState === GAME_STATES.Score) {
        break;
      }
    }

    expect(internals.currentState).toBe(GAME_STATES.Score);
    expect(internals.deathAnimTimer).toBe(DEATH_ANIM_DURATION);
    expect(soundMocks.play).toHaveBeenCalledWith('hit');
  });

  it('switches records tab and refreshes leaderboard', async () => {
    const game = await startGame();
    getCanvasPointMock.mockReturnValueOnce(centerOf(accessGame(game).recordsBtn));
    press(game);
    await vi.waitFor(() => {
      expect(accessGame(game).currentState).toBe(GAME_STATES.Records);
    });
    vi.mocked(refreshLeaderboard).mockClear();
    getCanvasPointMock.mockReturnValueOnce({ x: 53, y: 85 });

    press(game);

    expect(refreshLeaderboard).toHaveBeenCalledWith(DIFFICULTY_LEVELS.Easy);
  });

  it('ignores score screen retry when click misses ok button', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Score;
    internals.score = 5;
    getCanvasPointMock.mockReturnValue({ x: 10, y: 10 });

    press(game);

    expect(internals.currentState).toBe(GAME_STATES.Score);
    expect(internals.score).toBe(5);
  });

  it('updates personal best on score screen', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Score;
    internals.score = 12;
    internals.personalBest = 5;
    internals.hasSavedCurrentScore = false;
    storageMocks.getPersonalBest.mockReturnValue(12);

    runUpdate(game, 1);

    expect(internals.personalBest).toBe(12);
    expect(saveRecord).toHaveBeenCalledWith(
      'Петя',
      DIFFICULTY_LEVELS.Medium,
      12,
      0,
    );
    expect(soundMocks.play).toHaveBeenCalledWith('newBest');
  });

  it('does not save score while paused', async () => {
    const game = await startActiveGame();
    const internals = accessGame(game);
    internals.score = 5;
    internals.currentState = GAME_STATES.Paused;

    runUpdate(game, 1);

    expect(saveRecord).not.toHaveBeenCalled();
  });

  it('saves final score once after pause and game over', async () => {
    const game = await startActiveGame();
    const internals = accessGame(game);
    internals.score = 3;
    internals.currentState = GAME_STATES.Paused;

    runUpdate(game, 1);

    expect(saveRecord).not.toHaveBeenCalled();

    internals.currentState = GAME_STATES.Score;
    internals.score = 10;
    internals.hasSavedCurrentScore = false;
    const framesBeforeSave = internals.gameFrames;

    runUpdate(game, 1);

    expect(saveRecord).toHaveBeenCalledWith(
      'Петя',
      DIFFICULTY_LEVELS.Medium,
      10,
      framesBeforeSave,
    );
    expect(saveRecord).toHaveBeenCalledOnce();
  });

  it('saves score after pause at zero when game ends with points', async () => {
    const game = await startActiveGame();
    const internals = accessGame(game);
    internals.score = 0;
    internals.currentState = GAME_STATES.Paused;

    runUpdate(game, 1);

    expect(saveRecord).not.toHaveBeenCalled();

    internals.currentState = GAME_STATES.Score;
    internals.score = 5;
    internals.hasSavedCurrentScore = false;
    const framesBeforeSave = internals.gameFrames;

    runUpdate(game, 1);

    expect(saveRecord).toHaveBeenCalledWith(
      'Петя',
      DIFFICULTY_LEVELS.Medium,
      5,
      framesBeforeSave,
    );
  });

  it('opens records on last scored level tab', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.selectedDifficulty = DIFFICULTY_LEVELS.Medium;
    internals.lastScoredLevel = DIFFICULTY_LEVELS.Easy;
    getCanvasPointMock.mockReturnValueOnce(centerOf(internals.recordsBtn));

    press(game);

    await vi.waitFor(() => {
      expect(internals.recordsLevelTab).toBe(DIFFICULTY_LEVELS.Easy);
    });
    expect(refreshLeaderboard).toHaveBeenCalledWith(DIFFICULTY_LEVELS.Easy);
  });


  it('binds pointer events when supported', async () => {
    const addEventListener = vi.spyOn(HTMLCanvasElement.prototype, 'addEventListener');
    Object.defineProperty(window, 'PointerEvent', {
      configurable: true,
      value: class PointerEvent {},
    });

    await startGame();

    expect(addEventListener).toHaveBeenCalledWith(
      'pointerdown',
      expect.any(Function),
      { passive: false },
    );
    addEventListener.mockRestore();
  });

  it('falls back to mouse and touch events without pointer support', async () => {
    const addEventListener = vi.spyOn(HTMLCanvasElement.prototype, 'addEventListener');
    Object.defineProperty(window, 'PointerEvent', {
      configurable: true,
      value: undefined,
    });

    await startGame();

    expect(addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addEventListener).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
      { passive: false },
    );
    addEventListener.mockRestore();
  });

  it('renders score badge during active game', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Game;
    internals.score = 4;

    render(game);

    expect(drawScoreBadge).toHaveBeenCalled();
  });

  it('renders records table with loading state', async () => {
    const game = await startGame();
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Records;
    vi.mocked(getTopRecordsByLevel).mockReturnValue([]);
    vi.mocked(isLeaderboardLoading).mockReturnValue(true);

    render(game);

    expect(drawRecordsTable).toHaveBeenCalledWith(
      expect.anything(),
      [],
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      true,
      '',
      false,
    );
  });

  it('renders records table with syncing state when data exists', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Records;
    vi.mocked(getTopRecordsByLevel).mockReturnValue([
      { name: 'Петя', level: 'easy', score: 5 },
    ]);
    vi.mocked(isLeaderboardLoading).mockReturnValue(true);

    render(game);

    expect(drawRecordsTable).toHaveBeenCalledWith(
      expect.anything(),
      [{ name: 'Петя', level: 'easy', score: 5 }],
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      false,
      'Петя',
      true,
    );
  });

  it('opens settings from splash and toggles sound', async () => {
    const game = await startGame();
    const internals = accessGame(game);
    getCanvasPointMock.mockReturnValue({
      x: internals.settingsBtn.x + internals.settingsBtn.width / 2,
      y: internals.settingsBtn.y + internals.settingsBtn.height / 2,
    });

    press(game);
    expect(internals.currentState).toBe(GAME_STATES.Settings);

    getCanvasPointMock.mockReturnValue({
      x: internals.soundToggleBtn.x + internals.soundToggleBtn.width / 2,
      y: internals.soundToggleBtn.y + internals.soundToggleBtn.height / 2,
    });
    press(game);

    expect(soundMocks.toggleMuted).toHaveBeenCalledOnce();
  });

  it('toggles haptic from settings and returns to splash', async () => {
    const game = await startGame();
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Settings;

    getCanvasPointMock.mockReturnValue({
      x: internals.hapticToggleBtn.x + internals.hapticToggleBtn.width / 2,
      y: internals.hapticToggleBtn.y + internals.hapticToggleBtn.height / 2,
    });
    press(game);
    expect(hapticMocks.toggleEnabled).toHaveBeenCalledOnce();

    getCanvasPointMock.mockReturnValue({ x: 160, y: 420 });
    internals.backBtn = { x: 110, y: 400, width: 100, height: 40 };
    getCanvasPointMock.mockReturnValue({
      x: internals.backBtn.x + internals.backBtn.width / 2,
      y: internals.backBtn.y + internals.backBtn.height / 2,
    });
    press(game);
    expect(internals.currentState).toBe(GAME_STATES.Splash);
  });

  it('enters countdown and ignores jump input until game starts', async () => {
    const game = await startGame('Петя');
    await pressPlay(game);

    const internals = accessGame(game);
    expect(internals.currentState).toBe(GAME_STATES.Countdown);

    getCanvasPointMock.mockReturnValue(null);
    press(game);

    expect(internals.currentState).toBe(GAME_STATES.Countdown);
    expect(internals.goose.velocity).toBe(0);
  });

  it('transitions from countdown to active game', async () => {
    const game = await startGame('Петя');
    await pressPlay(game);

    finishCountdown(game);

    expect(accessGame(game).currentState).toBe(GAME_STATES.Game);
  });

  it('pauses active game from pause button', async () => {
    const game = await startActiveGame();
    const { pauseBtn } = accessGame(game);
    getCanvasPointMock.mockReturnValue({
      x: pauseBtn.x + pauseBtn.width / 2,
      y: pauseBtn.y + pauseBtn.height / 2,
    });

    press(game);

    expect(accessGame(game).currentState).toBe(GAME_STATES.Paused);
  });

  it('freezes gameplay while paused', async () => {
    const game = await startActiveGame();
    const internals = accessGame(game);
    const initialFgpos = internals.fgpos;
    const initialY = internals.goose.y;
    internals.currentState = GAME_STATES.Paused;

    runUpdate(game, 5);

    expect(internals.fgpos).toBe(initialFgpos);
    expect(internals.goose.y).toBe(initialY);
  });

  it('resumes game from pause on tap', async () => {
    const game = await startActiveGame();
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Paused;
    getCanvasPointMock.mockReturnValue(null);

    press(game);

    expect(internals.currentState).toBe(GAME_STATES.Game);
  });

  it('renders pause overlay while paused', async () => {
    const game = await startActiveGame();
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Paused;

    render(game);

    expect(drawPauseOverlay).toHaveBeenCalled();
  });

  it('plays countdown tick sound on step change', async () => {
    const game = await startGame('Петя');
    await pressPlay(game);
    soundMocks.play.mockClear();

    for (let frame = 0; frame < 50; frame += 1) {
      runUpdate(game, 1);
    }

    expect(soundMocks.play).toHaveBeenCalledWith('tick');
  });

  it('sets accessibility attributes on canvas', async () => {
    await startGame();

    const canvas = document.querySelector('canvas');

    expect(canvas?.getAttribute('role')).toBe('application');
    expect(canvas?.getAttribute('aria-label')).toContain('Flappy Petya');
    expect(canvas?.tabIndex).toBe(0);
  });

  it('jumps on Space key during active game', async () => {
    const game = await startActiveGame();
    const internals = accessGame(game);
    const velocityBefore = internals.goose.velocity;

    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(internals.goose.velocity).toBe(-GOOSE_JUMP);
    expect(internals.goose.velocity).not.toBe(velocityBefore);
    expect(soundMocks.play).toHaveBeenCalledWith('jump');
  });

  it('toggles pause on P key', async () => {
    const game = await startActiveGame();

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    expect(accessGame(game).currentState).toBe(GAME_STATES.Paused);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    expect(accessGame(game).currentState).toBe(GAME_STATES.Game);
  });

  it('decays shake timer after death', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.shakeTimer = SHAKE_DURATION;

    runUpdate(game, 5);

    expect(internals.shakeTimer).toBe(SHAKE_DURATION - 5);

    runUpdate(game, SHAKE_DURATION);

    expect(internals.shakeTimer).toBe(0);
  });

  it('hides score panel while death animation plays', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Score;
    internals.deathAnimTimer = 10;
    vi.mocked(drawScorePanel).mockClear();

    render(game);

    expect(drawScorePanel).not.toHaveBeenCalled();
  });

  it('passes countdown progress to drawCountdown', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Countdown;
    internals.countdownStep = 1;
    internals.countdownTimer = 22.5;
    vi.mocked(drawCountdown).mockClear();

    render(game);

    expect(drawCountdown).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Number),
      expect.any(Number),
      1,
      0.5,
    );
  });

  it('destroy cancels animation frame loop', async () => {
    const cancelSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
    const game = await startGame();

    game.destroy();

    expect(cancelSpy).toHaveBeenCalledWith(1);
    cancelSpy.mockRestore();
  });

  it('destroy disconnects resize observer', async () => {
    const game = await startGame();

    game.destroy();

    expect(resizeObserverDisconnectMock).toHaveBeenCalled();
  });

  it('destroy unbinds keyboard handler', async () => {
    const game = await startActiveGame();
    const internals = accessGame(game);

    expect(internals.inputBindings?.unbindKeyboard).not.toBeNull();

    game.destroy();

    expect(internals.inputBindings).toBeNull();
  });

  it('destroy removes canvas from document', async () => {
    const game = await startGame();

    expect(document.querySelector('canvas')).not.toBeNull();

    game.destroy();

    expect(document.querySelector('canvas')).toBeNull();
  });

  it('handleBackPress pauses active game and returns from records', async () => {
    const game = await startActiveGame();
    const internals = accessGame(game);

    expect(game.handleBackPress()).toBe(true);
    expect(internals.currentState).toBe(GAME_STATES.Paused);

    internals.currentState = GAME_STATES.Records;
    expect(game.handleBackPress()).toBe(true);
    expect(internals.currentState).toBe(GAME_STATES.Splash);
  });

  it('destroy removes visibilitychange listener', async () => {
    const removeListener = vi.spyOn(document, 'removeEventListener');
    const game = await startGame();

    game.destroy();

    expect(removeListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    );
    removeListener.mockRestore();
  });
});
