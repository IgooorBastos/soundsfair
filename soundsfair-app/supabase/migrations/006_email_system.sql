-- ============================================================================
-- Email System Migration
-- ============================================================================
--
-- This migration creates tables for email logging, bounce tracking,
-- and user email preferences (including unsubscribe functionality).
--
-- Created: 2025-12-15
-- ============================================================================

-- ============================================================================
-- EMAIL LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  template_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced', 'complained', 'delivered')),
  message_id TEXT, -- Resend message ID for tracking
  error TEXT, -- Error message if failed
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient
  ON email_logs(recipient_email);

CREATE INDEX IF NOT EXISTS idx_email_logs_status
  ON email_logs(status);

CREATE INDEX IF NOT EXISTS idx_email_logs_created_at
  ON email_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_logs_template
  ON email_logs(template_name);

CREATE INDEX IF NOT EXISTS idx_email_logs_message_id
  ON email_logs(message_id)
  WHERE message_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE email_logs IS 'Tracks all email sends for audit, debugging, and compliance';
COMMENT ON COLUMN email_logs.template_name IS 'Name of email template used (e.g., payment_confirmation, pre_payment, etc.)';
COMMENT ON COLUMN email_logs.status IS 'Email delivery status: sent, failed, bounced, complained, delivered';
COMMENT ON COLUMN email_logs.message_id IS 'Resend message ID for webhook correlation';
COMMENT ON COLUMN email_logs.error IS 'Error details if status is failed';

-- ============================================================================
-- EMAIL PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_preferences (
  email TEXT PRIMARY KEY,
  unsubscribed BOOLEAN DEFAULT false,
  unsubscribed_at TIMESTAMPTZ,
  unsubscribe_reason TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_preferences_unsubscribed
  ON email_preferences(unsubscribed)
  WHERE unsubscribed = true;

-- Add comments
COMMENT ON TABLE email_preferences IS 'User email preferences including unsubscribe status';
COMMENT ON COLUMN email_preferences.unsubscribed IS 'Whether user has opted out of all emails';
COMMENT ON COLUMN email_preferences.preferences IS 'Future: granular email preferences (JSONB for flexibility)';

-- ============================================================================
-- AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to email_logs
DROP TRIGGER IF EXISTS update_email_logs_updated_at ON email_logs;
CREATE TRIGGER update_email_logs_updated_at
  BEFORE UPDATE ON email_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to email_preferences
DROP TRIGGER IF EXISTS update_email_preferences_updated_at ON email_preferences;
CREATE TRIGGER update_email_preferences_updated_at
  BEFORE UPDATE ON email_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on both tables
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage email logs" ON email_logs;
DROP POLICY IF EXISTS "Service role can manage email preferences" ON email_preferences;
DROP POLICY IF EXISTS "Users cannot access email logs" ON email_logs;
DROP POLICY IF EXISTS "Users can view own preferences" ON email_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON email_preferences;

-- Email logs: Only service role (server-side) can access
CREATE POLICY "Service role can manage email logs"
  ON email_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Regular users have no access to email logs
CREATE POLICY "Users cannot access email logs"
  ON email_logs
  FOR ALL
  TO authenticated, anon
  USING (false);

-- Email preferences: Service role can manage
CREATE POLICY "Service role can manage email preferences"
  ON email_preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can view their own preferences (future: if we add user auth)
CREATE POLICY "Users can view own preferences"
  ON email_preferences
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Users can update their own preferences (for unsubscribe)
CREATE POLICY "Users can update own preferences"
  ON email_preferences
  FOR UPDATE
  TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

-- ============================================================================
-- HELPER FUNCTION: Check if email is unsubscribed
-- ============================================================================

CREATE OR REPLACE FUNCTION is_email_unsubscribed(check_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_unsubscribed BOOLEAN;
BEGIN
  SELECT unsubscribed INTO is_unsubscribed
  FROM email_preferences
  WHERE email = check_email;

  RETURN COALESCE(is_unsubscribed, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_email_unsubscribed IS 'Check if an email address has unsubscribed from communications';

-- ============================================================================
-- SAMPLE QUERIES FOR TESTING
-- ============================================================================

-- Uncomment to test after migration:

-- Check email send rate by template:
-- SELECT
--   template_name,
--   status,
--   COUNT(*) as count,
--   COUNT(*) FILTER (WHERE status = 'sent') as sent_count,
--   COUNT(*) FILTER (WHERE status = 'failed') as failed_count
-- FROM email_logs
-- WHERE created_at > NOW() - INTERVAL '7 days'
-- GROUP BY template_name, status
-- ORDER BY count DESC;

-- Find bounced/complained emails:
-- SELECT recipient_email, status, COUNT(*) as count
-- FROM email_logs
-- WHERE status IN ('bounced', 'complained')
-- GROUP BY recipient_email, status
-- ORDER BY count DESC;

-- Check unsubscribe rate:
-- SELECT
--   COUNT(*) FILTER (WHERE unsubscribed = true) as unsubscribed_count,
--   COUNT(*) as total_count,
--   ROUND(100.0 * COUNT(*) FILTER (WHERE unsubscribed = true) / NULLIF(COUNT(*), 0), 2) as unsubscribe_rate
-- FROM email_preferences;
