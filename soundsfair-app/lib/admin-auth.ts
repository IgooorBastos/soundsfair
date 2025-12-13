/**
 * Admin Authentication Helper
 *
 * Simple admin authentication using environment variable for MVP
 * Can be upgraded to Supabase Auth or JWT tokens later
 */

import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase-admin';

// ============================================================================
// CONFIGURATION
// ============================================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change_this_password';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bitcoinnalata@proton.me';
const ADMIN_SESSION_COOKIE = 'soundsfair_admin_session';

// ============================================================================
// TYPES
// ============================================================================

export interface AdminSession {
  email: string;
  role: 'admin' | 'super_admin';
  authenticated: boolean;
}

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<{ valid: boolean; role?: 'admin' | 'super_admin' }> {
  // For MVP, use simple environment variable check
  // TODO: Upgrade to Supabase Auth or proper JWT authentication

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return { valid: true, role: 'super_admin' };
  }

  // Check against admin_users table
  const { data: adminUser } = await (supabaseAdmin as any)
    .from('admin_users')
    .select('email, role')
    .eq('email', email)
    .single();

  if (adminUser && password === ADMIN_PASSWORD) {
    return { valid: true, role: adminUser.role as 'admin' | 'super_admin' };
  }

  return { valid: false };
}

/**
 * Create admin session
 */
export async function createAdminSession(
  email: string,
  role: 'admin' | 'super_admin'
): Promise<void> {
  const cookieStore = await cookies();

  // Create simple session token (email:role:timestamp)
  const sessionToken = Buffer.from(
    `${email}:${role}:${Date.now()}`
  ).toString('base64');

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/admin',
  });

  // Update last_login in database
  await (supabaseAdmin as any)
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('email', email);
}

/**
 * Get current admin session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE);

    if (!sessionToken) {
      return null;
    }

    // Decode session token
    const decoded = Buffer.from(sessionToken.value, 'base64').toString('utf-8');
    const [email, role, timestamp] = decoded.split(':');

    // Check if session is still valid (7 days)
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 days in ms

    if (sessionAge > maxAge) {
      return null;
    }

    return {
      email,
      role: role as 'admin' | 'super_admin',
      authenticated: true,
    };
  } catch (error) {
    console.error('Failed to get admin session:', error);
    return null;
  }
}

/**
 * Destroy admin session (logout)
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/**
 * Require admin authentication
 *
 * Use this in API routes to protect admin-only endpoints
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session || !session.authenticated) {
    throw new Error('Unauthorized: Admin authentication required');
  }

  return session;
}

/**
 * Check if user is authenticated admin (non-throwing)
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session?.authenticated === true;
}

// ============================================================================
// ADMIN USER MANAGEMENT
// ============================================================================

/**
 * Create initial admin user if none exists
 */
export async function ensureAdminUser(): Promise<void> {
  // Check if any admin users exist
  const { data: existingAdmins, count } = await (supabaseAdmin as any)
    .from('admin_users')
    .select('*', { count: 'exact', head: true });

  // If no admins exist, create the default admin
  if (count === 0) {
    await (supabaseAdmin as any).from('admin_users').insert({
      email: ADMIN_EMAIL,
      role: 'super_admin',
    });

    console.log('✅ Created default admin user:', ADMIN_EMAIL);
  }
}

/**
 * List all admin users
 */
export async function listAdminUsers(): Promise<any[]> {
  const { data, error } = await (supabaseAdmin as any)
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to list admin users:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// EXPORTS
// ============================================================================

export const adminAuth = {
  verifyCredentials: verifyAdminCredentials,
  createSession: createAdminSession,
  getSession: getAdminSession,
  destroySession: destroyAdminSession,
  requireAdmin,
  isAdmin,
  ensureAdminUser,
  listAdminUsers,
};

export default adminAuth;
