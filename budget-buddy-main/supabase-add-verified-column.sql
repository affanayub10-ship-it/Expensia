-- =====================================================
-- ADD VERIFIED COLUMN & SYNC TRIGGERS
-- =====================================================
-- Run this in your Supabase SQL Editor.
-- This script does the following:
--   1. Adds a boolean column `verified` to public.profiles.
--   2. Sets verified to true for all existing profiles (to prevent lockouts).
--   3. Updates handle_new_user() trigger function to default verified to false.
--   4. Adds handle_update_user() trigger function & trigger to sync email changes.
-- =====================================================

-- 1. Add column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- 2. Mark existing users as verified (so they don't get locked out)
UPDATE public.profiles 
SET verified = true 
WHERE verified IS NULL;

-- 3. Update handle_new_user trigger function to default verified to false
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, verified)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 
    NEW.email,
    false -- new signups start as unverified
  );
  
  INSERT INTO public.settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger function to sync updates (email, name) from auth.users to public.profiles
CREATE OR REPLACE FUNCTION public.handle_update_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET 
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'name', name)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create update trigger
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_update_user();

-- Verification
SELECT 
  email,
  name,
  verified
FROM public.profiles
ORDER BY created_at DESC;
