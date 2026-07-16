-- ============================================================
-- Migration: Update Payment History Table
-- This safely migrates from old to new payment_history structure
-- ============================================================

-- Step 1: Backup existing data (if any)
CREATE TABLE IF NOT EXISTS payment_history_backup AS
SELECT * FROM public.payment_history;

-- Step 2: Drop old table and related objects
DROP TABLE IF EXISTS public.payment_history CASCADE;
DROP VIEW IF EXISTS public.payment_stats CASCADE;
DROP FUNCTION IF EXISTS get_user_payment_history(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_payment_statistics() CASCADE;
DROP FUNCTION IF EXISTS get_failed_payments(INT) CASCADE;
DROP FUNCTION IF EXISTS update_payment_history_timestamp() CASCADE;

-- Step 3: Create new enhanced payment_history table
CREATE TABLE public.payment_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Stripe IDs
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  stripe_charge_id TEXT,
  
  -- Payment Details
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  payment_method_type TEXT,
  payment_method_last4 TEXT,
  payment_method_brand TEXT,
  
  -- Payment Status
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_type TEXT NOT NULL DEFAULT 'subscription',
  failure_reason TEXT,
  
  -- Invoice & Receipt
  invoice_url TEXT,
  receipt_url TEXT,
  invoice_pdf TEXT,
  
  -- Subscription Info
  subscription_plan TEXT,
  billing_cycle TEXT,
  billing_period_start TIMESTAMP WITH TIME ZONE,
  billing_period_end TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  payment_date TIMESTAMP WITH TIME ZONE,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  succeeded_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes
CREATE INDEX idx_payment_history_user_id ON public.payment_history(user_id);
CREATE INDEX idx_payment_history_payment_date ON public.payment_history(payment_date DESC);
CREATE INDEX idx_payment_history_status ON public.payment_history(payment_status);
CREATE INDEX idx_payment_history_stripe_payment_intent ON public.payment_history(stripe_payment_intent_id);
CREATE INDEX idx_payment_history_created_at ON public.payment_history(created_at DESC);

-- Step 5: Enable RLS
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies
CREATE POLICY "Users can view own payment history" ON public.payment_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payment history" ON public.payment_history
  FOR ALL USING (true) WITH CHECK (true);

-- Step 7: Migrate old data (if backup exists and has data)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_history_backup') THEN
    INSERT INTO public.payment_history (
      id,
      user_id,
      stripe_subscription_id,
      stripe_payment_intent_id,
      stripe_invoice_id,
      amount,
      currency,
      payment_status,
      payment_type,
      invoice_url,
      receipt_url,
      payment_date,
      created_at
    )
    SELECT 
      COALESCE(id, uuid_generate_v4()),
      user_id,
      COALESCE(subscription_id, stripe_subscription_id),
      COALESCE(stripe_payment_intent, stripe_payment_intent_id),
      COALESCE(invoice_id, stripe_invoice_id),
      amount,
      currency,
      payment_status,
      'subscription',
      COALESCE(invoice_url, hosted_invoice_url),
      receipt_url,
      payment_date,
      created_at
    FROM payment_history_backup
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Migrated % rows from old payment_history', (SELECT COUNT(*) FROM payment_history_backup);
  END IF;
END $$;

-- Step 8: Create auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_payment_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  IF NEW.payment_status = 'succeeded' AND OLD.payment_status != 'succeeded' THEN
    NEW.succeeded_at = NOW();
  END IF;
  
  IF NEW.payment_status = 'failed' AND OLD.payment_status != 'failed' THEN
    NEW.failed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_history_timestamp_trigger
  BEFORE UPDATE ON public.payment_history
  FOR EACH ROW EXECUTE FUNCTION update_payment_history_timestamp();

-- Step 9: Create payment statistics view
CREATE OR REPLACE VIEW public.payment_stats AS
SELECT 
  user_id,
  COUNT(*) as total_payments,
  COUNT(*) FILTER (WHERE payment_status = 'succeeded') as successful_payments,
  COUNT(*) FILTER (WHERE payment_status = 'failed') as failed_payments,
  COUNT(*) FILTER (WHERE payment_status = 'pending') as pending_payments,
  SUM(amount) FILTER (WHERE payment_status = 'succeeded') as total_revenue,
  AVG(amount) FILTER (WHERE payment_status = 'succeeded') as avg_payment_amount,
  MAX(payment_date) FILTER (WHERE payment_status = 'succeeded') as last_successful_payment,
  MIN(payment_date) FILTER (WHERE payment_status = 'succeeded') as first_payment_date
FROM public.payment_history
GROUP BY user_id;

GRANT SELECT ON public.payment_stats TO authenticated;
GRANT SELECT ON public.payment_stats TO service_role;

-- Step 10: Create helper functions
CREATE OR REPLACE FUNCTION get_user_payment_history(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  amount DECIMAL,
  currency TEXT,
  payment_status TEXT,
  payment_date TIMESTAMPTZ,
  subscription_plan TEXT,
  billing_cycle TEXT,
  receipt_url TEXT,
  failure_reason TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    amount,
    currency,
    payment_status,
    payment_date,
    subscription_plan,
    billing_cycle,
    receipt_url,
    failure_reason
  FROM public.payment_history
  WHERE user_id = p_user_id
  ORDER BY payment_date DESC;
$$;

CREATE OR REPLACE FUNCTION get_payment_statistics()
RETURNS TABLE (
  total_payments BIGINT,
  successful_payments BIGINT,
  failed_payments BIGINT,
  total_revenue NUMERIC,
  monthly_revenue NUMERIC,
  yearly_revenue NUMERIC,
  avg_transaction_value NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*)::BIGINT as total_payments,
    COUNT(*) FILTER (WHERE payment_status = 'succeeded')::BIGINT as successful_payments,
    COUNT(*) FILTER (WHERE payment_status = 'failed')::BIGINT as failed_payments,
    SUM(amount) FILTER (WHERE payment_status = 'succeeded') as total_revenue,
    SUM(amount) FILTER (WHERE payment_status = 'succeeded' AND billing_cycle = 'monthly') as monthly_revenue,
    SUM(amount) FILTER (WHERE payment_status = 'succeeded' AND billing_cycle = 'yearly') as yearly_revenue,
    AVG(amount) FILTER (WHERE payment_status = 'succeeded') as avg_transaction_value
  FROM public.payment_history;
$$;

CREATE OR REPLACE FUNCTION get_failed_payments(days_back INT DEFAULT 7)
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  amount DECIMAL,
  currency TEXT,
  failure_reason TEXT,
  attempted_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    ph.user_id,
    u.email as user_email,
    ph.amount,
    ph.currency,
    ph.failure_reason,
    ph.attempted_at,
    ph.stripe_payment_intent_id
  FROM public.payment_history ph
  INNER JOIN auth.users u ON ph.user_id = u.id
  WHERE ph.payment_status = 'failed'
    AND ph.attempted_at >= NOW() - (days_back || ' days')::INTERVAL
  ORDER BY ph.attempted_at DESC;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_user_payment_history(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_failed_payments(INT) TO service_role;

-- Step 11: Clean up backup table (optional - comment out to keep backup)
-- DROP TABLE IF EXISTS payment_history_backup;

-- Final message
SELECT 
  'Payment history table migrated successfully!' as status,
  COUNT(*) as migrated_records
FROM public.payment_history;
