/**
 * Progress Tracking System for Soundsfair
 *
 * Manages user progress across lessons, quizzes, and achievements
 * Uses localStorage for client-side persistence
 *
 * Features:
 * - Lesson completion tracking
 * - Reading position (scroll depth)
 * - Quiz results
 * - XP and level system
 * - Streak tracking
 * - Last active lesson
 */

// ===== TYPES =====

export interface LessonProgress {
  slug: string;
  level: number;
  started: boolean;
  completed: boolean;
  scrollPercentage: number; // 0-100
  timeSpent: number; // seconds
  lastVisited: string; // ISO date
  quizPassed: boolean;
  quizScore?: number;
  quizAttempts: number;
}

export interface UserProgress {
  totalXP: number;
  currentLevel: number;
  lessonsCompleted: number[];
  lessonsInProgress: number[];
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date
  lastLesson?: {
    slug: string;
    level: number;
    scrollPercentage: number;
  };
}

export interface QuizResult {
  lessonSlug: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  date: string;
  xpEarned: number;
}

// ===== CONSTANTS =====

const STORAGE_KEYS = {
  USER_PROGRESS: 'soundsfair-user-progress',
  LESSON_PROGRESS: 'soundsfair-lesson-progress',
  QUIZ_RESULTS: 'soundsfair-quiz-results',
  XP: 'soundsfair-xp',
  STREAK: 'soundsfair-streak',
} as const;

const XP_REWARDS = {
  QUIZ_PASS: 150,
  QUIZ_ATTEMPT: 50,
  LESSON_COMPLETE: 100,
  CHECKPOINT_CORRECT: 25,
  FIRST_VISIT: 10,
  DAILY_STREAK: 50,
} as const;

const LEVEL_THRESHOLDS = [
  0,     // Level 1
  200,   // Level 2
  500,   // Level 3
  900,   // Level 4
  1400,  // Level 5
  2000,  // Level 6
  2700,  // Level 7
  3500,  // Level 8
  4500,  // Level 9
  6000,  // Level 10
] as const;

