'use client';

import { useEffect, useState } from 'react';

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export default function XPBar({
  currentXP,
  requiredXP,
  level,
  showLabel = true,
  size = 'md',
  animated = true,
  className = '',
}: XPBarProps) {
  const [progress, setProgress] = useState(0);
  const percentage = Math.min((currentXP / requiredXP) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setProgress(percentage), 100);
      return () => clearTimeout(timer);
    } else {
      setProgress(percentage);
    }
  }, [percentage, animated]);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {showLabel && (
        <div className={`flex justify-between items-center mb-2 ${labelSizeClasses[size]}`}>
          <span className="font-display text-brand-gold uppercase tracking-wider">
            Level {level}
          </span>
          <span className="font-mono text-text-tertiary">
            {requiredXP > 0 ? `${requiredXP.toLocaleString()} XP to next level` : 'Max Level!'}
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="relative w-full bg-surface-dark rounded-full overflow-hidden border border-border-default">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-gold/5 to-transparent animate-shimmer bg-[length:200%_100%]" />

        {/* Progress fill */}
        <div
          className={`
            ${sizeClasses[size]}
            bg-gradient-to-r
            from-brand-gold
            via-semantic-lightning
            to-brand-gold
            rounded-full
            transition-all
            duration-1000
            ease-out
            relative
            shadow-glow
          `}
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect on fill */}
          <div className="absolute inset-0 bg-gold-shimmer bg-[length:200%_100%] animate-shimmer opacity-50" />

          {/* Glow pulse at the edge */}
          {progress > 0 && progress < 100 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-full bg-brand-gold blur-sm animate-glow-pulse" />
          )}
        </div>
      </div>

      {/* Next level indicator */}
      {showLabel && percentage >= 100 && (
        <div className="mt-2 text-center">
          <span className="inline-block px-3 py-1 bg-brand-gold/10 border border-brand-gold rounded-full text-brand-gold font-mono text-xs uppercase tracking-wider animate-glow-pulse">
            Ready to Level Up! 🎉
          </span>
        </div>
      )}
    </div>
  );
}
