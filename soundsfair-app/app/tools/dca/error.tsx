'use client';

export default function DCAError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">📊</div>

        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Calculator Error
        </h1>

        <p className="text-text-secondary mb-8">
          The DCA calculator encountered an issue. Try again or come back later.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-surface-charcoal border border-border-default rounded-lg p-4 mb-8 text-left">
            <p className="text-text-tertiary text-sm font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 flex-col sm:flex-row">
          <button
            onClick={() => reset()}
            className="flex-1 px-6 py-3 bg-brand-gold text-surface-black font-semibold rounded-lg
                       hover:bg-brand-gold/90 transition-colors"
          >
            Try again
          </button>
          <a
            href="/tools/dca"
            className="flex-1 px-6 py-3 border-2 border-brand-gold text-brand-gold font-semibold rounded-lg
                       hover:bg-brand-gold/10 transition-colors text-center"
          >
            Reload
          </a>
        </div>
      </div>
    </div>
  );
}
