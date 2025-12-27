# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**soundsfair** - An educational website about Bitcoin focused on fair money, economic freedom, and libertarian values. The site will be in English with a black and yellow (libertarian gold #FFD000) visual identity.

## Project Goals

- Educate beginners about Bitcoin from zero to advanced
- Provide interactive tools (DCA calculator with multi-asset comparison)
- Offer paid Q&A via Lightning Network payments
- Curate and review relevant YouTube Bitcoin content
- Present famous Bitcoin community quotes and writings

## Content Structure

The project includes a complete 9-lesson course structure covering:
1. The fiat money system and its failures
2. Banking system and debt creation
3. Bitcoin as a revolution against fiat
4. Bitcoin and geopolitics
5. Bitcoin as store of value and inflation protection
6. Bitcoin as economic freedom tool
7. Bitcoin's geopolitical future
8. Protection strategies against fiat collapse
9. Conclusion on financial freedom

## Tech Stack (Production)

- **Frontend**: Next.js 16.1.0 (App Router) + TypeScript 5 + React 19.2
- **Bundler**: Turbopack (dev - 10× faster) + Webpack (production - stable)
- **Styling**: Tailwind CSS 3.4.17 with custom design system
- **Payments**: OpenNode API v1 (Lightning Network + On-chain) - DEV/Testnet ready
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Email**: Resend API with transactional templates
- **Price Data**: CoinGecko API with CoinCap/Mock fallbacks
- **Charts**: Recharts 3.6.0 (React + D3)
- **Hosting**: Vercel (Production) - https://soundsfair.vercel.app/

## Design Philosophy

- **Colors**: Black background (#000000) with libertarian yellow accent (#FFD000)
- **Typography**: Inter + Roboto Slab or similar
- **Style**: Cyberpunk minimalist, high contrast, cinematic hero images
- **Tone**: Welcoming but firm, educational without being preachy, libertarian-friendly, fact-first

## Implemented Features

### Educational Content
1. **9 Progressive Lessons** ✅ - Complete Bitcoin education from beginner to advanced
2. **Interactive Quizzes** ✅ - Knowledge validation for each lesson
3. **User Progress Tracking** ✅ - Database-backed progress system

### Interactive Tools
4. **DCA Calculator** ✅ - Multi-asset comparison (BTC, S&P500, Gold, MSCI World) with CSV export
5. **Satoshi Converter** ✅ - BTC ↔ Sats ↔ USD conversion
6. **Fear & Greed Index** ✅ - Real-time Bitcoin market sentiment
7. **Halving Countdown** ✅ - Next Bitcoin halving tracker
8. **What-If Calculator** ✅ - Historical Bitcoin investment simulator

### Payment & Q&A System
9. **Lightning Network Payments** ✅ - OpenNode integration (DEV/Testnet)
10. **Paid Q&A Service** ✅ - Submit questions via Lightning payments
11. **Payment Webhooks** ✅ - Automated payment verification
12. **Admin Dashboard** ✅ - Question queue management

### Platform Features
13. **Email System** ✅ - Transactional emails via Resend
14. **Legal Pages** ✅ - Privacy Policy, Terms of Service
15. **Responsive Design** ✅ - Mobile-first, WCAG AA compliant

## Planned Features (Future)

1. **Video Reviews**: YouTube video curation with curator notes and filtering
2. **Famous Quotes Section**: Bitcoin community wisdom and key writings
3. **Multi-language Support**: Portuguese translation
4. **User Accounts**: OAuth login and profile management

## Important Notes

- The website must be in **English** despite source materials being in Portuguese
- Content focuses on Bitcoin as "fair money" and economic sovereignty
- Avoid emojis unless explicitly requested
- Mobile-first, accessible (WCAG AA), fast performance
- Never include libertarian yellow color in contexts that don't match the brand identity

## Reference Materials

Two key documents in the repository contain the full course content and project requirements:
- `Bitcoin - A Verdadeira Revolução Monetária – Economia, Geopolítica e Liberdade Econômica.pdf`
- `me ajude a criar um pront completo.txt`

These should be consulted for detailed content, educational structure, and feature requirements.
