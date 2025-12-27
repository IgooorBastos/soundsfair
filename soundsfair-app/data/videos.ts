/**
 * Video Library Database
 *
 * EDIT THIS FILE to add your curated YouTube Bitcoin videos.
 * These are example videos to show the structure.
 */

export interface Video {
  id: string;
  title: string;
  creator: string;
  youtubeId: string; // YouTube video ID (from URL)
  category: 'beginner' | 'intermediate' | 'advanced' | 'documentary' | 'debate' | 'interview';
  topics: string[];
  duration: string; // e.g., "45:30"
  publishDate: string; // ISO date or "YYYY-MM-DD"
  description: string;
  curatorNotes: string; // Your personal commentary/why it's valuable
  keyTakeaways: string[];
  featured?: boolean;
}

export const videos: Video[] = [
  {
    id: 'bitcoin-explained-intro',
    title: 'Bitcoin Explained - 3Blue1Brown',
    creator: '3Blue1Brown',
    youtubeId: 'bBC-nXj3Ng4',
    category: 'beginner',
    topics: ['Bitcoin Basics', 'Cryptography', 'Blockchain'],
    duration: '26:21',
    publishDate: '2017-07-07',
    description: 'Mathematical and visual explanation of how Bitcoin works, covering cryptographic signatures, proof-of-work, and the blockchain.',
    curatorNotes: 'Best technical introduction for visual learners. 3Blue1Brown\'s animations make complex cryptography concepts crystal clear. Perfect first video for anyone who wants to understand HOW Bitcoin works at a fundamental level.',
    keyTakeaways: [
      'How digital signatures prevent forgery',
      'Why proof-of-work secures the network',
      'How the blockchain prevents double-spending',
    ],
    featured: true,
  },
  {
    id: 'hidden-secrets-money',
    title: 'Hidden Secrets of Money - Episode 1',
    creator: 'Mike Maloney',
    youtubeId: 'DyV0OfU3-FU',
    category: 'beginner',
    topics: ['Money History', 'Gold Standard', 'Fiat Currency'],
    duration: '29:52',
    publishDate: '2013-09-16',
    description: 'First episode of the classic series exploring the history of money, gold, and the transition to fiat currency.',
    curatorNotes: 'Essential viewing for understanding WHY Bitcoin matters. Mike Maloney lays the foundation by explaining how money evolved and why fiat is fundamentally broken. Watch the entire series.',
    keyTakeaways: [
      'The difference between currency and money',
      'How gold became money throughout history',
      'Why fiat currencies always fail',
    ],
    featured: true,
  },
  {
    id: 'bitcoin-standard-saifedean',
    title: 'The Bitcoin Standard - Author Interview',
    creator: 'London Real',
    youtubeId: 'Zbm772vF-5M',
    category: 'intermediate',
    topics: ['Austrian Economics', 'Sound Money', 'Time Preference'],
    duration: '1:38:42',
    publishDate: '2018-03-21',
    description: 'Saifedean Ammous explains the core thesis of The Bitcoin Standard and why Bitcoin is the hardest money ever created.',
    curatorNotes: 'Long-form deep dive into Austrian economics and Bitcoin\'s role as sound money. Saifedean is brilliant at connecting economic theory to practical Bitcoin implications. Best watched after reading at least part of his book.',
    keyTakeaways: [
      'What makes money "hard" vs "soft"',
      'How Bitcoin\'s fixed supply changes everything',
      'Time preference and its impact on civilization',
    ],
  },
  {
    id: 'michael-saylor-interview',
    title: 'Michael Saylor - Bitcoin Masterclass',
    creator: 'What Bitcoin Did',
    youtubeId: 'mC43pZkpTec',
    category: 'advanced',
    topics: ['Bitcoin Strategy', 'Corporate Treasury', 'Macro'],
    duration: '2:14:35',
    publishDate: '2021-02-15',
    description: 'Michael Saylor explains MicroStrategy\'s Bitcoin strategy and why Bitcoin is the apex property of the human race.',
    curatorNotes: 'Saylor\'s most comprehensive explanation of Bitcoin as property, not currency. His macro analysis is unmatched. Long but essential for understanding Bitcoin from an institutional and philosophical perspective.',
    keyTakeaways: [
      'Bitcoin as digital property, not digital currency',
      'Why every corporation should hold Bitcoin',
      'Monetary energy and the physics of money',
    ],
  },
  {
    id: 'bitcoin-documentary-2021',
    title: 'Bitcoin: Beyond the Bubble',
    creator: 'Barely Sociable',
    youtubeId: '3wAB9eJM0iE',
    category: 'documentary',
    topics: ['Bitcoin History', 'Satoshi Nakamoto', 'Cypherpunks'],
    duration: '1:14:27',
    publishDate: '2021-01-29',
    description: 'Documentary exploring Bitcoin\'s origins, the cypherpunk movement, and Satoshi Nakamoto\'s vision.',
    curatorNotes: 'Excellent production quality and storytelling. Covers the ideological roots of Bitcoin that often get overlooked. Great for understanding Bitcoin\'s "why" beyond just the technology.',
    keyTakeaways: [
      'Who were the cypherpunks and their influence',
      'Satoshi\'s vision for peer-to-peer cash',
      'How Bitcoin emerged from decades of cryptographic research',
    ],
  },
  {
    id: 'bitcoin-fixes-this',
    title: 'Bitcoin Fixes This - Documentary',
    creator: 'Jimmy Song',
    youtubeId: '58bJ7eN6GKs',
    category: 'documentary',
    topics: ['Bitcoin Philosophy', 'Economic Freedom', 'Individual Sovereignty'],
    duration: '1:42:14',
    publishDate: '2020-07-03',
    description: 'Feature-length documentary about Bitcoin\'s potential to fix broken monetary and political systems.',
    curatorNotes: 'Jimmy Song\'s passion for Bitcoin shines through. Focuses on the human and philosophical aspects of Bitcoin adoption. Perfect for sharing with family members who ask "why Bitcoin?"',
    keyTakeaways: [
      'How Bitcoin enables individual sovereignty',
      'Why Bitcoin is hope for economic freedom',
      'Real stories of people using Bitcoin to escape tyranny',
    ],
    featured: true,
  },
  {
    id: 'debate-peter-schiff',
    title: 'Bitcoin vs Gold - Saifedean vs Peter Schiff Debate',
    creator: 'Soho Forum',
    youtubeId: 'q8R71IMDVnI',
    category: 'debate',
    topics: ['Bitcoin vs Gold', 'Store of Value', 'Austrian Economics'],
    duration: '1:23:16',
    publishDate: '2019-07-17',
    description: 'Classic debate between Bitcoin advocate Saifedean Ammous and gold bug Peter Schiff on which is superior money.',
    curatorNotes: 'Essential viewing for understanding the Bitcoin vs gold argument. Schiff represents the best case against Bitcoin, and Saifedean demolishes it systematically. Great intellectual sparring.',
    keyTakeaways: [
      'Stock-to-flow ratio comparison (Bitcoin wins)',
      'Portability and divisibility advantages of Bitcoin',
      'Why digital scarcity is real scarcity',
    ],
  },
  {
    id: 'how-to-buy-bitcoin',
    title: 'How to Buy Your First Bitcoin - Complete Guide',
    creator: 'BTC Sessions',
    youtubeId: 'VEyZ3fVc_8E',
    category: 'beginner',
    topics: ['Bitcoin Buying', 'Exchanges', 'First Steps'],
    duration: '18:42',
    publishDate: '2021-09-10',
    description: 'Step-by-step tutorial for buying Bitcoin for the first time using various exchanges and methods.',
    curatorNotes: 'BTC Sessions is the king of practical Bitcoin tutorials. This video holds your hand through the entire buying process. Send this to anyone asking "how do I actually buy Bitcoin?"',
    keyTakeaways: [
      'Choosing a reputable exchange',
      'Verification process explained',
      'First purchase best practices',
    ],
  },
  {
    id: 'self-custody-tutorial',
    title: 'Bitcoin Self-Custody - Complete Tutorial',
    creator: 'BTC Sessions',
    youtubeId: 'uO3Zi9D5b0Y',
    category: 'intermediate',
    topics: ['Self-Custody', 'Hardware Wallets', 'Security'],
    duration: '32:15',
    publishDate: '2022-03-14',
    description: 'Comprehensive guide to taking custody of your Bitcoin using hardware wallets and best security practices.',
    curatorNotes: 'Critical knowledge. "Not your keys, not your coins" explained in detail. Every Bitcoiner must watch this before storing significant value. BTC Sessions makes it approachable.',
    keyTakeaways: [
      'Why self-custody is essential',
      'Hardware wallet setup step-by-step',
      'Backup and recovery best practices',
    ],
  },
  {
    id: 'lightning-network-explained',
    title: 'Lightning Network Explained',
    creator: 'Andreas Antonopoulos',
    youtubeId: 'rrr_zPmEiME',
    category: 'advanced',
    topics: ['Lightning Network', 'Layer 2', 'Bitcoin Scaling'],
    duration: '54:28',
    publishDate: '2019-11-20',
    description: 'Andreas Antonopoulos explains how the Lightning Network enables instant, cheap Bitcoin payments at scale.',
    curatorNotes: 'Andreas is the master explainer. This is technical but accessible. Essential for understanding Bitcoin\'s scaling roadmap and why Layer 2 solutions don\'t compromise Bitcoin\'s core properties.',
    keyTakeaways: [
      'How payment channels work',
      'Why Lightning is trustless despite being off-chain',
      'Bitcoin\'s layered scaling strategy',
    ],
  },
  {
    id: 'ross-stevens-interview',
    title: 'Ross Stevens - Bitcoin as Insurance Against Tyranny',
    creator: 'What Bitcoin Did',
    youtubeId: 'l1si5ZWLgy0',
    category: 'interview',
    topics: ['Bitcoin Philosophy', 'Financial Freedom', 'Property Rights'],
    duration: '1:45:22',
    publishDate: '2021-06-08',
    description: 'NYDIG CEO Ross Stevens on Bitcoin as a hedge against authoritarianism and financial censorship.',
    curatorNotes: 'One of the most eloquent Bitcoin advocates. Stevens frames Bitcoin as insurance for individual rights. His perspective on property rights and monetary freedom is profound. Long but worth every minute.',
    keyTakeaways: [
      'Bitcoin as insurance, not just investment',
      'Property rights as foundation of freedom',
      'Why Bitcoin matters for human rights',
    ],
  },
];

