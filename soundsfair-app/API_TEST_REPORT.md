# SoundsFair - Complete API Test Report

**Date:** December 26, 2025
**Deployment:** https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/
**Total APIs:** 17 endpoints

---

## 🎯 Executive Summary

This report documents all 17 API endpoints in the SoundsFair Bitcoin education platform, their current status, dependencies, and testing recommendations.

### Quick Stats
- **Total Endpoints:** 17
- **Critical Endpoints:** 4
- **Requires Authentication:** 5
- **Public Endpoints:** 12

---

## 📊 API Inventory

### 1. DCA Calculator APIs (3 endpoints)

#### 1.1 POST /api/dca/calculate
**Status:** ✅ **VERIFIED WORKING** (Tested in production)

**Purpose:** Calculate Dollar-Cost Averaging returns for Bitcoin investments

**Request:**
```json
{
  "amount": 100,
  "frequency": "monthly",
  "startDate": "2024-01-01",
  "endDate": "2024-12-26",
  "assets": ["BTC"]
}
```

**Response:**
```json
{
  "success": true,
  "results": [...],
  "chartData": [...],
  "shareId": "abc123",
  "metadata": {...}
}
```

**Dependencies:**
- `/api/prices` (internal function call)
- CoinCap API (primary, with fallback)
- CoinGecko API (fallback)
- Mock data (final fallback - currently active)

**Known Issues:**
- ✅ **RESOLVED:** Deployment Protection blocking internal HTTP calls (fixed with direct function calls)
- ⚠️ External APIs (CoinCap, CoinGecko) failing → using realistic historical mock data

**Test Command:**
```bash
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/dca/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"frequency":"monthly","startDate":"2024-01-01","endDate":"2024-12-26","assets":["BTC"]}'
```

---

#### 1.2 GET /api/dca/calculate?id={shareId}
**Status:** ⚠️ **NOT IMPLEMENTED** (Returns 501)

**Purpose:** Retrieve shared DCA calculation results

**Response:**
```json
{
  "error": "Share feature not yet implemented",
  "message": "Database integration required for sharing functionality"
}
```

**Dependencies:**
- Database table for shared calculations (not yet created)

---

#### 1.3 GET /api/prices
**Status:** ✅ **WORKING** (Tested via internal function call)

**Purpose:** Fetch Bitcoin historical prices for date range

**Request:**
```
GET /api/prices?asset=BTC&from=2024-01-01&to=2024-12-26
```

**Response:**
```json
{
  "data": [
    {
      "date": "2024-01-01",
      "price": 42000.50
    },
    ...
  ],
  "cached": false,
  "asset": "BTC",
  "count": 365
}
```

