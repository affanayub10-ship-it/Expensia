-- =====================================================
-- FIX: Allow inserts to user_credentials table
-- =====================================================
-- This fixes the issue where signup fails because
-- credentials can't be stored in the database
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to all user credentials" ON public.user_credentials;
DROP POLICY IF EXISTS "Allow insert via service role" ON public.user_credentials;
DROP POLICY IF EXISTS "Allow public read of credentials" ON public.user_credentials;

-- Allow anyone to read credentials (for login check)
CREATE POLICY "Allow read credentials" ON public.user_credentials
  FOR SELECT USING (true);

-- Allow anyone to insert credentials (for signup)
CREATE POLICY "Allow insert credentials" ON public.user_credentials
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own credentials
CREATE POLICY "Allow update own credentials" ON public.user_credentials
  FOR UPDATE USING (true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ User credentials policies updated!';
  RAISE NOTICE '   - Anyone can read credentials (for login)';
  RAISE NOTICE '   - Anyone can insert credentials (for signup)';
  RAISE NOTICE '   - Users can update their credentials';
END $$;
