import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { promises as fs } from "fs";
import path from "path";
import { marked } from "marked";

export const metadata: Metadata = {
  title: "Disclaimer | soundsfair",
  description: "Legal disclaimer for soundsfair Bitcoin education platform. Not financial advice.",
  robots: "index, follow",
};

export default async function DisclaimerPage() {
  // Read disclaimer markdown
  const filePath = path.join(process.cwd(), "content", "legal", "disclaimer.md");
  const fileContent = await fs.readFile(filePath, "utf8");
  const htmlContent = marked(fileContent);

  return (
    <div className="min-h-screen bg-surface-black">
      <Header />

      <main className="container mx-auto px-6 py-20">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-text-tertiary">
          <a href="/" className="hover:text-brand-gold transition-colors">Home</a>
          {' > '}
          <span className="text-brand-gold">Disclaimer</span>
        </div>

        {/* Warning Banner */}
        <div className="max-w-4xl mx-auto mb-12 p-6 bg-semantic-error/10 border-2 border-semantic-error/30 rounded-card">
          <div className="flex items-start gap-4">
            <div className="text-semantic-error text-3xl">⚠️</div>
            <div>
              <h2 className="text-h4 font-display text-semantic-error mb-2">
                Important Legal Notice
              </h2>
              <p className="text-body-sm text-text-secondary">
                This is educational content only. Not financial, investment, legal, or tax advice.
                You are 100% responsible for your own financial decisions. Read this disclaimer carefully.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="max-w-4xl mx-auto prose prose-invert prose-lg
                          prose-headings:font-display
                          prose-headings:text-brand-gold
                          prose-a:text-brand-gold
                          prose-a:no-underline
                          prose-a:hover:text-shadow-glow
                          prose-strong:text-brand-gold
                          prose-code:text-semantic-lightning
                          prose-code:bg-surface-dark
                          prose-code:px-2
                          prose-code:py-1
                          prose-code:rounded
                          prose-ul:text-text-secondary
                          prose-ol:text-text-secondary
                          prose-blockquote:border-l-brand-gold
                          prose-blockquote:bg-surface-dark
                          prose-blockquote:p-4
                          prose-blockquote:rounded">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </article>

        {/* Last Updated */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-border-default">
          <p className="text-sm text-text-muted">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
