-- =====================================================
-- ADD VERIFIED COLUMN TO PROFILES TABLE
-- =====================================================
-- Run this in your Supabase SQL Editor.
-- This script does the following:
--   1. Adds a boolean column `verified` to public.profiles.
--   2. Sets verified to true for all existing profiles.
-- =====================================================

-- 1. Add column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- 2. Mark existing users as verified (so they don't get locked out)
UPDATE public.profiles 
SET verified = true 
WHERE verified IS NULL OR verified = false;



-- 3. Update the handle_new_user trigger function to set verified to false by default
-- (and make it respect the default value of the column)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, verified)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
    NEW.email,
    false -- new signups start as unverified
  );
  
  INSERT INTO public.settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verification
SELECT 
  email,
  name,
  verified
FROM public.profiles
ORDER BY created_at DESC;
