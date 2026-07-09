-- =====================================================
-- COMPLETE SETUP: Schema + Demo Users + Dummy Data
-- =====================================================
-- This is an ALL-IN-ONE script that:
--   1. Creates the complete database schema
--   2. Sets up demo user credentials table
--   3. Adds 4 demo accounts with data
-- 
-- Just run this ONE file in Supabase SQL Editor!
-- =====================================================

-- =====================================================
-- STEP 1: CREATE USER CREDENTIALS TABLE
-- =====================================================
-- This table stores demo login credentials
CREATE TABLE IF NOT EXISTS public.user_credentials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  is_demo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_credentials_email ON public.user_credentials(email);

ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read credentials (for demo login)
CREATE POLICY "Allow public read of credentials" ON public.user_credentials
  FOR SELECT USING (true);

-- =====================================================
-- STEP 2: ADD DEMO ACCOUNTS TO CREDENTIALS
-- =====================================================
INSERT INTO public.user_credentials (email, password, name, is_demo) VALUES
('demo@budgetbuddy.com', 'Demo@1234', 'Demo User', true),
('alex@budgetbuddy.com', 'Alex@1234', 'Alex Johnson', true),
('test@budgetbuddy.com', 'Test@1234', 'Test User', true),
('admin@budgetbuddy.com', 'Admin@1234', 'Admin User', true)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  name = EXCLUDED.name;

-- =====================================================
-- STEP 3: SHOW AVAILABLE DEMO ACCOUNTS
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 DEMO ACCOUNTS CREATED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'You can login with any of these:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Email: demo@budgetbuddy.com';
  RAISE NOTICE '   Password: Demo@1234';
  RAISE NOTICE '';
  RAISE NOTICE '2. Email: alex@budgetbuddy.com';
  RAISE NOTICE '   Password: Alex@1234';
  RAISE NOTICE '';
  RAISE NOTICE '3. Email: test@budgetbuddy.com';
  RAISE NOTICE '   Password: Test@1234';
  RAISE NOTICE '';
  RAISE NOTICE '4. Email: admin@budgetbuddy.com';
  RAISE NOTICE '   Password: Admin@1234';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✨ Start your app and login!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;

-- Display credentials table
SELECT 
  '🔐 DEMO ACCOUNT' as info,
  email,
  password,
  name
FROM public.user_credentials
ORDER BY created_at;
