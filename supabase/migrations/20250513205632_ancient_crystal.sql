/*
  # Add Admin Role Management

  1. Changes
    - Add role_type enum for better role management
    - Add admin_access table for additional admin permissions
    - Add policies for admin access control
*/

-- Create role_type enum
CREATE TYPE role_type AS ENUM ('admin', 'customer');

-- Add admin_access table
CREATE TABLE IF NOT EXISTS admin_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES users(id),
  granted_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_access
ALTER TABLE admin_access ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_access
CREATE POLICY "Only super admins can view admin access"
  ON admin_access
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ));

CREATE POLICY "Only super admins can grant admin access"
  ON admin_access
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  ));

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_id 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;