-- Phase 7: Lightning Network Q&A System - Database Schema
-- Migration: 001_qa_schema.sql
-- Created: 2025-12-04

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- MAIN TABLES
-- ============================================================================

-- Questions table: Stores user-submitted questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User information (email-only, no accounts for MVP)
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(100),

  -- Question details
  category VARCHAR(50) NOT NULL,
  question_text TEXT NOT NULL,
  pricing_tier VARCHAR(20) NOT NULL,

  -- Payment linkage
  payment_id UUID,
  payment_status VARCHAR(20) DEFAULT 'pending',
  amount_sats INTEGER NOT NULL,

  -- Status tracking
  status VARCHAR(20) DEFAULT 'awaiting_payment',
  priority INTEGER DEFAULT 0,

  -- Response details
  response_text TEXT,
  response_video_url VARCHAR(500),
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID,

  -- Publishing to public archive
  publish_to_archive BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- File attachments (optional)
  attachment_urls TEXT[],

  -- Constraints
  CONSTRAINT questions_email_check CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT questions_status_check CHECK (status IN ('awaiting_payment', 'payment_expired', 'in_queue', 'in_progress', 'answered', 'archived')),
  CONSTRAINT questions_payment_status_check CHECK (payment_status IN ('pending', 'paid', 'expired', 'failed')),
  CONSTRAINT questions_category_check CHECK (category IN ('technical', 'economics', 'security', 'getting-started', 'geopolitics')),
  CONSTRAINT questions_tier_check CHECK (pricing_tier IN ('quick', 'detailed', 'video'))
);

-- Payments table: Stores Lightning payment records
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- OpenNode/BTCPay invoice details
  invoice_id VARCHAR(100) UNIQUE NOT NULL,
  invoice_url VARCHAR(500) NOT NULL,
  lightning_invoice VARCHAR(1000) NOT NULL,

  -- Payment amounts
  amount_sats INTEGER NOT NULL,
  amount_btc DECIMAL(16, 8) NOT NULL,
  amount_usd DECIMAL(10, 2),

  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Webhook verification
  webhook_received BOOLEAN DEFAULT FALSE,
  webhook_signature VARCHAR(255),
  webhook_payload JSONB,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Refund tracking (future use)
  refunded BOOLEAN DEFAULT FALSE,
  refund_reason TEXT,

  -- Constraints
  CONSTRAINT payments_status_check CHECK (status IN ('pending', 'processing', 'paid', 'expired', 'underpaid', 'failed'))
);

-- Admin users table: Simple admin authentication
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,

  -- Constraints
  CONSTRAINT admin_users_role_check CHECK (role IN ('admin', 'super_admin'))
);

-- ============================================================================
-- REFERENCE TABLES
-- ============================================================================

-- Question categories reference
CREATE TABLE question_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0
);

-- Pricing tiers reference
CREATE TABLE pricing_tiers (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  amount_sats INTEGER NOT NULL,
  response_time_hours INTEGER,
  response_format VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Questions indexes
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_payment_status ON questions(payment_status);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX idx_questions_email ON questions(user_email);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_published ON questions(published_at DESC) WHERE publish_to_archive = TRUE;

-- Payments indexes
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_expires_at ON payments(expires_at) WHERE status = 'pending';

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Add foreign key from questions to payments
ALTER TABLE questions
  ADD CONSTRAINT fk_questions_payment
  FOREIGN KEY (payment_id) REFERENCES payments(id)
  ON DELETE SET NULL;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Questions policies
CREATE POLICY "Anyone can insert questions" ON questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own questions by email" ON questions
  FOR SELECT USING (
    user_email = current_setting('app.current_user_email', true)
    OR publish_to_archive = TRUE
  );

CREATE POLICY "Admins have full access to questions" ON questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id::text = auth.uid()::text
    )
  );

-- Payments policies (admin only for security)
CREATE POLICY "Admins have full access to payments" ON payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id::text = auth.uid()::text
    )
  );

-- Admin users policies (super admin only)
CREATE POLICY "Super admins can manage admin users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id::text = auth.uid()::text AND role = 'super_admin'
    )
  );

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert question categories
INSERT INTO question_categories (id, name, description, icon, display_order) VALUES
  ('technical', 'Technical', 'Bitcoin protocol, wallets, transactions, mining', '⚙️', 1),
  ('economics', 'Economics', 'Monetary policy, inflation, store of value, Austrian economics', '💰', 2),
  ('security', 'Security', 'Best practices, privacy, hardware wallets, self-custody', '🔒', 3),
  ('getting-started', 'Getting Started', 'Beginner questions, how to buy, first steps', '🚀', 4),
  ('geopolitics', 'Geopolitics', 'Regulations, nation-states, adoption, global trends', '🌍', 5);

