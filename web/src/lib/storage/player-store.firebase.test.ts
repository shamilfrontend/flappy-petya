const { getDoc, setDoc } = vi.hoisted(() => ({
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn((_db, ...path) => path.join('/')),
  getDoc,
  setDoc,
  serverTimestamp: vi.fn(() => ({ type: 'timestamp' })),
}));

import {
  fetchPlayerProfile,
  savePlayerProfile,
  updatePlayerBest,
  updatePlayerName,
} from './player-store';
import { createDefaultProfile, createEmptyBests } from './types';

describe('player-store firebase API', () => {
  const db = {} as never;
  const uid = 'user-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPlayerProfile', () => {
    it('returns null when document does not exist', async () => {
      getDoc.mockResolvedValue({ exists: () => false });

      await expect(fetchPlayerProfile(db, uid)).resolves.toBeNull();
    });

    it('parses profile with bests and selected difficulty', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          name: ' Петя ',
          bests: { easy: 1, medium: 2, hard: 3 },
          selectedDifficulty: 'hard',
        }),
      });

      await expect(fetchPlayerProfile(db, uid)).resolves.toEqual({
        name: 'Петя',
        bests: { easy: 1, medium: 2, hard: 3 },
        selectedDifficulty: 'hard',
      });
    });

    it('ignores invalid bests and difficulty values', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          name: 123,
          bests: { easy: 'x', medium: null },
          selectedDifficulty: 'insane',
        }),
      });

      await expect(fetchPlayerProfile(db, uid)).resolves.toEqual({
        name: '',
        bests: createEmptyBests(),
      });
    });
  });

  describe('savePlayerProfile', () => {
    it('writes profile fields to firestore', async () => {
      const profile = {
        ...createDefaultProfile('Петя'),
        selectedDifficulty: 'easy' as const,
      };

      await savePlayerProfile(db, uid, profile);

      expect(setDoc).toHaveBeenCalledWith(
        'players/user-1',
        {
          name: 'Петя',
          bests: createEmptyBests(),
          selectedDifficulty: 'easy',
          updatedAt: { type: 'timestamp' },
        },
        { merge: true },
      );
    });
  });

  describe('updatePlayerName', () => {
    it('returns updated profile and persists it', async () => {
      const currentProfile = createDefaultProfile('Старое');

      await expect(updatePlayerName(db, uid, 'Новое', currentProfile)).resolves.toEqual({
        name: 'Новое',
        bests: createEmptyBests(),
      });

      expect(setDoc).toHaveBeenCalledOnce();
    });
  });

  describe('updatePlayerBest', () => {
    it('keeps higher score for difficulty level', async () => {
      const currentProfile = {
        ...createDefaultProfile('Петя'),
        bests: { easy: 10, medium: 0, hard: 0 },
      };

      await expect(
        updatePlayerBest(db, uid, 'easy', 7, currentProfile),
      ).resolves.toEqual({
        name: 'Петя',
        bests: { easy: 10, medium: 0, hard: 0 },
      });

      await expect(
        updatePlayerBest(db, uid, 'easy', 15, currentProfile),
      ).resolves.toEqual({
        name: 'Петя',
        bests: { easy: 15, medium: 0, hard: 0 },
      });
    });
  });
});
