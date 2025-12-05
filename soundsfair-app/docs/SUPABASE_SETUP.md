# Supabase Setup Guide for soundsfair Q&A System

This guide will walk you through setting up Supabase for the Lightning Network paid Q&A feature.

---

## Table of Contents

1. [Create Supabase Account & Project](#1-create-supabase-account--project)
2. [Run Database Migration](#2-run-database-migration)
3. [Configure Row Level Security](#3-configure-row-level-security)
4. [Create First Admin User](#4-create-first-admin-user)
5. [Get API Credentials](#5-get-api-credentials)
6. [Configure Environment Variables](#6-configure-environment-variables)
7. [Test Database Connection](#7-test-database-connection)
8. [Optional: Set Up Scheduled Jobs](#8-optional-set-up-scheduled-jobs)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Create Supabase Account & Project

### Step 1.1: Sign Up

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### Step 1.2: Create New Project

1. Click **"New Project"**
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `soundsfair-qa` (or your preferred name)
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose closest to your users (e.g., `us-west-1`)
   - **Pricing Plan**: Select **"Free"** tier (perfect for MVP)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

---

## 2. Run Database Migration

### Step 2.1: Open SQL Editor

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**

### Step 2.2: Run the Migration Script

1. Open the migration file located at:
   ```
   soundsfair-app/supabase/migrations/001_qa_schema.sql
   ```

2. Copy the **entire contents** of the file

3. Paste into the Supabase SQL Editor

4. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)

5. You should see:
   ```
   Success. No rows returned
   ```

### Step 2.3: Verify Tables Created

1. Click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ `questions`
   - ✅ `payments`
   - ✅ `admin_users`
   - ✅ `question_categories`
   - ✅ `pricing_tiers`

3. Click on `pricing_tiers` - you should see 3 rows:
   - quick (1000 sats)
   - detailed (5000 sats)
   - video (20000 sats)

4. Click on `question_categories` - you should see 5 rows:
   - technical
   - economics
   - security
   - getting-started
   - geopolitics

---

## 3. Configure Row Level Security

RLS (Row Level Security) is already configured by the migration script, but let's verify:

### Step 3.1: Check RLS Status

1. Go to **"Authentication"** > **"Policies"**
2. You should see policies for:
   - **questions** (3 policies)
   - **payments** (1 policy)
   - **admin_users** (1 policy)

### Step 3.2: Verify Policies

**Questions table should have:**
- ✅ "Anyone can insert questions" - `INSERT` policy
- ✅ "Users can view own questions by email" - `SELECT` policy
- ✅ "Admins have full access to questions" - `ALL` policy

**If policies are missing**, go back to SQL Editor and re-run the migration script.

---

## 4. Create First Admin User

You need at least one admin user to access the admin dashboard.

### Step 4.1: Create Admin via SQL

1. Go to **"SQL Editor"** > **"New query"**

2. Run this query (replace with your email):
   ```sql
   INSERT INTO admin_users (email, role)
   VALUES ('your-email@example.com', 'super_admin');
   ```

3. Verify it worked:
   ```sql
   SELECT * FROM admin_users;
   ```

### Step 4.2: Set Up Supabase Auth User

Later, when implementing admin login, you'll need to:

1. Go to **"Authentication"** > **"Users"**
2. Click **"Add user"** > **"Create new user"**
3. Enter the same email as above
4. Choose **"Auto Confirm User"** = Yes
5. Click **"Create user"**

**Note:** For now, just creating the admin_users record is enough. We'll set up auth later.

---

## 5. Get API Credentials

### Step 5.1: Find Your Project Credentials

1. Go to **"Settings"** (gear icon in sidebar)
2. Click **"API"**
3. You'll see:

#### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
**👉 Copy this - it's your `NEXT_PUBLIC_SUPABASE_URL`**

#### Project API keys

**anon public** (safe for browser):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**👉 Copy this - it's your `NEXT_PUBLIC_SUPABASE_ANON_KEY`**

**service_role** (⚠️ SECRET - never expose to browser):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**👉 Copy this - it's your `SUPABASE_SERVICE_ROLE_KEY`**

### Step 5.2: Save Credentials Securely

**⚠️ CRITICAL:**
- **NEVER** commit `service_role` key to git
- **NEVER** expose it to the browser/client-side
- Store it only in `.env.local` (which is in `.gitignore`)

---

## 6. Configure Environment Variables

### Step 6.1: Update .env.local

1. Open (or create) `soundsfair-app/.env.local`

2. Add these variables:

```bash
# ============================================================================
# SUPABASE CONFIGURATION
# ============================================================================

# Project URL (public, safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Anon key (public, safe for browser, RLS enforced)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzc2NzY4NSwiZXhwIjoxOTM5MzQzNjg1fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Service role key (SECRET! Server-side only, bypasses RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIzNzY3Njg1LCJleHAiOjE5MzkzNDM2ODV9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================================================
# PAYMENT CONFIGURATION (Add later when implementing OpenNode)
# ============================================================================

# OpenNode API Key (get from opennode.com)
# OPENNODE_API_KEY=

# OpenNode Webhook Secret (generate when setting up webhooks)
# OPENNODE_WEBHOOK_SECRET=

# ============================================================================
# EMAIL CONFIGURATION (Add later when implementing Resend)
# ============================================================================

# Resend API Key (get from resend.com)
# RESEND_API_KEY=

# Admin email for notifications
# ADMIN_EMAIL=your-email@example.com

# ============================================================================
# APPLICATION
# ============================================================================

# Public site URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Replace the example values with your actual credentials

4. Save the file

### Step 6.2: Verify .gitignore

Make sure `.env.local` is in your `.gitignore`:

```bash
# Check if .env.local is ignored
cat .gitignore | grep .env.local
```

If not there, add it:
```bash
echo ".env.local" >> .gitignore
```

---

## 7. Test Database Connection

### Step 7.1: Create Test Script

Create a test file to verify the connection works:

**File:** `soundsfair-app/scripts/test-supabase.ts`

```typescript
import { supabase } from '../app/lib/supabase';
import { supabaseAdmin } from '../app/lib/supabase-admin';

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  // Test 1: Fetch pricing tiers (public data)
  console.log('Test 1: Fetching pricing tiers...');
  const { data: tiers, error: tiersError } = await supabase
    .from('pricing_tiers')
    .select('*')
    .order('display_order');

  if (tiersError) {
    console.error('❌ Error fetching tiers:', tiersError);
  } else {
    console.log('✅ Pricing tiers:', tiers?.length, 'found');
    tiers?.forEach(tier => console.log(`   - ${tier.name}: ${tier.amount_sats} sats`));
  }

  // Test 2: Fetch categories
  console.log('\nTest 2: Fetching question categories...');
  const { data: categories, error: catError } = await supabase
    .from('question_categories')
    .select('*')
    .order('display_order');

  if (catError) {
    console.error('❌ Error fetching categories:', catError);
  } else {
    console.log('✅ Categories:', categories?.length, 'found');
    categories?.forEach(cat => console.log(`   ${cat.icon} ${cat.name}`));
  }

  // Test 3: Admin connection
  console.log('\nTest 3: Testing admin connection...');
  const { data: stats, error: statsError } = await supabaseAdmin
    .rpc('get_question_stats');

  if (statsError) {
    console.error('❌ Error getting stats:', statsError);
  } else {
    console.log('✅ Question stats:', stats?.[0]);
  }

  // Test 4: Check admin users
  console.log('\nTest 4: Checking admin users...');
  const { data: admins, error: adminError } = await supabaseAdmin
    .from('admin_users')
    .select('email, role, created_at');

  if (adminError) {
    console.error('❌ Error fetching admins:', adminError);
  } else {
    console.log('✅ Admin users:', admins?.length, 'found');
    admins?.forEach(admin => console.log(`   - ${admin.email} (${admin.role})`));
  }

  console.log('\n✅ All tests completed!\n');
}

testConnection().catch(console.error);
```

### Step 7.2: Run the Test

```bash
cd soundsfair-app
npx tsx scripts/test-supabase.ts
```

**Expected output:**
```
🔍 Testing Supabase connection...

Test 1: Fetching pricing tiers...
✅ Pricing tiers: 3 found
   - Quick Answer: 1000 sats
   - Detailed Answer: 5000 sats
   - Video Response: 20000 sats

Test 2: Fetching question categories...
✅ Categories: 5 found
   ⚙️ Technical
   💰 Economics
   🔒 Security
   🚀 Getting Started
   🌍 Geopolitics

Test 3: Testing admin connection...
✅ Question stats: { total_questions: 0, ... }

Test 4: Checking admin users...
✅ Admin users: 1 found
   - your-email@example.com (super_admin)

✅ All tests completed!
```

If you see errors, check your environment variables and credentials.

---

## 8. Optional: Set Up Scheduled Jobs

The database has a function `expire_old_payments()` that should run periodically to mark expired invoices.

### Option 1: Supabase Cron Jobs (Recommended)

1. Go to **"Database"** > **"Cron Jobs"**
2. Click **"Create a new cron job"**
3. Configure:
   - **Name**: `expire_old_payments`
   - **Schedule**: `*/15 * * * *` (every 15 minutes)
   - **SQL**:
     ```sql
     SELECT expire_old_payments();
     ```
4. Click **"Create"**

### Option 2: Manual API Endpoint (Later)

We'll create an API endpoint `/api/cron/expire-payments` that can be called by:
- Netlify scheduled functions
- GitHub Actions
- External cron service (cron-job.org)

**We'll implement this later in Week 3.**

---

## 9. Troubleshooting

### Problem: "relation does not exist" errors

**Solution:** The migration didn't run successfully.
1. Go to SQL Editor
2. Re-run the entire migration script
3. Check for any error messages

### Problem: "permission denied" errors

**Solution:** RLS policies might be blocking access.
1. Verify you're using the correct key (service role for admin operations)
2. Check RLS policies in Authentication > Policies
3. Temporarily disable RLS for testing:
   ```sql
   ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
   ```
   (Don't forget to re-enable it!)

### Problem: "invalid JWT" errors

**Solution:** Wrong API key or expired token.
1. Double-check your environment variables
2. Make sure you copied the full key (they're long!)
3. Verify no extra spaces or newlines

### Problem: Can't connect to Supabase

**Solution:** Network or configuration issue.
1. Check your project URL is correct
2. Verify the project is not paused (free tier pauses after 7 days inactivity)
3. Check Supabase status: https://status.supabase.com

### Problem: Test script fails with module errors

**Solution:** Install tsx for running TypeScript:
```bash
npm install -D tsx
```

---

## Next Steps After Setup

Once Supabase is configured and tested:

1. ✅ Database schema deployed
2. ✅ API credentials configured
3. ✅ Connection tested
4. ✅ Admin user created

**You're ready to continue with Phase 1.3: Building the Q&A Form UI!**

Let Claude know when setup is complete, and we'll build:
- Q&A landing page
- Question submission form
- Pricing tier selector
- Payment modal (coming in Week 2)

---

## Supabase Resources

- **Documentation**: https://supabase.com/docs
- **SQL Editor**: Great for running queries and debugging
- **Table Editor**: Visual database browser
- **API Docs**: Auto-generated API documentation for your schema
- **Logs**: Real-time logs for debugging (Database > Logs)
- **Community**: https://github.com/supabase/supabase/discussions

---

## Security Checklist

Before going to production:

- [ ] Service role key is in `.env.local` (not committed to git)
- [ ] Row Level Security is enabled on all tables
- [ ] Admin users table has at least one super_admin
- [ ] Database password is strong and saved securely
- [ ] Backup strategy configured (Supabase auto-backups on paid plans)
- [ ] SSL/HTTPS enforced (Netlify does this automatically)

---

**Questions or issues?** Check the Troubleshooting section above or let Claude know!
