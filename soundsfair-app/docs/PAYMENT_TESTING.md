# Payment System Testing Guide

Complete testing guide for the soundsfair Lightning Network payment system (OpenNode integration).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Test Environment Setup](#test-environment-setup)
- [Critical Test Cases](#critical-test-cases)
- [Monitoring & Debugging](#monitoring--debugging)
- [Expected Outcomes](#expected-outcomes)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- **OpenNode Account** (testnet): https://dev-dashboard.opennode.com
- **Lightning Testnet Wallet**: Phoenix, Breez, or Wallet of Satoshi (testnet mode)
- **Supabase Project**: Database access for verification
- **Email Account**: To receive test emails

### Required Credentials
```bash
OPENNODE_API_KEY=test_xxxxxxxxxx  # Must start with "test_"
OPENNODE_WEBHOOK_SECRET=your_webhook_secret_from_opennode
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Or Vercel preview URL
RESEND_API_KEY=re_xxxxxxxxx  # For email testing
ADMIN_EMAIL=your-email@example.com
```

### Development Tools
- Browser DevTools (Network tab)
- Supabase Studio or SQL client
- Log monitoring tool (Vercel logs, or `npm run dev` console)

---

## Test Environment Setup

### 1. OpenNode Testnet Configuration

1. **Create Testnet API Key:**
   - Visit https://dev-dashboard.opennode.com
   - Navigate to "API Credentials"
   - Generate new API key (starts with `test_`)
   - Save to `.env.local` as `OPENNODE_API_KEY`

2. **Configure Webhook:**
   - In OpenNode dashboard → Webhooks
   - Add webhook URL: `https://your-domain.com/api/webhooks/opennode`
   - Events to subscribe: `invoice.paid`, `invoice.expired`, `invoice.processing`
   - Copy webhook secret → save as `OPENNODE_WEBHOOK_SECRET`
   - **Note:** For local testing, use ngrok or Vercel preview deployment

3. **Verify Connection:**
   ```bash
   curl -H "Authorization: Bearer test_xxxxxxxxx" \
     https://dev-api.opennode.com/v1/account/balance
   ```
   Should return: `{"data":{"balance":0}}`

### 2. Lightning Testnet Wallet Setup

**Option A: Phoenix Wallet (Testnet)**
1. Download Phoenix from https://phoenix.acinq.co
2. Enable testnet mode in settings
3. Fund with testnet BTC from https://testnet-faucet.mempool.co

**Option B: Breez Wallet (Testnet)**
1. Download from https://breez.technology
2. Switch to testnet in developer options
3. Receive testnet sats from faucet

### 3. Database Verification Access

Ensure you can query these tables:
- `payments` - Payment records
- `questions` - Q&A submissions
- `email_logs` - Email send tracking
- `email_preferences` - Unsubscribe status

```sql
-- Quick check query
SELECT
  q.id,
  q.user_email,
  q.status as question_status,
  p.invoice_id,
  p.status as payment_status,
  p.amount_sats,
  q.created_at
FROM questions q
LEFT JOIN payments p ON q.payment_id = p.id
ORDER BY q.created_at DESC
LIMIT 10;
```

---

## Critical Test Cases

### Test 1: Successful Payment Flow (End-to-End)

**Objective:** Verify complete happy path from submission to answer delivery.

**Steps:**

1. **Submit Question:**
   ```
   - Navigate to /qa
   - Fill form:
     • Name: "Test User"
     • Email: "test@example.com"
     • Category: "Bitcoin Basics"
     • Tier: "Quick Answer"
     • Question: "What is Bitcoin?"
   - Submit form
   ```

2. **Verify Invoice Created:**
   - Check console logs for structured log:
     ```json
     {
       "event": "question_submitted",
       "question_id": "uuid-here",
       "invoice_id": "invoice-id",
       "success": true
     }
     ```
   - Verify QR code displayed
   - Verify invoice URL is clickable
   - Check database: `questions` table has new row with `status: 'awaiting_payment'`
   - Check database: `payments` table has `invoice_id` and `lightning_invoice`

3. **Verify Pre-Payment Email:**
   - Check `test@example.com` inbox
   - Email should contain:
     • QR code image
     • Lightning invoice string
     • Amount in sats
     • Expiration time
     • "Pay with Lightning" button
     • Unsubscribe link in footer

4. **Pay Invoice:**
   - Scan QR with testnet Lightning wallet
   - Or copy invoice string to wallet
   - Complete payment
   - **Expected:** Instant confirmation in wallet

5. **Verify Webhook Received:**
   - Check server logs within 10 seconds:
     ```json
     {
       "event": "webhook_processed",
       "webhook_type": "opennode",
       "payment_status": "paid",
       "success": true
     }
     ```
   - Check database: `payments.status` = `'paid'`
   - Check database: `payments.paid_at` has timestamp
   - Check database: `questions.status` = `'in_queue'`

6. **Verify Payment Confirmation Emails:**
   - **User Email** (`test@example.com`):
     • Subject: "⚡ Payment Confirmed"
     • Contains question preview
     • Shows tier and response time
     • Has unsubscribe link
   - **Admin Email**:
     • Subject: "⚡ New Paid Question"
     • Contains full question text
     • User email and name
     • Category and tier
     • Link to admin dashboard

7. **Verify Admin Dashboard:**
   - Login to /admin
   - Question appears in "In Queue" section
   - Shows user email, question text, tier
   - "Answer" button enabled

8. **Answer Question:**
   - Click "Answer" in admin dashboard
   - Fill response text: "Bitcoin is..."
   - Submit answer
   - Check logs for answer submission

9. **Verify Answer Delivered Email:**
   - Check `test@example.com`
   - Subject: "✅ Your Bitcoin Question has been Answered!"
   - Contains question text
   - Contains full answer
   - Has "Ask Another Question" CTA
   - Unsubscribe link present

10. **Verify Database State:**
    ```sql
    SELECT
      q.status,
      q.payment_status,
      q.response_text IS NOT NULL as has_answer,
      p.status as payment_status,
      (SELECT COUNT(*) FROM email_logs WHERE recipient_email = q.user_email) as emails_sent
    FROM questions q
    JOIN payments p ON q.payment_id = p.id
    WHERE q.user_email = 'test@example.com'
    ORDER BY q.created_at DESC
    LIMIT 1;
    ```
    **Expected:**
    - `q.status` = `'answered'`
    - `q.payment_status` = `'paid'`
    - `has_answer` = `true`
    - `emails_sent` >= 3 (pre-payment, confirmation, answer)

**Pass Criteria:**
- ✅ Question submitted successfully
- ✅ Invoice created with correct amount
- ✅ Pre-payment email received
- ✅ Payment processed via Lightning
- ✅ Webhook received and processed
- ✅ Database updated correctly
- ✅ Payment confirmation emails sent (user + admin)
- ✅ Question appears in admin dashboard
- ✅ Answer delivered email sent
- ✅ All structured logs present

---

### Test 2: Invoice Expiration

**Objective:** Verify behavior when Lightning invoice expires unpaid.

**Steps:**

1. **Submit Question:**
   - Use form to submit question
   - **Do NOT pay the invoice**

2. **Wait for Expiration:**
   - Default: 60 minutes
   - For faster testing: Reduce TTL in OpenNode dashboard to 5 minutes
   - Or: Use OpenNode API to manually expire invoice

3. **Verify Expiration Webhook:**
   - After expiration time, check logs:
     ```json
     {
       "event": "webhook_processed",
       "webhook_type": "opennode",
       "payment_status": "expired",
       "new_question_status": "payment_expired"
     }
     ```

4. **Verify Database Updates:**
   ```sql
   SELECT status, payment_status
   FROM questions
   WHERE id = 'your-question-id';
   ```
   **Expected:**
   - `status` = `'payment_expired'`
   - `payment_status` = `'expired'`

5. **Verify Expiration Email:**
   - Check user inbox
   - Subject: "Your Lightning Invoice Expired"
   - Contains question preview
   - Explains invoice expired
   - "Submit Question Again" button
   - Unsubscribe link

6. **Verify Email Log:**
   ```sql
   SELECT template_name, status
   FROM email_logs
   WHERE recipient_email = 'test@example.com'
   ORDER BY created_at DESC;
   ```
   **Expected:** Entry for `payment_expired` template with `status: 'sent'`

**Pass Criteria:**
- ✅ Invoice expires after configured time
- ✅ Expiration webhook received
- ✅ Question status updated to 'payment_expired'
- ✅ Expiration email sent to user
- ✅ User can resubmit question

---

### Test 3: Webhook Signature Verification

**Objective:** Ensure only authentic OpenNode webhooks are processed.

**Steps:**

1. **Send Invalid Webhook:**
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/opennode \
     -H "Content-Type: application/json" \
     -H "opennode-signature: invalid_signature_here" \
     -d '{
       "id": "fake-invoice",
       "status": "paid"
     }'
   ```

2. **Verify Rejection:**
   - **Expected Response:** 401 Unauthorized
   - **Expected Body:** `{"error": "Invalid signature"}`
   - **Expected Logs:** "Invalid webhook signature"

3. **Verify No Database Changes:**
   ```sql
   SELECT COUNT(*) FROM payments WHERE invoice_id = 'fake-invoice';
   ```
   **Expected:** 0 rows

4. **Test Valid Signature:**
   - Use OpenNode dashboard "Test Webhook" feature
   - Or calculate HMAC-SHA256 manually
   - **Expected:** 200 OK response

**Pass Criteria:**
- ✅ Invalid signatures rejected with 401
- ✅ No database modifications from invalid webhooks
- ✅ Valid signatures processed correctly
- ✅ Security logs generated

---

### Test 4: Duplicate Webhook Handling (Idempotency)

**Objective:** Ensure duplicate webhooks don't cause duplicate emails or data corruption.

**Steps:**

1. **Submit and Pay Question:**
   - Complete Test 1 steps 1-6

2. **Manually Resend Webhook:**
   - From OpenNode dashboard, click "Resend Webhook" on the invoice
   - Or use curl with exact same payload and valid signature

3. **Verify Single Processing:**
   - Check email logs:
     ```sql
     SELECT COUNT(*) as email_count
     FROM email_logs
     WHERE recipient_email = 'test@example.com'
       AND template_name = 'payment_confirmation';
     ```
     **Expected:** `email_count` = 1 (not 2)

4. **Verify Database Integrity:**
   - Payment record unchanged
   - Question status still 'in_queue' (not duplicated)
   - No duplicate rows created

**Note:** Current implementation processes webhooks multiple times. Idempotency should be added by checking `payments.webhook_received` flag or using `invoice_id` as unique constraint.

**Pass Criteria:**
- ✅ Duplicate webhooks acknowledged (200 OK)
- ✅ No duplicate emails sent
- ✅ No data corruption
- ⚠️ Known limitation: Emails may send twice (future improvement)

---

### Test 5: Concurrent Payment Processing

**Objective:** Verify system handles multiple simultaneous payments correctly.

**Steps:**

1. **Submit 10 Questions:**
   - Use different emails (test1@ex.com, test2@ex.com, ...)
   - Submit all within 1 minute
   - Save all invoice IDs

2. **Pay All Invoices:**
   - Use Lightning wallet to pay all 10 invoices
   - Pay as quickly as possible (within 1-2 minutes)

3. **Monitor Webhook Processing:**
   - Watch server logs for all 10 webhook events
   - Check timestamps to ensure parallel processing

4. **Verify All Payments:**
   ```sql
   SELECT
     COUNT(*) as total,
     COUNT(*) FILTER (WHERE status = 'paid') as paid_count
   FROM payments
   WHERE created_at > NOW() - INTERVAL '5 minutes';
   ```
   **Expected:** `total` = 10, `paid_count` = 10

5. **Verify All Emails:**
   ```sql
   SELECT recipient_email, COUNT(*) as emails
   FROM email_logs
   WHERE created_at > NOW() - INTERVAL '5 minutes'
   GROUP BY recipient_email;
   ```
   **Expected:** Each test email has 2-3 emails (pre-payment + confirmation)

6. **Verify Admin Dashboard:**
   - All 10 questions appear
   - All show "In Queue" status
   - No errors or missing data

**Pass Criteria:**
- ✅ All 10 payments processed successfully
- ✅ No race conditions or deadlocks
- ✅ All webhooks processed
- ✅ All emails sent
- ✅ No data corruption

---

### Test 6: Email System Integration

**Objective:** Verify complete email flow including bounces and unsubscribes.

**Steps:**

1. **Test Unsubscribe Flow:**
   - Receive any email from test
   - Click "Unsubscribe" link in footer
   - Fill unsubscribe form
   - Submit
   - Verify "Unsubscribed Successfully" message

2. **Verify Unsubscribe Status:**
   ```sql
   SELECT email, unsubscribed, unsubscribed_at
   FROM email_preferences
   WHERE email = 'test@example.com';
   ```
   **Expected:** `unsubscribed` = `true`

3. **Test Email Blocking:**
   - Submit new question with unsubscribed email
   - Pay invoice
   - **Expected:** No emails sent to user
   - Check logs:
     ```json
     {
       "event": "email_not_sent",
       "reason": "User has unsubscribed"
     }
     ```

4. **Test Bounce Handling:**
   - Use invalid email (bounces@simulator.amazonses.com)
   - Pay invoice
   - Wait for Resend webhook with `email.bounced` event
   - Verify email_logs updated: `status: 'bounced'`

5. **Test Spam Complaint:**
   - Use complaint@simulator.amazonses.com
   - Pay invoice
   - Wait for Resend webhook with `email.complained` event
   - Verify auto-unsubscribe:
     ```sql
     SELECT unsubscribed, unsubscribe_reason
     FROM email_preferences
     WHERE email = 'complaint@simulator.amazonses.com';
     ```
     **Expected:** `unsubscribed` = `true`, reason includes "spam complaint"

**Pass Criteria:**
- ✅ Unsubscribe link works
- ✅ Unsubscribed users don't receive emails
- ✅ Bounces logged correctly
- ✅ Spam complaints trigger auto-unsubscribe
- ✅ Email delivery status tracked

---

## Monitoring & Debugging

### Structured Logs

All payment-related operations emit structured JSON logs for easy parsing:

**Question Submission:**
```json
{
  "event": "question_submitted",
  "question_id": "uuid",
  "payment_id": "uuid",
  "invoice_id": "invoice-xxx",
  "user_email": "test@example.com",
  "category": "Bitcoin Basics",
  "pricing_tier": "quick",
  "amount_sats": 5000,
  "expires_at": "2025-12-16T12:00:00Z",
  "timestamp": "2025-12-16T11:00:00Z",
  "success": true
}
```

**Webhook Processing:**
```json
{
  "event": "webhook_processed",
  "webhook_type": "opennode",
  "invoice_id": "invoice-xxx",
  "payment_status": "paid",
  "question_id": "uuid",
  "old_question_status": "awaiting_payment",
  "new_question_status": "in_queue",
  "payment_id": "uuid",
  "timestamp": "2025-12-16T11:05:00Z",
  "success": true
}
```

**Email Events:**
```json
{
  "event": "webhook_received",
  "webhook_type": "resend",
  "email_event_type": "email.delivered",
  "email_id": "msg-xxx",
  "recipient": "test@example.com",
  "subject": "Payment Confirmed",
  "timestamp": "2025-12-16T11:05:30Z"
}
```

### Log Monitoring Tools

**Development (Local):**
```bash
npm run dev | grep -E '(question_submitted|webhook_processed|email)'
```

**Production (Vercel):**
- Navigate to Vercel Dashboard → Your Project → Logs
- Filter by: `json.event:"webhook_processed"`
- Use Vercel CLI: `vercel logs --follow`

**Supabase:**
```sql
-- Recent payment activity
SELECT
  created_at,
  invoice_id,
  status,
  amount_sats
FROM payments
ORDER BY created_at DESC
LIMIT 20;

-- Email delivery rates
SELECT
  template_name,
  status,
  COUNT(*) as count
FROM email_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY template_name, status;
```

### Common Log Queries

**Find Failed Payments:**
```bash
# In server logs
grep '"event":"webhook_processed"' | grep '"success":false'
```

**Track Specific Invoice:**
```bash
# Replace invoice-xxx with actual ID
grep 'invoice-xxx' logs/*.log
```

**Email Delivery Status:**
```sql
SELECT
  el.recipient_email,
  el.template_name,
  el.status,
  el.created_at,
  el.error
FROM email_logs el
WHERE el.recipient_email = 'test@example.com'
ORDER BY el.created_at DESC;
```

---

## Expected Outcomes

### Success Metrics

**Question Submission:**
- ✅ Invoice created within 2 seconds
- ✅ Invoice amount matches tier
- ✅ QR code displays correctly
- ✅ Pre-payment email sent within 5 seconds
- ✅ Database records created atomically

**Payment Processing:**
- ✅ Webhook received within 10 seconds of payment
- ✅ Database updated within 1 second of webhook
- ✅ Emails sent within 10 seconds of webhook
- ✅ Admin dashboard updates immediately

**Email Delivery:**
- ✅ 95%+ delivery rate (excluding bounces/unsubscribes)
- ✅ All emails include unsubscribe link
- ✅ Bounce/complaint webhooks processed
- ✅ Retry logic succeeds on transient failures

### Performance Benchmarks

- Question submission response time: < 3 seconds
- Webhook processing time: < 1 second
- Email send (with retry): < 15 seconds
- Database query time: < 100ms per query
- Concurrent payment handling: 10+ simultaneous without errors

### Error Rates (Acceptable Thresholds)

- Payment failures: < 1% (network/wallet issues)
- Email bounce rate: < 5% (invalid addresses)
- Webhook signature failures: 0% (security critical)
- Database write failures: < 0.1% (integrity critical)

---

## Troubleshooting

### Issue: Invoice Not Created

**Symptoms:**
- Form submits but no invoice displayed
- Console error: "Failed to create Lightning invoice"

**Debug Steps:**
1. Check OpenNode API key is testnet (`test_xxx`)
2. Verify OpenNode account has API access enabled
3. Check network tab for API response:
   ```
   POST https://dev-api.opennode.com/v1/charges
   Response: 401 Unauthorized → Bad API key
   Response: 400 Bad Request → Check request payload
   ```
4. Inspect server logs for OpenNode error details

**Solutions:**
- Regenerate OpenNode API key
- Verify OPENNODE_API_KEY in .env.local
- Check OpenNode dashboard for service status

### Issue: Webhook Not Received

**Symptoms:**
- Payment completed but question status not updated
- No confirmation emails sent
- Database shows `awaiting_payment` after payment

**Debug Steps:**
1. **Check Webhook URL:**
   ```bash
   curl https://your-domain.com/api/webhooks/opennode
   # Should return: {"message": "OpenNode webhook endpoint is active"}
   ```

2. **Verify Webhook Configuration:**
   - OpenNode dashboard → Webhooks
   - URL must be publicly accessible (not localhost)
   - Use ngrok for local testing: `ngrok http 3000`
   - Webhook secret must match `OPENNODE_WEBHOOK_SECRET`

3. **Check OpenNode Webhook Logs:**
   - Dashboard → Webhooks → View Deliveries
   - Look for failed attempts
   - Check response codes (200 = success, 401 = bad signature)

4. **Test Webhook Manually:**
   ```bash
   # Get example payload from OpenNode docs
   # Calculate signature: HMAC-SHA256(payload, secret)
   curl -X POST http://localhost:3000/api/webhooks/opennode \
     -H "Content-Type: application/json" \
     -H "opennode-signature: calculated_signature" \
     -d @webhook-payload.json
   ```

**Solutions:**
- Use ngrok or Vercel preview for local testing
- Verify webhook secret matches between OpenNode and .env
- Check server logs for signature verification errors
- Ensure webhook URL is HTTPS in production

### Issue: Emails Not Sent

**Symptoms:**
- Webhooks processed but no emails received
- Console shows: "Email sending skipped (Resend not configured)"

**Debug Steps:**
1. **Check Resend Configuration:**
   ```bash
   # Verify API key exists
   echo $RESEND_API_KEY

   # Test Resend API
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer ${RESEND_API_KEY}" \
     -H "Content-Type: application/json" \
     -d '{"from":"onboarding@resend.dev","to":"test@example.com","subject":"Test","html":"Test"}'
   ```

2. **Check Email Logs:**
   ```sql
   SELECT * FROM email_logs
   WHERE created_at > NOW() - INTERVAL '1 hour'
   ORDER BY created_at DESC;
   ```
   Look for `status: 'failed'` and `error` column

3. **Check Unsubscribe Status:**
   ```sql
   SELECT * FROM email_preferences
   WHERE email = 'test@example.com';
   ```
   If `unsubscribed = true`, emails won't send

**Solutions:**
- Add valid Resend API key to .env.local
- Verify email addresses (no typos)
- Check spam folder
- Verify domain is verified in Resend (for custom FROM address)
- Check Resend dashboard for bounce/complaint logs

### Issue: Duplicate Emails

**Symptoms:**
- User receives 2+ identical confirmation emails
- Email logs show multiple sends for same event

**Debug Steps:**
1. Check webhook delivery logs in OpenNode
2. Look for duplicate webhook calls:
   ```bash
   grep '"invoice_id":"invoice-xxx"' logs.txt | wc -l
   # If > 1, webhooks are duplicated
   ```

**Current Limitation:**
- System processes all webhooks without idempotency check
- Duplicate webhooks = duplicate emails

**Temporary Workaround:**
- Monitor OpenNode webhook delivery logs
- If duplicates occur frequently, implement idempotency:
  ```typescript
  // Check if already processed
  if (payment.webhook_received && payment.status === payload.status) {
    return NextResponse.json({ received: true, already_processed: true });
  }
  ```

**Proper Solution (Future):**
- Add `processed_webhook_ids` table
- Store webhook ID on first processing
- Check table before processing
- Return 200 if already processed

---

## Test Results Template

Document your test results using this template:

```markdown
## Test Run: [Date]

**Environment:**
- OpenNode: testnet / production
- Database: local / staging / production
- Email: test account / real addresses
- Tester: [Your Name]

**Test 1: Successful Payment**
- Status: ✅ PASS / ❌ FAIL
- Time: [Duration]
- Notes: [Any observations]
- Logs: [Link to logs or paste key entries]

**Test 2: Invoice Expiration**
- Status: ✅ PASS / ❌ FAIL
- Time: [Duration]
- Notes: [Expiration method used]

**Test 3: Webhook Signature**
- Status: ✅ PASS / ❌ FAIL
- Notes: [Valid/invalid signatures tested]

**Test 4: Duplicate Webhooks**
- Status: ✅ PASS / ⚠️ PARTIAL / ❌ FAIL
- Notes: [Idempotency observations]

**Test 5: Concurrent Payments**
- Status: ✅ PASS / ❌ FAIL
- Concurrent Requests: [Number]
- Success Rate: [X/Y]

**Test 6: Email System**
- Status: ✅ PASS / ❌ FAIL
- Deliverability: [%]
- Bounces Handled: ✅ / ❌
- Unsubscribes Working: ✅ / ❌

**Overall Result:** ✅ READY FOR PRODUCTION / ⚠️ MINOR ISSUES / ❌ BLOCKED
```

---

## Production Readiness Checklist

Before deploying to production:

### Configuration
- [ ] OpenNode LIVE API key configured (not test_)
- [ ] Webhook URLs use HTTPS
- [ ] All environment variables set in production
- [ ] Webhook secrets securely stored
- [ ] Database connection tested
- [ ] Email domain verified in Resend

### Testing
- [ ] All 6 critical tests passed
- [ ] End-to-end flow tested with real testnet sats
- [ ] Webhook signature verification tested
- [ ] Email delivery confirmed
- [ ] Admin dashboard tested
- [ ] Concurrent payments tested

### Monitoring
- [ ] Structured logging verified in production logs
- [ ] Error tracking configured (Sentry/similar)
- [ ] Database queries optimized
- [ ] Email delivery monitoring set up
- [ ] Webhook delivery monitoring enabled

### Documentation
- [ ] Test results documented
- [ ] Known issues listed
- [ ] Runbook created for common issues
- [ ] Admin guide updated
- [ ] Emergency contacts defined

---

**Last Updated:** 2025-12-16
**Version:** 1.0
**Maintained By:** soundsfair development team
