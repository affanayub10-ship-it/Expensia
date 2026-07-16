-- Add onboarding_complete column to profiles table
-- Safe to run multiple times (IF NOT EXISTS)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_complete
  ON public.profiles(onboarding_complete);

-- Mark all EXISTING users as having completed onboarding
-- (so they are not forced through onboarding on next login)
UPDATE public.profiles
SET onboarding_complete = TRUE
WHERE onboarding_complete IS NULL OR onboarding_complete = FALSE;

-- Verify
SELECT id, email, onboarding_complete FROM public.profiles ORDER BY created_at;
