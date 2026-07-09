-- =====================================================
-- VIEW ALL USER CREDENTIALS
-- =====================================================
-- This shows all user credentials from different sources
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE (Complete User Records)
-- =====================================================
SELECT 
  '📋 PROFILES TABLE' as source,
  email,
  password,
  name,
  id as user_id,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- =====================================================
-- 2. USER CREDENTIALS TABLE (Login Database)
-- =====================================================
SELECT 
  '🔐 CREDENTIALS TABLE' as source,
  email,
  password,
  name,
  is_demo,
  created_at
FROM public.user_credentials
ORDER BY created_at DESC;

-- =====================================================
-- 3. SUPABASE AUTH USERS (Authenticated Users)
-- =====================================================
SELECT 
  '🔒 AUTH USERS' as source,
  email,
  '(encrypted)' as password,
  raw_user_meta_data->>'name' as name,
  id as user_id,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- =====================================================
-- 4. COMBINED VIEW (All Sources)
-- =====================================================
SELECT 
  p.email,
  p.password as profile_password,
  uc.password as credentials_password,
  p.name,
  p.id as user_id,
  CASE 
    WHEN uc.is_demo THEN '✅ Demo'
    ELSE '👤 Real User'
  END as account_type,
  p.created_at
FROM public.profiles p
LEFT JOIN public.user_credentials uc ON p.email = uc.email
ORDER BY p.created_at DESC;

-- =====================================================
-- 5. QUICK LOOKUP BY EMAIL
-- =====================================================
-- Replace 'demo@budgetbuddy.com' with any email
DO $$
DECLARE
  search_email TEXT := 'demo@budgetbuddy.com';
  profile_pass TEXT;
  cred_pass TEXT;
  user_name TEXT;
BEGIN
  -- Get from profiles
  SELECT password, name INTO profile_pass, user_name
  FROM public.profiles
  WHERE email = search_email;
  
  -- Get from credentials
  SELECT password INTO cred_pass
  FROM public.user_credentials
  WHERE email = search_email;
  
  RAISE NOTICE '';
  RAISE NOTICE '🔍 USER LOOKUP: %', search_email;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE 'Name: %', COALESCE(user_name, 'Not found');
  RAISE NOTICE 'Profile Password: %', COALESCE(profile_pass, 'Not set');
  RAISE NOTICE 'Credentials Password: %', COALESCE(cred_pass, 'Not set');
  RAISE NOTICE '';
  
  IF profile_pass = cred_pass THEN
    RAISE NOTICE '✅ Passwords are in sync';
  ELSIF profile_pass IS NULL OR cred_pass IS NULL THEN
    RAISE NOTICE '⚠️  Password missing in one table';
  ELSE
    RAISE NOTICE '❌ Passwords are out of sync!';
  END IF;
  RAISE NOTICE '';
END $$;

-- =====================================================
-- 6. PASSWORD SYNC STATUS
-- =====================================================
SELECT 
  p.email,
  p.name,
  CASE 
    WHEN p.password IS NULL THEN '❌ No password in profiles'
    WHEN uc.password IS NULL THEN '❌ No password in credentials'
    WHEN p.password = uc.password THEN '✅ Synced'
    ELSE '⚠️  Out of sync'
  END as sync_status,
  p.password as profile_pass,
  uc.password as credential_pass
FROM public.profiles p
LEFT JOIN public.user_credentials uc ON p.email = uc.email
ORDER BY p.email;

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Count total users
-- SELECT COUNT(*) as total_users FROM public.profiles;

-- Find users without passwords
-- SELECT email, name FROM public.profiles WHERE password IS NULL;

-- Search by name
-- SELECT email, password, name FROM public.profiles WHERE name ILIKE '%demo%';

-- Get specific user password
-- SELECT password FROM public.profiles WHERE email = 'your@email.com';

-- Update password for testing
-- UPDATE public.profiles SET password = 'NewPass@123' WHERE email = 'test@email.com';
-- UPDATE public.user_credentials SET password = 'NewPass@123' WHERE email = 'test@email.com';
