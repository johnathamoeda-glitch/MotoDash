
import { createClient } from '@supabase/supabase-js';

// Acesso seguro ao process.env para evitar erros caso o shim falhe por milissegundos
const getEnv = (key: string): string => {
  try {
    return (window as any).process?.env?.[key] || (process as any)?.env?.[key] || '';
  } catch {
    return '';
  }
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

export const isSupabaseConfigured = supabaseUrl.length > 5 && supabaseAnonKey.length > 10;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
