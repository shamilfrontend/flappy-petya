import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig, isSupabaseConfigured } from './config';

let supabaseClient: SupabaseClient | null = null;

export function isSupabaseEnabled(): boolean {
  return isSupabaseConfigured();
}

export function getSupabaseClient(): SupabaseClient | null {
  return supabaseClient;
}

export function initSupabaseClient(): void {
  if (!isSupabaseConfigured() || supabaseClient) {
    return;
  }

  const { url, anonKey } = getSupabaseConfig();

  supabaseClient = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
}