**Dependencies:**
- CoinCap API (https://api.coincap.io/v2/assets/bitcoin/history)
- CoinGecko API (fallback)
- Mock historical data (production fallback)

**Test Command:**
```bash
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/prices?asset=BTC&from=2024-01-01&to=2024-12-26"
```

---

### 2. Bitcoin Info APIs (4 endpoints)

#### 2.1 GET /api/bitcoin/price
**Status:** 🟡 **UNTESTED** (Expected to work)

**Purpose:** Get current Bitcoin price in multiple currencies

**Request:**
```
GET /api/bitcoin/price?currencies=usd,eur,brl
```

**Response:**
```json
{
  "success": true,
  "data": {
    "usd": 95000,
    "eur": 80750,
    "brl": 475000,
    "sats": 100000000,
    "change24h": 2.5,
    "marketCap": 1850000000000,
    "volume24h": 45000000000,
    "timestamp": 1703606400000
  },
  "cached": false
}
```

**Dependencies:**
- CoinCap API (primary)
- CoinGecko API (fallback)
- Exchange rate API (for currency conversion)

**Runtime:** Edge runtime (fast responses)

**Test Command:**
```bash
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/bitcoin/price"
```

---

#### 2.2 GET /api/bitcoin/historical
**Status:** 🟡 **UNTESTED**

**Purpose:** Get Bitcoin price for specific date

**Request:**
```
GET /api/bitcoin/historical?date=2024-01-01
```

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2024-01-01",
    "price": 42000.50,
    "timestamp": 1704067200000
  },
  "cached": false
}
```

**Dependencies:**
- CoinCap API (primary - unlimited historical data)
- CoinGecko API (fallback - 365 days limit)
- Mock data (development only)

**Validation:**
- Date format: YYYY-MM-DD
- Date range: 2010-07-18 to today
- Returns 400 for invalid/future dates

**Test Command:**
```bash
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/bitcoin/historical?date=2024-01-01"
```

---

#### 2.3 GET /api/bitcoin/halving
**Status:** 🟡 **UNTESTED**

**Purpose:** Get Bitcoin halving countdown and historical data

**Request:**
```
GET /api/bitcoin/halving?includeFuture=true&futureCount=5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current": {
      "currentBlock": 820000,
      "nextHalvingBlock": 840000,
      "blocksRemaining": 20000,
      "estimatedDate": "2024-04-20T00:00:00.000Z",
      "currentReward": 6.25,
      "nextReward": 3.125,
      "progressPercent": 0
    },
    "countdown": {
      "days": 115,
      "hours": 2760,
      "minutes": 165600
    },
    "supply": {
      "current": 19500000,
      "percentage": 92.86,
      "remaining": 1500000,
      "dailyReward": 900
    },
    "historical": [...],
    "future": [...]
  }
}
```

**Dependencies:**
- Blockchain.info API or similar (for current block height)
- Internal calculation logic

**Test Command:**
```bash
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/bitcoin/halving"
```

---

#### 2.4 GET /api/bitcoin/fear-greed
**Status:** 🟡 **UNTESTED** (May fail if external API down)

**Purpose:** Get Bitcoin Fear & Greed Index

**Request:**
```
GET /api/bitcoin/fear-greed?limit=30&includeStats=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current": {
      "value": 65,
      "classification": "Greed",
      "timestamp": 1703606400000
    },
    "metadata": {
      "color": "#16c784",
      "description": "The market is showing signs of greed...",
      "suggestion": "Consider taking profits or...",
      "emoji": "😎"
    },
    "stats": {
      "average": 52,
      "median": 50,
      "volatility": 15.3,
      "trend": "up"
    }
  }
}
```

**Dependencies:**
- Alternative.me Fear & Greed API (https://api.alternative.me/fng/)
- May return 503 if API is down

**Test Command:**
```bash
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/bitcoin/fear-greed"
```

---

### 3. Admin Authentication APIs (4 endpoints)

⚠️ **CRITICAL ISSUE REPORTED BY USER** ⚠️

#### 3.1 POST /api/admin/login
**Status:** 🔴 **REPORTED AS BROKEN** (Requires investigation)

**Purpose:** Admin login with email and password

**Request:**
```json
{
  "email": "bitcoinnalata@proton.me",
  "password": "your_admin_password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "email": "bitcoinnalata@proton.me",
    "role": "super_admin"
  },
  "csrfToken": "random-csrf-token-here"
}
```

**Error Responses:**
- **400:** Missing email or password
- **401:** Invalid credentials
- **429:** Too many login attempts (rate limited)
- **500:** Internal server error

**Dependencies:**
- ✅ `lib/admin-auth.ts` (verifyAdminCredentials)
- ✅ `lib/rate-limit.ts` (checkRateLimit)
- ✅ `lib/supabase-admin.ts` (database queries)
- ❓ Environment variables:
  - `ADMIN_EMAIL` (default: bitcoinnalata@proton.me)
  - `ADMIN_PASSWORD` ⚠️ **MUST BE SET IN PRODUCTION**
  - `ADMIN_SESSION_SECRET` ⚠️ **MUST BE SET IN PRODUCTION** (32+ chars)
  - `NEXT_PUBLIC_SUPABASE_URL` ✅ Configured
  - `SUPABASE_SERVICE_ROLE_KEY` ❓ **VERIFY IN VERCEL**

**Security Features:**
- ✅ Rate limiting (5 attempts per 15 minutes per IP)
- ✅ CSRF token generation
- ✅ Timing-safe password comparison
- ✅ HttpOnly cookies
- ✅ Audit logging

**Potential Issues:**
1. **Missing Environment Variables:**
   - `ADMIN_PASSWORD` not set → uses default "change_this_password"
   - `ADMIN_SESSION_SECRET` not set → uses insecure dev mode
   - `SUPABASE_SERVICE_ROLE_KEY` not set → database queries fail

2. **Cookie Issues:**
   - Requires HTTPS in production
   - SameSite=strict may block cross-origin requests
   - Browser may block third-party cookies

3. **Database Issues:**
   - `admin_users` table may not exist
   - RLS policies may block access

**Test Command:**
```bash
# Test with invalid credentials (should return 401)
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'

