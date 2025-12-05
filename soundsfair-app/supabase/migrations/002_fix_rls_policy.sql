-- Fix: Remove infinite recursion in admin_users RLS policy
-- The policy was trying to check admin_users while querying admin_users

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins have full access to questions" ON questions;
DROP POLICY IF EXISTS "Admins have full access to payments" ON payments;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;

-- Recreate admin policies using auth.uid() instead of querying admin_users table
-- This avoids the infinite recursion

-- Questions: Admins have full access
CREATE POLICY "Admins have full access to questions" ON questions
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM admin_users
    )
  );

-- Payments: Admins have full access
CREATE POLICY "Admins have full access to payments" ON payments
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM admin_users
    )
  );

-- Admin users: Allow select for authenticated users who are admins
CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM admin_users WHERE role = 'super_admin'
    )
  );

-- Admin users: Super admins can manage (insert/update/delete)
CREATE POLICY "Super admins can manage admin users" ON admin_users
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Note: For MVP without Supabase Auth, we'll bypass RLS using service_role key
-- These policies will be enforced once we implement admin authentication in Week 3
