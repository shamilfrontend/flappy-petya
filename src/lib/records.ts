import type { DifficultyLevel } from '../game/difficulty';

export interface GameRecord {
  name: string;
  level: DifficultyLevel;
  score: number;
}

const STORAGE_KEY = 'flappy-petr-records';
export const TOP_RECORDS_PER_LEVEL = 10;

export function getRecords(): GameRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

export function getTopRecordsByLevel(
  level: DifficultyLevel,
  limit = TOP_RECORDS_PER_LEVEL,
): GameRecord[] {
  return getRecords()
    .filter((record) => record.level === level)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function saveRecord(
  name: string,
  level: DifficultyLevel,
  score: number,
): void {
  const trimmedName = name.trim();
  if (!trimmedName || score <= 0) {
    return;
  }

  const records = getRecords();
  const existingIndex = records.findIndex(
    (record) => record.name === trimmedName && record.level === level,
  );

  if (existingIndex >= 0) {
    records[existingIndex].score = Math.max(records[existingIndex].score, score);
  } else {
    records.push({ name: trimmedName, level, score });
  }

  records.sort((a, b) => b.score - a.score);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pruneRecords(records)));
  } catch {
    // private mode or storage disabled
  }
}

export function getPersonalBest(
  name: string,
  level: DifficultyLevel,
): number {
  const trimmedName = name.trim();
  const record = getRecords().find(
    (item) => item.name === trimmedName && item.level === level,
  );

  return record?.score ?? 0;
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
