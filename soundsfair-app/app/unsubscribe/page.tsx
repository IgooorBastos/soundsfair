import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UnsubscribeForm from './UnsubscribeForm';

export const metadata = {
  title: 'Unsubscribe from Emails | soundsfair',
  description: 'Unsubscribe from soundsfair email notifications',
  robots: 'noindex, nofollow',
};

function UnsubscribeFallback() {
  return (
    <div className="bg-surface-charcoal border-2 border-border-default rounded-lg p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-surface-dark rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-surface-dark rounded w-1/2 mx-auto mb-8"></div>
        <div className="h-12 bg-surface-dark rounded mb-4"></div>
        <div className="h-32 bg-surface-dark rounded"></div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-surface-black">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Suspense fallback={<UnsubscribeFallback />}>
            <UnsubscribeForm />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
