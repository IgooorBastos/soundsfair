/**
 * API Route: Admin Login
 *
 * POST /api/admin/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, createAdminSession, ensureAdminUser } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Ensure admin user exists
    await ensureAdminUser();

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
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

    // Create session
    await createAdminSession(email, role);

    return NextResponse.json({
      success: true,
      user: {
        email,
        role,
      },
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
