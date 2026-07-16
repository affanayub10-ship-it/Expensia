-- Fix expenses table: make payment_method and currency optional (they are being removed from the app)
-- Also drop the payment_methods table as it's no longer used

-- Make columns nullable so existing inserts without them still work
ALTER TABLE public.expenses
  ALTER COLUMN payment_method DROP NOT NULL,
  ALTER COLUMN currency DROP NOT NULL;

-- Set defaults so old rows aren't affected
ALTER TABLE public.expenses
  ALTER COLUMN payment_method SET DEFAULT NULL,
  ALTER COLUMN currency SET DEFAULT NULL;

-- Drop payment_methods table (no longer needed)
DROP TABLE IF EXISTS public.payment_methods CASCADE;

-- Verify
SELECT 'expenses table updated - payment_method and currency are now optional' AS status;
