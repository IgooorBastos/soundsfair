/**
 * Q&A System Type Definitions
 *
 * TypeScript types for the Lightning Network paid Q&A feature
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type QuestionCategory =
  | 'technical'
  | 'economics'
  | 'security'
  | 'getting-started'
  | 'geopolitics';

export type PricingTier = 'quick' | 'detailed' | 'video';

export type QuestionStatus =
  | 'awaiting_payment'
  | 'payment_expired'
  | 'in_queue'
  | 'in_progress'
  | 'answered'
  | 'archived';

export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'failed';

export type PaymentProviderStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'expired'
  | 'underpaid'
  | 'failed';

export type AdminRole = 'admin' | 'super_admin';

// ============================================================================
// DATABASE MODELS
// ============================================================================

export interface Question {
  id: string;
  user_email: string;
  user_name?: string;
  category: QuestionCategory;
  question_text: string;
  pricing_tier: PricingTier;
  payment_id?: string;
  payment_status: PaymentStatus;
  amount_sats: number;
  status: QuestionStatus;
  priority: number;
  response_text?: string;
  response_video_url?: string;
  responded_at?: string;
  responded_by?: string;
  publish_to_archive: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  attachment_urls?: string[];
}

export interface Payment {
  id: string;
  invoice_id: string;
  invoice_url: string;
  lightning_invoice: string;
  amount_sats: number;
  amount_btc: number;
  amount_usd?: number;
  status: PaymentProviderStatus;
  paid_at?: string;
  expires_at: string;
  webhook_received: boolean;
  webhook_signature?: string;
  webhook_payload?: Record<string, any>;
  created_at: string;
  updated_at: string;
  refunded: boolean;
  refund_reason?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  created_at: string;
  last_login?: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  display_order: number;
}

export interface PricingTierData {
  id: PricingTier;
  name: string;
  description: string;
  amount_sats: number;
  response_time_hours: number;
  response_format: string;
  display_order: number;
  active: boolean;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

// Submit Question Request
export interface SubmitQuestionRequest {
  userEmail: string;
  userName?: string;
  category: QuestionCategory;
  questionText: string;
  pricingTier: PricingTier;
  publishToArchive?: boolean;
  // Note: attachments handled separately via multipart/form-data
}

// Submit Question Response
export interface SubmitQuestionResponse {
  success: true;
  questionId: string;
  payment: {
    invoiceId: string;
    invoiceUrl: string;
    lightningInvoice: string;
    qrCodeData: string; // Base64 encoded QR code image
    amountSats: number;
    expiresAt: string; // ISO timestamp
  };
}

// Payment Status Response
export interface PaymentStatusResponse {
  questionId: string;
  paymentStatus: PaymentStatus;
  questionStatus: QuestionStatus;
  answered?: {
    responseText: string;
    videoUrl?: string;
    answeredAt: string;
  };
}

// Admin Queue Request
export interface AdminQueueRequest {
  status?: QuestionStatus | QuestionStatus[];
  category?: QuestionCategory;
  limit?: number;
  offset?: number;
}

// Admin Queue Response
export interface AdminQueueResponse {
  questions: QuestionWithDetails[];
  total: number;
  hasMore: boolean;
}

// Submit Answer Request
export interface SubmitAnswerRequest {
  questionId: string;
  responseText?: string;
  responseVideoUrl?: string;
  publishToArchive?: boolean;
}

// Submit Answer Response
export interface SubmitAnswerResponse {
  success: true;
  questionId: string;
}

// ============================================================================
// EXTENDED TYPES (WITH JOINS)
// ============================================================================

export interface QuestionWithDetails extends Question {
  category_name: string;
  category_icon?: string;
  tier_name: string;
  response_time_hours: number;
  paid_at?: string;
}

export interface PublicQAArchiveItem {
  id: string;
  category: QuestionCategory;
  question_text: string;
  response_text: string;
  response_video_url?: string;
  pricing_tier: PricingTier;
  amount_sats: number;
  published_at: string;
  created_at: string;
  category_name: string;
  category_icon?: string;
  tier_name: string;
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

// OpenNode Webhook Payload
export interface OpenNodeWebhookPayload {
  id: string;
  status: 'paid' | 'processing' | 'expired' | 'underpaid';
  order_id: string; // Our invoice_id
  amount: number; // Sats
  callback_url?: string;
  created_at: number; // Unix timestamp
  hashed_order?: string;
  description?: string;
  price?: number;
  currency?: string;
  source_fiat_value?: number;
  fiat_value?: number;
  auto_settle?: boolean;
  notif_email?: string;
  address?: string;
  metadata?: Record<string, any>;
  chain_invoice?: {
    address: string;
  };
  lightning_invoice?: {
    expires_at: number;
    payreq: string; // BOLT11
  };
  transactions?: Array<{
    tx_id: string;
    amount: number;
    confirmations: number;
  }>;
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

export interface QuestionStats {
  total_questions: number;
  paid_questions: number;
  answered_questions: number;
  in_queue: number;
  total_revenue_sats: number;
  avg_response_time_hours: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface QAFormData {
  userEmail: string;
  userName: string;
  category: QuestionCategory;
  questionText: string;
  pricingTier: PricingTier;
  publishToArchive: boolean;
  attachments?: File[];
}

export interface QAFormErrors {
  userEmail?: string;
  userName?: string;
  category?: string;
  questionText?: string;
  pricingTier?: string;
  attachments?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface APIError {
  success: false;
  error: string;
  details?: string;
  code?: string;
}

export type APIResponse<T> = T | APIError;

// Type guard for API errors
export function isAPIError(response: any): response is APIError {
  return response && response.success === false && 'error' in response;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const QUESTION_CATEGORIES: Record<
  QuestionCategory,
  { name: string; icon: string; description: string }
> = {
  technical: {
    name: 'Technical',
    icon: '⚙️',
    description: 'Bitcoin protocol, wallets, transactions, mining',
  },
  economics: {
    name: 'Economics',
    icon: '💰',
    description: 'Monetary policy, inflation, store of value',
  },
  security: {
    name: 'Security',
    icon: '🔒',
    description: 'Best practices, privacy, hardware wallets',
  },
  'getting-started': {
    name: 'Getting Started',
    icon: '🚀',
    description: 'Beginner questions, how to buy Bitcoin',
  },
  geopolitics: {
    name: 'Geopolitics',
    icon: '🌍',
    description: 'Regulations, nation-states, adoption',
  },
};

export const PRICING_TIERS: Record<
  PricingTier,
  { name: string; sats: number; hours: number; format: string; description: string }
> = {
  quick: {
    name: 'Quick Answer',
    sats: 1000,
    hours: 24,
    format: 'text',
    description: '1-2 paragraph response within 24 hours',
  },
  detailed: {
    name: 'Detailed Answer',
    sats: 5000,
    hours: 48,
    format: 'text',
    description: 'Comprehensive response within 48 hours',
  },
  video: {
    name: 'Video Response',
    sats: 20000,
    hours: 168,
    format: 'video',
    description: 'Personalized video explanation within 1 week',
  },
};

export const QUESTION_STATUS_LABELS: Record<QuestionStatus, string> = {
  awaiting_payment: 'Awaiting Payment',
  payment_expired: 'Payment Expired',
  in_queue: 'In Queue',
  in_progress: 'In Progress',
  answered: 'Answered',
  archived: 'Archived',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  expired: 'Expired',
  failed: 'Failed',
};
