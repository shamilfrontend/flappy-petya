import { hideAppLoader } from './app-loader';

describe('hideAppLoader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="app-loader" aria-busy="true"></div>';
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('marks loader as hidden and removes it after fallback timeout', () => {
    hideAppLoader();

    const loader = document.getElementById('app-loader');
    expect(loader?.classList.contains('app-loader--hidden')).toBe(true);
    expect(loader?.getAttribute('aria-busy')).toBe('false');

    vi.advanceTimersByTime(400);

    expect(document.getElementById('app-loader')).toBeNull();
  });

  it('removes loader immediately on transition end', () => {
    hideAppLoader();

    const loader = document.getElementById('app-loader');
    loader?.dispatchEvent(new Event('transitionend'));

    expect(document.getElementById('app-loader')).toBeNull();
  });

  it('does nothing when loader element is absent', () => {
    document.body.innerHTML = '';

    expect(() => hideAppLoader()).not.toThrow();
  });
});
