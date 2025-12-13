'use client';

import { useState, useEffect } from 'react';
import { getUserProgress, getXPProgress } from '@/lib/progress';
import Link from 'next/link';

export default function UserProgress() {
  const [progress, setProgress] = useState<ReturnType<typeof getUserProgress> | null>(null);
  const [xpInfo, setXPInfo] = useState<ReturnType<typeof getXPProgress> | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateProgress();

    // Listen for XP/progress changes
    const handleProgressUpdate = () => updateProgress();
    window.addEventListener('soundsfair:levelup', handleProgressUpdate);
    window.addEventListener('storage', handleProgressUpdate);

    return () => {
      window.removeEventListener('soundsfair:levelup', handleProgressUpdate);
      window.removeEventListener('storage', handleProgressUpdate);
    };
  }, []);

  const updateProgress = () => {
    setProgress(getUserProgress());
    setXPInfo(getXPProgress());
  };

  // Avoid hydration mismatch
  if (!mounted || !progress || !xpInfo) {
    return null;
  }

  return (
    <div className="relative">
      {/* Progress Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg border border-border-default
                   hover:border-brand-gold transition-all group bg-surface-charcoal/50"
        aria-label="View your progress"
      >
        {/* Level Badge */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-orange
                          flex items-center justify-center font-bold text-black text-sm
                          group-hover:scale-110 transition-transform">
            {xpInfo.currentLevel}
          </div>

          {/* XP Bar (Desktop only) */}
          <div className="hidden md:block">
            <div className="text-xs text-text-tertiary mb-1">
              Level {xpInfo.currentLevel}
            </div>
            <div className="w-32 h-2 bg-surface-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-gold to-brand-orange transition-all duration-500"
                style={{ width: `${xpInfo.progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {xpInfo.currentXP} / {xpInfo.currentLevel < 10 ? xpInfo.currentXP + xpInfo.xpToNextLevel : '∞'} XP
            </div>
          </div>
        </div>

        {/* Streak (Mobile compact) */}
        {progress.currentStreak > 0 && (
          <div className="md:hidden flex items-center gap-1 text-brand-orange">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-semibold">{progress.currentStreak}</span>
          </div>
        )}
      </button>

      {/* Dropdown Details */}
      {showDetails && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-surface-charcoal border-2 border-brand-gold
                          rounded-lg shadow-glow-lg z-50 p-6 animate-fade-in">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-text-primary mb-1">
                Your Progress
              </h3>
              <p className="text-sm text-text-tertiary">
                Keep learning to unlock achievements!
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Total XP */}
              <div className="bg-surface-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-brand-gold mb-1">
                  {xpInfo.currentXP}
                </div>
                <div className="text-xs text-text-tertiary">Total XP</div>
              </div>

              {/* Current Level */}
              <div className="bg-surface-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-brand-orange mb-1">
                  {xpInfo.currentLevel}
                </div>
                <div className="text-xs text-text-tertiary">Current Level</div>
              </div>

              {/* Lessons Completed */}
              <div className="bg-surface-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-semantic-success mb-1">
                  {progress.lessonsCompleted.length}/5
                </div>
                <div className="text-xs text-text-tertiary">Lessons Done</div>
              </div>

              {/* Current Streak */}
              <div className="bg-surface-dark p-4 rounded-lg">
                <div className="text-2xl font-bold text-semantic-warning mb-1 flex items-center gap-1">
                  {progress.currentStreak > 0 && '🔥'}
                  {progress.currentStreak}
                </div>
                <div className="text-xs text-text-tertiary">Day Streak</div>
              </div>
            </div>

            {/* Next Level Progress */}
            {xpInfo.currentLevel < 10 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-tertiary">Next Level</span>
                  <span className="text-brand-gold font-semibold">
                    {xpInfo.xpToNextLevel} XP to go
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-gold to-brand-orange
                               transition-all duration-500 rounded-full"
                    style={{ width: `${xpInfo.progressPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-text-muted mt-1 text-center">
                  {xpInfo.progressPercentage}% complete
                </div>
              </div>
            )}

            {/* Longest Streak */}
            {progress.longestStreak > 3 && (
              <div className="mb-6 p-3 bg-semantic-warning/10 border border-semantic-warning/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-lg">🏆</span>
                  <div>
                    <div className="text-semantic-warning font-semibold">
                      Longest Streak: {progress.longestStreak} days
                    </div>
                    <div className="text-text-muted text-xs">
                      Keep it up!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/lessons"
                className="flex-1 px-4 py-2 bg-brand-gold text-black font-semibold rounded-lg
                           hover:bg-brand-gold-hover transition-colors text-center text-sm"
                onClick={() => setShowDetails(false)}
              >
                Continue Learning
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 border-2 border-brand-gold text-brand-gold font-semibold rounded-lg
                           hover:bg-brand-gold/10 transition-colors text-sm"
                onClick={() => setShowDetails(false)}
              >
                Profile
              </Link>
            </div>

            {/* Fun Motivational Message */}
            {progress.lessonsCompleted.length === 0 && (
              <div className="mt-4 text-center text-xs text-text-muted">
                🚀 Start your first lesson to earn XP!
              </div>
            )}
            {progress.lessonsCompleted.length >= 1 && progress.lessonsCompleted.length < 5 && (
              <div className="mt-4 text-center text-xs text-text-muted">
                💪 {5 - progress.lessonsCompleted.length} lessons to go!
              </div>
            )}
            {progress.lessonsCompleted.length === 5 && (
              <div className="mt-4 text-center text-xs text-brand-gold font-semibold">
                🎓 Course completed! You're a Bitcoin expert!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
