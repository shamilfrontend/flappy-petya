import {
  createDefaultProfile,
  createEmptyBests,
  deduplicateLeaderboardByName,
} from './types';

describe('deduplicateLeaderboardByName', () => {
  it('keeps only the highest score for duplicate names', () => {
    expect(
      deduplicateLeaderboardByName([
        { name: 'ShamilFrontend', level: 'medium', score: 12 },
        { name: 'Псс', level: 'medium', score: 9 },
        { name: 'ShamilFrontend', level: 'medium', score: 1 },
      ]),
    ).toEqual([
      { name: 'ShamilFrontend', level: 'medium', score: 12 },
      { name: 'Псс', level: 'medium', score: 9 },
    ]);
  });

  it('trims names and sorts by score descending', () => {
    expect(
      deduplicateLeaderboardByName([
        { name: '  Bob  ', level: 'easy', score: 5 },
        { name: 'Alice', level: 'easy', score: 10 },
      ]),
    ).toEqual([
      { name: 'Alice', level: 'easy', score: 10 },
      { name: 'Bob', level: 'easy', score: 5 },
    ]);
  });
});

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
