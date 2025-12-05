# Quick Start - Supabase Setup

This is a condensed version of the full setup guide. For detailed instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

---

## ⚡ 5-Minute Setup

### 1. Create Supabase Project

1. Go to https://supabase.com → Sign up
2. Create new project → Choose **Free** tier
3. Save your database password!

### 2. Run Database Migration

1. In Supabase dashboard → **SQL Editor** → **New query**
2. Copy entire contents of: `soundsfair-app/supabase/migrations/001_qa_schema.sql`
3. Paste and **Run** (Ctrl+Enter)
4. Verify in **Table Editor**: 5 tables should exist

### 3. Create Admin User

In SQL Editor, run:
```sql
INSERT INTO admin_users (email, role)
VALUES ('your-email@example.com', 'super_admin');
```

### 4. Get API Credentials

Supabase Dashboard → **Settings** → **API**

Copy these 3 values:
- Project URL
- anon public key
- service_role key (⚠️ SECRET!)

### 5. Configure Environment Variables

Create/update `soundsfair-app/.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # SECRET!

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Test Connection

```bash
npx tsx scripts/test-supabase.ts
```

Expected: ✅ ALL TESTS PASSED!

---

## 📋 Checklist

- [ ] Supabase project created
- [ ] Migration script executed (5 tables created)
- [ ] Admin user added
- [ ] API credentials copied
- [ ] `.env.local` configured
- [ ] Connection test passed

---

## 🔧 Common Issues

**"relation does not exist"**
→ Migration didn't run. Re-run the SQL script.

**"permission denied"**
→ Wrong API key. Check `.env.local` values.

**"invalid JWT"**
→ Key copied incorrectly. Verify no spaces/newlines.

**Test script fails**
→ Run: `npm install -D tsx`

---

## 📚 Resources

- Full setup guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Implementation plan: `~/.claude/plans/iridescent-dreaming-dream.md`
- Supabase docs: https://supabase.com/docs

---

## 🎯 Next Steps

Once setup is complete:

1. ✅ Supabase configured
2. 🔄 Continue building Q&A Form UI (Phase 1.3)
3. 🔄 Implement payment flow (Week 2)
4. 🔄 Add admin dashboard (Week 3)

**Ready to continue? Let Claude know!**
