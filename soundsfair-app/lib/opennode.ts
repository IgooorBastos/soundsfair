/**
 * OpenNode API Integration
 *
 * Handles Lightning Network payment invoice creation and verification via OpenNode
 */

import axios, { AxiosError } from 'axios';
import QRCode from 'qrcode';

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENNODE_API_URL = 'https://api.opennode.com/v1';
const OPENNODE_API_KEY = process.env.OPENNODE_API_KEY;
const OPENNODE_WEBHOOK_SECRET = process.env.OPENNODE_WEBHOOK_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

if (!OPENNODE_API_KEY) {
  console.warn('⚠️ OPENNODE_API_KEY is not set. Payment functionality will be disabled.');
}

// ============================================================================
// TYPES
// ============================================================================

export interface CreateInvoiceParams {
  amount: number; // Amount in satoshis
  description: string;
  orderId: string; // Unique identifier for this payment (question ID)
  customerEmail?: string;
  callbackUrl?: string;
}

export interface OpenNodeInvoice {
  id: string;
  order_id: string;
  amount: number; // Sats
  status: 'unpaid' | 'paid' | 'processing' | 'expired' | 'underpaid';
  description: string;
  lightning_invoice: {
    expires_at: number; // Unix timestamp
    payreq: string; // BOLT11 invoice
  };
  hosted_checkout_url: string;
  created_at: number; // Unix timestamp
  chain_invoice?: {
    address: string;
  };
}

export interface OpenNodeChargeResponse {
  data: OpenNodeInvoice;
}

export interface CreateInvoiceResult {
  success: boolean;
  invoice?: {
    invoiceId: string;
    invoiceUrl: string;
    lightningInvoice: string;
    qrCodeDataUrl: string;
    amountSats: number;
    expiresAt: Date;
  };
  error?: string;
}

export interface VerifyWebhookResult {
  valid: boolean;
  payload?: OpenNodeInvoice;
  error?: string;
}

// ============================================================================
// OPENNODE API CLIENT
// ============================================================================

/**
 * Create a Lightning Network invoice via OpenNode
 */
export async function createInvoice(
  params: CreateInvoiceParams
): Promise<CreateInvoiceResult> {
  if (!OPENNODE_API_KEY) {
    return {
      success: false,
      error: 'OpenNode API key is not configured',
    };
  }

  try {
    const response = await axios.post<OpenNodeChargeResponse>(
      `${OPENNODE_API_URL}/charges`,
      {
        amount: params.amount,
        description: params.description,
        order_id: params.orderId,
        currency: 'SAT',
        auto_settle: false, // Keep as Bitcoin
        callback_url: params.callbackUrl || `${SITE_URL}/api/webhooks/opennode`,
        success_url: `${SITE_URL}/qa/payment-success?id=${params.orderId}`,
        customer_email: params.customerEmail,
        ttl: 60, // Invoice expires in 60 minutes
      },
      {
        headers: {
          'Authorization': OPENNODE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const invoice = response.data.data;

    // Generate QR code for the Lightning invoice
    const qrCodeDataUrl = await QRCode.toDataURL(
      invoice.lightning_invoice.payreq,
      {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFD000', // Libertarian gold background
        },
      }
    );

    return {
      success: true,
      invoice: {
        invoiceId: invoice.id,
        invoiceUrl: invoice.hosted_checkout_url,
        lightningInvoice: invoice.lightning_invoice.payreq,
        qrCodeDataUrl,
        amountSats: invoice.amount,
        expiresAt: new Date(invoice.lightning_invoice.expires_at * 1000),
      },
    };
  } catch (error) {
    console.error('OpenNode createInvoice error:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.response?.data
          ? JSON.stringify(axiosError.response.data)
          : axiosError.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch invoice status from OpenNode
 */
export async function getInvoiceStatus(
  invoiceId: string
): Promise<{ success: boolean; status?: OpenNodeInvoice['status']; invoice?: OpenNodeInvoice; error?: string }> {
  if (!OPENNODE_API_KEY) {
    return {
      success: false,
      error: 'OpenNode API key is not configured',
    };
  }

  try {
    const response = await axios.get<OpenNodeChargeResponse>(
      `${OPENNODE_API_URL}/charge/${invoiceId}`,
      {
        headers: {
          'Authorization': OPENNODE_API_KEY,
        },
      }
    );

    return {
      success: true,
      status: response.data.data.status,
      invoice: response.data.data,
    };
  } catch (error) {
    console.error('OpenNode getInvoiceStatus error:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: axiosError.response?.data
          ? JSON.stringify(axiosError.response.data)
          : axiosError.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify webhook signature from OpenNode
 *
 * OpenNode sends webhooks with a signature header for verification
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  if (!OPENNODE_WEBHOOK_SECRET) {
    console.error('❌ OPENNODE_WEBHOOK_SECRET is required for webhook verification');
    throw new Error('OPENNODE_WEBHOOK_SECRET must be configured for security');
  }

  // OpenNode uses HMAC-SHA256 for webhook signatures
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', OPENNODE_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
}

/**
 * Parse and validate OpenNode webhook payload
 */
export function parseWebhookPayload(body: any): VerifyWebhookResult {
  try {
    // OpenNode webhook structure
    if (!body || typeof body !== 'object') {
      return {
        valid: false,
        error: 'Invalid webhook payload format',
      };
    }

    // Validate required fields
    if (!body.id || !body.status || !body.order_id) {
      return {
        valid: false,
        error: 'Missing required webhook fields',
      };
    }

    return {
      valid: true,
      payload: body as OpenNodeInvoice,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to parse webhook',
    };
  }
}

/**
 * Get BTC amount from satoshis
 */
export function satsToBtc(sats: number): number {
  return sats / 100000000;
}

/**
 * Get satoshis from BTC amount
 */
export function btcToSats(btc: number): number {
  return Math.round(btc * 100000000);
}

/**
 * Format satoshi amount for display
 */
export function formatSats(sats: number): string {
  return new Intl.NumberFormat('en-US').format(sats) + ' sats';
}

/**
 * Check if OpenNode is properly configured
 */
export function isOpenNodeConfigured(): boolean {
  return !!OPENNODE_API_KEY;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const openNodeClient = {
  createInvoice,
  getInvoiceStatus,
  verifyWebhookSignature,
  parseWebhookPayload,
  isConfigured: isOpenNodeConfigured,
};

export default openNodeClient;
