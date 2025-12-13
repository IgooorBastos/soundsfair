/**
 * Email Service using Resend
 *
 * Handles all email notifications for the Q&A system
 */

import { Resend } from 'resend';

// ============================================================================
// CONFIGURATION
// ============================================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'bitcoinnalata@proton.me';
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
 * Payment confirmation email to user
 */
function paymentConfirmationTemplate(data: {
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

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.userEmail,
      subject: '⚡ Payment Confirmed - Your Question is in Queue',
      html: paymentConfirmationTemplate(params),
    });

    if (error) {
      console.error('Failed to send payment confirmation email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Payment confirmation email sent:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Unexpected error sending payment confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
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

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⚡ New Paid Question - ${params.category} - ${params.tier}`,
      html: newQuestionAdminTemplate(params),
    });

    if (error) {
      console.error('Failed to send admin notification email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Admin notification email sent:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Unexpected error sending admin notification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
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

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.userEmail,
      subject: '✅ Your Bitcoin Question has been Answered!',
      html: answerDeliveredTemplate(params),
    });

    if (error) {
      console.error('Failed to send answer delivered email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Answer delivered email sent:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Unexpected error sending answer delivered email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!resend;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const emailService = {
  sendPaymentConfirmation,
  sendAdminNotification,
  sendAnswerDelivered,
  isConfigured: isEmailConfigured,
};

export default emailService;
