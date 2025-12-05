# OpenNode Payment Integration Setup Guide

This guide explains how to set up OpenNode for Lightning Network payments in the soundsfair Q&A system.

## Phase 2: Payment Integration - Complete

The payment integration has been fully implemented with the following components:

### What's Been Built

1. **OpenNode Service Layer** (`app/lib/opennode.ts`)
   - Invoice creation via OpenNode API
   - Payment status checking
   - Webhook signature verification
   - Utility functions for sats/BTC conversion

2. **API Endpoints**
   - `POST /api/qa/submit` - Submit question and create Lightning invoice
   - `POST /api/webhooks/opennode` - Receive payment confirmations from OpenNode
   - `GET /api/qa/payment-status` - Poll payment status (fallback if webhook fails)

3. **UI Components**
   - `PaymentInvoice.tsx` - Display Lightning invoice with QR code
   - Updated `QAForm.tsx` - Integrated payment flow
   - Real-time payment status polling
   - Countdown timer for invoice expiration

4. **Database Integration**
   - Questions and payments tables already created in Supabase
   - Automatic status updates on payment confirmation
   - Row-level security policies configured

## OpenNode Setup Instructions

### Step 1: Create OpenNode Account

1. Visit [opennode.com](https://www.opennode.com/)
2. Sign up for an account
3. Choose "Testnet" for development or "Mainnet" for production

### Step 2: Get API Credentials

1. Log in to your OpenNode dashboard
2. Navigate to **Settings** → **API**
3. Create a new API key
4. Copy the API key (you'll need this for `.env.local`)

### Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# OpenNode API Key (get from opennode.com)
OPENNODE_API_KEY=your_api_key_here

# OpenNode Webhook Secret (generate when setting up webhooks)
OPENNODE_WEBHOOK_SECRET=your_webhook_secret_here
```

### Step 4: Set Up Webhooks

1. In OpenNode dashboard, go to **Settings** → **Webhooks**
2. Add a new webhook URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/opennode`
   - **Production**: `https://soundsfair.com/api/webhooks/opennode`
3. Generate a webhook secret
4. Copy the secret and add it to `.env.local` as `OPENNODE_WEBHOOK_SECRET`
5. Enable the following webhook events:
   - `charge:paid`
   - `charge:processing`
   - `charge:expired`
   - `charge:underpaid`

### Step 5: Test the Integration

#### Using Testnet (Recommended for Development)

1. Make sure you're using OpenNode's testnet
2. Submit a test question through `/qa`
3. Pay the invoice using a testnet Lightning wallet:
   - [Phoenix Testnet](https://phoenix.acinq.co/)
   - [Breez Testnet](https://breez.technology/)
4. Verify payment is confirmed and question status updates

#### Testing Webhook Delivery

You can test webhook delivery manually:

```bash
# Check webhook endpoint is accessible
curl https://your-domain.com/api/webhooks/opennode

# Should return:
# {"message":"OpenNode webhook endpoint is active","timestamp":"..."}
```

## Architecture Overview

### Payment Flow

1. **User submits question**
   - Frontend: `QAForm.tsx` → POST `/api/qa/submit`
   - Backend creates question and payment records in Supabase
   - Backend calls OpenNode API to create Lightning invoice
   - Frontend displays invoice with QR code in `PaymentInvoice.tsx`

2. **User pays invoice**
   - User scans QR code with Lightning wallet
   - Payment is sent to OpenNode
   - Invoice expires after 60 minutes if not paid

3. **Payment confirmation**
   - **Primary**: OpenNode sends webhook to `/api/webhooks/opennode`
   - **Fallback**: Frontend polls `/api/qa/payment-status` every 5 seconds
   - Backend updates payment and question status in database
   - Frontend shows success message

4. **Question enters queue**
   - Question status changes from `awaiting_payment` to `in_queue`
   - Admin can see question in queue for answering
   - User receives confirmation (TODO: email notification)

### Security Measures

- Webhook signature verification using HMAC-SHA256
- Row-level security policies in Supabase
- Server-side invoice creation (API keys never exposed to client)
- Payment status polling as fallback for missed webhooks

## Pricing Tiers

| Tier | Price | Response Time | Format |
|------|-------|---------------|--------|
| Quick Answer | 1,000 sats | 24 hours | Text (1-2 paragraphs) |
| Detailed Answer | 5,000 sats | 48 hours | Text (comprehensive) |
| Video Response | 20,000 sats | 1 week | Video (5-10 minutes) |

## Troubleshooting

### Issue: Invoices Not Creating

**Symptoms**: Error when submitting question, no invoice generated

**Solutions**:
1. Check `OPENNODE_API_KEY` is set in `.env.local`
2. Verify API key is valid in OpenNode dashboard
3. Check console logs for OpenNode API errors
4. Ensure you're using testnet for development

### Issue: Webhooks Not Received

**Symptoms**: Payment made but question status not updating

**Solutions**:
1. Verify webhook URL is accessible from internet
2. Use ngrok for local development: `ngrok http 3000`
3. Check OpenNode dashboard for webhook delivery logs
4. Verify `OPENNODE_WEBHOOK_SECRET` matches dashboard
5. Payment status polling should update status as fallback

### Issue: Payment Status Not Updating

**Symptoms**: Frontend shows "awaiting payment" after paying

**Solutions**:
1. Wait 5-10 seconds for polling to check status
2. Click "I've Already Paid" button to force refresh
3. Check browser console for API errors
4. Verify question ID in URL params

## Development vs Production

### Development Setup

- Use OpenNode testnet
- Use ngrok for webhook testing
- Set `NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io`
- Test with testnet Lightning wallets

### Production Setup

- Switch to OpenNode mainnet
- Configure production webhook URL
- Set `NEXT_PUBLIC_APP_URL=https://soundsfair.com`
- Monitor webhook delivery in production
- Set up error alerting (Sentry, etc.)

## Next Steps (Future Enhancements)

- [ ] Email notifications on payment confirmation (using Resend)
- [ ] Admin dashboard to manage paid questions
- [ ] Payment refund functionality
- [ ] Support for on-chain fallback payments
- [ ] Invoice status dashboard for users
- [ ] Webhook retry logic for failed deliveries
- [ ] Analytics dashboard for payment metrics

## API Reference

### Create Invoice

**Endpoint**: `POST /api/qa/submit`

**Request Body**:
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "category": "technical",
  "questionText": "How does Bitcoin mining work?",
  "pricingTier": "quick",
  "publishToArchive": false
}
```

**Response**:
```json
{
  "success": true,
  "questionId": "uuid",
  "payment": {
    "invoiceId": "invoice-id",
    "invoiceUrl": "https://checkout.opennode.com/...",
    "lightningInvoice": "lnbc...",
    "qrCodeData": "data:image/png;base64,...",
    "amountSats": 1000,
    "expiresAt": "2025-12-04T12:00:00Z"
  }
}
```

### Check Payment Status

**Endpoint**: `GET /api/qa/payment-status?questionId=uuid`

**Response**:
```json
{
  "questionId": "uuid",
  "paymentStatus": "paid",
  "questionStatus": "in_queue"
}
```

### OpenNode Webhook

**Endpoint**: `POST /api/webhooks/opennode`

**Headers**:
- `opennode-signature`: HMAC-SHA256 signature

**Payload**:
```json
{
  "id": "charge-id",
  "status": "paid",
  "order_id": "question-uuid",
  "amount": 1000,
  "lightning_invoice": {
    "expires_at": 1234567890,
    "payreq": "lnbc..."
  }
}
```

## Support

For issues related to:
- **OpenNode API**: Contact OpenNode support
- **soundsfair integration**: Check GitHub issues or contact admin
- **Lightning Network**: Consult Lightning Network documentation

## Resources

- [OpenNode API Documentation](https://developers.opennode.com/)
- [Lightning Network Documentation](https://lightning.network/)
- [BOLT11 Invoice Format](https://github.com/lightning/bolts/blob/master/11-payment-encoding.md)
- [Supabase Documentation](https://supabase.com/docs)
