import {
  FG_SCROLL_SPEED,
  PIPE_GAP,
  PIPE_SPEED,
} from './config';

export const DIFFICULTY_LEVELS = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
} as const;

export type DifficultyLevel =
  (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];

export interface DifficultySettings {
  id: DifficultyLevel;
  label: string;
  pipeGap: number;
  pipeSpeed: number;
  fgScrollSpeed: number;
}

export const DIFFICULTIES: DifficultySettings[] = [
  {
    id: DIFFICULTY_LEVELS.Easy,
    label: 'Легкий',
    pipeGap: 140,
    pipeSpeed: PIPE_SPEED / 2,
    fgScrollSpeed: FG_SCROLL_SPEED / 2,
  },
  {
    id: DIFFICULTY_LEVELS.Medium,
    label: 'Средний',
    pipeGap: 110,
    pipeSpeed: PIPE_SPEED / 1.5,
    fgScrollSpeed: FG_SCROLL_SPEED / 1.5,
  },
  {
    id: DIFFICULTY_LEVELS.Hard,
    label: 'Сложный',
    pipeGap: PIPE_GAP,
    pipeSpeed: PIPE_SPEED,
    fgScrollSpeed: FG_SCROLL_SPEED,
  },
];

export function getDifficultyById(id: DifficultyLevel): DifficultySettings {
  const difficulty = DIFFICULTIES.find((item) => item.id === id);
  return difficulty ?? DIFFICULTIES[2];
}
