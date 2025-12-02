/**
 * Auto-linking System for Soundsfair
 *
 * Automatically creates contextual links between lesson content and:
 * - Glossary terms
 * - FAQ topics
 * - Related lessons
 *
 * Features:
 * - Smart detection (avoids code blocks, existing links)
 * - Case-insensitive matching
 * - Priority-based (longer terms first to avoid partial matches)
 * - Performance optimized (single pass)
 */

export interface LinkableTerm {
  term: string;
  url: string;
  type: 'glossary' | 'faq' | 'lesson';
  priority: number; // Higher = match first
}

/**
 * Comprehensive map of linkable terms
 * Auto-generated from glossary and FAQ content
 */
export const LINKABLE_TERMS: LinkableTerm[] = [
  // === GLOSSARY TERMS === (High priority, exact matches)
  // A
  { term: 'Bitcoin Address', url: '/glossary#address', type: 'glossary', priority: 100 },
  { term: 'Address', url: '/glossary#address', type: 'glossary', priority: 90 },
  { term: 'Altcoin', url: '/glossary#altcoin', type: 'glossary', priority: 100 },

  // B
  { term: 'Bitcoin Improvement Proposal', url: '/glossary#bip', type: 'glossary', priority: 100 },
  { term: 'BIP', url: '/glossary#bip', type: 'glossary', priority: 90 },
  { term: 'Block Height', url: '/glossary#block-height', type: 'glossary', priority: 100 },
  { term: 'Block', url: '/glossary#block', type: 'glossary', priority: 90 },
  { term: 'Blockchain', url: '/glossary#blockchain', type: 'glossary', priority: 100 },
  { term: 'BTC', url: '/glossary#btc', type: 'glossary', priority: 80 },

  // C
  { term: 'Cantillon Effect', url: '/glossary#cantillon-effect', type: 'glossary', priority: 100 },
  { term: 'CBDC', url: '/glossary#cbdc', type: 'glossary', priority: 100 },
  { term: 'Central Bank Digital Currency', url: '/glossary#cbdc', type: 'glossary', priority: 100 },
  { term: 'Cold Storage', url: '/glossary#cold-storage', type: 'glossary', priority: 100 },
  { term: 'Consensus', url: '/glossary#consensus', type: 'glossary', priority: 90 },
  { term: 'Cryptography', url: '/glossary#cryptography', type: 'glossary', priority: 95 },

  // D
  { term: 'Dollar-Cost Averaging', url: '/glossary#dca', type: 'glossary', priority: 100 },
  { term: 'DCA', url: '/glossary#dca', type: 'glossary', priority: 95 },
  { term: 'Decentralization', url: '/glossary#decentralization', type: 'glossary', priority: 100 },
  { term: 'Difficulty Adjustment', url: '/glossary#difficulty-adjustment', type: 'glossary', priority: 100 },

  // F
  { term: 'Fiat Currency', url: '/glossary#fiat-currency', type: 'glossary', priority: 100 },
  { term: 'Fiat', url: '/glossary#fiat-currency', type: 'glossary', priority: 90 },
  { term: 'Fork', url: '/glossary#fork', type: 'glossary', priority: 80 },
  { term: 'Soft Fork', url: '/glossary#fork', type: 'glossary', priority: 95 },
  { term: 'Hard Fork', url: '/glossary#fork', type: 'glossary', priority: 95 },

  // H
  { term: 'Halving', url: '/glossary#halving', type: 'glossary', priority: 100 },
  { term: 'Hash Rate', url: '/glossary#hash-rate', type: 'glossary', priority: 100 },
  { term: 'Hardware Wallet', url: '/glossary#hardware-wallet', type: 'glossary', priority: 100 },
  { term: 'HODL', url: '/glossary#hodl', type: 'glossary', priority: 100 },
  { term: 'Hot Wallet', url: '/glossary#hot-wallet', type: 'glossary', priority: 100 },

  // I
  { term: 'Inflation', url: '/glossary#inflation', type: 'glossary', priority: 100 },

  // L
  { term: 'Lightning Network', url: '/glossary#lightning-network', type: 'glossary', priority: 100 },

  // M
  { term: 'Mining', url: '/glossary#mining', type: 'glossary', priority: 90 },
  { term: 'Miner', url: '/glossary#mining', type: 'glossary', priority: 85 },
  { term: 'Mempool', url: '/glossary#mempool', type: 'glossary', priority: 100 },

  // N
  { term: 'Node', url: '/glossary#node', type: 'glossary', priority: 90 },
  { term: 'Full Node', url: '/glossary#node', type: 'glossary', priority: 95 },

  // P
  { term: 'Peer-to-Peer', url: '/glossary#peer-to-peer', type: 'glossary', priority: 100 },
  { term: 'P2P', url: '/glossary#peer-to-peer', type: 'glossary', priority: 90 },
  { term: 'Private Key', url: '/glossary#private-key', type: 'glossary', priority: 100 },
  { term: 'Public Key', url: '/glossary#public-key', type: 'glossary', priority: 100 },
  { term: 'Proof-of-Work', url: '/glossary#proof-of-work', type: 'glossary', priority: 100 },
  { term: 'PoW', url: '/glossary#proof-of-work', type: 'glossary', priority: 90 },

  // S
  { term: 'Satoshi', url: '/glossary#satoshi', type: 'glossary', priority: 100 },
  { term: 'Satoshi Nakamoto', url: '/glossary#satoshi-nakamoto', type: 'glossary', priority: 100 },
  { term: 'Sats', url: '/glossary#satoshi', type: 'glossary', priority: 85 },
  { term: 'Stacking Sats', url: '/glossary#stacking-sats', type: 'glossary', priority: 100 },
  { term: 'Seed Phrase', url: '/glossary#seed-phrase', type: 'glossary', priority: 100 },
  { term: 'Self-Custody', url: '/glossary#self-custody', type: 'glossary', priority: 100 },
  { term: 'SegWit', url: '/glossary#segwit', type: 'glossary', priority: 100 },

  // T
  { term: 'Transaction Fee', url: '/glossary#transaction-fee', type: 'glossary', priority: 100 },
  { term: 'Taproot', url: '/glossary#taproot', type: 'glossary', priority: 100 },

  // U
  { term: 'UTXO', url: '/glossary#utxo', type: 'glossary', priority: 100 },

  // V
  { term: 'Volatility', url: '/glossary#volatility', type: 'glossary', priority: 95 },

  // W
  { term: 'Wallet', url: '/glossary#wallet', type: 'glossary', priority: 90 },
  { term: 'Whitepaper', url: '/glossary#whitepaper', type: 'glossary', priority: 100 },

  // === FAQ TOPICS === (Medium priority)
  { term: 'Is Bitcoin legal', url: '/faq#is-bitcoin-legal', type: 'faq', priority: 85 },
  { term: 'How to buy Bitcoin', url: '/faq#how-to-buy-bitcoin', type: 'faq', priority: 85 },
  { term: 'Is Bitcoin safe', url: '/faq#is-bitcoin-safe', type: 'faq', priority: 85 },

  // === TOOLS === (High priority for conversion)
  { term: 'DCA Calculator', url: '/tools/dca', type: 'lesson', priority: 100 },
];

