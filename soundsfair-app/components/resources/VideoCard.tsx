'use client';

import Image from 'next/image';
import { Video, getYouTubeThumbnail, getYouTubeWatchUrl } from '@/data/videos';

interface VideoCardProps {
  video: Video;
  priority?: boolean;
}

export default function VideoCard({ video, priority = false }: VideoCardProps) {
  const categoryColors: Record<Video['category'], string> = {
    beginner: 'bg-semantic-success/10 text-semantic-success border-semantic-success/30',
    intermediate: 'bg-brand-gold/10 text-brand-gold border-brand-gold/30',
    advanced: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
    documentary: 'bg-vi-blue/10 text-vi-blue border-vi-blue/30',
    debate: 'bg-semantic-lightning/10 text-semantic-lightning border-semantic-lightning/30',
    interview: 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30',
  };

  return (
    <article className="
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

      {/* Thumbnail */}
      <a
        href={getYouTubeWatchUrl(video.youtubeId)}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video bg-surface-dark overflow-hidden"
      >
        <Image
          src={getYouTubeThumbnail(video.youtubeId, 'high')}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={priority}
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-surface-black/30 group-hover:bg-surface-black/50 transition-colors">
          <div className="w-16 h-16 rounded-full bg-brand-gold/90 group-hover:bg-brand-gold group-hover:scale-110 transition-all flex items-center justify-center">
            <svg className="w-8 h-8 text-surface-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-surface-black/90 text-text-primary text-xs font-mono rounded">
          {video.duration}
        </div>
      </a>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Category & Publish Date */}
        <div className="flex items-center justify-between mb-3">
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
            ${categoryColors[video.category]}
          `}>
            {video.category}
          </span>
          <span className="text-xs text-text-muted">
            {new Date(video.publishDate).getFullYear()}
          </span>
        </div>

        {/* Title */}
        <h3 className="
          font-display
          text-h5
          text-text-primary
          mb-2
          group-hover:text-brand-gold
          transition-colors
          line-clamp-2
        ">
          {video.title}
        </h3>

        {/* Creator */}
        <p className="text-sm text-text-tertiary mb-3">
          by <span className="text-text-secondary">{video.creator}</span>
        </p>

        {/* Description */}
        <p className="text-body-sm text-text-secondary mb-4 line-clamp-2">
          {video.description}
        </p>

        {/* Curator Notes */}
        <div className="mb-4 p-3 bg-surface-dark border-l-2 border-brand-gold rounded">
          <p className="text-xs font-mono text-brand-gold mb-1 uppercase tracking-wide">Curator Notes:</p>
          <p className="text-body-sm text-text-secondary line-clamp-3">
            {video.curatorNotes}
          </p>
        </div>

        {/* Key Takeaways */}
        <div className="mb-4">
          <p className="text-xs font-mono text-text-tertiary mb-2 uppercase tracking-wide">Key Takeaways:</p>
          <ul className="space-y-1">
            {video.keyTakeaways.slice(0, 3).map((takeaway, index) => (
              <li key={index} className="text-body-sm text-text-secondary flex items-start">
                <span className="text-brand-gold mr-2 mt-1">•</span>
                <span className="line-clamp-1">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Topics Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {video.topics.slice(0, 3).map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-surface-dark text-text-tertiary text-xs rounded"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Watch CTA */}
        <a
          href={getYouTubeWatchUrl(video.youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            bg-brand-gold/10
            border
            border-brand-gold/30
            rounded
            text-brand-gold
            font-display
            text-sm
            uppercase
            tracking-wider
            hover:bg-brand-gold/20
            hover:border-brand-gold
            hover:shadow-glow
            transition-all
          "
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
          </svg>
          Watch on YouTube
        </a>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />
    </article>
  );
}
