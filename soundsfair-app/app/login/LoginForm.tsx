'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type AuthMode = 'login' | 'signup' | 'magic-link';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check for error/success messages in URL (from auth callback)
  useEffect(() => {
    const error = searchParams.get('error');
    const urlMessage = searchParams.get('message');

    if (error === 'invalid_link') {
      setMessage({
        type: 'error',
        text: urlMessage || 'The magic link is invalid or has expired. Please request a new one.',
      });
    }
  }, [searchParams]);

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setMessage({
            type: 'success',
            text: 'Account created! Check your email to verify your account.',
          });
          // Don't redirect yet, wait for email verification
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
          setTimeout(() => router.push('/lessons'), 1000);
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/lessons`,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Magic link sent! Check your email to login.',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            mode === 'login'
              ? 'bg-brand-yellow text-black'
              : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            mode === 'signup'
              ? 'bg-brand-yellow text-black'
              : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={() => setMode('magic-link')}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            mode === 'magic-link'
              ? 'bg-brand-yellow text-black'
              : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          Magic Link
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Forms */}
      {mode === 'magic-link' ? (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email-magic" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              id="email-magic"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg
                         text-white placeholder-gray-500
                         focus:border-brand-yellow focus:outline-none transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-brand-yellow text-black font-semibold rounded-lg
                       hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            We'll send you a magic link to login without a password
          </p>
        </form>
      ) : (
        <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg
                         text-white placeholder-gray-500
                         focus:border-brand-yellow focus:outline-none transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg
                         text-white placeholder-gray-500
                         focus:border-brand-yellow focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            {mode === 'signup' && (
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-brand-yellow text-black font-semibold rounded-lg
                       hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : mode === 'signup' ? 'Create Account' : 'Login'}
          </button>
        </form>
      )}

      {/* Additional Info */}
      <div className="mt-6 text-center text-xs text-gray-500">
        {mode === 'login' && (
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-brand-yellow hover:underline"
            >
              Sign up
            </button>
          </p>
        )}
        {mode === 'signup' && (
          <p>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-brand-yellow hover:underline"
            >
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