// ===== HELPER FUNCTIONS =====

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!isClient()) return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function setStorageItem(key: string, value: unknown): void {
  if (!isClient()) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

function getXPForNextLevel(currentXP: number): { current: number; next: number; required: number; percentage: number } {
  const currentLevel = calculateLevel(currentXP);
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  const required = nextThreshold - currentThreshold;
  const progress = currentXP - currentThreshold;
  const percentage = Math.round((progress / required) * 100);

  return {
    current: currentThreshold,
    next: nextThreshold,
    required,
    percentage: Math.min(100, Math.max(0, percentage)),
  };
}

// ===== PUBLIC API =====

/**
 * Get complete user progress
 */
export function getUserProgress(): UserProgress {
  const xp = getStorageItem(STORAGE_KEYS.XP, 0);
  const lessonProgressMap = getStorageItem<Record<string, LessonProgress>>(
    STORAGE_KEYS.LESSON_PROGRESS,
    {}
  );

  const completedLevels = Object.values(lessonProgressMap)
    .filter(p => p.completed)
    .map(p => p.level)
    .sort((a, b) => a - b);

  const inProgressLevels = Object.values(lessonProgressMap)
    .filter(p => p.started && !p.completed)
    .map(p => p.level)
    .sort((a, b) => a - b);

  const streak = getStorageItem(STORAGE_KEYS.STREAK, {
    current: 0,
    longest: 0,
    lastActiveDate: getTodayDateString(),
  });

  // Find last active lesson
  const sortedLessons = Object.values(lessonProgressMap).sort(
    (a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
  );
  const lastLesson = sortedLessons[0];

  return {
    totalXP: xp,
    currentLevel: calculateLevel(xp),
    lessonsCompleted: completedLevels,
    lessonsInProgress: inProgressLevels,
    currentStreak: streak.current,
    longestStreak: streak.longest,
    lastActiveDate: streak.lastActiveDate,
    lastLesson: lastLesson ? {
      slug: lastLesson.slug,
      level: lastLesson.level,
      scrollPercentage: lastLesson.scrollPercentage,
    } : undefined,
  };
}

/**
 * Get lesson-specific progress
 */
export function getLessonProgress(slug: string): LessonProgress | null {
  const allProgress = getStorageItem<Record<string, LessonProgress>>(
    STORAGE_KEYS.LESSON_PROGRESS,
    {}
  );
  return allProgress[slug] || null;
}

/**
 * Update lesson progress
 */
export function updateLessonProgress(
  slug: string,
  level: number,
  updates: Partial<LessonProgress>
): void {
  const allProgress = getStorageItem<Record<string, LessonProgress>>(
    STORAGE_KEYS.LESSON_PROGRESS,
    {}
  );

  const existing = allProgress[slug] || {
    slug,
    level,
    started: false,
    completed: false,
    scrollPercentage: 0,
    timeSpent: 0,
    lastVisited: new Date().toISOString(),
    quizPassed: false,
    quizAttempts: 0,
  };

  allProgress[slug] = {
    ...existing,
    ...updates,
    lastVisited: new Date().toISOString(),
  };

  setStorageItem(STORAGE_KEYS.LESSON_PROGRESS, allProgress);

  // Update streak if this is first activity today
  updateStreak();
}

/**
 * Mark lesson as started (first time visit)
 */
export function markLessonStarted(slug: string, level: number): void {
  const existing = getLessonProgress(slug);

  if (!existing || !existing.started) {
    updateLessonProgress(slug, level, { started: true });

    // Award first visit XP
    if (!existing) {
      addXP(XP_REWARDS.FIRST_VISIT, 'First lesson visit');
    }
  }
}

/**
 * Update reading scroll position
 */
export function updateReadingPosition(slug: string, level: number, percentage: number): void {
  updateLessonProgress(slug, level, {
    scrollPercentage: Math.round(percentage),
    started: true,
  });
}

/**
 * Mark lesson as completed
 */
export function markLessonCompleted(slug: string, level: number): void {
  const existing = getLessonProgress(slug);

  if (!existing?.completed) {
    updateLessonProgress(slug, level, {
      completed: true,
      scrollPercentage: 100,
    });

    addXP(XP_REWARDS.LESSON_COMPLETE, 'Lesson completed');
  }
}

/**
 * Save quiz result
 */
export function saveQuizResult(result: Omit<QuizResult, 'date' | 'xpEarned'>): void {
  const allResults = getStorageItem<QuizResult[]>(STORAGE_KEYS.QUIZ_RESULTS, []);

  const xpEarned = result.passed ? XP_REWARDS.QUIZ_PASS : XP_REWARDS.QUIZ_ATTEMPT;

  const fullResult: QuizResult = {
    ...result,
    date: new Date().toISOString(),
    xpEarned,
  };

  allResults.push(fullResult);
  setStorageItem(STORAGE_KEYS.QUIZ_RESULTS, allResults);

  // Update lesson progress
  const levelMatch = result.lessonSlug.match(/level-(\d+)/);
  const level = levelMatch ? parseInt(levelMatch[1]) : 1;

  const existing = getLessonProgress(result.lessonSlug);
  updateLessonProgress(result.lessonSlug, level, {
    quizPassed: result.passed || (existing?.quizPassed ?? false),
    quizScore: result.score,
    quizAttempts: (existing?.quizAttempts || 0) + 1,
  });

  // Add XP
  addXP(xpEarned, result.passed ? 'Quiz passed' : 'Quiz attempt');
}

/**
 * Add XP and update level
 */
export function addXP(amount: number, reason?: string): {
  newXP: number;
  leveledUp: boolean;
  newLevel: number;
} {
  const currentXP = getStorageItem(STORAGE_KEYS.XP, 0);
  const currentLevel = calculateLevel(currentXP);

  const newXP = currentXP + amount;
  const newLevel = calculateLevel(newXP);

  setStorageItem(STORAGE_KEYS.XP, newXP);

  const leveledUp = newLevel > currentLevel;

  if (leveledUp && isClient()) {
    // Trigger custom event for level up notification
    window.dispatchEvent(new CustomEvent('soundsfair:levelup', {
      detail: { newLevel, reason },
    }));
  }

  return { newXP, leveledUp, newLevel };
}

/**
 * Update streak tracking
 */
export function updateStreak(): void {
  const streak = getStorageItem(STORAGE_KEYS.STREAK, {
    current: 0,
    longest: 0,
    lastActiveDate: '',
  });

  const today = getTodayDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  if (streak.lastActiveDate === today) {
    // Already active today
    return;
  }

  if (streak.lastActiveDate === yesterday) {
    // Continuing streak
    streak.current += 1;
    streak.longest = Math.max(streak.longest, streak.current);

    // Award streak XP
    addXP(XP_REWARDS.DAILY_STREAK, `${streak.current}-day streak`);
  } else {
    // Streak broken
    streak.current = 1;
  }

  streak.lastActiveDate = today;
  setStorageItem(STORAGE_KEYS.STREAK, streak);
}

/**
 * Get XP progress for current level
 */
export function getXPProgress(): {
  currentXP: number;
  currentLevel: number;
  nextLevel: number;
  xpToNextLevel: number;
  progressPercentage: number;
} {
  const currentXP = getStorageItem(STORAGE_KEYS.XP, 0);
  const currentLevel = calculateLevel(currentXP);
  const progress = getXPForNextLevel(currentXP);

  return {
    currentXP,
    currentLevel,
    nextLevel: currentLevel + 1,
    xpToNextLevel: progress.next - currentXP,
    progressPercentage: progress.percentage,
  };
}

/**
 * Get all quiz results
 */
export function getQuizResults(): QuizResult[] {
  return getStorageItem<QuizResult[]>(STORAGE_KEYS.QUIZ_RESULTS, []);
}

/**
 * Check if user can access a lesson (based on sequential progression)
 */
export function canAccessLesson(level: number): boolean {
  // Level 5 is always accessible (first lesson)
  if (level === 5) return true;

  const progress = getUserProgress();
  const previousLevel = level - 1;

  // Check if previous level is completed
  return progress.lessonsCompleted.includes(previousLevel);
}

/**
 * Get overall completion percentage
 */
export function getOverallCompletion(): number {
  const totalLessons = 5; // Levels 5-9
  const progress = getUserProgress();
  return Math.round((progress.lessonsCompleted.length / totalLessons) * 100);
}

/**
 * Reset all progress (for testing/debugging)
 */
export function resetProgress(): void {
  if (!isClient()) return;

  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });

  if (isClient()) {
    window.location.reload();
  }
}

/**
 * Export progress data (for backup/migration)
 */
export function exportProgressData(): string {
  const data = {
    userProgress: getUserProgress(),
    lessonProgress: getStorageItem(STORAGE_KEYS.LESSON_PROGRESS, {}),
    quizResults: getQuizResults(),
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(data, null, 2);
}
