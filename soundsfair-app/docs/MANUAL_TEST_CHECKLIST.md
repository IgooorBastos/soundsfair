# Manual Testing Checklist - soundsfair Payment System

Quick reference checklist for manual testing before production deployment.

## Pre-Test Setup

- [ ] OpenNode testnet account configured
- [ ] Lightning testnet wallet funded
- [ ] `.env.local` has all required credentials
- [ ] Database accessible (Supabase Studio open)
- [ ] Email inbox accessible for test emails
- [ ] Dev server running (`npm run dev`) or preview deployment ready

---

## Test 1: Happy Path (Complete Flow)

**Goal:** Submit → Pay → Receive Answer

- [ ] Navigate to `/qa`
- [ ] Fill form with test data
- [ ] Submit successfully (see QR code)
- [ ] Pre-payment email received (check QR code, invoice link)
- [ ] Pay invoice with Lightning wallet
- [ ] Payment confirmed in wallet
- [ ] Confirmation email received (user)
- [ ] Admin notification received
- [ ] Question appears in admin dashboard (`/admin`)
- [ ] Answer question in admin panel
- [ ] Answer delivered email received
- [ ] Check database: `status = 'answered'`, `payment_status = 'paid'`

**Time:** ~5-10 minutes
**Status:** ☐ PASS ☐ FAIL

---

## Test 2: Invoice Expiration

**Goal:** Verify expired invoice handling

- [ ] Submit question
- [ ] Do NOT pay invoice
- [ ] Wait for expiration (60 min or reduced TTL)
- [ ] Expiration webhook received (check logs)
- [ ] Expiration email sent to user
- [ ] Database updated: `status = 'payment_expired'`
- [ ] User can resubmit question

**Time:** 5-60 minutes (depending on TTL)
**Status:** ☐ PASS ☐ FAIL

---

## Test 3: Security - Invalid Webhook

**Goal:** Reject webhooks with bad signature

- [ ] Send POST to `/api/webhooks/opennode` with invalid signature:
  ```bash
  curl -X POST http://localhost:3000/api/webhooks/opennode \
    -H "Content-Type: application/json" \
    -H "opennode-signature: fake_signature" \
    -d '{"id":"fake","status":"paid"}'
  ```
- [ ] Response: `401 Unauthorized`
- [ ] Log shows: "Invalid webhook signature"
- [ ] No database changes made
- [ ] No emails sent

**Time:** 2 minutes
**Status:** ☐ PASS ☐ FAIL

---

## Test 4: Duplicate Webhook Handling

**Goal:** Verify idempotency (no duplicate emails)

- [ ] Complete successful payment (Test 1)
- [ ] In OpenNode dashboard, click "Resend Webhook"
- [ ] Check server logs (webhook received twice)
- [ ] Query email logs:
  ```sql
  SELECT COUNT(*) FROM email_logs
  WHERE recipient_email = 'test@example.com'
    AND template_name = 'payment_confirmation';
  ```
- [ ] Confirm count = 1 (not 2)
- [ ] No data corruption in database

**Time:** 5 minutes
**Status:** ☐ PASS ☐ FAIL / ⚠️ PARTIAL (emails duplicate but data OK)

---

## Test 5: Email Unsubscribe

**Goal:** Verify unsubscribe flow

- [ ] Receive any test email
- [ ] Click "Unsubscribe" link in footer
- [ ] Fill unsubscribe form and submit
- [ ] See "Unsubscribed Successfully" message
- [ ] Check database:
  ```sql
  SELECT unsubscribed FROM email_preferences
  WHERE email = 'test@example.com';
  ```
  Result: `true`
- [ ] Submit new question and pay
- [ ] Confirm NO emails sent to unsubscribed address
- [ ] Check logs for "User has unsubscribed" message

**Time:** 5 minutes
**Status:** ☐ PASS ☐ FAIL

---

## Test 6: Admin Functions

**Goal:** Verify admin dashboard works

- [ ] Login to `/admin` with credentials
- [ ] See list of questions
- [ ] Paid questions show "Answer" button
- [ ] Unpaid questions show "Awaiting Payment"
- [ ] Click "Answer" on paid question
- [ ] Fill answer text + optional video URL
- [ ] Check "Publish to Archive" checkbox
- [ ] Submit answer
- [ ] Answer delivered email sent
- [ ] Question status updated to "Answered"
- [ ] Question appears in archive (if published)

**Time:** 5 minutes
**Status:** ☐ PASS ☐ FAIL

---

## Test 7: Concurrent Payments

**Goal:** Handle multiple simultaneous payments

- [ ] Prepare 5 different test emails
- [ ] Submit 5 questions quickly (within 1 minute)
- [ ] Save all 5 invoice IDs
- [ ] Pay all 5 invoices as fast as possible
- [ ] Monitor server logs (all webhooks received)
- [ ] Check database:
  ```sql
  SELECT COUNT(*) FROM payments WHERE status = 'paid'
    AND created_at > NOW() - INTERVAL '5 minutes';
  ```
  Result: 5
