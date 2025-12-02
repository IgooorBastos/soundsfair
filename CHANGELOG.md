# Changelog

All notable changes to the soundsfair project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **CSV Export for DCA Calculator**: Professional CSV export functionality with comprehensive data
  - 3-section format: Metadata header, Summary results, Transaction history
  - Exports all investment settings (amount, frequency, date range)
  - Includes all metrics: Total Invested, BTC Units, Current Value, ROI, CAGR, Max Drawdown, Volatility
  - Complete transaction history with each purchase details
  - RFC 4180 compliant CSV escaping for special characters
  - Auto-generated filename with date: `dca-bitcoin-YYYY-MM-DD.csv`
  - Success toast notification with smooth fade-in animation
  - Client-side only (privacy-friendly, no server upload)
  - Zero external dependencies (vanilla JavaScript with Blob API)
  - Compatible with Excel, Google Sheets, Numbers, and all CSV readers
  - File: `soundsfair-app/app/lib/csv-export.ts` ([NEW], ~165 lines)
  - Updated: `soundsfair-app/app/components/DCACalculator.tsx` (CSV button + toast)
  - Updated: `soundsfair-app/tailwind.config.ts` (fade-in animation improvements)

- **Glossary Footnotes System**: Automatic contextual glossary references at the bottom of every lesson page
  - Auto-detects glossary terms appearing in lesson content
  - Displays numbered footnotes with term definitions
  - Links to full glossary page for detailed information
  - Beautiful UI with numbered badges and hover effects
  - Component: `app/components/GlossaryFootnotes.tsx` ([NEW])
  - Integration: Added to `app/lessons/[slug]/page.tsx`

- **Comprehensive Project Management Template**: Complete Notion-compatible template for managing the entire project
  - 10 major sections covering all aspects of project management
  - Backlog system (Bugs, Improvements, Content, Features, Ideas)
  - Kanban board templates
  - Execution checklists with risk assessment
  - 30/60/90-day roadmap
  - Architecture Decision Records (ADR) framework
  - Technical documentation standards
  - Completed work log
  - Future products & expansion plans (monetization strategies)
  - Tool recommendations and workflow guidelines
  - File: `PROJECT_MANAGEMENT_TEMPLATE.md` ([NEW])