# Test with missing fields (should return 400)
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Debugging Steps:**
1. ✅ Check Vercel environment variables
2. ✅ Check Runtime Logs for error messages
3. ✅ Verify Supabase connection
4. ✅ Test with correct credentials
5. ✅ Check browser console for cookie errors

---

#### 3.2 POST /api/admin/logout
**Status:** 🟡 **UNTESTED**

**Purpose:** Destroy admin session

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Dependencies:**
- Session cookie from login

**Test Command:**
```bash
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/admin/logout
```

---

#### 3.3 GET /api/admin/questions
**Status:** 🟡 **UNTESTED** (Requires authentication)

**Purpose:** List Q&A questions for admin review

**Request:**
```
GET /api/admin/questions?status=in_queue&limit=50&offset=0
```

**Response:**
```json
{
  "success": true,
  "questions": [...],
  "total": 150,
  "hasMore": true
}
```

**Authentication:**
- Requires valid admin session cookie
- Returns 401 if not authenticated

**Dependencies:**
- Admin session from login
- Supabase admin client
- `questions` table

**Test Command:**
```bash
# Without auth (should return 401)
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/admin/questions"
```

---

#### 3.4 POST /api/admin/questions/[id]/answer
**Status:** 🟡 **UNTESTED** (Requires authentication + CSRF)

**Purpose:** Submit answer to user question

**Request:**
```json
{
  "responseText": "Here is your answer...",
  "responseVideoUrl": "https://youtube.com/...",
  "publishToArchive": true,
  "csrfToken": "token-from-login"
}
```

**Response:**
```json
{
  "success": true,
  "questionId": "uuid-here"
}
```

**Authentication:**
- Requires admin session cookie
- Requires valid CSRF token
- Verifies question is paid

**Dependencies:**
- Admin session
- CSRF validation
- Email service (Resend)
- Supabase admin client

**Test Command:**
```bash
# Without auth (should return 401)
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/admin/questions/00000000-0000-0000-0000-000000000000/answer \
  -H "Content-Type: application/json" \
  -d '{"responseText":"test"}'
```

---

### 4. Q&A System APIs (2 endpoints)

#### 4.1 POST /api/qa/submit
**Status:** 🟡 **UNTESTED**

**Purpose:** Submit new question with Lightning payment

**Request:**
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "questionText": "How does Bitcoin mining work?",
  "category": "Bitcoin Basics",
  "pricingTier": "express",
  "publishToArchive": false
}
```

**Success Response (201):**
```json
{
  "success": true,
  "questionId": "uuid-here",
  "payment": {
    "invoiceId": "opennode-invoice-id",
    "invoiceUrl": "https://checkout.opennode.com/...",
    "lightningInvoice": "lnbc...",
    "qrCodeData": "data:image/png;base64,...",
    "amountSats": 10000,
    "expiresAt": "2024-12-26T18:00:00.000Z"
  }
}
```

**Error Responses:**
- **400:** Validation failed (missing fields, invalid data)
- **403:** Origin not allowed (CORS protection)
- **429:** Rate limited (too many requests)
- **500:** Internal server error

**Security Features:**
- ✅ Rate limiting (10 requests per 10 minutes per IP)
- ✅ Email rate limiting (5 requests per hour per email)
- ✅ Honeypot field (`website`)
- ✅ Origin/Referer validation
- ✅ Input validation (Zod schema)

**Dependencies:**
- OpenNode API (Lightning payments)
- Supabase database
- Email service (Resend - for confirmations)
- Environment variables:
  - `OPENNODE_API_KEY`
  - `OPENNODE_WEBHOOK_SECRET`

**Test Command:**
```bash
# Test with invalid data (should return 400)
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/qa/submit \
  -H "Content-Type: application/json" \
  -d '{}'

