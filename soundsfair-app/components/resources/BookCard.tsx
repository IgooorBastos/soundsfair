'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/data/books';

interface BookCardProps {
  book: Book;
  priority?: boolean;
}

export default function BookCard({ book, priority = false }: BookCardProps) {
  const categoryColors = {
    beginner: 'bg-semantic-success/10 text-semantic-success border-semantic-success/30',
    intermediate: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
    advanced: 'bg-vi-red/10 text-vi-red border-vi-red/30',
  };

  return (
    <div className="
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
    ">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-radial-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Book Cover */}
        <div className="mb-4 aspect-[2/3] relative bg-surface-dark rounded overflow-hidden">
          {book.coverImage ? (
            <Image
              src={book.coverImage}
              alt={`${book.title} cover`}
              fill
              className="object-cover"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-gold/20">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
          )}
        </div>

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
            ${categoryColors[book.category]}
          `}>
            {book.category}
          </span>
        </div>

        {/* Title & Author */}
        <h3 className="text-h4 font-display text-text-primary mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-body-sm text-text-tertiary mb-4">
          by {book.author}
        </p>

        {/* Description */}
        <p className="text-body-sm text-text-secondary mb-4 line-clamp-3">
          {book.description}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {book.topics.slice(0, 3).map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-surface-dark text-text-tertiary text-xs rounded"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-xs text-text-muted">
          {book.publishYear && <span>{book.publishYear}</span>}
          {book.pages && <span>{book.pages} pages</span>}
          {book.rating && (
            <span className="flex items-center gap-1 text-brand-gold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {book.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Key Takeaways Preview */}
        {book.keyTakeaways && book.keyTakeaways.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-brand-gold uppercase tracking-wider mb-2">
              Key Takeaways:
            </p>
            <ul className="space-y-1">
              {book.keyTakeaways.slice(0, 2).map((takeaway, index) => (
                <li key={index} className="text-xs text-text-tertiary flex items-start">
                  <span className="text-brand-gold mr-2 mt-0.5">▸</span>
                  <span className="line-clamp-1">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-2">
          {book.amazonUrl && (
            <a
              href={book.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex-1
                px-4
                py-2
                bg-brand-gold
                text-surface-black
                text-sm
                font-display
                font-semibold
                uppercase
                tracking-wider
                rounded
                text-center
                hover:bg-brand-gold-hover
                hover:shadow-glow
                transition-all
                duration-300
              "
            >
              Buy Book
            </a>
          )}
          {book.goodreadsUrl && (
            <a
              href={book.goodreadsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-4
                py-2
                bg-surface-dark
                text-brand-gold
                border
                border-brand-gold/30
                text-sm
                font-mono
                rounded
                hover:bg-brand-gold/10
                transition-all
                duration-300
              "
            >
              Reviews
            </a>
          )}
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
    </div>
  );
}
