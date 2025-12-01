# 🪙 Soundsfair - Learn Bitcoin & Fair Money

<div align="center">

![Bitcoin](https://img.shields.io/badge/Bitcoin-Educational-FFD700?style=for-the-badge&logo=bitcoin&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)

**An educational platform about Bitcoin, economic freedom, and sound monetary principles.**

[Live Demo](https://soundsfair.netlify.app) · [Documentation](./docs/planning/ROADMAP.md) · [Report Bug](https://github.com/yourusername/soundsfair/issues)

</div>

---

## 📖 About

**Soundsfair** is a comprehensive educational platform designed to teach Bitcoin from beginner to advanced level, with a focus on:

- **Fair Money Principles** - Understanding sound monetary systems
- **Economic Freedom** - Bitcoin as a tool for financial sovereignty
- **Geopolitics** - How Bitcoin impacts global economics
- **Protection Strategies** - Safeguarding wealth in a fiat world

### Key Features

✨ **5 Comprehensive Lessons** - From store of value to financial freedom
🎮 **Gamification** - XP system, levels, streaks, and achievements
📊 **DCA Calculator** - Compare Bitcoin vs traditional assets
📖 **50+ Glossary Terms** - Searchable Bitcoin dictionary
❓ **20 FAQs** - Comprehensive answers to common questions
🔗 **Smart Auto-linking** - Contextual links between content
📈 **Progress Tracking** - Track your learning journey
🎓 **Certificates** - Downloadable completion certificates (coming soon)

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **Markdown:** Remark + Gray Matter
- **Charts:** Recharts
- **Deployment:** Netlify / Vercel

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

- **[Complete Roadmap](./docs/planning/ROADMAP.md)** - Full implementation plan (5 sprints)
- **[Sprint 1 Summary](./docs/sprints/SPRINT-1-SUMMARY.md)** - Completed features
- **[CLAUDE.md](./CLAUDE.md)** - Project guidelines for AI assistance

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

**Live Site:** [https://soundsfair.netlify.app](https://soundsfair.netlify.app)

---

<div align="center">

**Made with ❤️ for Bitcoin education**

⚡ Powered by Next.js · 🎨 Styled with Tailwind · 🚀 Deployed on Netlify

</div>
