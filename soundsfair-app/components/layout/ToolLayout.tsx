import Header from "./Header";
import Footer from "./Footer";

interface ToolLayoutProps {
  children: React.ReactNode;
}

/**
 * Standard layout wrapper for all Bitcoin tools
 * Ensures consistent header/footer navigation across the tools hub
 */
export default function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
