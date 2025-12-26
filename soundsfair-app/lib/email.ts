/**
 * Email Service using Resend
 *
 * Handles all email notifications for the Q&A system
 */

import { Resend } from 'resend';
import { supabaseAdmin } from './supabase-admin';

// ============================================================================
// CONFIGURATION
// ============================================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim() || 'bitcoinnalata@proton.me';
const FROM_EMAIL = 'soundsfair <noreply@soundsfair.com>'; // Update with your verified domain
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

let resend: Resend | null = null;

if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
} else {
  console.warn('⚠️ RESEND_API_KEY is not set. Email functionality will be disabled.');
}

// ============================================================================
// TYPES
// ============================================================================

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

/**
 * Generate unsubscribe footer HTML for user-facing emails
 */
function unsubscribeFooter(userEmail: string): string {
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(userEmail)}`;
  return `
    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #2A2A2A;">
      <p style="margin: 0; font-size: 11px; color: #666666; text-align: center; line-height: 1.6;">
        You're receiving this email because you used soundsfair's services.<br>
        <a href="${unsubscribeUrl}" style="color: #888888; text-decoration: underline;">Unsubscribe from all emails</a>
      </p>
    </div>
  `;
}

/**
 * Payment confirmation email to user
 */
function paymentConfirmationTemplate(data: {
  userEmail: string;
  userName?: string;
  questionText: string;
  amountSats: number;
  tier: string;
  responseTime: string;
  questionId: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmed - soundsfair</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #E0E0E0;
      background-color: #000000;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
      border: 2px solid #FFD000;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #FFD000;
      margin-bottom: 10px;
    }
    .success-badge {
      display: inline-block;
      background-color: rgba(255, 208, 0, 0.1);
      border: 1px solid #FFD000;
      color: #FFD000;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 10px;
    }
    .content {
      background-color: #1a1a1a;
      border: 1px solid #333333;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 20px;
    }
    h1 {
      color: #FFD000;
      font-size: 24px;
      margin-top: 0;
    }
    h2 {
      color: #E0E0E0;
      font-size: 18px;
      margin-top: 20px;
    }
    .info-box {
      background-color: #000000;
      border: 1px solid #333333;
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #333333;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      color: #999999;
      font-size: 14px;
    }
    .value {
      color: #E0E0E0;
      font-weight: 600;
      font-size: 14px;
    }
    .question-preview {
      background-color: #000000;
      border-left: 4px solid #FFD000;
      padding: 15px;
      margin: 15px 0;
      font-style: italic;
      color: #B0B0B0;
    }
    .footer {
      text-align: center;
      color: #666666;
      font-size: 12px;
      padding: 20px;
    }
    .lightning {
      color: #FFD000;
      font-size: 20px;
    }
    a {
      color: #FFD000;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">soundsfair</div>
      <div class="success-badge">
        <span class="lightning">⚡</span> PAYMENT CONFIRMED
      </div>
    </div>

    <div class="content">
      <h1>Payment Confirmed!</h1>

      <p>Hi ${data.userName || 'there'},</p>

      <p>Your Lightning Network payment has been confirmed and your question has been added to our queue. Our Bitcoin expert will provide you with a ${data.tier} response within ${data.responseTime}.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="label">Payment Amount</span>
          <span class="value">${data.amountSats.toLocaleString()} sats</span>
        </div>
        <div class="info-row">
          <span class="label">Service Tier</span>
          <span class="value">${data.tier}</span>
        </div>
        <div class="info-row">
          <span class="label">Expected Response</span>
          <span class="value">Within ${data.responseTime}</span>
        </div>
        <div class="info-row">
          <span class="label">Question ID</span>
          <span class="value">${data.questionId.substring(0, 8)}...</span>
        </div>
      </div>

      <h2>Your Question</h2>
      <div class="question-preview">
        ${data.questionText.length > 200 ? data.questionText.substring(0, 200) + '...' : data.questionText}
      </div>

      <h2>What Happens Next?</h2>
      <ol style="color: #B0B0B0;">
        <li>Our expert will carefully review your question</li>
        <li>You'll receive a comprehensive answer via email</li>
        <li>The response will be tailored to your chosen tier</li>
      </ol>

      <p style="margin-top: 30px; text-align: center;">
        <a href="${SITE_URL}/qa" style="display: inline-block; background-color: #FFD000; color: #000000; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-decoration: none;">
          Ask Another Question
        </a>
      </p>
    </div>

    <div class="footer">
      <p>This is an automated email from soundsfair.</p>
      <p>Fair Money • Economic Freedom • Bitcoin Education</p>
      <p><a href="${SITE_URL}">soundsfair.com</a></p>
      ${unsubscribeFooter(data.userEmail)}
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * New question notification to admin
 */
function newQuestionAdminTemplate(data: {
  userName?: string;
  userEmail: string;
  questionText: string;
  category: string;
  tier: string;
  amountSats: number;
  questionId: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Paid Question - soundsfair</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #E0E0E0;
      background-color: #000000;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
      border: 2px solid #FFD000;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #FFD000;
      margin-bottom: 10px;
    }
    .badge {
      display: inline-block;
      background-color: rgba(255, 208, 0, 0.1);
      border: 1px solid #FFD000;
      color: #FFD000;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 10px;
    }
    .content {
      background-color: #1a1a1a;
      border: 1px solid #333333;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 20px;
    }
    h1 {
      color: #FFD000;
      font-size: 24px;
      margin-top: 0;
    }
    .info-box {
      background-color: #000000;
      border: 1px solid #333333;
      border-radius: 8px;
      padding: 15px;
      margin: 15px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #333333;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      color: #999999;
      font-size: 14px;
    }
    .value {
      color: #E0E0E0;
      font-weight: 600;
      font-size: 14px;
    }
    .question-box {
      background-color: #000000;
      border-left: 4px solid #FFD000;
      padding: 20px;
      margin: 20px 0;
      color: #E0E0E0;
      font-size: 15px;
    }
    .cta-button {
      display: inline-block;
      background-color: #FFD000;
      color: #000000;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: bold;
      text-decoration: none;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      color: #666666;
      font-size: 12px;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">soundsfair</div>
      <div class="badge">
        ⚡ NEW PAID QUESTION
      </div>
    </div>

    <div class="content">
      <h1>New Question in Queue</h1>

      <p>A new paid question has been submitted and is waiting for your response.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="label">From</span>
          <span class="value">${data.userName || 'Anonymous'} (${data.userEmail})</span>
        </div>
        <div class="info-row">
          <span class="label">Category</span>
          <span class="value">${data.category}</span>
        </div>
        <div class="info-row">
          <span class="label">Tier</span>
          <span class="value">${data.tier}</span>
        </div>
        <div class="info-row">
          <span class="label">Payment</span>
          <span class="value">${data.amountSats.toLocaleString()} sats</span>
        </div>
        <div class="info-row">
          <span class="label">Question ID</span>
          <span class="value">${data.questionId}</span>
        </div>
      </div>

      <h2 style="color: #E0E0E0; font-size: 18px;">Question</h2>
      <div class="question-box">
        ${data.questionText}
      </div>

      <p style="text-align: center;">
        <a href="${SITE_URL}/admin/queue" class="cta-button">
          View in Admin Dashboard
        </a>
      </p>
    </div>

    <div class="footer">
      <p>soundsfair Admin Notification</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Answer delivered notification to user
 */
function answerDeliveredTemplate(data: {
  userEmail: string;
  userName?: string;
  questionText: string;
  responseText: string;
  videoUrl?: string;
  tier: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Answer is Ready - soundsfair</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #E0E0E0;
      background-color: #000000;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
      border: 2px solid #FFD000;
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #FFD000;
      margin-bottom: 10px;
    }
    .badge {
      display: inline-block;
      background-color: rgba(255, 208, 0, 0.1);
      border: 1px solid #FFD000;
      color: #FFD000;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 10px;
    }
    .content {
      background-color: #1a1a1a;
      border: 1px solid #333333;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 20px;
    }
    h1 {
      color: #FFD000;
      font-size: 24px;
      margin-top: 0;
    }
    h2 {
      color: #E0E0E0;
      font-size: 18px;
      margin-top: 25px;
    }
    .question-box {
      background-color: #000000;
      border-left: 4px solid #666666;
      padding: 15px;
      margin: 15px 0;
      font-style: italic;
      color: #999999;
      font-size: 14px;
    }
    .answer-box {
      background-color: #000000;
      border-left: 4px solid #FFD000;
      padding: 20px;
      margin: 20px 0;
      color: #E0E0E0;
      font-size: 15px;
      white-space: pre-wrap;
    }
    .video-box {
      background-color: #000000;
      border: 2px solid #FFD000;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #FFD000;
      color: #000000;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: bold;
      text-decoration: none;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      color: #666666;
      font-size: 12px;
      padding: 20px;
    }
    a {
      color: #FFD000;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">soundsfair</div>
      <div class="badge">
        ✅ YOUR ANSWER IS READY
      </div>
    </div>

    <div class="content">
      <h1>Your Bitcoin Question Answered!</h1>

      <p>Hi ${data.userName || 'there'},</p>

      <p>Our Bitcoin expert has prepared a ${data.tier} for you. Thank you for your payment and for being part of the soundsfair community!</p>

      <h2>Your Question</h2>
      <div class="question-box">
        ${data.questionText.length > 300 ? data.questionText.substring(0, 300) + '...' : data.questionText}
      </div>

      <h2>Expert Answer</h2>
      <div class="answer-box">
        ${data.responseText}
      </div>

      ${data.videoUrl ? `
      <div class="video-box">
        <h2 style="margin-top: 0;">Video Response</h2>
        <p>Your personalized video explanation is ready!</p>
        <a href="${data.videoUrl}" class="cta-button">
          Watch Video Response
        </a>
      </div>
      ` : ''}

      <h2>Keep Learning</h2>
      <p>Want to dive deeper into Bitcoin? Check out our educational content:</p>
      <ul style="color: #B0B0B0;">
        <li><a href="${SITE_URL}/lessons">Interactive Bitcoin Lessons</a></li>
        <li><a href="${SITE_URL}/tools/dca">DCA Calculator</a></li>
        <li><a href="${SITE_URL}/qa">Ask Another Question</a></li>
      </ul>

      <p style="margin-top: 30px; text-align: center;">
        <a href="${SITE_URL}/qa" class="cta-button">
          Ask Another Question
        </a>
      </p>
    </div>

    <div class="footer">
      <p>Thank you for choosing soundsfair for your Bitcoin education!</p>
      <p>Fair Money • Economic Freedom • Bitcoin Education</p>
      <p><a href="${SITE_URL}">soundsfair.com</a></p>
      ${unsubscribeFooter(data.userEmail)}
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ============================================================================
// EMAIL SENDING FUNCTIONS
// ============================================================================

/**
 * Send payment confirmation email to user
 */
export async function sendPaymentConfirmation(params: {
  userEmail: string;
  userName?: string;
  questionText: string;
  amountSats: number;
  tier: string;
  responseTime: string;
  questionId: string;
}): Promise<EmailResult> {
  if (!resend) {
    console.log('Email sending skipped (Resend not configured)');
    return { success: false, error: 'Resend not configured' };
  }

  return await sendEmailWithRetry({
    to: params.userEmail,
    subject: '⚡ Payment Confirmed - Your Question is in Queue',
    html: paymentConfirmationTemplate(params),
    templateName: 'payment_confirmation',
  });
}

/**
 * Send new question notification to admin
 */
export async function sendAdminNotification(params: {
  userName?: string;
  userEmail: string;
  questionText: string;
  category: string;
  tier: string;
  amountSats: number;
  questionId: string;
}): Promise<EmailResult> {
  if (!resend) {
    console.log('Email sending skipped (Resend not configured)');
    return { success: false, error: 'Resend not configured' };
  }

  return await sendEmailWithRetry({
    to: ADMIN_EMAIL,
    subject: `⚡ New Paid Question - ${params.category} - ${params.tier}`,
    html: newQuestionAdminTemplate(params),
    templateName: 'admin_notification',
  });
}

/**
 * Send answer delivered notification to user
 */
export async function sendAnswerDelivered(params: {
  userEmail: string;
  userName?: string;
  questionText: string;
  responseText: string;
  videoUrl?: string;
  tier: string;
}): Promise<EmailResult> {
  if (!resend) {
    console.log('Email sending skipped (Resend not configured)');
    return { success: false, error: 'Resend not configured' };
  }

  return await sendEmailWithRetry({
    to: params.userEmail,
    subject: '✅ Your Bitcoin Question has been Answered!',
    html: answerDeliveredTemplate(params),
    templateName: 'answer_delivered',
  });
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!resend;
}

// ============================================================================
// EMAIL LOGGING & RETRY LOGIC
// ============================================================================

/**
 * Check if email address has unsubscribed
 */
async function isEmailUnsubscribed(email: string): Promise<boolean> {
  try {
    const supabase = supabaseAdmin;
    const { data, error } = await supabase
      .from('email_preferences')
      .select('unsubscribed')
      .eq('email', email)
      .single();

    if (error || !data) {
      return false; // If no record exists, assume not unsubscribed
    }

    return data.unsubscribed === true;
  } catch (error) {
    console.error('Error checking unsubscribe status:', error);
    return false; // Fail open - allow email if check fails
  }
}

/**
 * Log email send attempt to database
 */
async function logEmailSend(params: {
  recipientEmail: string;
  templateName: string;
  subject: string;
  status: 'sent' | 'failed' | 'bounced' | 'complained' | 'delivered';
  messageId?: string;
  error?: string;
}): Promise<void> {
  try {
    const supabase = supabaseAdmin;
    await supabase.from('email_logs').insert({
      recipient_email: params.recipientEmail,
      template_name: params.templateName,
      subject: params.subject,
      status: params.status,
      message_id: params.messageId || null,
      error: params.error || null,
      sent_at: params.status === 'sent' ? new Date().toISOString() : null,
    });
  } catch (error) {
    console.error('Failed to log email send:', error);
    // Don't throw - logging should not break email sending
  }
}

/**
 * Send email with logging and unsubscribe check
 *
 * This wrapper adds:
 * - Unsubscribe status checking
 * - Database logging
 * - Error tracking
 */
async function sendEmailWithLogging(params: {
  to: string;
  subject: string;
  html: string;
  templateName: string;
}): Promise<EmailResult> {
  // Check unsubscribe status
  const unsubscribed = await isEmailUnsubscribed(params.to);
  if (unsubscribed) {
    console.log(`Email not sent to ${params.to} - user has unsubscribed`);
    await logEmailSend({
      recipientEmail: params.to,
      templateName: params.templateName,
      subject: params.subject,
      status: 'failed',
      error: 'User has unsubscribed',
    });
    return {
      success: false,
      error: 'User has unsubscribed from emails',
    };
  }

  try {
    const result = await resend!.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    // Log successful send
    await logEmailSend({
      recipientEmail: params.to,
      templateName: params.templateName,
      subject: params.subject,
      status: 'sent',
      messageId: result.data?.id,
    });

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error(`Failed to send ${params.templateName} email:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log failure
    await logEmailSend({
      recipientEmail: params.to,
      templateName: params.templateName,
      subject: params.subject,
      status: 'failed',
      error: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send email with retry logic
 *
 * Retries up to 3 times with exponential backoff:
 * - Attempt 1: immediate
 * - Attempt 2: wait 2 seconds
 * - Attempt 3: wait 4 seconds
 */
async function sendEmailWithRetry(params: {
  to: string;
  subject: string;
  html: string;
  templateName: string;
  maxRetries?: number;
}): Promise<EmailResult> {
  const maxRetries = params.maxRetries || 3;
  let lastError: string = '';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Wait before retry (exponential backoff)
    if (attempt > 1) {
      const waitMs = Math.pow(2, attempt - 1) * 1000; // 2s, 4s, 8s...
      await new Promise(resolve => setTimeout(resolve, waitMs));
      console.log(`Retrying email send (attempt ${attempt}/${maxRetries})...`);
    }

    const result = await sendEmailWithLogging(params);

    if (result.success) {
      if (attempt > 1) {
        console.log(`Email sent successfully on attempt ${attempt}`);
      }
      return result;
    }

    lastError = result.error || 'Unknown error';

    // Don't retry if user unsubscribed
    if (lastError.includes('unsubscribed')) {
      return result;
    }
  }

  console.error(`Failed to send email after ${maxRetries} attempts:`, lastError);
  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
  };
}

