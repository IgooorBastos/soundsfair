import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Auth Callback Handler
 *
 * Handles OAuth callbacks and magic link verifications from Supabase
 *
 * Magic Link Flow:
 * 1. User requests magic link at /login
 * 2. Supabase sends email with link to /auth/callback?token_hash=...&type=magiclink
 * 3. This route verifies the token and logs user in
 * 4. Redirects to lessons page (or 'next' param)
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as 'magiclink' | 'recovery' | 'invite' | 'email_change' | null;
  const next = requestUrl.searchParams.get('next') || '/lessons';

  if (token_hash && type) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Verify the OTP token
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      // Success! Redirect to the next page
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    // Log error for debugging
    console.error('Auth callback error:', error);
  }

  // Redirect to login page with error message
  return NextResponse.redirect(
    new URL('/login?error=invalid_link&message=The magic link is invalid or has expired', requestUrl.origin)
  );
}
