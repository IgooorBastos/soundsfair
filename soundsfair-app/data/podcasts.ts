/**
 * Bitcoin Podcasts Database
 *
 * EDIT THIS FILE to customize podcast recommendations.
 * Add your own podcasts and featured episodes.
 */

export interface Podcast {
  id: string;
  title: string;
  host: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'news' | 'technical';
  topics: string[];
  coverImage?: string; // Path to cover image in /public/images/podcasts/
  description: string;
  frequency: string; // e.g., "Weekly", "Daily", "Bi-weekly"
  language: string;
  featuredEpisodes?: {
    title: string;
    description: string;
    url?: string;
  }[];
  spotifyUrl?: string;
  appleUrl?: string;
  websiteUrl?: string;
  youtubeUrl?: string;
  rating?: number; // out of 5
}

export const podcasts: Podcast[] = [
  // BEGINNER FRIENDLY
  {
    id: 'what-bitcoin-did',
    title: 'What Bitcoin Did',
    host: 'Peter McCormack',
    category: 'beginner',
    topics: ['Interviews', 'Education', 'Culture', 'Politics'],
    coverImage: '/images/podcasts/what-bitcoin-did.jpg',
    description: 'The most popular Bitcoin podcast. Peter McCormack interviews bitcoiners, builders, and critics. Perfect for beginners who want to understand Bitcoin through conversations with the people building it.',
    frequency: 'Multiple per week',
    language: 'English',
    featuredEpisodes: [
      {
        title: 'Introducing Bitcoin with Saifedean Ammous',
        description: 'The author of The Bitcoin Standard explains why Bitcoin matters',
        url: 'https://www.whatbitcoindid.com/podcast/introducing-bitcoin'
      },
      {
        title: 'Bitcoin For Beginners with Jameson Lopp',
        description: 'Security expert Jameson Lopp breaks down Bitcoin basics',
        url: 'https://www.whatbitcoindid.com/podcast/bitcoin-beginners'
      }
    ],
    spotifyUrl: 'https://open.spotify.com/show/0mWUJuONiilW5JSBBFZ0s7',
    appleUrl: 'https://podcasts.apple.com/podcast/what-bitcoin-did/id1317356120',
    websiteUrl: 'https://www.whatbitcoindid.com',
    youtubeUrl: 'https://youtube.com/@WhatBitcoinDid',
    rating: 4.8
  },
  {
    id: 'bitcoin-audible',
    title: 'Bitcoin Audible',
    host: 'Guy Swann',
    category: 'beginner',
    topics: ['Education', 'Articles', 'Essays', 'Philosophy'],
    coverImage: '/images/podcasts/bitcoin-audible.jpg',
    description: 'Guy Swann reads and discusses the best Bitcoin articles, essays, and technical papers. An audiobook-style podcast that makes Bitcoin literature accessible. Essential for understanding Bitcoin philosophy.',
    frequency: 'Multiple per week',
    language: 'English',
    featuredEpisodes: [
      {
        title: 'The Bullish Case for Bitcoin - Vijay Boyapati',
        description: 'The classic essay that makes the investment thesis for Bitcoin'
      },
      {
        title: 'Bitcoin is Venice - Allen Farrington',
        description: 'Why Bitcoin represents a renaissance of sound money'
      }
    ],
    spotifyUrl: 'https://open.spotify.com/show/6hdEQuesunWgECHBAWWjvQ',
    appleUrl: 'https://podcasts.apple.com/podcast/bitcoin-audible/id1359544516',
    websiteUrl: 'https://bitcoinaudible.com',
    rating: 4.9
  },
  {
    id: 'once-bitten',
    title: 'Once BITten!',
    host: 'Daniel Prince',
    category: 'beginner',
    topics: ['Personal Stories', 'Adoption', 'Culture'],
    coverImage: '/images/podcasts/once-bitten.jpg',
    description: 'Personal Bitcoin journey stories from people around the world. Hear how Bitcoin has changed lives, from Venezuela to Lebanon to the UK. Inspiring and accessible.',
    frequency: 'Weekly',
    language: 'English',
    featuredEpisodes: [
      {
        title: 'Bitcoin in Venezuela with Carlos Hernández',
        description: 'How Bitcoin provides hope in a collapsing economy'
      },
      {
        title: 'Orange Pilling Your Family',
        description: 'Practical advice for sharing Bitcoin with loved ones'
      }
    ],
    spotifyUrl: 'https://open.spotify.com/show/4wWzXFEyAJtM6aOLA6c4Q2',
    appleUrl: 'https://podcasts.apple.com/podcast/once-bitten/id1497540130',
    rating: 4.7
  },

  // INTERMEDIATE
  {
    id: 'bitcoin-standard-podcast',
    title: 'The Bitcoin Standard Podcast',
    host: 'Saifedean Ammous',
    category: 'intermediate',
    topics: ['Austrian Economics', 'Sound Money', 'Philosophy', 'History'],
    coverImage: '/images/podcasts/bitcoin-standard.jpg',
    description: 'The author of The Bitcoin Standard discusses economics, money, and Bitcoin through an Austrian lens. Deep discussions on monetary theory, time preference, and why Bitcoin matters.',
    frequency: 'Weekly',
    language: 'English',
    featuredEpisodes: [
      {
        title: 'Understanding Fiat Money',
        description: 'How fiat currency actually works and its civilizational costs'
      },
      {
        title: 'The Ethics of Money Production',
        description: 'Why sound money is a moral imperative'
      }
    ],
    spotifyUrl: 'https://open.spotify.com/show/1BbPd0JHfwgF734RhDXa5A',
    appleUrl: 'https://podcasts.apple.com/podcast/bitcoin-standard-podcast/id1438967305',
    websiteUrl: 'https://saifedean.com/podcast',
    rating: 4.7
  },
  {
    id: 'tales-from-the-crypt',
    title: 'Tales From The Crypt',
    host: 'Marty Bent',
    category: 'intermediate',
    topics: ['News', 'Culture', 'Economics', 'Freedom'],
    coverImage: '/images/podcasts/tftc.jpg',
    description: 'Daily Bitcoin commentary from Marty Bent. News, analysis, and interviews focused on Bitcoin\'s role in preserving freedom and building a better future.',
    frequency: 'Daily',
    language: 'English',
    featuredEpisodes: [
      {
        title: 'Bitcoin and Freedom with Alex Gladstein',
        description: 'How Bitcoin empowers people living under authoritarian regimes'
      },
      {
        title: 'The Mining Industry with Zack Voell',
        description: 'Understanding Bitcoin mining economics and environmental impact'
      }
    ],
    spotifyUrl: 'https://open.spotify.com/show/6JKay9wOeRdtxMdJCuIdBy',
    websiteUrl: 'https://tftc.io/podcast',
    rating: 4.6
  },
  {
    id: 'stephan-livera',
    title: 'Stephan Livera Podcast',
    host: 'Stephan Livera',
    category: 'intermediate',
    topics: ['Economics', 'Technical', 'Austrian Economics'],
    coverImage: '/images/podcasts/stephan-livera.jpg',
    description: 'Deep dives into Bitcoin economics, technology, and Austrian principles. High-signal conversations with developers, economists, and Bitcoin experts.',
    frequency: 'Weekly',
    language: 'English',
    featuredEpisodes: [
      {
        title: 'Bitcoin Self-Custody with Ben Kaufman',
        description: 'Advanced security practices for holding your own keys'
      },
      {
        title: 'Lightning Network Explained with René Pickhardt',
        description: 'Technical deep dive into Lightning Network routing'
      }
    ],
    spotifyUrl: 'https://open.spotify.com/show/2kwKJCJZiWJPhdhhwjeWLb',
    appleUrl: 'https://podcasts.apple.com/podcast/stephan-livera-podcast/id1415720320',
    websiteUrl: 'https://stephanlivera.com',
    rating: 4.8
  },

  // TECHNICAL / ADVANCED
  {
    id: 'chaincode-podcast',
    title: 'Chaincode Podcast',
    host: 'Chaincode Labs',
    category: 'technical',
    topics: ['Development', 'Protocol', 'Technical Deep Dives'],
    coverImage: '/images/podcasts/chaincode.jpg',
    description: 'Highly technical discussions with Bitcoin Core developers and researchers. For developers and those who want to understand Bitcoin at the protocol level.',
    frequency: 'Monthly',
    language: 'English',
    featuredEpisodes: [
      {
        title: 'Pieter Wuille on Miniscript',
        description: 'Advanced Bitcoin scripting with a Bitcoin Core developer'
      },
      {
        title: 'Debugging Bitcoin with Gloria Zhao',
        description: 'Behind the scenes of Bitcoin Core development'
      }
    ],
    spotifyUrl: 'https://open.spotify.com/show/2qXqHq4rg7a7rMyEsmQG8k',
    websiteUrl: 'https://podcast.chaincode.com',
    rating: 4.9
  },
  {
    id: 'bitcoin-review',
    title: 'The Bitcoin Review',
    host: 'NVK & Guests',
    category: 'technical',
    topics: ['Technical', 'Development', 'Hardware', 'Security'],
    coverImage: '/images/podcasts/bitcoin-review.jpg',
    description: 'Technical Bitcoin discussions covering development, hardware, security, and protocol improvements. For advanced users who want to stay on the cutting edge.',
    frequency: 'Weekly',
    language: 'English',
    featuredEpisodes: [
      {
        title: 'Hardware Wallets Security with Rodolfo Novak',
        description: 'Building secure Bitcoin storage devices'
      },
      {
        title: 'Coinjoin Privacy with Chris Belcher',
        description: 'Advanced privacy techniques for Bitcoin transactions'
      }
    ],
    spotifyUrl: 'https://open.spotify.com/show/61QqxMXNyNXNy4MoXXM56E',
    websiteUrl: 'https://bitcoinreview.com',
    rating: 4.7
  },

  // NEWS & ANALYSIS
  {
    id: 'bitcoin-magazine',
    title: 'Bitcoin Magazine Podcast',
    host: 'Bitcoin Magazine',
    category: 'news',
    topics: ['News', 'Analysis', 'Interviews', 'Markets'],
    coverImage: '/images/podcasts/bitcoin-magazine.jpg',
    description: 'Daily Bitcoin news, analysis, and interviews from the oldest Bitcoin publication. Stay up-to-date with what\'s happening in the Bitcoin ecosystem.',
    frequency: 'Daily',
    language: 'English',
    spotifyUrl: 'https://open.spotify.com/show/4kENZRYpufC8xRsIZZJmMY',
    appleUrl: 'https://podcasts.apple.com/podcast/bitcoin-magazine-podcast/id1088527146',
    websiteUrl: 'https://bitcoinmagazine.com/podcast',
    rating: 4.5
  },
  {
    id: 'simply-bitcoin',
    title: 'Simply Bitcoin',
    host: 'Nico',
    category: 'news',
    topics: ['News', 'Price Analysis', 'Markets', 'Daily Updates'],
    coverImage: '/images/podcasts/simply-bitcoin.jpg',
    description: 'Daily Bitcoin news and price analysis. Quick updates on what\'s moving in the Bitcoin world, perfect for your morning commute.',
    frequency: 'Daily',
    language: 'English',
    youtubeUrl: 'https://youtube.com/@SimplyBitcoin',
    rating: 4.4
  },

  // PORTUGUESE (Bonus)
  {
    id: 'area-bitcoin',
    title: 'Área Bitcoin',
    host: 'Equipe Área Bitcoin',
    category: 'beginner',
    topics: ['Education', 'News', 'Brazil', 'Portuguese'],
    coverImage: '/images/podcasts/area-bitcoin.jpg',
    description: 'O maior podcast sobre Bitcoin do Brasil. Notícias, educação e entrevistas em português. Essencial para brasileiros que querem entender Bitcoin.',
    frequency: 'Semanal',
    language: 'Português',
    spotifyUrl: 'https://open.spotify.com/show/5YKjQ0XJWBnW5jJl8BYKqj',
    youtubeUrl: 'https://youtube.com/@AreaBitcoin',
    websiteUrl: 'https://areabitcoin.com.br',
    rating: 4.7
  }
];

// Helper functions
export function getPodcastsByCategory(category: Podcast['category']): Podcast[] {
  return podcasts.filter(podcast => podcast.category === category);
}

export function getPodcastsByTopic(topic: string): Podcast[] {
  return podcasts.filter(podcast => podcast.topics.includes(topic));
}

export function getPodcastById(id: string): Podcast | undefined {
  return podcasts.find(podcast => podcast.id === id);
}

export const allPodcastTopics = [
  'Interviews',
  'Education',
  'Culture',
  'Politics',
  'Articles',
  'Essays',
  'Philosophy',
  'Personal Stories',
  'Adoption',
  'Austrian Economics',
  'Sound Money',
  'History',
  'News',
  'Economics',
  'Freedom',
  'Technical',
  'Development',
  'Protocol',
  'Hardware',
  'Security',
  'Analysis',
  'Markets',
  'Price Analysis',
  'Daily Updates',
  'Brazil',
  'Portuguese'
];
