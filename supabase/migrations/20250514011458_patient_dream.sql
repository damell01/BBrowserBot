/*
  # Add Billing and Lead Tiers

  1. New Tables
    - `billing_tiers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `lead_limit` (integer)
      - `price_monthly` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `customer_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `tier_id` (uuid, foreign key)
      - `status` (text)
      - `current_period_start` (timestamp)
      - `current_period_end` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create billing_tiers table
CREATE TABLE IF NOT EXISTS billing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lead_limit integer NOT NULL,
  price_monthly integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer_subscriptions table
CREATE TABLE IF NOT EXISTS customer_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  tier_id uuid REFERENCES billing_tiers(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE billing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for billing_tiers
CREATE POLICY "Anyone can view billing tiers"
  ON billing_tiers
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for customer_subscriptions
CREATE POLICY "Users can view own subscription"
  ON customer_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update own subscription"
  ON customer_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Insert default billing tiers
INSERT INTO billing_tiers (name, lead_limit, price_monthly) VALUES
  ('Starter', 500, 500),
  ('Growth', 1000, 1000),
  ('Professional', 2500, 2500),
  ('Enterprise', 5000, 5000)
ON CONFLICT DO NOTHING;