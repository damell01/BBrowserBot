/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `password` (text)
      - `role` (text)
      - `company_name` (text, optional)
      - `pixel_installed` (boolean)
      - `tracking_id` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `source` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'customer',
  company_name text,
  pixel_installed boolean DEFAULT false,
  tracking_id text UNIQUE DEFAULT concat('LT-', substr(uuid_generate_v4()::text, 1, 8)),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  source text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for leads table
CREATE POLICY "Users can view own leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can insert own leads"
  ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));