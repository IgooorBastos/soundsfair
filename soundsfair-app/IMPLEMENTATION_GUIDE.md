# Visual Redesign Implementation Guide

## Quick Reference for Applying "Cyber Gold" Design to Remaining Pages

This guide shows how to apply the new visual design system to tool pages, lesson pages, and other sections of the site.

---

## 🎯 Page Templates

### 1. Tool Page Template

Apply to: `/tools/dca`, `/tools/fear-greed-index`, `/tools/satoshi-converter`, etc.

```tsx
import { CyberGrid, ScanLines, GlowOrb } from '@/components/effects';
import GlowButton from '@/components/ui/GlowButton';

export default function ToolPage() {
  return (
    <div className="min-h-screen bg-surface-black relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid intensity="low" animated={true} />
      <ScanLines opacity={0.03} />

      <Header />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 relative">
          <GlowOrb position={{ x: '90%', y: '20%' }} size="lg" color="gold" opacity={0.15} />

          {/* Breadcrumb */}
          <div className="mb-6">
            <span className="text-text-tertiary text-sm">
              <Link href="/tools" className="hover:text-brand-gold transition-colors">Tools</Link>
              {' > '}
              <span className="text-brand-gold">DCA Calculator</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-h1 font-display text-text-primary mb-4">
            DCA <span className="text-brand-gold text-shadow-glow">Calculator</span>
          </h1>

          {/* Description */}
          <p className="text-body-lg text-text-secondary max-w-3xl mb-8">
            Compare Dollar-Cost Averaging strategies across Bitcoin, S&P500, Gold, and MSCI World.
          </p>

          {/* Feature Tags */}
          <div className="flex flex-wrap gap-3 mb-12">
            <span className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm">
              ⚡ Multi-Asset Comparison
            </span>
            <span className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm">
              📊 Historical Data
            </span>
            <span className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm">
              💾 CSV Export
            </span>
          </div>
        </section>

        {/* Tool Content */}
        <section className="container mx-auto px-6 py-12">
          {/* Your calculator/tool UI here */}
        </section>

        {/* Related Tools */}
        <section className="container mx-auto px-6 py-20 relative">
          <GlowOrb position={{ x: '10%', y: '50%' }} size="md" color="orange" opacity={0.1} />

          <h2 className="text-h2 font-display text-text-primary mb-8 text-center">
            Related <span className="text-brand-gold text-shadow-glow">Tools</span>
          </h2>

          {/* Grid of related tool cards */}
        </section>
      </main>

      <Footer />
    </div>
  );
}
```

---

### 2. Lesson Page Template

Apply to: `/lessons/[slug]`

