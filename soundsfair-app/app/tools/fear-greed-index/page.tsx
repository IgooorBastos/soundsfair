import type { Metadata } from 'next';
import Link from 'next/link';
import ToolLayout from '@/components/layout/ToolLayout';
import FearGreedIndexClient from './FearGreedIndexClient';

export const metadata: Metadata = {
  title: 'Bitcoin Fear & Greed Index - Live Crypto Market Sentiment Indicator | soundsfair',
  description: 'Real-time Bitcoin Fear & Greed Index with historical data. Track crypto market sentiment, avoid emotional decisions, and identify potential buying or selling opportunities.',
  keywords: [
    'bitcoin fear and greed index',
    'crypto fear greed indicator',
    'bitcoin sentiment analysis',
    'crypto market sentiment',
    'bitcoin fear index',
    'bitcoin greed index',
    'crypto market psychology',
    'bitcoin market sentiment',
    'fear and greed crypto',
    'bitcoin emotional index'
  ],
  openGraph: {
    title: 'Bitcoin Fear & Greed Index - Live Market Sentiment Tracker',
    description: 'Track real-time Bitcoin market sentiment with the Fear & Greed Index. Make rational decisions, avoid FOMO, and identify opportunities.',
    url: 'https://soundsfair.com/tools/fear-greed-index',
    type: 'website',
    images: [
      {
        url: '/og-fear-greed-index.png',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Fear & Greed Index Tool - soundsfair'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Fear & Greed Index - Live Sentiment',
    description: 'Track Bitcoin market sentiment in real-time. Avoid emotional decisions with data-driven insights.',
    images: ['/og-fear-greed-index.png']
  },
  alternates: {
    canonical: 'https://soundsfair.com/tools/fear-greed-index'
  }
};

export default function FearGreedIndexPage() {
  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bitcoin Fear & Greed Index',
    description: 'Real-time Bitcoin market sentiment indicator analyzing emotions and sentiments from multiple sources to help investors make rational decisions.',
    url: 'https://soundsfair.com/tools/fear-greed-index',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Real-time Fear & Greed Index',
      'Historical sentiment data (30/90 days)',
      'Market trend analysis',
      'Sentiment statistics',
      'Educational content on market psychology',
      'Data-driven trading suggestions'
    ],
    creator: {
      '@type': 'Organization',
      name: 'soundsfair',
      url: 'https://soundsfair.com'
    }
  };

  return (
    <ToolLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 py-12 text-white">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bitcoin <span className="text-brand-yellow">Fear & Greed</span> Index
            </h1>
            <p className="text-xl text-gray-400">
              Track real-time market sentiment and make rational, data-driven investment decisions
            </p>
          </div>

          {/* Main Component */}
          <FearGreedIndexClient />

          {/* FAQ Section */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  What is the Bitcoin Fear & Greed Index?
                </h3>
                <p className="text-gray-300 mb-2">
                  The Fear & Greed Index is a sentiment indicator that analyzes multiple data sources to measure
                  the dominant emotion in the Bitcoin and cryptocurrency market on a scale from 0 (Extreme Fear) to 100 (Extreme Greed).
                </p>
                <p className="text-gray-300">
                  Created by Alternative.me, it helps investors understand whether market participants are:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 mt-2">
                  <li>Too fearful (potential buying opportunity)</li>
                  <li>Too greedy (market may be overheating)</li>
                  <li>Acting rationally (neutral sentiment)</li>
                </ul>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  How is the Fear & Greed Index calculated?
                </h3>
                <p className="text-gray-300 mb-2">
                  The index combines six different data sources, each weighted by importance:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><strong>Volatility (25%):</strong> Unusual spikes in volatility indicate fear</li>
                  <li><strong>Market Momentum/Volume (25%):</strong> High buying volume suggests greed</li>
                  <li><strong>Social Media (15%):</strong> Twitter/X sentiment analysis</li>
                  <li><strong>Surveys (15%):</strong> Weekly crypto polls</li>
                  <li><strong>Bitcoin Dominance (10%):</strong> Flight to safety vs risk-on behavior</li>
                  <li><strong>Google Trends (10%):</strong> Search volume for Bitcoin queries</li>
                </ul>
                <p className="text-gray-400 text-sm mt-3">
                  Note: The exact methodology is proprietary to Alternative.me and may evolve over time.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  How should I use the Fear & Greed Index for trading?
                </h3>
                <p className="text-gray-300 mb-3">
                  The index is a contrarian indicator based on Warren Buffett's principle:
                  <em className="text-brand-yellow"> "Be fearful when others are greedy, and greedy when others are fearful."</em>
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong className="text-red-400">Extreme Fear (0-24):</strong> Consider accumulating. Market may be oversold.</p>
                  <p><strong className="text-orange-400">Fear (25-49):</strong> Cautious buying opportunities may exist.</p>
                  <p><strong className="text-brand-yellow">Neutral (50-54):</strong> Follow your investment strategy.</p>
                  <p><strong className="text-lime-400">Greed (55-74):</strong> Be cautious. Market may be overheating.</p>
                  <p><strong className="text-green-400">Extreme Greed (75-100):</strong> Consider taking profits. Correction risk is elevated.</p>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  ⚠️ <strong>Important:</strong> This is educational content, not financial advice. Always do your own research
                  and consider multiple factors before making investment decisions.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  Is the Fear & Greed Index accurate?
                </h3>
                <p className="text-gray-300 mb-2">
                  The index is a useful sentiment indicator but has limitations:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><strong>Lagging indicator:</strong> Reflects current sentiment, not future prices</li>
                  <li><strong>Extended periods:</strong> Markets can remain in extreme fear or greed for weeks/months</li>
                  <li><strong>Not predictive:</strong> High greed doesn't guarantee an immediate crash</li>
                  <li><strong>Complementary tool:</strong> Best used alongside technical and fundamental analysis</li>
                </ul>
                <p className="text-gray-300 mt-3">
                  Think of it as one data point in your decision-making toolkit, helping you identify when emotions
                  are running too hot or cold in the market.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  What's the difference between Fear & Greed Index and other sentiment indicators?
                </h3>
                <p className="text-gray-300 mb-2">
                  Unlike single-metric indicators, the Fear & Greed Index:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                  <li>Combines multiple data sources for a holistic view</li>
                  <li>Updates daily with the latest market data</li>
                  <li>Specifically designed for Bitcoin and crypto markets</li>
                  <li>Has historical data dating back several years</li>
                  <li>Is widely followed and referenced by the crypto community</li>
                </ul>
                <p className="text-gray-300 mt-2">
                  Other indicators might focus on funding rates, open interest, or specific exchanges,
                  while this index provides a broader market psychology snapshot.
                </p>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">Explore More Bitcoin Tools</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/tools/halving-countdown"
                className="group bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⏰</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-yellow transition-colors">
                      Halving Countdown
                    </h3>
                    <p className="text-gray-400">
                      Track the next Bitcoin halving with real-time countdown and historical data
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/tools/satoshi-converter"
                className="group bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">₿</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-yellow transition-colors">
                      Satoshi Converter
                    </h3>
                    <p className="text-gray-400">
                      Convert between BTC, satoshis, and fiat currencies with real-time prices
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/tools/dca"
                className="group bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📊</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-yellow transition-colors">
                      DCA Calculator
                    </h3>
                    <p className="text-gray-400">
                      Compare Bitcoin DCA performance vs traditional assets over time
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/lessons"
                className="group bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📚</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-yellow transition-colors">
                      Learn About Bitcoin
                    </h3>
                    <p className="text-gray-400">
                      Complete 9-lesson course from Bitcoin basics to advanced concepts
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="max-w-6xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-r from-brand-yellow/10 to-transparent border-2 border-brand-yellow rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                Want to understand Bitcoin market psychology?
              </h2>
              <p className="text-gray-300 mb-6">
                Learn about market cycles, FOMO, FUD, and how to make rational investment decisions
              </p>
              <Link
                href="/lessons/level-6-economic-freedom"
                className="inline-block px-8 py-3 bg-brand-yellow text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
    </ToolLayout>
  );
}
