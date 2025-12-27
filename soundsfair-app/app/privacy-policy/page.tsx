import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { promises as fs } from "fs";
import path from "path";
import { marked } from "marked";

export const metadata: Metadata = {
  title: "Privacy Policy | soundsfair",
  description: "Learn how soundsfair collects, uses, and protects your personal information.",
  robots: "index, follow",
};

export default async function PrivacyPolicyPage() {
  // Read privacy policy markdown
  const filePath = path.join(process.cwd(), "content", "legal", "privacy-policy.md");
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
          <span className="text-brand-gold">Privacy Policy</span>
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
                          prose-code:rounded">
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
