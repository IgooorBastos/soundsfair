'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
  rel?: string;
}

export default function GlowButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  target,
  rel,
}: GlowButtonProps) {
  const baseClasses = `
    relative
    inline-flex
    items-center
    justify-center
    font-display
    font-semibold
    uppercase
    tracking-wider
    transition-all
    duration-300
    overflow-hidden
    group
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-brand-gold
      text-surface-black
      hover:bg-brand-gold-hover
      shadow-glow
      hover:shadow-glow-lg
      before:absolute
      before:inset-0
      before:bg-gold-shimmer
      before:bg-[length:200%_100%]
      before:animate-shimmer
      before:opacity-0
      hover:before:opacity-100
    `,
    secondary: `
      bg-surface-charcoal
      text-brand-gold
      border-2
      border-brand-gold
      hover:bg-brand-gold/10
      shadow-glow-sm
      hover:shadow-glow
    `,
    outline: `
      bg-transparent
      text-brand-gold
      border-2
      border-brand-gold
      hover:bg-brand-gold
      hover:text-surface-black
      shadow-glow-sm
      hover:shadow-glow
    `,
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-brand-gold-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </>
  );

  if (href && !disabled) {
    // Use <a> tag for external links with target="_blank"
    if (target === '_blank') {
      return (
        <a
          href={href}
          target={target}
          rel={rel || 'noopener noreferrer'}
          className={classes}
        >
          {content}
        </a>
      );
    }

    // Use Next.js Link for internal links
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {content}
    </button>
  );
}