// Helper functions
export function getVideoById(id: string): Video | undefined {
  return videos.find(video => video.id === id);
}

export function getVideosByCategory(category: Video['category']): Video[] {
  return videos.filter(video => video.category === category).sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export function getFeaturedVideos(): Video[] {
  return videos.filter(video => video.featured === true).sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export function getRecentVideos(limit: number = 6): Video[] {
  return [...videos]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, limit);
}

export const videoCategories = [
  { id: 'beginner', name: 'Beginner Friendly', color: 'text-semantic-success' },
  { id: 'intermediate', name: 'Intermediate', color: 'text-brand-gold' },
  { id: 'advanced', name: 'Advanced', color: 'text-brand-orange' },
  { id: 'documentary', name: 'Documentaries', color: 'text-vi-blue' },
  { id: 'debate', name: 'Debates', color: 'text-semantic-lightning' },
  { id: 'interview', name: 'Interviews', color: 'text-text-tertiary' },
];

/**
 * Helper function to get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(youtubeId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  const qualityMap = {
    default: 'default.jpg',      // 120x90
    medium: 'mqdefault.jpg',     // 320x180
    high: 'hqdefault.jpg',       // 480x360
    maxres: 'maxresdefault.jpg', // 1280x720
  };
  return `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}`;
}

/**
 * Helper function to get YouTube embed URL
 */
export function getYouTubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube.com/embed/${youtubeId}`;
}

/**
 * Helper function to get YouTube watch URL
 */
export function getYouTubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
