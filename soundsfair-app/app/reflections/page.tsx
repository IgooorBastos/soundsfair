import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentBanner from "@/components/ui/ContentBanner";
import ArticleCard from "@/components/blog/ArticleCard";
import GlowButton from "@/components/ui/GlowButton";
import { CyberGrid, ScanLines, GlowOrb } from "@/components/effects";
import { getRecentPosts, getFeaturedPosts, categories } from "@/data/reflections";

export const metadata: Metadata = {
  title: "Reflections on Bitcoin & Sound Money | soundsfair",
  description: "Thoughts, analysis, and reflections on Bitcoin, economic freedom, sound money, and the path to financial sovereignty.",
  keywords: ["bitcoin blog", "sound money", "bitcoin philosophy", "economic freedom", "bitcoin thoughts", "bitcoin analysis"],
  openGraph: {
    title: "Bitcoin Reflections - soundsfair",
    description: "Thoughts on Bitcoin, sound money, and economic freedom",
    url: "/reflections",
    siteName: "soundsfair",
    images: [{
      url: "/og-reflections.png",
      width: 1200,
      height: 630,
      alt: "soundsfair Reflections"
    }],
    locale: "en_US",
    type: "website",
  },
};

export default function ReflectionsPage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts();

  return (
    <div className="min-h-screen bg-surface-black relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid intensity="low" animated={true} />
      <ScanLines opacity={0.02} />

      <Header />

      <main className="relative z-10">
        {/* Hero Banner */}
        <ContentBanner
          imageSrc="/images/banners/reflections-hero.jpg"
          imageAlt="Person writing thoughtful reflections on Bitcoin"
          subtitle="Insights & Analysis"
          title="Reflections on Bitcoin & Sound Money"
          description="Thoughts, analysis, and deep dives into Bitcoin, economic freedom, and the future of money. From philosophy to practicality."
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton href="#latest" variant="primary" size="md">
              Latest Posts
            </GlowButton>
            <GlowButton href="/substack" variant="outline" size="md">
              Subscribe Newsletter
            </GlowButton>
          </div>
        </ContentBanner>

        {/* Breadcrumb */}
        <section className="container mx-auto px-6 py-6">
          <div className="text-sm text-text-tertiary">
            <a href="/" className="hover:text-brand-gold transition-colors">Home</a>
            {' > '}
            <span className="text-brand-gold">Reflections</span>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="container mx-auto px-6 py-12 relative">
            <GlowOrb position={{ x: '90%', y: '30%' }} size="lg" color="gold" opacity={0.1} />

            <div className="mb-12">
              <span className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm uppercase tracking-wider mb-4">
                Featured
              </span>
              <h2 className="text-h2 font-display text-text-primary mb-4">
                Essential <span className="text-brand-gold text-shadow-glow">Reading</span>
              </h2>
              <p className="text-body-lg text-text-secondary max-w-3xl">
                In-depth analysis and thoughts on the most important topics in Bitcoin and economic freedom.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <ArticleCard key={post.id} post={post} featured={index === 0} priority={index < 2} />
              ))}
            </div>
          </section>
        )}

        {/* Latest Posts */}
        <section id="latest" className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '10%', y: '50%' }} size="md" color="orange" opacity={0.1} />

          <div className="mb-12">
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Latest <span className="text-brand-gold text-shadow-glow">Reflections</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl">
              Recent thoughts, analysis, and perspectives on Bitcoin, sound money, and the journey to economic sovereignty.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '85%', y: '60%' }} size="lg" color="gold" opacity={0.1} />

          <div className="mb-12 text-center">
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Explore by <span className="text-brand-gold text-shadow-glow">Topic</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl mx-auto mb-8">
              Find articles organized by category. From philosophical deep dives to practical family finance advice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/reflections?category=${category.id}`}
                className="
                  group
                  relative
                  bg-surface-charcoal
                  border-2
                  border-border-default
                  rounded-card
                  p-6
                  transition-all
                  duration-300
                  hover:border-brand-gold
                  hover:shadow-glow
                  hover:-translate-y-1
                  text-center
                "
              >
                <div className="absolute inset-0 bg-radial-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <h3 className={`text-h4 font-display mb-2 ${category.color} group-hover:text-shadow-glow transition-all`}>
                    {category.name}
                  </h3>
                  <p className="text-body-sm text-text-tertiary">
                    View all {category.name.toLowerCase()} articles
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="container mx-auto px-6 py-20 text-center relative">
          <GlowOrb position={{ x: '50%', y: '50%' }} size="xl" color="gold" opacity={0.15} />

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-h2 font-display text-text-primary mb-6">
              Never Miss a <span className="text-brand-gold text-shadow-glow">Reflection</span>
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              Subscribe to our newsletter for weekly insights on Bitcoin, sound money, and economic freedom delivered directly to your inbox.
            </p>
            <GlowButton href="/substack" variant="primary" size="lg">
              Subscribe to Newsletter
            </GlowButton>
          </div>
        </section>

        {/* Related Resources */}
        <section className="container mx-auto px-6 py-12 border-t border-border-default">
          <div className="text-center mb-8">
            <h3 className="text-h3 font-display text-text-primary mb-4">
              Continue <span className="text-brand-gold text-shadow-glow">Learning</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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

            <a
              href="/resources/podcasts"
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
              <div className="text-brand-gold text-4xl mb-4 group-hover:scale-110 transition-transform">🎙️</div>
              <h4 className="text-h5 font-display text-text-primary mb-2">Top Podcasts</h4>
              <p className="text-body-sm text-text-secondary">Best Bitcoin shows for continuous learning</p>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
