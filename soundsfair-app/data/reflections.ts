/**
 * Blog Posts / Reflections Database
 *
 * EDIT THIS FILE to add your blog posts and reflections.
 * These are example posts to show the structure.
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string; // Optional: can link to external post or markdown file
  author: string;
  publishDate: string; // ISO date
  category: 'philosophy' | 'economics' | 'technical' | 'family' | 'freedom' | 'news';
  tags: string[];
  readTime: number; // minutes
  featuredImage?: string;
  externalUrl?: string; // Link to Substack or external blog
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'why-bitcoin-saves-families',
    title: 'Why Bitcoin Saves Families',
    slug: 'why-bitcoin-saves-families',
    excerpt: 'Bitcoin isn\'t just an investment - it\'s a lifeboat for families drowning in fiat inflation. Here\'s how sound money protects the people you love.',
    author: 'soundsfair Team',
    publishDate: '2025-01-15',
    category: 'family',
    tags: ['Family', 'Savings', 'Inflation', 'Sound Money'],
    readTime: 8,
    featuredImage: '/images/reflections/family-savings.jpg',
    featured: true,
    content: `
# Why Bitcoin Saves Families

For most of human history, saving money meant building security for your family. A father could work hard, save his earnings in gold or silver, and know that his children would inherit real value.

That changed with fiat money.

## The Fiat Trap

Today, saving in dollars, euros, or reais means watching your purchasing power slowly disappear. Inflation isn't just a number - it's the silent thief stealing your family's future.

### Real Example: Venezuela

In Venezuela, families who saved in bolivars for decades saw their life savings become worthless in just a few years. Parents who worked their entire lives couldn't afford bread.

The ones who survived? They held Bitcoin.

## Bitcoin as Family Insurance

Bitcoin isn't perfect, but it offers something fiat can't: **a guarantee that no government can print more**.

### What This Means for Your Family

- **Fixed Supply:** Only 21 million Bitcoin will ever exist
- **No Dilution:** Your savings can't be inflated away
- **Global Access:** Your family can access it anywhere
- **Inheritance:** Pass it down across generations

## Getting Started

You don't need to buy a whole Bitcoin. Start with what you can afford:

1. **Learn first:** Understand what you're buying (use our lessons)
2. **Start small:** $10/week adds up over time
3. **Self-custody:** Learn to hold your own keys
4. **Think long-term:** 5+ year minimum time horizon

## Conclusion

Bitcoin won't make you rich overnight. But it gives your family something invaluable: **opt-out from a system designed to steal from savers**.

In a world of infinite money printing, that's priceless.

*This is educational content, not financial advice. Do your own research.*
    `
  },
  {
    id: 'fiat-endgame-2025',
    title: 'The Fiat Endgame: What 2025 Looks Like',
    slug: 'fiat-endgame-2025',
    excerpt: 'Central banks are trapped. Debt is unsustainable. Here\'s how the fiat system unravels and why Bitcoin becomes inevitable.',
    author: 'soundsfair Team',
    publishDate: '2025-01-10',
    category: 'economics',
    tags: ['Fiat', 'Central Banks', 'Debt', 'Macroeconomics'],
    readTime: 12,
    featuredImage: '/images/reflections/fiat-endgame.jpg',
    featured: true,
  },
  {
    id: 'bitcoin-is-freedom',
    title: 'Bitcoin is Freedom',
    slug: 'bitcoin-is-freedom',
    excerpt: 'Why Bitcoin represents the most powerful tool for individual sovereignty and freedom in the 21st century.',
    author: 'soundsfair Team',
    publishDate: '2025-01-05',
    category: 'freedom',
    tags: ['Freedom', 'Sovereignty', 'Liberty', 'Individual Rights'],
    readTime: 10,
    featuredImage: '/images/reflections/bitcoin-freedom.jpg',
    featured: false,
  },
  {
    id: 'understanding-time-preference',
    title: 'Understanding Time Preference',
    slug: 'understanding-time-preference',
    excerpt: 'How sound money lowers time preference and enables civilizational progress. Why fiat does the opposite.',
    author: 'soundsfair Team',
    publishDate: '2024-12-20',
    category: 'philosophy',
    tags: ['Austrian Economics', 'Time Preference', 'Civilization'],
    readTime: 15,
  },
  {
    id: 'lightning-network-explained',
    title: 'Lightning Network: Bitcoin\'s Payment Layer',
    slug: 'lightning-network-explained',
    excerpt: 'A non-technical explanation of how Lightning Network enables instant, cheap Bitcoin payments at global scale.',
    author: 'soundsfair Team',
    publishDate: '2024-12-15',
    category: 'technical',
    tags: ['Lightning Network', 'Payments', 'Scaling', 'Technology'],
    readTime: 12,
  },
  {
    id: 'teaching-kids-bitcoin',
    title: 'Teaching Kids About Bitcoin',
    slug: 'teaching-kids-bitcoin',
    excerpt: 'How to explain Bitcoin to children and why early financial education matters more than ever.',
    author: 'soundsfair Team',
    publishDate: '2024-12-10',
    category: 'family',
    tags: ['Education', 'Family', 'Kids', 'Financial Literacy'],
    readTime: 8,
  }
];

// Helper functions
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return blogPosts.filter(post => post.category === category).sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured === true).sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export function getRecentPosts(limit: number = 6): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, limit);
}

export const categories = [
  { id: 'philosophy', name: 'Philosophy', color: 'text-brand-gold' },
  { id: 'economics', name: 'Economics', color: 'text-brand-orange' },
  { id: 'technical', name: 'Technical', color: 'text-semantic-lightning' },
  { id: 'family', name: 'Family & Finance', color: 'text-semantic-success' },
  { id: 'freedom', name: 'Freedom', color: 'text-vi-blue' },
  { id: 'news', name: 'News & Analysis', color: 'text-text-tertiary' },
];
