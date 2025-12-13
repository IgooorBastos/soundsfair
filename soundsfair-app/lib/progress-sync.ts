/**
 * Progress Sync Service
 *
 * Implements hybrid progress tracking: localStorage (primary) + Supabase (optional cloud sync)
 *
 * Architecture:
 * - localStorage is the source of truth (works offline)
 * - Supabase provides optional cloud backup and multi-device sync
 * - Users can use the app without authentication (localStorage only)
 * - If authenticated, progress can be synced to cloud
 * - Conflict resolution: merge strategy (take higher XP, union of completed lessons)
 */

import { supabase } from '@/lib/supabase';
import {
  getUserProgress,
  type UserProgress,
  type LessonProgress,
  type QuizResult,
} from './progress';
import type { Database } from '@/app/types/database';

type UserProgressRow = Database['public']['Tables']['user_progress']['Row'];
type LessonProgressRow = Database['public']['Tables']['lesson_progress']['Row'];
type QuizResultRow = Database['public']['Tables']['quiz_results']['Row'];

// ============================================
// SYNC CONFIGURATION
// ============================================

const SYNC_CONFIG = {
  AUTO_SYNC_ENABLED: true,
  AUTO_SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  DEVICE_ID_KEY: 'soundsfair-device-id',
} as const;

/**
 * Get or create a unique device ID for sync tracking
 */
function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';

  let deviceId = localStorage.getItem(SYNC_CONFIG.DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SYNC_CONFIG.DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// ============================================
// SYNC STATUS TRACKING
// ============================================

export type SyncStatus =
  | { state: 'idle' }
  | { state: 'syncing' }
  | { state: 'success'; timestamp: number }
  | { state: 'error'; error: string; timestamp: number };

let syncStatus: SyncStatus = { state: 'idle' };
let syncCallbacks: ((status: SyncStatus) => void)[] = [];

/**
 * Subscribe to sync status changes
 */
export function onSyncStatusChange(callback: (status: SyncStatus) => void): () => void {
  syncCallbacks.push(callback);
  return () => {
    syncCallbacks = syncCallbacks.filter(cb => cb !== callback);
  };
}

function updateSyncStatus(status: SyncStatus): void {
  syncStatus = status;
  syncCallbacks.forEach(cb => cb(status));
}

export function getSyncStatus(): SyncStatus {
  return syncStatus;
}

// ============================================
// UPLOAD LOCAL PROGRESS TO CLOUD
// ============================================

/**
 * Upload local progress from localStorage to Supabase
 */
export async function uploadProgressToCloud(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    updateSyncStatus({ state: 'syncing' });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const localProgress = getUserProgress();
    const deviceId = getDeviceId();

    // Upload main progress
    const progressData: Database['public']['Tables']['user_progress']['Insert'] = {
      id: user.id,
      total_xp: localProgress.totalXP,
      current_level: localProgress.currentLevel,
      current_streak: localProgress.currentStreak,
      longest_streak: localProgress.longestStreak,
      last_active_date: localProgress.lastActiveDate || null,
      last_synced_at: new Date().toISOString(),
      device_id: deviceId,
    };

    const { error: progressError } = await (supabase
      .from('user_progress') as any)
      .upsert(progressData);

    if (progressError) throw progressError;

    // Upload lesson progress
    const lessonProgressMap = JSON.parse(
      localStorage.getItem('soundsfair-lesson-progress') || '{}'
    );

    const lessonProgressArray: Database['public']['Tables']['lesson_progress']['Insert'][] = Object.values(lessonProgressMap).map((lesson: any) => ({
      user_id: user.id,
      lesson_slug: lesson.slug,
      lesson_level: lesson.level,
      started: lesson.started || false,
      completed: lesson.completed || false,
      scroll_percentage: lesson.scrollPercentage || 0,
      time_spent: lesson.timeSpent || 0,
      quiz_passed: lesson.quizPassed || false,
      quiz_score: lesson.quizScore || null,
      quiz_attempts: lesson.quizAttempts || 0,
      last_visited: lesson.lastVisited || new Date().toISOString(),
      completed_at: lesson.completed ? new Date().toISOString() : null,
    }));

    if (lessonProgressArray.length > 0) {
      const { error: lessonsError } = await (supabase
        .from('lesson_progress') as any)
        .upsert(lessonProgressArray, {
          onConflict: 'user_id,lesson_slug',
        });

      if (lessonsError) throw lessonsError;
    }

    // Upload quiz results (only new ones)
    const quizResultsRaw = localStorage.getItem('soundsfair-quiz-results');
    if (quizResultsRaw) {
      const quizResults: QuizResult[] = JSON.parse(quizResultsRaw);

      // Get existing quiz results from DB to avoid duplicates
      const { data: existingQuizzes } = await (supabase
        .from('quiz_results') as any)
        .select('lesson_slug, created_at')
        .eq('user_id', user.id);

      const existingSet = new Set(
        existingQuizzes?.map((q: any) => `${q.lesson_slug}_${q.created_at}`) || []
      );

      // Filter out already uploaded quizzes
      const newQuizResults: Database['public']['Tables']['quiz_results']['Insert'][] = quizResults
        .filter(result => !existingSet.has(`${result.lessonSlug}_${result.date}`))
        .map(result => ({
          user_id: user.id,
          lesson_slug: result.lessonSlug,
          score: result.score,
          total: result.total,
          percentage: result.percentage,
          passed: result.passed,
          xp_earned: result.xpEarned,
          created_at: result.date,
        }));

      if (newQuizResults.length > 0) {
        const { error: quizError } = await (supabase
          .from('quiz_results') as any)
          .insert(newQuizResults);

        if (quizError) throw quizError;
      }
    }

    updateSyncStatus({ state: 'success', timestamp: Date.now() });
    return { success: true };

  } catch (error: any) {
    const errorMessage = error.message || 'Unknown sync error';
    updateSyncStatus({ state: 'error', error: errorMessage, timestamp: Date.now() });
    console.error('[Progress Sync] Upload error:', error);
    return { success: false, error: errorMessage };
  }
}

