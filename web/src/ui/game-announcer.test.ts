import { announceGameMessage } from './game-announcer';

describe('announceGameMessage', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="game-announcer" aria-live="polite"></div>';
  });

  it('updates announcer text on next animation frame', async () => {
    announceGameMessage('Счёт: 5');

    expect(document.getElementById('game-announcer')?.textContent).toBe('');

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    expect(document.getElementById('game-announcer')?.textContent).toBe('Счёт: 5');
  });

  it('does nothing when announcer element is missing', () => {
    document.body.innerHTML = '';

    expect(() => announceGameMessage('test')).not.toThrow();
  });
});
