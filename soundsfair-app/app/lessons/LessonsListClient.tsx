'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Lesson } from '@/lib/markdown';

interface LessonsListClientProps {
  lessons: Lesson[];
}

export default function LessonsListClient({ lessons }: LessonsListClientProps) {
  const [lessonProgress, setLessonProgress] = useState<Record<string, { completed: boolean; percentage: number }>>({});

  useEffect(() => {
    // Load progress from localStorage
    const progress: Record<string, { completed: boolean; percentage: number }> = {};

    lessons.forEach(lesson => {
      const quizData = localStorage.getItem(`lesson-${lesson.metadata.slug}-quiz`);
      if (quizData) {
        const parsed = JSON.parse(quizData);
        progress[lesson.metadata.slug] = {
          completed: parsed.percentage >= 70,
          percentage: parsed.percentage,
        };
      }
    });

    setLessonProgress(progress);
  }, [lessons]);

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
      {lessons.map((lesson, index) => {
        const isCompleted = lessonProgress[lesson.metadata.slug]?.completed || false;
        const percentage = lessonProgress[lesson.metadata.slug]?.percentage || 0;

        // All lessons are now freely accessible - no locks
        const isLocked = false;

        return (
          <Link
            key={lesson.metadata.slug}
            href={`/lessons/${lesson.metadata.slug}`}
            className="group relative p-6 rounded-lg border-2 transition-all border-border-default bg-surface-charcoal hover:border-brand-gold hover:shadow-glow"
          >
            {/* Level Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-sm font-semibold">
                  Level {lesson.metadata.level}
                </div>
                {isCompleted && (
                  <div className="text-semantic-success text-2xl" title={`Passed with ${percentage}%`}>
                    ✓
                  </div>
                )}
              </div>
              <div className="text-text-tertiary text-sm">
                {lesson.metadata.duration}
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-brand-gold transition-colors">
              {lesson.metadata.title}
            </h3>

            <div className="text-text-tertiary text-sm mb-4">
              {lesson.metadata.difficulty} • {lesson.metadata.prerequisites}
            </div>

            {/* Excerpt */}
            <p className="text-text-secondary line-clamp-2 mb-4">
              {lesson.content.split('\n\n')[2]?.substring(0, 150)}...
            </p>

            {/* Progress Bar (if started but not completed) */}
            {!isLocked && !isCompleted && percentage > 0 && (
              <div className="mt-4">
                <div className="text-xs text-text-tertiary mb-1">
                  Quiz: {percentage}%
                </div>
                <div className="w-full bg-surface-dark rounded-full h-2">
                  <div
                    className="bg-brand-gold/50 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-4">
              {isCompleted ? (
                <span className="text-semantic-success font-semibold flex items-center gap-2">
                  <span>✓</span>
                  Completed ({percentage}%)
                </span>
              ) : percentage > 0 ? (
                <span className="text-brand-gold font-semibold group-hover:underline flex items-center gap-2">
                  <span>📚</span>
                  Continue Lesson
                </span>
              ) : (
                <span className="text-brand-gold font-semibold group-hover:underline flex items-center gap-2">
                  <span>▶</span>
                  Start Lesson
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
