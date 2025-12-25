import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * POST /api/webhooks/resend
 *
 * Handles Resend webhook events for email delivery tracking
 *
 * Events handled:
 * - email.sent: Email accepted by recipient's mail server
 * - email.delivered: Email successfully delivered to inbox
 * - email.bounced: Email rejected (hard bounce)
 * - email.complained: Recipient marked as spam
 *
 * Updates email_logs table with delivery status
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('⚠️ RESEND_WEBHOOK_SECRET not configured - webhook verification disabled');
      // In development, we might not have the secret yet
      // In production, this should be an error
    }

    // Get raw body for signature verification
    const body = await request.text();
    const payload = JSON.parse(body);

    // Verify webhook signature (if configured)
    if (webhookSecret) {
      const signature = request.headers.get('resend-signature') || request.headers.get('x-resend-signature');

      if (!signature) {
        console.error('Missing Resend webhook signature');
        return NextResponse.json(
          { error: 'Missing signature' },
          { status: 401 }
        );
      }

      // Resend signature format: t=timestamp,v1=signature
      const sigParts = signature.split(',').reduce((acc, part) => {
        const [key, value] = part.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const timestamp = sigParts.t;
      const receivedSignature = sigParts.v1;

      if (!timestamp || !receivedSignature) {
        console.error('Invalid signature format');
        return NextResponse.json(
          { error: 'Invalid signature format' },
          { status: 401 }
        );
      }

      // Create expected signature: HMAC-SHA256(timestamp.body, secret)
      const signedPayload = `${timestamp}.${body}`;
      const expectedSignature = createHmac('sha256', webhookSecret)
        .update(signedPayload)
        .digest('hex');

      // Timing-safe comparison
      const receivedBuffer = Buffer.from(receivedSignature, 'hex');
      const expectedBuffer = Buffer.from(expectedSignature, 'hex');

      if (receivedBuffer.length !== expectedBuffer.length || !timingSafeEqual(receivedBuffer, expectedBuffer)) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }

      // Check timestamp to prevent replay attacks (max 5 minutes old)
      const timestampMs = parseInt(timestamp) * 1000;
      const now = Date.now();
      const maxAge = 5 * 60 * 1000; // 5 minutes

      if (now - timestampMs > maxAge) {
        console.error('Webhook timestamp too old');
        return NextResponse.json(
          { error: 'Timestamp too old' },
          { status: 401 }
        );
      }
    }

    // Extract event data
    const { type, data } = payload;

    if (!type || !data) {
      console.error('Invalid webhook payload:', payload);
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Structured logging for monitoring
    console.log(JSON.stringify({
      event: 'webhook_received',
      webhook_type: 'resend',
      email_event_type: type,
      email_id: data.email_id,
      recipient: data.to?.[0] || 'unknown',
      subject: data.subject,
      timestamp: new Date().toISOString(),
    }));

    // Map Resend event types to our status values
    let status: 'sent' | 'delivered' | 'bounced' | 'complained' | null = null;

    switch (type) {
      case 'email.sent':
        status = 'sent';
        break;
      case 'email.delivered':
        status = 'delivered';
        break;
      case 'email.delivery_delayed':
        // Keep as 'sent' but log the delay
        console.warn(`Email delivery delayed: ${data.email_id}`);
        status = 'sent';
        break;
      case 'email.bounced':
        status = 'bounced';
        break;
      case 'email.complained':
        status = 'complained';
        break;
      default:
        console.log(`Unhandled Resend event type: ${type}`);
        // Return 200 to acknowledge receipt even if we don't process it
        return NextResponse.json({ received: true });
    }

    if (!status) {
      return NextResponse.json({ received: true });
    }

    // Update email_logs table
    const messageId = data.email_id;

    if (!messageId) {
      console.warn('No email_id in webhook payload, cannot update logs');
      return NextResponse.json({ received: true });
    }

    // Initialize Supabase client
    const supabase = supabaseAdmin as any;

    // Find existing log entry by message_id
    const { data: existingLog, error: fetchError } = await supabase
      .from('email_logs')
      .select('*')
      .eq('message_id', messageId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = not found
      console.error('Error fetching email log:', fetchError);
      throw new Error('Database error fetching log');
    }

    if (!existingLog) {
      console.warn(`No email log found for message_id: ${messageId}`);
      // This might happen if webhook arrives before we log the send
      // Or if message_id doesn't match - create a new log entry
      const { error: insertError } = await supabase
        .from('email_logs')
        .insert({
          recipient_email: data.to?.[0] || 'unknown',
          template_name: 'webhook_event',
          subject: data.subject || 'Unknown',
          status,
          message_id: messageId,
          sent_at: status === 'delivered' ? new Date().toISOString() : null,
        });

      if (insertError) {
        console.error('Error creating email log from webhook:', insertError);
        throw new Error('Failed to create log entry');
      }

      console.log(`✅ Created new email log entry for ${messageId} with status: ${status}`);
    } else {
      // Update existing log entry
      const { error: updateError } = await supabase
        .from('email_logs')
        .update({
          status,
          updated_at: new Date().toISOString(),
          sent_at: status === 'delivered' ? new Date().toISOString() : existingLog.sent_at,
          error: status === 'bounced' || status === 'complained'
            ? `Resend event: ${type}`
            : existingLog.error,
        })
        .eq('message_id', messageId);

      if (updateError) {
        console.error('Error updating email log:', updateError);
        throw new Error('Failed to update log entry');
      }

      console.log(`✅ Updated email log ${messageId}: ${existingLog.status} → ${status}`);
    }

    // Special handling for bounces and complaints
    if (status === 'bounced' || status === 'complained') {
      const recipientEmail = data.to?.[0] || existingLog?.recipient_email;

      if (recipientEmail) {
        // Optionally auto-unsubscribe on hard bounce or complaint
        // This is a best practice for email deliverability
        const { error: prefError } = await supabase
          .from('email_preferences')
          .upsert({
            email: recipientEmail,
            unsubscribed: status === 'complained', // Auto-unsubscribe on spam complaints only
            unsubscribed_at: status === 'complained' ? new Date().toISOString() : null,
            unsubscribe_reason: status === 'complained'
              ? 'Auto-unsubscribed due to spam complaint'
              : null,
            preferences: {
              last_bounce: status === 'bounced' ? new Date().toISOString() : null,
            },
          });

        if (prefError) {
          console.error('Error updating email preferences:', prefError);
          // Don't throw - logging is more important than preferences
        } else {
          if (status === 'complained') {
            console.log(`🚫 Auto-unsubscribed ${recipientEmail} due to spam complaint`);
          } else {
            console.log(`⚠️ Recorded bounce for ${recipientEmail}`);
          }
        }
      }
    }

    return NextResponse.json(
      { received: true, status },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend webhook error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/resend
 *
 * Health check endpoint
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    service: 'resend-webhook',
    status: 'active',
    configured: !!process.env.RESEND_WEBHOOK_SECRET,
  });
}
