import {
  createDefaultProfile,
  createEmptyBests,
} from './types';

describe('createEmptyBests', () => {
  it('returns zero scores for all difficulty levels', () => {
    expect(createEmptyBests()).toEqual({
      easy: 0,
      medium: 0,
      hard: 0,
    });
  });
});

describe('createDefaultProfile', () => {
  it('creates profile with empty name and zero bests by default', () => {
    expect(createDefaultProfile()).toEqual({
      name: '',
      bests: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    });
  });

  it('creates profile with provided name', () => {
    expect(createDefaultProfile('Петя')).toEqual({
      name: 'Петя',
      bests: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    });
  });
});
