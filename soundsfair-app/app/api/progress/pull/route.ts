import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { DatabaseWithRelationships } from '@/app/types/database';

/**
 * GET /api/progress/pull
 *
 * Downloads complete progress data from Supabase for the authenticated user
 * Returns all progress including lessons, quizzes, and XP
 *
 * Authentication: Required (Bearer token)
 */
export async function GET(request: NextRequest) {
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

    // Fetch user progress
    const { data: userProgress, error: userProgressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userProgressError) {
      if (userProgressError.code === 'PGRST116') {
        // No progress found - user has never synced
        return NextResponse.json({
          success: false,
          error: 'No progress found in cloud',
          has_cloud_data: false,
        });
      }

      console.error('[Pull API] User progress error:', userProgressError);
      return NextResponse.json(
        { error: 'Failed to fetch user progress' },
        { status: 500 }
      );
    }

    // Fetch lesson progress
    const { data: lessonProgress, error: lessonError } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id);

    if (lessonError) {
      console.error('[Pull API] Lesson progress error:', lessonError);
      return NextResponse.json(
        { error: 'Failed to fetch lesson progress' },
        { status: 500 }
      );
    }

    // Fetch quiz results
    const { data: quizResults, error: quizError } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (quizError) {
      console.error('[Pull API] Quiz results error:', quizError);
      return NextResponse.json(
        { error: 'Failed to fetch quiz results' },
        { status: 500 }
      );
    }

    // Return all progress data
    return NextResponse.json({
      success: true,
      has_cloud_data: true,
      data: {
        user_progress: userProgress,
        lesson_progress: lessonProgress || [],
        quiz_results: quizResults || [],
      },
      pulled_at: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Pull API] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
