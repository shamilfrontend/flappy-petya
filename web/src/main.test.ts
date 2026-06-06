const startMock = vi.hoisted(() => vi.fn());

vi.mock('./game/game', () => ({
  Game: class {
    start = startMock;
  },
}));

describe('main bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
    startMock.mockClear();
  });

  it('starts the game without throwing', async () => {
    await expect(import('./main')).resolves.toBeDefined();
    expect(startMock).toHaveBeenCalledOnce();
  });
});
