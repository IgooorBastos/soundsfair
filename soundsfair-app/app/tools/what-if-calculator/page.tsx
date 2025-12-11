import type { Metadata } from 'next';
import Link from 'next/link';
import ToolLayout from '@/components/layout/ToolLayout';
import WhatIfCalculatorClient from './WhatIfCalculatorClient';

export const metadata: Metadata = {
  title: 'What If I Bought Bitcoin Calculator - Historical BTC Investment Returns | soundsfair',
  description: 'Calculate what your Bitcoin investment would be worth today. Free "What If" calculator shows historical BTC returns from any date since 2010 with real-time prices.',
  keywords: [
    'what if i bought bitcoin',
    'bitcoin investment calculator',
    'bitcoin historical returns',
    'btc profit calculator',
    'bitcoin what if calculator',
    'bitcoin roi calculator',
    'bitcoin return calculator',
    'what if bitcoin calculator',
    'bitcoin investment returns',
    'bitcoin time machine calculator'
  ],
  openGraph: {
    title: 'What If I Bought Bitcoin Calculator - See Historical Returns',
    description: 'Calculate what your Bitcoin investment would be worth today. Enter any date since 2010 and see potential returns with real data.',
    url: 'https://soundsfair.com/tools/what-if-calculator',
    type: 'website',
    images: [
      {
        url: '/og-what-if-calculator.png',
        width: 1200,
        height: 630,
        alt: 'What If Bitcoin Calculator Tool - soundsfair'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What If I Bought Bitcoin Calculator',
    description: 'Calculate historical Bitcoin investment returns from any date since 2010.',
    images: ['/og-what-if-calculator.png']
  },
  alternates: {
    canonical: 'https://soundsfair.com/tools/what-if-calculator'
  }
};

export default function WhatIfCalculatorPage() {
  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'What If Bitcoin Calculator',
    description: 'Calculate historical Bitcoin investment returns. Enter an investment amount and date to see what it would be worth today with real historical price data.',
    url: 'https://soundsfair.com/tools/what-if-calculator',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Historical Bitcoin price lookup',
      'Real-time current price calculation',
      'ROI and percentage gain calculation',
      'Annualized return metrics',
      'Time-held tracking',
      'Share results via URL',
      'Data from 2010 to present'
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
              What If You Had <span className="text-brand-yellow">Bought Bitcoin</span>?
            </h1>
            <p className="text-xl text-gray-400">
              Calculate historical Bitcoin investment returns from any date since 2010
            </p>
          </div>

          {/* Main Component */}
          <WhatIfCalculatorClient />

          {/* FAQ Section */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  How accurate is the What If Bitcoin Calculator?
                </h3>
                <p className="text-gray-300 mb-2">
                  This calculator uses <strong>real historical Bitcoin price data</strong> from major exchanges
                  dating back to July 2010 when Bitcoin first had a recorded price. The historical prices are
                  actual market data, not estimates or predictions.
                </p>
                <p className="text-gray-300">
                  Current Bitcoin prices are fetched in real-time from reliable APIs (CoinCap and CoinGecko),
                  updated every minute. This means your "what if" calculation reflects what an actual investment
                  would be worth right now based on current market conditions.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  What does "annualized return" mean?
                </h3>
                <p className="text-gray-300 mb-2">
                  Annualized return is the average yearly percentage gain of your investment, accounting for
                  the time period you held it. It's calculated using the compound annual growth rate (CAGR) formula:
                </p>
                <p className="text-gray-300 mb-2">
                  For example, if you invested $1,000 and it grew to $10,000 over 5 years, the total return is 900%,
                  but the <strong className="text-brand-yellow">annualized return is 58.5%</strong> - meaning your
                  investment grew by an average of 58.5% per year when compounded.
                </p>
                <p className="text-gray-300">
                  This metric is useful for comparing Bitcoin's performance to traditional investments like stocks,
                  bonds, or real estate, which are typically measured in annual returns.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  Can I use this calculator to predict future Bitcoin prices?
                </h3>
                <p className="text-gray-300 mb-2">
                  <strong className="text-red-400">No.</strong> This calculator is strictly for educational purposes
                  to show Bitcoin's <em>historical</em> performance. It cannot and does not predict future prices.
                </p>
                <p className="text-gray-300 mb-2">
                  While Bitcoin has historically appreciated in value over the long term, past performance does not
                  guarantee future results. Bitcoin is an extremely volatile asset - it can (and has) experienced:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 mt-2">
                  <li>Drawdowns of 80%+ from all-time highs</li>
                  <li>Multi-year bear markets</li>
                  <li>Daily price swings of 10-20%</li>
                  <li>Regulatory uncertainty</li>
                </ul>
                <p className="text-gray-400 text-sm mt-3">
                  ⚠️ This tool helps you understand historical context, not make investment decisions.
                  Always do your own research and never invest more than you can afford to lose.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  Why do some dates show incredibly high returns?
                </h3>
                <p className="text-gray-300 mb-2">
                  Bitcoin's price history includes periods of exponential growth, especially in its early years:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><strong>2010-2011:</strong> Bitcoin went from $0.06 to $30 (50,000% gain)</li>
                  <li><strong>2013:</strong> Rose from $13 to $1,100+ (8,000%+ gain)</li>
                  <li><strong>2017:</strong> Surged from $1,000 to $20,000 (2,000% gain)</li>
                  <li><strong>2020-2021:</strong> Climbed from $10,000 to $69,000 (600%+ gain)</li>
                </ul>
                <p className="text-gray-300 mt-2">
                  These massive returns reflect Bitcoin's journey from an unknown experiment to a globally
                  recognized asset class. Early adopters who held through extreme volatility were rewarded,
                  but they also endured multiple 50-80% crashes along the way.
                </p>
                <p className="text-gray-300 mt-2">
                  As Bitcoin's market cap has grown (now in the trillions), the volatility has decreased
                  somewhat, and future returns are unlikely to match the astronomical gains of the early years.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  Does this calculator account for fees, taxes, or inflation?
                </h3>
                <p className="text-gray-300 mb-2">
                  <strong>No.</strong> This calculator shows gross returns only and does not factor in:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                  <li><strong>Exchange fees:</strong> Buying/selling fees (0.1-1% typically)</li>
                  <li><strong>Network fees:</strong> Bitcoin transaction fees for withdrawals</li>
                  <li><strong>Capital gains taxes:</strong> Varies by country (0-40%+)</li>
                  <li><strong>Inflation:</strong> Dollar devaluation over time</li>
                  <li><strong>Custody costs:</strong> Hardware wallets, insurance, etc.</li>
                </ul>
                <p className="text-gray-300 mt-2">
                  For a more realistic picture, you'd need to subtract these costs. For example, in the US,
                  long-term capital gains tax ranges from 0-20% depending on income, plus potential state taxes.
                  This can significantly impact your actual after-tax returns.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  How is this different from a DCA (Dollar Cost Averaging) calculator?
                </h3>
                <p className="text-gray-300 mb-2">
                  Great question! These calculators measure different investment strategies:
                </p>
                <div className="space-y-3 mt-3">
                  <div className="bg-black/40 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">What If Calculator (This Tool)</h4>
                    <p className="text-sm text-gray-300">
                      <strong className="text-brand-yellow">One-time lump sum investment</strong> on a specific date.
                      Example: "I bought $10,000 of Bitcoin on January 1, 2020"
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Best for: Understanding timing impact, historical context, "if only" scenarios
                    </p>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">DCA Calculator</h4>
                    <p className="text-sm text-gray-300">
                      <strong className="text-brand-yellow">Recurring periodic investments</strong> over time.
                      Example: "I bought $100 of Bitcoin every week for 5 years"
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Best for: Evaluating consistent savings strategies, reducing timing risk
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 mt-3">
                  Generally, DCA reduces risk by spreading purchases across different price points,
                  while lump sum investing can lead to higher returns if timed well (or worse returns if timed poorly).
                </p>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">Explore More Bitcoin Tools</h2>

            <div className="grid md:grid-cols-2 gap-6">
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
                Ready to start your Bitcoin journey?
              </h2>
              <p className="text-gray-300 mb-6">
                Learn the fundamentals of Bitcoin, why it matters, and how it can protect your financial freedom
              </p>
              <Link
                href="/lessons/level-1-fiat-system"
                className="inline-block px-8 py-3 bg-brand-yellow text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Start Learning →
              </Link>
            </div>
          </div>
        </div>
    </ToolLayout>
  );
}
