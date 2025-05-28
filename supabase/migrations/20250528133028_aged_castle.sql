/*
  # Add User Status Field

  1. Changes
    - Add status field to users table
    - Set default status to 'inactive'
    - Update existing users to 'active'
    - Add check constraint for valid status values

  2. Security
    - No changes to RLS policies needed
*/

-- Add status field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'inactive';

-- Add check constraint to ensure valid status values
ALTER TABLE users ADD CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'));

-- Update existing users to active status
UPDATE users SET status = 'active' WHERE status = 'inactive';