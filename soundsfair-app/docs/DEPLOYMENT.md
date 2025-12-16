# Production Deployment Guide - soundsfair

Complete step-by-step guide for deploying soundsfair to production on Vercel with Supabase, OpenNode, and Resend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Variables](#environment-variables)
- [Database Migration](#database-migration)
- [Third-Party Services](#third-party-services)
- [Vercel Deployment](#vercel-deployment)
- [Custom Domain Setup](#custom-domain-setup)
- [Post-Deployment Verification](#post-deployment-verification)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Accounts
- ✅ **Vercel Account** - For hosting (vercel.com)
- ✅ **Supabase Account** - For database (supabase.com)
- ✅ **OpenNode Account** - For Lightning payments (opennode.com)
- ✅ **Resend Account** - For transactional emails (resend.com)
- ✅ **Domain Registrar** - For custom domain (Namecheap, Cloudflare, etc.)
- ✅ **GitHub Account** - For code repository

### Local Requirements
- Node.js 18+ installed
- Git configured
- Supabase CLI installed (`npm install -g supabase`)
- Access to production credentials

### Knowledge Requirements
- Basic understanding of:
  - Environment variables
  - DNS configuration
  - Database migrations
  - Webhook configuration

---

## Pre-Deployment Checklist

Before starting deployment, ensure:

### Code Quality
- [ ] All tests pass locally
- [ ] TypeScript compilation successful (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)
- [ ] No critical TODOs in code
- [ ] All dependencies up to date
- [ ] `.env.local` contains all required variables (for testing)

### Git Repository
- [ ] All changes committed
- [ ] Main branch is stable
- [ ] No secrets in git history
- [ ] `.gitignore` includes `.env.local`, `.env*.local`
- [ ] Repository pushed to GitHub

### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deployment guide reviewed (this file)

### Security
- [ ] All API keys are production-ready (not test keys)
- [ ] Strong admin password generated (32+ characters)
- [ ] Session secret generated (64+ characters)
- [ ] No hardcoded secrets in code
- [ ] Rate limiting configured
- [ ] CSRF protection enabled

---

## Environment Variables

### Production Environment Variables Setup

#### 1. Core Configuration

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=soundsfair
```

**Important:**
- Must be `https://` in production (not `http://`)
- No trailing slash
- Use your actual domain name

#### 2. Supabase (Database)

```bash
# Get from: Supabase Dashboard → Your Project → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

**Security Warning:**
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` is **SECRET** - NEVER expose to browser
- Only use service role key server-side
- Anon key is public (protected by RLS)

**How to Get:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Copy "service_role" key → `SUPABASE_SERVICE_ROLE_KEY`

#### 3. OpenNode (Lightning Payments)

```bash
# Production API key (NOT test_xxx)
OPENNODE_API_KEY=your_live_api_key_here
OPENNODE_WEBHOOK_SECRET=your_webhook_secret_here
```

**Important:**
- Production key does NOT start with `test_`
- Generate new webhook secret for production
- Never reuse testnet credentials

**How to Get:**
1. Go to https://dashboard.opennode.com (NOT dev-dashboard)
2. Navigate to "API Credentials"
3. Generate new production API key
4. Copy key → `OPENNODE_API_KEY`
5. Go to "Webhooks"
6. Generate webhook secret → `OPENNODE_WEBHOOK_SECRET`

#### 4. Resend (Email Service)

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=your-admin@yourdomain.com
```

**Important:**
- Use production API key
- Verify your sending domain first (see below)
- Admin email receives new question notifications

**How to Get:**
1. Go to https://resend.com/api-keys
2. Create new API key with "Sending access"
3. Copy key → `RESEND_API_KEY`
4. Set your admin email → `ADMIN_EMAIL`

#### 5. Admin Dashboard (Security)

```bash
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<GENERATE_STRONG_PASSWORD_HERE>
ADMIN_SESSION_SECRET=<GENERATE_RANDOM_HEX_HERE>
```

**Generate Secure Credentials:**

```bash
# Generate strong admin password (32 characters)
openssl rand -base64 32

# Generate session secret (64 hex characters)
openssl rand -hex 64
```

**Security Requirements:**
- ✅ Admin password: 32+ characters, random
- ✅ Session secret: 64+ hex characters
- ✅ Never use weak passwords like "admin123"
- ✅ Store credentials in password manager

#### 6. Email Webhooks (Optional but Recommended)

```bash
RESEND_WEBHOOK_SECRET=your_resend_webhook_secret
```

**How to Get:**
1. Configure Resend webhook (see Third-Party Services below)
2. Copy webhook signing secret → `RESEND_WEBHOOK_SECRET`

#### 7. Rate Limiting (Optional)

```bash
# Default values are fine for most use cases
QA_SUBMIT_RL_IP_LIMIT=10
QA_SUBMIT_RL_IP_WINDOW_SEC=600
QA_SUBMIT_RL_EMAIL_LIMIT=5
QA_SUBMIT_RL_EMAIL_WINDOW_SEC=3600
```

### Setting Environment Variables in Vercel

1. **Via Vercel Dashboard:**
   ```
   Vercel Dashboard → Your Project → Settings → Environment Variables
   ```

2. **Add Each Variable:**
   - Name: Variable name (e.g., `OPENNODE_API_KEY`)
   - Value: Secret value
   - Environment: Select "Production"
   - Click "Save"

3. **Verify Sensitive Variables:**
   - Check "Sensitive" for all secrets
   - This hides values in UI after saving

4. **Never Expose Secrets:**
   - ❌ Don't commit secrets to git
   - ❌ Don't log secrets
   - ❌ Don't send secrets to client
   - ✅ Use environment variables only

### Environment Variables Checklist

Before deployment, verify all these are set:

- [ ] `NEXT_PUBLIC_SITE_URL` (https://yourdomain.com)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (SECRET!)
- [ ] `OPENNODE_API_KEY` (production, not test_)
- [ ] `OPENNODE_WEBHOOK_SECRET`
- [ ] `RESEND_API_KEY`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD` (32+ chars)
- [ ] `ADMIN_SESSION_SECRET` (64+ hex chars)
- [ ] `RESEND_WEBHOOK_SECRET` (optional)

---

## Database Migration

### 1. Connect to Production Database

```bash
# Link Supabase CLI to your production project
npx supabase link --project-ref your-production-project-ref

# Test connection
npx supabase db remote --linked
```

**How to Get Project Ref:**
- Supabase Dashboard → Your Project → Settings → General
- Copy "Reference ID" (e.g., `abcdefghijklmnopqrs`)

### 2. Review Migrations

Check which migrations need to be applied:

```bash
# List all migration files
ls -la supabase/migrations/

# Expected migrations:
# 001_initial_schema.sql
# 002_questions_payments.sql
# 003_admin_auth.sql (if exists)
# 004_rls_policies.sql (if exists)
# 005_admin_audit.sql
# 006_email_system.sql
```

### 3. Apply Migrations

**Option A: Via Supabase CLI (Recommended)**

```bash
# Push all migrations to production
npx supabase db push

# Verify migrations applied
npx supabase db remote --linked
```

**Option B: Via Supabase Dashboard**

1. Go to Supabase Dashboard → SQL Editor
2. Open each migration file locally
3. Copy contents
4. Paste into SQL Editor
5. Click "Run"
6. Verify no errors

### 4. Verify Database Schema

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected tables:
-- - payments
-- - questions
-- - admin_audit_log
-- - email_logs
-- - email_preferences
```

### 5. Verify Row Level Security (RLS)

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- All tables should have rowsecurity = true
```

### 6. Test Database Access

```bash
# From your local machine with production env vars
node -e "
const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
client.from('questions').select('count').then(console.log);
"
```

**Expected:** No errors, returns count

### Migration Rollback

If migration fails:

```bash
# Rollback to previous version
npx supabase db reset --linked

# Or manually drop tables (DANGEROUS!)
# Only do this if you're sure there's no data
DROP TABLE IF EXISTS email_preferences CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS admin_audit_log CASCADE;
```

---

## Third-Party Services

### 1. OpenNode Production Setup

#### Create Production API Key

1. **Login to Production Dashboard:**
   - Visit https://dashboard.opennode.com (NOT dev-dashboard)
   - Login with production account

2. **Generate API Key:**
   - Navigate to "API Credentials"
   - Click "Generate New Key"
   - Name: "soundsfair-production"
   - Permissions: "Create charges", "View charges"
   - Copy API key → Save to `OPENNODE_API_KEY`
   - **Note:** Key does NOT start with `test_`

3. **Configure Webhook:**
   - Navigate to "Webhooks"
   - Click "Add Webhook"
   - URL: `https://yourdomain.com/api/webhooks/opennode`
   - Events to subscribe:
     - ✅ `charge:created`
     - ✅ `charge:pending`
     - ✅ `charge:confirmed`
     - ✅ `charge:paid`
     - ✅ `charge:expired`
   - Click "Generate Secret"
   - Copy secret → Save to `OPENNODE_WEBHOOK_SECRET`
   - Click "Save"

4. **Test Webhook Delivery:**
   - After deployment, create test invoice
   - Check OpenNode Dashboard → Webhooks → Deliveries
   - Verify status: 200 OK
   - If failed, check logs for errors

5. **Account Verification:**
   - Ensure your OpenNode account is verified
   - Complete KYC if required
   - Set up payout preferences

#### OpenNode Configuration Checklist

- [ ] Production account created
- [ ] KYC completed (if required)
- [ ] Production API key generated (not test_)
- [ ] Webhook URL configured (`/api/webhooks/opennode`)
- [ ] Webhook secret saved
- [ ] All required events subscribed
- [ ] Test webhook delivery successful

### 2. Resend Email Service Setup

#### Verify Sending Domain

1. **Add Domain:**
   - Go to https://resend.com/domains
   - Click "Add Domain"
   - Enter your domain (e.g., `yourdomain.com`)

2. **Configure DNS Records:**
   - Add these records to your DNS provider:

   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all

   Type: TXT
   Name: resend._domainkey
   Value: [Copy from Resend dashboard]

   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:your-email@yourdomain.com
   ```

3. **Wait for Verification:**
   - DNS propagation takes 24-48 hours
   - Check status in Resend dashboard
   - Once verified, green checkmark appears

4. **Update FROM Email:**
   - In `lib/email.ts`, update `FROM_EMAIL`:
   ```typescript
   const FROM_EMAIL = 'soundsfair <noreply@yourdomain.com>';
   ```

#### Configure Webhook

1. **Create Webhook:**
   - Go to https://resend.com/webhooks
   - Click "Add Webhook"
   - URL: `https://yourdomain.com/api/webhooks/resend`
   - Events:
     - ✅ `email.sent`
     - ✅ `email.delivered`
     - ✅ `email.bounced`
     - ✅ `email.complained`
   - Click "Create"

2. **Copy Signing Secret:**
   - After creation, copy webhook signing secret
   - Save to `RESEND_WEBHOOK_SECRET`

3. **Test Webhook:**
   - Send test email
   - Check webhook deliveries in Resend dashboard
   - Verify status: 200 OK

#### Resend Configuration Checklist

- [ ] Domain added to Resend
- [ ] DNS records configured
- [ ] Domain verified (green checkmark)
- [ ] FROM email updated in code
- [ ] Webhook configured (`/api/webhooks/resend`)
- [ ] Webhook secret saved
- [ ] Test email sent successfully

### 3. Supabase Production Database

#### Enable Required Extensions

```sql
-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extensions
SELECT * FROM pg_extension;
```

#### Configure Connection Pooling

1. **Enable Pooler:**
   - Supabase Dashboard → Project Settings → Database
   - Enable "Connection Pooling"
   - Mode: "Transaction"
   - Copy pooler connection string (if needed for serverless)

2. **Configure Connection Limits:**
   - Default settings are usually fine for Vercel
   - Max connections: 15 (Supabase free tier)

#### Set Up Backups

1. **Enable Point-in-Time Recovery:**
   - Dashboard → Database → Backups
   - Enable PITR (Pro plan required)

2. **Daily Backups:**
   - Supabase automatically backs up daily
   - Retention: 7 days (free), 30 days (pro)

#### Supabase Configuration Checklist

- [ ] Production project created
- [ ] Migrations applied
- [ ] RLS enabled on all tables
- [ ] Connection pooling configured
- [ ] Backups enabled
- [ ] API keys copied to Vercel

---

## Vercel Deployment

### 1. Connect GitHub Repository

1. **Login to Vercel:**
   - Visit https://vercel.com
   - Login with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: "Next.js"
   - Root Directory: `./` (or `./soundsfair-app` if monorepo)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

### 2. Configure Environment Variables

1. **Add Production Variables:**
   - In import flow, expand "Environment Variables"
   - Add ALL variables from [Environment Variables](#environment-variables) section
   - Select "Production" environment
   - Click "Add" for each variable

2. **Verify Sensitive Variables:**
   - Check "Sensitive" checkbox for:
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `OPENNODE_API_KEY`
     - `OPENNODE_WEBHOOK_SECRET`
     - `RESEND_API_KEY`
     - `ADMIN_PASSWORD`
     - `ADMIN_SESSION_SECRET`
     - `RESEND_WEBHOOK_SECRET`

### 3. Deploy

1. **Click "Deploy"**
   - Vercel will:
     - Clone repository
     - Install dependencies
     - Run build
     - Deploy to production

2. **Monitor Build:**
   - Watch build logs in real-time
   - Build takes 2-5 minutes typically

3. **Check for Errors:**
   - If build fails, check logs
   - Common issues:
     - Missing environment variables
     - TypeScript errors
     - Build timeout (increase in settings)

### 4. Verify Deployment

1. **Visit Deployment URL:**
   - Vercel provides: `https://your-project.vercel.app`
   - Open in browser
   - Check homepage loads

2. **Test Critical Paths:**
   - Homepage: `/`
   - Lessons: `/lessons`
   - Q&A: `/qa`
   - Admin: `/admin` (test login)

3. **Check Logs:**
   - Vercel Dashboard → Your Project → Deployments → Latest → View Function Logs
   - Verify no errors

### Vercel Deployment Checklist

- [ ] GitHub repository connected
- [ ] All environment variables added
- [ ] Sensitive variables marked
- [ ] Build successful
- [ ] Deployment URL accessible
- [ ] Homepage loads correctly
- [ ] No errors in function logs
- [ ] Admin login works

---

## Custom Domain Setup

### 1. Add Domain in Vercel

1. **Navigate to Domains:**
   - Vercel Dashboard → Your Project → Settings → Domains

2. **Add Domain:**
   - Enter your domain: `yourdomain.com`
   - Click "Add"
   - Vercel will show DNS configuration

### 2. Configure DNS Records

#### Option A: Cloudflare (Recommended)

1. **A Record (Root Domain):**
   ```
   Type: A
   Name: @
   Content: 76.76.21.21
   Proxy status: Proxied (orange cloud)
   TTL: Auto
   ```

2. **CNAME (www subdomain):**
   ```
   Type: CNAME
   Name: www
   Content: cname.vercel-dns.com
   Proxy status: Proxied
   TTL: Auto
   ```

3. **SSL/TLS Settings:**
   - SSL/TLS → Overview → Mode: "Full (strict)"
   - Edge Certificates → Always Use HTTPS: ON

#### Option B: Other DNS Providers

1. **A Record:**
   ```
   Type: A
   Host: @
   Value: 76.76.21.21
   TTL: 3600
   ```

2. **CNAME:**
   ```
   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

### 3. Wait for Propagation

- DNS changes take 0-48 hours
- Usually: 5-30 minutes
- Check status: https://dnschecker.org

### 4. Verify SSL Certificate

1. **Check Vercel Dashboard:**
   - Domains section shows:
     - ✅ Valid Configuration
     - 🔒 SSL Certificate Issued

2. **Test HTTPS:**
   - Visit `https://yourdomain.com`
   - Check for green padlock
   - Certificate should be from "Let's Encrypt" or "Vercel"

3. **Force HTTPS Redirect:**
   - Vercel automatically redirects HTTP → HTTPS
   - Test: `http://yourdomain.com` → should redirect to HTTPS

### Domain Configuration Checklist

- [ ] Domain added in Vercel
- [ ] DNS A record configured
- [ ] DNS CNAME configured (www)
- [ ] DNS propagated (dnschecker.org shows correct IPs)
- [ ] SSL certificate issued
- [ ] HTTPS works
- [ ] HTTP redirects to HTTPS
- [ ] www redirects to root (or vice versa, your choice)

---

## Post-Deployment Verification

### 1. Smoke Tests

Run these tests immediately after deployment:

#### Homepage
```
✓ Visit https://yourdomain.com
✓ Page loads without errors
✓ No console errors (F12 → Console)
✓ All images load
✓ Navigation links work
```

#### Lessons
```
✓ Navigate to /lessons
✓ All 9 lessons displayed
✓ Click on lesson
✓ Content renders correctly
✓ Quiz loads (if applicable)
✓ Navigation works
```

#### Q&A System (Critical!)
```
✓ Navigate to /qa
✓ Form loads
✓ Fill and submit question
✓ Invoice created (QR code shows)
✓ Pre-payment email received
⚠️ DON'T PAY YET - wait for full verification
```

#### Admin Dashboard
```
✓ Navigate to /admin
✓ Login with credentials
✓ Dashboard loads
✓ Question list displays
✓ Can view question details
✓ Logout works
```

### 2. Webhook Testing

#### OpenNode Webhook
```bash
# Test webhook endpoint is accessible
curl https://yourdomain.com/api/webhooks/opennode

# Expected response:
# {"message":"OpenNode webhook endpoint is active","timestamp":"..."}
```

#### Resend Webhook
```bash
# Test webhook endpoint
curl https://yourdomain.com/api/webhooks/resend

# Expected response:
# {"service":"resend-webhook","status":"active","configured":true}
```

### 3. Email Delivery Test

1. **Submit Test Question:**
   - Use real email you control
   - Submit via Q&A form
   - Check inbox for pre-payment email

2. **Verify Email Content:**
   - Subject correct
   - QR code displays
   - Links work
   - Unsubscribe link present
   - From address is correct

3. **Check Email Logs:**
   ```sql
   SELECT * FROM email_logs
   ORDER BY created_at DESC
   LIMIT 5;
   ```

### 4. Payment System Verification

⚠️ **Use Small Amount for Testing**

1. **Create Test Invoice:**
   - Submit question with smallest tier
   - Amount: 5,000 sats (~$5 typically)

2. **Pay Invoice:**
   - Use Lightning wallet
   - Pay the invoice

3. **Verify Webhook Received:**
   - Check Vercel logs:
     ```
     Function Logs → Search for "webhook_processed"
     ```
   - Expected: `{"event":"webhook_processed","payment_status":"paid"}`

4. **Verify Emails Sent:**
   - User: Payment confirmation
   - Admin: New question notification

5. **Verify Database:**
   ```sql
   SELECT
     q.status,
     p.status as payment_status,
     q.user_email
   FROM questions q
   JOIN payments p ON q.payment_id = p.id
   ORDER BY q.created_at DESC
   LIMIT 1;
   ```
   - Expected: `q.status = 'in_queue'`, `p.status = 'paid'`

6. **Test Answer Delivery:**
   - Login to admin
   - Answer the test question
   - Verify answer email received

### 5. Monitoring Setup

1. **Vercel Analytics:**
   - Dashboard → Analytics tab
   - Verify data collection started

2. **Error Tracking:**
   - Check Function Logs for errors
   - Set up log alerts (Vercel Pro)

3. **Uptime Monitoring:**
   - Use external service (UptimeRobot, Pingdom)
   - Monitor: `https://yourdomain.com`
   - Alert email if down

### 6. Performance Check

1. **Lighthouse Audit:**
   - Open DevTools → Lighthouse
   - Run audit on homepage
   - Target scores:
     - Performance: 90+
     - Accessibility: 100
     - Best Practices: 100
     - SEO: 100

2. **Core Web Vitals:**
   - LCP (Largest Contentful Paint): < 2.5s
   - FID (First Input Delay): < 100ms
   - CLS (Cumulative Layout Shift): < 0.1

3. **Load Time:**
   - Homepage: < 2 seconds
   - Lesson pages: < 3 seconds
   - API responses: < 500ms

### Post-Deployment Checklist

- [ ] All smoke tests passed
- [ ] Webhooks accessible and responding
- [ ] Test email delivered successfully
- [ ] Test payment processed end-to-end
- [ ] Database updated correctly
- [ ] Admin dashboard fully functional
- [ ] No errors in production logs
- [ ] Performance metrics acceptable
- [ ] Monitoring configured
- [ ] SSL certificate valid
- [ ] Domain resolves correctly

---

## Rollback Procedures

If critical issues are found after deployment:

### 1. Immediate Rollback (Vercel)

1. **Via Dashboard:**
   - Vercel → Your Project → Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"
   - Confirm rollback

2. **Via CLI:**
   ```bash
   # List deployments
   vercel ls

   # Promote specific deployment
   vercel promote <deployment-url>
   ```

**Time to Rollback:** < 2 minutes

### 2. Database Rollback

⚠️ **Only if database migration caused issues**

```sql
-- Rollback migrations manually
-- Example: Drop new tables added in latest migration
DROP TABLE IF EXISTS new_table_name CASCADE;

-- Or restore from backup
-- Supabase Dashboard → Database → Backups → Restore
```

### 3. DNS Rollback

If domain issues:

1. Point DNS back to old server
2. Update A/CNAME records
3. Wait for propagation (5-30 min)

### 4. Environment Variable Rollback

1. Vercel Dashboard → Settings → Environment Variables
2. Edit variable
3. Restore previous value
4. Redeploy

### Emergency Contacts

- **OpenNode Support:** support@opennode.com
- **Resend Support:** https://resend.com/support
- **Supabase Support:** https://supabase.com/support
- **Vercel Support:** https://vercel.com/support

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Check error logs (Vercel dashboard)
- [ ] Monitor payment success rate
- [ ] Check email delivery rate
- [ ] Verify no webhook failures

### Weekly Checks

- [ ] Review database performance
- [ ] Check storage usage (Supabase)
- [ ] Review analytics (Vercel)
- [ ] Update dependencies (security patches)

### Monthly Checks

- [ ] Review OpenNode transactions
- [ ] Check SSL certificate status
- [ ] Database backup verification
- [ ] Performance optimization review

### Monitoring Queries

```sql
-- Payment success rate (last 7 days)
SELECT
  COUNT(*) FILTER (WHERE status = 'paid') * 100.0 / COUNT(*) as success_rate
FROM payments
WHERE created_at > NOW() - INTERVAL '7 days';

-- Email delivery rate
SELECT
  template_name,
  COUNT(*) FILTER (WHERE status = 'sent' OR status = 'delivered') * 100.0 / COUNT(*) as delivery_rate
FROM email_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY template_name;

-- Questions by status
SELECT status, COUNT(*) as count
FROM questions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY status;
```

### Log Monitoring

```bash
# Vercel CLI - Stream logs
vercel logs --follow

# Filter for errors
vercel logs | grep ERROR

# Filter for payment events
vercel logs | grep '"event":"webhook_processed"'
```

---

## Production Launch Checklist

Final checklist before announcing launch:

### Technical
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] OpenNode production API configured
- [ ] Resend domain verified
- [ ] Webhooks configured and tested
- [ ] SSL certificate active
- [ ] Domain DNS propagated
- [ ] Post-deployment tests passed
- [ ] Monitoring enabled
- [ ] Backups configured

### Content
- [ ] All lessons published
- [ ] FAQ page complete
- [ ] Glossary populated
- [ ] About page finalized
- [ ] Legal pages (Privacy, Terms) published

### Marketing
- [ ] Social media accounts created
- [ ] OpenGraph images uploaded
- [ ] Sitemap submitted to Google
- [ ] Analytics configured
- [ ] Email templates tested

### Support
- [ ] Admin trained on dashboard
- [ ] Documentation complete
- [ ] Emergency procedures documented
- [ ] Support email configured

### Security
- [ ] All secrets secured
- [ ] Admin password strong
- [ ] Rate limiting active
- [ ] CSRF protection enabled
- [ ] Webhook signatures verified

**Ready for Launch:** ☐ YES ☐ NO

---

**Last Updated:** 2025-12-16
**Version:** 1.0
**Maintained By:** soundsfair deployment team

**Next Steps After Deployment:**
1. Monitor logs for 24 hours
2. Submit sitemap to search engines
3. Announce launch on social media
4. Set up regular backups verification
5. Begin user onboarding
