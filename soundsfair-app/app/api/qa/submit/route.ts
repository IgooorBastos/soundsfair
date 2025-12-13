/**
 * API Route: Submit Question with Payment
 *
 * POST /api/qa/submit
 *
 * Handles Q&A question submission and Lightning invoice generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { submitQuestionSchema } from '@/lib/validation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createInvoice, satsToBtc } from '@/lib/opennode';
import { PRICING_TIERS } from '@/app/types/qa';
import type { SubmitQuestionResponse, APIError } from '@/app/types/qa';

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = submitQuestionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.issues.map((e) => e.message).join(', '),
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Get pricing tier details
    const tierData = PRICING_TIERS[data.pricingTier];
    if (!tierData) {
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Invalid pricing tier',
        },
        { status: 400 }
      );
    }

    const amountSats = tierData.sats;

    // Initialize Supabase admin client
    const supabase = supabaseAdmin;

    // Create payment record first
    const { data: payment, error: paymentError } = await (supabase as any)
      .from('payments')
      .insert({
        invoice_id: '', // Will be updated after OpenNode invoice creation
        invoice_url: '',
        lightning_invoice: '',
        amount_sats: amountSats,
        amount_btc: satsToBtc(amountSats),
        status: 'pending',
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      })
      .select()
      .single();

    if (paymentError || !payment) {
      console.error('Failed to create payment record:', paymentError);
      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Failed to create payment record',
          details: paymentError?.message,
        },
        { status: 500 }
      );
    }

    // Create question record
    const { data: question, error: questionError } = await (supabase as any)
      .from('questions')
      .insert({
        user_email: data.userEmail,
        user_name: data.userName,
        category: data.category,
        question_text: data.questionText,
        pricing_tier: data.pricingTier,
        payment_id: payment.id,
        payment_status: 'pending',
        amount_sats: amountSats,
        status: 'awaiting_payment',
        publish_to_archive: data.publishToArchive,
      })
      .select()
      .single();

    if (questionError || !question) {
      console.error('Failed to create question record:', questionError);

      // Cleanup: Delete the payment record
      await supabase.from('payments').delete().eq('id', payment.id);

      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Failed to create question record',
          details: questionError?.message,
        },
        { status: 500 }
      );
    }

    // Create Lightning invoice via OpenNode
    const invoiceResult = await createInvoice({
      amount: amountSats,
      description: `soundsfair Q&A - ${tierData.name} - Question ID: ${question.id}`,
      orderId: question.id,
      customerEmail: data.userEmail,
    });

    if (!invoiceResult.success || !invoiceResult.invoice) {
      console.error('Failed to create OpenNode invoice:', invoiceResult.error);

      // Cleanup: Delete question and payment records
      await supabase.from('questions').delete().eq('id', question.id);
      await supabase.from('payments').delete().eq('id', payment.id);

      return NextResponse.json<APIError>(
        {
          success: false,
          error: 'Failed to create Lightning invoice',
          details: invoiceResult.error,
        },
        { status: 500 }
      );
    }

    // Update payment record with invoice details
    const { error: updateError } = await (supabase as any)
      .from('payments')
      .update({
        invoice_id: invoiceResult.invoice.invoiceId,
        invoice_url: invoiceResult.invoice.invoiceUrl,
        lightning_invoice: invoiceResult.invoice.lightningInvoice,
        expires_at: invoiceResult.invoice.expiresAt.toISOString(),
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment with invoice details:', updateError);
      // Not critical - the question and payment exist, just log the error
    }

    // Return success response with invoice details
    const response: SubmitQuestionResponse = {
      success: true,
      questionId: question.id,
      payment: {
        invoiceId: invoiceResult.invoice.invoiceId,
        invoiceUrl: invoiceResult.invoice.invoiceUrl,
        lightningInvoice: invoiceResult.invoice.lightningInvoice,
        qrCodeData: invoiceResult.invoice.qrCodeDataUrl,
        amountSats: invoiceResult.invoice.amountSats,
        expiresAt: invoiceResult.invoice.expiresAt.toISOString(),
      },
    };

    return NextResponse.json<SubmitQuestionResponse>(response, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in /api/qa/submit:', error);

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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
