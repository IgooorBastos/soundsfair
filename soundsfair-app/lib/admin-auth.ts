/**
 * Admin Authentication Helper
 *
 * Simple admin authentication using environment variable for MVP
 * Can be upgraded to Supabase Auth or JWT tokens later
 */

import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase-admin';
import crypto from 'crypto';
import { generateCSRFToken } from './csrf';

// ============================================================================
// CONFIGURATION
// ============================================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change_this_password';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bitcoinnalata@proton.me';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;
const ADMIN_SESSION_COOKIE = 'soundsfair_admin_session';

function assertSecureAdminConfig() {
  if (process.env.NODE_ENV !== 'production') return;

  if (!process.env.ADMIN_PASSWORD || ADMIN_PASSWORD === 'change_this_password') {
    throw new Error('ADMIN_PASSWORD must be set to a strong value in production');
  }

  if (!ADMIN_SESSION_SECRET || ADMIN_SESSION_SECRET.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be set (32+ chars) in production');
  }
}

function timingSafeEqualString(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

type AdminSessionPayload = {
  email: string;
  role: 'admin' | 'super_admin';
  iat: number;
  csrfToken?: string; // CSRF token for mutation protection
};

function signAdminSession(payload: AdminSessionPayload): string {
  if (!ADMIN_SESSION_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SESSION_SECRET is required in production');
    }
    // Dev-only legacy format for convenience: base64(email:role:timestamp)
    return Buffer.from(`${payload.email}:${payload.role}:${payload.iat}`).toString('base64');
  }

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sigB64 = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${sigB64}`;
}

function verifyAdminSession(token: string): AdminSessionPayload | null {
  try {
    if (!ADMIN_SESSION_SECRET) {
      // Dev-only fallback: legacy/unsigned token
      if (process.env.NODE_ENV === 'production') return null;
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      // Legacy: email:role:timestamp
      const [email, role, timestamp] = decoded.split(':');
      const iat = parseInt(timestamp);
      if (email && role && !Number.isNaN(iat)) {
        return { email, role: role as AdminSessionPayload['role'], iat };
      }
      return null;
    }

    const [payloadB64, sigB64] = token.split('.');
    if (!payloadB64 || !sigB64) return null;

    const expectedSig = crypto
      .createHmac('sha256', ADMIN_SESSION_SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (!timingSafeEqualString(sigB64, expectedSig)) return null;

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson) as AdminSessionPayload;
    if (!payload?.email || !payload?.role || !payload?.iat) return null;
    return payload;
  } catch {
    return null;
  }
}

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
  assertSecureAdminConfig();

  // For MVP, use simple environment variable check
  // TODO: Upgrade to Supabase Auth or proper JWT authentication

  if (email === ADMIN_EMAIL && timingSafeEqualString(password, ADMIN_PASSWORD)) {
    return { valid: true, role: 'super_admin' };
  }

  // Check against admin_users table
  const { data: adminUser } = await (supabaseAdmin as any)
    .from('admin_users')
    .select('email, role')
    .eq('email', email)
    .single();

  if (adminUser && timingSafeEqualString(password, ADMIN_PASSWORD)) {
    return { valid: true, role: adminUser.role as 'admin' | 'super_admin' };
  }

  return { valid: false };
}

/**
 * Create admin session with CSRF protection
 *
 * @returns The CSRF token to be sent to the client
 */
export async function createAdminSession(
  email: string,
  role: 'admin' | 'super_admin'
): Promise<string> {
  assertSecureAdminConfig();
  const cookieStore = await cookies();

  // Generate CSRF token for this session
  const csrfToken = generateCSRFToken();

  const sessionToken = signAdminSession({
    email,
    role,
    iat: Date.now(),
    csrfToken,
  });

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // Update last_login in database
  await (supabaseAdmin as any)
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('email', email);

  return csrfToken;
}

/**
 * Get current admin session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    assertSecureAdminConfig();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE);

    if (!sessionToken) {
      return null;
    }

    const payload = verifyAdminSession(sessionToken.value);
    if (!payload) return null;

    // Check if session is still valid (7 days)
    const sessionAge = Date.now() - payload.iat;
    const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 days in ms

    if (sessionAge > maxAge) {
      return null;
    }

    return {
      email: payload.email,
      role: payload.role,
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
  assertSecureAdminConfig();
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

/**
 * Get CSRF token from current admin session
 *
 * @returns The CSRF token or null if no session exists
 */
export async function getAdminCSRFToken(): Promise<string | null> {
  try {
    assertSecureAdminConfig();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE);

    if (!sessionToken) {
      return null;
    }

    const payload = verifyAdminSession(sessionToken.value);
    if (!payload || !payload.csrfToken) {
      return null;
    }

    return payload.csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
}

// ============================================================================
// ADMIN AUDIT LOGGING
// ============================================================================

/**
 * Log admin action to audit log
 *
 * @param params - Action details
 */
export async function logAdminAction(params: {
  adminEmail: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  try {
    const { data, error } = await (supabaseAdmin as any)
      .from('admin_audit_log')
      .insert({
        admin_email: params.adminEmail,
        action: params.action,
        resource_type: params.resourceType || null,
        resource_id: params.resourceId || null,
        ip_address: params.ipAddress || null,
        user_agent: params.userAgent || null,
        metadata: params.metadata || {},
      });

    if (error) {
      console.error('Failed to log admin action:', error);
      // Don't throw - audit logging should not break the main flow
    }
  } catch (error) {
    console.error('Unexpected error logging admin action:', error);
    // Silent fail - audit logging is important but not critical
  }
}

// ============================================================================
// ADMIN USER MANAGEMENT
// ============================================================================

/**
 * Create initial admin user if none exists
 */
export async function ensureAdminUser(): Promise<void> {
  // Avoid implicit privilege creation in production.
  if (process.env.NODE_ENV === 'production') return;

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
