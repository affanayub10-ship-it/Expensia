-- Remove legacy columns from expenses table
ALTER TABLE public.expenses DROP COLUMN IF EXISTS merchant;
ALTER TABLE public.expenses DROP COLUMN IF EXISTS payment_method;
ALTER TABLE public.expenses DROP COLUMN IF EXISTS currency;

-- Remove legacy columns from income table
ALTER TABLE public.income DROP COLUMN IF EXISTS currency;

-- Remove legacy columns from settings table
ALTER TABLE public.settings DROP COLUMN IF EXISTS currency;
ALTER TABLE public.settings DROP COLUMN IF EXISTS default_payment_method;
