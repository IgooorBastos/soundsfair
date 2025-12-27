'use client';

import Image from 'next/image';
import { Podcast } from '@/data/podcasts';

interface PodcastCardProps {
  podcast: Podcast;
  priority?: boolean;
}

export default function PodcastCard({ podcast, priority = false }: PodcastCardProps) {
  const categoryColors = {
    beginner: 'bg-semantic-success/10 text-semantic-success border-semantic-success/30',
    intermediate: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
    advanced: 'bg-vi-red/10 text-vi-red border-vi-red/30',
    news: 'bg-vi-blue/10 text-vi-blue border-vi-blue/30',
    technical: 'bg-semantic-lightning/10 text-semantic-lightning border-semantic-lightning/30',
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
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-radial-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Podcast Cover */}
        <div className="mb-4 aspect-square relative bg-surface-dark rounded overflow-hidden">
          {podcast.coverImage ? (
            <Image
              src={podcast.coverImage}
              alt={`${podcast.title} cover`}
              fill
              className="object-cover"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-gold/20">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
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
            ${categoryColors[podcast.category]}
          `}>
            {podcast.category}
          </span>
        </div>

        {/* Title & Host */}
        <h3 className="text-h4 font-display text-text-primary mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
          {podcast.title}
        </h3>
        <p className="text-body-sm text-text-tertiary mb-4">
          Hosted by {podcast.host}
        </p>

        {/* Description */}
        <p className="text-body-sm text-text-secondary mb-4 line-clamp-3">
          {podcast.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {podcast.frequency}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
            </svg>
            {podcast.language}
          </span>
          {podcast.rating && (
            <span className="flex items-center gap-1 text-brand-gold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {podcast.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {podcast.topics.slice(0, 3).map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-surface-dark text-text-tertiary text-xs rounded"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Featured Episodes Preview */}
        {podcast.featuredEpisodes && podcast.featuredEpisodes.length > 0 && (
          <div className="mb-4 p-3 bg-surface-dark/50 rounded border border-border-default">
            <p className="text-xs font-mono text-brand-gold uppercase tracking-wider mb-2">
              Featured Episode:
            </p>
            <p className="text-xs text-text-secondary line-clamp-2">
              {podcast.featuredEpisodes[0].title}
            </p>
          </div>
        )}

        {/* Listen Buttons */}
        <div className="flex flex-wrap gap-2">
          {podcast.spotifyUrl && (
            <a
              href={podcast.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                bg-[#1DB954]
                text-white
                text-sm
                font-semibold
                rounded
                hover:bg-[#1ed760]
                transition-colors
              "
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify
            </a>
          )}
          {podcast.appleUrl && (
            <a
              href={podcast.appleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                bg-surface-dark
                text-text-primary
                border
                border-brand-gold/30
                text-sm
                font-semibold
                rounded
                hover:bg-brand-gold/10
                transition-colors
              "
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.654 14.163c-.28.424-.735.653-1.192.653-.232 0-.47-.058-.688-.183-2.164-1.229-4.882-1.511-7.244-1.019-.651.136-1.283-.283-1.418-.935-.136-.651.283-1.283.935-1.418 2.769-.577 5.959-.262 8.554 1.223.604.342.812 1.107.47 1.711zm1.678-3.725c-.337.528-.94.712-1.468.375-2.48-1.411-6.264-1.82-9.195-1.027-.789.213-1.618-.254-1.831-1.043-.213-.789.254-1.618 1.043-1.831 3.353-.906 7.626-.467 10.626 1.171.528.337.712.94.375 1.468zm.144-3.883c-2.976-1.688-7.896-1.844-10.739-1.019-.951.276-1.954-.271-2.231-1.222-.276-.951.271-1.954 1.222-2.231 3.257-.946 8.855-.765 12.363 1.179.858.451 1.191 1.52.74 2.378-.451.858-1.52 1.191-2.378.74z"/>
              </svg>
              Apple
            </a>
          )}
          {podcast.youtubeUrl && (
            <a
              href={podcast.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                bg-[#FF0000]
                text-white
                text-sm
                font-semibold
                rounded
                hover:bg-[#cc0000]
                transition-colors
              "
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </a>
          )}
        </div>

        {podcast.websiteUrl && (
          <a
            href={podcast.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              block
              mt-2
              text-center
              text-sm
              text-brand-gold
              hover:text-shadow-glow
              transition-all
            "
          >
            Visit Website →
          </a>
        )}
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
    </div>
  );
}
