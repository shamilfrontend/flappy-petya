import { isFirestorePermissionError } from './errors';

describe('isFirestorePermissionError', () => {
  it('detects permission-denied code', () => {
    expect(isFirestorePermissionError({ code: 'permission-denied' })).toBe(true);
  });

  it('detects missing permissions message', () => {
    expect(
      isFirestorePermissionError({
        message: 'Missing or insufficient permissions.',
      }),
    ).toBe(true);
  });

  it('returns false for unrelated errors', () => {
    expect(isFirestorePermissionError(new Error('network failed'))).toBe(false);
    expect(isFirestorePermissionError(null)).toBe(false);
  });
});