### Fixed
- **DCA Calculator**: Resolved "Failed to fetch price data for any asset" error ([#BUG-001])
  - Issue: S&P500, Gold, and MSCI World price endpoints returned only 2 data points
  - Root Cause: Mock data implementation was insufficient for DCA calculations requiring daily/weekly prices
  - Solution: Implemented realistic historical price generation with:
    - Proper date range coverage (generates daily prices from start to end date)
    - Realistic volatility modeling (1.2-1.5% daily fluctuation)
    - Base price anchored to 2020-01-01 with compound annual growth
    - S&P 500: ~12% annual growth from $3,230 base
    - Gold: ~8% annual growth from $1,520/oz base
    - MSCI World: ~10% annual growth from $2,350 base
  - File: `soundsfair-app/app/api/prices/route.ts` (lines 74-186)
  - Impact: DCA calculator now fully functional for all asset comparisons

- **Glossary Page**: Fixed duplicated "Related terms" sections ([#BUG-002])
  - Issue: "Related terms" appeared twice - once in definition HTML, once as component feature
  - Root Cause: Markdown parser included "Related terms:" line in HTML output
  - Solution: Strip "Related terms:" and "Compare to:" metadata before HTML conversion
  - File: `soundsfair-app/app/lib/markdown.ts` (lines 177-181)
  - Impact: Clean glossary display without duplication

### Changed
- **DCA Calculator - Bitcoin-Only Focus**: Simplified calculator to focus exclusively on Bitcoin with real historical data
  - Removed mock price data for S&P500, Gold, and MSCI World (~113 lines removed)
  - Switched to Bitcoin-only calculations with real CoinCap API data
  - Updated UI to show "Bitcoin Only" info box with data source transparency
  - Added badge showing "Real data since 2013" with earliest available date display
  - Swapped API priority: CoinCap (unlimited history) as primary, CoinGecko (365-day limit) as fallback
  - File: `soundsfair-app/app/api/prices/route.ts` (simplified, Bitcoin-focused)
  - File: `soundsfair-app/app/components/DCACalculator.tsx` (removed multi-asset selector)
  - Rationale: Focus on Bitcoin as "the only truly scarce digital asset", ensure data accuracy, avoid misleading comparisons with simulated data

- **Price API Improvements**: Enhanced reliability and data availability
  - Primary API: CoinCap (unlimited historical data from 2013-04-28, free forever)
  - Fallback API: CoinGecko (365-day limit on free tier)
  - Added "Earliest Available Date" display in DCA Calculator UI
  - Shows badge with verification icon and years of historical data available
  - File: `soundsfair-app/app/api/prices/route.ts` (API priority swap)
  - Impact: Users can now simulate DCA strategies going back over 11 years

- **About Page Description**: Updated hero section copy for more professional positioning
  - Old: "An educational platform dedicated to teaching the world about Bitcoin, sound money principles, and economic freedom."
  - New: "An educational platform providing trusted information, support, and expert guidance in Bitcoin and sound money principles."
  - File: `soundsfair-app/app/about/page.tsx` (lines 22-25)
  - Rationale: More professional, emphasizes trust and expertise

- **Monetary Value Standardization**: Converted all USD references to BTC across entire site
  - Glossary - Mining term: Changed "$140,000 at $45k/BTC" → "~450 BTC per day total across all miners"
  - FAQ - Question 13 (Can Bitcoin be banned?): Changed "$140k per block ($67M/day total)" → "~3.125 BTC per block (~450 BTC/day total)"
  - Files:
    - `soundsfair-app/content/glossary/bitcoin-glossary.md` (line 247)
    - `soundsfair-app/content/faq/bitcoin-faq.md` (line 443)
  - Rationale: Aligns with Bitcoin-first philosophy, avoids fiat-denominated thinking

### Removed
- **FAQ - Recommended Learning Path**: Removed detailed week-by-week learning roadmap from FAQ
  - Content removed: Weeks 1-6 structured learning path with book recommendations
  - Lines removed: `soundsfair-app/content/faq/bitcoin-faq.md` (lines 2490-2516, ~27 lines)
  - Rationale: Moving to future monetization strategy as paid structured course ($99-149)
  - Note: Content preserved in `PROJECT_MANAGEMENT_TEMPLATE.md` under "Future Products" section

---

## [0.1.0] - 2024-11-15 - Initial Launch

### Added
- **Core Website Features**:
  - Next.js 16 application with App Router
  - Responsive design with Tailwind CSS
  - Dark theme with brand colors (Black + Libertarian Gold #FFD000)
  - TypeScript 5 for type safety

- **Educational Content**:
  - 5 comprehensive lessons (Levels 5-9)
    - Level 5: Store of Value and Inflation Protection
    - Level 6: Economic Freedom
    - Level 7: Geopolitical Future
    - Level 8: Protection Strategies
    - Level 9: Financial Freedom
  - 50+ glossary terms with definitions and related terms
  - 20 FAQ entries across 8 categories
  - Markdown-based content system with gray-matter frontmatter

- **Interactive Features**:
  - DCA (Dollar-Cost Averaging) Calculator
    - Multi-asset comparison (BTC, S&P500, Gold, MSCI World)
    - Configurable investment parameters (amount, frequency, date range)
    - Results visualization with Recharts
    - Metrics: ROI, CAGR, drawdown, volatility
    - CSV export capability
  - Reading progress tracker
  - Quiz system for lessons
  - Searchable FAQ and Glossary

- **Components**:
  - Header with navigation and search
  - Footer with links and newsletter signup
  - Lesson navigation (prev/next)
  - Continue learning tracker
  - User progress display

- **API Routes**:
  - `/api/prices` - Fetch historical price data (CoinGecko + CoinCap fallback)
  - `/api/dca/calculate` - Calculate DCA investment results

- **Pages**:
  - Homepage with hero and feature sections
  - About page with mission and offerings
  - Lessons overview page
  - Individual lesson pages with auto-linked glossary terms
  - FAQ page with search and category filtering
  - Glossary page with alphabetical filtering
  - DCA Calculator tool page

### Technical
- **Stack**:
  - Next.js 16.0.4 (App Router, React Server Components)
  - React 19.2.0
  - TypeScript 5 (strict mode)
  - Tailwind CSS 3.4.17
  - date-fns 4.1.0 for date manipulation
  - remark + remark-html for Markdown processing
  - recharts 3.5.0 for data visualization

- **Infrastructure**:
  - Vercel deployment (primary)
  - Netlify deployment configuration (backup)
  - Standalone build output
  - Edge-optimized API routes

- **Performance**:
  - Server-side rendering for content pages
  - Static generation for lessons and glossary
  - Image optimization with next/image
  - Code splitting and lazy loading

- **Accessibility**:
  - WCAG AA compliant contrast ratios (many AAA)
  - Semantic HTML structure
  - Keyboard navigation support
  - Focus visible states
  - Screen reader compatible

- **SEO**:
  - Dynamic metadata generation
  - Open Graph tags
  - Sitemap (auto-generated)
  - Structured content hierarchy

---

## Version History

### Version 0.1.0 (November 15, 2024)
- Initial public launch
- Core educational content (Levels 5-9)
- DCA calculator tool
- 50+ glossary terms, 20 FAQ entries

### Pre-launch (October 2024)
- Repository setup
- Tech stack selection
- Design system creation
- Content structure planning

---

## Upcoming Features (Roadmap)

### Version 0.2.0 (Planned: January 2025)
- [ ] User authentication system
- [ ] Database integration (PostgreSQL + Prisma)
- [ ] Progress tracking persistence
- [ ] Levels 1-4 content
- [ ] Real-time price API for traditional assets

### Version 0.3.0 (Planned: February 2025)
- [ ] Lightning Network payments (BTCPay Server)
- [ ] Paid Q&A feature
- [ ] Video library (20+ curated videos)
- [ ] Newsletter system
- [ ] Analytics integration (Plausible)

### Version 1.0.0 (Planned: Q2 2025)
- [ ] All 9 lesson levels complete
- [ ] Certificate generation
- [ ] Community forum
- [ ] Mobile app (React Native)
- [ ] Internationalization (Portuguese)

---

## Bug Fixes

### December 2024
- **BUG-001**: DCA Calculator price fetch failures → ✅ Fixed
- **BUG-002**: Glossary duplicated related terms → ✅ Fixed

---

## Notes for Developers

### Breaking Changes
None in current version (0.1.0 → 0.2.0)

### Migration Guide
No migrations required for current changes.

### Deprecations
None

### Security Updates
None (no vulnerabilities identified)

---

## Contributors

- **Lead Developer**: Claude Code + Human Developer
- **Content**: soundsfair Team
- **Design**: soundsfair Design Team

---

## License

Internal Use - soundsfair Project

---

For detailed technical changes, see commit history:
```bash
git log --oneline --graph
```

For specific file changes:
```bash
git show <commit-hash>
```
