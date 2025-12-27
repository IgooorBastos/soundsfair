import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentBanner from "@/components/ui/ContentBanner";
import VideoCard from "@/components/resources/VideoCard";
import GlowButton from "@/components/ui/GlowButton";
import { CyberGrid, ScanLines, GlowOrb } from "@/components/effects";
import { getFeaturedVideos, getVideosByCategory, videoCategories } from "@/data/videos";

/**
 * AI IMAGE GENERATION PROMPT for /public/images/banners/videos-hero.jpg:
 *
 * "Young professional watching educational video on laptop,
 * taking notes in notebook, modern home office setup with plants and warm lighting,
 * laptop screen showing YouTube video about Bitcoin,
 * focused expression, natural daylight from window,
 * photorealistic photography, cinematic composition, 8k quality"
 */

export const metadata: Metadata = {
  title: "Bitcoin Videos - Curated YouTube Library | soundsfair",
  description: "Hand-picked Bitcoin videos from the best educators. Tutorials, documentaries, debates, and deep dives curated for every learning level.",
  keywords: ["bitcoin videos", "bitcoin youtube", "bitcoin tutorials", "bitcoin documentaries", "bitcoin education videos", "learn bitcoin"],
  openGraph: {
    title: "Bitcoin Video Library - Curated & Reviewed | soundsfair",
    description: "Best Bitcoin videos from YouTube with curator notes and key takeaways",
    url: "/resources/videos",
    siteName: "soundsfair",
    images: [{
      url: "/og-videos.png",
      width: 1200,
      height: 630,
      alt: "soundsfair Video Library"
    }],
    locale: "en_US",
    type: "website",
  },
};

