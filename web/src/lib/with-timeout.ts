export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export const NETWORK_TIMEOUT_MS = 10_000;

export const NETWORK_TIMEOUT_ERROR_MESSAGE =
  'Не удалось подключиться к серверу. Проверьте интернет и попробуйте снова.';

export function isTimeoutError(error: unknown): boolean {
  return error instanceof TimeoutError;
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message = NETWORK_TIMEOUT_ERROR_MESSAGE,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(message));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}
