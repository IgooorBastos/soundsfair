# soundsfair Admin Guide

**Complete guide for administrators managing the Lightning Q&A system**

**Version:** 0.1.0 | **Last Updated:** December 27, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Admin Dashboard](#admin-dashboard)
4. [Managing Questions](#managing-questions)
5. [Email System](#email-system)
6. [Security Features](#security-features)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
8. [Best Practices](#best-practices)

---

## Overview

The soundsfair admin system allows you to:
- **Manage paid Bitcoin Q&A questions** via the Lightning Network
- **Answer user questions** with text and optional video responses
- **Monitor payment status** and email delivery
- **Track admin activity** with comprehensive audit logs
- **Manage email preferences** and handle unsubscribes

### System Architecture

```
User Submits Question → Lightning Invoice Created → User Pays
    ↓
Payment Webhook → Confirm Payment → Send Emails (User + Admin)
    ↓
Question Appears in Admin Queue → Admin Answers → Email Sent to User
```

---

## Getting Started

### 1. Access Credentials

Your admin credentials are stored in environment variables:

```bash
ADMIN_EMAIL=bitcoinnalata@proton.me
ADMIN_PASSWORD=<your-secure-password>
```

**⚠️ IMPORTANT:** Change the default password immediately after first deployment.

### 2. Login to Admin Dashboard

1. Navigate to **`/admin/login`**
2. Enter your admin email and password
3. Click **"Sign In"**
4. You'll be redirected to **`/admin/queue`** (the question queue)

**Session Duration:** 24 hours
- Sessions are automatically renewed on activity
- HTTP-only cookies prevent JavaScript access
- Sessions are encrypted with AES-256-GCM

### 3. Admin Dashboard URL Structure

- **Login:** `/admin/login`
- **Question Queue:** `/admin/queue`
- **Logout:** Click "Logout" button in header (calls `/api/admin/logout`)

---

## Admin Dashboard

### Question Queue Interface

**URL:** `/admin/queue`

The admin dashboard displays all questions with the following information:

#### Question Card Layout

Each question shows:
- **User Information:**
  - User name
  - User email (mailto link)
  - Submission date/time
- **Question Details:**
  - Category (Bitcoin Basics, Economics, etc.)
  - Pricing tier (Quick, Standard, Deep Dive)
  - Payment amount (in sats)
- **Status Indicators:**
  - Payment status: `pending`, `paid`, `expired`
  - Question status: `awaiting_payment`, `paid`, `answered`, `payment_expired`
- **Actions:**
  - **"Answer"** button (only for paid questions)
  - **"View"** for unpaid questions (read-only)

#### Status Badges

- 🟡 **Awaiting Payment** - Invoice created but not paid
- 🟢 **Paid** - Ready to answer
- ✅ **Answered** - Response sent to user
- 🔴 **Payment Expired** - Invoice expired without payment

---

## Managing Questions

### Viewing Questions

**All Questions:**
- Questions are displayed in reverse chronological order (newest first)
- Filter by status using the dropdown (if implemented)
- Click any question card to expand details

**Question Details Include:**
- Full question text
- Category and pricing tier
- Payment information
- Publish to archive consent status
- Payment timestamp

### Answering Questions

**Prerequisites:**
- Question must have `payment_status = 'paid'`
- Question must have `status = 'paid'` (not `answered` or `awaiting_payment`)

**Steps:**

1. **Click "Answer" Button**
   - Opens answer submission modal/form

2. **Write Your Answer**
   - Text field for main answer (required)
   - Video URL field (optional) - accepts YouTube, Vimeo, or other video links
   - "Publish to Archive" checkbox (optional):
     - If user consented, you can publish the Q&A to public archive
     - If unchecked, question remains private

3. **Submit Answer**
   - Click "Submit Answer" button
   - CSRF token is automatically included
   - Answer is saved to database
   - Question status changes to `answered`
   - Email is sent to user automatically

4. **Confirmation**
   - Success message appears
   - Question moves to "Answered" status
   - Admin audit log records the action

**Answer Guidelines:**

- **Quick Tier (1,000 sats):** Brief, direct answer (1-2 paragraphs)
- **Standard Tier (5,000 sats):** Detailed explanation with examples (3-5 paragraphs), consider adding video
- **Deep Dive (10,000 sats):** Comprehensive analysis (multiple paragraphs), highly recommended to include video

### Answer Format Best Practices

```markdown
# Start with direct answer
Clear, concise answer to the main question.

# Provide context
Explain the "why" behind the answer.

# Add examples (for Standard/Deep Dive)
Real-world examples or scenarios.

# Include resources (optional)
Links to articles, tools, or further learning.

# Video (optional for Standard, recommended for Deep Dive)
Link to explanatory video hosted on YouTube or Vimeo.
```

---

## Email System

### Email Templates

The system sends 5 types of automated emails:

#### 1. Pre-Payment Confirmation

**Sent to:** User
**Trigger:** Immediately after question submission
**Contains:**
- Question confirmation
- Lightning invoice QR code
- Invoice URL and BOLT11 string
- Payment amount (sats)
- Invoice expiration time (60 minutes)
- Instructions for paying

**Purpose:** Ensure user has payment details even if they close the browser.

#### 2. Payment Confirmation

**Sent to:** User
**Trigger:** Lightning payment confirmed (OpenNode webhook)
**Contains:**
- Payment received confirmation
- Amount paid (sats)
- Service tier details
- Expected response time:
  - Quick: 24 hours
  - Standard: 48 hours
  - Deep Dive: 168 hours (1 week)
- Question preview
- Question ID for reference

#### 3. Admin Notification

**Sent to:** Admin email (`ADMIN_EMAIL`)
**Trigger:** Lightning payment confirmed
**Contains:**
- New paid question alert
- User name and email
- Full question text
- Category and tier
- Payment amount
- Direct link to admin dashboard

**Purpose:** Notify you immediately when a new paid question requires attention.

#### 4. Answer Delivered

**Sent to:** User
**Trigger:** Admin submits answer
**Contains:**
- Answer ready notification
- Original question recap
- Full answer text
- Video link (if provided)
- Links to continue learning
- Invitation to ask more questions

#### 5. Payment Expiration

**Sent to:** User
**Trigger:** Invoice expires without payment (60 minutes)
**Contains:**
- Invoice expiration notice
- Expired question details
- Link to resubmit question
- Explanation of Lightning invoice behavior

### Email Deliverability

**Tracking:** All emails are logged to `email_logs` table with status:
- `sent` - Accepted by recipient's mail server
- `delivered` - Successfully delivered to inbox
- `bounced` - Hard bounce (invalid email)
- `complained` - Marked as spam by recipient

**Bounce Handling:**
- Hard bounces are recorded in `email_preferences`
- Spam complaints automatically unsubscribe the user
- Resend webhook updates `email_logs` table

**Unsubscribe:**
- All emails include unsubscribe link (legal requirement)
- Unsubscribed users are recorded in `email_preferences`
- Future emails are blocked for unsubscribed users

**Monitoring:**
- Check `email_logs` table for delivery status
- Resend dashboard shows delivery rates
- Admin email notifications help you track new questions

---

## Security Features

### 1. CSRF Protection

**What:** Cross-Site Request Forgery protection
**How:** CSRF tokens required on all admin mutations
**Implementation:**
- Token generated on admin login
- Stored in encrypted session cookie
- Included automatically in admin forms
- Validated on answer submission

**You don't need to do anything** - CSRF tokens are handled automatically by the system.

### 2. Admin Audit Logging

**What:** Complete history of all admin actions
**Table:** `admin_audit_log`
**Logged Actions:**
- Admin login (success/failure)
- Answer submission
- Question status changes
- Session creation/destruction

**Logged Data:**
- Admin email
- Action type
- Resource affected (question ID)
- IP address
- User agent (browser)
- Timestamp
- Additional metadata (JSON)

**Viewing Audit Logs:**
```sql
SELECT * FROM admin_audit_log
ORDER BY created_at DESC
LIMIT 50;
```

### 3. Rate Limiting

**Login Endpoint:**
- **5 attempts per 15 minutes** per IP
- After 5 failed logins, wait 15 minutes
- Prevents brute force attacks

**Q&A Submission:**
- **10 submissions per 10 minutes** per IP
- **5 submissions per 1 hour** per email
- Prevents spam and abuse

### 4. Session Security

**Features:**
- AES-256-GCM encryption
- HTTP-only cookies (no JavaScript access)
- Secure flag (HTTPS only)
- SameSite=Strict (CSRF mitigation)
- 24-hour expiration

**Session Management:**
- Automatic logout after 24 hours
- Manual logout via "Logout" button
- Sessions invalidated on logout
- No session stored in database (cookie-only)

### 5. Webhook Verification

**OpenNode Webhook:**
- HMAC-SHA256 signature verification
- Replay attack prevention
- Invalid signatures rejected (401)

**Resend Webhook:**
- HMAC-SHA256 signature verification
- Timestamp validation (max 5 minutes old)
- Prevents forged delivery notifications

---

## Monitoring & Troubleshooting

### Dashboard Metrics

**To monitor system health:**

#### 1. Payment Success Rate

```sql
SELECT
  status,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM payments
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY status;
```

**Expected:**
- `paid`: 80-90%
- `expired`: 10-20%
- `pending`: <5%

#### 2. Email Delivery Rate

```sql
SELECT
  status,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM email_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY status;
```

**Expected:**
- `delivered`: >95%
- `sent`: <5%
- `bounced`: <2%
- `complained`: <1%

#### 3. Question Response Time

```sql
SELECT
  AVG(EXTRACT(EPOCH FROM (answered_at - created_at)) / 3600) as avg_hours,
  MIN(EXTRACT(EPOCH FROM (answered_at - created_at)) / 3600) as min_hours,
  MAX(EXTRACT(EPOCH FROM (answered_at - created_at)) / 3600) as max_hours
FROM questions
WHERE answered_at IS NOT NULL
  AND created_at > NOW() - INTERVAL '30 days';
```

**Target Response Times:**
- Quick: <24 hours
- Standard: <48 hours
- Deep Dive: <168 hours (1 week)

### Common Issues & Solutions

#### Issue: Cannot Login to Admin

**Symptoms:**
- "Invalid credentials" error
- Redirected back to login page

**Solutions:**
1. Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`
2. Check for typos (emails are case-insensitive, passwords are case-sensitive)
3. Clear browser cookies and try again
4. Check browser console for JavaScript errors
5. Verify rate limit not exceeded (5 attempts / 15 minutes)

#### Issue: Questions Not Appearing in Queue

**Symptoms:**
- Dashboard shows "No paid questions"
- Question submitted but not visible

**Solutions:**
1. Check question `payment_status`:
   ```sql
   SELECT id, payment_status, status FROM questions ORDER BY created_at DESC LIMIT 10;
   ```
2. Verify payment webhook was received (check OpenNode dashboard)
3. Check server logs for webhook errors
4. Ensure question has `payment_status = 'paid'` and `status = 'paid'`

#### Issue: Emails Not Sending

**Symptoms:**
- Users not receiving payment confirmations
- Admin not receiving question notifications

**Solutions:**
1. Check `RESEND_API_KEY` is set in environment variables
2. Verify Resend API key is valid (Resend dashboard → API Keys)
3. Check `email_logs` table for error messages:
   ```sql
   SELECT * FROM email_logs WHERE status != 'sent' ORDER BY created_at DESC;
   ```
4. Verify sender domain is verified in Resend
5. Check spam folders
6. Ensure user has not unsubscribed:
   ```sql
   SELECT * FROM email_preferences WHERE unsubscribed = true;
   ```

#### Issue: Answer Submission Fails

**Symptoms:**
- "CSRF token invalid" error
- Answer doesn't save

**Solutions:**
1. Refresh the page (regenerates CSRF token)
2. Log out and log back in
3. Check browser console for errors
4. Verify question is in `paid` status:
   ```sql
   SELECT id, status, payment_status FROM questions WHERE id = 'xxx';
   ```
5. Check admin audit logs for errors

#### Issue: Webhook Signature Verification Failing

**Symptoms:**
- Payments confirmed in OpenNode but not in database
- "Invalid signature" in server logs

**Solutions:**
1. Verify `OPENNODE_WEBHOOK_SECRET` matches OpenNode dashboard
2. Check webhook URL in OpenNode dashboard matches production URL
3. Ensure webhook secret has no extra whitespace
4. Test webhook manually from OpenNode dashboard

### Server Logs

**Structured Logging:**

All critical events are logged in JSON format:

```json
{
  "event": "question_submitted",
  "question_id": "uuid",
  "payment_id": "uuid",
  "invoice_id": "xxx",
  "user_email": "user@example.com",
  "category": "Bitcoin Basics",
  "pricing_tier": "standard",
  "amount_sats": 5000,
  "timestamp": "2025-12-16T10:30:00Z",
  "success": true
}
```

**Key Events:**
- `question_submitted` - New question created
- `webhook_received` - Payment webhook processed
- `webhook_processed` - Payment status updated
- `email_sent` - Email delivery attempted
- `admin_login` - Admin authentication

**Viewing Logs:**
- **Vercel:** Dashboard → Project → Logs
- **Local:** Console output during `npm run dev`

---

## Best Practices

### Security

1. **Change Default Password Immediately**
   - Use 32+ character random password
   - Mix uppercase, lowercase, numbers, symbols
   - Store in password manager

2. **Never Share Admin Credentials**
   - Each admin should have their own account (future enhancement)
   - Don't include credentials in screenshots or recordings

3. **Use HTTPS Only**
   - Never access admin dashboard over HTTP
   - Vercel enforces HTTPS automatically

4. **Monitor Audit Logs**
   - Review `admin_audit_log` weekly
   - Check for unexpected login attempts
   - Verify all actions are legitimate

5. **Logout When Done**
   - Always click "Logout" when finished
   - Don't rely on automatic session expiration

### Question Management

1. **Respond Promptly**
   - Aim to answer within the tier's promised timeframe
   - Quick: 24 hours
   - Standard: 48 hours
   - Deep Dive: 1 week

2. **Quality Over Speed**
   - Take time to provide comprehensive answers
   - Research if you're unsure
   - Include video for complex topics

3. **Use Archive Feature Wisely**
   - Only publish high-quality Q&A pairs
   - Respect user privacy (only publish if user consented)
   - Archive builds valuable content library

4. **Track Response Times**
   - Monitor your average response time
   - Identify bottlenecks
   - Set aside dedicated time for Q&A

### Email Management

1. **Monitor Delivery Rates**
   - Check `email_logs` weekly
   - Investigate bounce patterns
   - Maintain >95% delivery rate

2. **Respect Unsubscribes**
   - System automatically blocks emails to unsubscribed users
   - Never manually override unsubscribe status
   - Review unsubscribe reasons for feedback

3. **Test Email Flow**
   - Submit test questions periodically
   - Verify all 5 email types are working
   - Check email formatting in multiple clients

### Payment Monitoring

1. **Check Payment Status Daily**
   - Review unpaid questions
   - Monitor expiration rate
   - Identify payment issues early

2. **Invoice Expiration**
   - 60-minute default expiration
   - Users can resubmit expired questions
   - Expiration email guides users to resubmit

3. **Payment Anomalies**
   - Watch for underpayments
   - Report suspicious patterns
   - Contact OpenNode support if issues persist

---

## Quick Reference

### Essential Database Queries

**Check Questions Awaiting Answer:**
```sql
SELECT
  id,
  user_name,
  user_email,
  category,
  pricing_tier,
  created_at
FROM questions
WHERE status = 'paid'
  AND payment_status = 'paid'
ORDER BY created_at ASC;
```

**View Recent Admin Activity:**
```sql
SELECT
  action,
  resource_type,
  resource_id,
  ip_address,
  created_at
FROM admin_audit_log
WHERE admin_email = 'your-email@domain.com'
ORDER BY created_at DESC
LIMIT 20;
```

**Check Email Delivery Issues:**
```sql
SELECT
  recipient_email,
  template_name,
  status,
  error,
  created_at
FROM email_logs
WHERE status IN ('bounced', 'complained')
ORDER BY created_at DESC;
```

**Payment Summary (Last 7 Days):**
```sql
SELECT
  COUNT(*) as total_payments,
  SUM(amount_sats) as total_sats,
  AVG(amount_sats) as avg_sats,
  SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid,
  SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired
FROM payments
WHERE created_at > NOW() - INTERVAL '7 days';
```

### Essential URLs

- **Admin Login:** `/admin/login`
- **Question Queue:** `/admin/queue`
- **API Docs:** `docs/ARCHITECTURE.md#api-routes`
- **Payment Testing:** `docs/PAYMENT_TESTING.md`
- **Deployment Guide:** `docs/DEPLOYMENT.md`

### Support Contacts

- **Developer Documentation:** `docs/ARCHITECTURE.md`
- **Deployment Issues:** `docs/DEPLOYMENT.md`
- **Payment Testing:** `docs/PAYMENT_TESTING.md`
- **Resend Support:** https://resend.com/support
- **OpenNode Support:** https://opennode.com/support
- **Supabase Support:** https://supabase.com/support

---

## Appendix: Admin Workflow Checklist

### Daily Tasks

- [ ] Login to admin dashboard (`/admin/queue`)
- [ ] Review paid questions awaiting answers
- [ ] Answer questions by priority (oldest first)
- [ ] Check email delivery status for recent answers
- [ ] Review any payment issues

### Weekly Tasks

- [ ] Review admin audit logs for anomalies
- [ ] Check email delivery rates (`email_logs`)
- [ ] Monitor payment success rate (`payments`)
- [ ] Calculate average response time
- [ ] Review unsubscribe reasons (if any)

### Monthly Tasks

- [ ] Review overall system performance
- [ ] Analyze question categories and trends
- [ ] Update answer templates/guidelines
- [ ] Review and rotate admin password
- [ ] Archive answered questions (database cleanup if needed)

---

**Version:** 1.0.0
**Last Updated:** December 16, 2025
**For Support:** See `docs/ARCHITECTURE.md` or `docs/DEPLOYMENT.md`
