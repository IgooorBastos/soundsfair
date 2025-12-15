-- ============================================================================
-- Admin Audit Log Migration
-- ============================================================================
--
-- This migration creates an audit log table to track all admin actions
-- for security monitoring, compliance, and troubleshooting.
--
-- Created: 2025-12-15
-- ============================================================================

-- Create admin audit log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_admin_email
  ON admin_audit_log(admin_email);

CREATE INDEX IF NOT EXISTS idx_audit_action
  ON admin_audit_log(action);

CREATE INDEX IF NOT EXISTS idx_audit_created_at
  ON admin_audit_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_resource
  ON admin_audit_log(resource_type, resource_id)
  WHERE resource_type IS NOT NULL AND resource_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON TABLE admin_audit_log IS 'Tracks all admin actions for security and compliance';
COMMENT ON COLUMN admin_audit_log.action IS 'Action performed (e.g., login, answer_question, update_status)';
COMMENT ON COLUMN admin_audit_log.resource_type IS 'Type of resource affected (e.g., question, payment)';
COMMENT ON COLUMN admin_audit_log.resource_id IS 'ID of the affected resource';
COMMENT ON COLUMN admin_audit_log.metadata IS 'Additional context-specific data in JSON format';

-- Grant permissions (if using RLS - currently disabled for admin tables)
-- Admin users should have full access to audit logs
-- Regular users should have no access

-- Enable RLS but create permissive policy for admin operations
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage audit logs" ON admin_audit_log;

-- Only service role (server-side) can insert/read audit logs
CREATE POLICY "Service role can manage audit logs"
  ON admin_audit_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Regular users have no access (audit logs are admin-only)
CREATE POLICY "Regular users cannot access audit logs"
  ON admin_audit_log
  FOR ALL
  TO authenticated, anon
  USING (false);
