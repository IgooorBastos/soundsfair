/**
 * CSRF Protection Module
 *
 * Provides Cross-Site Request Forgery protection for admin mutations.
 * Uses cryptographically secure tokens stored in session cookies.
 */

import { randomBytes, timingSafeEqual } from 'crypto';

/**
 * Generate a cryptographically secure CSRF token
 *
 * @returns A 32-byte hex string
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Validate a CSRF token against the expected token
 *
 * Uses timing-safe comparison to prevent timing attacks
 *
 * @param providedToken - Token from request header or body
 * @param expectedToken - Token from session
 * @returns True if tokens match, false otherwise
 */
export function validateCSRFToken(
  providedToken: string | null | undefined,
  expectedToken: string | null | undefined
): boolean {
  // Both tokens must be present
  if (!providedToken || !expectedToken) {
    return false;
  }

  // Tokens must be the same length
  if (providedToken.length !== expectedToken.length) {
    return false;
  }

  try {
    // Convert to buffers for timing-safe comparison
    const providedBuffer = Buffer.from(providedToken, 'hex');
    const expectedBuffer = Buffer.from(expectedToken, 'hex');

    // Timing-safe comparison to prevent timing attacks
    return timingSafeEqual(providedBuffer, expectedBuffer);
  } catch {
    // Invalid hex strings or other errors
    return false;
  }
}

/**
 * Extract CSRF token from request
 *
 * Checks multiple sources in order of preference:
 * 1. X-CSRF-Token header (recommended)
 * 2. Request body csrf_token field
 *
 * @param request - Next.js request object
 * @param body - Parsed request body (optional)
 * @returns The CSRF token or null if not found
 */
export function getCSRFTokenFromRequest(
  request: Request,
  body?: unknown
): string | null {
  // Check header first (recommended approach)
  const headerToken = request.headers.get('X-CSRF-Token');
  if (headerToken) {
    return headerToken;
  }

  // Fallback to body field
  if (body && typeof body === 'object' && 'csrf_token' in body) {
    const token = (body as { csrf_token?: string }).csrf_token;
    return token || null;
  }

  return null;
}
