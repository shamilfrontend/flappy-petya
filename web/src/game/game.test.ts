const nameInputPrompt = vi.hoisted(() => vi.fn());

const storageMocks = vi.hoisted(() => ({
  getSavedPlayerName: vi.fn(() => ''),
  getSelectedDifficulty: vi.fn((): undefined => undefined),
  getPersonalBest: vi.fn(() => 0),
  getTopRecordsByLevel: vi.fn(() => []),
  initStorage: vi.fn(() => Promise.resolve()),
  isLeaderboardLoading: vi.fn(() => false),
  refreshLeaderboard: vi.fn(() => Promise.resolve()),
  savePlayerName: vi.fn(),
  saveRecord: vi.fn(),
  saveSelectedDifficulty: vi.fn(),
}));

const getCanvasPointMock = vi.hoisted(() => vi.fn());

vi.mock('../ui/name-input', () => ({
  NameInputOverlay: class {
    prompt = nameInputPrompt;

    hide = vi.fn();
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

vi.mock('../graphics/ui-text', () => ({
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
}));

vi.mock('../graphics/sprites', () => ({
  initSprites: vi.fn(() => ({
    goose: [{ draw: vi.fn() }, { draw: vi.fn() }, { draw: vi.fn() }],
    petyaSplash: { draw: vi.fn() },
  })),
}));

vi.mock('../input/pointer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../input/pointer')>();

  return {
    ...actual,
    getCanvasPoint: getCanvasPointMock,
  };
});

import { hideAppLoader } from '../ui/app-loader';
import {
  getSavedPlayerName,
  getSelectedDifficulty,
  initStorage,
  refreshLeaderboard,
  savePlayerName,
  saveRecord,
  saveSelectedDifficulty,
} from '../lib/storage';
import { GOOSE_JUMP } from './config';
import { DIFFICULTIES, DIFFICULTY_LEVELS } from './difficulty';
import { Game } from './game';
import { GAME_STATES } from './states';

interface GamePrivate {
  currentState: typeof GAME_STATES[keyof typeof GAME_STATES];
  score: number;
  playerName: string;
  hasSavedCurrentScore: boolean;
  personalBest: number;
  selectedDifficulty: typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];
  goose: { velocity: number; y: number };
  onPress: (evt: MouseEvent) => void;
  update: (dt: number) => void;
}

function accessGame(game: Game): GamePrivate {
  return game as unknown as GamePrivate;
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
    vi.stubGlobal('alert', vi.fn());
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
    vi.stubGlobal('ResizeObserver', class MockResizeObserver {
      observe = vi.fn();

      disconnect = vi.fn();
    });
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));

    vi.clearAllMocks();
    nameInputPrompt.mockResolvedValue({ name: 'Петя', confirmed: true });
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
    accessGame(game).onPress({
      clientX: 0,
      clientY: 0,
      cancelable: true,
      preventDefault: vi.fn(),
    } as unknown as MouseEvent);
  }

  function runUpdate(game: Game, dt = 1): void {
    accessGame(game).update(dt);
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

  it('starts game immediately when player name already exists', async () => {
    const game = await startGame('Петя');
    getCanvasPointMock.mockReturnValue({ x: 160, y: 222 });

    press(game);

    expect(accessGame(game).currentState).toBe(GAME_STATES.Game);
    expect(savePlayerName).toHaveBeenCalledWith('Петя');
    expect(nameInputPrompt).not.toHaveBeenCalled();
  });

  it('prompts for name before starting game', async () => {
    const game = await startGame();
    getCanvasPointMock.mockReturnValue({ x: 160, y: 222 });
    nameInputPrompt.mockResolvedValueOnce({ name: 'Новый', confirmed: true });

    press(game);

    await vi.waitFor(() => {
      expect(accessGame(game).currentState).toBe(GAME_STATES.Game);
    });

    expect(nameInputPrompt).toHaveBeenCalledOnce();
    expect(accessGame(game).playerName).toBe('Новый');
    expect(savePlayerName).toHaveBeenCalledWith('Новый');
  });

  it('does not start game when name prompt is cancelled', async () => {
    const game = await startGame();
    getCanvasPointMock.mockReturnValue({ x: 160, y: 222 });
    nameInputPrompt.mockResolvedValueOnce({ name: 'Петя', confirmed: false });

    press(game);

    await vi.waitFor(() => {
      expect(nameInputPrompt).toHaveBeenCalled();
    });

    expect(accessGame(game).currentState).toBe(GAME_STATES.Splash);
  });

  it('opens records screen and refreshes leaderboard', async () => {
    const game = await startGame();
    getCanvasPointMock.mockReturnValue({ x: 160, y: 337 });

    press(game);

    expect(accessGame(game).currentState).toBe(GAME_STATES.Records);
    expect(refreshLeaderboard).toHaveBeenCalledWith(DIFFICULTY_LEVELS.Medium);
  });

  it('returns to splash from records on back button', async () => {
    const game = await startGame();
    getCanvasPointMock.mockReturnValueOnce({ x: 160, y: 337 });
    press(game);
    getCanvasPointMock.mockReturnValueOnce({ x: 160, y: 442 });

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
    getCanvasPointMock.mockReturnValueOnce({ x: 160, y: 222 });
    press(game);

    const internals = accessGame(game);
    expect(internals.currentState).toBe(GAME_STATES.Game);

    getCanvasPointMock.mockReturnValue(null);
    press(game);

    expect(internals.goose.velocity).toBe(-GOOSE_JUMP);
  });

  it('saves score once when entering score screen', async () => {
    const game = await startGame('Петя');
    const internals = accessGame(game);
    internals.currentState = GAME_STATES.Score;
    internals.score = 7;

    runUpdate(game, 1);

    expect(saveRecord).toHaveBeenCalledWith('Петя', DIFFICULTY_LEVELS.Medium, 7);
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
    getCanvasPointMock.mockReturnValueOnce({ x: 160, y: 222 });
    press(game);

    const internals = accessGame(game);
    internals.goose.y = 100;

    for (let frame = 0; frame < 500; frame += 1) {
      runUpdate(game, 1);

      if (internals.currentState === GAME_STATES.Score) {
        break;
      }
    }

    expect(internals.currentState).toBe(GAME_STATES.Score);
  });

  it('edits player name from splash screen', async () => {
    const game = await startGame('Петя');
    nameInputPrompt.mockResolvedValueOnce({ name: 'Вася', confirmed: true });
    getCanvasPointMock.mockReturnValue({ x: 160, y: 389 });

    press(game);

    await vi.waitFor(() => {
      expect(accessGame(game).playerName).toBe('Вася');
    });

    expect(nameInputPrompt).toHaveBeenCalledWith('Петя', { submitLabel: 'Сохранить' });
    expect(savePlayerName).toHaveBeenCalledWith('Вася');
  });

  it('keeps player name when edit prompt is cancelled', async () => {
    const game = await startGame('Петя');
    nameInputPrompt.mockResolvedValueOnce({ name: 'Вася', confirmed: false });
    getCanvasPointMock.mockReturnValue({ x: 160, y: 389 });

    press(game);

    await vi.waitFor(() => {
      expect(nameInputPrompt).toHaveBeenCalled();
    });

    expect(accessGame(game).playerName).toBe('Петя');
    expect(savePlayerName).not.toHaveBeenCalledWith('Вася');
  });

  it('switches records tab and refreshes leaderboard', async () => {
    const game = await startGame();
    getCanvasPointMock.mockReturnValueOnce({ x: 160, y: 337 });
    press(game);
    vi.mocked(refreshLeaderboard).mockClear();
    getCanvasPointMock.mockReturnValueOnce({ x: 53, y: 85 });

    press(game);

    expect(accessGame(game).currentState).toBe(GAME_STATES.Records);
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
    expect(saveRecord).toHaveBeenCalledWith('Петя', DIFFICULTY_LEVELS.Medium, 12);
  });
});
