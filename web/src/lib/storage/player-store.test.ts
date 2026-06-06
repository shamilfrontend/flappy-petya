import { buildProfileFromLocal } from './player-store';
import { createEmptyBests } from './types';

describe('buildProfileFromLocal', () => {
  it('builds profile with name and bests', () => {
    const bests = { easy: 12, medium: 8, hard: 3 };

    expect(buildProfileFromLocal('Петя', bests)).toEqual({
      name: 'Петя',
      bests,
    });
  });

  it('includes selected difficulty when provided', () => {
    const bests = createEmptyBests();

    expect(buildProfileFromLocal('Петя', bests, 'medium')).toEqual({
      name: 'Петя',
      bests,
      selectedDifficulty: 'medium',
    });
  });

  it('creates empty profile shape for new player', () => {
    expect(buildProfileFromLocal('', createEmptyBests())).toEqual({
      name: '',
      bests: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    });
  });
});
