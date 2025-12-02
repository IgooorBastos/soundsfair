'use client';

import { useState, useEffect } from 'react';
import { getUserProgress } from '@/app/lib/progress';
import Link from 'next/link';

export default function ContinueLearning() {
  const [progress, setProgress] = useState<ReturnType<typeof getUserProgress> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getUserProgress());
  }, []);

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted || !progress) {
    return null;
  }

  // Don't show if no progress yet
  if (!progress.lastLesson && progress.lessonsCompleted.length === 0) {
    return null;
  }

  // Determine the next lesson to recommend
  const getNextLesson = () => {
    // If there's a lesson in progress, continue it
    if (progress.lastLesson && progress.lastLesson.scrollPercentage < 95) {
      return {
        slug: progress.lastLesson.slug,
        level: progress.lastLesson.level,
        status: 'continue' as const,
        scrollPercentage: progress.lastLesson.scrollPercentage,
      };
    }

    // Otherwise, recommend the next lesson
    const completedLevels = progress.lessonsCompleted;
    const nextLevel = Math.max(5, ...completedLevels) + 1;

    if (nextLevel <= 9) {
      return {
        slug: `level-${nextLevel}`,
        level: nextLevel,
        status: 'next' as const,
        scrollPercentage: 0,
      };
    }

    // All lessons completed
    return null;
  };

  const nextLesson = getNextLesson();

  if (!nextLesson) {
    // Show completion message
    return (
      <div className="bg-gradient-to-br from-brand-gold/10 to-brand-orange/10
                      border-2 border-brand-gold rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🎓</div>
        <h3 className="text-3xl font-bold text-text-primary mb-3">
          Congratulations!
        </h3>
        <p className="text-xl text-text-secondary mb-6">
          You've completed all Bitcoin lessons. You're now a certified Bitcoin expert!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/profile"
            className="px-8 py-3 bg-brand-gold text-black font-semibold rounded-lg
                       hover:bg-brand-gold-hover transition-colors"
          >
            View Certificate
          </Link>
          <Link
            href="/glossary"
            className="px-8 py-3 border-2 border-brand-gold text-brand-gold font-semibold rounded-lg
                       hover:bg-brand-gold/10 transition-colors"
          >
            Explore Glossary
          </Link>
        </div>
      </div>
    );
  }

  // Lesson titles
  const lessonTitles: Record<number, string> = {
    5: 'Bitcoin as Store of Value',
    6: 'Bitcoin as Economic Freedom Tool',
    7: 'Bitcoin Geopolitical Future',
    8: 'Protection Strategies',
    9: 'Financial Freedom Conclusion',
  };

  return (
    <div className="group relative bg-gradient-to-br from-surface-charcoal to-surface-dark
                    border-2 border-border-default hover:border-brand-gold
                    rounded-lg overflow-hidden transition-all duration-300
                    hover:shadow-glow">
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-brand-orange/5
                      opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10
                            rounded-full text-sm font-semibold text-brand-gold mb-3">
              {nextLesson.status === 'continue' ? (
                <>
                  <span className="animate-pulse">●</span>
                  Continue Learning
                </>
              ) : (
                <>
                  <span>→</span>
                  Next Lesson
                </>
              )}
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              Level {nextLesson.level}: {lessonTitles[nextLesson.level]}
            </h3>
            <p className="text-text-tertiary">
              {nextLesson.status === 'continue'
                ? `You're ${nextLesson.scrollPercentage}% through this lesson`
                : 'Start your next lesson in the Bitcoin fundamentals series'}
            </p>
          </div>

          {/* Level Badge */}
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br
                          from-brand-gold to-brand-orange flex items-center justify-center
                          font-bold text-2xl text-black shadow-glow
                          group-hover:scale-110 transition-transform">
            {nextLesson.level}
          </div>
        </div>

        {/* Progress Bar (if continuing) */}
        {nextLesson.status === 'continue' && nextLesson.scrollPercentage > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-text-tertiary mb-2">
              <span>Reading Progress</span>
              <span className="text-brand-gold font-semibold">
                {nextLesson.scrollPercentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-surface-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-gold to-brand-orange
                           transition-all duration-500"
                style={{ width: `${nextLesson.scrollPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Course Progress Overview */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-text-tertiary mb-3">
            <span>Overall Course Progress</span>
            <span className="text-text-primary font-semibold">
              {progress.lessonsCompleted.length}/5 lessons completed
            </span>
          </div>

          {/* Mini Progress Steps */}
          <div className="flex gap-2">
            {[5, 6, 7, 8, 9].map((level) => {
              const isCompleted = progress.lessonsCompleted.includes(level);
              const isCurrent = level === nextLesson.level;

              return (
                <div
                  key={level}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    isCompleted
                      ? 'bg-semantic-success'
                      : isCurrent
                      ? 'bg-brand-gold animate-glow-pulse'
                      : 'bg-surface-dark'
                  }`}
                  title={`Level ${level}${isCompleted ? ' - Completed' : isCurrent ? ' - Current' : ''}`}
                />
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className="flex-1 px-6 py-3 bg-brand-gold text-black font-semibold rounded-lg
                       hover:bg-brand-gold-hover transition-all text-center
                       group-hover:scale-105 shadow-gold"
          >
            {nextLesson.status === 'continue' ? 'Continue Reading' : 'Start Lesson'}
          </Link>

          <Link
            href="/lessons"
            className="px-6 py-3 border-2 border-brand-gold text-brand-gold font-semibold rounded-lg
                       hover:bg-brand-gold/10 transition-colors"
          >
            All Lessons
          </Link>
        </div>

        {/* Streak Motivation (if exists) */}
        {progress.currentStreak > 0 && (
          <div className="mt-4 pt-4 border-t border-border-default">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-lg">🔥</span>
              <span className="text-text-tertiary">
                Keep your <span className="text-brand-orange font-semibold">{progress.currentStreak}-day streak</span> going!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
