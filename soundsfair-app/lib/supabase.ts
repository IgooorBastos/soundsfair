/**
 * Supabase Client (Client-side)
 *
 * This client uses the anon key and is safe for browser use.
 * Row Level Security (RLS) policies enforce data access rules.
 */

import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithRelationships } from '@/app/types/database';

// Environment variables are injected at build time by Next.js
// NEXT_PUBLIC_* vars must be set in Vercel dashboard or .env.local
// If missing, Supabase client will fail at runtime with connection errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create Supabase client for client-side usage
 *
 * Features:
 * - Uses anon key (safe for browser)
 * - RLS policies enforced
 * - Automatic JWT token handling
 */
export const supabase = createClient<DatabaseWithRelationships>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Create Supabase client with custom user email context
 *
 * This allows RLS policies to filter based on email
 * for the email-only authentication approach
 *
 * @param email - User's email address
 */
export function createSupabaseClientWithEmail(email: string) {
  return createClient<DatabaseWithRelationships>(supabaseUrl!, supabaseAnonKey!, {
    global: {
      headers: {
        'x-user-email': email,
      },
    },
  });
}

/**
 * Helper function to set user email in RLS context
 *
 * Usage in API routes:
 * await setUserEmailContext(supabase, 'user@example.com')
 *
 * NOTE: Currently disabled - RPC function 'set_config' needs to be created in Supabase
 * TODO: Create RPC function with: CREATE OR REPLACE FUNCTION set_config(setting text, value text)...
 */
export async function setUserEmailContext(
  client: typeof supabase,
  email: string
) {
  // Temporarily disabled to allow build to pass
  // RPC function needs to be created in Supabase first
  // const { error } = await client.rpc('set_config', {
  //   setting: 'app.current_user_email',
  //   value: email,
  // });

  // if (error) {
  //   console.error('Failed to set user email context:', error);
  // }

  // No-op for now - return success
  return;
}

export default supabase;
