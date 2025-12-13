/**
 * API Route: Admin Questions Management
 *
 * GET /api/admin/questions - List questions with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { APIError } from '@/app/types/qa';

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'in_queue';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = supabaseAdmin;

    // Build query
    let query = supabase
      .from('questions')
      .select(
        `
        *,
        payments (
          id,
          invoice_id,
          status,
          paid_at,
          amount_sats
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: questions, error, count } = await query;

    if (error) {
      console.error('Failed to fetch questions:', error);
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Failed to fetch questions',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      questions: questions || [],
      total: count || 0,
      hasMore: (count || 0) > offset + limit,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    console.error('Unexpected error in /api/admin/questions:', error);

    return NextResponse.json<APIError>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
