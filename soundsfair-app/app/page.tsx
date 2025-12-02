import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContinueLearning from "./components/ContinueLearning";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center py-20">
          <div className="max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Learn About{" "}
              <span className="text-brand-yellow">Fair Money</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              An educational platform about Bitcoin, economic freedom, and sound monetary principles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/lessons"
                className="px-8 py-4 bg-brand-yellow text-black font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Start Learning
              </Link>
              <Link
                href="/tools/dca"
                className="px-8 py-4 border-2 border-brand-yellow text-brand-yellow font-semibold rounded-lg hover:bg-brand-yellow hover:text-black transition-colors"
              >
                DCA Calculator
              </Link>
            </div>
          </div>
        </section>

        {/* Continue Learning Section (shows if user has progress) */}
        <section className="py-12">
          <ContinueLearning />
        </section>

        {/* Features Preview */}
        <section id="learn" className="py-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              What You'll Learn
            </h3>
            <p className="text-xl text-gray-400">
              From zero to advanced Bitcoin knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/lessons" className="group relative p-8 border-2 border-border-default rounded-card
                                             hover:border-brand-gold transition-all duration-300
                                             hover:-translate-y-2 hover:shadow-glow bg-surface-charcoal
                                             overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="text-brand-gold text-5xl mb-6 group-hover:scale-110 transition-transform">📚</div>
                <h4 className="text-2xl font-bold mb-4 group-hover:text-brand-gold transition-colors">
                  Educational Lessons
                </h4>
                <p className="text-text-secondary leading-relaxed mb-6">
                  5 comprehensive lessons covering Bitcoin as store of value, economic freedom, geopolitics, and protection strategies.
                </p>
                <span className="text-brand-gold text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Start Learning <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>

            <Link href="/tools/dca" className="group relative p-8 border-2 border-border-default rounded-card
                                             hover:border-brand-gold transition-all duration-300
                                             hover:-translate-y-2 hover:shadow-glow bg-surface-charcoal
                                             overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="text-brand-orange text-5xl mb-6 group-hover:scale-110 transition-transform">📊</div>
                <h4 className="text-2xl font-bold mb-4 group-hover:text-brand-gold transition-colors">
                  DCA Calculator
                </h4>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Compare Bitcoin performance against S&P500, Gold, and other assets with our interactive DCA calculator.
                </p>
                <span className="text-brand-gold text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Try Calculator <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>

            <Link href="/glossary" className="group relative p-8 border-2 border-border-default rounded-card
                                             hover:border-brand-gold transition-all duration-300
                                             hover:-translate-y-2 hover:shadow-glow bg-surface-charcoal
                                             overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="text-brand-gold text-5xl mb-6 group-hover:scale-110 transition-transform">📖</div>
                <h4 className="text-2xl font-bold mb-4 group-hover:text-brand-gold transition-colors">
                  Bitcoin Glossary
                </h4>
                <p className="text-text-secondary leading-relaxed mb-6">
                  50+ essential Bitcoin terms explained. Searchable, filterable, and easy to understand definitions.
                </p>
                <span className="text-brand-gold text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Browse Terms <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Quick Access Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              More Resources
            </h3>
            <p className="text-xl text-gray-400">
              Everything you need to master Bitcoin knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link href="/faq" className="group relative p-8 border-2 border-border-default rounded-card
                                         hover:border-brand-gold transition-all duration-300
                                         hover:-translate-y-1 hover:shadow-glow bg-surface-charcoal
                                         overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-start gap-4">
                <div className="text-brand-gold text-4xl group-hover:scale-110 transition-transform flex-shrink-0">❓</div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-3 group-hover:text-brand-gold transition-colors">
                    Frequently Asked Questions
                  </h4>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    20 comprehensive answers to the most common Bitcoin questions
                  </p>
                  <span className="text-brand-gold text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    View FAQs <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/glossary" className="group relative p-8 border-2 border-border-default rounded-card
                                             hover:border-brand-gold transition-all duration-300
                                             hover:-translate-y-1 hover:shadow-glow bg-surface-charcoal
                                             overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-start gap-4">
                <div className="text-brand-gold text-4xl group-hover:scale-110 transition-transform flex-shrink-0">📖</div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-3 group-hover:text-brand-gold transition-colors">
                    Bitcoin Glossary
                  </h4>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    50+ essential terms with clear definitions and related concepts
                  </p>
                  <span className="text-brand-gold text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Browse Glossary <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h3>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands learning about sound money and economic freedom.
            </p>
            <Link
              href="/lessons"
              className="inline-block px-8 py-4 bg-brand-yellow text-black font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Begin Learning Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
