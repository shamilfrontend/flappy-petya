interface FirebaseErrorLike {
  code?: string;
  message?: string;
}

export function isFirestorePermissionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const firebaseError = error as FirebaseErrorLike;
  const code = firebaseError.code ?? '';
  const message = firebaseError.message ?? '';

  return (
    code === 'permission-denied'
    || message.includes('Missing or insufficient permissions')
  );
}
