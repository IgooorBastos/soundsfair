"use client";

import { PricingTier } from "@/app/types/qa";

interface PricingTierOption {
  id: PricingTier;
  name: string;
  description: string;
  amountSats: number;
  responseTime: string;
  responseFormat: string;
  features: string[];
}

const PRICING_TIERS: PricingTierOption[] = [
  {
    id: "quick",
    name: "Quick Answer",
    description: "Fast response for straightforward questions",
    amountSats: 1000,
    responseTime: "24 hours",
    responseFormat: "Text (1-2 paragraphs)",
    features: [
      "1-2 paragraph response",
      "Delivered within 24 hours",
      "Email notification",
      "Can be made public",
    ],
  },
  {
    id: "detailed",
    name: "Detailed Answer",
    description: "Comprehensive response with examples and context",
    amountSats: 5000,
    responseTime: "48 hours",
    responseFormat: "Text (detailed)",
    features: [
      "Comprehensive explanation",
      "Examples and context",
      "Delivered within 48 hours",
      "Email notification",
      "Can be made public",
    ],
  },
  {
    id: "video",
    name: "Video Response",
    description: "Personalized video explanation from expert",
    amountSats: 20000,
    responseTime: "1 week",
    responseFormat: "Video (5-10 min)",
    features: [
      "5-10 minute video",
      "Screen sharing & demos",
      "Personalized explanation",
      "Delivered within 1 week",
      "Email notification with link",
    ],
  },
];

interface PricingTierSelectorProps {
  selectedTier: PricingTier | null;
  onSelectTier: (tier: PricingTier) => void;
  className?: string;
}

export default function PricingTierSelector({
  selectedTier,
  onSelectTier,
  className = "",
}: PricingTierSelectorProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-text-secondary mb-3">
        Select Pricing Tier <span className="text-semantic-error">*</span>
      </label>

      <div className="grid md:grid-cols-3 gap-4">
        {PRICING_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const isPopular = tier.id === "detailed";

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelectTier(tier.id)}
              className={`
                relative text-left p-6 rounded-card border-2 transition-all
                ${
                  isSelected
                    ? "border-brand-gold bg-brand-gold/5 shadow-glow"
                    : "border-border-default bg-surface-charcoal hover:border-border-muted"
                }
              `}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-brand-gold text-black text-xs font-bold rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {tier.description}
                  </p>
                </div>

                <div
                  className={`
                  flex-shrink-0 w-5 h-5 rounded-full border-2 ml-2 mt-1
                  ${
                    isSelected
                      ? "border-brand-gold bg-brand-gold"
                      : "border-border-muted"
                  }
                `}
                >
                  {isSelected && (
                    <svg
                      className="w-full h-full text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-brand-gold">
                    {tier.amountSats.toLocaleString()}
                  </span>
                  <span className="text-sm text-text-muted">sats</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  ≈ ${((tier.amountSats / 100000000) * 100000).toFixed(2)} USD
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-brand-gold">⚡</span>
                  <span className="text-text-tertiary">{tier.responseTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-brand-gold">📝</span>
                  <span className="text-text-tertiary">
                    {tier.responseFormat}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-semantic-success flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-text-tertiary">{feature}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-text-muted mt-4">
        All payments are processed instantly via Lightning Network. You&apos;ll receive
        an invoice after submitting your question.
      </p>
    </div>
  );
}
