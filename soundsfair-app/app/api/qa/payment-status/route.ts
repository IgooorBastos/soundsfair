/**
 * API Route: Payment Status
 *
 * GET /api/qa/payment-status?questionId=xxx
 *
 * Allows frontend to poll for payment status updates
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getInvoiceStatus } from '@/lib/opennode';
import type { PaymentStatusResponse, APIError, PaymentStatus, QuestionStatus } from '@/app/types/qa';
import type { Database } from '@/app/types/database';

type PaymentRow = Pick<Database['public']['Tables']['payments']['Row'], 'id' | 'invoice_id' | 'status' | 'paid_at'>;
type QuestionWithPayment = Pick<
  Database['public']['Tables']['questions']['Row'],
  'id' | 'status' | 'payment_status' | 'payment_id' | 'response_text' | 'response_video_url' | 'responded_at'
> & { payments: PaymentRow[] | null };

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Get question ID from query params
    const searchParams = request.nextUrl.searchParams;
    const questionId = searchParams.get('questionId');

    if (!questionId) {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Missing questionId parameter',
        },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(questionId)) {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Invalid questionId format',
        },
        { status: 400 }
      );
    }

    // Initialize Supabase admin client
    const supabase = supabaseAdmin as any;

    // Get question with payment details
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select(
        `
        id,
        status,
        payment_status,
        payment_id,
        response_text,
        response_video_url,
        responded_at,
        payments (
          id,
          invoice_id,
          status,
          paid_at
        )
      `
      )
      .eq('id', questionId)
      .single<QuestionWithPayment>();

    if (questionError || !question) {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Question not found',
        },
        { status: 404 }
      );
    }

    // If payment exists, optionally check OpenNode for latest status
    // (This provides a fallback if webhook was missed)
    if (question.payments && question.payments.length > 0) {
      const payment = question.payments[0];

      // Only check OpenNode if payment is still pending
      if (payment.status === 'pending' && payment.invoice_id) {
        const invoiceStatus = await getInvoiceStatus(payment.invoice_id);

        if (invoiceStatus.success && invoiceStatus.status) {
          // Update local payment status if it changed
          if (invoiceStatus.status !== (payment.status as string)) {
            await supabase
              .from('payments')
              .update({
                status: invoiceStatus.status,
                paid_at:
                  invoiceStatus.status === 'paid'
                    ? new Date().toISOString()
                    : null,
              })
              .eq('id', payment.id);

            // Update question status accordingly
            let newQuestionStatus: QuestionStatus = question.status as QuestionStatus;
            let newPaymentStatus: PaymentStatus = question.payment_status as PaymentStatus;

            if (invoiceStatus.status === 'paid') {
              newQuestionStatus = 'in_queue';
              newPaymentStatus = 'paid';
            } else if (invoiceStatus.status === 'expired') {
              newQuestionStatus = 'payment_expired';
              newPaymentStatus = 'expired';
            }

            await supabase
              .from('questions')
              .update({
                status: newQuestionStatus,
                payment_status: newPaymentStatus,
              })
              .eq('id', questionId);

            // Update local variables for response
            question.status = newQuestionStatus;
            question.payment_status = newPaymentStatus;
            payment.status = invoiceStatus.status;
          }
        }
      }
    }

    // Build response
    const response: PaymentStatusResponse = {
      questionId: question.id,
      paymentStatus: question.payment_status as PaymentStatus,
      questionStatus: question.status as QuestionStatus,
    };

    // Include answer if available
    if (question.status === 'answered' && question.response_text) {
      response.answered = {
        responseText: question.response_text,
        videoUrl: question.response_video_url || undefined,
        answeredAt: question.responded_at || new Date().toISOString(),
      };
    }

    return NextResponse.json<PaymentStatusResponse>(response);
  } catch (error) {
    console.error('Unexpected error in /api/qa/payment-status:', error);

    return NextResponse.json<APIError>(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// OPTIONS HANDLER (CORS)
// ============================================================================

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const sameOrigin = origin === request.nextUrl.origin;

  if (origin && !sameOrigin) {
    return NextResponse.json(
      { error: 'CORS origin not allowed' },
      { status: 403 }
    );
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      ...(sameOrigin ? { 'Access-Control-Allow-Origin': origin! } : {}),
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
