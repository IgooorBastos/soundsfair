# 🪙 Soundsfair - Learn Bitcoin & Fair Money

<div align="center">

![Bitcoin](https://img.shields.io/badge/Bitcoin-Educational-FFD700?style=for-the-badge&logo=bitcoin&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)

**An educational platform about Bitcoin, economic freedom, and sound monetary principles.**

[Live Demo](https://soundsfair.vercel.app) · [Documentation](./soundsfair-app/docs/) · [Report Bug](https://github.com/yourusername/soundsfair/issues)

</div>

---

## 📖 About

**Soundsfair** is a comprehensive educational platform designed to teach Bitcoin from beginner to advanced level, with a focus on:

- **Fair Money Principles** - Understanding sound monetary systems
- **Economic Freedom** - Bitcoin as a tool for financial sovereignty
- **Geopolitics** - How Bitcoin impacts global economics
- **Protection Strategies** - Safeguarding wealth in a fiat world

### Key Features

#### 📚 Educational Content
✨ **9 Progressive Lessons** - Complete Bitcoin education from beginner to advanced
🎯 **Interactive Quizzes** - Knowledge validation for each lesson
📈 **Progress Tracking** - Database-backed learning journey

#### 🛠️ Interactive Tools
📊 **DCA Calculator** - Multi-asset comparison (BTC, S&P500, Gold, MSCI World)
💰 **Satoshi Converter** - BTC ↔ Sats ↔ USD conversion
😨 **Fear & Greed Index** - Real-time Bitcoin market sentiment
⏰ **Halving Countdown** - Next Bitcoin halving tracker
🔮 **What-If Calculator** - Historical investment simulator

#### ⚡ Lightning Network
💳 **Lightning Payments** - OpenNode integration (Testnet)
❓ **Paid Q&A Service** - Submit questions via Bitcoin payments
🔔 **Payment Webhooks** - Automated verification system

#### 📖 Reference Materials
📖 **50+ Glossary Terms** - Searchable Bitcoin dictionary
❓ **20 FAQs** - Comprehensive answers to common questions
🔗 **Smart Auto-linking** - Contextual links between content

---

## 🚀 Tech Stack

- **Framework:** Next.js 16.1.0 (App Router)
- **Bundler:** Turbopack (dev) + Webpack (production)
- **Language:** TypeScript 5
- **Runtime:** React 19.2
- **Styling:** Tailwind CSS 3.4.17 + Custom Design System
- **Database:** Supabase (PostgreSQL + Row Level Security)
- **Payments:** OpenNode API v1 (Lightning Network + On-chain)
- **Email:** Resend API with transactional templates
- **Charts:** Recharts 3.6.0
- **Deployment:** Vercel (Production)

---

## 📁 Project Structure

```
soundsfair-app/
├── app/
│   ├── components/          # React components
│   │   ├── ContinueLearning.tsx
│   │   ├── Header.tsx
│   │   ├── ReadingProgressBar.tsx
│   │   ├── UserProgress.tsx
│   │   └── ...
│   ├── lib/                 # Utilities & business logic
│   │   ├── autolink.ts      # Smart content linking
│   │   ├── markdown.ts      # Markdown processing
│   │   ├── progress.ts      # Progress tracking system
│   │   └── ...
│   ├── lessons/[slug]/      # Dynamic lesson pages
│   ├── glossary/            # Bitcoin glossary
│   ├── faq/                 # FAQ page
│   └── tools/dca/           # DCA calculator
├── content/
│   ├── lessons/             # Markdown lesson files
│   ├── glossary/            # Glossary definitions
│   └── faq/                 # FAQ content
├── docs/                    # Project documentation
│   ├── planning/
│   │   └── ROADMAP.md      # Complete roadmap
│   ├── sprints/
│   │   └── SPRINT-1-SUMMARY.md
│   └── architecture/
└── public/                  # Static assets
```

---

## 🎯 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/soundsfair.git
cd soundsfair/soundsfair-app

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📚 Documentation

### 📋 Quick Navigation

- **[CLAUDE.md](./CLAUDE.md)** - Project guidelines for AI assistance
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and updates
- **[TODO.md](./TODO.md)** - Current task list
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current implementation status
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick dev reference

### 📁 Documentation Structure

```
docs/
├── planning/                    # Strategic & implementation planning
│   ├── STRATEGIC_PLAN.md       # Original strategic vision
│   ├── PROJECT_BLUEPRINT.md    # Feature specifications
│   ├── EXECUTIVE_REVIEW.md     # Market analysis & competitors
│   └── SKILLS_MASTER_PLAN.md   # Technical skills roadmap
│
├── design/                      # Branding & design guidelines
│   ├── BRANDING_GUIDE_V2.md    # Current branding standards (v2)
│   ├── LOGO_CONCEPTS_DETAILED.md
│   └── LOGO_DECISION_GUIDE.md
│
├── implementation/              # Technical documentation
│   ├── IMPLEMENTATION_REPORT.md # Implementation progress
│   ├── COMPONENTS_DOCUMENTATION.md
│   └── PROJECT_MANAGEMENT_TEMPLATE.md
│
├── notion-import/               # Notion integration utilities
│   ├── NOTION_IMPORT_GUIDE.md
│   ├── import-to-notion.bat
│   └── import-to-notion.ps1
│
└── archive/                     # Historical documentation
    ├── planning-phase/          # Phase 1 planning docs
    └── implementation-snapshots/  # Implementation logs

content-source/                 # Original source materials
├── Bitcoin-Revolucao-Monetaria.pdf
└── requisitos-originais-pt.txt
```

---

## 🎮 Features Overview

### Sprint 1 ✅ (Completed)

#### 1. Auto-linking System
Automatically creates contextual links from lesson content to:
- Glossary terms (70+ terms)
- FAQ topics
- Related lessons
- Tools (DCA calculator)

#### 2. Progress Tracking
- **XP System:** Earn experience points for actions
- **10 Levels:** Progress from beginner to expert
- **Streaks:** Daily learning streaks with rewards
- **Reading Position:** Auto-save where you left off

#### 3. Visual Enhancements
- **Reading Progress Bar:** See how far through a lesson
- **User Progress Badge:** Level and XP display in header
- **Continue Learning:** Smart recommendation system
- **Card Improvements:** Gradients, hover effects, breathing room

### Sprint 2 🔜 (Next)

- Achievement System (15-20 badges)
- Quiz Inline Checkpoints
- Enhanced Streak System
- Profile Page with Stats

### Sprint 3-5 ⏸️ (Planned)

- Certificates (PDF generation)
- Social Sharing
- Interactive Elements
- Performance Optimization

[See full roadmap](./docs/planning/ROADMAP.md)

---

## 🎨 Design System

### Colors

- **Brand Gold:** `#FFD700` (Libertarian yellow)
- **Brand Orange:** `#F7931A` (Bitcoin orange)
- **Background:** `#0A0A0A` (Soft black)
- **Surface:** `#1A1A1A` (Charcoal)

### Typography

- **Sans:** Inter
- **Mono:** Geist Mono
- **Scale:** Fluid typography (clamp)

### Accessibility

- WCAG AAA contrast ratios
- Keyboard navigation
- Screen reader support
- Focus visible indicators

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
test: Adding tests
chore: Maintenance tasks
```

---

## 📊 Project Status

| Sprint | Status | Progress | Target Date |
|--------|--------|----------|-------------|
| Sprint 1 | ✅ Complete | 100% | Nov 27, 2025 |
| Sprint 2 | 🔜 Next | 0% | Dec 15, 2025 |
| Sprint 3 | ⏸️ Planned | 0% | Dec 30, 2025 |
| Sprint 4 | ⏸️ Planned | 0% | Jan 15, 2026 |
| Sprint 5 | ⏸️ Planned | 0% | Jan 30, 2026 |

**Overall:** 20% complete (1/5 sprints)

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Bitcoin Design Community for design guidelines
- All open-source contributors
- Bitcoin educators worldwide

---

## 📬 Contact

**Project Link:** [https://github.com/yourusername/soundsfair](https://github.com/yourusername/soundsfair)

**Live Site:** [https://soundsfair.vercel.app](https://soundsfair.vercel.app)

---

<div align="center">

**Made with ❤️ for Bitcoin education**

⚡ Powered by Next.js 16 · 🎨 Styled with Tailwind CSS · 🚀 Deployed on Vercel

</div>
