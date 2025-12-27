import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentBanner from "@/components/ui/ContentBanner";
import PodcastCard from "@/components/resources/PodcastCard";
import { CyberGrid, ScanLines, GlowOrb } from "@/components/effects";
import { podcasts, getPodcastsByCategory } from "@/data/podcasts";

export const metadata: Metadata = {
  title: "Bitcoin Podcasts - Best Shows for Learning | soundsfair",
  description: "Curated collection of the best Bitcoin podcasts. From beginner-friendly shows to technical deep dives, news, and interviews with Bitcoin builders.",
  keywords: ["bitcoin podcasts", "crypto podcasts", "bitcoin education podcasts", "sound money podcast", "bitcoin news", "learn bitcoin"],
  openGraph: {
    title: "Best Bitcoin Podcasts - soundsfair",
    description: "The best podcasts to learn about Bitcoin, sound money, and economic freedom",
    url: "/resources/podcasts",
    siteName: "soundsfair",
    images: [{
      url: "/og-podcasts.png",
      width: 1200,
      height: 630,
      alt: "soundsfair Bitcoin Podcasts"
    }],
    locale: "en_US",
    type: "website",
  },
};

export default function PodcastsPage() {
  const beginnerPodcasts = getPodcastsByCategory('beginner');
  const intermediatePodcasts = getPodcastsByCategory('intermediate');
  const newsPodcasts = getPodcastsByCategory('news');
  const technicalPodcasts = getPodcastsByCategory('technical');

  return (
    <div className="min-h-screen bg-surface-black relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid intensity="low" animated={true} />
      <ScanLines opacity={0.02} />

      <Header />

      <main className="relative z-10">
        {/* Hero Banner */}
        <ContentBanner
          imageSrc="/images/banners/podcasts-hero.jpg"
          imageAlt="Person listening to Bitcoin podcast with headphones"
          subtitle="Audio Learning"
          title="Top Bitcoin Podcasts"
          description="Learn Bitcoin through conversations with builders, economists, and experts. The best podcasts for continuous education while you commute, exercise, or relax."
        />

        {/* Breadcrumb */}
        <section className="container mx-auto px-6 py-6">
          <div className="text-sm text-text-tertiary">
            <a href="/" className="hover:text-brand-gold transition-colors">Home</a>
            {' > '}
            <span className="text-brand-gold">Podcasts</span>
          </div>
        </section>

        {/* Beginner Podcasts */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '90%', y: '30%' }} size="lg" color="gold" opacity={0.1} />

          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-semantic-success/10 border border-semantic-success/30 rounded-full text-semantic-success font-mono text-sm uppercase tracking-wider mb-4">
              Beginner Friendly
            </span>
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Start <span className="text-brand-gold text-shadow-glow">Listening</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl">
              Perfect first podcasts for Bitcoin newcomers. Accessible conversations, inspiring stories, and clear explanations without overwhelming technical jargon.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beginnerPodcasts.map((podcast, index) => (
              <PodcastCard key={podcast.id} podcast={podcast} priority={index < 3} />
            ))}
          </div>
        </section>

        {/* Intermediate Podcasts */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '10%', y: '50%' }} size="md" color="orange" opacity={0.1} />

          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full text-brand-orange font-mono text-sm uppercase tracking-wider mb-4">
              Intermediate
            </span>
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Deep <span className="text-brand-gold text-shadow-glow">Conversations</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl">
              Explore Bitcoin economics, philosophy, and culture with thoughtful hosts and expert guests. Perfect for continuous learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {intermediatePodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        </section>

        {/* Technical Podcasts */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '85%', y: '60%' }} size="lg" color="gold" opacity={0.1} />

          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-semantic-lightning/10 border border-semantic-lightning/30 rounded-full text-semantic-lightning font-mono text-sm uppercase tracking-wider mb-4">
              Technical
            </span>
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Protocol <span className="text-brand-gold text-shadow-glow">Deep Dives</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl">
              Highly technical discussions with Bitcoin Core developers and researchers. For developers and those who want protocol-level understanding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalPodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        </section>

        {/* News Podcasts */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '15%', y: '70%' }} size="md" color="orange" opacity={0.1} />

          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-vi-blue/10 border border-vi-blue/30 rounded-full text-vi-blue font-mono text-sm uppercase tracking-wider mb-4">
              News & Analysis
            </span>
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Stay <span className="text-brand-gold text-shadow-glow">Updated</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl">
              Daily and weekly Bitcoin news, market analysis, and updates from the ecosystem. Stay informed about what's happening in Bitcoin.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsPodcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center relative">
          <GlowOrb position={{ x: '50%', y: '50%' }} size="xl" color="gold" opacity={0.15} />

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-h2 font-display text-text-primary mb-6">
              Prefer <span className="text-brand-gold text-shadow-glow">Reading</span>?
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              Check out our curated list of essential Bitcoin books, or dive into our interactive course with 9 progressive lessons.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/resources/books"
                className="
                  inline-block
                  px-8
                  py-4
                  bg-brand-gold
                  text-surface-black
                  font-display
                  font-semibold
                  uppercase
                  tracking-wider
                  rounded-lg
                  hover:bg-brand-gold-hover
                  hover:shadow-glow-lg
                  transition-all
                  duration-300
                "
              >
                Browse Books
              </a>
              <a
                href="/lessons"
                className="
                  inline-block
                  px-8
                  py-4
                  bg-surface-charcoal
                  text-brand-gold
                  border-2
                  border-brand-gold
                  font-display
                  font-semibold
                  uppercase
                  tracking-wider
                  rounded-lg
                  hover:bg-brand-gold/10
                  hover:shadow-glow
                  transition-all
                  duration-300
                "
              >
                Start Course
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
