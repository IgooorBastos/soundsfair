/**
 * API Route: Submit Answer to Question
 *
 * POST /api/admin/questions/[id]/answer
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/admin-auth';
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { sendAnswerDelivered } from '@/app/lib/email';
import { PRICING_TIERS } from '@/app/types/qa';
import type { APIError } from '@/app/types/qa';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const admin = await requireAdmin();

    const { id } = await params;

    // Parse request body
    const body = await request.json();
    const { responseText, responseVideoUrl, publishToArchive } = body;

    if (!responseText && !responseVideoUrl) {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Either response text or video URL must be provided',
        },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin;

    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (questionError || !question) {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Question not found',
        },
        { status: 404 }
      );
    }

    // Verify question is paid
    if (question.payment_status !== 'paid') {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Question has not been paid',
        },
        { status: 400 }
      );
    }

    // Update question with answer
    const { error: updateError } = await supabase
      .from('questions')
      .update({
        response_text: responseText || null,
        response_video_url: responseVideoUrl || null,
        responded_at: new Date().toISOString(),
        responded_by: admin.email,
        status: 'answered',
        publish_to_archive: publishToArchive || question.publish_to_archive,
        published_at:
          publishToArchive || question.publish_to_archive
            ? new Date().toISOString()
            : null,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Failed to update question:', updateError);
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Failed to save answer',
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    // Send email notification to user
    const tierData = PRICING_TIERS[question.pricing_tier as keyof typeof PRICING_TIERS];

    await sendAnswerDelivered({
      userEmail: question.user_email,
      userName: question.user_name,
      questionText: question.question_text,
      responseText: responseText || '',
      videoUrl: responseVideoUrl,
      tier: tierData.name,
    });

    return NextResponse.json({
      success: true,
      questionId: id,
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

    console.error('Unexpected error in /api/admin/questions/[id]/answer:', error);

    return NextResponse.json<APIError>(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
