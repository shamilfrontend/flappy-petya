export interface SupabaseWebConfig {
  url: string;
  anonKey: string;
}

function readEnv(key: keyof ImportMetaEnv): string {
  return import.meta.env[key]?.trim() ?? '';
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    readEnv('VITE_SUPABASE_URL')
    && readEnv('VITE_SUPABASE_ANON_KEY'),
  );
}

export function getSupabaseConfig(): SupabaseWebConfig {
  return {
    url: readEnv('VITE_SUPABASE_URL'),
    anonKey: readEnv('VITE_SUPABASE_ANON_KEY'),
  };
}
