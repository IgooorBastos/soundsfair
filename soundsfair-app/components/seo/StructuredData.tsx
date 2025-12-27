/**
 * StructuredData Component
 *
 * Provides Schema.org JSON-LD structured data for SEO.
 * Helps search engines and AI systems understand content better.
 */

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[]; // Social media URLs
}

interface BreadcrumbItem {
  position: number;
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

interface ArticleSchemaProps {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}

interface BookSchemaProps {
  name: string;
  author: string;
  isbn?: string;
  bookFormat?: string;
  description: string;
  image?: string;
  url: string;
}

interface PodcastSchemaProps {
  name: string;
  description: string;
  webUrl: string;
  image?: string;
}

/**
 * Organization Schema
 * Use on homepage and major pages
 */
export function OrganizationSchema({ name, url, logo, description, sameAs }: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    ...(logo && { "logo": logo }),
    ...(description && { "description": description }),
    ...(sameAs && { "sameAs": sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Breadcrumb Schema
 * Use on all internal pages for navigation hierarchy
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item) => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Article/BlogPosting Schema
 * Use on blog posts and reflections
 */
export function ArticleSchema({ headline, description, author, datePublished, dateModified, image, url }: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": headline,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author,
    },
    "datePublished": datePublished,
    ...(dateModified && { "dateModified": dateModified }),
    ...(image && { "image": image }),
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "soundsfair",
      "url": "https://soundsfair.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Book Schema
 * Use on book recommendation pages
 */
export function BookSchema({ name, author, isbn, bookFormat = "Paperback", description, image, url }: BookSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": name,
    "author": {
      "@type": "Person",
      "name": author,
    },
    ...(isbn && { "isbn": isbn }),
    "bookFormat": `http://schema.org/${bookFormat}Format`,
    "description": description,
    ...(image && { "image": image }),
    "url": url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Podcast Schema
 * Use on podcast pages
 */
export function PodcastSchema({ name, description, webUrl, image }: PodcastSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "name": name,
    "description": description,
    "webFeed": webUrl,
    ...(image && { "image": image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Course Schema
 * Use on educational lesson pages
 */
export function CourseSchema({ name, description, provider }: {
  name: string;
  description: string;
  provider: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider,
      "url": "https://soundsfair.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQ Schema
 * Use on FAQ page
 */
export function FAQSchema({ questions }: {
  questions: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
