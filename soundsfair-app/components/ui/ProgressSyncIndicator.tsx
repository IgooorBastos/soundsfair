'use client';

import { useEffect, useState } from 'react';
import type { AuthChangeEvent, Session, UserResponse } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import {
  getSyncStatus,
  onSyncStatusChange,
  syncProgress,
  startAutoSync,
  stopAutoSync,
  uploadProgressToCloud,
  downloadProgressFromCloud,
  type SyncStatus,
} from '@/lib/progress-sync';

export function ProgressSyncIndicator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus());
  const [showDetails, setShowDetails] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check authentication and setup auto-sync
  useEffect(() => {
    // Check initial auth state
    supabase.auth.getUser().then((response: UserResponse) => {
      const user = response.data.user;
      setIsAuthenticated(!!user);
      if (user) {
        startAutoSync();
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
      const authenticated = !!session?.user;
      setIsAuthenticated(authenticated);

      if (authenticated) {
        startAutoSync();
      } else {
        stopAutoSync();
      }
      }
    );

    // Subscribe to sync status changes
    const unsubscribe = onSyncStatusChange(setStatus);

    return () => {
      unsubscribe();
      subscription.unsubscribe();
      stopAutoSync();
    };
  }, []);

  // Don't render if not authenticated
  if (!isAuthenticated) return null;

  const handleManualSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      await syncProgress('merge');
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUploadOnly = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      await uploadProgressToCloud();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadOnly = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      const result = await downloadProgressFromCloud();
      if (result.success) {
        // Reload page to reflect downloaded progress
        window.location.reload();
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Get status icon and color
  const getStatusDisplay = () => {
    if (status.state === 'syncing' || isSyncing) {
      return {
        icon: (
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ),
        label: 'Syncing...',
        color: 'text-brand-yellow border-brand-yellow bg-brand-yellow/10',
      };
    }

    if (status.state === 'success') {
      return {
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ),
        label: 'Synced',
        color: 'text-green-400 border-green-500/30 bg-green-500/10',
      };
    }

    if (status.state === 'error') {
      return {
        icon: (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ),
        label: 'Sync Failed',
        color: 'text-red-400 border-red-500/30 bg-red-500/10',
      };
    }

    // idle state
    return {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      label: 'Cloud Sync',
      color: 'text-gray-400 border-gray-700 bg-gray-900',
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border
          transition-all duration-200 shadow-lg
          ${statusDisplay.color}
        `}
        aria-label="Cloud sync status"
        aria-expanded={showDetails}
      >
        {statusDisplay.icon}
        <span className="text-xs font-medium">{statusDisplay.label}</span>
      </button>

      {/* Details Panel */}
      {showDetails && (
        <div className="absolute bottom-14 right-0 w-80 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Progress Sync</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close sync details"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Status Info */}
          {status.state === 'success' && 'timestamp' in status && (
            <p className="text-xs text-gray-400 mb-3">
              Last synced: {new Date(status.timestamp).toLocaleTimeString()}
            </p>
          )}

          {status.state === 'error' && 'error' in status && (
            <div className="mb-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-400">
              Error: {status.error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="w-full px-4 py-2 bg-brand-yellow text-black font-semibold rounded-lg
                       hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSyncing ? 'Syncing...' : 'Merge & Sync'}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleUploadOnly}
                disabled={isSyncing}
                className="px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium rounded-lg
                         hover:border-brand-yellow hover:text-brand-yellow transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload
              </button>
              <button
                onClick={handleDownloadOnly}
                disabled={isSyncing}
                className="px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium rounded-lg
                         hover:border-brand-yellow hover:text-brand-yellow transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-3 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              Auto-syncs every 5 minutes
            </p>
          </div>

          {/* Help Text */}
          <div className="mt-2 p-2 bg-brand-yellow/5 border border-brand-yellow/20 rounded">
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-brand-yellow">Merge & Sync:</span> Combines
              local and cloud progress (takes highest XP, all completed lessons).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
