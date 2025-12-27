import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContentBanner from "@/components/ui/ContentBanner";
import BookCard from "@/components/resources/BookCard";
import { CyberGrid, ScanLines, GlowOrb } from "@/components/effects";
import { books, getBooksByCategory } from "@/data/books";

export const metadata: Metadata = {
  title: "Bitcoin Books - Essential Reading List | soundsfair",
  description: "Curated collection of the best Bitcoin books covering sound money, Austrian economics, technical deep dives, and economic freedom. From beginner to advanced.",
  keywords: ["bitcoin books", "sound money books", "austrian economics", "bitcoin reading list", "cryptocurrency books", "bitcoin education"],
  openGraph: {
    title: "Essential Bitcoin Reading List - soundsfair",
    description: "The best books to understand Bitcoin, sound money, and economic freedom",
    url: "/resources/books",
    siteName: "soundsfair",
    images: [{
      url: "/og-books.png",
      width: 1200,
      height: 630,
      alt: "soundsfair Bitcoin Books"
    }],
    locale: "en_US",
    type: "website",
  },
};

export default function BooksPage() {
  const beginnerBooks = getBooksByCategory('beginner');
  const intermediateBooks = getBooksByCategory('intermediate');
  const advancedBooks = getBooksByCategory('advanced');

  return (
    <div className="min-h-screen bg-surface-black relative overflow-hidden">
      {/* Background Effects */}
      <CyberGrid intensity="low" animated={true} />
      <ScanLines opacity={0.02} />

      <Header />

      <main className="relative z-10">
        {/* Hero Banner */}
        <ContentBanner
          imageSrc="/images/banners/books-hero.jpg"
          imageAlt="Person reading Bitcoin books in library"
          subtitle="Bitcoin Library"
          title="Essential Bitcoin Reading"
          description="Curated collection of the best books to understand Bitcoin, sound money, Austrian economics, and financial freedom. From beginner guides to advanced technical deep dives."
        />

        {/* Breadcrumb */}
        <section className="container mx-auto px-6 py-6">
          <div className="text-sm text-text-tertiary">
            <a href="/" className="hover:text-brand-gold transition-colors">Home</a>
            {' > '}
            <span className="text-brand-gold">Books</span>
          </div>
        </section>

        {/* Beginner Books */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '90%', y: '30%' }} size="lg" color="gold" opacity={0.1} />

          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-semantic-success/10 border border-semantic-success/30 rounded-full text-semantic-success font-mono text-sm uppercase tracking-wider mb-4">
              Beginner Friendly
            </span>
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Start Your <span className="text-brand-gold text-shadow-glow">Bitcoin</span> Journey
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl">
              Perfect first books for anyone new to Bitcoin. Clear explanations of why Bitcoin matters, how it works, and its potential to change the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beginnerBooks.map((book, index) => (
              <BookCard key={book.id} book={book} priority={index < 3} />
            ))}
          </div>
        </section>

        {/* Intermediate Books */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '10%', y: '50%' }} size="md" color="orange" opacity={0.1} />

          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full text-brand-orange font-mono text-sm uppercase tracking-wider mb-4">
              Intermediate
            </span>
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Deepen Your <span className="text-brand-gold text-shadow-glow">Understanding</span>
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl">
              Explore the economic, philosophical, and technical foundations of Bitcoin. Understand fiat money's flaws and Bitcoin's potential as sound money.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {intermediateBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Advanced Books */}
        <section className="container mx-auto px-6 py-12 relative">
          <GlowOrb position={{ x: '85%', y: '60%' }} size="lg" color="gold" opacity={0.1} />

          <div className="mb-12">
            <span className="inline-block px-4 py-2 bg-vi-red/10 border border-vi-red/30 rounded-full text-vi-red font-mono text-sm uppercase tracking-wider mb-4">
              Advanced
            </span>
            <h2 className="text-h2 font-display text-text-primary mb-4">
              Master the <span className="text-brand-gold text-shadow-glow">Technical</span> Details
            </h2>
            <p className="text-body-lg text-text-secondary max-w-3xl">
              Technical deep dives, protocol-level understanding, and the history of Bitcoin's development. For developers and serious students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center relative">
          <GlowOrb position={{ x: '50%', y: '50%' }} size="xl" color="gold" opacity={0.15} />

          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-h2 font-display text-text-primary mb-6">
              Ready to Start <span className="text-brand-gold text-shadow-glow">Learning</span>?
            </h2>
            <p className="text-body-lg text-text-secondary mb-8">
              Complement your reading with our interactive Bitcoin course. 9 progressive lessons covering everything from fiat failures to Bitcoin mastery.
            </p>
            <a
              href="/lessons"
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
              Start Free Course
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
