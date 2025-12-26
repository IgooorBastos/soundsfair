import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { autolinkContent } from './autolink';

const contentDirectory = path.join(process.cwd(), 'content');

export interface LessonMetadata {
  title: string;
  level: number;
  duration: string;
  difficulty: string;
  prerequisites: string;
  slug: string;
}

export interface Lesson {
  metadata: LessonMetadata;
  content: string;
  htmlContent: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
}

export interface FAQ {
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  category: string;
}

/**
 * Get all lesson slugs
 */
export function getAllLessonSlugs(): string[] {
  const lessonsDir = path.join(contentDirectory, 'lessons');
  const filenames = fs.readdirSync(lessonsDir);

  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => filename.replace(/\.md$/, ''));
}

/**
 * Get lesson by slug
 */
export async function getLessonBySlug(slug: string): Promise<Lesson> {
  const fullPath = path.join(contentDirectory, 'lessons', `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Lesson not found: ${slug}`);
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { content } = matter(fileContents);

  // Extract metadata from content
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : slug;

  const durationMatch = content.match(/\*\*Duration:\*\*\s+(.+)/);
  const duration = durationMatch ? durationMatch[1] : 'Unknown';

  const difficultyMatch = content.match(/\*\*Difficulty:\*\*\s+(.+)/);
  const difficulty = difficultyMatch ? difficultyMatch[1] : 'Intermediate';

  const prerequisitesMatch = content.match(/\*\*Prerequisites:\*\*\s+(.+)/);
  const prerequisites = prerequisitesMatch ? prerequisitesMatch[1] : 'None';

  const levelMatch = slug.match(/level-(\d+)/);
  const level = levelMatch ? parseInt(levelMatch[1]) : 1;

  // Process markdown to HTML
  const processedContent = await remark()
    .use(gfm)
    // Always sanitize markdown-generated HTML to avoid XSS via content files.
    .use(html, { sanitize: true })
    .process(content);

  let htmlContent = processedContent.toString();

  // Apply auto-linking to create contextual links to glossary and FAQ
  htmlContent = autolinkContent(htmlContent);

  return {
    metadata: {
      title,
      level,
      duration,
      difficulty,
      prerequisites,
      slug,
    },
    content,
    htmlContent,
  };
}

/**
 * Get all lessons with metadata
 */
export async function getAllLessons(): Promise<Lesson[]> {
  const slugs = getAllLessonSlugs();
  const lessons = await Promise.all(
    slugs.map(slug => getLessonBySlug(slug))
  );

  return lessons.sort((a, b) => a.metadata.level - b.metadata.level);
}

/**
 * Parse quiz questions from lesson content
 */
export function parseQuizFromContent(content: string): Array<{
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}> {
  // Look for "# Level X Quiz" section
  const quizMatch = content.match(/#\s+Level\s+\d+\s+Quiz\s*\n([\s\S]+)/i);
  if (!quizMatch) return [];

  const quizSection = quizMatch[1];

  const questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }> = [];

  // Regex to match quiz questions
  // Format: ### Question N\nQuestion text?\n\nA) ...\nB) ...\nC) ...\nD) ...\n\n**Correct Answer:** X\n\n**Explanation:** ...\n\n---
  const questionRegex = /###\s+Question\s+(\d+)\n(.+?)\n\n([A-D]\).+?\n[A-D]\).+?\n[A-D]\).+?\n[A-D]\).+?)\n\n\*\*Correct Answer:\*\*\s+([A-D])\n\n\*\*Explanation:\*\*\s+(.+?)(?=\n\n---)/gms;

  let match;
  while ((match = questionRegex.exec(quizSection)) !== null) {
    const [, , questionText, optionsText, correctAnswer, explanation] = match;

    const options = optionsText
      .trim()
      .split('\n')
      .map(line => line.replace(/^[A-D]\)\s*/, '').trim())
      .filter(opt => opt.length > 0);

    questions.push({
      question: questionText.trim(),
      options,
      correctAnswer,
      explanation: explanation.trim(),
    });
  }

  return questions;
}

/**
 * Get glossary terms
 */
