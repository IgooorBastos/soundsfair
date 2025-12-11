'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with client-side hooks
const FearGreedIndex = dynamic(
  () => import('@/components/tools/FearGreedIndex'),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-6xl mx-auto">
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-8 mb-8">
          <div className="h-64 bg-gray-800 animate-pulse rounded"></div>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface-charcoal border border-border-default rounded-lg p-6">
              <div className="h-20 bg-gray-800 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
);

export default FearGreedIndex;
