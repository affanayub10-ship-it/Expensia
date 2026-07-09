-- Add recurrence and next_date columns to income table
ALTER TABLE public.income
  ADD COLUMN IF NOT EXISTS recurrence TEXT NOT NULL DEFAULT 'One-time',
  ADD COLUMN IF NOT EXISTS next_date DATE;

-- Index for scheduler queries
CREATE INDEX IF NOT EXISTS idx_income_next_date ON public.income(next_date);
CREATE INDEX IF NOT EXISTS idx_income_recurrence ON public.income(recurrence);

-- Backfill existing rows
UPDATE public.income SET recurrence = 'One-time' WHERE recurrence IS NULL;

SELECT 'income table updated with recurrence columns' AS status;
