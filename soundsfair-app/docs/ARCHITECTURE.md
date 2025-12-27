# soundsfair Platform Architecture

**Version:** 0.1.0
**Last Updated:** December 27, 2025
**Status:** ✅ Production Ready (Deployed on Vercel)

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Database Schema](#database-schema)
5. [API Routes](#api-routes)
6. [Authentication & Authorization](#authentication--authorization)
7. [Payment Flow](#payment-flow)
8. [Email System](#email-system)
9. [State Management](#state-management)
10. [Key Architectural Patterns](#key-architectural-patterns)
11. [Security Measures](#security-measures)
12. [Performance Optimizations](#performance-optimizations)

---

## Overview

**soundsfair** is a Bitcoin education platform combining:
- **9-level progressive course** on Bitcoin, economics, and financial freedom
- **Interactive Bitcoin tools** (DCA calculator, converters, halving countdown)
- **Lightning-paid Q&A system** for expert Bitcoin answers
- **Quiz-based gamification** with XP and progress tracking

### Design Philosophy

- **Education-first:** All content freely accessible, no paywalls
- **Bitcoin-native:** Lightning Network payments, Bitcoin price integrations
- **Privacy-focused:** Minimal data collection, no tracking cookies
- **Performance:** Static generation where possible, optimized for mobile
- **Accessibility:** WCAG AA compliant, keyboard navigation, semantic HTML

---

## Tech Stack

### Frontend

- **Framework:** Next.js 16.1.0 (App Router)
- **Bundler:** Turbopack (development) + Webpack (production)
- **Runtime:** React 19.2.0
- **Language:** TypeScript ^5 (strict mode)
- **Styling:** Tailwind CSS 3.4.17 + Custom Design System
- **UI Components:** Custom React components
- **Charts:** Recharts 3.6.0
- **Forms:** Native HTML forms with Zod 4.1.13 validation
- **State:** React hooks + localStorage for client state

### Backend

- **Runtime:** Node.js (via Next.js API routes / Vercel serverless)
- **Database:** Supabase 2.89.0 (PostgreSQL with Row Level Security)
- **Client:** @supabase/supabase-js 2.89.0
- **Validation:** Zod 4.1.13 schemas
- **API Architecture:** RESTful API routes (17 endpoints)

### Third-Party Services

- **Payments:** OpenNode API v1 (Lightning Network - DEV/Testnet)
- **Email:** Resend 6.5.2 (transactional emails with webhooks)
- **Price Data:** CoinGecko API with CoinCap/Mock fallbacks
- **Hosting:** Vercel (Production - https://soundsfair.vercel.app/)
- **Database:** Supabase (hosted PostgreSQL with real-time capabilities)

### Development Tools

- **Package Manager:** npm
- **Linter:** ESLint
- **Formatter:** Prettier
- **Type Checking:** TypeScript strict mode
- **Git Hooks:** None (manual pre-commit checks)

---

## Directory Structure

```
soundsfair-app/
├── app/                          # Next.js 16 App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/                # User login page
│   │   └── profile/              # User profile (future)
│   ├── admin/                    # Admin dashboard
│   │   ├── login/                # Admin login
│   │   └── queue/                # Question queue management
│   ├── api/                      # API routes (serverless functions)
│   │   ├── admin/                # Admin API endpoints
│   │   │   ├── login/            # Admin authentication
│   │   │   ├── logout/           # Admin logout
│   │   │   ├── questions/        # Question management
│   │   │   └── questions/[id]/answer/ # Answer submission
│   │   ├── bitcoin/              # Bitcoin data APIs
│   │   │   ├── fear-greed/       # Fear & Greed Index
│   │   │   ├── halving/          # Halving countdown
│   │   │   ├── historical/       # Historical price data
│   │   │   └── price/            # Current price
│   │   ├── dca/                  # DCA calculator
│   │   │   └── calculate/        # Calculation endpoint
│   │   ├── prices/               # Multi-asset price feed
│   │   ├── progress/             # User progress sync
│   │   │   ├── pull/             # Pull user progress
│   │   │   └── sync/             # Sync progress updates
│   │   ├── qa/                   # Q&A system
│   │   │   ├── payment-status/   # Check payment status
│   │   │   └── submit/           # Submit question + create invoice
│   │   ├── unsubscribe/          # Email unsubscribe
│   │   └── webhooks/             # External webhooks
│   │       ├── opennode/         # Payment webhooks
│   │       └── resend/           # Email delivery webhooks
│   ├── faq/                      # FAQ page
│   ├── glossary/                 # Bitcoin glossary
│   ├── lessons/                  # Course lessons
│   │   ├── [slug]/               # Individual lesson pages
│   │   ├── LessonsListClient.tsx # Lesson list component
│   │   └── page.tsx              # Lessons index
│   ├── qa/                       # Q&A landing page
│   ├── tools/                    # Bitcoin tools hub
│   │   ├── dca/                  # DCA calculator
│   │   ├── fear-greed-index/     # Fear & Greed Index
│   │   ├── halving-countdown/    # Bitcoin halving countdown
│   │   ├── satoshi-converter/    # Satoshi converter
│   │   └── what-if-calculator/   # Investment comparison
│   ├── unsubscribe/              # Email unsubscribe page
│   ├── error.tsx                 # Global error boundary
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout with metadata
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Homepage
├── components/                   # Reusable React components
│   ├── admin/                    # Admin-specific components
│   ├── dca/                      # DCA calculator components
│   ├── layout/                   # Layout components (Header, Footer)
│   ├── lesson/                   # Lesson components
│   ├── progress/                 # Progress tracking components
│   ├── qa/                       # Q&A form components
│   ├── tools/                    # Bitcoin tools components
│   └── ui/                       # Generic UI components
├── content/                      # Markdown content
│   ├── lessons/                  # 9 lesson markdown files
│   │   ├── level-1-fiat-system.md
│   │   ├── level-2-banking-debt.md
│   │   └── ... (9 total)
│   └── glossary.json             # Bitcoin terminology
├── lib/                          # Utility libraries
│   ├── admin-auth.ts             # Admin session management
│   ├── charts/                   # Chart calculation utilities
│   ├── coingecko.ts              # CoinGecko API client
│   ├── csrf.ts                   # CSRF token generation
│   ├── email.ts                  # Email templates + sending
│   ├── hooks/                    # Custom React hooks
│   ├── markdown.ts               # Markdown parsing utilities
│   ├── opennode.ts               # OpenNode Lightning API
│   ├── progress.ts               # Progress tracking logic
│   ├── quiz-parser.ts            # Quiz markdown parser
│   ├── rate-limit.ts             # Rate limiting (in-memory)
│   ├── supabase-admin.ts         # Supabase admin client
│   ├── supabase.ts               # Supabase client
│   ├── types.ts                  # Shared TypeScript types
│   └── validation.ts             # Zod validation schemas
├── public/                       # Static assets
│   ├── fonts/                    # Custom fonts
│   ├── images/                   # Static images
│   └── og/                       # Open Graph images (placeholders)
├── supabase/                     # Supabase configuration
│   └── migrations/               # Database migrations (SQL)
│       ├── 001_initial.sql       # Initial schema
│       ├── 002_payment_system.sql # Payment tables
│       ├── 003_csrf_tokens.sql   # CSRF protection
│       ├── 004_quiz_responses.sql # Quiz tracking
│       ├── 005_admin_audit.sql   # Audit logging
│       └── 006_email_system.sql  # Email logs + preferences
├── .env.local                    # Environment variables (gitignored)
├── .eslintrc.json                # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── CLAUDE.md                     # AI coding assistant instructions
```

---

## Database Schema

### Overview

PostgreSQL database hosted on Supabase with **10 tables**:
- Core Q&A system (payments, questions)
- Email system (email_logs, email_preferences)
- Admin system (admin_users, admin_audit_log, csrf_tokens)
- User learning (quiz_responses, user_progress, lesson_progress)

### 1. `payments`

Stores Lightning invoice and payment status.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `invoice_id` | TEXT | OpenNode invoice ID |
| `invoice_url` | TEXT | Payment URL |
| `lightning_invoice` | TEXT | Lightning invoice (BOLT11) |
| `amount_sats` | INTEGER | Amount in satoshis |
| `amount_btc` | NUMERIC | Amount in BTC |
| `status` | TEXT | `pending`, `paid`, `expired`, `underpaid` |
| `expires_at` | TIMESTAMPTZ | Invoice expiration |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

**Indexes:**
- `idx_payments_invoice_id` on `invoice_id`
- `idx_payments_status` on `status`

### 2. `questions`

Stores Q&A questions linked to payments.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_email` | TEXT | Submitter email |
| `user_name` | TEXT | Submitter name |
| `category` | TEXT | Question category |
| `question_text` | TEXT | Question content |
| `answer_text` | TEXT | Admin answer (nullable) |
| `answer_video_url` | TEXT | Optional video answer (nullable) |
| `pricing_tier` | TEXT | `quick`, `standard`, `deep-dive` |
| `amount_sats` | INTEGER | Payment amount |
| `payment_id` | UUID | FK to `payments.id` |
| `payment_status` | TEXT | `pending`, `paid`, `expired` |
| `status` | TEXT | `awaiting_payment`, `paid`, `answered`, `payment_expired` |
| `publish_to_archive` | BOOLEAN | Public archive consent |
| `answered_at` | TIMESTAMPTZ | Answer timestamp (nullable) |
| `created_at` | TIMESTAMPTZ | Submission timestamp |

**Indexes:**
- `idx_questions_payment_id` on `payment_id`
- `idx_questions_status` on `status`
- `idx_questions_payment_status` on `payment_status`

### 3. `email_logs`

Tracks all outgoing emails for auditing and deliverability.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `recipient_email` | TEXT | Recipient address |
| `template_name` | TEXT | Email template used |
| `subject` | TEXT | Email subject |
| `status` | TEXT | `sent`, `delivered`, `bounced`, `complained` |
| `message_id` | TEXT | Resend message ID |
| `error` | TEXT | Error message (nullable) |
| `sent_at` | TIMESTAMPTZ | Delivery timestamp (nullable) |
| `created_at` | TIMESTAMPTZ | Log creation timestamp |

**Indexes:**
- `idx_email_logs_recipient` on `recipient_email`
- `idx_email_logs_status` on `status`
- `idx_email_logs_created_at` on `created_at DESC`

### 4. `email_preferences`

User email subscription preferences.

| Column | Type | Description |
|--------|------|-------------|
| `email` | TEXT | Primary key |
| `unsubscribed` | BOOLEAN | Unsubscribe status |
| `unsubscribed_at` | TIMESTAMPTZ | Unsubscribe timestamp (nullable) |
| `unsubscribe_reason` | TEXT | Reason (nullable) |
| `preferences` | JSONB | Additional preferences |

### 5. `admin_audit_log`

Audit log for admin actions (security).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `admin_email` | TEXT | Admin identifier |
| `action` | TEXT | Action type (e.g., `login`, `answer_question`) |
| `resource_type` | TEXT | Resource affected (nullable) |
| `resource_id` | TEXT | Resource ID (nullable) |
| `ip_address` | TEXT | Request IP |
| `user_agent` | TEXT | Browser user agent |
| `metadata` | JSONB | Additional context |
| `created_at` | TIMESTAMPTZ | Action timestamp |

**Indexes:**
- `idx_audit_admin_email` on `admin_email`
- `idx_audit_action` on `action`
- `idx_audit_created_at` on `created_at DESC`

### 6. `csrf_tokens`

CSRF protection tokens for admin mutations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `token` | TEXT | CSRF token (unique) |
| `admin_session_id` | TEXT | Session identifier |
| `expires_at` | TIMESTAMPTZ | Token expiration |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

**Indexes:**
- `idx_csrf_token` on `token`

### 7. `quiz_responses`

Stores user quiz submissions for progress tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | TEXT | Anonymous user identifier |
| `lesson_slug` | TEXT | Lesson slug |
| `score` | INTEGER | Score (0-100) |
| `total_questions` | INTEGER | Total questions |
| `correct_answers` | INTEGER | Correct count |
| `answers` | JSONB | Full answer data |
| `created_at` | TIMESTAMPTZ | Submission timestamp |

**Indexes:**
- `idx_quiz_user_lesson` on `user_id, lesson_slug`

### 8. `admin_users`

Admin authentication and access control.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | TEXT | Admin email (unique) |
| `password_hash` | TEXT | Bcrypt password hash |
| `role` | TEXT | Admin role (e.g., `super_admin`, `moderator`) |
| `is_active` | BOOLEAN | Account status |
| `last_login_at` | TIMESTAMPTZ | Last login timestamp (nullable) |
| `created_at` | TIMESTAMPTZ | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- `idx_admin_users_email` on `email` (unique)
- `idx_admin_users_is_active` on `is_active`

**Row Level Security (RLS):**
- RLS disabled for admin operations (admin bypasses RLS via service role key)

### 9. `user_progress`

Tracks overall user learning progress across the platform.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | TEXT | Anonymous user identifier |
| `total_lessons_completed` | INTEGER | Count of completed lessons |
| `total_quizzes_passed` | INTEGER | Count of passed quizzes |
| `current_level` | INTEGER | User level (1-10) |
| `total_xp` | INTEGER | Total experience points |
| `streak_days` | INTEGER | Current learning streak |
| `last_activity_at` | TIMESTAMPTZ | Last learning activity |
| `created_at` | TIMESTAMPTZ | Progress tracking start |
| `updated_at` | TIMESTAMPTZ | Last progress update |

**Indexes:**
- `idx_user_progress_user_id` on `user_id` (unique)
- `idx_user_progress_level` on `current_level`

### 10. `lesson_progress`

Tracks individual lesson completion and scores.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | TEXT | Anonymous user identifier |
| `lesson_slug` | TEXT | Lesson identifier |
| `completed` | BOOLEAN | Lesson completion status |
| `quiz_score` | INTEGER | Quiz score (0-100, nullable) |
| `reading_position` | INTEGER | Last reading position (%) |
| `completed_at` | TIMESTAMPTZ | Completion timestamp (nullable) |
| `created_at` | TIMESTAMPTZ | First access timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Indexes:**
- `idx_lesson_progress_user_lesson` on `user_id, lesson_slug` (unique)
- `idx_lesson_progress_completed` on `completed`

---

## API Routes

All API routes follow RESTful conventions and return JSON responses.

### Authentication Routes

#### `POST /api/admin/login`
- **Purpose:** Authenticate admin user
- **Input:** `{ username, password }`
- **Output:** Session cookie + `{ success: true, redirectUrl: '/admin/queue' }`
- **Security:** Rate limited (5 attempts per 15 minutes), CSRF token generated
- **Rate Limit:** 5 requests / 15 minutes per IP

#### `POST /api/admin/logout`
- **Purpose:** Clear admin session
- **Output:** `{ success: true }`
- **Security:** Requires valid session

### Q&A Routes

#### `POST /api/qa/submit`
- **Purpose:** Submit question and generate Lightning invoice
- **Input:** `{ userEmail, userName, category, questionText, pricingTier, publishToArchive }`
- **Output:** `{ success: true, questionId, payment: { invoiceId, invoiceUrl, lightningInvoice, qrCodeData, amountSats, expiresAt } }`
- **Security:**
  - Same-origin check
  - Rate limit per IP: 10 requests / 10 minutes
  - Rate limit per email: 5 requests / 1 hour
  - Honeypot field (`website`) detection
- **Side Effects:**
  - Creates `payments` record
  - Creates `questions` record
  - Generates OpenNode invoice
  - Sends pre-payment confirmation email

#### `GET /api/qa/payment-status?questionId=xxx`
- **Purpose:** Check question payment status
- **Input:** Query parameter `questionId`
- **Output:** `{ success: true, question: { id, status, payment_status, ... } }`

### Webhook Routes

#### `POST /api/webhooks/opennode`
- **Purpose:** Handle OpenNode payment status updates
- **Input:** OpenNode webhook payload (HMAC-SHA256 verified)
- **Output:** `{ received: true }`
- **Security:** HMAC signature verification, replay attack prevention
- **Side Effects:**
  - Updates `payments.status`
  - Updates `questions.payment_status` and `questions.status`
  - Sends payment confirmation email (on `paid`)
  - Sends admin notification email (on `paid`)
  - Sends payment expiration email (on `expired`)
  - Logs to `email_logs`

#### `POST /api/webhooks/resend`
- **Purpose:** Handle Resend email delivery events
- **Input:** Resend webhook payload (HMAC-SHA256 verified)
- **Output:** `{ received: true, status }`
- **Security:** HMAC signature verification, timestamp validation (5 min max age)
- **Side Effects:**
  - Updates `email_logs` status
  - Auto-unsubscribes on spam complaint
  - Records bounces in `email_preferences`

### Admin Routes

#### `GET /api/admin/questions`
- **Purpose:** Fetch all questions for admin dashboard
- **Output:** `{ success: true, questions: [...] }`
- **Security:** Requires valid admin session

#### `POST /api/admin/questions/[id]/answer`
- **Purpose:** Submit answer to paid question
- **Input:** `{ answerText, answerVideoUrl?, publishToArchive?, csrfToken }`
- **Output:** `{ success: true }`
- **Security:** Requires admin session + CSRF token validation
- **Side Effects:**
  - Updates `questions.answer_text`, `questions.answer_video_url`, `questions.status = 'answered'`
  - Sends answer delivery email to user
  - Logs to `admin_audit_log`

### Bitcoin Data Routes

#### `GET /api/bitcoin/price`
- **Purpose:** Current Bitcoin price in USD
- **Output:** `{ price: number, timestamp: string }`
- **Cache:** 30 seconds in-memory

#### `GET /api/bitcoin/historical?days=365`
- **Purpose:** Historical Bitcoin prices (CoinGecko)
- **Output:** `{ prices: [[timestamp, price], ...] }`

#### `GET /api/bitcoin/fear-greed`
- **Purpose:** Bitcoin Fear & Greed Index
- **Output:** `{ value: number, classification: string, timestamp: string }`

#### `GET /api/bitcoin/halving`
- **Purpose:** Next Bitcoin halving countdown
- **Output:** `{ currentBlock, halvingBlock, blocksRemaining, estimatedDate }`

### DCA Calculator Route

#### `POST /api/dca/calculate`
- **Purpose:** Calculate DCA performance across multiple assets
- **Input:** `{ startDate, endDate, investmentAmount, frequency, assets: ['BTC', 'SP500', 'GOLD', 'MSCI'] }`
- **Output:** `{ results: { BTC: {...}, SP500: {...}, ... } }`
- **Rate Limit:** 20 requests / minute per IP

### Email Unsubscribe Route

#### `POST /api/unsubscribe`
- **Purpose:** Unsubscribe from all emails
- **Input:** `{ email, reason? }`
- **Output:** `{ success: true }`
- **Side Effects:** Upserts `email_preferences` with `unsubscribed = true`

---

## Authentication & Authorization

### User Authentication (Future)

Currently disabled. Planned: Supabase Auth with email/password + social logins.

### Admin Authentication

**Session-based authentication** using encrypted HTTP-only cookies.

**Flow:**
1. Admin submits credentials to `POST /api/admin/login`
2. Server validates against environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
3. On success:
   - Generate CSRF token
   - Create encrypted session payload: `{ email, csrfToken, expiresAt }`
   - Set HTTP-only, Secure, SameSite=Strict cookie
   - Log to `admin_audit_log`
4. Subsequent requests include session cookie
5. Server validates session + CSRF token on mutations

**Session Duration:** 24 hours

**Security:**
- AES-256-GCM encryption for session cookie
- CSRF tokens for all state-changing operations
- Rate limiting on login endpoint
- Audit logging for all admin actions

---

## Payment Flow

### Lightning Invoice Creation & Payment

**User Flow:**
1. User fills Q&A form and selects pricing tier
2. Frontend submits to `POST /api/qa/submit`
3. Backend:
   - Creates `payments` record (status: `pending`)
   - Creates `questions` record (status: `awaiting_payment`)
   - Calls OpenNode API to create Lightning invoice
   - Updates `payments` with invoice details
   - Sends pre-payment email with QR code
   - Returns invoice data to frontend
4. Frontend displays:
   - QR code for mobile wallets
   - Lightning invoice string for desktop wallets
   - Payment link for custodial wallets
   - Countdown timer (60 minutes)
5. User pays invoice via Lightning Network
6. OpenNode webhook fires: `POST /api/webhooks/opennode`
7. Backend:
   - Verifies HMAC signature
   - Updates `payments.status = 'paid'`
   - Updates `questions.status = 'paid'`
   - Sends confirmation email to user
   - Sends admin notification email
8. Question appears in admin queue

**Webhook Event Handling:**

| OpenNode Status | Action |
|----------------|--------|
| `paid` | Mark paid, send confirmations, notify admin |
| `expired` | Mark expired, send expiration notice to user |
| `processing` | Log event, no action |
| `underpaid` | Log event, no status change |

**Idempotency:** Webhook handler checks existing `payments.status` before processing to prevent duplicate emails.

---

## Email System

### Architecture

- **Service:** Resend (transactional email API)
- **Sender:** `soundsfair <noreply@yourdomain.com>`
- **Templates:** Inline HTML in `lib/email.ts`
- **Logging:** All sends logged to `email_logs` table
- **Retry:** 3 attempts with exponential backoff
- **Unsubscribe:** All emails include unsubscribe link (legal requirement)

### Email Templates

| Template | Trigger | Recipients |
|----------|---------|------------|
| `pre_payment_confirmation` | Question submitted | User |
| `payment_confirmation` | Invoice paid | User |
| `admin_question_notification` | Invoice paid | Admin |
| `answer_delivered` | Admin answers question | User |
| `payment_expired` | Invoice expires unpaid | User |

### Email Flow

**Sending:**
1. `lib/email.ts` function called (e.g., `sendPaymentConfirmation()`)
2. Check `email_preferences.unsubscribed` status
3. If not unsubscribed:
   - Call Resend API with HTML template
   - Log to `email_logs` (status: `sent`)
   - On error: Retry up to 3 times
4. Return result

**Delivery Tracking:**
1. Resend delivers email, fires webhook to `POST /api/webhooks/resend`
2. Backend updates `email_logs.status = 'delivered'`
3. On bounce: Update `email_preferences` with bounce info
4. On spam complaint: Auto-unsubscribe user (`email_preferences.unsubscribed = true`)

---

## State Management

### Client State

- **Progress Tracking:** `localStorage` (key: `soundsfair-progress`)
- **Quiz State:** React `useState` hooks
- **Admin Session:** HTTP-only cookie (not accessible to JavaScript)

### Server State

- **Database:** Supabase PostgreSQL (source of truth)
- **Rate Limiting:** In-memory Map (resets on server restart)
- **Price Cache:** In-memory with TTL (30 seconds for BTC price)

### Sync Strategy

**User Progress:**
- Stored in `localStorage` as JSON
- No server sync (anonymous users, no login required)
- Future: Sync to `quiz_responses` table when user authentication is added

**Admin State:**
- Server-rendered pages (no React state)
- Fresh database queries on each page load

---

## Key Architectural Patterns

### 1. Server-Side Rendering (SSR) & Static Generation (SSG)

- **Static:** Homepage, lessons, tools pages (regenerated on build)
- **Dynamic:** API routes, admin pages, user-specific data
- **Hybrid:** Lesson pages (SSG with ISR fallback)

### 2. API Route Handlers

All `/api/*` routes follow this pattern:
```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Security checks (origin, referer, rate limit)
    // 2. Parse and validate input (Zod schemas)
    // 3. Authenticate/authorize if needed
    // 4. Business logic
    // 5. Database operations
    // 6. External API calls
    // 7. Side effects (emails, logs)
    // 8. Structured logging
    // 9. Return JSON response
  } catch (error) {
    // Error handling + logging
    return NextResponse.json({ error }, { status: 500 });
  }
}
```

### 3. Validation Layer

- **Input Validation:** Zod schemas in `lib/validation.ts`
- **Example:**
```typescript
export const submitQuestionSchema = z.object({
  userEmail: z.string().email(),
  userName: z.string().min(2).max(100),
  category: z.enum(['Bitcoin Basics', 'Economics', ...]),
  questionText: z.string().min(20).max(5000),
  pricingTier: z.enum(['quick', 'standard', 'deep-dive']),
  publishToArchive: z.boolean(),
});
```

### 4. Error Handling

- **Try-Catch Blocks:** Wrap all async operations
- **Structured Logging:** JSON logs for production monitoring
- **User-Friendly Messages:** Generic errors to users, detailed logs to console
- **Graceful Degradation:** Missing API keys log warnings but don't crash

### 5. Webhook Security

All webhooks validate signatures:
```typescript
// OpenNode
const receivedSignature = request.headers.get('opennode-signature');
const calculatedSignature = crypto
  .createHmac('sha256', OPENNODE_WEBHOOK_SECRET)
  .update(rawBody)
  .digest('hex');
if (receivedSignature !== calculatedSignature) throw Error('Invalid signature');

// Resend
const { t: timestamp, v1: signature } = parseResendSignature(header);
const payload = `${timestamp}.${body}`;
const expected = createHmac('sha256', secret).update(payload).digest('hex');
if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw Error();
```

---

## Security Measures

### 1. Input Validation

- **Zod schemas** for all user inputs
- **Server-side validation** (never trust client)
- **SQL Injection:** Prevented by Supabase parameterized queries
- **XSS:** React escapes all dynamic content by default

### 2. Authentication Security

- **Password Hashing:** N/A (admin password compared directly in memory, never stored)
- **Session Security:** AES-256-GCM encrypted cookies
- **CSRF Protection:** Tokens on all state-changing admin operations
- **Rate Limiting:** IP-based and email-based limits

### 3. API Security

- **Same-Origin Policy:** Enforced on sensitive endpoints
- **CORS:** Restricted to same origin
- **Rate Limiting:** Per-IP and per-email limits
- **Webhook Verification:** HMAC-SHA256 signatures
- **Replay Attack Prevention:** Timestamp validation (max 5 min age)

### 4. Data Privacy

- **No Tracking:** No Google Analytics, no third-party cookies
- **Minimal Collection:** Only email for Q&A, anonymous progress tracking
- **GDPR Compliance:** Unsubscribe mechanism, data export (manual)
- **Email Preferences:** Respect unsubscribe status

### 5. Environment Variables

- **Secrets in `.env.local`** (never committed)
- **Production Secrets:** Stored in Vercel environment variables
- **Service Role Keys:** Used only in server-side code
- **Public Keys:** Safe to expose (e.g., `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## Performance Optimizations

### 1. Static Generation

- **44 pages pre-rendered** at build time
- **Lessons:** Generated statically from markdown
- **Sitemap:** Generated dynamically on first request, cached

### 2. Image Optimization

- **Next.js `<Image>` component:** Automatic WebP conversion, lazy loading
- **Responsive Images:** Srcset generation for multiple screen sizes
- **No external images:** All critical images hosted locally

### 3. API Caching

- **Bitcoin Price:** 30-second in-memory cache
- **CoinGecko API:** Cached responses to avoid rate limits
- **Fear & Greed Index:** 10-minute cache

### 4. Database Indexing

- **Strategic Indexes:** On foreign keys, status fields, timestamps
- **Query Optimization:** Select only required columns
- **Connection Pooling:** Supabase handles automatically

### 5. Bundle Size

- **Tree Shaking:** Tailwind CSS purges unused styles
- **Code Splitting:** Next.js automatic route-based splitting
- **Dynamic Imports:** Heavy components loaded on demand

### 6. Edge Runtime

- **Admin Login:** Uses Edge runtime for faster response
- **Other Routes:** Node.js runtime for compatibility

---

## Deployment Architecture

### Production Setup

```
User Browser
    ↓
Vercel Edge Network (CDN)
    ↓
Next.js App (Serverless Functions)
    ↓
    ├─→ Supabase PostgreSQL (Database)
    ├─→ OpenNode API (Payments)
    ├─→ Resend API (Emails)
    └─→ CoinGecko API (Price Data)
```

### Scalability

- **Serverless Functions:** Auto-scale with traffic (Vercel)
- **Database:** Supabase handles connection pooling, can scale vertically
- **CDN:** Static assets cached globally
- **Rate Limiting:** In-memory (single instance) - migrate to Redis for multi-instance

### Monitoring

- **Vercel Logs:** Real-time function logs
- **Structured Logging:** JSON format for easy parsing
- **Database Metrics:** Supabase dashboard (connections, queries)
- **Email Deliverability:** `email_logs` table tracking

---

## Future Enhancements

### Planned Features

1. **User Authentication:** Supabase Auth with social logins
2. **Public Q&A Archive:** Display answered questions (with user consent)
3. **Video Course Content:** Embed YouTube videos in lessons
4. **Advanced Quiz Analytics:** Track user learning paths
5. **Multi-Language Support:** Portuguese translation
6. **Shareable DCA Results:** Persistent storage with unique URLs

### Technical Debt

1. **ESLint `no-explicit-any`:** Add proper Supabase type generation
2. **Rate Limiting:** Migrate to Redis for multi-instance support
3. **Admin Auth:** Upgrade to JWT-based system with role-based access
4. **Email Idempotency:** Ensure webhook handlers never send duplicate emails
5. **Lighthouse Perf:** Optimize bundle size (currently 90+, target 100)

---

## Development Workflow

### Local Setup

```bash
# 1. Clone repo
git clone <repo-url>
cd soundsfair-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with real credentials

# 4. Run dev server
npm run dev

# 5. Build for production
npm run build

# 6. Type check
npx tsc --noEmit

# 7. Lint
npm run lint
```

### Database Migrations

```bash
# Link to Supabase project
npx supabase link --project-ref <project-id>

# Apply migrations
npx supabase db push

# Create new migration
npx supabase migration new <name>
```

### Deployment

```bash
# Vercel auto-deploys on push to main branch
git push origin main

# Manual deployment
vercel deploy --prod
```

---

## Testing Strategy

### Current State

- **No automated tests** (future: add Vitest + Playwright)
- **Manual testing:** See `docs/MANUAL_TEST_CHECKLIST.md`

### Test Coverage Plan

1. **Unit Tests:** Validation schemas, utility functions
2. **Integration Tests:** API routes with mock database
3. **E2E Tests:** Critical flows (payment, Q&A, quiz)
4. **Visual Regression:** Lesson page rendering

---

## Contact & Support

- **Developer:** Reference `CLAUDE.md` for AI coding assistant context
- **Admin:** Reference `docs/ADMIN_GUIDE.md` (to be created)
- **Deployment:** Reference `docs/DEPLOYMENT.md`

---

**Last Updated:** December 2025
**Maintained By:** soundsfair Development Team
