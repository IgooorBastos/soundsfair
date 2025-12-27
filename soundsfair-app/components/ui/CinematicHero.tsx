'use client';

import { ReactNode } from 'react';
import GlowButton from './GlowButton';
import { GlowOrb } from '../effects';

interface CinematicHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryCta?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  backgroundImage?: string;
  className?: string;
  children?: ReactNode;
}

export default function CinematicHero({
  title,
  subtitle,
  description,
  cta,
  secondaryCta,
  backgroundImage,
  className = '',
  children,
}: CinematicHeroProps) {
  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-surface-black">
        {backgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <>
            <GlowOrb position={{ x: '20%', y: '30%' }} size="xl" color="gold" />
            <GlowOrb position={{ x: '80%', y: '70%' }} size="lg" color="orange" />
          </>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-black/50 via-surface-black/70 to-surface-black" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-gold bg-grid-lg opacity-10" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 text-center">
        {/* Subtitle */}
        {subtitle && (
          <div className="mb-6 animate-fade-in">
            <span className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm uppercase tracking-wider">
              {subtitle}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-display font-display text-text-primary mb-6 animate-fade-in [animation-delay:0.2s] leading-tight">
          {title.split(' ').map((word, index) => (
            <span key={index} className="inline-block">
              {word === 'Bitcoin' || word === 'Fair' || word === 'Sound' ? (
                <span className="text-brand-gold text-shadow-glow-lg">{word}</span>
              ) : (
                word
              )}
              {' '}
            </span>
          ))}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-body-lg text-text-secondary max-w-3xl mx-auto mb-12 animate-fade-in [animation-delay:0.4s]">
            {description}
          </p>
        )}

        {/* CTAs */}
        {(cta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in [animation-delay:0.6s]">
            {cta && (
              <GlowButton
                href={cta.href}
                onClick={cta.onClick}
                size="lg"
                variant="primary"
              >
                {cta.text}
              </GlowButton>
            )}
            {secondaryCta && (
              <GlowButton
                href={secondaryCta.href}
                onClick={secondaryCta.onClick}
                size="lg"
                variant="outline"
              >
                {secondaryCta.text}
              </GlowButton>
            )}
          </div>
        )}

        {/* Custom children */}
        {children && (
          <div className="mt-12 animate-fade-in [animation-delay:0.8s]">
            {children}
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-black to-transparent" />
    </section>
  );
}