```tsx
import { CyberGrid, ScanLines, GlowOrb } from '@/components/effects';
import XPBar from '@/components/ui/XPBar';
import GlowButton from '@/components/ui/GlowButton';

export default function LessonPage({ lesson }) {
  return (
    <div className="min-h-screen bg-surface-black relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid intensity="low" animated={true} />
      <ScanLines opacity={0.02} />

      <Header />

      <main className="relative z-10">
        {/* Lesson Hero */}
        <section className="container mx-auto px-6 py-20 relative">
          <GlowOrb position={{ x: '15%', y: '30%' }} size="md" color="orange" opacity={0.15} />

          {/* Breadcrumb */}
          <div className="mb-6">
            <span className="text-text-tertiary text-sm">
              <Link href="/lessons" className="hover:text-brand-gold transition-colors">Lessons</Link>
              {' > '}
              <span className="text-brand-gold">Level {lesson.level}</span>
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm">
              Level {lesson.level}
            </span>
            <span className="px-4 py-2 bg-surface-charcoal border border-border-default rounded-full text-text-tertiary font-mono text-sm">
              {lesson.difficulty}
            </span>
            <span className="px-4 py-2 bg-surface-charcoal border border-border-default rounded-full text-text-tertiary font-mono text-sm">
              {lesson.duration} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-h1 font-display text-text-primary mb-6 leading-tight">
            {lesson.title}
          </h1>

          {/* Description */}
          {lesson.description && (
            <p className="text-body-lg text-text-secondary max-w-3xl mb-8">
              {lesson.description}
            </p>
          )}

          {/* Progress Bar (if authenticated and in progress) */}
          {userProgress && (
            <div className="max-w-2xl">
              <XPBar
                currentXP={userProgress.xp}
                requiredXP={userProgress.nextLevelXP}
                level={userProgress.level}
                size="md"
                animated={true}
              />
            </div>
          )}
        </section>

        {/* Lesson Content */}
        <article className="container mx-auto px-6 py-12 max-w-4xl">
          <div className="prose prose-invert prose-lg
                          prose-headings:font-display
                          prose-headings:text-brand-gold
                          prose-a:text-brand-gold
                          prose-a:no-underline
                          prose-a:hover:text-shadow-glow
                          prose-strong:text-brand-gold
                          prose-code:text-semantic-lightning
                          prose-code:bg-surface-dark
                          prose-code:px-2
                          prose-code:py-1
                          prose-code:rounded">
            {/* Markdown content */}
          </div>
        </article>

        {/* Quiz Section (if applicable) */}
        {lesson.quiz && (
          <section className="container mx-auto px-6 py-20 relative">
            <div className="max-w-3xl mx-auto">
              <div className="bg-surface-charcoal border-2 border-brand-gold/30 rounded-card p-8">
                <h2 className="text-h2 font-display text-brand-gold mb-6 text-shadow-glow">
                  Test Your Knowledge
                </h2>
                {/* Quiz component */}
              </div>
            </div>
          </section>
        )}

        {/* Navigation */}
        <section className="container mx-auto px-6 py-12">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            {lesson.previousSlug ? (
              <GlowButton href={`/lessons/${lesson.previousSlug}`} variant="outline">
                ← Previous Lesson
              </GlowButton>
            ) : <div />}

            {lesson.nextSlug ? (
              <GlowButton href={`/lessons/${lesson.nextSlug}`} variant="primary">
                Next Lesson →
              </GlowButton>
            ) : <div />}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
```

---

### 3. Profile/Dashboard Page Template

Apply to: `/profile`

```tsx
import { CyberGrid, ScanLines, GlowOrb } from '@/components/effects';
import XPBar from '@/components/ui/XPBar';
import FeatureCard from '@/components/ui/FeatureCard';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-surface-black relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid intensity="medium" animated={true} />
      <ScanLines opacity={0.03} />

      <Header />

      <main className="relative z-10">
        {/* Profile Hero */}
        <section className="container mx-auto px-6 py-20 relative">
          <GlowOrb position={{ x: '50%', y: '30%' }} size="xl" color="gold" opacity={0.2} />

          <div className="text-center mb-12">
            {/* Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-gold to-brand-orange flex items-center justify-center font-display font-bold text-5xl text-surface-black shadow-glow-lg">
              {userInitial}
            </div>

            {/* Name */}
            <h1 className="text-h1 font-display text-text-primary mb-2">
              {user.displayName || user.email?.split('@')[0]}
            </h1>

            {/* Email */}
            <p className="text-body text-text-tertiary">{user.email}</p>
          </div>

          {/* XP Progress */}
          <div className="max-w-2xl mx-auto">
            <XPBar
              currentXP={xpProgress.progressPercentage}
              requiredXP={100}
              level={xpProgress.currentLevel}
              size="lg"
              animated={true}
            />
          </div>
        </section>

        {/* Stats Grid */}
        <section className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Stat Card 1 */}
            <div className="bg-surface-charcoal border-2 border-border-default rounded-card p-8 text-center hover:border-brand-gold transition-all duration-300 hover:shadow-glow">
              <div className="text-5xl font-display text-brand-gold mb-2">{stats.lessonsCompleted}</div>
              <div className="text-body text-text-tertiary uppercase tracking-wider">Lessons Completed</div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-surface-charcoal border-2 border-border-default rounded-card p-8 text-center hover:border-brand-gold transition-all duration-300 hover:shadow-glow">
              <div className="text-5xl font-display text-brand-gold mb-2">{stats.totalXP}</div>
              <div className="text-body text-text-tertiary uppercase tracking-wider">Total XP</div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-surface-charcoal border-2 border-border-default rounded-card p-8 text-center hover:border-brand-gold transition-all duration-300 hover:shadow-glow">
              <div className="text-5xl font-display text-brand-gold mb-2">{stats.streak} 🔥</div>
              <div className="text-body text-text-tertiary uppercase tracking-wider">Day Streak</div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '90%', y: '50%' }} size="lg" color="orange" opacity={0.1} />

          <h2 className="text-h2 font-display text-text-primary mb-8 text-center">
            Recent <span className="text-brand-gold text-shadow-glow">Activity</span>
          </h2>

          {/* Activity timeline/list */}
        </section>
      </main>

      <Footer />
    </div>
  );
}
```

