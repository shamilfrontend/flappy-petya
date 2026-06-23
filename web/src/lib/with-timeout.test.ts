import { describe, expect, it, vi } from 'vitest';
import {
  NETWORK_TIMEOUT_ERROR_MESSAGE,
  TimeoutError,
  withTimeout,
} from './with-timeout';

describe('withTimeout', () => {
  it('резолвит promise до таймаута', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 100)).resolves.toBe('ok');
  });

  it('отклоняет promise по таймауту', async () => {
    vi.useFakeTimers();

    const pending = withTimeout(
      new Promise<string>(() => {}),
      50,
      NETWORK_TIMEOUT_ERROR_MESSAGE,
    );

    vi.advanceTimersByTime(50);

    await expect(pending).rejects.toBeInstanceOf(TimeoutError);
    vi.useRealTimers();
  });
});
