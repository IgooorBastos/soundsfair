import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentBanner from "@/components/ui/ContentBanner";
import GlowButton from "@/components/ui/GlowButton";
import { CyberGrid, ScanLines, GlowOrb } from "@/components/effects";

/**
 * AI IMAGE GENERATION PROMPT for /public/images/banners/newsletter-hero.jpg:
 *
 * "Professional woman in her 30s reading email newsletter on tablet device,
 * sitting at modern desk with coffee, warm morning light from window,
 * focus on screen showing Bitcoin newsletter, clean minimalist workspace,
 * photorealistic photography, natural lighting, shallow depth of field, 8k quality"
 */

export const metadata: Metadata = {
  title: "Newsletter - Bitcoin Insights & Analysis | soundsfair",
  description: "Subscribe to our weekly Bitcoin newsletter for in-depth analysis, economic freedom insights, and sound money perspectives delivered to your inbox.",
  keywords: ["bitcoin newsletter", "bitcoin analysis", "sound money newsletter", "bitcoin insights", "crypto newsletter", "bitcoin education"],
  openGraph: {
    title: "soundsfair Newsletter - Bitcoin & Sound Money Insights",
    description: "Weekly Bitcoin analysis and economic freedom perspectives",
    url: "/substack",
    siteName: "soundsfair",
    images: [{
      url: "/og-newsletter.png",
      width: 1200,
      height: 630,
      alt: "soundsfair Newsletter"
    }],
    locale: "en_US",
    type: "website",
  },
};

/**
 * INSTRUCTIONS FOR PERSONALIZING THIS PAGE:
 *
 * 1. Replace SUBSTACK_USERNAME with your actual Substack username
 * 2. Update the embed code in the Subscribe Form section with your actual Substack embed
 * 3. Optionally: Add RSS feed integration to show recent posts
 * 4. Generate hero banner image using the AI prompt above
 *
 * SUBSTACK EMBED CODE:
 * Get your embed code from: https://YOUR_SUBSTACK.substack.com/publish/settings/advanced
 * Look for "Embed signup form" and copy the iframe code
 */

const SUBSTACK_USERNAME = "YOUR_SUBSTACK_USERNAME"; // EDIT THIS
const SUBSTACK_URL = `https://${SUBSTACK_USERNAME}.substack.com`;

