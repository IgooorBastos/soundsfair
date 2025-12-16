'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');

  const [email, setEmail] = useState(emailParam || '');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      setStatus('success');
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-surface-charcoal border-2 border-semantic-success rounded-lg p-8 text-center">
        <div className="text-5xl mb-6">✅</div>
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Unsubscribed Successfully
        </h1>
        <p className="text-text-secondary mb-6">
          You have been removed from our email list. You will no longer receive emails from soundsfair.
        </p>
        <p className="text-text-tertiary text-sm mb-8">
          If you unsubscribed by mistake, you can re-subscribe by submitting a new question or contacting us.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-brand-gold text-surface-black font-semibold rounded-lg
            hover:bg-brand-gold-hover transition-all"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-charcoal border-2 border-border-default rounded-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-3">
          Unsubscribe from Emails
        </h1>
        <p className="text-text-secondary">
          We're sorry to see you go. Enter your email address to unsubscribe from all soundsfair emails.
        </p>
      </div>

      <form onSubmit={handleUnsubscribe} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-surface-dark border-2 border-border-default rounded-lg
              text-text-primary placeholder-text-tertiary
              focus:border-brand-gold focus:outline-none transition-colors"
            placeholder="your@email.com"
            disabled={status === 'loading'}
          />
        </div>

        {/* Optional Reason */}
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-text-primary mb-2">
            Why are you unsubscribing? (Optional)
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-surface-dark border-2 border-border-default rounded-lg
              text-text-primary placeholder-text-tertiary
              focus:border-brand-gold focus:outline-none transition-colors resize-none"
            placeholder="Tell us why you're leaving (helps us improve)"
            disabled={status === 'loading'}
          />
        </div>

        {/* Error Message */}
        {status === 'error' && errorMessage && (
          <div className="p-4 bg-semantic-error/10 border border-semantic-error rounded-lg">
            <p className="text-semantic-error text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-4 bg-brand-gold text-surface-black font-semibold rounded-lg
            hover:bg-brand-gold-hover disabled:opacity-50 disabled:cursor-not-allowed
            transition-all text-lg"
        >
          {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
        </button>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-text-tertiary hover:text-brand-gold transition-colors text-sm"
          >
            Cancel and return to homepage
          </Link>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-surface-dark border border-border-default rounded-lg">
        <p className="text-text-tertiary text-sm">
          <strong className="text-text-secondary">Note:</strong> Unsubscribing will prevent you from receiving
          all future emails from soundsfair, including payment confirmations, question answers, and course updates.
          You can re-subscribe at any time by using our services again.
        </p>
      </div>
    </div>
  );
}
