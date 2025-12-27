'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  features?: string[];
  href?: string;
  ctaText?: string;
  className?: string;
  onClick?: () => void;
}

export default function FeatureCard({
  icon,
  title,
  description,
  features = [],
  href,
  ctaText = 'Explore',
  className = '',
  onClick,
}: FeatureCardProps) {
  const content = (
    <div
      className={`
        relative
        bg-surface-charcoal
        border-2
        border-border-default
        rounded-card
        p-6
        transition-all
        duration-300
        hover:border-brand-gold
        hover:shadow-glow
        hover:transform
        hover:-translate-y-1
        group
        cursor-pointer
        overflow-hidden
        ${className}
      `}
      onClick={onClick}
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-radial-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        {icon && (
          <div className="mb-4 text-brand-gold text-4xl group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}

        {/* Title */}
        <h3 className="text-h4 font-display text-brand-gold mb-3 group-hover:text-shadow-glow transition-all duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-body text-text-secondary mb-4">
          {description}
        </p>

        {/* Features list */}
        {features.length > 0 && (
          <ul className="space-y-2 mb-4">
            {features.map((feature, index) => (
              <li
                key={index}
                className="text-body-sm text-text-tertiary flex items-start"
              >
                <span className="text-brand-gold mr-2 mt-1 group-hover:animate-lightning">⚡</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        {ctaText && (
          <div className="flex items-center text-brand-gold font-display text-sm uppercase tracking-wider group-hover:text-shadow-glow transition-all duration-300">
            <span>{ctaText}</span>
            <span className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
          </div>
        )}
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