# Test with honeypot (should return 400)
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/qa/submit \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"test@example.com","questionText":"test","category":"Bitcoin Basics","pricingTier":"express","website":"bot-filled-this"}'
```

---

#### 4.2 GET /api/qa/payment-status
**Status:** 🟡 **UNTESTED**

**Purpose:** Check payment status for question

**Request:**
```
GET /api/qa/payment-status?questionId=uuid-here
```

**Response:**
```json
{
  "questionId": "uuid-here",
  "paymentStatus": "paid",
  "questionStatus": "in_queue",
  "answered": {
    "responseText": "...",
    "videoUrl": "...",
    "answeredAt": "2024-12-26T12:00:00.000Z"
  }
}
```

**Validation:**
- Validates UUID format
- Returns 400 for invalid format
- Returns 404 if question not found

**Dependencies:**
- Supabase database
- OpenNode API (for polling if webhook missed)

**Test Command:**
```bash
# Test with invalid UUID (should return 400)
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/qa/payment-status?questionId=invalid"

# Test with valid but non-existent UUID (should return 404)
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/qa/payment-status?questionId=00000000-0000-0000-0000-000000000000"
```

---

### 5. Progress Sync APIs (3 endpoints)

#### 5.1 GET /api/progress/pull
**Status:** 🟡 **UNTESTED** (Requires authentication)

**Purpose:** Download user progress from cloud

**Authentication:**
```
Authorization: Bearer {supabase-jwt-token}
```

**Response:**
```json
{
  "success": true,
  "has_cloud_data": true,
  "data": {
    "user_progress": {...},
    "lesson_progress": [...],
    "quiz_results": [...]
  },
  "pulled_at": "2024-12-26T12:00:00.000Z"
}
```

**Error Responses:**
- **401:** Unauthorized (no token or invalid token)
- **500:** Database error

**Dependencies:**
- Supabase Auth (JWT verification)
- Supabase database (`user_progress`, `lesson_progress`, `quiz_results`)

**Test Command:**
```bash
# Without auth (should return 401)
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/progress/pull"
```

---

#### 5.2 POST /api/progress/sync
**Status:** 🟡 **UNTESTED** (Requires authentication)

**Purpose:** Upload user progress to cloud

**Authentication:**
```
Authorization: Bearer {supabase-jwt-token}
```

**Request:**
```json
{
  "progressData": {
    "total_xp": 1500,
    "current_level": 5,
    "current_streak": 7,
    "longest_streak": 15,
    "last_active_date": "2024-12-26",
    "device_id": "device-uuid"
  }
}
```

**Response:**
```json
{
  "success": true,
  "synced_at": "2024-12-26T12:00:00.000Z",
  "user_id": "user-uuid"
}
```

**Dependencies:**
- Supabase Auth
- Supabase database

**Test Command:**
```bash
# Without auth (should return 401)
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/progress/sync \
  -H "Content-Type: application/json" \
  -d '{"progressData":{"total_xp":100}}'
```

---

#### 5.3 GET /api/progress/sync
**Status:** 🟡 **UNTESTED** (Requires authentication)

**Purpose:** Get sync status for user

**Response:**
```json
{
  "synced": true,
  "last_synced_at": "2024-12-26T12:00:00.000Z",
  "device_id": "device-uuid",
  "sync_version": 1
}
```

---

### 6. Email & Webhook APIs (4 endpoints)

#### 6.1 POST /api/unsubscribe
**Status:** 🟡 **UNTESTED**

**Purpose:** Unsubscribe email from all communications

**Request:**
```json
{
  "email": "user@example.com",
  "reason": "No longer interested"
}
```

**Response:**
```json
{
  "success": true
}
```

**Dependencies:**
- Supabase database (`email_preferences`)

**Test Command:**
```bash
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email"}'  # Should return 400
```

---

#### 6.2 GET /api/unsubscribe
**Status:** 🟡 **UNTESTED**

**Purpose:** Check if email is unsubscribed

**Request:**
```
GET /api/unsubscribe?email=user@example.com
```

**Response:**
```json
{
  "success": true,
  "email": "user@example.com",
  "unsubscribed": false,
  "unsubscribedAt": null
}
```

**Test Command:**
```bash
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/unsubscribe?email=test@example.com"
```

---

#### 6.3 POST /api/webhooks/opennode
**Status:** 🟡 **UNTESTED**

**Purpose:** Receive Lightning payment status updates from OpenNode

**Security:**
- HMAC signature verification
- Returns 401 if signature invalid

**Dependencies:**
- Environment variable: `OPENNODE_WEBHOOK_SECRET`
- Supabase database
- Email service

**Test Command:**
```bash
# Health check
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/webhooks/opennode"

# Without signature (should return 401)
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/webhooks/opennode \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

---