// ============================================
// DOWNLOAD CLOUD PROGRESS TO LOCAL
// ============================================

/**
 * Download progress from Supabase to localStorage
 */
export async function downloadProgressFromCloud(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    updateSyncStatus({ state: 'syncing' });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Fetch user progress
    const { data: cloudProgress, error: progressError } = await (supabase
      .from('user_progress') as any)
      .select('*')
      .eq('id', user.id)
      .single();

    if (progressError) {
      // If no progress exists in cloud, this is first sync - upload instead
      if (progressError.code === 'PGRST116') {
        console.log('[Progress Sync] No cloud progress found, uploading local data');
        return await uploadProgressToCloud();
      }
      throw progressError;
    }

    // Fetch lesson progress
    const { data: cloudLessons, error: lessonsError } = await (supabase
      .from('lesson_progress') as any)
      .select('*')
      .eq('user_id', user.id);

    if (lessonsError) throw lessonsError;

    // Fetch quiz results
    const { data: cloudQuizResults, error: quizError } = await (supabase
      .from('quiz_results') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (quizError) throw quizError;

    // Write to localStorage
    localStorage.setItem('soundsfair-xp', cloudProgress.total_xp.toString());

    const streakData = {
      current: cloudProgress.current_streak,
      longest: cloudProgress.longest_streak,
      lastActiveDate: cloudProgress.last_active_date,
    };
    localStorage.setItem('soundsfair-streak', JSON.stringify(streakData));

    // Convert lesson progress to localStorage format
    const lessonProgressMap: Record<string, any> = {};
    cloudLessons?.forEach((lesson: any) => {
      lessonProgressMap[lesson.lesson_slug] = {
        slug: lesson.lesson_slug,
        level: lesson.lesson_level,
        started: lesson.started,
        completed: lesson.completed,
        scrollPercentage: lesson.scroll_percentage,
        timeSpent: lesson.time_spent,
        lastVisited: lesson.last_visited,
        quizPassed: lesson.quiz_passed,
        quizScore: lesson.quiz_score,
        quizAttempts: lesson.quiz_attempts,
      };
    });
    localStorage.setItem('soundsfair-lesson-progress', JSON.stringify(lessonProgressMap));

    // Convert quiz results to localStorage format
    const quizResultsLocal = cloudQuizResults?.map((result: any) => ({
      lessonSlug: result.lesson_slug,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      passed: result.passed,
      date: result.created_at,
      xpEarned: result.xp_earned,
    })) || [];
    localStorage.setItem('soundsfair-quiz-results', JSON.stringify(quizResultsLocal));

    updateSyncStatus({ state: 'success', timestamp: Date.now() });
    return { success: true };

  } catch (error: any) {
    const errorMessage = error.message || 'Unknown download error';
    updateSyncStatus({ state: 'error', error: errorMessage, timestamp: Date.now() });
    console.error('[Progress Sync] Download error:', error);
    return { success: false, error: errorMessage };
  }
}

