import {
  getLocalPlayerName,
  saveLocalPlayerName,
} from './local';

describe('local storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveLocalPlayerName / getLocalPlayerName', () => {
    it('saves and returns trimmed player name', () => {
      saveLocalPlayerName('  Петя  ');

      expect(getLocalPlayerName()).toBe('Петя');
    });

    it('does not save empty name', () => {
      saveLocalPlayerName('   ');

      expect(getLocalPlayerName()).toBe('');
    });
  });
});
