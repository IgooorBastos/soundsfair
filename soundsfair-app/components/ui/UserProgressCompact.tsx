'use client';

import { useState, useEffect } from 'react';
import { getUserProgress, getXPProgress } from '@/lib/progress';
import Link from 'next/link';

/**
 * Compact User Progress Component
 *
 * Modern, subtle XP display inspired by Duolingo and Linear
 * - Small circular badge with level number
 * - Progress ring indicator
 * - Minimal by default, detailed on hover/click
 */
export default function UserProgressCompact() {
  const [progress, setProgress] = useState<ReturnType<typeof getUserProgress> | null>(null);
  const [xpInfo, setXPInfo] = useState<ReturnType<typeof getXPProgress> | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateProgress();

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

  if (!mounted || !progress || !xpInfo) {
    return null;
  }

  // Calculate progress for the circular ring
  const circumference = 2 * Math.PI * 18; // radius = 18
  const strokeDashoffset = circumference - (xpInfo.progressPercentage / 100) * circumference;

  return (
    <div className="relative">
      {/* Compact Badge with Progress Ring */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="group relative flex items-center gap-2 px-2 py-1 rounded-full
                   hover:bg-gray-900/50 transition-all duration-200"
        aria-label="View progress"
      >
        {/* Progress Ring SVG */}
        <div className="relative w-10 h-10">
          <svg className="transform -rotate-90 w-10 h-10" viewBox="0 0 40 40">
            {/* Background circle */}
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              className="text-gray-800"
            />
            {/* Progress circle */}
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              className="text-brand-yellow transition-all duration-500"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
              }}
            />
          </svg>

          {/* Level Number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white group-hover:scale-110 transition-transform">
              {xpInfo.currentLevel}
            </span>
          </div>
        </div>

        {/* Streak indicator (if active) */}
        {progress.currentStreak > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10">
            <span className="text-xs">🔥</span>
            <span className="text-xs font-semibold text-orange-400">
              {progress.currentStreak}
            </span>
          </div>
        )}

        {/* Chevron indicator */}
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
            showDetails ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Details Panel */}
      {showDetails && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-black/95 backdrop-blur-xl
                          border border-gray-800/50 rounded-xl shadow-2xl z-50 p-5
                          animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Level {xpInfo.currentLevel}
                </h3>
                <p className="text-sm text-gray-400">
                  {xpInfo.currentXP} XP earned
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress to Next Level */}
            {xpInfo.currentLevel < 10 && (
              <div className="mb-5">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Progress to Level {xpInfo.currentLevel + 1}</span>
                  <span className="font-semibold text-brand-yellow">
                    {xpInfo.xpToNextLevel} XP to go
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-yellow to-orange-400
                               transition-all duration-500 rounded-full"
                    style={{ width: `${xpInfo.progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-900/50 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Lessons</div>
                <div className="text-xl font-bold text-white">
                  {progress.lessonsCompleted.length}/9
                </div>
              </div>

              <div className="bg-gray-900/50 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">Streak</div>
                <div className="text-xl font-bold text-white flex items-center gap-1">
                  {progress.currentStreak > 0 && '🔥'}
                  {progress.currentStreak}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link
                href="/lessons"
                className="flex-1 px-3 py-2 bg-brand-yellow text-black text-sm font-semibold
                           rounded-lg hover:bg-yellow-400 transition-colors text-center"
                onClick={() => setShowDetails(false)}
              >
                Continue
              </Link>
              <Link
                href="/profile"
                className="px-3 py-2 border border-gray-700 text-gray-300 text-sm font-medium
                           rounded-lg hover:bg-gray-900 transition-colors"
                onClick={() => setShowDetails(false)}
              >
                Profile
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
