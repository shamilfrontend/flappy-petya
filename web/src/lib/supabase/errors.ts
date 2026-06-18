interface SupabaseErrorLike {
  code?: string;
  message?: string;
  details?: string;
  status?: number;
}

export const SUPABASE_ERROR_CODES = {
  UniqueViolation: '23505',
} as const;

export function isSupabasePermissionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const supabaseError = error as SupabaseErrorLike;
  const code = supabaseError.code ?? '';
  const message = `${supabaseError.message ?? ''} ${supabaseError.details ?? ''}`.toLowerCase();

  return (
    code === '42501'
    || supabaseError.status === 401
    || supabaseError.status === 403
    || message.includes('permission denied')
    || message.includes('row-level security')
  );
}

export function isSupabaseUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const supabaseError = error as SupabaseErrorLike;
  return supabaseError.code === SUPABASE_ERROR_CODES.UniqueViolation;
}