-- Insert pricing tiers
INSERT INTO pricing_tiers (id, name, description, amount_sats, response_time_hours, response_format, display_order, active) VALUES
  ('quick', 'Quick Answer', '1-2 paragraph response within 24 hours', 1000, 24, 'text', 1, TRUE),
  ('detailed', 'Detailed Answer', 'Comprehensive response within 48 hours', 5000, 48, 'text', 2, TRUE),
  ('video', 'Video Response', 'Personalized video explanation within 1 week', 20000, 168, 'video', 3, TRUE);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Public Q&A archive view
CREATE OR REPLACE VIEW public_qa_archive AS
SELECT
  q.id,
  q.category,
  q.question_text,
  q.response_text,
  q.response_video_url,
  q.pricing_tier,
  q.amount_sats,
  q.published_at,
  q.created_at,
  c.name AS category_name,
  c.icon AS category_icon,
  t.name AS tier_name
FROM questions q
JOIN question_categories c ON q.category = c.id
JOIN pricing_tiers t ON q.pricing_tier = t.id
WHERE q.publish_to_archive = TRUE
  AND q.status = 'answered'
  AND q.response_text IS NOT NULL
ORDER BY q.published_at DESC;

-- Admin queue view (paid questions awaiting response)
CREATE OR REPLACE VIEW admin_queue_view AS
SELECT
  q.id,
  q.user_email,
  q.user_name,
  q.category,
  q.question_text,
  q.pricing_tier,
  q.amount_sats,
  q.status,
  q.priority,
  q.created_at,
  q.attachment_urls,
  c.name AS category_name,
  t.name AS tier_name,
  t.response_time_hours,
  p.paid_at
FROM questions q
JOIN question_categories c ON q.category = c.id
JOIN pricing_tiers t ON q.pricing_tier = t.id
LEFT JOIN payments p ON q.payment_id = p.id
WHERE q.payment_status = 'paid'
  AND q.status IN ('in_queue', 'in_progress')
ORDER BY q.priority DESC, q.created_at ASC;

-- ============================================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ============================================================================

-- Function to automatically expire old pending payments
CREATE OR REPLACE FUNCTION expire_old_payments()
RETURNS void AS $$
BEGIN
  UPDATE payments
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();

  UPDATE questions
  SET status = 'payment_expired'
  WHERE payment_status = 'pending'
    AND payment_id IN (
      SELECT id FROM payments WHERE status = 'expired'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get question statistics
CREATE OR REPLACE FUNCTION get_question_stats()
RETURNS TABLE(
  total_questions BIGINT,
  paid_questions BIGINT,
  answered_questions BIGINT,
  in_queue BIGINT,
  total_revenue_sats BIGINT,
  avg_response_time_hours NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_questions,
    COUNT(*) FILTER (WHERE payment_status = 'paid')::BIGINT AS paid_questions,
    COUNT(*) FILTER (WHERE status = 'answered')::BIGINT AS answered_questions,
    COUNT(*) FILTER (WHERE status = 'in_queue')::BIGINT AS in_queue,
    COALESCE(SUM(amount_sats) FILTER (WHERE payment_status = 'paid'), 0)::BIGINT AS total_revenue_sats,
    COALESCE(
      AVG(EXTRACT(EPOCH FROM (responded_at - created_at)) / 3600)
      FILTER (WHERE responded_at IS NOT NULL AND created_at IS NOT NULL),
      0
    )::NUMERIC AS avg_response_time_hours
  FROM questions;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE questions IS 'User-submitted questions for paid Q&A service';
COMMENT ON TABLE payments IS 'Lightning Network payment records via OpenNode/BTCPay';
COMMENT ON TABLE admin_users IS 'Administrators who can answer questions';
COMMENT ON TABLE question_categories IS 'Categories for organizing questions';
COMMENT ON TABLE pricing_tiers IS 'Pricing tiers for different response types';

COMMENT ON COLUMN questions.status IS 'Question workflow status: awaiting_payment, payment_expired, in_queue, in_progress, answered, archived';
COMMENT ON COLUMN questions.payment_status IS 'Payment status: pending, paid, expired, failed';
COMMENT ON COLUMN questions.publish_to_archive IS 'Whether to publish this Q&A publicly (user opt-in)';
COMMENT ON COLUMN payments.lightning_invoice IS 'BOLT11 Lightning invoice string';
COMMENT ON COLUMN payments.webhook_payload IS 'Full webhook payload from payment provider for audit trail';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- This migration creates the complete database schema for Phase 7:
-- Lightning Network Q&A System
--
-- Next steps:
-- 1. Run this migration in Supabase dashboard or via CLI
-- 2. Create first admin user manually or via seed script
-- 3. Configure RLS policies if using Supabase Auth
-- 4. Set up scheduled job to run expire_old_payments() every 15 minutes
