# soundsfair - Bitcoin Education Platform

**Educational platform about Bitcoin, fair money, economic freedom, and sound monetary principles.**

**Version:** 1.0.0 | **Status:** ✅ Production Ready

---

## 🚀 Quick Start

```bash
npm install                    # Install dependencies
cp .env.example .env.local     # Create environment file (see DEPLOYMENT.md)
npm run dev                    # Run development server
npm run build                  # Build for production
```

**First time deploying?** See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for complete setup guide.

---

## ✨ Features

### Educational Content
- **9 Progressive Bitcoin Lessons** - Beginner to advanced curriculum
- **Interactive Quizzes** - Knowledge checks with XP gamification
- **Bitcoin Glossary** - 50+ essential terms explained
- **Comprehensive FAQ** - Common Bitcoin questions answered
- **SEO Optimized** - Open Graph tags, Schema.org markup, dynamic sitemap

### Bitcoin Tools
- **DCA Calculator** - Compare Bitcoin vs S&P 500, Gold, MSCI World
- **Satoshi Converter** - BTC/USD/sats conversions with live prices
- **Fear & Greed Index** - Bitcoin sentiment indicator
- **Halving Countdown** - Real-time countdown to next Bitcoin halving
- **What-If Calculator** - Historical investment comparisons

### Lightning Q&A System
- **Lightning Network Payments** - Instant Bitcoin payments via OpenNode
- **3 Pricing Tiers:**
  - Quick (1,000 sats) - 24h response
  - Standard (5,000 sats) - Expert 48h response with video
  - Deep Dive (10,000 sats) - Comprehensive 168h analysis
- **Email Notifications** - Pre-payment, confirmation, answer delivery, expiration
- **Email Deliverability Tracking** - Bounce/complaint handling, unsubscribe
- **Admin Dashboard** - Question queue management with audit logging

### Security & Production Features
- **CSRF Protection** - Token validation on admin mutations
- **Rate Limiting** - IP-based and email-based limits
- **Webhook Security** - HMAC-SHA256 signature verification
- **Admin Audit Logging** - Complete action history
- **Session Management** - Encrypted HTTP-only cookies
- **Email Unsubscribe** - GDPR-compliant opt-out system

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.0.4 (App Router, React Server Components)
- **Language:** TypeScript 5.7.2 (strict mode)
- **Styling:** Tailwind CSS 4.0.2
- **Charts:** Recharts 2.15.0
- **Validation:** Zod

### Backend
- **Database:** Supabase (PostgreSQL with Row Level Security)
- **Payments:** OpenNode (Lightning Network testnet & production)
- **Email:** Resend (transactional emails with webhook tracking)
- **Price Data:** CoinGecko API with fallback caching
- **Hosting:** Vercel (serverless functions + edge network)

### Third-Party Integrations
- **OpenNode:** Lightning invoice generation and webhooks
- **Resend:** Email delivery with bounce/complaint tracking
- **CoinGecko:** Bitcoin and asset price data
- **Supabase:** Database, authentication (future), storage (future)

---

## 📂 Project Structure

```
soundsfair-app/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard (login, queue)
│   ├── api/                      # API routes (serverless functions)
│   │   ├── admin/                # Admin authentication & management
│   │   ├── bitcoin/              # Bitcoin data endpoints
│   │   ├── dca/                  # DCA calculator backend
│   │   ├── qa/                   # Q&A submission & status
│   │   └── webhooks/             # Payment & email webhooks
│   ├── lessons/                  # 9 Bitcoin education lessons
│   ├── tools/                    # Bitcoin tools (DCA, converters, etc.)
│   ├── qa/                       # Lightning Q&A page
│   ├── faq/                      # FAQ page
│   ├── glossary/                 # Bitcoin terminology
│   └── unsubscribe/              # Email preference management
├── components/                   # Reusable React components
│   ├── admin/                    # Admin-specific components
│   ├── dca/                      # DCA calculator components
│   ├── layout/                   # Header, Footer, Navigation
│   ├── lesson/                   # Lesson display components
│   └── qa/                       # Q&A form components
├── content/                      # Markdown content
│   ├── lessons/                  # 9 lesson markdown files
│   └── glossary.json             # Glossary definitions
├── lib/                          # Utility libraries
│   ├── admin-auth.ts             # Admin session management
│   ├── csrf.ts                   # CSRF token generation
│   ├── email.ts                  # Email templates & sending
│   ├── opennode.ts               # Lightning payment integration
│   ├── supabase-admin.ts         # Database admin client
│   ├── validation.ts             # Zod schemas
│   └── rate-limit.ts             # Rate limiting utilities
├── supabase/migrations/          # Database schema migrations
├── docs/                         # Complete documentation
│   ├── DEPLOYMENT.md             # Production deployment guide
│   ├── ARCHITECTURE.md           # System architecture docs
│   ├── PAYMENT_TESTING.md        # Payment system test guide
│   └── MANUAL_TEST_CHECKLIST.md  # QA checklist
└── public/                       # Static assets
```

