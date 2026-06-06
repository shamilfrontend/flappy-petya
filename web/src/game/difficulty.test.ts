import {
  DIFFICULTIES,
  DIFFICULTY_LEVELS,
  getDifficultyById,
} from './difficulty';

describe('getDifficultyById', () => {
  it('returns easy settings for easy id', () => {
    const result = getDifficultyById(DIFFICULTY_LEVELS.Easy);

    expect(result.id).toBe('easy');
    expect(result.label).toBe('Легкий');
    expect(result.pipeGap).toBe(140);
  });

  it('returns medium settings for medium id', () => {
    const result = getDifficultyById(DIFFICULTY_LEVELS.Medium);

    expect(result.id).toBe('medium');
    expect(result.label).toBe('Средний');
    expect(result.pipeGap).toBe(110);
  });

  it('returns hard settings for hard id', () => {
    const result = getDifficultyById(DIFFICULTY_LEVELS.Hard);

    expect(result.id).toBe('hard');
    expect(result.label).toBe('Сложный');
    expect(result).toBe(DIFFICULTIES[2]);
  });

  it('falls back to hard for unknown id', () => {
    const result = getDifficultyById('unknown' as typeof DIFFICULTY_LEVELS.Hard);

    expect(result.id).toBe('hard');
    expect(result).toBe(DIFFICULTIES[2]);
  });
});
