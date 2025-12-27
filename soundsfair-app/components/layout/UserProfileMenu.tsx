'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUserProgress, getXPProgress } from '@/lib/progress';
import XPBar from '@/components/ui/XPBar';

export default function UserProfileMenu() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userProgress, setUserProgress] = useState(getUserProgress());
  const [xpProgress, setXpProgress] = useState(getXPProgress());
  const menuRef = useRef<HTMLDivElement>(null);

  // Update progress on mount and when menu opens
  useEffect(() => {
    if (isOpen) {
      setUserProgress(getUserProgress());
      setXpProgress(getXPProgress());
    }
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const currentLevel = xpProgress.currentLevel;
  const currentXP = xpProgress.currentXP;
  const xpToNextLevel = xpProgress.xpToNextLevel;

  // Get user initial (first letter of email)
  const userInitial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex
          items-center
          gap-3
          px-3
          py-2
          rounded-lg
          bg-surface-charcoal
          border
          border-border-default
          hover:border-brand-gold
          transition-all
          duration-300
          group
        "
      >
        {/* Avatar */}
        <div className="
          w-10
          h-10
          rounded-full
          bg-gradient-to-br
          from-brand-gold
          to-brand-orange
          flex
          items-center
          justify-center
          font-display
          font-bold
          text-surface-black
          shadow-glow
          group-hover:shadow-glow-lg
          transition-all
          duration-300
        ">
          {userInitial}
        </div>

        {/* Level Badge */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-xs font-mono text-text-tertiary uppercase">Level {currentLevel}</span>
          <span className="text-sm font-display text-brand-gold">{user.email?.split('@')[0]}</span>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-brand-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute
          right-0
          mt-2
          w-80
          bg-surface-charcoal
          border-2
          border-brand-gold
          rounded-card
          shadow-glow-lg
          overflow-hidden
          animate-slide-down
          z-50
        ">
          {/* Header with XP */}
          <div className="p-6 bg-gradient-to-br from-surface-dark to-surface-charcoal border-b border-border-default">
            <div className="flex items-center gap-4 mb-4">
              {/* Large Avatar */}
              <div className="
                w-16
                h-16
                rounded-full
                bg-gradient-to-br
                from-brand-gold
                to-brand-orange
                flex
                items-center
                justify-center
                font-display
                font-bold
                text-2xl
                text-surface-black
                shadow-glow
              ">
                {userInitial}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h3 className="text-lg font-display text-text-primary truncate">
                  {user.email?.split('@')[0]}
                </h3>
                <p className="text-sm text-text-tertiary truncate">{user.email}</p>
              </div>
            </div>

            {/* XP Progress */}
            <XPBar
              currentXP={xpProgress.progressPercentage}
              requiredXP={100}
              level={currentLevel}
              size="sm"
              animated={true}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-surface-darker/50">
            <div className="text-center">
              <div className="text-2xl font-display text-brand-gold">{userProgress.lessonsCompleted.length}</div>
              <div className="text-xs text-text-tertiary uppercase tracking-wider">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display text-brand-gold">{currentXP}</div>
              <div className="text-xs text-text-tertiary uppercase tracking-wider">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display text-brand-gold">{userProgress.currentStreak}</div>
              <div className="text-xs text-text-tertiary uppercase tracking-wider">Streak</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                hover:bg-brand-gold/10
                hover:border-brand-gold/30
                border
                border-transparent
                transition-all
                duration-200
                group
              "
            >
              <span className="text-brand-gold text-xl group-hover:scale-110 transition-transform">👤</span>
              <div>
                <div className="text-sm font-display text-text-primary">My Profile</div>
                <div className="text-xs text-text-tertiary">View your progress</div>
              </div>
            </Link>

            <Link
              href="/profile#xp"
              onClick={() => setIsOpen(false)}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                hover:bg-brand-gold/10
                hover:border-brand-gold/30
                border
                border-transparent
                transition-all
                duration-200
                group
              "
            >
              <span className="text-brand-gold text-xl group-hover:scale-110 transition-transform">⚡</span>
              <div>
                <div className="text-sm font-display text-text-primary">XP & Levels</div>
                <div className="text-xs text-text-tertiary">Track your achievements</div>
              </div>
            </Link>

            <button
              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                hover:bg-brand-gold/10
                hover:border-brand-gold/30
                border
                border-transparent
                transition-all
                duration-200
                group
                opacity-50
                cursor-not-allowed
              "
              disabled
            >
              <span className="text-brand-gold text-xl">💼</span>
              <div>
                <div className="text-sm font-display text-text-primary flex items-center gap-2">
                  Wallet Tracker
                  <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded">Soon</span>
                </div>
                <div className="text-xs text-text-tertiary">Track your Bitcoin portfolio</div>
              </div>
            </button>

            <div className="h-px bg-border-default my-2" />

            <Link
              href="/learn"
              onClick={() => setIsOpen(false)}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                hover:bg-brand-gold/10
                hover:border-brand-gold/30
                border
                border-transparent
                transition-all
                duration-200
                group
              "
            >
              <span className="text-brand-gold text-xl group-hover:scale-110 transition-transform">📚</span>
              <div>
                <div className="text-sm font-display text-text-primary">Continue Learning</div>
                <div className="text-xs text-text-tertiary">Resume your journey</div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
