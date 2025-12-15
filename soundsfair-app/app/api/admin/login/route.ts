/**
 * API Route: Admin Login
 *
 * POST /api/admin/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, createAdminSession, ensureAdminUser, logAdminAction } from '@/lib/admin-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Only auto-bootstrap admin users during local development.
    if (process.env.NODE_ENV !== 'production') {
      await ensureAdminUser();
    }

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Rate limiting: Prevent brute force attacks
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({
      key: `admin-login:${ip}`,
      limit: 5, // 5 attempts
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfterSeconds.toString(),
          },
        }
      );
    }

    // Verify credentials
    const { valid, role } = await verifyAdminCredentials(email, password);

    if (!valid || !role) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session and get CSRF token
    const csrfToken = await createAdminSession(email, role);

    // Log successful login to audit log
    await logAdminAction({
      adminEmail: email,
      action: 'login',
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
      metadata: {
        role,
        success: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        email,
        role,
      },
      csrfToken, // Send CSRF token to client for future mutations
    });
  } catch (error) {
    console.error('Admin login error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