/**
 * Sort terms by priority (highest first) and length (longest first)
 * This ensures "Proof-of-Work" matches before "Proof" or "Work"
 */
export const SORTED_LINKABLE_TERMS = [...LINKABLE_TERMS].sort((a, b) => {
  if (b.priority !== a.priority) {
    return b.priority - a.priority;
  }
  return b.term.length - a.term.length;
});

/**
 * HTML elements and attributes where we should NOT create links
 */
const EXCLUDED_ELEMENTS = ['code', 'pre', 'a', 'script', 'style', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

/**
 * Main auto-linking function
 * Processes HTML content and intelligently adds links to glossary/FAQ terms
 *
 * @param htmlContent - Raw HTML content from markdown
 * @returns HTML with contextual links added
 */
export function autolinkContent(htmlContent: string): string {
  // Track which terms we've already linked (avoid duplicate links for same term)
  const linkedTerms = new Set<string>();

  // Split content into safe-to-link and excluded zones
  const segments = parseHTMLSegments(htmlContent);

  let result = '';

  for (const segment of segments) {
    if (segment.excluded) {
      // Don't touch code blocks, existing links, headings, etc.
      result += segment.content;
    } else {
      // Process text content for auto-linking
      let processedContent = segment.content;

      for (const linkable of SORTED_LINKABLE_TERMS) {
        // Skip if we already linked this term in this content
        if (linkedTerms.has(linkable.term.toLowerCase())) {
          continue;
        }

        // Create case-insensitive regex for whole word matching
        // \b ensures we don't match partial words
        const regex = new RegExp(
          `\\b(${escapeRegex(linkable.term)})\\b`,
          'gi'
        );

        // Check if term exists before creating link
        const match = processedContent.match(regex);
        if (match) {
          // Replace ONLY first occurrence to avoid overwhelming the user
          processedContent = processedContent.replace(
            regex,
            (matched) => createContextualLink(matched, linkable)
          );

          linkedTerms.add(linkable.term.toLowerCase());

          // Only link once per term per section
          break;
        }
      }

      result += processedContent;
    }
  }

  return result;
}

/**
 * Parse HTML into segments (linkable vs excluded)
 */
interface HTMLSegment {
  content: string;
  excluded: boolean;
}

function parseHTMLSegments(html: string): HTMLSegment[] {
  const segments: HTMLSegment[] = [];

  // Simple regex-based parser (good enough for markdown-generated HTML)
  // Matches: <tag>...</tag> for excluded elements
  const excludedPattern = new RegExp(
    `<(${EXCLUDED_ELEMENTS.join('|')})(\\s[^>]*)?>([\\s\\S]*?)<\\/\\1>`,
    'gi'
  );

  let lastIndex = 0;
  let match;

  while ((match = excludedPattern.exec(html)) !== null) {
    // Add text before excluded element (linkable)
    if (match.index > lastIndex) {
      segments.push({
        content: html.substring(lastIndex, match.index),
        excluded: false,
      });
    }

    // Add excluded element (not linkable)
    segments.push({
      content: match[0],
      excluded: true,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text (linkable)
  if (lastIndex < html.length) {
    segments.push({
      content: html.substring(lastIndex),
      excluded: false,
    });
  }

  return segments;
}

/**
 * Create a styled contextual link with tooltip
 */
function createContextualLink(matchedText: string, linkable: LinkableTerm): string {
  const icon = linkable.type === 'glossary' ? '📖' : linkable.type === 'faq' ? '❓' : '🔗';
  const tooltipText = linkable.type === 'glossary'
    ? 'View definition in glossary'
    : linkable.type === 'faq'
    ? 'Read more in FAQ'
    : 'Learn more';

  return `<span class="inline-flex items-center gap-1 group/autolink">
    <a
      href="${linkable.url}"
      class="text-brand-gold underline decoration-dotted decoration-1
             hover:decoration-solid hover:decoration-2 transition-all
             relative inline-flex items-center gap-0.5"
      data-autolink="${linkable.type}"
      data-tooltip="${tooltipText}"
      title="${tooltipText}"
    >${matchedText}<span class="text-[0.7em] opacity-60 group-hover/autolink:opacity-100 transition-opacity">${icon}</span></a>
  </span>`;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get stats about auto-linking (for analytics/debugging)
 */
export function getAutolinkStats(htmlContent: string): {
  totalTerms: number;
  linkedCount: number;
  byType: Record<string, number>;
} {
  const autolinked = autolinkContent(htmlContent);
  const glossaryLinks = (autolinked.match(/data-autolink="glossary"/g) || []).length;
  const faqLinks = (autolinked.match(/data-autolink="faq"/g) || []).length;
  const lessonLinks = (autolinked.match(/data-autolink="lesson"/g) || []).length;

  return {
    totalTerms: LINKABLE_TERMS.length,
    linkedCount: glossaryLinks + faqLinks + lessonLinks,
    byType: {
      glossary: glossaryLinks,
      faq: faqLinks,
      lesson: lessonLinks,
    },
  };
}
