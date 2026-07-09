-- =====================================================
-- ADD USER CREDENTIALS TABLE
-- =====================================================
-- This creates a table to store demo user credentials
-- for testing and development purposes
-- 
-- SECURITY WARNING: This is for DEMO purposes only!
-- In production, NEVER store passwords in plain text.
-- Use Supabase Auth for real authentication.
-- =====================================================

-- Create credentials table for demo accounts
CREATE TABLE IF NOT EXISTS public.user_credentials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  is_demo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_credentials_email ON public.user_credentials(email);

-- Enable RLS (but make it accessible for demo purposes)
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read credentials (for demo login)
CREATE POLICY "Allow read access to all user credentials" ON public.user_credentials
  FOR SELECT USING (true);

-- Only allow inserts via service role
CREATE POLICY "Allow insert via service role" ON public.user_credentials
  FOR INSERT WITH CHECK (true);

-- Add some demo accounts
INSERT INTO public.user_credentials (email, password, name, is_demo) VALUES
('demo@budgetbuddy.com', 'Demo@1234', 'Demo User', true),
('alex@budgetbuddy.com', 'Alex@1234', 'Alex Johnson', true),
('test@budgetbuddy.com', 'Test@1234', 'Test User', true),
('admin@budgetbuddy.com', 'Admin@1234', 'Admin User', true)
ON CONFLICT (email) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_user_credentials_updated_at 
BEFORE UPDATE ON public.user_credentials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 
  email, 
  name, 
  'Password: ' || password as credentials,
  is_demo
FROM public.user_credentials
ORDER BY created_at;
