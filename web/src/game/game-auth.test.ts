import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GAME_STATES } from './states';
import type { GameHost } from './game-host';

const prepareGameSessionMock = vi.fn();
const getSavedPlayerNameMock = vi.fn();
const validatePlayerNameForStartMock = vi.fn();
const getTopRecordsByLevelMock = vi.fn();
const resolveLevelTopScoreMock = vi.fn();
const waitForStorageReadyMock = vi.fn();
const ensureRandomPlayerNameForSessionMock = vi.fn();
const announceGameMessageMock = vi.fn();

vi.mock('../lib/storage', () => ({
  prepareGameSession: prepareGameSessionMock,
  getSavedPlayerName: getSavedPlayerNameMock,
  validatePlayerNameForStart: validatePlayerNameForStartMock,
  PLAYER_NAME_VALIDATION_STATUS: { Success: 'success' },
  getTopRecordsByLevel: getTopRecordsByLevelMock,
  resolveLevelTopScore: resolveLevelTopScoreMock,
  waitForStorageReady: waitForStorageReadyMock,
  ensureRandomPlayerNameForSession: ensureRandomPlayerNameForSessionMock,
  NETWORK_TIMEOUT_ERROR_MESSAGE: 'timeout',
}));

vi.mock('../ui/game-announcer', () => ({
  announceGameMessage: announceGameMessageMock,
}));

vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
  callback(0);
  return 0;
});

function createHost(overrides: Partial<GameHost> = {}): GameHost {
  return {
    currentState: GAME_STATES.Splash,
    isStartingGame: false,
    selectedDifficulty: 'medium',
    playerName: '',
    messageOverlay: { show: vi.fn() },
    syncStateFromStorage: vi.fn(),
    layoutUi: vi.fn(),
    viewport: { logicalWidth: 320, logicalHeight: 480 },
    pipes: { reset: vi.fn(), seedInitial: vi.fn() },
    particles: { clear: vi.fn() },
    gooseTrail: { clear: vi.fn() },
    countdownStep: -1,
    countdownTimer: 0,
    score: 0,
    gameFrames: 0,
    hasSavedCurrentScore: false,
    deathAnimTimer: 0,
    shakeTimer: 0,
    isNewBest: false,
    scoreUiTimer: 0,
    isResolvingLevelTop: false,
    levelTopScore: 0,
    ...overrides,
  } as unknown as GameHost;
}

describe('startGameSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prepareGameSessionMock.mockResolvedValue({ ok: true });
    getSavedPlayerNameMock.mockReturnValue('ТестовыйИгрок');
    validatePlayerNameForStartMock.mockResolvedValue({ status: 'success' });
    getTopRecordsByLevelMock.mockReturnValue([]);
    resolveLevelTopScoreMock.mockResolvedValue(0);
    waitForStorageReadyMock.mockResolvedValue(undefined);
    ensureRandomPlayerNameForSessionMock.mockResolvedValue(null);
  });

  it('сначала резолвит имя, затем prepareGameSession', async () => {
    const callOrder: string[] = [];

    getSavedPlayerNameMock.mockImplementation(() => {
      callOrder.push('getSavedPlayerName');
      return 'ТестовыйИгрок';
    });

    validatePlayerNameForStartMock.mockImplementation(async () => {
      callOrder.push('validatePlayerNameForStart');
      return { status: 'success' };
    });

    prepareGameSessionMock.mockImplementation(async () => {
      callOrder.push('prepareGameSession');
      return { ok: true };
    });

    const { startGameSession } = await import('./game-auth');
    const host = createHost();

    await startGameSession(host);

    const prepareIndex = callOrder.indexOf('prepareGameSession');
    const validateIndex = callOrder.indexOf('validatePlayerNameForStart');

    expect(validateIndex).toBeGreaterThanOrEqual(0);
    expect(prepareIndex).toBeGreaterThan(validateIndex);
    expect(host.currentState).toBe(GAME_STATES.Countdown);
  });
});

describe('resolvePlayButtonLabel', () => {
  it('показывает «Загрузка...» при isStartingGame', async () => {
    const { resolvePlayButtonLabel } = await import('./game-labels');
    expect(resolvePlayButtonLabel(false)).toBe('Играть');
    expect(resolvePlayButtonLabel(true)).toBe('Загрузка...');
  });
});