---

## 📚 Documentation

### 🔧 Setup & Deployment
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Complete production deployment guide
  - Environment variables configuration
  - Database migration procedures
  - Third-party service setup (OpenNode, Resend)
  - Vercel deployment steps
  - Custom domain & DNS configuration
  - Post-deployment verification

### 🏗️ Architecture & Development
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Complete system architecture
  - Tech stack details
  - Database schema (7 tables)
  - API routes documentation
  - Authentication flows
  - Payment system architecture
  - Email system design
  - Security measures

### 🧪 Testing
- **[PAYMENT_TESTING.md](docs/PAYMENT_TESTING.md)** - Payment system testing
  - OpenNode testnet setup
  - 6 critical test cases
  - Webhook testing procedures
  - Monitoring and debugging

- **[MANUAL_TEST_CHECKLIST.md](docs/MANUAL_TEST_CHECKLIST.md)** - QA checklist
  - 8 essential test scenarios
  - Database verification queries
  - Pass/fail criteria

### 📖 Legacy Documentation
- **[ADMIN_SYSTEM.md](docs/ADMIN_SYSTEM.md)** - Admin dashboard guide
- **[PROJECT_STATUS.md](docs/PROJECT_STATUS.md)** - Historical project status

---

## 🔐 Environment Variables

Create `.env.local` file with the following variables:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=soundsfair

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # SECRET!

# OpenNode (Lightning Payments)
OPENNODE_API_KEY=your_live_api_key  # NOT test_xxx for production
OPENNODE_WEBHOOK_SECRET=your_webhook_secret

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_WEBHOOK_SECRET=your_optional_webhook_secret
ADMIN_EMAIL=admin@yourdomain.com

# Admin Authentication
ADMIN_PASSWORD=<32+ character random password>
ADMIN_SESSION_SECRET=<64+ character random hex>

# Rate Limiting (Optional)
QA_SUBMIT_RL_IP_LIMIT=10
QA_SUBMIT_RL_IP_WINDOW_SEC=600
QA_SUBMIT_RL_EMAIL_LIMIT=5
QA_SUBMIT_RL_EMAIL_WINDOW_SEC=3600
```

**⚠️ Security:**
- Never commit `.env.local` to git (already in `.gitignore`)
- Use strong random passwords (32+ characters)
- Store production secrets in Vercel environment variables
- Service role key is highly sensitive - never expose to client

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for detailed setup instructions.

---

## 🗄️ Database Schema

### Tables

1. **`payments`** - Lightning invoices and payment status
2. **`questions`** - Q&A questions linked to payments
3. **`email_logs`** - Email delivery tracking and audit trail
4. **`email_preferences`** - User subscription preferences
5. **`admin_audit_log`** - Admin action logging
6. **`csrf_tokens`** - CSRF protection tokens
7. **`quiz_responses`** - User quiz submissions for progress tracking

### Migrations

All migrations are in `supabase/migrations/`:
- `001_initial.sql` - Initial schema
- `002_payment_system.sql` - Payment tables
- `003_csrf_tokens.sql` - CSRF protection
- `004_quiz_responses.sql` - Quiz tracking
- `005_admin_audit.sql` - Audit logging
- `006_email_system.sql` - Email logs and preferences

**Apply migrations:**
```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md#database-migrations) for details.

---

## 🚀 Deployment

### Prerequisites

- Vercel account (or other Next.js host)
- Supabase project
- OpenNode account (testnet for testing, production for live)
- Resend account with verified domain
- Custom domain (optional)

### Deployment Steps

1. **Database Setup**
   ```bash
   npx supabase link --project-ref your-ref
   npx supabase db push
   ```