export default function SubstackPage() {
  return (
    <div className="min-h-screen bg-surface-black relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid intensity="low" animated={true} />
      <ScanLines opacity={0.02} />

      <Header />

      <main className="relative z-10">
        {/* Hero Banner */}
        <ContentBanner
          imageSrc="/images/banners/newsletter-hero.jpg"
          imageAlt="Person reading Bitcoin newsletter on tablet"
          subtitle="Free Newsletter"
          title="Bitcoin Insights Delivered Weekly"
          description="Join thousands of readers getting weekly analysis, economic freedom perspectives, and sound money insights directly to their inbox. No spam, just signal."
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton href="#subscribe" variant="primary" size="md">
              Subscribe Now
            </GlowButton>
            <GlowButton href="#recent-posts" variant="outline" size="md">
              Recent Issues
            </GlowButton>
          </div>
        </ContentBanner>

        {/* Breadcrumb */}
        <section className="container mx-auto px-6 py-6">
          <div className="text-sm text-text-tertiary">
            <a href="/" className="hover:text-brand-gold transition-colors">Home</a>
            {' > '}
            <span className="text-brand-gold">Newsletter</span>
          </div>
        </section>

        {/* Why Subscribe */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '90%', y: '30%' }} size="lg" color="gold" opacity={0.1} />

          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm uppercase tracking-wider mb-4">
              Why Subscribe
            </span>
            <h2 className="text-h2 font-display text-text-primary mb-6">
              Your Weekly <span className="text-brand-gold text-shadow-glow">Signal</span> in the Noise
            </h2>
            <p className="text-body-lg text-text-secondary">
              In a world drowning in crypto hype and misinformation, our newsletter cuts through the noise with fact-based Bitcoin analysis, economic insights, and practical guidance for protecting your family's financial future.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-surface-charcoal border-2 border-border-default rounded-card p-6 hover:border-brand-gold transition-all duration-300">
              <div className="text-brand-gold text-4xl mb-4">📊</div>
              <h3 className="text-h4 font-display text-text-primary mb-3">Market Analysis</h3>
              <p className="text-body-sm text-text-secondary">
                Weekly Bitcoin market insights, macroeconomic trends, and geopolitical analysis that actually matters for your financial decisions.
              </p>
            </div>

            <div className="bg-surface-charcoal border-2 border-border-default rounded-card p-6 hover:border-brand-gold transition-all duration-300">
              <div className="text-brand-gold text-4xl mb-4">🧠</div>
              <h3 className="text-h4 font-display text-text-primary mb-3">Deep Thinking</h3>
              <p className="text-body-sm text-text-secondary">
                Philosophical and economic perspectives on money, freedom, and sovereignty. Learn the "why" behind Bitcoin, not just the "what".
              </p>
            </div>

            <div className="bg-surface-charcoal border-2 border-border-default rounded-card p-6 hover:border-brand-gold transition-all duration-300">
              <div className="text-brand-gold text-4xl mb-4">🛠️</div>
              <h3 className="text-h4 font-display text-text-primary mb-3">Practical Guidance</h3>
              <p className="text-body-sm text-text-secondary">
                Actionable strategies for protecting your wealth, teaching your family, and navigating the transition from fiat to sound money.
              </p>
            </div>
          </div>
        </section>

        {/* Subscribe Form */}
        <section id="subscribe" className="container mx-auto px-6 py-20 relative">
          <GlowOrb position={{ x: '50%', y: '50%' }} size="xl" color="gold" opacity={0.15} />

          <div className="max-w-2xl mx-auto relative z-10">
            <div className="bg-surface-charcoal border-2 border-brand-gold rounded-card p-8 md:p-12">
              <h2 className="text-h2 font-display text-text-primary mb-4 text-center">
                Subscribe to the <span className="text-brand-gold text-shadow-glow">Newsletter</span>
              </h2>
              <p className="text-body-lg text-text-secondary mb-8 text-center">
                Join our community of Bitcoin learners and economic freedom advocates.
              </p>

              {/* Substack Embed Placeholder */}
              <div className="bg-surface-dark border border-border-default rounded-lg p-8 text-center">
                <p className="text-text-tertiary font-mono text-sm mb-4">
                  📝 SUBSTACK EMBED GOES HERE
                </p>
                <p className="text-body-sm text-text-secondary mb-6">
                  To activate this form, edit <code className="bg-surface-black px-2 py-1 rounded text-semantic-lightning">app/substack/page.tsx</code> and replace the placeholder with your Substack embed code.
                </p>
                <p className="text-body-sm text-text-muted">
                  Get your embed code from: Substack → Settings → Advanced → Embed signup form
                </p>

                {/* Temporary direct link */}
                <div className="mt-8">
                  <GlowButton
                    href={SUBSTACK_URL}
                    variant="primary"
                    size="md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Subscribe on Substack →
                  </GlowButton>
                </div>
              </div>

              {/* Privacy Note */}
              <p className="text-xs text-text-muted mt-6 text-center">
                We respect your privacy. Unsubscribe anytime. No spam, ever.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Posts Preview */}
        <section id="recent-posts" className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '10%', y: '50%' }} size="md" color="orange" opacity={0.1} />

          <div className="mb-12 text-center">
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Recent <span className="text-brand-gold text-shadow-glow">Issues</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl mx-auto mb-6">
              See what you're missing. Browse our latest newsletter editions.
            </p>
          </div>

          {/* Placeholder for RSS Feed Integration */}
          <div className="max-w-4xl mx-auto bg-surface-charcoal border-2 border-border-default rounded-card p-12 text-center">
            <div className="text-brand-gold text-6xl mb-6">📬</div>
            <h3 className="text-h3 font-display text-text-primary mb-4">
              Newsletter Archive Coming Soon
            </h3>
            <p className="text-body-lg text-text-secondary mb-8">
              Once you add your Substack URL, recent newsletter issues will appear here automatically via RSS feed.
            </p>
            <p className="text-body-sm text-text-muted font-mono">
              To implement: Add RSS parsing logic in this component using your Substack RSS URL:<br />
              <code className="text-semantic-lightning">{SUBSTACK_URL}/feed</code>
            </p>

            {/* Temporary link to full archive */}
            <div className="mt-8">
              <GlowButton
                href={`${SUBSTACK_URL}/archive`}
                variant="outline"
                size="md"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Archive on Substack →
              </GlowButton>
            </div>
          </div>
        </section>

        {/* What You'll Get */}
        <section className="container mx-auto px-6 py-12 border-t border-border-default">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-h3 font-display text-text-primary mb-8 text-center">
              What You'll Get Every Week
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-brand-gold text-2xl mt-1">✅</div>
                <div>
                  <h4 className="text-h5 font-display text-text-primary mb-1">Market Commentary</h4>
                  <p className="text-body-sm text-text-secondary">
                    Bitcoin price analysis, on-chain metrics, macroeconomic context, and what it means for you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-brand-gold text-2xl mt-1">✅</div>
                <div>
                  <h4 className="text-h5 font-display text-text-primary mb-1">Economic Freedom Insights</h4>
                  <p className="text-body-sm text-text-secondary">
                    How Bitcoin relates to individual sovereignty, government overreach, and financial independence.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-brand-gold text-2xl mt-1">✅</div>
                <div>
                  <h4 className="text-h5 font-display text-text-primary mb-1">Family Finance Tips</h4>
                  <p className="text-body-sm text-text-secondary">
                    Practical strategies for protecting your family's wealth and teaching the next generation about sound money.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-brand-gold text-2xl mt-1">✅</div>
                <div>
                  <h4 className="text-h5 font-display text-text-primary mb-1">Curated Resources</h4>
                  <p className="text-body-sm text-text-secondary">
                    Best articles, podcasts, videos, and books we discovered this week. Only the signal, no noise.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-brand-gold text-2xl mt-1">✅</div>
                <div>
                  <h4 className="text-h5 font-display text-text-primary mb-1">Exclusive Insights</h4>
                  <p className="text-body-sm text-text-secondary">
                    Perspectives and analysis you won't find anywhere else, from an Austrian economics and libertarian viewpoint.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-h2 font-display text-text-primary mb-6">
              Ready to Level Up Your <span className="text-brand-gold text-shadow-glow">Bitcoin Knowledge</span>?
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              Join the newsletter today and get instant access to our subscriber-only resources and insights.
            </p>
            <GlowButton href="#subscribe" variant="primary" size="lg">
              Subscribe Now - It's Free
            </GlowButton>
          </div>
        </section>

        {/* Related Resources */}
        <section className="container mx-auto px-6 py-12 border-t border-border-default">
          <div className="text-center mb-8">
            <h3 className="text-h3 font-display text-text-primary mb-4">
              More <span className="text-brand-gold text-shadow-glow">Resources</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <a
              href="/reflections"
              className="
                group
                p-6
                bg-surface-charcoal
                border-2
                border-border-default
                rounded-card
                hover:border-brand-gold
                hover:shadow-glow
                transition-all
                duration-300
              "
            >
              <div className="text-brand-gold text-4xl mb-4 group-hover:scale-110 transition-transform">✍️</div>
              <h4 className="text-h5 font-display text-text-primary mb-2">Reflections</h4>
              <p className="text-body-sm text-text-secondary">Read our latest thoughts and analysis</p>
            </a>

            <a
              href="/lessons"
              className="
                group
                p-6
                bg-surface-charcoal
                border-2
                border-border-default
                rounded-card
                hover:border-brand-gold
                hover:shadow-glow
                transition-all
                duration-300
              "
            >
              <div className="text-brand-gold text-4xl mb-4 group-hover:scale-110 transition-transform">📚</div>
              <h4 className="text-h5 font-display text-text-primary mb-2">Bitcoin Course</h4>
              <p className="text-body-sm text-text-secondary">9 progressive lessons from zero to advanced</p>
            </a>

            <a
              href="/resources/books"
              className="
                group
                p-6
                bg-surface-charcoal
                border-2
                border-border-default
                rounded-card
                hover:border-brand-gold
                hover:shadow-glow
                transition-all
                duration-300
              "
            >
              <div className="text-brand-gold text-4xl mb-4 group-hover:scale-110 transition-transform">📖</div>
              <h4 className="text-h5 font-display text-text-primary mb-2">Recommended Books</h4>
              <p className="text-body-sm text-text-secondary">Curated reading list for Bitcoin mastery</p>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
