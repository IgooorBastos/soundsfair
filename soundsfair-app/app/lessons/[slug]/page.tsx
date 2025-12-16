import { getLessonBySlug, getAllLessonSlugs, parseQuizFromContent, getGlossary } from '@/lib/markdown';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuizComponent from '@/components/ui/Quiz';
import LessonNavigationClient from '@/components/lesson/LessonNavigationClient';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';
import GlossaryFootnotes from '@/components/ui/GlossaryFootnotes';
import LessonCharts from '@/components/lesson/LessonCharts';

function resolveCanonicalLessonSlug(slug: string): string {
  // Back-compat: support old URLs like `/lessons/level-2` by mapping to `level-2-*`.
  const levelOnlyMatch = slug.match(/^level-(\d+)$/);
  if (!levelOnlyMatch) return slug;

  const allSlugs = getAllLessonSlugs();
  const candidate = allSlugs.find((s) => s.startsWith(`${slug}-`));
  return candidate || slug;
}

export async function generateStaticParams() {
  const slugs = getAllLessonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canonicalSlug = resolveCanonicalLessonSlug(slug);
  try {
    const lesson = await getLessonBySlug(canonicalSlug);
    const description = `Level ${lesson.metadata.level}: ${lesson.metadata.title} - ${lesson.metadata.duration} Bitcoin education lesson. ${lesson.metadata.difficulty} difficulty.`;

    return {
      title: `${lesson.metadata.title} - Level ${lesson.metadata.level} | soundsfair Bitcoin Course`,
      description,
      keywords: ['Bitcoin', lesson.metadata.title, 'Bitcoin education', 'cryptocurrency course', 'economic freedom', 'sound money'],
      openGraph: {
        title: `${lesson.metadata.title} - Level ${lesson.metadata.level}`,
        description,
        url: `/lessons/${canonicalSlug}`,
        siteName: 'soundsfair',
        images: [{
          url: '/og-lessons.png',
          width: 1200,
          height: 630,
          alt: `soundsfair - ${lesson.metadata.title}`
        }],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${lesson.metadata.title} - Level ${lesson.metadata.level}`,
        description,
        images: ['/og-lessons.png'],
      },
    };
  } catch {
    return {
      title: 'Lesson | soundsfair',
      description: 'Bitcoin education lesson',
    };
  }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canonicalSlug = resolveCanonicalLessonSlug(slug);
  if (canonicalSlug !== slug) {
    redirect(`/lessons/${canonicalSlug}`);
  }

  let lesson;
  try {
    lesson = await getLessonBySlug(canonicalSlug);
  } catch (error) {
    notFound();
  }

  const quizQuestions = parseQuizFromContent(lesson.content);
  const glossary = await getGlossary();

  // Extract estimated reading time (in minutes)
  const durationMatch = lesson.metadata.duration.match(/(\d+)/);
  const estimatedMinutes = durationMatch ? parseInt(durationMatch[1]) : 30;

  // Schema.org Course structured data
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": lesson.metadata.title,
    "description": `Level ${lesson.metadata.level}: ${lesson.metadata.title} - ${lesson.metadata.duration} Bitcoin education lesson`,
    "provider": {
      "@type": "Organization",
      "name": "soundsfair",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://soundsfair.com"
    },
    "educationalLevel": `Level ${lesson.metadata.level}`,
    "coursePrerequisites": lesson.metadata.prerequisites !== 'None' ? lesson.metadata.prerequisites : undefined,
    "timeRequired": lesson.metadata.duration,
    "inLanguage": "en",
    "isAccessibleForFree": true,
  };

  return (
    <div className="min-h-screen bg-surface-black">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      <Header />

      {/* Reading Progress Bar */}
      <ReadingProgressBar
        lessonSlug={slug}
        lessonLevel={lesson.metadata.level}
        estimatedMinutes={estimatedMinutes}
      />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-sm font-semibold">
              Level {lesson.metadata.level}
            </span>
            <span className="text-text-tertiary">{lesson.metadata.duration}</span>
            <span className="px-3 py-1 bg-surface-charcoal text-text-secondary rounded-full text-sm">
              {lesson.metadata.difficulty}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {lesson.metadata.title}
          </h1>

          {lesson.metadata.prerequisites !== 'None' && (
            <p className="text-text-tertiary">
              <span className="font-semibold">Prerequisites:</span> {lesson.metadata.prerequisites}
            </p>
          )}
        </div>

        {/* Lesson Content */}
        <article
          className="prose prose-invert prose-lg max-w-none mb-12
                     prose-headings:text-text-primary
                     prose-p:text-text-secondary prose-p:leading-relaxed
                     prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-text-primary prose-strong:font-semibold
                     prose-code:text-brand-gold prose-code:bg-surface-charcoal prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                     prose-pre:bg-surface-charcoal prose-pre:border prose-pre:border-border-default
                     prose-blockquote:border-l-4 prose-blockquote:border-brand-gold prose-blockquote:bg-surface-charcoal prose-blockquote:py-4 prose-blockquote:px-6
                     prose-ul:text-text-secondary prose-ol:text-text-secondary
                     prose-li:text-text-secondary prose-li:my-2
                     prose-table:text-text-secondary
                     prose-th:text-text-primary prose-th:bg-surface-charcoal
                     prose-td:border-border-default
                     "
          dangerouslySetInnerHTML={{ __html: lesson.htmlContent }}
        />

        {/* Glossary Footnotes */}
        <GlossaryFootnotes content={lesson.content} glossary={glossary} />

        {/* Interactive Charts Section - Levels 1, 3, 5 */}
        {(lesson.metadata.level === 1 || lesson.metadata.level === 3 || lesson.metadata.level === 5) && (
          <LessonCharts level={lesson.metadata.level} />
        )}

        {/* Quiz Section */}
        {quizQuestions.length > 0 && (
          <div className="mt-16" data-quiz-section>
            <QuizComponent questions={quizQuestions} lessonSlug={slug} lessonLevel={lesson.metadata.level} />
          </div>
        )}

        {/* Lesson Navigation */}
        <LessonNavigationClient currentLevel={lesson.metadata.level} />
      </main>

      <Footer />
    </div>
  );
}
