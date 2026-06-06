import { TOP_RECORDS_PER_LEVEL } from './types';
import {
  getLocalPersonalBest,
  getLocalPlayerName,
  getLocalRecords,
  getLocalTopRecordsByLevel,
  saveLocalPlayerName,
  upsertLocalRecord,
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

  describe('upsertLocalRecord', () => {
    it('adds new record and sorts by score descending', () => {
      upsertLocalRecord('Alice', 'easy', 10);
      upsertLocalRecord('Bob', 'easy', 20);

      const records = getLocalTopRecordsByLevel('easy');

      expect(records).toEqual([
        { name: 'Bob', level: 'easy', score: 20 },
        { name: 'Alice', level: 'easy', score: 10 },
      ]);
    });

    it('updates existing record with higher score only', () => {
      upsertLocalRecord('Alice', 'easy', 10);
      upsertLocalRecord('Alice', 'easy', 5);
      upsertLocalRecord('Alice', 'easy', 15);

      expect(getLocalPersonalBest('Alice', 'easy')).toBe(15);
    });

    it('ignores invalid name or non-positive score', () => {
      upsertLocalRecord('', 'easy', 10);
      upsertLocalRecord('Alice', 'easy', 0);

      expect(getLocalTopRecordsByLevel('easy')).toEqual([]);
    });

    it('keeps only top records per level', () => {
      for (let score = 1; score <= TOP_RECORDS_PER_LEVEL + 5; score += 1) {
        upsertLocalRecord(`Player${score}`, 'hard', score);
      }

      const records = getLocalTopRecordsByLevel('hard');

      expect(records).toHaveLength(TOP_RECORDS_PER_LEVEL);
      expect(records[0].score).toBe(TOP_RECORDS_PER_LEVEL + 5);
      expect(records.at(-1)?.score).toBe(6);
    });
  });

  describe('getLocalRecords', () => {
    it('returns empty array when storage is empty', () => {
      expect(getLocalRecords()).toEqual([]);
    });

    it('returns empty array for invalid json payload', () => {
      localStorage.setItem('flappy-petya-records', '{not-json');

      expect(getLocalRecords()).toEqual([]);
    });

    it('filters out malformed records', () => {
      localStorage.setItem(
        'flappy-petya-records',
        JSON.stringify([
          { name: 'Alice', level: 'easy', score: 10 },
          { name: 'Bad', level: 'easy', score: -1 },
          { name: 123, level: 'easy', score: 5 },
        ]),
      );

      expect(getLocalRecords()).toEqual([
        { name: 'Alice', level: 'easy', score: 10 },
      ]);
    });
  });
});
