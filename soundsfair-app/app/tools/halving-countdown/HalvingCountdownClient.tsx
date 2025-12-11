'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with client-side hooks and countdown timer
const HalvingCountdown = dynamic(
  () => import('@/components/tools/HalvingCountdown'),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-6xl mx-auto">
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-8 mb-8">
          <div className="h-40 bg-gray-800 animate-pulse rounded"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-charcoal border border-border-default rounded-lg p-6">
              <div className="h-24 bg-gray-800 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-6">
          <div className="h-32 bg-gray-800 animate-pulse rounded"></div>
        </div>
      </div>
    )
  }
);

export default HalvingCountdown;
