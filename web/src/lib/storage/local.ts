import type { DifficultyLevel } from '../../game/difficulty';
import {
  TOP_RECORDS_PER_LEVEL,
  type GameRecord,
} from './types';

const PLAYER_NAME_KEY = 'flappy-petya-player-name';
const RECORDS_KEY = 'flappy-petya-records';

export function getLocalPlayerName(): string {
  try {
    const value = localStorage.getItem(PLAYER_NAME_KEY);
    return value?.trim() ?? '';
  } catch {
    return '';
  }
}

export function saveLocalPlayerName(name: string): void {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return;
  }

  try {
    localStorage.setItem(PLAYER_NAME_KEY, trimmedName);
  } catch {
    // private mode or storage disabled
  }
}

export function getLocalRecords(): GameRecord[] {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return pruneRecords(parsed.filter(isGameRecord));
  } catch {
    return [];
  }
}

export function saveLocalRecords(records: GameRecord[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(pruneRecords(records)));
  } catch {
    // private mode or storage disabled
  }
}

export function upsertLocalRecord(
  name: string,
  level: DifficultyLevel,
  score: number,
): GameRecord[] {
  const trimmedName = name.trim();
  if (!trimmedName || score <= 0) {
    return getLocalRecords();
  }

  const records = getLocalRecords();
  const existingIndex = records.findIndex(
    (record) => record.name === trimmedName && record.level === level,
  );

  if (existingIndex >= 0) {
    records[existingIndex].score = Math.max(records[existingIndex].score, score);
  } else {
    records.push({ name: trimmedName, level, score });
  }

  records.sort((a, b) => b.score - a.score);
  const pruned = pruneRecords(records);
  saveLocalRecords(pruned);
  return pruned;
}

export function getLocalPersonalBest(
  name: string,
  level: DifficultyLevel,
): number {
  const trimmedName = name.trim();
  const record = getLocalRecords().find(
    (item) => item.name === trimmedName && item.level === level,
  );

  return record?.score ?? 0;
}

export function getLocalTopRecordsByLevel(
  level: DifficultyLevel,
  limit = TOP_RECORDS_PER_LEVEL,
): GameRecord[] {
  return getLocalRecords()
    .filter((record) => record.level === level)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function isGameRecord(value: unknown): value is GameRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Partial<GameRecord>;
  return (
    typeof record.name === 'string'
    && typeof record.level === 'string'
    && typeof record.score === 'number'
    && record.score >= 0
  );
}

function pruneRecords(records: GameRecord[]): GameRecord[] {
  const levels = new Set(records.map((record) => record.level));

  return [...levels].flatMap((level) =>
    records
      .filter((record) => record.level === level)
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_RECORDS_PER_LEVEL),
  );
}
