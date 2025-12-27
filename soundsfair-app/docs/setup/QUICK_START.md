# Quick Start Guide

**Get soundsfair up and running in 5 minutes**

**Last Updated:** December 27, 2025

---

## Prerequisites

- **Node.js:** 18+ (with npm)
- **Git:** For cloning the repository
- **Text Editor:** VS Code recommended

Optional (for full functionality):
- **Supabase Account:** Database hosting
- **OpenNode Account:** Lightning Network payments
- **Resend Account:** Email delivery

---

## 🚀 Local Development (5 Minutes)

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd soundsfair-app

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy example environment file
cp .env.example .env.local
```

**Minimum configuration for local dev:**

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=soundsfair

# For full functionality, add Supabase, OpenNode, and Resend credentials
# See DEPLOYMENT.md for complete setup
```

### 3. Run Development Server

```bash
# Start with Turbopack (10× faster)
npm run dev

# Or use Webpack fallback
npm run dev:webpack
```

**✅ Done!** Visit [http://localhost:3000](http://localhost:3000)

---

## 📱 What You'll See

### Available Features (No External Services)
- ✅ All 9 Bitcoin lessons
- ✅ Interactive quizzes
- ✅ DCA Calculator
- ✅ Satoshi Converter
- ✅ Halving Countdown
- ✅ What-If Calculator
- ✅ Glossary
- ✅ FAQ

### Requires Configuration
- ⚠️ Fear & Greed Index (CoinGecko API)
- ⚠️ Lightning Payments (OpenNode)
- ⚠️ Q&A System (OpenNode + Supabase)
- ⚠️ Email Notifications (Resend)
- ⚠️ User Progress Tracking (Supabase)

---

## 🔧 Full Setup (Production-Ready)

For complete functionality with database, payments, and emails:

### Step 1: Database Setup
See [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

### Step 2: Payment Setup
See [OPENNODE_SETUP.md](OPENNODE_SETUP.md)

### Step 3: Email Setup
See [DEPLOYMENT.md](../DEPLOYMENT.md#email-configuration)

### Step 4: Deploy
See [DEPLOYMENT.md](../DEPLOYMENT.md)

---

## 📝 Development Commands

```bash
# Development
npm run dev              # Turbopack (10× faster, recommended)
npm run dev:webpack      # Webpack (fallback)

# Production
npm run build            # Build for production (Webpack stable)
npm run build:turbo      # Build with Turbopack (experimental)
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npx tsc --noEmit         # TypeScript check
```

---

## 🗂️ Project Structure

```
soundsfair-app/
├── app/                 # Next.js 16 App Router
│   ├── admin/           # Admin dashboard
│   ├── api/             # API routes (17 endpoints)
│   ├── lessons/         # Lesson pages
│   ├── qa/              # Q&A system
│   └── tools/           # Bitcoin tools
├── components/          # React components
├── content/             # Markdown content
│   ├── lessons/         # 9 lesson files
│   ├── glossary/        # Glossary definitions
│   └── faq/             # FAQ entries
├── docs/                # Documentation
├── lib/                 # Utilities & integrations
│   ├── opennode.ts      # Lightning payments
│   ├── supabase-admin.ts # Database
│   └── email.ts         # Email system
├── public/              # Static assets
└── supabase/migrations/ # Database migrations
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit

# Some Supabase types may show warnings - these are expected
```

---

## 📚 Next Steps

### For Developers
1. Read [ARCHITECTURE.md](../ARCHITECTURE.md) - Understand the system
2. Read [API_REFERENCE.md](../api/API_REFERENCE.md) - API documentation
3. Review code structure and conventions

### For Testers
1. Read [QA_QUICK_CHECKLIST.md](../testing/qa/QA_QUICK_CHECKLIST.md)
2. Run manual tests
3. Report issues

### For Deployment
1. Read [DEPLOYMENT.md](../DEPLOYMENT.md)
2. Configure all services
3. Deploy to Vercel

---

## 🆘 Getting Help

- **Documentation:** See [docs/README.md](../README.md)
- **Troubleshooting:** See [security/TROUBLESHOOTING.md](../security/TROUBLESHOOTING.md)
- **Architecture Questions:** See [ARCHITECTURE.md](../ARCHITECTURE.md)
- **Issues:** Check GitHub Issues

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Dev server starts without errors
- [ ] Home page loads at http://localhost:3000
- [ ] All 9 lessons are accessible
- [ ] DCA Calculator works
- [ ] No console errors in browser
- [ ] Hot reload works (edit a file and see changes)

**If all checks pass, you're ready to develop!** 🎉

---

**Quick Start Version:** 1.0
**Last Updated:** December 27, 2025
**For detailed setup:** See [DEPLOYMENT.md](../DEPLOYMENT.md)
