/**
 * VISUAL PATTERNS - Reusable Layout Components
 *
 * Purpose: Standardized visual patterns for educational content
 * Based on: Phase 1 visual identity system
 *
 * Patterns:
 * 1. ConceptExplainer - Title + Visual + Key Points
 * 2. ComparisonSplit - Side-by-side fiat vs Bitcoin
 * 3. ProcessFlow - Sequential step diagram
 */

import React, { ReactNode } from 'react';
import '../app/styles/visual-identity.css';

// ==========================================
// PATTERN 1: Concept Explainer
// ==========================================

interface ConceptExplainerProps {
  title: string;
  visual?: ReactNode;
  points: string[];
  className?: string;
}

export const ConceptExplainer: React.FC<ConceptExplainerProps> = ({
  title,
  visual,
  points,
  className = '',
}) => {
  return (
    <div className={`vi-concept-explainer ${className}`}>
      <h3 className="vi-concept-explainer__title">{title}</h3>

      {visual && (
        <div className="vi-concept-explainer__visual">
          {visual}
        </div>
      )}

      <ul className="vi-concept-explainer__points">
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

// ==========================================
// PATTERN 2: Comparison Split
// ==========================================

interface ComparisonItem {
  label: string;
  value: string;
}

interface ComparisonSideProps {
  title: string;
  type: 'fiat' | 'bitcoin';
  visual?: ReactNode;
  items: ComparisonItem[];
}

interface ComparisonSplitProps {
  fiatSide: ComparisonSideProps;
  bitcoinSide: ComparisonSideProps;
  className?: string;
}

export const ComparisonSplit: React.FC<ComparisonSplitProps> = ({
  fiatSide,
  bitcoinSide,
  className = '',
}) => {
  const renderSide = (side: ComparisonSideProps) => (
    <div className={`vi-comparison__side vi-comparison__side--${side.type}`}>
      <h4 className="vi-comparison__title">{side.title}</h4>

      {side.visual && (
        <div className="vi-comparison__visual">
          {side.visual}
        </div>
      )}

      <ul className="vi-comparison__list">
        {side.items.map((item, index) => (
          <li key={index}>
            <strong>{item.label}:</strong> {item.value}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className={`vi-comparison ${className}`}>
      {renderSide(fiatSide)}
      {renderSide(bitcoinSide)}
    </div>
  );
};

// ==========================================
// PATTERN 3: Process Flow
// ==========================================

interface ProcessStep {
  icon: ReactNode | string;
  label: string;
  description?: string;
}

interface ProcessFlowProps {
  steps: ProcessStep[];
  className?: string;
}

export const ProcessFlow: React.FC<ProcessFlowProps> = ({
  steps,
  className = '',
}) => {
  return (
    <div className={`vi-process ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="vi-process__step">
          <div className="vi-process__icon">
            {typeof step.icon === 'string' ? step.icon : step.icon}
          </div>
          <div className="vi-process__label">{step.label}</div>
          {step.description && (
            <div className="vi-process__description">{step.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

// ==========================================
// UTILITY: Visual Container
// ==========================================

interface VisualContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const VisualContainer: React.FC<VisualContainerProps> = ({
  children,
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`vi-spacing-component ${className}`}>
      {title && (
        <h3 className="text-2xl font-semibold text-vi-gold mb-2 text-center">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-text-muted text-center mb-6">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

// ==========================================
// EXAMPLE USAGE (for reference)
// ==========================================

/*
// EXAMPLE 1: Concept Explainer
<ConceptExplainer
  title="The Inflation Machine"
  points={[
    "Central banks print unlimited money",
    "Your savings lose purchasing power",
    "Hidden taxation through debasement"
  ]}
/>

// EXAMPLE 2: Comparison Split
<ComparisonSplit
  fiatSide={{
    title: "FIAT MONEY",
    type: "fiat",
    items: [
      { label: "Supply", value: "Unlimited" },
      { label: "Control", value: "Centralized" },
      { label: "Inflation", value: "Guaranteed" }
    ]
  }}
  bitcoinSide={{
    title: "BITCOIN",
    type: "bitcoin",
    items: [
      { label: "Supply", value: "Fixed 21M" },
      { label: "Control", value: "Decentralized" },
      { label: "Inflation", value: "None" }
    ]
  }}
/>

// EXAMPLE 3: Process Flow
<ProcessFlow
  steps={[
    { icon: "1", label: "Open Exchange", description: "Create account" },
    { icon: "2", label: "Set Up DCA", description: "Auto-buy weekly" },
    { icon: "3", label: "Self-Custody", description: "Move to hardware wallet" }
  ]}
/>
*/
