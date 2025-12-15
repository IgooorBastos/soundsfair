import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllLessons } from '@/lib/markdown';
import LessonsListClient from './LessonsListClient';

export const metadata = {
  title: 'All Lessons | Soundsfair',
  description: 'Complete Bitcoin education course - from fiat system failures to financial freedom',
};

export default async function LessonsPage() {
  const lessons = await getAllLessons();

  return (
    <div className="min-h-screen bg-surface-black">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Bitcoin Education Course
          </h1>
          <p className="text-xl text-text-secondary mb-6">
            Master Bitcoin from zero to advanced in {lessons.length} comprehensive lessons
          </p>
          <div className="flex items-center justify-center gap-4 text-text-tertiary">
            <span>📚 {lessons.length} Lessons</span>
            <span>•</span>
            <span>⏱️ ~6 hours total</span>
            <span>•</span>
            <span>🎯 90 quiz questions</span>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-brand-gold/10 border border-brand-gold/30 rounded-lg max-w-2xl mx-auto">
            <p className="text-text-secondary text-sm">
              <span className="font-semibold text-brand-gold">💡 Learn at Your Own Pace:</span>{' '}
              Complete our 9-level course on Bitcoin, economics, and financial freedom. All lessons are freely accessible - start anywhere, learn however you prefer!
            </p>
          </div>
        </div>

        {/* Lessons Grid - Client Component */}
        <LessonsListClient lessons={lessons} />

        {/* Additional Resources */}
        <div className="max-w-5xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
          <Link
            href="/glossary"
            className="p-6 rounded-lg border-2 border-border-default bg-surface-charcoal
              hover:border-brand-gold hover:shadow-glow transition-all"
          >
            <div className="text-4xl mb-3">📖</div>
            <h4 className="text-xl font-semibold text-text-primary mb-2">
              Glossary
            </h4>
            <p className="text-text-secondary">
              50+ essential Bitcoin terms defined
            </p>
          </Link>

          <Link
            href="/faq"
            className="p-6 rounded-lg border-2 border-border-default bg-surface-charcoal
              hover:border-brand-gold hover:shadow-glow transition-all"
          >
            <div className="text-4xl mb-3">❓</div>
            <h4 className="text-xl font-semibold text-text-primary mb-2">
              FAQs
            </h4>
            <p className="text-text-secondary">
              20 comprehensive answers to common questions
            </p>
          </Link>

          <Link
            href="/tools/dca"
            className="p-6 rounded-lg border-2 border-border-default bg-surface-charcoal
              hover:border-brand-gold hover:shadow-glow transition-all"
          >
            <div className="text-4xl mb-3">📊</div>
            <h4 className="text-xl font-semibold text-text-primary mb-2">
              DCA Calculator
            </h4>
            <p className="text-text-secondary">
              Compare Bitcoin vs traditional assets
            </p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
