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
    pipeGap: 145,
    pipeSpeed: PIPE_SPEED * 0.74,
    fgScrollSpeed: FG_SCROLL_SPEED * 0.74,
  },
  {
    id: DIFFICULTY_LEVELS.Medium,
    label: 'Средний',
    pipeGap: 122,
    pipeSpeed: PIPE_SPEED * 0.84,
    fgScrollSpeed: FG_SCROLL_SPEED * 0.84,
  },
  {
    id: DIFFICULTY_LEVELS.Hard,
    label: 'Сложный',
    pipeGap: PIPE_GAP - 4,
    pipeSpeed: PIPE_SPEED * 0.96,
    fgScrollSpeed: FG_SCROLL_SPEED * 0.96,
  },
];

export function getDifficultyById(id: DifficultyLevel): DifficultySettings {
  const difficulty = DIFFICULTIES.find((item) => item.id === id);
  return difficulty ?? DIFFICULTIES[2];
}
