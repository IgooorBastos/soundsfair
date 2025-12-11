'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with client-side hooks
const SatoshiConverter = dynamic(
  () => import('@/components/tools/SatoshiConverter'),
  {
    ssr: false,
    loading: () => (
      <div className="max-w-4xl mx-auto">
        <div className="bg-surface-charcoal border border-border-default rounded-lg p-6 mb-8">
          <div className="h-20 bg-gray-800 animate-pulse rounded"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface-charcoal border border-border-default rounded-lg p-6">
              <div className="h-24 bg-gray-800 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
);

export default SatoshiConverter;
