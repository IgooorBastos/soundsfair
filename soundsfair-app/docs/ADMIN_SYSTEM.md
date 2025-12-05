# Admin System & Email Notifications - Documentation

Complete guide for the soundsfair Q&A Admin Dashboard and Email Notification system.

## Overview

The admin system allows you to manage paid Bitcoin questions, respond to users, and automatically send email notifications throughout the payment and Q&A lifecycle.

## Features Implemented

### Email Notifications (Resend)

- Payment confirmation emails to users
- New question notifications to admin
- Answer delivered emails to users
- Beautiful HTML templates with soundsfair branding
- Automatic sending on payment confirmation
- Automatic sending when answer is submitted

### Admin Dashboard

- Secure login system with session-based authentication
- Question queue management
- Answer submission interface
- Real-time question status
- Simple, clean UI with soundsfair design system

### Admin API

- `/api/admin/login` - Admin authentication
- `/api/admin/logout` - Session destruction
- `/api/admin/questions` - List questions with filters
- `/api/admin/questions/[id]/answer` - Submit answers

## Setup Instructions

### 1. Configure Resend (Email Service)

**Step 1: Create Resend Account**

1. Go to [resend.com](https://resend.com/)
2. Sign up for a free account
3. Verify your email address

**Step 2: Add Your Domain (Recommended for Production)**

1. Go to Domains in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `soundsfair.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually a few minutes)

**Step 3: Get API Key**

1. Go to API Keys in Resend dashboard
2. Click "Create API Key"
3. Give it a name (e.g., "soundsfair Production")
4. Copy the API key

**Step 4: Update Environment Variables**

```bash
# Add to .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**For Development/Testing:**
You can use Resend's testing domain (`onboarding@resend.dev`) without verifying your own domain. However, emails will only be sent to verified email addresses.

### 2. Configure Admin Access

**Update Admin Credentials:**

```bash
# In .env.local
ADMIN_EMAIL=your-email@domain.com
ADMIN_PASSWORD=your_secure_password_here
```

**Create Admin User in Database:**

The admin user is automatically created on first login. Just use the credentials from `.env.local` to log in.

### 3. Access Admin Dashboard

**Login:**
1. Navigate to `/admin/login`
2. Enter credentials from `.env.local`
3. Click "Login"

**Default Credentials (from your .env.local):**
- Email: `bitcoinnalata@proton.me`
- Password: `soundsfair_admin_2025`

⚠️ **IMPORTANT**: Change the default password before deploying to production!

## Admin Dashboard Usage

### Question Queue

**Access**: `/admin/queue`

**Features**:
- View all paid questions awaiting response
- Filter by status (in_queue, in_progress, answered)
- See question details (email, category, tier, payment amount)
- Click "Answer" to open response modal

### Answering Questions

1. Click "Answer" button on any question
2. Read the full question text
3. Write your comprehensive answer in the textarea
4. Click "Submit Answer"
5. User receives email automatically
6. Question status updates to "answered"

### Logout

Click "Logout" in the top-right to end your session.

## Email Templates

### 1. Payment Confirmation Email

**Sent to**: User
**Trigger**: When Lightning payment is confirmed
**Contains**:
- Payment confirmation badge
- Amount paid (in sats)
- Service tier selected
- Expected response time
- Question preview
- Question ID for reference

### 2. Admin Notification Email

**Sent to**: Admin email (from .env.local)
**Trigger**: When Lightning payment is confirmed
**Contains**:
- New question alert
- User email and name
- Full question text
- Category and tier
- Payment amount
- Link to admin dashboard

### 3. Answer Delivered Email

**Sent to**: User
**Trigger**: When admin submits an answer
**Contains**:
- Answer ready notification
- Original question recap
- Full expert answer
- Video link (if provided)
- Links to continue learning
- Invitation to ask more questions

## Email Template Customization

All email templates are in `app/lib/email.ts`. You can customize:

### Update FROM Email

```typescript
// In app/lib/email.ts
const FROM_EMAIL = 'soundsfair <noreply@soundsfair.com>';
```

Make sure this email is verified in Resend dashboard.

### Customize Templates

Templates use inline CSS for maximum email client compatibility. Key sections:

```typescript
// Payment confirmation
function paymentConfirmationTemplate(data: {...})

// Admin notification
function newQuestionAdminTemplate(data: {...})

// Answer delivered
function answerDeliveredTemplate(data: {...})
```

## API Reference

### Admin Login

**Endpoint**: `POST /api/admin/login`

**Request**:
```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "email": "admin@example.com",
    "role": "super_admin"
  }
}
```

### List Questions

**Endpoint**: `GET /api/admin/questions?status=in_queue`

**Query Parameters**:
- `status`: Filter by status (in_queue, in_progress, answered, all)
- `limit`: Max questions to return (default: 50)
- `offset`: Pagination offset (default: 0)

**Response**:
```json
{
  "success": true,
  "questions": [...],
  "total": 10,
  "hasMore": false
}
```

### Submit Answer

**Endpoint**: `POST /api/admin/questions/[id]/answer`

**Request**:
```json
{
  "responseText": "Your detailed answer here...",
  "responseVideoUrl": "https://youtube.com/...", // optional
  "publishToArchive": false // optional
}
```

**Response**:
```json
{
  "success": true,
  "questionId": "uuid"
}
```

## Security Features

### Authentication

- Session-based authentication with HTTP-only cookies
- 7-day session expiration
- Environment variable-based credentials
- Admin-only API route protection

### Authorization

- All admin routes require valid session
- Unauthorized requests return 401
- Session validation on every request
- Automatic redirect to login if expired

### Best Practices

1. **Change Default Password**: Update `ADMIN_PASSWORD` in production
2. **Use Strong Passwords**: Minimum 16 characters, mixed case, numbers, symbols
3. **HTTPS Only**: Always use HTTPS in production
4. **Limit Admin Access**: Only give credentials to trusted individuals
5. **Monitor Access**: Check admin login times in database

## Workflow Example

### Complete User Journey

1. **User submits question** → Form submitted
2. **Lightning invoice created** → User sees QR code
3. **User pays invoice** → Lightning payment sent
4. **OpenNode webhook received** → Payment confirmed
5. **📧 Email sent to user** → "Payment confirmed, question in queue"
6. **📧 Email sent to admin** → "New paid question waiting"
7. **Admin logs in** → Views question in dashboard
8. **Admin writes answer** → Submits response
9. **Database updated** → Status changes to "answered"
10. **📧 Email sent to user** → "Your answer is ready!"
11. **User receives answer** → Opens email, reads response

## Troubleshooting

### Emails Not Sending

**Check**:
1. `RESEND_API_KEY` is set in `.env.local`
2. API key is valid in Resend dashboard
3. From email domain is verified (or using Resend's test domain)
4. Check Resend dashboard logs for delivery status
5. Check spam folder for test emails

**Solution**:
```bash
# Verify configuration
console.log('Resend configured:', emailService.isConfigured());
```

### Cannot Login to Admin

**Check**:
1. Credentials match `.env.local` exactly
2. `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
3. Database connection is working
4. Browser cookies are enabled

**Solution**:
- Clear browser cookies
- Check browser console for errors
- Verify database admin_users table exists

### Questions Not Appearing in Queue

**Check**:
1. Question status is `in_queue`
2. Payment status is `paid`
3. Admin session is valid
4. API endpoint is accessible

**Solution**:
- Check browser network tab
- Verify API response in console
- Check Supabase logs for errors

## Database Schema

### admin_users Table

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);
```

**Roles**:
- `admin`: Standard admin access
- `super_admin`: Full access (can manage other admins)

## Environment Variables Summary

```bash
# Email Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=your-email@domain.com

# Admin Access
ADMIN_PASSWORD=your_secure_password

# Site Configuration
NEXT_PUBLIC_APP_URL=https://soundsfair.com
```

## Production Deployment

### Pre-Deployment Checklist

- [ ] Update `ADMIN_PASSWORD` to strong password
- [ ] Verify Resend domain
- [ ] Update `FROM_EMAIL` with verified domain
- [ ] Test email delivery in production
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Test admin login
- [ ] Test complete workflow

### Monitoring

**Email Delivery**:
- Check Resend dashboard for delivery rates
- Monitor bounce rates
- Set up webhook for failed deliveries

**Admin Activity**:
- Monitor `last_login` in admin_users table
- Check question response times
- Track payment confirmations

## Future Enhancements

- [ ] Multi-admin support with role-based permissions
- [ ] Email template editor in admin dashboard
- [ ] Analytics dashboard (revenue, response times, etc.)
- [ ] Bulk operations (mark multiple as answered)
- [ ] Search and filtering in question queue
- [ ] Admin activity logs
- [ ] Email preview before sending
- [ ] Scheduled email sending
- [ ] Template A/B testing

## Support

For issues:
1. Check Resend dashboard logs
2. Check browser console errors
3. Check Supabase logs
4. Verify environment variables
5. Test with simple email first

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Documentation](https://supabase.com/docs)
