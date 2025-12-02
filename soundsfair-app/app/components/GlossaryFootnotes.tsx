'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { GlossaryTerm } from '@/app/lib/markdown';

interface GlossaryFootnotesProps {
  content: string;
  glossary: GlossaryTerm[];
}

interface FootnoteMatch {
  term: string;
  definition: string;
  index: number;
}

export default function GlossaryFootnotes({ content, glossary }: GlossaryFootnotesProps) {
  const [footnotes, setFootnotes] = useState<FootnoteMatch[]>([]);

  useEffect(() => {
    // Find all glossary terms that appear in the content
    const matches: FootnoteMatch[] = [];
    const seenTerms = new Set<string>();

    // Create a mapping of lowercase terms to glossary entries for case-insensitive matching
    const termMap = new Map<string, GlossaryTerm>();
    glossary.forEach(entry => {
      termMap.set(entry.term.toLowerCase(), entry);
    });

    // Sort terms by length (longest first) to match multi-word terms before single words
    const sortedTerms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);

    // Search for each term in the content
    sortedTerms.forEach(termKey => {
      const glossaryEntry = termMap.get(termKey)!;
      const term = glossaryEntry.term;

      // Create a regex to find whole word matches (case-insensitive)
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');

      if (regex.test(content) && !seenTerms.has(term.toLowerCase())) {
        seenTerms.add(term.toLowerCase());

        // Strip HTML tags from definition for footnote display
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = glossaryEntry.definition;
        const plainDefinition = tempDiv.textContent || tempDiv.innerText || '';

        matches.push({
          term: term,
          definition: plainDefinition.substring(0, 200) + (plainDefinition.length > 200 ? '...' : ''),
          index: matches.length + 1
        });
      }
    });

    setFootnotes(matches);
  }, [content, glossary]);

  if (footnotes.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t-2 border-brand-gold/30">
      <h3 className="text-2xl font-bold text-brand-gold mb-6 flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Glossary References
      </h3>
      <p className="text-text-tertiary text-sm mb-4">
        The following terms from this content are explained in our Bitcoin glossary:
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {footnotes.map((footnote) => (
          <div
            key={footnote.index}
            className="p-4 bg-surface-charcoal border border-border-default rounded-lg hover:border-brand-gold/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold text-sm font-bold">
                {footnote.index}
              </span>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/glossary#${footnote.term}`}
                  className="font-semibold text-brand-gold hover:underline inline-flex items-center gap-1"
                >
                  {footnote.term}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
                <p className="text-text-tertiary text-sm mt-1 line-clamp-3">
                  {footnote.definition}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/glossary"
          className="inline-flex items-center gap-2 text-brand-gold hover:underline text-sm font-semibold"
        >
          View Complete Glossary
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
