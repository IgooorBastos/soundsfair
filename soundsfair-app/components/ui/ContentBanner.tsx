'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface ContentBannerProps {
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  overlay?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * ContentBanner - Hero/Banner component with image support
 *
 * USAGE:
 * <ContentBanner
 *   imageSrc="/images/banners/books-hero.jpg"
 *   imageAlt="Person reading Bitcoin books"
 *   title="Essential Bitcoin Reading"
 *   subtitle="Curated Book Recommendations"
 *   description="The best books to understand Bitcoin, sound money, and economic freedom"
 * />
 *
 * AI IMAGE GENERATION PROMPTS (save to /public/images/banners/):
 *
 * books-hero.jpg:
 * "Professional photo of diverse people reading books in a modern library,
 * warm natural lighting, focused expressions, stack of Bitcoin books visible,
 * photorealistic, 8k quality, shallow depth of field"
 *
 * podcasts-hero.jpg:
 * "Young professional wearing headphones, listening to podcast while taking notes,
 * modern home office, laptop showing podcast app, warm desk lamp,
 * photorealistic, candid photography style"
 *
 * reflections-hero.jpg:
 * "Thoughtful person writing in notebook at desk, looking contemplative,
 * Bitcoin symbol visible on laptop screen in background, natural window lighting,
 * professional photography, warm tones"
 */
export default function ContentBanner({
  imageSrc,
  imageAlt = 'Banner image',
  title,
  subtitle,
  description,
  children,
  overlay = true,
  height = 'md',
  className = ''
}: ContentBannerProps) {
  const heightClasses = {
    sm: 'h-[300px]',
    md: 'h-[400px]',
    lg: 'h-[500px]',
    xl: 'h-[600px]',
  };

  return (
    <section className={`relative ${heightClasses[height]} overflow-hidden ${className}`}>
      {/* Background Image */}
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-surface-black/70 via-surface-black/80 to-surface-black" />
          )}
        </>
      ) : (
        // Placeholder gradient if no image
        <div className="absolute inset-0 bg-cyber-gradient" />
      )}

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-gold bg-grid-lg opacity-5" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-center text-center">
        <div className="max-w-4xl">
          {/* Subtitle */}
          {subtitle && (
            <div className="mb-4 animate-fade-in">
              <span className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm uppercase tracking-wider">
                {subtitle}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-display font-display text-text-primary mb-6 animate-fade-in [animation-delay:0.2s] leading-tight">
            {title.split(' ').map((word, index) => (
              <span key={index} className="inline-block">
                {word === 'Bitcoin' || word === 'Sound' || word === 'Fair' || word === 'Freedom' ? (
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
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto mb-8 animate-fade-in [animation-delay:0.4s]">
              {description}
            </p>
          )}

          {/* Custom children (CTAs, etc.) */}
          {children && (
            <div className="animate-fade-in [animation-delay:0.6s]">
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-black to-transparent" />
    </section>
  );
}
