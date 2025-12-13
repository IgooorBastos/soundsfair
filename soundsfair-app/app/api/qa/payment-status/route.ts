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
import type { PaymentStatusResponse, APIError } from '@/app/types/qa';

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
    const supabase = supabaseAdmin;

    // Get question with payment details
    const { data: question, error: questionError } = await (supabase as any)
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

    // If payment exists, optionally check OpenNode for latest status
    // (This provides a fallback if webhook was missed)
    if (question.payments && Array.isArray(question.payments) && question.payments.length > 0) {
      const payment = question.payments[0];

      // Only check OpenNode if payment is still pending
      if (payment.status === 'pending' && payment.invoice_id) {
        const invoiceStatus = await getInvoiceStatus(payment.invoice_id);

        if (invoiceStatus.success && invoiceStatus.status) {
          // Update local payment status if it changed
          if (invoiceStatus.status !== payment.status) {
            await (supabase as any)
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
            let newQuestionStatus = question.status;
            let newPaymentStatus = 'pending';

            if (invoiceStatus.status === 'paid') {
              newQuestionStatus = 'in_queue';
              newPaymentStatus = 'paid';
            } else if (invoiceStatus.status === 'expired') {
              newQuestionStatus = 'payment_expired';
              newPaymentStatus = 'expired';
            }

            await (supabase as any)
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
      paymentStatus: question.payment_status as any,
      questionStatus: question.status as any,
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
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
