import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CinematicHero from "@/components/ui/CinematicHero";
import FeatureCard from "@/components/ui/FeatureCard";
import GlowButton from "@/components/ui/GlowButton";
import { CyberGrid, ScanLines, GlowOrb } from "@/components/effects";
import ContinueLearning from "@/components/ui/ContinueLearning";

export const metadata: Metadata = {
  title: "soundsfair - Learn Bitcoin & Fair Money | Economic Freedom Education",
  description: "Educational platform about Bitcoin, fair money, economic freedom, and sound monetary principles. Learn from zero to advanced with interactive lessons, tools, and expert Q&A.",
  keywords: ["Bitcoin", "cryptocurrency", "economic freedom", "fair money", "sound money", "Austrian economics", "DCA calculator", "Bitcoin education"],
  openGraph: {
    title: "soundsfair - Learn Bitcoin & Fair Money",
    description: "Educational platform about Bitcoin, fair money, economic freedom, and sound monetary principles.",
    url: "/",
    siteName: "soundsfair",
    images: [{
      url: "/og-default.png",
      width: 1200,
      height: 630,
      alt: "soundsfair - Bitcoin Education Platform"
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "soundsfair - Learn Bitcoin & Fair Money",
    description: "Educational platform about Bitcoin, fair money, economic freedom, and sound monetary principles.",
    images: ["/og-default.png"],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-black relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid intensity="medium" animated={true} />
      <ScanLines opacity={0.03} />

      <Header />

      <main className="relative z-10">
        {/* Cinematic Hero Section */}
        <CinematicHero
          subtitle="The Future of Money"
          title="Learn Bitcoin. Embrace Sound Money. Achieve Economic Freedom."
          description="Master Bitcoin from zero to advanced with our comprehensive course, interactive tools, and expert guidance. Join the monetary revolution."
          cta={{
            text: "Start Learning",
            href: "/lessons"
          }}
          secondaryCta={{
            text: "Explore Tools",
            href: "/tools"
          }}
        />

        {/* Continue Learning Section (shows if user has progress) */}
        <section className="container mx-auto px-6 py-12">
          <ContinueLearning />
        </section>

        {/* Tools Showcase */}
        <section className="container mx-auto px-6 py-20 relative">
          {/* Background accent */}
          <GlowOrb position={{ x: '90%', y: '50%' }} size="xl" color="gold" opacity={0.15} />

          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm uppercase tracking-wider mb-6">
              Interactive Tools
            </span>
            <h2 className="text-h1 font-display text-text-primary mb-4">
              Powerful <span className="text-brand-gold text-shadow-glow">Bitcoin</span> Tools
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Calculators, converters, and real-time data to help you understand Bitcoin's value and potential
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <FeatureCard
              icon="⚡"
              title="DCA Calculator"
              description="Compare Bitcoin's Dollar-Cost Averaging performance against traditional assets."
              features={[
                "Multi-asset comparison (BTC, S&P500, Gold, MSCI World)",
                "Historical data visualization",
                "CSV export and shareable links"
              ]}
              href="/tools/dca"
              ctaText="Calculate Returns"
            />

            <FeatureCard
              icon="🔄"
              title="Satoshi Converter"
              description="Instantly convert between Bitcoin, Satoshis, and fiat currencies."
              features={[
                "Real-time price data",
                "Multiple fiat currencies",
                "Quick conversion presets"
              ]}
              href="/tools/satoshi-converter"
              ctaText="Convert Now"
            />

            <FeatureCard
              icon="😱"
              title="Fear & Greed Index"
              description="Track Bitcoin market sentiment and make informed decisions."
              features={[
                "Real-time sentiment analysis",
                "Historical trends",
                "Color-coded indicators"
              ]}
              href="/tools/fear-greed-index"
              ctaText="Check Sentiment"
            />

            <FeatureCard
              icon="📈"
              title="What-If Calculator"
              description="Discover what your investment would be worth if you bought Bitcoin earlier."
              features={[
                "Historical return calculations",
                "Annualized performance metrics",
                "ROI visualization"
              ]}
              href="/tools/what-if-calculator"
              ctaText="Calculate What-If"
            />

            <FeatureCard
              icon="⏰"
              title="Halving Countdown"
              description="Track the next Bitcoin halving event and supply reduction."
              features={[
                "Live countdown timer",
                "Block height tracking",
                "Historical halving data"
              ]}
              href="/tools/halving-countdown"
              ctaText="View Countdown"
            />

            <FeatureCard
              icon="🎯"
              title="All Tools"
              description="Explore our complete suite of Bitcoin educational tools and calculators."
              features={[
                "5+ interactive calculators",
                "Real-time data feeds",
                "Mobile-optimized"
              ]}
              href="/tools"
              ctaText="Browse All Tools"
            />
          </div>
        </section>

        {/* Course Preview */}
        <section className="container mx-auto px-6 py-20 relative">
          {/* Background accent */}
          <GlowOrb position={{ x: '10%', y: '50%' }} size="lg" color="orange" opacity={0.15} />

          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm uppercase tracking-wider mb-6">
              Education
            </span>
            <h2 className="text-h1 font-display text-text-primary mb-4">
              The Complete <span className="text-brand-gold text-shadow-glow">Bitcoin</span> Course
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              9 progressive lessons covering everything from fiat system failures to Bitcoin as economic freedom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            <FeatureCard
              icon="🎓"
              title="Beginner Friendly"
              description="Start from zero with clear explanations of the fiat system, banking, and Bitcoin basics."
              features={[
                "Level 1-3: Foundation",
                "No prior knowledge needed",
                "Interactive quizzes"
              ]}
              href="/lessons?difficulty=beginner"
              ctaText="Start Beginner"
            />

            <FeatureCard
              icon="📊"
              title="Intermediate Depth"
              description="Understand Bitcoin's role in geopolitics, economics, and as a store of value."
              features={[
                "Level 4-6: Core Concepts",
                "Economic freedom analysis",
                "Geopolitical implications"
              ]}
              href="/lessons?difficulty=intermediate"
              ctaText="Explore Intermediate"
            />

            <FeatureCard
              icon="🚀"
              title="Advanced Strategies"
              description="Master protection strategies, future scenarios, and achieve true financial sovereignty."
              features={[
                "Level 7-9: Expert Topics",
                "Protection strategies",
                "Future of Bitcoin"
              ]}
              href="/lessons?difficulty=advanced"
              ctaText="Master Advanced"
            />
          </div>

          <div className="text-center">
            <GlowButton href="/lessons" variant="primary" size="lg">
              View All Lessons
            </GlowButton>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="container mx-auto px-6 py-20 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm uppercase tracking-wider mb-6">
              Resources
            </span>
            <h2 className="text-h1 font-display text-text-primary mb-4">
              Knowledge <span className="text-brand-gold text-shadow-glow">Base</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
              Everything you need to understand Bitcoin terminology and common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="relative group">
              <Link href="/glossary">
                <div className="
                  bg-surface-charcoal
                  border-2
                  border-border-default
                  rounded-card
                  p-8
                  transition-all
                  duration-300
                  hover:border-brand-gold
                  hover:shadow-glow
                  hover:-translate-y-2
                  cursor-pointer
                  overflow-hidden
                ">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-radial-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="text-brand-gold text-5xl mb-6 group-hover:scale-110 transition-transform">
                      📖
                    </div>
                    <h3 className="text-h3 font-display text-text-primary mb-3 group-hover:text-shadow-glow transition-all">
                      Bitcoin Glossary
                    </h3>
                    <p className="text-body text-text-secondary mb-6">
                      50+ essential Bitcoin terms with clear definitions, examples, and related concepts. Searchable and beginner-friendly.
                    </p>
                    <div className="flex items-center text-brand-gold font-display text-sm uppercase tracking-wider group-hover:text-shadow-glow transition-all">
                      <span>Browse Glossary</span>
                      <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="relative group">
              <Link href="/faq">
                <div className="
                  bg-surface-charcoal
                  border-2
                  border-border-default
                  rounded-card
                  p-8
                  transition-all
                  duration-300
                  hover:border-brand-gold
                  hover:shadow-glow
                  hover:-translate-y-2
                  cursor-pointer
                  overflow-hidden
                ">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-radial-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="text-brand-gold text-5xl mb-6 group-hover:scale-110 transition-transform">
                      ❓
                    </div>
                    <h3 className="text-h3 font-display text-text-primary mb-3 group-hover:text-shadow-glow transition-all">
                      FAQ
                    </h3>
                    <p className="text-body text-text-secondary mb-6">
                      20+ comprehensive answers to the most common questions about Bitcoin, security, privacy, and getting started.
                    </p>
                    <div className="flex items-center text-brand-gold font-display text-sm uppercase tracking-wider group-hover:text-shadow-glow transition-all">
                      <span>View FAQs</span>
                      <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-6 py-32 text-center relative">
          {/* Background accents */}
          <GlowOrb position={{ x: '30%', y: '50%' }} size="lg" color="gold" opacity={0.2} />
          <GlowOrb position={{ x: '70%', y: '50%' }} size="lg" color="orange" opacity={0.2} />

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-h1 font-display text-text-primary mb-6 leading-tight">
              Ready to Master <span className="text-brand-gold text-shadow-glow-lg">Sound Money</span>?
            </h2>
            <p className="text-body-lg text-text-secondary mb-12 max-w-2xl mx-auto">
              Join thousands learning about Bitcoin, economic freedom, and the future of money. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowButton href="/lessons" variant="primary" size="lg">
                Start Learning Now
              </GlowButton>
              <GlowButton href="/about" variant="outline" size="lg">
                About soundsfair
              </GlowButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
