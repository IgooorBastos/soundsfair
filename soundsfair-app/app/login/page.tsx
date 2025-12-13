import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Login | Soundsfair',
  description: 'Login to track your Bitcoin learning progress',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Login to continue your Bitcoin learning journey
            </p>
          </div>

          {/* Login Form */}
          <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
            <LoginForm />
          </Suspense>

          {/* Benefits */}
          <div className="mt-8 p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">
              Why create an account?
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-brand-yellow mt-0.5">✓</span>
                <span>Track your learning progress across devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-yellow mt-0.5">✓</span>
                <span>Earn XP and unlock achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-yellow mt-0.5">✓</span>
                <span>Build learning streaks and stay motivated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-yellow mt-0.5">✓</span>
                <span>Access personalized content recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
