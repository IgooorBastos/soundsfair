/**
 * Bitcoin Books Database
 *
 * EDIT THIS FILE to customize book recommendations.
 * Add your own books, reviews, and affiliate links.
 */

export interface Book {
  id: string;
  title: string;
  author: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  coverImage?: string; // Path to cover image in /public/images/books/
  description: string;
  keyTakeaways: string[];
  amazonUrl?: string;
  goodreadsUrl?: string;
  publishYear: number;
  pages?: number;
  rating?: number; // out of 5
}

export const books: Book[] = [
  // BEGINNER BOOKS
  {
    id: 'bitcoin-standard',
    title: 'The Bitcoin Standard',
    author: 'Saifedean Ammous',
    category: 'beginner',
    topics: ['Sound Money', 'Austrian Economics', 'History'],
    coverImage: '/images/books/bitcoin-standard.jpg',
    description: 'The seminal work on Bitcoin as sound money. Ammous explores the history of money, from primitive currencies to gold standards to fiat, and makes the case for Bitcoin as the hardest money ever created. Essential reading for understanding why Bitcoin matters.',
    keyTakeaways: [
      'Historical evolution of money and why gold became the standard',
      'How fiat money enables government control and inflation',
      'Bitcoin\'s fixed supply makes it superior to all previous forms of money',
      'The economic and social implications of sound money'
    ],
    amazonUrl: 'https://amazon.com/Bitcoin-Standard-Saifedean-Ammous',
    publishYear: 2018,
    pages: 304,
    rating: 4.8
  },
  {
    id: 'layered-money',
    title: 'Layered Money',
    author: 'Nik Bhatia',
    category: 'beginner',
    topics: ['Monetary System', 'Banking', 'Bitcoin'],
    coverImage: '/images/books/layered-money.jpg',
    description: 'A clear explanation of how the monetary system actually works through layers - from gold to government bonds to bank deposits. Bhatia shows how Bitcoin fits as a new base layer for the digital age.',
    keyTakeaways: [
      'Money exists in layers, not as a single thing',
      'Understanding the hierarchy: gold → government bonds → bank deposits',
      'How Bitcoin can become the base layer for a new monetary system',
      'The future of money in a digital world'
    ],
    amazonUrl: 'https://amazon.com/Layered-Money-Nik-Bhatia',
    publishYear: 2021,
    pages: 176,
    rating: 4.6
  },
  {
    id: 'little-bitcoin-book',
    title: 'The Little Bitcoin Book',
    author: 'Bitcoin Collective',
    category: 'beginner',
    topics: ['Introduction', 'Basics', 'Why Bitcoin'],
    coverImage: '/images/books/little-bitcoin-book.jpg',
    description: 'A concise, accessible introduction to Bitcoin written by a collective of Bitcoin educators. Perfect first book for complete beginners who want to understand why Bitcoin was created and why it matters.',
    keyTakeaways: [
      'What Bitcoin is and how it works (non-technical)',
      'Why we need Bitcoin in the modern world',
      'How Bitcoin can help the financially excluded',
      'The future potential of Bitcoin adoption'
    ],
    amazonUrl: 'https://amazon.com/Little-Bitcoin-Book',
    publishYear: 2019,
    pages: 144,
    rating: 4.7
  },

  // INTERMEDIATE BOOKS
  {
    id: 'fiat-standard',
    title: 'The Fiat Standard',
    author: 'Saifedean Ammous',
    category: 'intermediate',
    topics: ['Fiat Money', 'Government', 'Economics'],
    coverImage: '/images/books/fiat-standard.jpg',
    description: 'The sequel to The Bitcoin Standard. A deep dive into how fiat money actually works, its civilizational costs, and why returning to sound money (Bitcoin) is essential for human flourishing.',
    keyTakeaways: [
      'The mechanics of fiat money creation and its hidden costs',
      'How fiat enables permanent government expansion',
      'The destruction of savings, capital, and time preference',
      'Why Bitcoin offers an escape from the fiat trap'
    ],
    amazonUrl: 'https://amazon.com/Fiat-Standard-Saifedean-Ammous',
    publishYear: 2021,
    pages: 432,
    rating: 4.7
  },
  {
    id: 'sovereign-individual',
    title: 'The Sovereign Individual',
    author: 'James Dale Davidson & William Rees-Mogg',
    category: 'intermediate',
    topics: ['Philosophy', 'Future', 'Individual Sovereignty'],
    coverImage: '/images/books/sovereign-individual.jpg',
    description: 'Written in 1997, this prophetic book predicted the rise of digital currencies and the decline of nation-states. Essential for understanding Bitcoin\'s broader geopolitical implications.',
    keyTakeaways: [
      'Technology empowers individuals over institutions',
      'Nation-states will decline as digital economies rise',
      'Prediction of "cybermoney" (Bitcoin) 12 years before its creation',
      'How to position yourself for the coming transition'
    ],
    amazonUrl: 'https://amazon.com/Sovereign-Individual-Davidson',
    publishYear: 1997,
    pages: 448,
    rating: 4.6
  },
  {
    id: 'inventing-bitcoin',
    title: 'Inventing Bitcoin',
    author: 'Yan Pritzker',
    category: 'intermediate',
    topics: ['Technical', 'How Bitcoin Works', 'History'],
    coverImage: '/images/books/inventing-bitcoin.jpg',
    description: 'A technical yet accessible explanation of how Bitcoin actually works under the hood. Covers cryptography, mining, consensus, and why Bitcoin\'s design is so ingenious.',
    keyTakeaways: [
      'How Bitcoin achieves consensus without central authority',
      'The role of mining and proof-of-work',
      'Why Bitcoin is practically impossible to hack or change',
      'The elegant simplicity of Satoshi\'s design'
    ],
    amazonUrl: 'https://amazon.com/Inventing-Bitcoin-Yan-Pritzker',
    publishYear: 2019,
    pages: 132,
    rating: 4.8
  },

  // ADVANCED BOOKS
  {
    id: 'mastering-bitcoin',
    title: 'Mastering Bitcoin',
    author: 'Andreas M. Antonopoulos',
    category: 'advanced',
    topics: ['Technical', 'Development', 'Deep Dive'],
    coverImage: '/images/books/mastering-bitcoin.jpg',
    description: 'The technical bible of Bitcoin. A comprehensive guide for developers and serious students who want to understand Bitcoin at the protocol level. Requires programming knowledge.',
    keyTakeaways: [
      'Complete technical breakdown of Bitcoin protocol',
      'How to build Bitcoin applications',
      'Cryptography, transactions, and scripting in depth',
      'Lightning Network and second-layer solutions'
    ],
    amazonUrl: 'https://amazon.com/Mastering-Bitcoin-Andreas-Antonopoulos',
    publishYear: 2023,
    pages: 530,
    rating: 4.9
  },
  {
    id: 'programming-bitcoin',
    title: 'Programming Bitcoin',
    author: 'Jimmy Song',
    category: 'advanced',
    topics: ['Programming', 'Technical', 'Development'],
    coverImage: '/images/books/programming-bitcoin.jpg',
    description: 'Learn Bitcoin by coding it from scratch. Song guides you through building a Bitcoin library in Python, teaching you the internals through hands-on programming.',
    keyTakeaways: [
      'Build Bitcoin functionality from first principles',
      'Understand elliptic curve cryptography practically',
      'Implement transactions, blocks, and network protocols',
      'Deep understanding through implementation'
    ],
    amazonUrl: 'https://amazon.com/Programming-Bitcoin-Jimmy-Song',
    publishYear: 2019,
    pages: 322,
    rating: 4.7
  },
  {
    id: 'blocksize-war',
    title: 'The Blocksize War',
    author: 'Jonathan Bier',
    category: 'advanced',
    topics: ['History', 'Governance', 'Politics'],
    coverImage: '/images/books/blocksize-war.jpg',
    description: 'The definitive history of Bitcoin\'s blocksize debate (2015-2017). Essential for understanding Bitcoin governance, the importance of decentralization, and how Bitcoin resists capture.',
    keyTakeaways: [
      'How Bitcoin survived its greatest existential threat',
      'The importance of decentralized governance',
      'Why small blocks preserve decentralization',
      'Lessons about consensus and protocol changes'
    ],
    amazonUrl: 'https://amazon.com/Blocksize-War-Jonathan-Bier',
    publishYear: 2021,
    pages: 304,
    rating: 4.8
  },

  // AUSTRIAN ECONOMICS
  {
    id: 'human-action',
    title: 'Human Action',
    author: 'Ludwig von Mises',
    category: 'advanced',
    topics: ['Austrian Economics', 'Philosophy', 'Economics'],
    coverImage: '/images/books/human-action.jpg',
    description: 'The magnum opus of Austrian economics. While not about Bitcoin, this book provides the economic foundation for understanding why sound money matters and why central planning fails.',
    keyTakeaways: [
      'The foundations of Austrian economic theory',
      'Why central planning always fails (economic calculation problem)',
      'The role of money in economic coordination',
      'Time preference and capital formation'
    ],
    amazonUrl: 'https://amazon.com/Human-Action-Ludwig-von-Mises',
    publishYear: 1949,
    pages: 912,
    rating: 4.7
  },
  {
    id: 'price-of-tomorrow',
    title: 'The Price of Tomorrow',
    author: 'Jeff Booth',
    category: 'intermediate',
    topics: ['Technology', 'Deflation', 'Future'],
    coverImage: '/images/books/price-of-tomorrow.jpg',
    description: 'Why deflation is natural in a technological world and how Bitcoin enables a deflationary economy. Booth argues that fighting deflation with money printing causes societal breakdown.',
    keyTakeaways: [
      'Technology naturally causes deflation (prices fall)',
      'Fighting natural deflation with inflation creates inequality',
      'Bitcoin allows for a naturally deflationary monetary system',
      'The inevitable collision between technology and fiat'
    ],
    amazonUrl: 'https://amazon.com/Price-Tomorrow-Jeff-Booth',
    publishYear: 2020,
    pages: 245,
    rating: 4.8
  },

  // PRACTICAL GUIDES
  {
    id: 'bitcoin-money',
    title: 'Bitcoin: Hard Money You Can\'t F*ck With',
    author: 'Jason A. Williams',
    category: 'beginner',
    topics: ['Introduction', 'Practical', 'Basics'],
    coverImage: '/images/books/bitcoin-money.jpg',
    description: 'A no-nonsense, profanity-laced introduction to Bitcoin for people who want straight talk without technical jargon. Explains why Bitcoin matters in plain language.',
    keyTakeaways: [
      'Why fiat money is fundamentally broken',
      'How Bitcoin fixes monetary incentives',
      'Practical guide to getting started with Bitcoin',
      'Why "not your keys, not your coins" matters'
    ],
    amazonUrl: 'https://amazon.com/Bitcoin-Hard-Money-Jason-Williams',
    publishYear: 2019,
    pages: 96,
    rating: 4.5
  }
];

// Helper functions for filtering
export function getBooksByCategory(category: Book['category']): Book[] {
  return books.filter(book => book.category === category);
}

export function getBooksByTopic(topic: string): Book[] {
  return books.filter(book => book.topics.includes(topic));
}

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id);
}

export const allTopics = [
  'Sound Money',
  'Austrian Economics',
  'History',
  'Monetary System',
  'Banking',
  'Bitcoin',
  'Introduction',
  'Basics',
  'Why Bitcoin',
  'Fiat Money',
  'Government',
  'Economics',
  'Philosophy',
  'Future',
  'Individual Sovereignty',
  'Technical',
  'How Bitcoin Works',
  'Development',
  'Deep Dive',
  'Programming',
  'Governance',
  'Politics',
  'Technology',
  'Deflation',
  'Practical'
];
