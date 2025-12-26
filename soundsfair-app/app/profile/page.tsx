'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getUserProgress, getXPProgress } from '@/lib/progress';
import { uploadProgressToCloud, downloadProgressFromCloud, syncProgress } from '@/lib/progress-sync';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProfilePage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<ReturnType<typeof getUserProgress> | null>(null);
  const [xpInfo, setXPInfo] = useState<ReturnType<typeof getXPProgress> | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      // Load user profile data
      const loadProfile = async () => {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setDisplayName(data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || 'User');
        }
      };
      loadProfile();

      // Load progress data
      setProgress(getUserProgress());
      setXPInfo(getXPProgress());

      // Auto-migration: Check if user has local data but no cloud data
      const performAutoMigration = async () => {
        try {
          // Check if there's local progress data
          const hasLocalData = localStorage.getItem('soundsfair-xp');

          if (!hasLocalData) {
            console.log('[Auto-migration] No local data to migrate');
            return;
          }

          // Check if user already has cloud progress
          const { data: cloudProgress, error } = await supabase
            .from('user_progress')
            .select('id')
            .eq('id', user.id)
            .single();

          // If no cloud progress exists, upload local data
          if (error?.code === 'PGRST116') {
            console.log('[Auto-migration] Migrating local progress to cloud...');
            const result = await uploadProgressToCloud();

            if (result.success) {
              console.log('[Auto-migration] Migration successful!');
              setSyncMessage({
                type: 'success',
                text: '✓ Your local progress has been backed up to the cloud!'
              });
              setTimeout(() => setSyncMessage(null), 8000);
            } else {
              console.error('[Auto-migration] Migration failed:', result.error);
            }
          } else if (cloudProgress) {
            console.log('[Auto-migration] Cloud progress already exists, skipping migration');
          }
        } catch (error) {
          console.error('[Auto-migration] Error during migration:', error);
        }
      };

      // Run migration after a short delay to avoid blocking UI
      const migrationTimer = setTimeout(performAutoMigration, 2000);

      return () => clearTimeout(migrationTimer);
    }
  }, [user]);

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      setSaveMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });

      if (error) throw error;

      setSaveMessage({ type: 'success', text: 'Name updated successfully!' });
      setIsEditingName(false);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to update name' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadToCloud = async () => {
    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const result = await uploadProgressToCloud();
      if (result.success) {
        setSyncMessage({ type: 'success', text: 'Progress uploaded to cloud successfully!' });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setSyncMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to upload progress' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const handleDownloadFromCloud = async () => {
    if (!confirm('This will replace your local progress with data from the cloud. Continue?')) {
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const result = await downloadProgressFromCloud();
      if (result.success) {
        setSyncMessage({ type: 'success', text: 'Progress downloaded! Reloading page...' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error(result.error || 'Download failed');
      }
    } catch (error) {
      setSyncMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to download progress' });
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const handleMergeAndSync = async () => {
    setIsSyncing(true);
    setSyncMessage(null);

    try {
      const result = await syncProgress('merge');
      if (result.success) {
        setSyncMessage({ type: 'success', text: 'Progress merged and synced successfully!' });
        // Refresh progress data
        setProgress(getUserProgress());
        setXPInfo(getXPProgress());
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error) {
      setSyncMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to sync progress' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  if (authLoading || !isAuthenticated || !progress || !xpInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = xpInfo.progressPercentage;
  const completionRate = Math.round((progress.lessonsCompleted.length / 9) * 100);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* Page Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
              <p className="text-gray-400">Track your progress and manage your account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Profile Info Card */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>

          <div className="space-y-4">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-300">
                {user?.email}
              </div>
            </div>

            {/* Display Name (editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
              {isEditingName ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white
                             focus:outline-none focus:border-brand-yellow transition-colors"
                    placeholder="Enter your name"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      disabled={isSaving}
                      className="px-4 py-2 bg-brand-yellow text-black font-semibold rounded-lg
                               hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setSaveMessage(null);
                      }}
                      disabled={isSaving}
                      className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg
                               hover:bg-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg">
                  <span className="text-white">{displayName}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-brand-yellow hover:text-yellow-400 transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}
              {saveMessage && (
                <p className={`text-sm mt-2 ${saveMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {saveMessage.text}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cloud Sync Card */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Cloud Sync</h2>
              <p className="text-sm text-gray-400">
                Backup your progress and access it from any device
              </p>
            </div>
            <svg className="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Your progress is saved locally on this device. Enable cloud sync to access your progress
            from any device and protect against data loss.
          </p>

          {/* Sync Message */}
          {syncMessage && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                syncMessage.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {syncMessage.type === 'success' ? (
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="text-sm font-medium">{syncMessage.text}</span>
              </div>
            </div>
          )}

          {/* Sync Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <button
              onClick={handleUploadToCloud}
              disabled={isSyncing}
              className="flex flex-col items-center gap-2 p-4 bg-gray-900 border border-gray-700 rounded-lg
                       hover:border-brand-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       group"
            >
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-brand-yellow transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="font-semibold text-white">Upload to Cloud</span>
              <span className="text-xs text-gray-400 text-center">
                Save local progress to cloud
              </span>
            </button>

            <button
              onClick={handleDownloadFromCloud}
              disabled={isSyncing}
              className="flex flex-col items-center gap-2 p-4 bg-gray-900 border border-gray-700 rounded-lg
                       hover:border-brand-yellow transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       group"
            >
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-brand-yellow transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              <span className="font-semibold text-white">Download from Cloud</span>
              <span className="text-xs text-gray-400 text-center">
                Replace local with cloud data
              </span>
            </button>

            <button
              onClick={handleMergeAndSync}
              disabled={isSyncing}
              className="flex flex-col items-center gap-2 p-4 bg-brand-yellow text-black rounded-lg
                       hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-glow"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="font-semibold">Merge & Sync</span>
              <span className="text-xs text-center">
                Combine local and cloud (Recommended)
              </span>
            </button>
          </div>

          {/* Info Panel */}
          <div className="p-4 bg-brand-yellow/5 border border-brand-yellow/20 rounded-lg">
            <h3 className="text-sm font-semibold text-brand-yellow mb-2">How Merge & Sync Works:</h3>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-brand-yellow">•</span>
                <span>Takes the highest XP between local and cloud</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-yellow">•</span>
                <span>Preserves the longest streak achieved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-yellow">•</span>
                <span>Combines all completed lessons from both sources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-yellow">•</span>
                <span>Keeps complete quiz history from all devices</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3 italic">
              💡 Your progress auto-syncs every 5 minutes when you&apos;re logged in
            </p>
          </div>
        </div>

        {/* XP Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Level */}
          <div className="bg-gradient-to-br from-brand-yellow/10 to-orange-500/10 border border-brand-yellow/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Current Level</h3>
              <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-black">{xpInfo.currentLevel}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{xpInfo.currentXP} XP</div>
            <p className="text-sm text-gray-400">Total XP earned</p>
          </div>

          {/* Lessons Progress */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Lessons Completed</h3>
            <div className="text-3xl font-bold text-white mb-2">
              {progress.lessonsCompleted.length}/9
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-brand-yellow to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{completionRate}% complete</p>
          </div>

          {/* Current Streak */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Current Streak</h3>
            <div className="flex items-center gap-2 mb-2">
              {progress.currentStreak > 0 && <span className="text-4xl">🔥</span>}
              <div className="text-3xl font-bold text-white">{progress.currentStreak}</div>
            </div>
            <p className="text-sm text-gray-400">
              {progress.currentStreak === 0 ? 'Start your streak today!' : 'days in a row'}
            </p>
          </div>
        </div>

        {/* Progress to Next Level */}
        {xpInfo.currentLevel < 10 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Progress to Level {xpInfo.currentLevel + 1}</h2>
              <span className="text-brand-yellow font-semibold">{xpInfo.xpToNextLevel} XP to go</span>
            </div>
            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-yellow to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Level {xpInfo.currentLevel}</span>
              <span>{progressPercentage.toFixed(1)}%</span>
              <span>Level {xpInfo.currentLevel + 1}</span>
            </div>
          </div>
        )}

        {/* How to Earn XP */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">How to Earn XP</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Complete Lessons</h3>
                <p className="text-sm text-gray-400">Earn 50 XP for each lesson you complete</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Pass Quizzes</h3>
                <p className="text-sm text-gray-400">Earn 20 XP for each quiz you pass (70% or higher)</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Daily Streaks</h3>
                <p className="text-sm text-gray-400">Bonus 10 XP for each day of consecutive learning</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-900 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Perfect Scores</h3>
                <p className="text-sm text-gray-400">Bonus 30 XP for achieving 100% on a quiz</p>
              </div>
            </div>
          </div>
        </div>

        {/* Level Rewards */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Level Rewards</h2>
          <div className="space-y-3">
            {[
              { level: 1, xp: 0, title: 'Bitcoin Newbie', unlocks: 'Access to beginner lessons' },
              { level: 2, xp: 200, title: 'Satoshi Student', unlocks: 'Intermediate content unlocked' },
              { level: 3, xp: 500, title: 'Blockchain Explorer', unlocks: 'Advanced technical lessons' },
              { level: 4, xp: 900, title: 'Crypto Analyst', unlocks: 'Economic analysis tools' },
              { level: 5, xp: 1400, title: 'Bitcoin Advocate', unlocks: 'Geopolitics content' },
              { level: 6, xp: 2000, title: 'Monetary Expert', unlocks: 'Strategy guides' },
              { level: 7, xp: 2700, title: 'Freedom Fighter', unlocks: 'Expert-level insights' },
              { level: 8, xp: 3500, title: 'Sovereign Individual', unlocks: 'All content + Q&A access' },
              { level: 9, xp: 4400, title: 'Bitcoin Maximalist', unlocks: 'Exclusive resources' },
              { level: 10, xp: 5400, title: 'Legendary Hodler', unlocks: 'Master status + special perks' },
            ].map((reward) => (
              <div
                key={reward.level}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  xpInfo.currentLevel >= reward.level
                    ? 'bg-brand-yellow/5 border-brand-yellow/30'
                    : 'bg-gray-900 border-gray-800'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    xpInfo.currentLevel >= reward.level
                      ? 'bg-brand-yellow text-black'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {reward.level}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      xpInfo.currentLevel >= reward.level ? 'text-brand-yellow' : 'text-gray-400'
                    }`}
                  >
                    {reward.title}
                  </h3>
                  <p className="text-sm text-gray-500">{reward.unlocks}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-semibold ${
                      xpInfo.currentLevel >= reward.level ? 'text-brand-yellow' : 'text-gray-500'
                    }`}
                  >
                    {reward.xp} XP
                  </div>
                  {xpInfo.currentLevel >= reward.level && (
                    <div className="text-xs text-green-400">✓ Unlocked</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/lessons"
            className="flex-1 px-6 py-4 bg-brand-yellow text-black font-bold text-center rounded-lg
                     hover:bg-yellow-400 transition-colors"
          >
            Continue Learning
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="px-6 py-4 border border-gray-700 text-gray-300 font-medium rounded-lg
                     hover:bg-gray-900 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