2. **Configure Services**
   - OpenNode: Add webhook `https://yourdomain.com/api/webhooks/opennode`
   - Resend: Verify domain, add webhook `https://yourdomain.com/api/webhooks/resend`

3. **Deploy to Vercel**
   ```bash
   vercel deploy --prod
   ```
   Or connect GitHub repo in Vercel dashboard for auto-deployment.

4. **Verify Deployment**
   - Run smoke tests (see `docs/MANUAL_TEST_CHECKLIST.md`)
   - Test Lightning payment end-to-end
   - Verify email delivery
   - Check admin dashboard access

**Complete guide:** [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

---

## 🧪 Testing

### Manual Testing

1. **Payment Flow Test** (End-to-End)
   - Submit question → Pay invoice → Receive confirmation → Admin answers

2. **Security Tests**
   - Invalid webhook signatures rejected
   - Rate limits enforced
   - CSRF protection working

3. **Email Tests**
   - All 5 email templates deliver correctly
   - Bounce/complaint handling
   - Unsubscribe flow

**Checklist:** [`docs/MANUAL_TEST_CHECKLIST.md`](docs/MANUAL_TEST_CHECKLIST.md)
**Payment Testing:** [`docs/PAYMENT_TESTING.md`](docs/PAYMENT_TESTING.md)

### Build & Type Check

```bash
npx tsc --noEmit     # TypeScript compilation check
npm run lint         # ESLint (warnings expected for Supabase `any` types)
npm run build        # Production build (must pass)
```

---

## 📊 Project Status

### ✅ Complete (100%)

- [x] **Content:** 9 Bitcoin lessons with quizzes
- [x] **Tools:** DCA calculator, converters, halving countdown
- [x] **Lightning Q&A:** Full payment flow with 3 tiers
- [x] **Email System:** 5 templates with delivery tracking
- [x] **Admin Dashboard:** Question management with audit logs
- [x] **Security:** CSRF, rate limiting, webhook verification
- [x] **SEO:** Metadata, Open Graph, Twitter Cards, Schema.org
- [x] **Database:** Complete schema with 7 tables
- [x] **Documentation:** Deployment, architecture, testing guides
- [x] **Build:** TypeScript strict mode, no errors

### 🎯 Ready for Production

- ✅ Build passes (`npm run build`)
- ✅ All 44 routes generate successfully
- ✅ TypeScript compilation clean
- ✅ Security hardened (CSRF, rate limits, webhook verification)
- ✅ Email system complete with tracking
- ✅ Payment system tested (testnet)
- ✅ Comprehensive documentation
- ✅ Admin authentication secure

---

## 🔒 Security

### Implemented Protections

- **CSRF Tokens:** All admin mutations require valid CSRF token
- **Rate Limiting:** IP-based (10/10min) and email-based (5/hour) on Q&A submissions
- **Webhook Verification:** HMAC-SHA256 signatures on all webhooks
- **Session Security:** AES-256-GCM encrypted HTTP-only cookies
- **Input Validation:** Zod schemas on all user inputs
- **SQL Injection:** Prevented by Supabase parameterized queries
- **XSS:** React automatic escaping
- **Admin Audit Log:** All admin actions logged with IP and user agent

### Production Security Checklist

- [ ] All environment variables set in Vercel (never commit)
- [ ] Admin password is 32+ characters random
- [ ] Service role key never exposed to client
- [ ] HTTPS enforced (Vercel automatic)
- [ ] Webhook secrets configured correctly
- [ ] Email SPF/DKIM/DMARC records added
- [ ] Rate limits tested and working
- [ ] CSRF protection verified

See [`docs/ARCHITECTURE.md#security-measures`](docs/ARCHITECTURE.md#security-measures)

---

## 🤝 Contributing

This is a production project. For changes:

1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Test locally (`npm run build`, manual testing)
4. Submit PR with description

---

## 📞 Support

- **Documentation:** [`docs/`](docs/) folder
- **Issues:** GitHub Issues
- **Architecture:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **Deployment Help:** [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

---

## 📄 License

Proprietary - All rights reserved

---

**Version:** 1.0.0
**Status:** ✅ Production Ready
**Last Updated:** December 16, 2025
**Build:** Next.js 16.0.4 | TypeScript 5.7.2 | Tailwind CSS 4.0.2

🤖 Built with [Claude Code](https://claude.com/claude-code)
