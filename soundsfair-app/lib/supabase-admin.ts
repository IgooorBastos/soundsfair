/**
 * Supabase Admin Client (Server-side only)
 *
 * This client uses the service role key and bypasses RLS.
 * NEVER expose this client to the browser.
 * Only use in API routes and server components.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/app/types/database';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

/**
 * Create Supabase admin client for server-side usage
 *
 * WARNING: This client bypasses Row Level Security (RLS).
 * Only use in trusted server-side code.
 *
 * Features:
 * - Service role key (full access)
 * - Bypasses RLS policies
 * - Server-side only
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Helper function to verify admin authentication
 *
 * Checks if the provided JWT token belongs to an admin user
 *
 * @param token - JWT token from Authorization header
 * @returns Admin user object or null
 */
export async function verifyAdminToken(token: string) {
  try {
    // Verify the JWT token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user || !user.email) {
      return null;
    }

    // Check if user is in admin_users table
    const { data: adminUser, error: dbError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (dbError || !adminUser) {
      return null;
    }

    // Update last login timestamp
    await supabaseAdmin
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUser.id);

    return adminUser;
  } catch (error) {
    console.error('Admin token verification failed:', error);
    return null;
  }
}

/**
 * Helper function to create initial admin user
 *
 * This should be run once during setup to create the first admin
 *
 * @param email - Admin email address
 */
export async function createAdminUser(email: string, role: 'admin' | 'super_admin' = 'admin') {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert({
      email,
      role,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create admin user:', error);
    return null;
  }

  return data;
}

/**
 * Helper function to run the expire_old_payments() database function
 *
 * This should be called periodically (e.g., via cron job)
 * to mark expired payments and update question statuses
 */
export async function expireOldPayments() {
  const { error } = await supabaseAdmin.rpc('expire_old_payments');

  if (error) {
    console.error('Failed to expire old payments:', error);
    return false;
  }

  return true;
}

/**
 * Helper function to get question statistics
 *
 * Returns aggregate stats for the admin dashboard
 */
export async function getQuestionStats() {
  const { data, error } = await supabaseAdmin.rpc('get_question_stats');

  if (error) {
    console.error('Failed to get question stats:', error);
    return null;
  }

  return data?.[0] || null;
}

export default supabaseAdmin;
