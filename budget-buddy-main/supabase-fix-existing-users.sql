-- =====================================================
-- SYNC AND FIX EXISTING USERS IN THE DATABASE
-- =====================================================
-- Run this in your Supabase SQL Editor.
-- This script does the following:
--   1. Ensures all auth.users have a row in public.profiles.
--   2. Ensures all auth.users have a row in public.settings.
--   3. Syncs passwords from user_credentials to public.profiles.
-- =====================================================

-- 1. Sync profiles table with auth.users
INSERT INTO public.profiles (id, name, email, onboarding_complete, created_at, updated_at)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)), 
  email,
  false,
  COALESCE(created_at, NOW()),
  COALESCE(updated_at, NOW())
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 2. Sync settings table with auth.users
INSERT INTO public.settings (user_id, timezone, date_format, language, default_category, created_at, updated_at)
SELECT 
  id, 
  'America/Los_Angeles', 
  'MMM d, yyyy', 
  'English', 
  'Food', 
  COALESCE(created_at, NOW()), 
  COALESCE(updated_at, NOW())
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.settings)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Sync missing passwords from user_credentials to profiles
UPDATE public.profiles p
SET password = uc.password
FROM public.user_credentials uc
WHERE p.email = uc.email
  AND p.password IS NULL;

-- Verification
SELECT 
  p.email,
  p.name,
  CASE WHEN p.password IS NOT NULL THEN '✅ Yes' ELSE '❌ No' END as has_password,
  CASE WHEN s.user_id IS NOT NULL THEN '✅ Yes' ELSE '❌ No' END as has_settings
FROM public.profiles p
LEFT JOIN public.settings s ON p.id = s.user_id
ORDER BY p.email;
