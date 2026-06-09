/**
 * @vitest-environment node
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

const PROJECT_ID = 'flappy-petya-rules-test';
const RULES_PATH = resolve(process.cwd(), '../firestore.rules');
const rules = readFileSync(RULES_PATH, 'utf8');

function parseEmulatorConfig(): { host: string; port: number } | null {
  const raw = process.env.FIRESTORE_EMULATOR_HOST;
  if (!raw) {
    return null;
  }

  const [host, portValue] = raw.split(':');
  const port = Number(portValue);
  if (!host || !Number.isFinite(port)) {
    return null;
  }

  return { host, port };
}

const emulatorConfig = parseEmulatorConfig();

let testEnv: RulesTestEnvironment | undefined;

function authedDb(uid = 'user-1') {
  if (!testEnv) {
    throw new Error('Rules test environment is not initialized');
  }

  return testEnv.authenticatedContext(uid, {
    firebase: { sign_in_provider: 'anonymous' },
  }).firestore();
}

async function startSession(
  db: ReturnType<typeof authedDb>,
  uid: string,
  level: 'easy' | 'medium' | 'hard' = 'hard',
): Promise<void> {
  await assertSucceeds(
    setDoc(doc(db, 'gameSessions', uid), {
      level,
      status: 'active',
      startedAt: serverTimestamp(),
      completedAt: null,
    }),
  );
}

describe.skipIf(!emulatorConfig)('firestore.rules anti-cheat', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules,
        host: emulatorConfig!.host,
        port: emulatorConfig!.port,
      },
    });
  });

  beforeEach(async () => {
    await testEnv!.clearFirestore();
  });

  afterAll(async () => {
    await testEnv?.cleanup();
  });

  it('allows creating an active game session', async () => {
    const db = authedDb();

    await expect(startSession(db, 'user-1', 'medium')).resolves.toBeUndefined();
  });

  it('rejects leaderboard score without active session', async () => {
    const db = authedDb();

    await expect(
      assertFails(
        setDoc(doc(db, 'leaderboard', 'hard', 'scores', 'user-1'), {
          name: 'Cheater',
          score: 10,
          gameFrames: 1330,
          updatedAt: serverTimestamp(),
        }),
      ),
    ).resolves.toBeUndefined();
  });

  it('rejects leaderboard score with invalid gameFrames', async () => {
    const db = authedDb('user-2');
    await startSession(db, 'user-2', 'hard');

    await new Promise((resolveDelay) => {
      setTimeout(resolveDelay, 4100);
    });

    await expect(
      assertFails(
        setDoc(doc(db, 'leaderboard', 'hard', 'scores', 'user-2'), {
          name: 'Cheater',
          score: 5,
          gameFrames: 1,
          updatedAt: serverTimestamp(),
        }),
      ),
    ).resolves.toBeUndefined();
  });

  it('rejects instant high score after session start', async () => {
    const db = authedDb('user-3');
    await startSession(db, 'user-3', 'hard');

    await expect(
      assertFails(
        setDoc(doc(db, 'leaderboard', 'hard', 'scores', 'user-3'), {
          name: 'Cheater',
          score: 9999,
          gameFrames: 1_199_890,
          updatedAt: serverTimestamp(),
        }),
      ),
    ).resolves.toBeUndefined();
  });

  it('allows valid score after minimum play time', async () => {
    const db = authedDb('user-4');
    await startSession(db, 'user-4', 'easy');

    await new Promise((resolveDelay) => {
      setTimeout(resolveDelay, 4100);
    });

    await expect(
      assertSucceeds(
        setDoc(doc(db, 'leaderboard', 'easy', 'scores', 'user-4'), {
          name: 'Player',
          score: 1,
          gameFrames: 250,
          updatedAt: serverTimestamp(),
        }),
      ),
    ).resolves.toBeUndefined();
  });

  it('rejects invalid leaderboard level', async () => {
    const db = authedDb('user-5');
    await startSession(db, 'user-5', 'hard');

    await new Promise((resolveDelay) => {
      setTimeout(resolveDelay, 4100);
    });

    await expect(
      assertFails(
        setDoc(doc(db, 'leaderboard', 'insane', 'scores', 'user-5'), {
          name: 'Player',
          score: 1,
          gameFrames: 250,
          updatedAt: serverTimestamp(),
        }),
      ),
    ).resolves.toBeUndefined();
  });

  it('rejects player bests above leaderboard score', async () => {
    const db = authedDb('user-6');
    await startSession(db, 'user-6', 'easy');

    await new Promise((resolveDelay) => {
      setTimeout(resolveDelay, 4100);
    });

    await expect(
      assertSucceeds(
        setDoc(doc(db, 'leaderboard', 'easy', 'scores', 'user-6'), {
          name: 'Player',
          score: 3,
          gameFrames: 490,
          updatedAt: serverTimestamp(),
        }),
      ),
    ).resolves.toBeUndefined();

    await expect(
      assertFails(
        setDoc(
          doc(db, 'players', 'user-6'),
          {
            name: 'Player',
            bests: { easy: 10, medium: 0, hard: 0 },
            selectedDifficulty: 'easy',
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ),
    ).resolves.toBeUndefined();
  });
});
