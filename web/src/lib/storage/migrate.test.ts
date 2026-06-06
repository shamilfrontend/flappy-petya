const {
  fetchPlayerProfile,
  savePlayerProfile,
} = vi.hoisted(() => ({
  fetchPlayerProfile: vi.fn(),
  savePlayerProfile: vi.fn(),
}));

const { upsertLeaderboardEntry } = vi.hoisted(() => ({
  upsertLeaderboardEntry: vi.fn(),
}));

vi.mock('./player-store', () => ({
  buildProfileFromLocal: (
    name: string,
    bests: Record<string, number>,
    selectedDifficulty?: string,
  ) => ({
    name,
    bests,
    selectedDifficulty,
  }),
  fetchPlayerProfile,
  savePlayerProfile,
}));

vi.mock('./records-store', () => ({
  upsertLeaderboardEntry,
}));

import { migrateLocalDataToFirestore } from './migrate';

describe('migrateLocalDataToFirestore', () => {
  const db = {} as never;
  const uid = 'uid-1';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    savePlayerProfile.mockResolvedValue(undefined);
    upsertLeaderboardEntry.mockResolvedValue(undefined);
  });

  it('returns existing profile when firestore already has a name', async () => {
    const existingProfile = {
      name: 'Existing',
      bests: { easy: 1, medium: 2, hard: 3 },
    };
    fetchPlayerProfile.mockResolvedValue(existingProfile);

    await expect(migrateLocalDataToFirestore(db, uid)).resolves.toBe(existingProfile);

    expect(savePlayerProfile).not.toHaveBeenCalled();
    expect(upsertLeaderboardEntry).not.toHaveBeenCalled();
  });

  it('migrates local player name and bests to firestore', async () => {
    fetchPlayerProfile.mockResolvedValue(null);
    localStorage.setItem('flappy-petya-player-name', 'Петя');
    localStorage.setItem(
      'flappy-petya-records',
      JSON.stringify([
        { name: 'Петя', level: 'easy', score: 12 },
        { name: 'Петя', level: 'hard', score: 7 },
      ]),
    );

    await expect(migrateLocalDataToFirestore(db, uid)).resolves.toEqual({
      name: 'Петя',
      bests: { easy: 12, medium: 0, hard: 7 },
    });

    expect(savePlayerProfile).toHaveBeenCalledWith(
      db,
      uid,
      {
        name: 'Петя',
        bests: { easy: 12, medium: 0, hard: 7 },
      },
    );
    expect(upsertLeaderboardEntry).toHaveBeenCalledTimes(2);
    expect(upsertLeaderboardEntry).toHaveBeenCalledWith(
      db,
      uid,
      'easy',
      'Петя',
      12,
    );
  });

  it('saves empty profile when local name is missing', async () => {
    fetchPlayerProfile.mockResolvedValue(null);

    await expect(migrateLocalDataToFirestore(db, uid)).resolves.toEqual({
      name: '',
      bests: { easy: 0, medium: 0, hard: 0 },
    });

    expect(savePlayerProfile).toHaveBeenCalledWith(
      db,
      uid,
      {
        name: '',
        bests: { easy: 0, medium: 0, hard: 0 },
      },
    );
    expect(upsertLeaderboardEntry).not.toHaveBeenCalled();
  });

  it('does not upload leaderboard entries for other players', async () => {
    fetchPlayerProfile.mockResolvedValue(null);
    localStorage.setItem('flappy-petya-player-name', 'Петя');
    localStorage.setItem(
      'flappy-petya-records',
      JSON.stringify([
        { name: 'Петя', level: 'easy', score: 5 },
        { name: 'Alice', level: 'easy', score: 99 },
      ]),
    );

    await migrateLocalDataToFirestore(db, uid);

    expect(upsertLeaderboardEntry).toHaveBeenCalledOnce();
    expect(upsertLeaderboardEntry).toHaveBeenCalledWith(
      db,
      uid,
      'easy',
      'Петя',
      5,
    );
  });
});
