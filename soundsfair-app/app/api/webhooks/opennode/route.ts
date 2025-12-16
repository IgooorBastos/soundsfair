/**
 * API Route: OpenNode Webhook Handler
 *
 * POST /api/webhooks/opennode
 *
 * Receives payment status updates from OpenNode and updates database accordingly
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyWebhookSignature, parseWebhookPayload } from '@/lib/opennode';
import { sendPaymentConfirmation, sendAdminNotification, sendPaymentExpired } from '@/lib/email';
import { PRICING_TIERS } from '@/app/types/qa';
import type { OpenNodeInvoice } from '@/lib/opennode';

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('opennode-signature') || '';

    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(rawBody, signature);
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const body = JSON.parse(rawBody);
    const webhookResult = parseWebhookPayload(body);

    if (!webhookResult.valid || !webhookResult.payload) {
      console.error('Invalid webhook payload:', webhookResult.error);
      return NextResponse.json(
        { error: webhookResult.error || 'Invalid payload' },
        { status: 400 }
      );
    }

    const payload = webhookResult.payload;

    // Initialize Supabase admin client
    const supabase = supabaseAdmin;

    // Find the payment by invoice_id
    const { data: payment, error: paymentError } = await (supabase as any)
      .from('payments')
      .select('id, status')
      .eq('invoice_id', payload.id)
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found for invoice:', payload.id, paymentError);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update payment status
    const { error: updatePaymentError } = await (supabase as any)
      .from('payments')
      .update({
        status: payload.status,
        paid_at: payload.status === 'paid' ? new Date().toISOString() : null,
        webhook_received: true,
        webhook_signature: signature,
        webhook_payload: payload as any,
      })
      .eq('id', payment.id);

    if (updatePaymentError) {
      console.error('Failed to update payment:', updatePaymentError);
      return NextResponse.json(
        { error: 'Failed to update payment' },
        { status: 500 }
      );
    }

    // Find associated question
    const { data: question, error: questionError } = await (supabase as any)
      .from('questions')
      .select('id, status')
      .eq('payment_id', payment.id)
      .single();

    if (questionError || !question) {
      console.error('Question not found for payment:', payment.id, questionError);
      // Payment is updated, but question is missing - log error but return 200
      return NextResponse.json({ received: true });
    }

    // Update question status based on payment status
    let newQuestionStatus = question.status;
    let newPaymentStatus = 'pending';

    switch (payload.status) {
      case 'paid':
        newQuestionStatus = 'in_queue';
        newPaymentStatus = 'paid';
        break;

      case 'expired':
        newQuestionStatus = 'payment_expired';
        newPaymentStatus = 'expired';
        break;

      case 'underpaid':
        // Keep awaiting payment
        newQuestionStatus = 'awaiting_payment';
        newPaymentStatus = 'pending';
        break;

      case 'processing':
        // Keep awaiting payment
        newQuestionStatus = 'awaiting_payment';
        newPaymentStatus = 'pending';
        break;

      default:
        // Unknown status, keep current
        break;
    }

    // Update question
    const { error: updateQuestionError } = await (supabase as any)
      .from('questions')
      .update({
        status: newQuestionStatus,
        payment_status: newPaymentStatus,
      })
      .eq('id', question.id);

    if (updateQuestionError) {
      console.error('Failed to update question:', updateQuestionError);
      return NextResponse.json(
        { error: 'Failed to update question' },
        { status: 500 }
      );
    }

    // Structured logging for monitoring and debugging
    console.log(JSON.stringify({
      event: 'webhook_processed',
      webhook_type: 'opennode',
      invoice_id: payload.id,
      payment_status: payload.status,
      question_id: question.id,
      old_question_status: question.status,
      new_question_status: newQuestionStatus,
      payment_id: payment.id,
      timestamp: new Date().toISOString(),
      success: true,
    }));

    // Send email notifications based on payment status
    if (payload.status === 'paid') {
      // Get full question details for emails
      const { data: fullQuestion } = await (supabase as any)
        .from('questions')
        .select('*')
        .eq('id', question.id)
        .single();

      if (fullQuestion) {
        const tierData = PRICING_TIERS[fullQuestion.pricing_tier as keyof typeof PRICING_TIERS];

        // Send confirmation email to user
        sendPaymentConfirmation({
          userEmail: fullQuestion.user_email,
          userName: fullQuestion.user_name,
          questionText: fullQuestion.question_text,
          amountSats: fullQuestion.amount_sats,
          tier: tierData.name,
          responseTime: `${tierData.hours} hours`,
          questionId: fullQuestion.id,
        }).catch((error) => {
          console.error('Failed to send payment confirmation email:', error);
        });

        // Send notification to admin
        sendAdminNotification({
          userName: fullQuestion.user_name,
          userEmail: fullQuestion.user_email,
          questionText: fullQuestion.question_text,
          category: fullQuestion.category,
          tier: tierData.name,
          amountSats: fullQuestion.amount_sats,
          questionId: fullQuestion.id,
        }).catch((error) => {
          console.error('Failed to send admin notification email:', error);
        });
      }
    }

    // Send payment expiration email if invoice expired
    if (payload.status === 'expired') {
      // Get full question details
      const { data: fullQuestion } = await (supabase as any)
        .from('questions')
        .select('*')
        .eq('id', question.id)
        .single();

      if (fullQuestion) {
        const tierData = PRICING_TIERS[fullQuestion.pricing_tier as keyof typeof PRICING_TIERS];

        // Send expiration email to user (non-blocking)
        sendPaymentExpired({
          userEmail: fullQuestion.user_email,
          userName: fullQuestion.user_name,
          questionText: fullQuestion.question_text,
          tier: tierData.name,
        }).catch((error) => {
          console.error('Failed to send payment expiration email:', error);
        });

        console.log(`📧 Sent payment expiration email to ${fullQuestion.user_email}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Unexpected error in OpenNode webhook:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET HANDLER (FOR TESTING)
// ============================================================================

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'OpenNode webhook endpoint is active',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
