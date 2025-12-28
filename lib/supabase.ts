
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  return (window as any).process?.env?.[key] || (process as any)?.env?.[key] || '';
};

export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('motodash_supabase_url');
  const localKey = localStorage.getItem('motodash_supabase_key');
  
  return {
    url: localUrl || getEnv('SUPABASE_URL'),
    key: localKey || getEnv('SUPABASE_ANON_KEY')
  };
};

export const createSupabaseClient = (url?: string, key?: string): SupabaseClient | null => {
  const config = getSupabaseConfig();
  const finalUrl = url || config.url;
  const finalKey = key || config.key;

  if (finalUrl && finalUrl.startsWith('https://') && finalKey && finalKey.length > 20) {
    return createClient(finalUrl, finalKey);
  }
  return null;
};

// Cliente inicial
export let supabase = createSupabaseClient();

export const updateSupabaseClient = () => {
  supabase = createSupabaseClient();
  return !!supabase;
};

export const isSupabaseConfigured = () => !!supabase;