- [ ] All confirmation emails sent
- [ ] No errors in logs
- [ ] All questions in admin dashboard

**Time:** 10 minutes
**Status:** ☐ PASS ☐ FAIL

---

## Test 8: Edge Cases

**Goal:** Test unusual scenarios

### Underpayment
- [ ] Pay less than invoice amount
- [ ] Webhook status: `underpaid`
- [ ] Question remains `awaiting_payment`
- [ ] No confirmation emails sent

### Payment During Processing
- [ ] Submit question
- [ ] Start paying invoice
- [ ] Before confirmation, check status
- [ ] Webhook status: `processing`
- [ ] Eventually becomes `paid`

### Very Long Question Text
- [ ] Submit question with 5000 characters
- [ ] Form validates/truncates correctly
- [ ] Email preview truncates gracefully
- [ ] Admin can see full text

**Time:** 10 minutes
**Status:** ☐ PASS ☐ FAIL

---

## Database Verification Queries

Run these after tests to verify data integrity:

### Payment Summary
```sql
SELECT
  status,
  COUNT(*) as count,
  SUM(amount_sats) as total_sats
FROM payments
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY status;
```

### Question Status
```sql
SELECT
  status,
  payment_status,
  COUNT(*) as count
FROM questions
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY status, payment_status;
```

### Email Delivery
```sql
SELECT
  template_name,
  status,
  COUNT(*) as count,
  ROUND(AVG(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) * 100, 2) as success_rate
FROM email_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY template_name, status;
```

### Unsubscribe Rate
```sql
SELECT
  COUNT(*) FILTER (WHERE unsubscribed = true) as unsubscribed,
  COUNT(*) as total,
  ROUND(COUNT(*) FILTER (WHERE unsubscribed = true)::numeric / NULLIF(COUNT(*), 0) * 100, 2) as rate
FROM email_preferences;
```

---

## Log Verification

Check server logs for these structured events:

### Question Submitted
```json
{"event":"question_submitted","question_id":"...","success":true}
```

### Webhook Processed
```json
{"event":"webhook_processed","payment_status":"paid","success":true}
```

### Email Sent
```json
{"event":"webhook_received","email_event_type":"email.delivered"}
```

---

## Pass/Fail Criteria

### ✅ READY FOR PRODUCTION
- All 8 tests pass
- No critical errors in logs
- Email delivery rate > 95%
- All database queries return expected results
- Webhook signature verification working
- Admin dashboard fully functional

### ⚠️ MINOR ISSUES (Can Deploy with Monitoring)
- 1-2 non-critical tests have warnings
- Duplicate webhook handling needs improvement
- Email delivery rate 90-95%
- Some edge cases need polish

### ❌ BLOCKED (Do Not Deploy)
- Any critical test fails
- Payment processing broken
- Webhook signature verification fails
- Database integrity compromised
- Email delivery rate < 90%
- Security vulnerabilities found

---

## Quick Debugging Commands

### Check Recent Activity
```bash
# Server logs (last 50 payment-related lines)
grep -E '(question_submitted|webhook_processed)' logs.txt | tail -50

# Database recent payments
psql -c "SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;"

# Email status
psql -c "SELECT template_name, status, COUNT(*) FROM email_logs GROUP BY 1,2;"
```

### Reset Test Data
```sql
-- Delete test questions (CAREFUL!)
DELETE FROM questions WHERE user_email LIKE 'test%@%';
DELETE FROM payments WHERE id IN (
  SELECT payment_id FROM questions WHERE user_email LIKE 'test%@%'
);
DELETE FROM email_logs WHERE recipient_email LIKE 'test%@%';
```

---

## Test Results

**Date:** _____________
**Tester:** _____________
**Environment:** ☐ Local ☐ Staging ☐ Production

| Test | Status | Time | Notes |
|------|--------|------|-------|
| 1. Happy Path | ☐ ☐ | __min | |
| 2. Expiration | ☐ ☐ | __min | |
| 3. Invalid Webhook | ☐ ☐ | __min | |
| 4. Duplicate Webhook | ☐ ☐ | __min | |
| 5. Unsubscribe | ☐ ☐ | __min | |
| 6. Admin Functions | ☐ ☐ | __min | |
| 7. Concurrent Payments | ☐ ☐ | __min | |
| 8. Edge Cases | ☐ ☐ | __min | |

**Overall:** ☐ ✅ PASS ☐ ⚠️ MINOR ISSUES ☐ ❌ FAIL

**Critical Issues Found:**
```
1.
2.
3.
```

**Recommendations:**
```
1.
2.
3.
```

**Approved for Production:** ☐ YES ☐ NO

---

**Print this checklist and check boxes during manual testing**
