/**
 * Validation Schemas using Zod
 *
 * Type-safe validation for Q&A forms and API endpoints
 */

import { z } from 'zod';
import type { QuestionCategory, PricingTier } from '@/app/types/qa';

// ============================================================================
// QUESTION CATEGORY & PRICING TIER SCHEMAS
// ============================================================================

export const questionCategorySchema = z.enum([
  'technical',
  'economics',
  'security',
  'getting-started',
  'geopolitics',
]);

export const pricingTierSchema = z.enum(['quick', 'detailed', 'video']);

// ============================================================================
// SUBMIT QUESTION SCHEMA
// ============================================================================

export const submitQuestionSchema = z.object({
  userEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email is too long')
    .trim()
    .toLowerCase(),

  userName: z
    .string()
    .max(100, 'Name is too long')
    .trim()
    .optional()
    .transform((val) => val || undefined),

  category: questionCategorySchema,

  questionText: z
    .string()
    .min(20, 'Question must be at least 20 characters')
    .max(5000, 'Question must be less than 5000 characters')
    .trim()
    .refine(
      (text) => text.split(/\s+/).length >= 5,
      'Question must contain at least 5 words'
    ),

  pricingTier: pricingTierSchema,

  publishToArchive: z.boolean().default(false),
});

export type SubmitQuestionInput = z.infer<typeof submitQuestionSchema>;

// ============================================================================
// FILE UPLOAD VALIDATION
// ============================================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'text/plain',
  'application/pdf',
];

export const fileUploadSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: 'File size must be less than 10MB',
  })
  .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
    message: 'File type not allowed. Allowed: images, PDF, text files',
  });

export const fileUploadArraySchema = z
  .array(fileUploadSchema)
  .max(3, 'Maximum 3 files allowed')
  .optional();

// ============================================================================
// PAYMENT STATUS SCHEMA
// ============================================================================

export const paymentStatusSchema = z.object({
  questionId: z.string().uuid('Invalid question ID'),
});

// ============================================================================
// ADMIN QUEUE SCHEMA
// ============================================================================

export const adminQueueSchema = z.object({
  status: z
    .union([
      z.enum([
        'awaiting_payment',
        'payment_expired',
        'in_queue',
        'in_progress',
        'answered',
        'archived',
      ]),
      z.array(
        z.enum([
          'awaiting_payment',
          'payment_expired',
          'in_queue',
          'in_progress',
          'answered',
          'archived',
        ])
      ),
    ])
    .optional(),

  category: questionCategorySchema.optional(),

  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(50),

  offset: z.number().int().min(0, 'Offset must be non-negative').default(0),
});

export type AdminQueueInput = z.infer<typeof adminQueueSchema>;

// ============================================================================
// SUBMIT ANSWER SCHEMA
// ============================================================================

export const submitAnswerSchema = z
  .object({
    questionId: z.string().uuid('Invalid question ID'),

    responseText: z
      .string()
      .min(50, 'Response must be at least 50 characters')
      .max(50000, 'Response must be less than 50,000 characters')
      .trim()
      .optional(),

    responseVideoUrl: z
      .string()
      .url('Invalid video URL')
      .max(500, 'URL is too long')
      .trim()
      .optional(),

    publishToArchive: z.boolean().default(false),
  })
  .refine(
    (data) => data.responseText || data.responseVideoUrl,
    {
      message: 'Either response text or video URL must be provided',
      path: ['responseText'],
    }
  );

export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

// ============================================================================
// OPENNODE WEBHOOK SCHEMA
// ============================================================================

export const openNodeWebhookSchema = z.object({
  id: z.string(),
  status: z.enum(['paid', 'processing', 'expired', 'underpaid', 'pending']),
  order_id: z.string(), // Our invoice_id
  amount: z.number(), // Sats
  callback_url: z.string().url().optional(),
  created_at: z.number(), // Unix timestamp
  hashed_order: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  source_fiat_value: z.number().optional(),
  fiat_value: z.number().optional(),
  auto_settle: z.boolean().optional(),
  notif_email: z.string().email().optional(),
  address: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  chain_invoice: z
    .object({
      address: z.string(),
    })
    .optional(),
  lightning_invoice: z
    .object({
      expires_at: z.number(),
      payreq: z.string(), // BOLT11
    })
    .optional(),
  transactions: z
    .array(
      z.object({
        tx_id: z.string(),
        amount: z.number(),
        confirmations: z.number(),
      })
    )
    .optional(),
});

export type OpenNodeWebhookInput = z.infer<typeof openNodeWebhookSchema>;

// ============================================================================
// ARCHIVE FILTER SCHEMA
// ============================================================================

export const archiveFilterSchema = z.object({
  category: questionCategorySchema.optional(),

  search: z
    .string()
    .max(200, 'Search query is too long')
    .trim()
    .optional(),

  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),

  offset: z.number().int().min(0, 'Offset must be non-negative').default(0),
});

export type ArchiveFilterInput = z.infer<typeof archiveFilterSchema>;

// ============================================================================
// ADMIN AUTH SCHEMA
// ============================================================================

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .trim()
    .toLowerCase(),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safe parse with formatted errors
 *
 * Returns either validated data or formatted error messages
 */
export function safeParse<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format Zod errors into user-friendly messages
  const errors: Record<string, string> = {};
  result.error.issues.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });

  return { success: false, errors };
}

/**
 * Validate question text for spam/abuse
 *
 * Basic spam detection - can be enhanced with more sophisticated checks
 */
export function validateQuestionContent(text: string): {
  valid: boolean;
  reason?: string;
} {
  const lowerText = text.toLowerCase();

  // Check for excessive repetition
  const words = text.split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
    return { valid: false, reason: 'Question contains too much repetition' };
  }

  // Check for excessive caps
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  if (capsCount / text.length > 0.5 && text.length > 20) {
    return { valid: false, reason: 'Please avoid excessive capitalization' };
  }

  // Check for common spam patterns
  const spamPatterns = [
    /click here/i,
    /buy now/i,
    /limited time/i,
    /act now/i,
    /http[s]?:\/\/bit\.ly/i, // Shortened URLs
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      return { valid: false, reason: 'Question appears to contain spam' };
    }
  }

  return { valid: true };
}

/**
 * Sanitize user input
 *
 * Remove potentially harmful characters while preserving meaningful content
 */
export function sanitizeInput(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove angle brackets (prevent HTML injection)
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}
