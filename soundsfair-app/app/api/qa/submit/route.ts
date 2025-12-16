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
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { sendPrePaymentConfirmation } from '@/lib/email';

function getEnvInt(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Anti-abuse: same-origin only (defense-in-depth; browser should already enforce).
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const siteOrigin = request.nextUrl.origin;
    if (origin && origin !== siteOrigin) {
      return NextResponse.json<APIError>(
        { success: false, error: 'Origin not allowed' },
        { status: 403 }
      );
    }
    if (referer && !referer.startsWith(siteOrigin)) {
      return NextResponse.json<APIError>(
        { success: false, error: 'Referer not allowed' },
        { status: 403 }
      );
    }

    // Rate limit per IP (fast fail before creating DB records/invoices).
    const ip = getClientIp(request);
    const ipLimit = getEnvInt('QA_SUBMIT_RL_IP_LIMIT', 10);
    const ipWindowSeconds = getEnvInt('QA_SUBMIT_RL_IP_WINDOW_SEC', 10 * 60);
    const ipRl = checkRateLimit({
      key: `qa-submit:ip:${ip}`,
      limit: ipLimit,
      windowMs: ipWindowSeconds * 1000,
    });
    if (!ipRl.allowed) {
      return NextResponse.json<APIError>(
        { success: false, error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(ipRl.retryAfterSeconds),
            'X-RateLimit-Limit': String(ipLimit),
            'X-RateLimit-Remaining': String(ipRl.remaining),
            'X-RateLimit-Reset': String(Math.ceil(ipRl.resetAt / 1000)),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();

    // Optional honeypot (front-end can send `website`; bots often fill it).
    if (typeof (body as any)?.website === 'string' && (body as any).website.trim().length > 0) {
      return NextResponse.json<APIError>(
        { success: false, error: 'Validation failed' },
        { status: 400 }
      );
    }

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

    // Rate limit per email (slower window to limit repeated abuse/costs).
    const emailLimit = getEnvInt('QA_SUBMIT_RL_EMAIL_LIMIT', 5);
    const emailWindowSeconds = getEnvInt('QA_SUBMIT_RL_EMAIL_WINDOW_SEC', 60 * 60);
    const emailKey = data.userEmail.toLowerCase();
    const emailRl = checkRateLimit({
      key: `qa-submit:email:${emailKey}`,
      limit: emailLimit,
      windowMs: emailWindowSeconds * 1000,
    });
    if (!emailRl.allowed) {
      return NextResponse.json<APIError>(
        { success: false, error: 'Too many requests for this email. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(emailRl.retryAfterSeconds),
            'X-RateLimit-Limit': String(emailLimit),
            'X-RateLimit-Remaining': String(emailRl.remaining),
            'X-RateLimit-Reset': String(Math.ceil(emailRl.resetAt / 1000)),
          },
        }
      );
    }

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

    // Send pre-payment confirmation email (non-blocking)
    sendPrePaymentConfirmation({
      userEmail: data.userEmail,
      userName: data.userName,
      questionText: data.questionText,
      amountSats,
      tier: tierData.name,
      invoiceUrl: invoiceResult.invoice.invoiceUrl,
      qrCodeDataUrl: invoiceResult.invoice.qrCodeDataUrl,
      expiresAt: invoiceResult.invoice.expiresAt.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    }).catch((error) => {
      // Don't fail the request if email fails
      console.error('Failed to send pre-payment confirmation email:', error);
    });

    // Structured logging for monitoring
    console.log(JSON.stringify({
      event: 'question_submitted',
      question_id: question.id,
      payment_id: payment.id,
      invoice_id: invoiceResult.invoice.invoiceId,
      user_email: data.userEmail,
      category: data.category,
      pricing_tier: data.pricingTier,
      amount_sats: amountSats,
      expires_at: invoiceResult.invoice.expiresAt.toISOString(),
      timestamp: new Date().toISOString(),
      success: true,
    }));

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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