export default function VideosPage() {
  const featuredVideos = getFeaturedVideos();
  const beginnerVideos = getVideosByCategory('beginner');
  const intermediateVideos = getVideosByCategory('intermediate');
  const advancedVideos = getVideosByCategory('advanced');
  const documentaries = getVideosByCategory('documentary');
  const debates = getVideosByCategory('debate');
  const interviews = getVideosByCategory('interview');

  return (
    <div className="min-h-screen bg-surface-black relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid intensity="low" animated={true} />
      <ScanLines opacity={0.02} />

      <Header />

      <main className="relative z-10">
        {/* Hero Banner */}
        <ContentBanner
          imageSrc="/images/banners/videos-hero.jpg"
          imageAlt="Person watching Bitcoin educational videos"
          subtitle="Curated Video Library"
          title="Learn Bitcoin from the Best"
          description="Hand-picked videos from top Bitcoin educators, thinkers, and practitioners. Every video reviewed with curator notes and key takeaways."
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GlowButton href="#featured" variant="primary" size="md">
              Featured Videos
            </GlowButton>
            <GlowButton href="#categories" variant="outline" size="md">
              Browse by Category
            </GlowButton>
          </div>
        </ContentBanner>

        {/* Breadcrumb */}
        <section className="container mx-auto px-6 py-6">
          <div className="text-sm text-text-tertiary">
            <a href="/" className="hover:text-brand-gold transition-colors">Home</a>
            {' > '}
            <a href="/resources" className="hover:text-brand-gold transition-colors">Resources</a>
            {' > '}
            <span className="text-brand-gold">Videos</span>
          </div>
        </section>

        {/* Featured Videos */}
        {featuredVideos.length > 0 && (
          <section id="featured" className="container mx-auto px-6 py-12 relative">
            <GlowOrb position={{ x: '90%', y: '30%' }} size="lg" color="gold" opacity={0.1} />

            <div className="mb-12">
              <span className="inline-block px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-brand-gold font-mono text-sm uppercase tracking-wider mb-4">
                Featured
              </span>
              <h2 className="text-h2 font-display text-text-primary mb-4">
                Essential <span className="text-brand-gold text-shadow-glow">Watching</span>
              </h2>
              <p className="text-body-lg text-text-secondary max-w-3xl">
                Start here. These videos are fundamental to understanding Bitcoin and should be required viewing for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVideos.map((video, index) => (
                <VideoCard key={video.id} video={video} priority={index < 3} />
              ))}
            </div>
          </section>
        )}

        {/* Beginner Videos */}
        {beginnerVideos.length > 0 && (
          <section className="container mx-auto px-6 py-12 relative">
            <GlowOrb position={{ x: '10%', y: '40%' }} size="md" color="orange" opacity={0.1} />

            <div className="mb-8">
              <h2 className="text-h2 font-display text-text-primary mb-4">
                <span className="text-semantic-success text-shadow-glow">Beginner</span> Friendly
              </h2>
              <p className="text-body-lg text-text-secondary max-w-3xl">
                New to Bitcoin? Start with these accessible introductions that assume zero prior knowledge.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beginnerVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Intermediate Videos */}
        {intermediateVideos.length > 0 && (
          <section className="container mx-auto px-6 py-12 relative">
            <div className="mb-8">
              <h2 className="text-h2 font-display text-text-primary mb-4">
                <span className="text-brand-gold text-shadow-glow">Intermediate</span> Deep Dives
              </h2>
              <p className="text-body-lg text-text-secondary max-w-3xl">
                Ready to go deeper. These videos explore Bitcoin's economics, philosophy, and practical usage.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {intermediateVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Advanced Videos */}
        {advancedVideos.length > 0 && (
          <section className="container mx-auto px-6 py-12 relative">
            <GlowOrb position={{ x: '85%', y: '60%' }} size="lg" color="gold" opacity={0.1} />

            <div className="mb-8">
              <h2 className="text-h2 font-display text-text-primary mb-4">
                <span className="text-brand-orange text-shadow-glow">Advanced</span> Technical Content
              </h2>
              <p className="text-body-lg text-text-secondary max-w-3xl">
                For serious Bitcoiners. Technical deep dives into Lightning Network, protocols, and advanced concepts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advancedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Documentaries */}
        {documentaries.length > 0 && (
          <section className="container mx-auto px-6 py-12 relative">
            <div className="mb-8">
              <h2 className="text-h2 font-display text-text-primary mb-4">
                <span className="text-vi-blue text-shadow-glow">Documentaries</span> & Long-Form
              </h2>
              <p className="text-body-lg text-text-secondary max-w-3xl">
                Feature-length documentaries exploring Bitcoin's history, philosophy, and impact on the world.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {documentaries.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Debates */}
        {debates.length > 0 && (
          <section className="container mx-auto px-6 py-12 relative">
            <div className="mb-8">
              <h2 className="text-h2 font-display text-text-primary mb-4">
                <span className="text-semantic-lightning text-shadow-glow">Debates</span> & Counterarguments
              </h2>
              <p className="text-body-lg text-text-secondary max-w-3xl">
                Intellectual battles. Watch Bitcoin advocates defend against critics and strengthen your understanding.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {debates.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Interviews */}
        {interviews.length > 0 && (
          <section className="container mx-auto px-6 py-12 relative">
            <div className="mb-8">
              <h2 className="text-h2 font-display text-text-primary mb-4">
                <span className="text-text-tertiary text-shadow-glow">Interviews</span> & Conversations
              </h2>
              <p className="text-body-lg text-text-secondary max-w-3xl">
                Long-form conversations with Bitcoin's brightest minds. Deep insights and personal perspectives.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {interviews.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Browse by Category */}
        <section id="categories" className="container mx-auto px-6 py-12 relative border-t border-border-default">
          <GlowOrb position={{ x: '50%', y: '50%' }} size="xl" color="gold" opacity={0.1} />

          <div className="mb-12 text-center">
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Browse by <span className="text-brand-gold text-shadow-glow">Category</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl mx-auto">
              Jump to the type of content that interests you most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {videoCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
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
                    View all {category.name.toLowerCase()} videos
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Curator's Note */}
        <section className="container mx-auto px-6 py-20 text-center relative">
          <GlowOrb position={{ x: '50%', y: '50%' }} size="lg" color="gold" opacity={0.15} />

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-h2 font-display text-text-primary mb-6">
              Why <span className="text-brand-gold text-shadow-glow">Curation</span> Matters
            </h2>
            <p className="text-body-lg text-text-secondary mb-6">
              YouTube has thousands of Bitcoin videos. Most are noise. Some are misinformation. A precious few are signal.
            </p>
            <p className="text-body-lg text-text-secondary mb-8">
              Every video in this library has been watched, evaluated, and annotated with curator notes explaining why it's valuable and what you'll learn. Your time is precious—spend it on content that matters.
            </p>
            <GlowButton href="/reflections" variant="primary" size="md">
              Read Our Reflections
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
