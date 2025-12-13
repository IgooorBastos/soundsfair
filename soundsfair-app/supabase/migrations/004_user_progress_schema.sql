-- ============================================
-- USER PROGRESS SCHEMA MIGRATION
-- Migration: 004_user_progress_schema
-- Description: Creates tables for hybrid progress tracking (localStorage + cloud sync)
-- ============================================

-- ============================================
-- TABLES
-- ============================================

-- Main user progress table (XP, levels, streaks)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  current_level INTEGER DEFAULT 1 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Sync metadata
  last_synced_at TIMESTAMPTZ,
  sync_version INTEGER DEFAULT 1 NOT NULL,
  device_id TEXT,

  CONSTRAINT valid_xp CHECK (total_xp >= 0),
  CONSTRAINT valid_level CHECK (current_level BETWEEN 1 AND 10),
  CONSTRAINT valid_streak CHECK (current_streak >= 0 AND longest_streak >= current_streak)
);

-- Lesson-specific progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_slug TEXT NOT NULL,
  lesson_level INTEGER NOT NULL,

  -- Progress tracking
  started BOOLEAN DEFAULT FALSE NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  scroll_percentage INTEGER DEFAULT 0 NOT NULL,
  time_spent INTEGER DEFAULT 0 NOT NULL, -- seconds

  -- Quiz tracking
  quiz_passed BOOLEAN DEFAULT FALSE NOT NULL,
  quiz_score INTEGER,
  quiz_attempts INTEGER DEFAULT 0 NOT NULL,

  -- Timestamps
  last_visited TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Unique constraint: one progress record per user per lesson
  UNIQUE(user_id, lesson_slug),

  CONSTRAINT valid_scroll CHECK (scroll_percentage BETWEEN 0 AND 100),
  CONSTRAINT valid_time CHECK (time_spent >= 0)
);

-- Quiz results (detailed history)
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_slug TEXT NOT NULL,

  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  xp_earned INTEGER NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT valid_score CHECK (score >= 0 AND score <= total),
  CONSTRAINT valid_percentage CHECK (percentage BETWEEN 0 AND 100)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON lesson_progress(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_slug ON lesson_progress(lesson_slug);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_lesson ON quiz_results(user_id, lesson_slug);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- User progress policies
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = id);

-- Lesson progress policies
CREATE POLICY "Users can view own lesson progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lesson progress"
  ON lesson_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Quiz results policies
CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: Quiz results are immutable (no update/delete after creation)

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON lesson_progress;
CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create user_progress record automatically on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_progress (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE user_progress IS 'Stores user-level progress data including XP, level, and streaks';
COMMENT ON TABLE lesson_progress IS 'Tracks progress for individual lessons including completion status and quiz results';
COMMENT ON TABLE quiz_results IS 'Immutable history of all quiz attempts with scores and XP earned';

COMMENT ON COLUMN user_progress.sync_version IS 'Version counter for optimistic locking during sync';
COMMENT ON COLUMN user_progress.device_id IS 'ID of the last device that synced this progress';
COMMENT ON COLUMN lesson_progress.time_spent IS 'Total time spent reading this lesson in seconds';
COMMENT ON COLUMN quiz_results.xp_earned IS 'Amount of XP earned from this quiz attempt (150 for pass, 50 for attempt)';