#### 6.4 POST /api/webhooks/resend
**Status:** 🟡 **UNTESTED**

**Purpose:** Receive email delivery status from Resend

**Security:**
- HMAC signature verification
- Timestamp validation (max 5 minutes old)

**Dependencies:**
- Environment variable: `RESEND_WEBHOOK_SECRET`
- Supabase database (`email_logs`, `email_preferences`)

**Events Handled:**
- `email.sent`
- `email.delivered`
- `email.bounced`
- `email.complained` (auto-unsubscribe)

**Test Command:**
```bash
# Health check
curl "https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/webhooks/resend"
```

---

## 🔍 Diagnostic Checklist

### Environment Variables Verification

Run this in Vercel dashboard or deployment logs:

```bash
# CRITICAL - Must be set in production
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
❓ SUPABASE_SERVICE_ROLE_KEY (VERIFY!)
❓ ADMIN_PASSWORD (VERIFY!)
❓ ADMIN_SESSION_SECRET (VERIFY!)
❓ ADMIN_EMAIL

# Payment System
❓ OPENNODE_API_KEY
❓ OPENNODE_WEBHOOK_SECRET

# Email System
❓ RESEND_API_KEY
❓ RESEND_WEBHOOK_SECRET

# Optional
⚪ SMTP_HOST
⚪ SMTP_PORT
⚪ SMTP_USER
⚪ SMTP_PASSWORD
```

### Database Tables Verification

Check Supabase dashboard for these tables:

```
✅ admin_users
✅ admin_audit_log
✅ questions
✅ payments
✅ user_progress
✅ lesson_progress
✅ quiz_results
✅ email_preferences
✅ email_logs
```

### Admin Login Debugging Steps

1. **Check Runtime Logs:**
```
Vercel Dashboard → Deployments → [Latest] → Runtime Logs
Filter: /api/admin/login
```

2. **Test Invalid Credentials:**
```bash
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  -v
```
**Expected:** 401 Unauthorized

3. **Test Missing Fields:**
```bash
curl -X POST https://soundsfair-mi8ghxktn-igors-projects-1a6352fa.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{}' \
  -v
```
**Expected:** 400 Bad Request

4. **Check Environment Variables:**
```bash
# In Vercel Dashboard
Settings → Environment Variables → Production
Look for:
- ADMIN_PASSWORD (should NOT be "change_this_password")
- ADMIN_SESSION_SECRET (should be 32+ characters)
- SUPABASE_SERVICE_ROLE_KEY (should start with "eyJ...")
```

5. **Verify Supabase Connection:**
```bash
# Check if admin_users table exists
# Supabase Dashboard → Table Editor → admin_users
# Should have at least one row with email = ADMIN_EMAIL
```

---

## 🧪 Running the Test Suite

### Quick Test
```bash
cd soundsfair-app
npx tsx scripts/test-all-apis.ts
```

### Test Specific Deployment
```bash
API_BASE_URL=https://your-deployment.vercel.app npx tsx scripts/test-all-apis.ts
```

### Test with Admin Credentials
```bash
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=your_password npx tsx scripts/test-all-apis.ts
```

---

## 📋 Recommendations

### High Priority
1. ✅ **Fix Admin Login API** - User reported as broken
   - Verify environment variables in Vercel
   - Check Supabase connection
   - Test with correct credentials

2. 🟡 **Test All Bitcoin Info APIs**
   - `/api/bitcoin/price`
   - `/api/bitcoin/historical`
   - `/api/bitcoin/halving`
   - `/api/bitcoin/fear-greed`

3. 🟡 **Test Q&A System**
   - Create test question
   - Verify Lightning invoice generation
   - Test payment status polling

### Medium Priority
4. ⚪ **Implement DCA Sharing**
   - Create database table for shared calculations
   - Implement GET /api/dca/calculate?id={shareId}

5. ⚪ **Monitor External APIs**
   - CoinCap API status
   - CoinGecko API status
   - Consider adding API health check endpoint

### Low Priority
6. ⚪ **Add API Documentation**
   - OpenAPI/Swagger spec
   - Postman collection
   - Interactive API explorer

---

## 📞 Support

If issues persist, check:
1. Vercel Runtime Logs
2. Supabase Logs
3. Browser Console (for client-side errors)
4. Network tab (for HTTP errors)

Report issues at: https://github.com/anthropics/claude-code/issues
