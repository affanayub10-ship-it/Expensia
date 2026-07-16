-- Remove merchant and payment_method from the app schema.
-- Run this in the Supabase SQL Editor on your existing project.

-- Drop payment-methods trigger and function (from supabase-auto-add-payment-methods.sql)
DROP TRIGGER IF EXISTS add_payment_methods_on_signup ON public.profiles;
DROP FUNCTION IF EXISTS add_default_payment_methods();

-- Drop payment_methods table (policies are dropped with the table)
DROP TABLE IF EXISTS public.payment_methods;

-- Remove columns from expenses
ALTER TABLE public.expenses
  DROP COLUMN IF EXISTS payment_method,
  DROP COLUMN IF EXISTS merchant;

-- Remove default_payment_method from settings
ALTER TABLE public.settings
  DROP COLUMN IF EXISTS default_payment_method;

SELECT 'merchant and payment_method removed successfully' AS status;
