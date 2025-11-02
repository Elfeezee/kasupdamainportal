
import { createBrowserClient } from '@supabase/ssr';

// Read credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key are not set in environment variables.');
}

// Initialize the Supabase client for browser-based operations
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
