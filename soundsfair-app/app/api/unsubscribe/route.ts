import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

type APIResponse = {
  success: boolean;
  error?: string;
};

/**
 * POST /api/unsubscribe
 *
 * Unsubscribe an email address from all soundsfair communications
 *
 * Body:
 *   - email: string (required)
 *   - reason: string (optional)
 */
export async function POST(request: NextRequest): Promise<NextResponse<APIResponse>> {
  try {
    const supabase = supabaseAdmin as any;
    const body = await request.json() as { email?: string; reason?: string };
    const { email, reason } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json<APIResponse>(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email preferences record exists
    const { data: existing, error: fetchError } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = not found, which is okay
      console.error('Error checking email preferences:', fetchError);
      throw new Error('Database error while checking preferences');
    }

    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('email_preferences')
        .update({
          unsubscribed: true,
          unsubscribed_at: new Date().toISOString(),
          unsubscribe_reason: reason || null,
          updated_at: new Date().toISOString(),
        })
        .eq('email', normalizedEmail);

      if (updateError) {
        console.error('Error updating email preferences:', updateError);
        throw new Error('Failed to update unsubscribe status');
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('email_preferences')
        .insert({
          email: normalizedEmail,
          unsubscribed: true,
          unsubscribed_at: new Date().toISOString(),
          unsubscribe_reason: reason || null,
          preferences: {},
        });

      if (insertError) {
        console.error('Error creating email preferences:', insertError);
        throw new Error('Failed to save unsubscribe status');
      }
    }

    console.log(`✅ Email unsubscribed: ${normalizedEmail}`);

    return NextResponse.json<APIResponse>(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json<APIResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/unsubscribe?email=xxx
 *
 * Check if an email is unsubscribed (for verification)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = supabaseAdmin as any;
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabase
      .from('email_preferences')
      .select('unsubscribed, unsubscribed_at')
      .eq('email', normalizedEmail)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking unsubscribe status:', error);
      throw new Error('Database error');
    }

    return NextResponse.json({
      success: true,
      email: normalizedEmail,
      unsubscribed: data?.unsubscribed || false,
      unsubscribedAt: data?.unsubscribed_at || null,
    });
  } catch (error) {
    console.error('Check unsubscribe error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
