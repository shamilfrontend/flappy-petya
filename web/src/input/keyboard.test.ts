import { bindGameKeyboard, type KeyboardAction } from './keyboard';

function createActions(overrides: Partial<KeyboardAction> = {}): KeyboardAction {
  return {
    jump: vi.fn(),
    pause: vi.fn(),
    canJump: () => true,
    canPause: () => true,
    ...overrides,
  };
}

describe('bindGameKeyboard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('triggers jump on Space and Enter when allowed', () => {
    const actions = createActions();
    const unbind = bindGameKeyboard(actions);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(actions.jump).toHaveBeenCalledTimes(2);
    expect(actions.pause).not.toHaveBeenCalled();
    unbind();
  });

  it('triggers pause on P and Escape when allowed', () => {
    const actions = createActions();
    const unbind = bindGameKeyboard(actions);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(actions.pause).toHaveBeenCalledTimes(2);
    expect(actions.jump).not.toHaveBeenCalled();
    unbind();
  });

  it('ignores jump when canJump returns false', () => {
    const actions = createActions({ canJump: () => false });
    const unbind = bindGameKeyboard(actions);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(actions.jump).not.toHaveBeenCalled();
    unbind();
  });

  it('ignores pause when canPause returns false', () => {
    const actions = createActions({ canPause: () => false });
    const unbind = bindGameKeyboard(actions);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));

    expect(actions.pause).not.toHaveBeenCalled();
    unbind();
  });

  it('removes listener on unbind', () => {
    const actions = createActions();
    const unbind = bindGameKeyboard(actions);

    unbind();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    expect(actions.jump).not.toHaveBeenCalled();
  });
});
