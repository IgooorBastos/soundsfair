import type { Metadata } from 'next';
import Link from 'next/link';
import ToolLayout from '@/components/layout/ToolLayout';
import SatoshiConverterClient from './SatoshiConverterClient';

export const metadata: Metadata = {
  title: 'Bitcoin Satoshi Converter - BTC to Sats to USD Calculator | soundsfair',
  description: 'Free Bitcoin unit converter. Instantly convert between BTC, satoshis (sats), USD, EUR, GBP, and BRL with real-time exchange rates. Simple, fast, and accurate.',
  keywords: [
    'satoshi converter',
    'btc to sats',
    'bitcoin to satoshi',
    'satoshi to usd',
    'bitcoin unit converter',
    'sats to btc',
    'bitcoin calculator',
    'sat converter',
    'bitcoin to usd',
    'satoshi calculator'
  ],
  openGraph: {
    title: 'Bitcoin Satoshi Converter - Real-time BTC to Sats to USD',
    description: 'Convert between Bitcoin (BTC), satoshis (sats), and fiat currencies instantly with live exchange rates.',
    url: 'https://soundsfair.com/tools/satoshi-converter',
    type: 'website',
    images: [
      {
        url: '/og-satoshi-converter.png',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Satoshi Converter Tool - soundsfair'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Satoshi Converter - BTC to Sats to USD',
    description: 'Free Bitcoin unit converter with real-time exchange rates. Convert BTC, sats, USD, EUR, GBP, and BRL instantly.',
    images: ['/og-satoshi-converter.png']
  },
  alternates: {
    canonical: 'https://soundsfair.com/tools/satoshi-converter'
  }
};

export default function SatoshiConverterPage() {
  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bitcoin Satoshi Converter',
    description: 'Free online tool to convert between Bitcoin (BTC), satoshis (sats), and fiat currencies in real-time.',
    url: 'https://soundsfair.com/tools/satoshi-converter',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Real-time Bitcoin price',
      'BTC to satoshis conversion',
      'Multi-currency support (USD, EUR, GBP, BRL)',
      'Bidirectional conversion',
      'Copy to clipboard',
      'Quick preset amounts'
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
              Bitcoin Satoshi <span className="text-brand-yellow">Converter</span>
            </h1>
            <p className="text-xl text-gray-400">
              Convert between BTC, satoshis, and fiat currencies with real-time exchange rates
            </p>
          </div>

          {/* Main Converter Component */}
          <SatoshiConverterClient />

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  How many satoshis are in 1 Bitcoin?
                </h3>
                <p className="text-gray-300">
                  One Bitcoin (1 BTC) equals exactly 100,000,000 satoshis (100 million sats). This makes satoshi the smallest divisible unit of Bitcoin, similar to how a cent is the smallest unit of a dollar.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  How do I calculate satoshis to USD?
                </h3>
                <p className="text-gray-300 mb-2">
                  To convert satoshis to USD:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                  <li>First convert satoshis to BTC by dividing by 100,000,000</li>
                  <li>Then multiply the BTC amount by the current Bitcoin price in USD</li>
                  <li>Example: 1,000,000 sats ÷ 100,000,000 = 0.01 BTC × $50,000 = $500</li>
                </ol>
                <p className="text-gray-300 mt-4">
                  Our converter does this automatically with live prices!
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  Why use satoshis instead of Bitcoin?
                </h3>
                <p className="text-gray-300 mb-2">
                  Many Bitcoiners prefer satoshis because:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                  <li><strong>Easier to understand:</strong> Whole numbers (100,000 sats) vs decimals (0.001 BTC)</li>
                  <li><strong>Lightning Network:</strong> Lightning natively uses satoshis</li>
                  <li><strong>Future-proof:</strong> As Bitcoin&apos;s price rises, sats become the practical unit</li>
                  <li><strong>Micro-payments:</strong> Better suited for small everyday transactions</li>
                </ul>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  Is this converter accurate?
                </h3>
                <p className="text-gray-300">
                  Yes! Our converter uses real-time Bitcoin prices from reliable APIs (CoinCap and CoinGecko) and updates every minute. The conversion formulas are mathematically precise (1 BTC = 100,000,000 sats), so the only variable is the live exchange rate.
                </p>
              </div>

              <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-brand-yellow">
                  What currencies are supported?
                </h3>
                <p className="text-gray-300">
                  Currently, we support conversion to and from:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4 mt-2">
                  <li>Bitcoin (BTC)</li>
                  <li>Satoshis (sats)</li>
                  <li>US Dollar (USD)</li>
                  <li>Euro (EUR)</li>
                  <li>British Pound (GBP)</li>
                  <li>Brazilian Real (BRL)</li>
                </ul>
                <p className="text-gray-300 mt-2">
                  More currencies will be added based on user demand.
                </p>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="max-w-4xl mx-auto mt-16">
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

              <Link
                href="/qa"
                className="group bg-surface-charcoal border-2 border-border-default rounded-lg p-6 hover:border-brand-gold transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⚡</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-yellow transition-colors">
                      Ask an Expert
                    </h3>
                    <p className="text-gray-400">
                      Get your Bitcoin questions answered via Lightning Network
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <div className="bg-gradient-to-r from-brand-yellow/10 to-transparent border-2 border-brand-yellow rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                Want to learn more about Bitcoin?
              </h2>
              <p className="text-gray-300 mb-6">
                Start your Bitcoin education journey with our comprehensive 9-lesson course
              </p>
              <Link
                href="/lessons"
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
