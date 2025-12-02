'use client';

import { useState, useEffect } from 'react';
import { updateReadingPosition, markLessonStarted } from '@/app/lib/progress';

interface ReadingProgressBarProps {
  lessonSlug: string;
  lessonLevel: number;
  estimatedMinutes: number; // For estimated time remaining
}

export default function ReadingProgressBar({
  lessonSlug,
  lessonLevel,
  estimatedMinutes,
}: ReadingProgressBarProps) {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mark lesson as started on first load
    markLessonStarted(lessonSlug, lessonLevel);

    const calculateScrollPercentage = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const percentage = (scrolled / documentHeight) * 100;

      setScrollPercentage(Math.min(100, Math.max(0, percentage)));
      setIsVisible(scrolled > 50); // Show after scrolling 50px
    };

    // Initial calculation
    calculateScrollPercentage();

    // Update on scroll (throttled)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateScrollPercentage();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Save progress periodically (every 5 seconds when scrolling)
    const saveInterval = setInterval(() => {
      if (scrollPercentage > 0) {
        updateReadingPosition(lessonSlug, lessonLevel, scrollPercentage);
      }
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(saveInterval);

      // Save final position on unmount
      if (scrollPercentage > 0) {
        updateReadingPosition(lessonSlug, lessonLevel, scrollPercentage);
      }
    };
  }, [lessonSlug, lessonLevel, scrollPercentage]);

  // Calculate estimated time remaining
  const timeRemaining = Math.max(0, Math.ceil(estimatedMinutes * (1 - scrollPercentage / 100)));

  return (
    <>
      {/* Fixed Progress Bar at Top */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="h-1 bg-surface-dark">
          <div
            className="h-full bg-gradient-to-r from-brand-gold via-brand-orange to-brand-gold
                       transition-all duration-300 ease-out"
            style={{ width: `${scrollPercentage}%` }}
          />
        </div>

        {/* Progress Info Bar */}
        <div className="bg-surface-black/95 backdrop-blur-sm border-b border-border-default">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2">
              {/* Progress Percentage */}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-brand-gold font-semibold">
                  {Math.round(scrollPercentage)}% complete
                </span>
                <span className="text-text-muted">•</span>
                <span className="text-text-tertiary">
                  {timeRemaining > 0
                    ? `~${timeRemaining} min remaining`
                    : 'Almost done!'}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-2">
                {/* Scroll to Top */}
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-3 py-1 text-xs text-text-tertiary hover:text-brand-gold
                             border border-border-default hover:border-brand-gold rounded
                             transition-colors"
                  aria-label="Scroll to top"
                >
                  ↑ Top
                </button>

                {/* Scroll to Quiz (if exists) */}
                <button
                  onClick={() => {
                    const quizSection = document.querySelector('[data-quiz-section]');
                    if (quizSection) {
                      quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      // Scroll to bottom if no quiz
                      window.scrollTo({
                        top: document.documentElement.scrollHeight,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className="px-3 py-1 text-xs text-text-tertiary hover:text-brand-gold
                             border border-border-default hover:border-brand-gold rounded
                             transition-colors"
                  aria-label="Skip to quiz"
                >
                  Quiz ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Circular Progress Indicator (Bottom Right) */}
      <div
        className={`fixed bottom-8 right-8 z-40 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="relative w-14 h-14 rounded-full bg-surface-charcoal border-2 border-brand-gold
                     hover:scale-110 hover:shadow-glow transition-all group"
          aria-label="Scroll to top"
        >
          {/* Circular Progress */}
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-surface-dark"
            />
            {/* Progress circle */}
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollPercentage / 100)}`}
              className="text-brand-gold transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>

          {/* Up Arrow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-brand-gold group-hover:text-brand-gold-hover transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </button>

        {/* Percentage Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-surface-charcoal
                        border border-brand-gold rounded text-xs text-brand-gold font-semibold
                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {Math.round(scrollPercentage)}% read
        </div>
      </div>
    </>
  );
}
