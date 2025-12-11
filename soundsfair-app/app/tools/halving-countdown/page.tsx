import type { Metadata } from 'next';
import Link from 'next/link';
import ToolLayout from '@/components/layout/ToolLayout';
import HalvingCountdownClient from './HalvingCountdownClient';

export const metadata: Metadata = {
  title: 'Bitcoin Halving Countdown 2028 - Next BTC Halving Date & Timer | soundsfair',
  description: 'Live countdown to the next Bitcoin halving in 2028. Track block height, estimated date, reward reduction, and historical halving data. Real-time updates every second.',
  keywords: [
    'bitcoin halving countdown',
    'next bitcoin halving',
    'bitcoin halving 2028',
    'btc halving date',
    'bitcoin halving timer',
    'bitcoin block reward',
    'halving schedule',
    'bitcoin halving history',
    'bitcoin supply curve',
    'bitcoin inflation rate'
  ],
  openGraph: {
    title: 'Bitcoin Halving Countdown 2028 - Live Timer & Historical Data',
    description: 'Track the next Bitcoin halving with real-time countdown, block height updates, and complete historical halving timeline.',
    url: 'https://soundsfair.com/tools/halving-countdown',
    type: 'website',
    images: [
      {
        url: '/og-halving-countdown.png',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Halving Countdown Tool - soundsfair'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Halving Countdown 2028 - Live Timer',
    description: 'Track the next Bitcoin halving with real-time countdown and historical data.',
    images: ['/og-halving-countdown.png']
  },
  alternates: {
    canonical: 'https://soundsfair.com/tools/halving-countdown'
  }
};

export default function HalvingCountdownPage() {
  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bitcoin Halving Countdown',
    description: 'Real-time countdown timer to the next Bitcoin halving event with historical data and educational information about Bitcoin\'s monetary policy.',
    url: 'https://soundsfair.com/tools/halving-countdown',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Real-time countdown to next halving',
      'Current block height tracking',
      'Historical halving timeline',
      'Block reward information',
      'Supply and inflation data',
      'Estimated halving date',
      'Progress visualization'
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
              Bitcoin Halving <span className="text-brand-yellow">Countdown</span>
            </h1>
            <p className="text-xl text-gray-400">
              Track the next Bitcoin halving event with real-time countdown and historical data
            </p>
          </div>

          {/* Main Countdown Component */}
          <HalvingCountdownClient />

          {/* FAQ Section */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  When is the next Bitcoin halving?
                </h3>
                <p className="text-gray-300">
                  The next Bitcoin halving is estimated to occur in <strong>April 2028</strong> at block height 1,050,000.
                  The exact date depends on the average block time, which targets 10 minutes per block. Our countdown
                  automatically updates based on current block height and provides the most accurate estimate possible.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  What happens during a Bitcoin halving?
                </h3>
                <p className="text-gray-300 mb-2">
                  During a halving event, the block reward that miners receive for validating transactions is cut in half:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><strong>Current reward (2024-2028):</strong> 3.125 BTC per block</li>
                  <li><strong>After next halving (2028):</strong> 1.5625 BTC per block</li>
                  <li><strong>Frequency:</strong> Every 210,000 blocks (~4 years)</li>
                  <li><strong>Purpose:</strong> Control Bitcoin's inflation and enforce the 21 million supply cap</li>
                </ul>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  How does halving affect Bitcoin's price?
                </h3>
                <p className="text-gray-300 mb-2">
                  While past performance doesn't guarantee future results, historical data shows a pattern:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><strong>Supply shock:</strong> Reduced new supply creates scarcity</li>
                  <li><strong>Stock-to-Flow ratio:</strong> Increases after each halving, similar to gold</li>
                  <li><strong>Historical trend:</strong> Bitcoin's price has typically increased 12-18 months after halvings</li>
                  <li><strong>Market cycles:</strong> Halvings often mark the beginning of new bull market cycles</li>
                </ul>
                <p className="text-gray-400 text-sm mt-3">
                  Note: Many factors affect Bitcoin's price. Halving is just one component of Bitcoin's monetary policy.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  How many Bitcoin halvings will there be?
                </h3>
                <p className="text-gray-300">
                  There will be approximately <strong>32 total halvings</strong> until around the year 2140. After the final
                  halving, the block reward will be so small that it effectively becomes zero. At that point, miners will be
                  compensated entirely through transaction fees. Currently, we've experienced 4 halvings (2012, 2016, 2020, 2024),
                  meaning about 28 halvings remain.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  Why is the halving important for Bitcoin?
                </h3>
                <p className="text-gray-300 mb-2">
                  The halving is fundamental to Bitcoin's value proposition:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><strong>Predictable supply:</strong> Unlike fiat currencies, Bitcoin has a fixed monetary policy</li>
                  <li><strong>Anti-inflationary:</strong> Inflation rate decreases with each halving</li>
                  <li><strong>Digital scarcity:</strong> Enforces the 21 million BTC supply cap</li>
                  <li><strong>Network security:</strong> Incentivizes efficient mining operations</li>
                  <li><strong>Long-term vision:</strong> Gradual transition from block rewards to fee-based mining economy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">Explore More Bitcoin Tools</h2>

            <div className="grid md:grid-cols-2 gap-6">
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

              <Link
                href="/glossary"
                className="group bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📖</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-yellow transition-colors">
                      Bitcoin Glossary
                    </h3>
                    <p className="text-gray-400">
                      Essential Bitcoin terms and definitions explained simply
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
                Want to understand Bitcoin's monetary policy?
              </h2>
              <p className="text-gray-300 mb-6">
                Learn about Bitcoin's fixed supply, halving schedule, and how it compares to traditional fiat currencies
              </p>
              <Link
                href="/lessons/level-5-store-of-value"
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
