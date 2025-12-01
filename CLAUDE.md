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

## Planned Tech Stack (from requirements)

- **Frontend**: Next.js 14 (app router) + TypeScript + Tailwind CSS
- **Payments**: BTCPay Server (self-hosted) or OpenNode/Strike for Lightning
- **Price Data**: CoinGecko API with CoinCap as fallback
- **Charts**: Recharts or Chart.js
- **Hosting**: Vercel (frontend) + backend hosting TBD

## Design Philosophy

- **Colors**: Black background (#000000) with libertarian yellow accent (#FFD000)
- **Typography**: Inter + Roboto Slab or similar
- **Style**: Cyberpunk minimalist, high contrast, cinematic hero images
- **Tone**: Welcoming but firm, educational without being preachy, libertarian-friendly, fact-first

## Key Features to Implement

1. **DCA Calculator**: Multi-asset comparison (BTC, S&P500, Gold, MSCI World) with CSV export and shareable URLs
2. **Lightning Payments**: Integration for paid Q&A service
3. **Video Reviews**: YouTube video curation with curator notes and filtering
4. **Progressive Learning Path**: Gamified 8-level education system
5. **Famous Quotes Section**: Bitcoin community wisdom and key writings

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
