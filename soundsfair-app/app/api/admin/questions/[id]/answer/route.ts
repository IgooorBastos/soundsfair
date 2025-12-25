/**
 * API Route: Submit Answer to Question
 *
 * POST /api/admin/questions/[id]/answer
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, getAdminCSRFToken, logAdminAction } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendAnswerDelivered } from '@/lib/email';
import { PRICING_TIERS } from '@/app/types/qa';
import { validateCSRFToken, getCSRFTokenFromRequest } from '@/lib/csrf';
import { getClientIp } from '@/lib/rate-limit';
import type { APIError } from '@/app/types/qa';
import type { Database } from '@/app/types/database';

type QuestionUpdate = Database['public']['Tables']['questions']['Update'];
type Question = Database['public']['Tables']['questions']['Row'];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const admin = await requireAdmin();

    // Parse request body
    const body = await request.json();

    // CSRF Protection: Validate token
    const providedToken = getCSRFTokenFromRequest(request, body);
    const expectedToken = await getAdminCSRFToken();

    if (!validateCSRFToken(providedToken, expectedToken)) {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Invalid or missing CSRF token',
        },
        { status: 403 }
      );
    }

    const { id } = await params;

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

    const supabase = supabaseAdmin as any;

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
    const updatePayload: QuestionUpdate = {
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
    };

    const { error: updateError } = await supabase
      .from('questions')
      .update(updatePayload)
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
      userName: question.user_name || undefined,
      questionText: question.question_text,
      responseText: responseText || '',
      videoUrl: responseVideoUrl,
      tier: tierData.name,
    });

    // Log answer submission to audit log
    const ip = getClientIp(request);
    await logAdminAction({
      adminEmail: admin.email,
      action: 'answer_question',
      resourceType: 'question',
      resourceId: id,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
      metadata: {
        hasText: !!responseText,
        hasVideo: !!responseVideoUrl,
        publishToArchive,
        category: question.category,
        tier: question.pricing_tier,
      },
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