---

## 🎨 Common Patterns

### Section with Title and Glow Orb

```tsx
<section className="container mx-auto px-6 py-20 relative">
  <GlowOrb position={{ x: '10%', y: '50%' }} size="lg" color="gold" opacity={0.15} />

  <h2 className="text-h2 font-display text-text-primary mb-8 text-center">
    Your <span className="text-brand-gold text-shadow-glow">Title</span>
  </h2>

  {/* Content */}
</section>
```

### Feature Tag/Badge

```tsx
<span className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm uppercase tracking-wider">
  ⚡ Feature Name
</span>
```

### Stat Card

```tsx
<div className="bg-surface-charcoal border-2 border-border-default rounded-card p-8 text-center hover:border-brand-gold transition-all duration-300 hover:shadow-glow">
  <div className="text-5xl font-display text-brand-gold mb-2">{value}</div>
  <div className="text-body text-text-tertiary uppercase tracking-wider">Label</div>
</div>
```

### Content Card

```tsx
<div className="bg-surface-charcoal border-2 border-border-default rounded-card p-6 hover:border-brand-gold hover:shadow-glow transition-all duration-300">
  {/* Content */}
</div>
```

### Highlighted Text

```tsx
<span className="text-brand-gold text-shadow-glow">Bitcoin</span>
```

---

## 🚀 Priority Implementation Order

1. **Homepage** ✅ - Already complete
2. **Header** ✅ - Already complete
3. **Profile Page** - High visibility, uses new components
4. **Tools Hub** (`/tools`) - Landing page for all tools
5. **Individual Tool Pages** - DCA, What-If, etc.
6. **Lesson Pages** - Content delivery pages
7. **About Page** - Marketing/info page
8. **FAQ/Glossary** - Resource pages

---

## 📝 Checklist Per Page

When applying redesign to a page:

- [ ] Import background effects (CyberGrid, ScanLines)
- [ ] Add 1-2 GlowOrb accents
- [ ] Replace button elements with GlowButton
- [ ] Replace card elements with FeatureCard (if applicable)
- [ ] Update heading classes to font-display
- [ ] Add gold highlights to key terms with text-shadow-glow
- [ ] Update color classes (bg-black → bg-surface-black)
- [ ] Add feature tags/badges where appropriate
- [ ] Ensure proper relative z-index layering
- [ ] Test mobile responsiveness
- [ ] Verify accessibility (color contrast)

---

## 🎯 Tips

1. **Don't Overdo It** - 1-2 GlowOrbs per page is enough
2. **Layer Properly** - Background effects (z-0), Content (z-10)
3. **Use Sparingly** - text-shadow-glow only on hero/main titles
4. **Consistent Spacing** - Use py-20 for section padding
5. **Mobile First** - Test on small screens, reduce effects if needed
6. **Performance** - CyberGrid/ParticleField are GPU-intensive, use intensity="low" on content pages

---

## 🔗 Quick Links

- **Main Redesign Doc:** `VISUAL_REDESIGN.md`
- **Component Docs:** See component files for full prop interfaces
- **Design System:** `tailwind.config.ts`
- **Example Page:** `app/page.tsx` (new homepage)

---

Happy redesigning! 🎨⚡
