import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { promises as fs } from "fs";
import path from "path";
import { marked } from "marked";

export const metadata: Metadata = {
  title: "Cookie Policy | soundsfair",
  description: "Information about how soundsfair uses cookies and similar technologies.",
  robots: "index, follow",
};

export default async function CookiePolicyPage() {
  // Read cookie policy markdown
  const filePath = path.join(process.cwd(), "content", "legal", "cookie-policy.md");
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
          <span className="text-brand-gold">Cookie Policy</span>
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
                          prose-table:text-sm
                          prose-th:bg-surface-dark
                          prose-th:text-brand-gold
                          prose-td:border-border-default
                          prose-th:border-border-default">
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
