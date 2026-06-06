const { getDoc, getDocs, setDoc } = vi.hoisted(() => ({
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((_db, ...path) => path.join('/')),
  doc: vi.fn((_db, ...path) => path.join('/')),
  getDoc,
  getDocs,
  setDoc,
  limit: vi.fn((value) => ({ type: 'limit', value })),
  orderBy: vi.fn((field, direction) => ({ type: 'orderBy', field, direction })),
  query: vi.fn((...args) => args),
  serverTimestamp: vi.fn(() => ({ type: 'timestamp' })),
}));

import {
  fetchLeaderboard,
  updateLeaderboardName,
  upsertLeaderboardEntry,
} from './records-store';

describe('records-store', () => {
  const db = {} as never;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchLeaderboard', () => {
    it('maps valid firestore docs to game records', async () => {
      getDocs.mockResolvedValue({
        docs: [
          { data: () => ({ name: ' Alice ', score: 10 }) },
          { data: () => ({ name: 'Bob', score: 20 }) },
          { data: () => ({ name: '', score: 5 }) },
          { data: () => ({ name: 'Bad', score: 'x' }) },
        ],
      });

      await expect(fetchLeaderboard(db, 'easy')).resolves.toEqual([
        { name: 'Bob', level: 'easy', score: 20 },
        { name: 'Alice', level: 'easy', score: 10 },
      ]);
    });

    it('respects maxEntries limit argument', async () => {
      getDocs.mockResolvedValue({ docs: [] });

      await fetchLeaderboard(db, 'hard', 5);

      expect(getDocs).toHaveBeenCalledOnce();
    });

    it('deduplicates records with the same player name', async () => {
      getDocs.mockResolvedValue({
        docs: [
          { data: () => ({ name: 'ShamilFrontend', score: 12 }) },
          { data: () => ({ name: 'Псс', score: 9 }) },
          { data: () => ({ name: 'ShamilFrontend', score: 1 }) },
        ],
      });

      await expect(fetchLeaderboard(db, 'medium')).resolves.toEqual([
        { name: 'ShamilFrontend', level: 'medium', score: 12 },
        { name: 'Псс', level: 'medium', score: 9 },
      ]);
    });
  });

  describe('upsertLeaderboardEntry', () => {
    it('writes only improved score', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ score: 15 }),
      });

      await upsertLeaderboardEntry(db, 'uid-1', 'medium', 'Петя', 10);

      expect(setDoc).toHaveBeenCalledWith(
        'leaderboard/medium/scores/uid-1',
        {
          name: 'Петя',
          score: 15,
          updatedAt: { type: 'timestamp' },
        },
        { merge: true },
      );
    });

    it('creates entry when score is higher than stored value', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ score: 5 }),
      });

      await upsertLeaderboardEntry(db, 'uid-1', 'easy', 'Петя', 12);

      expect(setDoc).toHaveBeenCalledWith(
        'leaderboard/easy/scores/uid-1',
        expect.objectContaining({ score: 12 }),
        { merge: true },
      );
    });

    it('skips write for non-positive score', async () => {
      getDoc.mockResolvedValue({
        exists: () => false,
        data: () => ({}),
      });

      await upsertLeaderboardEntry(db, 'uid-1', 'easy', 'Петя', 0);

      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe('updateLeaderboardName', () => {
    it('updates name only for existing level documents', async () => {
      getDoc
        .mockResolvedValueOnce({ exists: () => true, data: () => ({ score: 1 }) })
        .mockResolvedValueOnce({ exists: () => false, data: () => ({}) })
        .mockResolvedValueOnce({ exists: () => true, data: () => ({ score: 3 }) });

      await updateLeaderboardName(db, 'uid-1', 'Новое имя');

      expect(setDoc).toHaveBeenCalledTimes(2);
      expect(setDoc).toHaveBeenCalledWith(
        expect.any(String),
        {
          name: 'Новое имя',
          updatedAt: { type: 'timestamp' },
        },
        { merge: true },
      );
    });
  });
});
