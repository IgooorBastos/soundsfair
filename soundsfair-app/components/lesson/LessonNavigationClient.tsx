'use client';

import Link from 'next/link';

interface LessonNavigationProps {
  currentLevel: number;
}

const allLessons = [
  { level: 1, title: "The Fiat Money System", slug: "level-1-fiat-system" },
  { level: 2, title: "Banking and Debt Creation", slug: "level-2-banking-debt" },
  { level: 3, title: "Bitcoin Revolution", slug: "level-3-bitcoin-revolution" },
  { level: 4, title: "Bitcoin and Geopolitics", slug: "level-4-bitcoin-geopolitics-intro" },
  { level: 5, title: "Store of Value", slug: "level-5-store-of-value" },
  { level: 6, title: "Economic Freedom", slug: "level-6-economic-freedom" },
  { level: 7, title: "Geopolitical Future", slug: "level-7-geopolitical-future" },
  { level: 8, title: "Protection Strategies", slug: "level-8-protection-strategies" },
  { level: 9, title: "Financial Freedom", slug: "level-9-financial-freedom" },
];

export default function LessonNavigationClient({ currentLevel }: LessonNavigationProps) {
  // All lessons are now freely accessible - no lock checking needed

  const currentIndex = allLessons.findIndex(l => l.level === currentLevel);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="mt-16 pt-8 border-t border-border-default">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        {/* Previous Lesson */}
        {previousLesson ? (
          <Link
            href={`/lessons/${previousLesson.slug}`}
            className="group flex items-center gap-3 px-6 py-4 rounded-lg border-2 border-border-default
              hover:border-brand-gold transition-all w-full sm:w-auto"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            <div className="text-left">
              <div className="text-sm text-text-tertiary">Previous</div>
              <div className="font-semibold text-text-primary group-hover:text-brand-gold">
                Level {previousLesson.level}: {previousLesson.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="w-full sm:w-auto"></div>
        )}

        {/* Course Overview */}
        <Link
          href="/lessons"
          className="px-6 py-4 rounded-lg border-2 border-brand-gold text-brand-gold font-semibold
            hover:bg-brand-gold hover:text-surface-black transition-all"
        >
          All Lessons
        </Link>

        {/* Next Lesson */}
        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className="group flex items-center gap-3 px-6 py-4 rounded-lg
              bg-brand-gold text-surface-black font-semibold
              hover:bg-brand-gold-hover hover:shadow-glow transition-all w-full sm:w-auto"
          >
            <div className="text-right">
              <div className="text-sm opacity-80">Next</div>
              <div className="font-semibold">
                Level {nextLesson.level}: {nextLesson.title}
              </div>
            </div>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        ) : (
          <Link
            href="/lessons"
            className="group flex items-center gap-3 px-6 py-4 rounded-lg
              bg-semantic-success text-white font-semibold
              hover:shadow-glow transition-all w-full sm:w-auto"
          >
            <div className="text-right">
              <div className="text-sm opacity-90">🎓 Course Complete!</div>
              <div className="font-semibold">View All Lessons</div>
            </div>
          </Link>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-text-tertiary mb-2">
          <span>Course Progress</span>
          <span>{currentLevel}/{allLessons.length} lessons</span>
        </div>
        <div className="w-full bg-surface-dark rounded-full h-3">
          <div
            className="bg-brand-gold h-3 rounded-full transition-all duration-500"
            style={{ width: `${(currentLevel / allLessons.length) * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
}
