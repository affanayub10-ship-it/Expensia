-- =====================================================
-- ADD PASSWORD COLUMN TO PROFILES TABLE
-- =====================================================
-- This adds a password field to the profiles table
-- for easy access to user credentials
-- =====================================================

-- Add password column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_password ON public.profiles(password);

-- Sync existing passwords from user_credentials to profiles
UPDATE public.profiles p
SET password = uc.password
FROM public.user_credentials uc
WHERE p.email = uc.email
  AND p.password IS NULL;

-- Create function to sync password changes
CREATE OR REPLACE FUNCTION sync_profile_password()
RETURNS TRIGGER AS $$
BEGIN
  -- When user_credentials password changes, update profiles
  UPDATE public.profiles
  SET password = NEW.password
  WHERE email = NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-sync passwords
DROP TRIGGER IF EXISTS sync_password_to_profiles ON public.user_credentials;
CREATE TRIGGER sync_password_to_profiles
  AFTER INSERT OR UPDATE OF password ON public.user_credentials
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_password();

-- Also sync when profile is created
CREATE OR REPLACE FUNCTION sync_password_on_profile_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Get password from user_credentials if exists
  UPDATE public.profiles p
  SET password = uc.password
  FROM public.user_credentials uc
  WHERE p.id = NEW.id
    AND p.email = uc.email
    AND p.password IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_password_on_insert ON public.profiles;
CREATE TRIGGER sync_password_on_insert
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_password_on_profile_insert();

-- Verification: Show all profiles with passwords
SELECT 
  '👤 User Profile' as info,
  email,
  password,
  name
FROM public.profiles
ORDER BY created_at;

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Password column added to profiles table!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Features:';
  RAISE NOTICE '   - Password stored in profiles table';
  RAISE NOTICE '   - Auto-syncs from user_credentials';
  RAISE NOTICE '   - Updates automatically on password change';
  RAISE NOTICE '';
END $$;