// ============================================
// MERGE STRATEGY (INTELLIGENT SYNC)
// ============================================

/**
 * Merge local and cloud progress intelligently
 * - Takes higher XP
 * - Takes higher level
 * - Takes longer streak
 * - Union of completed lessons
 * - Combines quiz history
 */
export async function syncProgress(
  direction: 'upload' | 'download' | 'merge' = 'merge'
): Promise<{ success: boolean; error?: string }> {
  if (direction === 'upload') {
    return uploadProgressToCloud();
  }

  if (direction === 'download') {
    return downloadProgressFromCloud();
  }

  // MERGE strategy
  try {
    updateSyncStatus({ state: 'syncing' });

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Get local progress
    const localProgress = getUserProgress();
    const localXP = parseInt(localStorage.getItem('soundsfair-xp') || '0');

    // Get cloud progress
    const { data: cloudProgress, error: cloudError } = await (supabase
      .from('user_progress') as any)
      .select('*')
      .eq('id', user.id)
      .single();

    // If no cloud progress, just upload
    if (cloudError?.code === 'PGRST116') {
      return await uploadProgressToCloud();
    }

    if (cloudError) throw cloudError;

    // Merge strategy: take max values
    const mergedXP = Math.max(localXP, cloudProgress.total_xp);
    const mergedLevel = Math.max(localProgress.currentLevel, cloudProgress.current_level);
    const mergedCurrentStreak = Math.max(localProgress.currentStreak, cloudProgress.current_streak);
    const mergedLongestStreak = Math.max(localProgress.longestStreak, cloudProgress.longest_streak);

    // Update localStorage with merged values
    localStorage.setItem('soundsfair-xp', mergedXP.toString());

    const streakData = {
      current: mergedCurrentStreak,
      longest: mergedLongestStreak,
      lastActiveDate: localProgress.lastActiveDate > (cloudProgress.last_active_date || '')
        ? localProgress.lastActiveDate
        : cloudProgress.last_active_date,
    };
    localStorage.setItem('soundsfair-streak', JSON.stringify(streakData));

    // Now upload the merged progress
    const result = await uploadProgressToCloud();

    if (result.success) {
      console.log('[Progress Sync] Merge completed successfully', {
        mergedXP,
        mergedLevel,
        mergedCurrentStreak,
        mergedLongestStreak,
      });
    }

    return result;

  } catch (error: any) {
    const errorMessage = error.message || 'Merge sync failed';
    updateSyncStatus({ state: 'error', error: errorMessage, timestamp: Date.now() });
    console.error('[Progress Sync] Merge error:', error);
    return { success: false, error: errorMessage };
  }
}

// ============================================
// AUTO-SYNC FUNCTIONALITY
// ============================================

let autoSyncInterval: NodeJS.Timeout | null = null;

/**
 * Start automatic sync every 5 minutes (if authenticated)
 */
export function startAutoSync(): void {
  if (autoSyncInterval) return;

  console.log('[Progress Sync] Starting auto-sync (every 5 minutes)');

  autoSyncInterval = setInterval(async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      console.log('[Progress Sync] Auto-sync triggered');
      await uploadProgressToCloud();
    }
  }, SYNC_CONFIG.AUTO_SYNC_INTERVAL);
}

/**
 * Stop automatic sync
 */
export function stopAutoSync(): void {
  if (autoSyncInterval) {
    console.log('[Progress Sync] Stopping auto-sync');
    clearInterval(autoSyncInterval);
    autoSyncInterval = null;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user is authenticated and can sync
 */
export async function canSync(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

/**
 * Get last sync timestamp
 */
export function getLastSyncTimestamp(): number | null {
  if (syncStatus.state === 'success' && 'timestamp' in syncStatus) {
    return syncStatus.timestamp;
  }
  return null;
}

/**
 * Reset sync status to idle
 */
export function resetSyncStatus(): void {
  updateSyncStatus({ state: 'idle' });
}
