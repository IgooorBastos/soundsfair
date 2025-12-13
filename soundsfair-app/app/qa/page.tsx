import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QAForm from "@/components/qa/QAForm";

export const metadata = {
  title: "Ask a Bitcoin Expert - Lightning-Paid Q&A | soundsfair",
  description: "Get your Bitcoin questions answered by experts. Pay with Lightning Network and receive personalized responses within 24-168 hours.",
};

export default function QAPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-charcoal border border-border-gold rounded-full mb-6">
            <span className="text-semantic-lightning text-sm font-semibold">
              ⚡ LIGHTNING NETWORK POWERED
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ask a <span className="text-brand-gold">Bitcoin Expert</span>
          </h1>

          <p className="text-xl text-text-secondary leading-relaxed mb-8">
            Get personalized answers to your Bitcoin questions. Pay instantly with
            Lightning Network and receive expert responses based on your chosen tier.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-text-tertiary">
            <div className="flex items-center gap-2">
              <span className="text-semantic-success">✓</span>
              <span>Expert Answers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-semantic-success">✓</span>
              <span>Lightning Fast Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-semantic-success">✓</span>
              <span>No Account Required</span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-surface-charcoal border border-border-default rounded-card p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-brand-gold/10 rounded-full mb-4">
                <span className="text-2xl font-bold text-brand-gold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Submit Your Question</h3>
              <p className="text-text-tertiary">
                Fill out the form with your Bitcoin question and select a pricing tier
                that matches your needs.
              </p>
            </div>

            <div className="bg-surface-charcoal border border-border-default rounded-card p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-brand-gold/10 rounded-full mb-4">
                <span className="text-2xl font-bold text-brand-gold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Pay with Lightning</h3>
              <p className="text-text-tertiary">
                Receive a Lightning invoice instantly. Pay with any Lightning wallet
                in seconds.
              </p>
            </div>

            <div className="bg-surface-charcoal border border-border-default rounded-card p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-brand-gold/10 rounded-full mb-4">
                <span className="text-2xl font-bold text-brand-gold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Your Answer</h3>
              <p className="text-text-tertiary">
                Receive a comprehensive answer via email within the timeframe of
                your chosen tier.
              </p>
            </div>
          </div>
        </section>

        {/* QA Form Component */}
        <section className="max-w-4xl mx-auto mb-16">
          <QAForm />
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-surface-charcoal border border-border-default rounded-card p-8">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-gold mb-2">
                  Why Lightning Network?
                </h3>
                <p className="text-text-tertiary">
                  Lightning Network enables instant, low-fee Bitcoin payments. You can pay
                  as little as 1,000 sats (around $1) without worrying about high transaction
                  fees or long confirmation times.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand-gold mb-2">
                  Do I need an account?
                </h3>
                <p className="text-text-tertiary">
                  No! We only need your email address to send you the answer. No registration,
                  no passwords, no KYC. Just pay and receive your response.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand-gold mb-2">
                  What if my question is already answered?
                </h3>
                <p className="text-text-tertiary">
                  Check our public Q&A archive first. If your question has been answered before
                  and made public, you can read it for free!
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand-gold mb-2">
                  Can my answer be made public?
                </h3>
                <p className="text-text-tertiary">
                  Yes! When submitting your question, you can choose to allow your answer to be
                  published in our public archive (anonymously). This helps other learners and
                  builds a valuable knowledge base.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand-gold mb-2">
                  What's included in a Video Response?
                </h3>
                <p className="text-text-tertiary">
                  The Video Response tier includes a personalized video explanation (5-10 minutes)
                  where our expert walks through your question in detail, often with screen sharing,
                  charts, or demonstrations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