/**
 * Pre-payment confirmation email to user
 * Sent immediately after question submission, before payment
 */
function prePaymentConfirmationTemplate(data: {
  userEmail: string;
  userName?: string;
  questionText: string;
  amountSats: number;
  tier: string;
  invoiceUrl: string;
  qrCodeDataUrl: string;
  expiresAt: string;
}): string {
  const greeting = data.userName ? `Hi ${data.userName}` : 'Hello';
  const questionPreview = data.questionText.length > 200
    ? data.questionText.substring(0, 200) + '...'
    : data.questionText;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Payment - soundsfair</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #E5E5E5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px; text-align: center; background: linear-gradient(135deg, #FFD000 0%, #FFA500 100%);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #000000;">
                soundsfair
              </h1>
              <div style="margin-top: 8px; padding: 4px 12px; background-color: rgba(0,0,0,0.2); border-radius: 4px; display: inline-block;">
                <span style="font-size: 12px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  PAYMENT REQUIRED
                </span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; font-size: 18px; line-height: 1.6; color: #E5E5E5;">
                ${greeting},
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #B8B8B8;">
                Thank you for submitting your question! To complete your Q&A request, please pay the Lightning invoice below.
              </p>

              <!-- Info Box -->
              <div style="background-color: #2A2A2A; border-left: 4px solid #FFD000; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #888888;">Amount:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #FFD000; font-weight: 600; text-align: right;">${data.amountSats.toLocaleString()} sats</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #888888;">Tier:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #E5E5E5; text-align: right;">${data.tier}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-size: 14px; color: #888888;">Expires:</td>
                    <td style="padding: 4px 0; font-size: 14px; color: #FF6B6B; text-align: right;">${data.expiresAt}</td>
                  </tr>
                </table>
              </div>

              <!-- Question Preview -->
              <div style="background-color: #0D0D0D; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888888;">YOUR QUESTION</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #B8B8B8;">${questionPreview}</p>
              </div>

              <!-- QR Code -->
              <div style="text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #888888;">Scan with your Lightning wallet:</p>
                <img src="${data.qrCodeDataUrl}" alt="Lightning Invoice QR Code" style="max-width: 250px; border: 4px solid #FFD000; border-radius: 8px;" />
              </div>

              <!-- Payment Link -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${data.invoiceUrl}" style="display: inline-block; padding: 16px 32px; background-color: #FFD000; color: #000000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Pay with Lightning
                </a>
              </div>

              <!-- Important Note -->
              <div style="background-color: #2A1A00; border: 1px solid #FFD000; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #FFD000;">
                  ⚠️ <strong>Important:</strong> This invoice expires in 1 hour. If it expires, you'll need to submit your question again.
                </p>
              </div>

              <!-- What Happens Next -->
              <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #2A2A2A;">
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #FFD000;">What happens next?</p>
                <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #B8B8B8;">
                  <li>Pay the Lightning invoice above</li>
                  <li>You'll receive immediate payment confirmation</li>
                  <li>Your question enters our expert queue</li>
                  <li>Receive your answer within the guaranteed timeframe</li>
                </ol>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0D0D0D; border-top: 1px solid #2A2A2A; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #FFD000; font-weight: 600;">soundsfair</p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #888888;">Bitcoin Education & Expert Q&A</p>
              <p style="margin: 0; font-size: 11px; color: #666666;">
                © ${new Date().getFullYear()} soundsfair. All rights reserved.
              </p>
              ${unsubscribeFooter(data.userEmail)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Payment expiration email to user
 * Sent when Lightning invoice expires without payment
 */
function paymentExpiredTemplate(data: {
  userEmail: string;
  userName?: string;
  questionText: string;
  tier: string;
}): string {
  const greeting = data.userName ? `Hi ${data.userName}` : 'Hello';
  const questionPreview = data.questionText.length > 200
    ? data.questionText.substring(0, 200) + '...'
    : data.questionText;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Expired - soundsfair</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #E5E5E5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px; text-align: center; background: linear-gradient(135deg, #666666 0%, #333333 100%);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #E5E5E5;">
                soundsfair
              </h1>
              <div style="margin-top: 8px; padding: 4px 12px; background-color: rgba(255,255,255,0.1); border-radius: 4px; display: inline-block;">
                <span style="font-size: 12px; font-weight: 600; color: #FFD000; text-transform: uppercase; letter-spacing: 1px;">
                  INVOICE EXPIRED
                </span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px 0; font-size: 18px; line-height: 1.6; color: #E5E5E5;">
                ${greeting},
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #B8B8B8;">
                Your Lightning invoice has expired without payment. Don't worry - your question is still important to us!
              </p>

              <!-- Question Preview -->
              <div style="background-color: #0D0D0D; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888888;">YOUR QUESTION (${data.tier})</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #B8B8B8;">${questionPreview}</p>
              </div>

              <!-- What to do -->
              <div style="background-color: #2A2A2A; border-left: 4px solid #FFD000; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #FFD000;">To get your answer:</p>
                <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #B8B8B8;">
                  <li>Visit our Q&A page and resubmit your question</li>
                  <li>A new Lightning invoice will be generated</li>
                  <li>Complete payment within 1 hour</li>
                  <li>Receive your expert answer on time</li>
                </ol>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${SITE_URL}/qa" style="display: inline-block; padding: 16px 32px; background-color: #FFD000; color: #000000; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
                  Submit Question Again
                </a>
              </div>

              <!-- Tip -->
              <div style="background-color: #0D1F0D; border: 1px solid #4CAF50; padding: 16px; border-radius: 4px; margin-top: 24px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #A8D5A8;">
                  💡 <strong>Tip:</strong> Lightning invoices expire after 1 hour for security. Have your Lightning wallet ready before submitting to ensure smooth payment!
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0D0D0D; border-top: 1px solid #2A2A2A; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #FFD000; font-weight: 600;">soundsfair</p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #888888;">Bitcoin Education & Expert Q&A</p>
              <p style="margin: 0; font-size: 11px; color: #666666;">
                © ${new Date().getFullYear()} soundsfair. All rights reserved.
              </p>
              ${unsubscribeFooter(data.userEmail)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Send pre-payment confirmation email
 */
export async function sendPrePaymentConfirmation(data: {
  userEmail: string;
  userName?: string;
  questionText: string;
  amountSats: number;
  tier: string;
  invoiceUrl: string;
  qrCodeDataUrl: string;
  expiresAt: string;
}): Promise<EmailResult> {
  if (!isEmailConfigured()) {
    console.warn('Email not configured - skipping pre-payment confirmation');
    return { success: false, error: 'Email service not configured' };
  }

  return await sendEmailWithRetry({
    to: data.userEmail,
    subject: '⚡ Complete Your Payment - soundsfair Q&A',
    html: prePaymentConfirmationTemplate(data),
    templateName: 'pre_payment_confirmation',
  });
}

/**
 * Send payment expiration email
 */
export async function sendPaymentExpired(data: {
  userEmail: string;
  userName?: string;
  questionText: string;
  tier: string;
}): Promise<EmailResult> {
  if (!isEmailConfigured()) {
    console.warn('Email not configured - skipping payment expiration email');
    return { success: false, error: 'Email service not configured' };
  }

  return await sendEmailWithRetry({
    to: data.userEmail,
    subject: 'Your Lightning Invoice Expired - soundsfair',
    html: paymentExpiredTemplate(data),
    templateName: 'payment_expired',
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export const emailService = {
  sendPaymentConfirmation,
  sendAdminNotification,
  sendAnswerDelivered,
  sendPrePaymentConfirmation,
  sendPaymentExpired,
  isConfigured: isEmailConfigured,
};

export default emailService;
