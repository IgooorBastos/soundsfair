'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/data/reflections';

interface ArticleCardProps {
  post: BlogPost;
  featured?: boolean;
  priority?: boolean;
}

export default function ArticleCard({ post, featured = false, priority = false }: ArticleCardProps) {
  const categoryColors: Record<BlogPost['category'], string> = {
    philosophy: 'bg-brand-gold/10 text-brand-gold border-brand-gold/30',
    economics: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
    technical: 'bg-semantic-lightning/10 text-semantic-lightning border-semantic-lightning/30',
    family: 'bg-semantic-success/10 text-semantic-success border-semantic-success/30',
    freedom: 'bg-vi-blue/10 text-vi-blue border-vi-blue/30',
    news: 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30',
  };

  const href = post.externalUrl || `/reflections/${post.slug}`;

  return (
    <Link href={href} target={post.externalUrl ? '_blank' : undefined}>
      <article className={`
        group
        relative
        bg-surface-charcoal
        border-2
        border-border-default
        rounded-card
        overflow-hidden
        transition-all
        duration-300
        hover:border-brand-gold
        hover:shadow-glow
        hover:-translate-y-1
        ${featured ? 'md:col-span-2 md:flex md:flex-row' : ''}
      `}>
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-radial-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Featured Image */}
        {post.featuredImage && (
          <div className={`
            relative
            bg-surface-dark
            ${featured ? 'md:w-1/2 md:h-auto h-64' : 'w-full h-48'}
          `}>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority={priority}
            />
          </div>
        )}

        {/* Content */}
        <div className={`relative z-10 p-6 ${featured && post.featuredImage ? 'md:w-1/2' : ''}`}>
          {/* Category Badge */}
          <div className="mb-3">
            <span className={`
              inline-block
              px-3
              py-1
              rounded-full
              border
              text-xs
              font-mono
              uppercase
              tracking-wider
              ${categoryColors[post.category]}
            `}>
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h3 className={`
            font-display
            text-text-primary
            mb-3
            group-hover:text-brand-gold
            transition-colors
            line-clamp-2
            ${featured ? 'text-h2' : 'text-h4'}
          `}>
            {post.title}
          </h3>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-3 text-xs text-text-muted">
            <span>{new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            <span>•</span>
            <span>{post.readTime} min read</span>
            <span>•</span>
            <span>{post.author}</span>
          </div>

          {/* Excerpt */}
          <p className={`text-body-sm text-text-secondary mb-4 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface-dark text-text-tertiary text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Read More CTA */}
          <div className="flex items-center text-brand-gold font-display text-sm uppercase tracking-wider group-hover:text-shadow-glow transition-all">
            <span>Read Article</span>
            <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
            {post.externalUrl && (
              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            )}
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
      </article>
    </Link>
  );
}
