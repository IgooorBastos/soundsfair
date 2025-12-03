/**
 * IMAGE PLACEHOLDER COMPONENT
 *
 * Purpose: Smart placeholder that shows during development and
 * automatically displays actual image when file exists.
 *
 * Features:
 * - Shows AI prompt in dev mode for easy reference
 * - Auto-detects if actual image exists
 * - Optimizes with Next.js Image component
 * - Includes usage notes for context
 * - Accessible with proper alt text
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import '../app/styles/visual-identity.css';

interface ImagePlaceholderProps {
  /**
   * Image identifier (e.g., "level-01-inflation-thief")
   * Used to construct file path and lookup prompt
   */
  imageId: string;

  /**
   * Human-readable title for the image
   */
  title: string;

  /**
   * AI generation prompt (optional, shown in dev mode)
   */
  prompt?: string;

  /**
   * Usage notes explaining where/how image should be used
   */
  usageNotes?: string;

  /**
   * Alt text for accessibility (required when actual image exists)
   */
  alt: string;

  /**
   * Aspect ratio for placeholder (e.g., "16:9", "1:1", "4:3")
   */
  aspectRatio?: string;

  /**
   * Optional CSS class names
   */
  className?: string;

  /**
   * Show placeholder even if image exists (for development)
   */
  forcePlaceholder?: boolean;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  imageId,
  title,
  prompt,
  usageNotes,
  alt,
  aspectRatio = '16:9',
  className = '',
  forcePlaceholder = false,
}) => {
  const [imageExists, setImageExists] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  // Construct image path based on imageId
  const imagePath = `/images/lessons/${imageId}.webp`;
  const fallbackPath = `/images/lessons/${imageId}.png`;

  // Detect development mode
  useEffect(() => {
    setIsDevMode(process.env.NODE_ENV === 'development');
  }, []);

  // Check if image file exists
  useEffect(() => {
    if (forcePlaceholder) {
      setImageExists(false);
      return;
    }

    const checkImage = async () => {
      try {
        const response = await fetch(imagePath, { method: 'HEAD' });
        if (response.ok) {
          setImageExists(true);
        } else {
          // Try fallback PNG
          const fallbackResponse = await fetch(fallbackPath, { method: 'HEAD' });
          setImageExists(fallbackResponse.ok);
        }
      } catch {
        setImageExists(false);
      }
    };

    checkImage();
  }, [imagePath, fallbackPath, forcePlaceholder]);

  // Calculate padding-top for aspect ratio
  const getAspectRatioPadding = (ratio: string): string => {
    const ratios: Record<string, string> = {
      '16:9': '56.25%',
      '4:3': '75%',
      '1:1': '100%',
      '3:2': '66.67%',
      '21:9': '42.86%',
    };
    return ratios[ratio] || '56.25%';
  };

  // Render actual image if it exists
  if (imageExists && !forcePlaceholder) {
    return (
      <div className={`relative w-full ${className}`} style={{ paddingTop: getAspectRatioPadding(aspectRatio) }}>
        <Image
          src={imagePath}
          alt={alt}
          fill
          style={{ objectFit: 'contain' }}
          className="rounded-lg"
          priority={false}
        />
        {isDevMode && (
          <div className="absolute top-2 right-2 bg-vi-gold text-black px-2 py-1 rounded text-xs font-semibold">
            ✓ Image Loaded
          </div>
        )}
      </div>
    );
  }

  // Render placeholder
  return (
    <div className={`vi-image-placeholder ${className}`}>
      {/* Image Icon */}
      <div className="vi-image-placeholder__icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>

      {/* Image Title */}
      <h4 className="vi-image-placeholder__title">{title}</h4>

      {/* Image ID for reference */}
      <p className="text-xs text-vi-gray font-mono mb-2">
        ID: {imageId} | Ratio: {aspectRatio}
      </p>

      {/* AI Prompt (Dev Mode Only) */}
      {isDevMode && prompt && (
        <details className="w-full max-w-2xl">
          <summary className="cursor-pointer text-vi-gold text-sm font-semibold mb-2 hover:text-vi-gold-muted transition-colors">
            📝 AI Generation Prompt (Click to view)
          </summary>
          <div className="vi-image-placeholder__prompt">
            {prompt}
          </div>
        </details>
      )}

      {/* Usage Notes */}
      {usageNotes && (
        <p className="vi-image-placeholder__usage">
          <strong>Usage:</strong> {usageNotes}
        </p>
      )}

      {/* Development Instructions */}
      {isDevMode && (
        <div className="mt-4 p-3 bg-vi-chart-grid rounded text-xs text-vi-text-muted">
          <p><strong>🎨 To replace this placeholder:</strong></p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Use the prompt above with Midjourney/DALL-E</li>
            <li>Save as: <code className="bg-vi-black px-1 py-0.5 rounded">{imageId}.webp</code></li>
            <li>Place in: <code className="bg-vi-black px-1 py-0.5 rounded">/public/images/lessons/</code></li>
            <li>Refresh page - image will auto-load</li>
          </ol>
        </div>
      )}
    </div>
  );
};

// ==========================================
// TYPED VARIANT: LessonImage
// Wrapper with common lesson image props
// ==========================================

interface LessonImageProps {
  level: number;
  imageNumber: number;
  title: string;
  prompt: string;
  usageNotes: string;
  alt: string;
  aspectRatio?: string;
}

export const LessonImage: React.FC<LessonImageProps> = ({
  level,
  imageNumber,
  title,
  prompt,
  usageNotes,
  alt,
  aspectRatio = '16:9',
}) => {
  const levelPadded = level.toString().padStart(2, '0');
  const imageId = `level-${levelPadded}-image-${imageNumber}`;

  return (
    <ImagePlaceholder
      imageId={imageId}
      title={title}
      prompt={prompt}
      usageNotes={usageNotes}
      alt={alt}
      aspectRatio={aspectRatio}
    />
  );
};

// ==========================================
// EXAMPLE USAGE
// ==========================================

/*
// Basic usage with imageId
<ImagePlaceholder
  imageId="level-01-inflation-thief"
  title="The Inflation Thief"
  alt="Visualization of purchasing power erosion over time from 1950 to 2023"
  prompt="Create a minimalist, symbolic illustration showing the concept of inflation as wealth theft..."
  usageNotes="Place in Section 4 when explaining 'The Inflation Machine'"
  aspectRatio="16:9"
/>

// Typed lesson image variant
<LessonImage
  level={1}
  imageNumber={1}
  title="The Inflation Thief"
  alt="Visualization of purchasing power erosion"
  prompt="Create a minimalist..."
  usageNotes="Section 4: The Inflation Machine"
/>

// Force placeholder (development testing)
<ImagePlaceholder
  imageId="level-01-test"
  title="Test Image"
  alt="Test"
  forcePlaceholder={true}
/>
*/