export async function getGlossary(): Promise<GlossaryTerm[]> {
  const glossaryPath = path.join(contentDirectory, 'glossary', 'bitcoin-glossary.md');
  const fileContents = fs.readFileSync(glossaryPath, 'utf8');

  const terms: GlossaryTerm[] = [];

  // Parse glossary - each term starts with ### Term Name
  const termRegex = /###\s+(.+?)\n(.+?)(?=\n###|\n##|$)/gs;

  let match;
  while ((match = termRegex.exec(fileContents)) !== null) {
    const [, term, definition] = match;

    // Extract related terms
    const relatedMatch = definition.match(/\*\*Related terms:\*\*\s+(.+)/);
    const relatedTerms = relatedMatch
      ? relatedMatch[1].split(',').map(t => t.trim())
      : [];

    // Remove the "Related terms" line from definition before converting to HTML
    const cleanDefinition = definition
      .replace(/\*\*Related terms:\*\*\s+.+/, '')
      .replace(/\*\*Compare to:\*\*\s+.+/, '') // Also remove "Compare to" lines
      .trim();

    // Convert markdown to HTML for definition
    const processedDefinition = await remark()
      .use(gfm)
      .use(html, { sanitize: true })
      .process(cleanDefinition);

    terms.push({
      term: term.trim(),
      definition: String(processedDefinition),
      relatedTerms,
    });
  }

  return terms;
}

/**
 * Get FAQs
 */
export async function getFAQs(): Promise<FAQ[]> {
  const faqPath = path.join(contentDirectory, 'faq', 'bitcoin-faq.md');
  const fileContents = fs.readFileSync(faqPath, 'utf8');

  const faqs: FAQ[] = [];

  // Parse FAQs - each question starts with ### number.
  // Modified to capture any content after "Short answer:" until the next FAQ or section
  const faqRegex = /###\s+(\d+)\.\s+(.+?)\n\n\*\*Short answer:\*\*\s+(.+?)\n\n(.+?)(?=\n\n###|\n\n##|$)/gs;

  let match;
  let currentCategory = 'General';

  while ((match = faqRegex.exec(fileContents)) !== null) {
    const [, number, question, shortAnswer, detailedAnswer] = match;

    // Determine category based on position in file
    const questionIndex = parseInt(number);
    if (questionIndex <= 4) currentCategory = 'Getting Started';
    else if (questionIndex <= 7) currentCategory = 'Understanding Bitcoin';
    else if (questionIndex <= 10) currentCategory = 'Using Bitcoin';
    else if (questionIndex <= 12) currentCategory = 'Technical Questions';
    else if (questionIndex <= 14) currentCategory = 'Security & Privacy';
    else if (questionIndex <= 16) currentCategory = 'Economics & Investment';
    else if (questionIndex <= 18) currentCategory = 'Philosophical & Social';
    else currentCategory = 'Miscellaneous';

    // Convert markdown to HTML for detailed answer
    const processedDetailedAnswer = await remark()
      .use(gfm)
      .use(html, { sanitize: true })
      .process(detailedAnswer.trim());

    faqs.push({
      question: question.trim(),
      shortAnswer: shortAnswer.trim(),
      detailedAnswer: String(processedDetailedAnswer),
      category: currentCategory,
    });
  }

  return faqs;
}

/**
 * Search content across lessons, glossary, and FAQs
 */
export async function searchContent(query: string): Promise<{
  lessons: Lesson[];
  glossaryTerms: GlossaryTerm[];
  faqs: FAQ[];
}> {
  const lowerQuery = query.toLowerCase();

  const allLessons = await getAllLessons();
  const glossary = await getGlossary();
  const faqs = await getFAQs();

  const matchingLessons = allLessons.filter(lesson =>
    lesson.metadata.title.toLowerCase().includes(lowerQuery) ||
    lesson.content.toLowerCase().includes(lowerQuery)
  );

  const matchingGlossaryTerms = glossary.filter(term =>
    term.term.toLowerCase().includes(lowerQuery) ||
    term.definition.toLowerCase().includes(lowerQuery)
  );

  const matchingFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(lowerQuery) ||
    faq.shortAnswer.toLowerCase().includes(lowerQuery) ||
    faq.detailedAnswer.toLowerCase().includes(lowerQuery)
  );

  return {
    lessons: matchingLessons,
    glossaryTerms: matchingGlossaryTerms,
    faqs: matchingFAQs,
  };
}
