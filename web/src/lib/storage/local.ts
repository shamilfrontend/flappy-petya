import type { DifficultyLevel } from '../../game/difficulty';
import { MAX_PLAYER_NAME_LENGTH } from './types';

const PLAYER_NAME_KEY = 'flappy-petya-player-name';
const SELECTED_DIFFICULTY_KEY = 'flappy-petya-selected-difficulty';
const SELECTED_RECORDS_LEVEL_KEY = 'flappy-petya-selected-records-level';

function parseDifficultyLevel(value: string | null): DifficultyLevel | undefined {
  if (value === 'easy' || value === 'medium' || value === 'hard') {
    return value;
  }

  return undefined;
}

function normalizeLocalPlayerName(name: string): string {
  const trimmedName = name.trim();
  if (!trimmedName || trimmedName.length > MAX_PLAYER_NAME_LENGTH) {
    return '';
  }

  return trimmedName;
}

export function getLocalPlayerName(): string {
  try {
    const value = sessionStorage.getItem(PLAYER_NAME_KEY);
    return value ? normalizeLocalPlayerName(value) : '';
  } catch {
    return '';
  }
}

export function saveLocalPlayerName(name: string): void {
  const trimmedName = normalizeLocalPlayerName(name);
  if (!trimmedName) {
    return;
  }

  try {
    sessionStorage.setItem(PLAYER_NAME_KEY, trimmedName);
  } catch {
    // private mode or storage disabled
  }
}

export function clearLocalPlayerName(): void {
  try {
    sessionStorage.removeItem(PLAYER_NAME_KEY);
  } catch {
    // private mode or storage disabled
  }
}

export function getLocalSelectedDifficulty(): DifficultyLevel | undefined {
  try {
    return parseDifficultyLevel(localStorage.getItem(SELECTED_DIFFICULTY_KEY));
  } catch {
    return undefined;
  }
}

export function saveLocalSelectedDifficulty(level: DifficultyLevel): void {
  try {
    localStorage.setItem(SELECTED_DIFFICULTY_KEY, level);
  } catch {
    // private mode or storage disabled
  }
}

export function getLocalSelectedRecordsLevel(): DifficultyLevel | undefined {
  try {
    return parseDifficultyLevel(localStorage.getItem(SELECTED_RECORDS_LEVEL_KEY));
  } catch {
    return undefined;
  }
}

export function saveLocalSelectedRecordsLevel(level: DifficultyLevel): void {
  try {
    localStorage.setItem(SELECTED_RECORDS_LEVEL_KEY, level);
  } catch {
    // private mode or storage disabled
  }
}
