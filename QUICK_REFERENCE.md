# Quick Reference Guide - Soundsfair Project

**Last Updated**: December 2, 2025

---

## 🚀 Quick Start

```bash
# Development
cd soundsfair-app
npm run dev
# → http://localhost:3000

# Build
npm run build

# Production
npm start
```

---

## 📁 Project Structure

```
soundsfair-app/
├── app/
│   ├── components/        # React components
│   │   ├── DCACalculator.tsx
│   │   └── GlossaryFootnotes.tsx
│   ├── lib/              # Utility functions
│   │   ├── csv-export.ts       ⭐ NEW
│   │   ├── dca-calculator.ts
│   │   └── markdown.ts
│   ├── api/              # API routes
│   │   ├── prices/
│   │   └── dca/
│   ├── tools/            # Tool pages
│   │   └── dca/
│   └── types/            # TypeScript types
├── content/              # Markdown content
│   ├── lessons/
│   ├── glossary/
│   └── faq/
└── public/              # Static assets
```

---

## ✅ Recent Changes (Dec 2, 2025)

### CSV Export Feature
- **File**: `app/lib/csv-export.ts` (NEW)
- **Usage**: Click "Export CSV" in DCA Calculator
- **Format**: 3-section CSV (metadata, summary, transactions)
- **Filename**: `dca-bitcoin-YYYY-MM-DD.csv`

### Bitcoin-Only DCA Calculator
- **Removed**: S&P500, Gold, MSCI World mock data
- **API**: CoinCap (primary), CoinGecko (fallback)
- **Data**: 11+ years of real Bitcoin prices (since 2013)

---

## 🎯 Next Steps (Priority Order)

### 1. Test CSV Export (30 min)
```bash
npm run dev
# Test at http://localhost:3000/tools/dca
# Export CSV and verify in Excel/Sheets
```

### 2. Git Commit (15 min)
```bash
git add .
git commit -m "feat(dca): CSV export + Bitcoin-only calculator"
git push
```

### 3. Share Results Feature (2-3h)
- Add URL parameter generation
- Add "Copy URL" button
- Parse URL on page load

---

## 📋 Key Files Modified

| File | Changes | Lines |
|------|---------|-------|
| `app/lib/csv-export.ts` | Created CSV export utility | +165 |
| `app/components/DCACalculator.tsx` | Added CSV button + toast | +40 |
| `app/api/prices/route.ts` | Bitcoin-only, API swap | -113 |
| `tailwind.config.ts` | Improved fade-in animation | ~5 |
| `CHANGELOG.md` | Documented changes | +50 |
| `PROJECT_STATUS.md` | Complete status doc | +600 |
| `TODO.md` | Task list | +450 |

---

## 🔧 Important Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

### Git Workflow
```bash
git status           # Check changes
git add .            # Stage all
git commit -m ""     # Commit
git push             # Push to remote
git log --oneline    # View history
```

### Deployment (Vercel)
```bash
vercel               # Deploy preview
vercel --prod        # Deploy production
vercel logs          # View logs
```

---

## 🐛 Debugging

### Common Issues

**Build fails with TypeScript errors:**
```bash
npm run type-check
# Fix errors shown
```

**CSV export not working:**
- Check browser console for errors
- Verify results exist before export
- Test Blob API support in browser

**Price API errors:**
- Check CoinCap API status
- Verify date ranges are valid
- Check network connectivity

---

## 📊 Build Status

- **Status**: ✅ Passing
- **Routes**: 17 pages
- **TypeScript**: ✅ No errors
- **Last Build**: Dec 2, 2025
- **Build Time**: ~2 minutes

---

## 🔗 Important URLs

### Local Development
- **App**: http://localhost:3000
- **DCA Calculator**: http://localhost:3000/tools/dca
- **Lessons**: http://localhost:3000/lessons
- **FAQ**: http://localhost:3000/faq
- **Glossary**: http://localhost:3000/glossary

### APIs (Local)
- **Prices**: http://localhost:3000/api/prices
- **DCA Calculate**: http://localhost:3000/api/dca/calculate

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | Version history |
| `PROJECT_STATUS.md` | Detailed status |
| `TODO.md` | Task list |
| `QUICK_REFERENCE.md` | This file |
| `CLAUDE.md` | Claude instructions |
| `README.md` | Project overview |

---

## 🎨 Design System

### Colors
```css
Black: #0A0A0A (background)
Gold: #FFD000 (accent)
White: #FFFFFF (text)
Gray: #1A1A1A (cards)
```

### Spacing
```css
Base unit: 8px
Padding: 16px, 24px, 32px
Margins: 16px, 24px, 32px, 48px
```

### Typography
```css
Font: Inter (sans-serif)
Sizes: 14px, 16px, 18px, 24px, 32px, 48px
```

---

## 🔐 Environment Variables

Currently no environment variables needed (using free APIs).

Future requirements:
```bash
# .env.local (when needed)
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
BTCPAY_SERVER_URL=
ANALYTICS_ID=
SENTRY_DSN=
```

---

## 📞 Quick Contacts

- **Project Lead**: Igor
- **Repository**: [Add URL]
- **Documentation**: Check `*.md` files
- **Issues**: GitHub Issues

---

## ⚡ Quick Tips

### Testing CSV Export
1. Open DCA Calculator
2. Set dates: 2020-01-01 to today
3. Amount: $100, Frequency: Weekly
4. Click "Calculate DCA"
5. Click "Export CSV"
6. Verify toast appears
7. Open CSV in Excel/Sheets

### Making Changes
1. Edit files in `soundsfair-app/`
2. Save and check browser (auto-reload)
3. Run `npm run build` to verify
4. Commit changes
5. Push to repository

### Deploying
1. Push to main branch
2. Vercel auto-deploys
3. Check deployment logs
4. Test on live URL

---

## 🎯 Current Focus

**This Week**:
- ✅ CSV Export (DONE)
- ⏳ Test in browser
- ⏳ Create git commit
- ⏳ Start Share Results

**Next Week**:
- Share Results feature
- Reusable Toast component
- Unit tests for CSV

**This Month**:
- User authentication
- Progress tracking
- Content: Levels 1-4

---

## 📈 Metrics Dashboard

### Code
- Total lines: ~8,500
- Components: 15+
- API routes: 2
- Pages: 17

### Performance
- Build time: ~2 min
- API response: <500ms
- Bundle size: TBD

### Content
- Lessons: 5/9
- Glossary: 50+ terms
- FAQ: 20+ entries

---

## 🚨 Critical Reminders

1. **Always test before commit**
2. **Update CHANGELOG.md** for all changes
3. **Run build** before pushing
4. **Check TypeScript** errors
5. **Test on mobile** devices
6. **Verify accessibility**
7. **Update documentation**

---

## 💡 Pro Tips

- Use `npm run dev` during development
- Test CSV with various date ranges
- Check browser console for errors
- Use React DevTools for debugging
- Keep files under 200 lines when possible
- Write descriptive commit messages
- Update docs as you code

---

**Need detailed info?** → See `PROJECT_STATUS.md`
**Need task list?** → See `TODO.md`
**Need history?** → See `CHANGELOG.md`

---

**Last Session Summary**:
Implemented CSV export feature for DCA Calculator with 3-section professional format, Bitcoin-only focus with real historical data, and toast notifications. Ready for testing and deployment.
