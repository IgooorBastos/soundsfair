import type { Metadata } from 'next';
import Link from 'next/link';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'Bitcoin Tools & Calculators - Free Educational Resources | soundsfair',
  description: 'Free Bitcoin tools and calculators: DCA calculator, Fear & Greed Index, Halving countdown, Satoshi converter, and What If calculator. Educational resources for Bitcoin investors.',
  keywords: [
    'bitcoin tools',
    'bitcoin calculators',
    'dca calculator',
    'bitcoin fear greed index',
    'halving countdown',
    'satoshi converter',
    'bitcoin investment tools',
    'crypto calculators',
    'bitcoin educational tools'
  ],
  openGraph: {
    title: 'Bitcoin Tools & Calculators Hub - soundsfair',
    description: 'Explore free Bitcoin tools: DCA calculator, sentiment tracker, halving countdown, unit converter, and historical returns calculator.',
    url: 'https://soundsfair.com/tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Tools & Calculators - soundsfair',
    description: 'Free Bitcoin educational tools and calculators for investors and learners.',
  },
  alternates: {
    canonical: 'https://soundsfair.com/tools'
  }
};

const tools = [
  {
    name: 'DCA Calculator',
    slug: 'dca',
    icon: '📊',
    description: 'Compare Bitcoin vs traditional assets (S&P 500, Gold, MSCI World) with Dollar Cost Averaging strategy',
    category: 'Calculators',
    features: ['Multi-asset comparison', 'Historical data', 'CSV export', 'Shareable URLs']
  },
  {
    name: 'Fear & Greed Index',
    slug: 'fear-greed-index',
    icon: '😨',
    description: 'Track real-time Bitcoin market sentiment and avoid emotional investment decisions',
    category: 'Market Intelligence',
    features: ['Live sentiment data', 'Historical trends', 'Market psychology', 'Trading insights']
  },
  {
    name: 'Halving Countdown',
    slug: 'halving-countdown',
    icon: '⏰',
    description: 'Live countdown to the next Bitcoin halving event with block height tracking and historical data',
    category: 'Market Intelligence',
    features: ['Real-time countdown', 'Block tracking', 'Historical halvings', 'Supply metrics']
  },
  {
    name: 'Satoshi Converter',
    slug: 'satoshi-converter',
    icon: '₿',
    description: 'Convert between BTC, satoshis, and fiat currencies (USD, EUR, GBP, BRL) with live prices',
    category: 'Converters',
    features: ['Real-time rates', 'Multi-currency', 'Quick presets', 'Copy to clipboard']
  },
  {
    name: 'What If Calculator',
    slug: 'what-if-calculator',
    icon: '💰',
    description: 'Calculate historical Bitcoin investment returns from any date since 2010',
    category: 'Calculators',
    features: ['Historical prices', 'ROI calculation', 'Annualized returns', 'Time-held tracking']
  }
];

const categories = ['Calculators', 'Converters', 'Market Intelligence'];

export default function ToolsHubPage() {
  return (
    <ToolLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bitcoin <span className="text-brand-yellow">Tools Hub</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Free educational tools and calculators to help you understand Bitcoin,
            track market metrics, and make informed decisions
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Educational</span>
            </div>
          </div>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const categoryTools = tools.filter((tool) => tool.category === category);
          if (categoryTools.length === 0) return null;

          return (
            <div key={category} className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-300 flex items-center gap-3">
                <span className="text-brand-yellow">{category}</span>
                <span className="flex-1 h-px bg-gray-800"></span>
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group bg-surface-charcoal border-2 border-border-default rounded-lg p-6
                             hover:border-brand-yellow transition-all duration-300 hover:-translate-y-1
                             hover:shadow-xl hover:shadow-brand-yellow/10"
                  >
                    {/* Icon and Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-5xl">{tool.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-yellow transition-colors">
                          {tool.name}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-1.5 mb-4">
                      {tool.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-4 h-4 text-brand-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-brand-yellow font-semibold text-sm
                                  group-hover:gap-3 transition-all">
                      <span>Explore Tool</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Bottom CTA */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-brand-yellow/10 to-transparent border-2 border-brand-yellow rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Want to learn more about Bitcoin?
            </h2>
            <p className="text-gray-300 mb-6">
              Explore our comprehensive 9-lesson course covering Bitcoin basics, economics,
              geopolitics, and how to protect your financial freedom
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lessons"
                className="inline-block px-8 py-3 bg-brand-yellow text-black font-semibold rounded-lg
                         hover:bg-yellow-500 transition-colors"
              >
                Start Learning →
              </Link>
              <Link
                href="/glossary"
                className="inline-block px-8 py-3 bg-transparent border-2 border-brand-yellow text-brand-yellow
                         font-semibold rounded-lg hover:bg-brand-yellow/10 transition-colors"
              >
                View Glossary
              </Link>
            </div>
          </div>
        </div>

        {/* Educational Note */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <p className="text-sm text-gray-500">
            All tools are for educational purposes only. Not financial advice.
            Always do your own research and consult with financial professionals before making investment decisions.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
