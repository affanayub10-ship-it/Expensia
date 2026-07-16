-- Add indexes to speed up search queries on expenses and income
-- Run this in Supabase SQL Editor

-- Expenses: index on title and category for ilike search
CREATE INDEX IF NOT EXISTS idx_expenses_title ON public.expenses USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_expenses_category_text ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date DESC);

-- Income: index on source and category for ilike search
CREATE INDEX IF NOT EXISTS idx_income_source ON public.income USING gin(to_tsvector('english', source));
CREATE INDEX IF NOT EXISTS idx_income_category_text ON public.income(category);
CREATE INDEX IF NOT EXISTS idx_income_user_date ON public.income(user_id, date DESC);

SELECT 'Search indexes created successfully' AS status;
