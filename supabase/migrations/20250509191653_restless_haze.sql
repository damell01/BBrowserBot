/*
  # Add Demo Users and Sample Data

  1. New Records
    - Admin user in auth.users and public.users
    - Customer user in auth.users and public.users
    - Sample leads for demo customer

  2. Changes
    - Insert demo credentials with proper roles
    - Add sample leads data
    - Set pixel installation status
*/

-- Create demo admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  'e52e5b44-94c5-4f19-8cc1-583f1aa9d8d3',
  'admin@demo.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'name', 'Demo Admin',
    'role', 'admin'
  ),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create demo admin in public users
INSERT INTO public.users (
  id,
  name,
  email,
  password,
  role,
  company_name,
  pixel_installed,
  created_at,
  updated_at
)
VALUES (
  'e52e5b44-94c5-4f19-8cc1-583f1aa9d8d3',
  'Demo Admin',
  'admin@demo.com',
  '**********',
  'admin',
  'BrowserBot Admin',
  true,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create demo customer user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES (
  'f7c1bd1a-90c4-4e95-b4dc-12c697a08766',
  'customer@demo.com',
  crypt('customer123', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'name', 'Demo Customer',
    'role', 'customer',
    'company_name', 'Demo Company Inc',
    'pixel_installed', true
  ),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create demo customer in public users
INSERT INTO public.users (
  id,
  name,
  email,
  password,
  role,
  company_name,
  pixel_installed,
  created_at,
  updated_at
)
VALUES (
  'f7c1bd1a-90c4-4e95-b4dc-12c697a08766',
  'Demo Customer',
  'customer@demo.com',
  '**********',
  'customer',
  'Demo Company Inc',
  true,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Insert sample leads for demo customer
INSERT INTO public.leads (
  user_id,
  name,
  email,
  phone,
  company,
  source,
  status,
  created_at,
  updated_at
)
VALUES
  (
    'f7c1bd1a-90c4-4e95-b4dc-12c697a08766',
    'John Smith',
    'john.smith@example.com',
    '+1234567890',
    'Tech Corp',
    'Website Visit',
    'new',
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    'f7c1bd1a-90c4-4e95-b4dc-12c697a08766',
    'Sarah Johnson',
    'sarah.j@example.com',
    '+1987654321',
    'Digital Solutions',
    'Form Submission',
    'contacted',
    now() - interval '1 day',
    now() - interval '1 day'
  ),
  (
    'f7c1bd1a-90c4-4e95-b4dc-12c697a08766',
    'Mike Wilson',
    'mike.w@example.com',
    '+1122334455',
    'Growth Co',
    'Page View',
    'qualified',
    now(),
    now()
  );