# soundsfair - Bitcoin Education Platform

Educational platform about Bitcoin, fair money, economic freedom, and libertarian values.

**Version:** 0.2.0 | **Status:** 70% Complete - Ready for Production Setup

## Quick Start

```bash
npm install                    # Install dependencies
cp .env.example .env.local    # Create environment file
npm run dev                   # Run development server
npm run build                 # Build for production
```

## 📊 Project Status

### ✅ What's Complete (70%)

- **9 Complete Bitcoin Lessons** - Beginner → Advanced educational content
- **Interactive DCA Calculator** - Compare BTC vs S&P500, Gold, MSCI World
- **Lightning Q&A System** - OpenNode integration with 3 pricing tiers
- **Admin Dashboard** - Manage questions and answers
- **Modern Navigation** - Dropdown menus, enhanced search, mobile-responsive
- **Email System** - Resend integration for notifications
- **Database Schema** - Supabase with migrations ready

### ⚠️ Critical Pending

1. **Environment Variables** - Supabase, OpenNode, Resend credentials
2. **Production Deployment** - Vercel setup and configuration
3. **Database Setup** - Run Supabase migrations
4. **Webhook Configuration** - OpenNode webhook for production URL

See `docs/PROJECT_STATUS.md` for complete status and pending tasks.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Database**: Supabase (PostgreSQL)
- **Payments**: OpenNode (Lightning Network)
- **Email**: Resend
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts
- **Deployment**: Vercel (recommended)

## 📂 Project Structure

```
soundsfair-app/
├── app/
│   ├── admin/              # Admin dashboard (login, queue)
│   ├── api/
│   │   ├── admin/         # Admin APIs
│   │   ├── qa/            # Q&A submission and status
│   │   └── webhooks/      # OpenNode webhook handler
│   ├── components/        # React components
│   │   ├── Header.tsx     # Navigation with dropdowns
│   │   ├── QAForm.tsx     # Q&A submission form
│   │   └── PaymentInvoice.tsx  # Lightning invoice display
│   ├── lessons/           # 9 educational lessons
│   ├── qa/                # Lightning Q&A page
│   ├── tools/             # DCA Calculator
│   ├── lib/
│   │   ├── opennode.ts    # Lightning payment integration
│   │   ├── email.ts       # Email notifications (Resend)
│   │   ├── supabase-admin.ts  # Database admin client
│   │   └── validation.ts  # Zod schemas
│   └── types/
│       ├── qa.ts          # Q&A types
│       └── database.ts    # Database types
├── docs/                  # Complete documentation
│   ├── PROJECT_STATUS.md  # Current status and pending tasks
│   ├── QUICK_START.md     # Setup guide
│   ├── SUPABASE_SETUP.md  # Database configuration
│   ├── OPENNODE_SETUP.md  # Payment setup
│   └── ADMIN_SYSTEM.md    # Admin guide
├── supabase/
│   └── migrations/        # Database schema migrations
├── content/               # Markdown lesson content
└── public/                # Static assets
```

## 📚 Documentation

- **[Project Status](docs/PROJECT_STATUS.md)** - Complete status report and pending tasks
- **[Quick Start Guide](docs/QUICK_START.md)** - Environment setup instructions
- **[Supabase Setup](docs/SUPABASE_SETUP.md)** - Database configuration
- **[OpenNode Setup](docs/OPENNODE_SETUP.md)** - Lightning payment setup
- **[Admin System](docs/ADMIN_SYSTEM.md)** - Admin dashboard guide

## 🔧 Environment Variables

Create `.env.local` file with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenNode (Lightning)
OPENNODE_API_KEY=
OPENNODE_WEBHOOK_SECRET=

# Resend (Email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Admin
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `docs/QUICK_START.md` for detailed setup.

## 🚀 Features

### Educational Content (100% Complete)
- 9 comprehensive Bitcoin lessons (Beginner → Advanced)
- Interactive quizzes per lesson
- Bitcoin glossary (50+ terms)
- FAQ (20+ questions)
- Educational charts and visualizations

### Tools (100% Complete)
- DCA Calculator with multi-asset comparison
- Export results to CSV
- Shareable URLs with parameters
- Interactive charts (Recharts)

### Lightning Q&A System (100% Backend Complete)
- Submit questions with Bitcoin payment
- 3 pricing tiers: Quick (1k sats), Standard (5k sats), Priority (10k sats)
- Lightning invoice with QR code
- OpenNode integration
- Email confirmations (user + admin)
- Admin dashboard for answering

### Navigation (100% Complete)
- Dropdown menus (Learn, Tools)
- All 9 lessons accessible
- Enhanced search (14+ items)
- Mobile-responsive
- Q&A prominently displayed with lightning badge ⚡

## 📋 Next Steps

1. **Configure Environment Variables** (Critical)
   - Create Supabase project
   - Setup OpenNode account
   - Configure Resend for emails
   - Add all credentials to `.env.local`

2. **Deploy to Production** (Critical)
   - Push to GitHub ✅ DONE
   - Import project in Vercel
   - Add environment variables
   - Deploy and test

3. **Remove Lesson Locking** (Medium Priority)
   - Allow access to all 9 lessons without quiz completion requirement

4. **End-to-End Testing** (High Priority)
   - Test complete Q&A flow
   - Verify Lightning payments
   - Test admin dashboard

See `docs/PROJECT_STATUS.md` for complete checklist.

## 📞 Support

- **Repository:** https://github.com/IgooorBastos/soundsfair
- **Documentation:** `/docs` folder
- **Issues:** GitHub Issues

---

**Version:** 0.2.0
**Last Updated:** December 5, 2025
**Author:** Igor Bastos

🤖 Built with [Claude Code](https://claude.com/claude-code)
