import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithRelationships } from '@/app/types/database';

type ProgressPayload = {
  total_xp?: number;
  current_level?: number;
  current_streak?: number;
  longest_streak?: number;
  last_active_date?: string | null;
  device_id?: string | null;
};

/**
 * POST /api/progress/sync
 *
 * Manually triggers a sync of progress data to Supabase
 * This is primarily used by the ProgressSyncIndicator component
 *
 * Authentication: Required (Bearer token)
 * Body: { progressData: UserProgressData }
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized: No authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    const supabase = createClient<DatabaseWithRelationships>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { progressData } = body as { progressData?: ProgressPayload };

    // Validate progress data structure
    if (!progressData || typeof progressData !== 'object') {
      return NextResponse.json(
        { error: 'Bad Request: Invalid progress data structure' },
        { status: 400 }
      );
    }

    // Upsert progress to database
    const { error: upsertError } = await supabase
      .from('user_progress')
      .upsert({
        id: user.id,
        total_xp: progressData.total_xp || 0,
        current_level: progressData.current_level || 1,
        current_streak: progressData.current_streak || 0,
        longest_streak: progressData.longest_streak || 0,
        last_active_date: progressData.last_active_date || null,
        last_synced_at: new Date().toISOString(),
        device_id: progressData.device_id || null,
      });

    if (upsertError) {
      console.error('[Sync API] Upsert error:', upsertError);
      return NextResponse.json(
        { error: 'Internal Server Error: Failed to sync progress' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      synced_at: new Date().toISOString(),
      user_id: user.id,
    });

  } catch (error) {
    console.error('[Sync API] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/progress/sync
 *
 * Returns current sync status for the authenticated user
 * Useful for checking when the last sync occurred
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    const supabase = createClient<DatabaseWithRelationships>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('last_synced_at, device_id, sync_version')
      .eq('id', user.id)
      .single();

    if (progressError) {
      if (progressError.code === 'PGRST116') {
        // No progress found - never synced
        return NextResponse.json({
          synced: false,
          last_synced_at: null,
        });
      }

      return NextResponse.json(
        { error: 'Failed to fetch sync status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      synced: true,
      last_synced_at: progress.last_synced_at,
      device_id: progress.device_id,
      sync_version: progress.sync_version,
    });

  } catch (error) {
    console.error('[Sync API GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
