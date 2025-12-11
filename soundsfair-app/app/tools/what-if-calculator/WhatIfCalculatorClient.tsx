'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with client-side hooks
const WhatIfCalculator = dynamic(
  () => import('@/components/tools/WhatIfCalculator'),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-6xl mx-auto">
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-8 mb-8">
          <div className="h-64 bg-gray-800 animate-pulse rounded"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-charcoal border border-border-default rounded-lg p-6">
              <div className="h-24 bg-gray-800 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
);

export default WhatIfCalculator;
