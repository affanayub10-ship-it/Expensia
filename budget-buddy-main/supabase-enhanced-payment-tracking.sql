-- ============================================================
-- Enhanced Payment Tracking System
-- Tracks all payment attempts (success & failures)
-- ============================================================

-- Drop existing payment_history table if you want to recreate it
-- DROP TABLE IF EXISTS public.payment_history CASCADE;

-- Enhanced Payment History Table
CREATE TABLE IF NOT EXISTS public.payment_history (
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
  payment_method_type TEXT, -- 'card', 'bank', etc.
  payment_method_last4 TEXT, -- Last 4 digits of card
  payment_method_brand TEXT, -- 'visa', 'mastercard', etc.
  
  -- Payment Status
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'succeeded', 'failed', 'pending', 'canceled', 'refunded'
  payment_type TEXT NOT NULL DEFAULT 'subscription', -- 'subscription', 'one_time', 'upgrade'
  failure_reason TEXT, -- Reason if payment failed
  
  -- Invoice & Receipt
  invoice_url TEXT,
  receipt_url TEXT,
  invoice_pdf TEXT,
  
  -- Subscription Info
  subscription_plan TEXT, -- 'premium'
  billing_cycle TEXT, -- 'monthly', 'yearly'
  billing_period_start TIMESTAMP WITH TIME ZONE,
  billing_period_end TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  description TEXT,
  metadata JSONB, -- Additional flexible data
  
  -- Timestamps
  payment_date TIMESTAMP WITH TIME ZONE,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  succeeded_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON public.payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_payment_date ON public.payment_history(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON public.payment_history(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_payment_intent ON public.payment_history(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON public.payment_history(created_at DESC);

-- RLS Policies
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payment history" ON public.payment_history;
CREATE POLICY "Users can view own payment history" ON public.payment_history
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage payment history" ON public.payment_history;
CREATE POLICY "Service role can manage payment history" ON public.payment_history
  FOR ALL USING (true) WITH CHECK (true);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_payment_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- Auto-set succeeded_at when status changes to succeeded
  IF NEW.payment_status = 'succeeded' AND OLD.payment_status != 'succeeded' THEN
    NEW.succeeded_at = NOW();
  END IF;
  
  -- Auto-set failed_at when status changes to failed
  IF NEW.payment_status = 'failed' AND OLD.payment_status != 'failed' THEN
    NEW.failed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_history_timestamp_trigger ON public.payment_history;
CREATE TRIGGER update_payment_history_timestamp_trigger
  BEFORE UPDATE ON public.payment_history
  FOR EACH ROW EXECUTE FUNCTION update_payment_history_timestamp();

-- ============================================================
-- Payment Statistics View
-- ============================================================

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

-- ============================================================
-- Payment Analytics Functions
-- ============================================================

-- Function: Get user payment history with details
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

-- Function: Get payment statistics
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

-- Function: Get failed payments for monitoring
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

-- ============================================================
-- Sample Queries
-- ============================================================

-- Query 1: View all successful payments
-- SELECT * FROM payment_history WHERE payment_status = 'succeeded' ORDER BY payment_date DESC;

-- Query 2: View failed payments with reasons
-- SELECT user_id, amount, failure_reason, attempted_at FROM payment_history WHERE payment_status = 'failed';

-- Query 3: Get payment statistics
-- SELECT * FROM get_payment_statistics();

-- Query 4: Get user's payment history
-- SELECT * FROM get_user_payment_history('YOUR_USER_ID_HERE');

-- Query 5: Total revenue by billing cycle
-- SELECT 
--   billing_cycle, 
--   COUNT(*) as payment_count,
--   SUM(amount) as total_revenue
-- FROM payment_history 
-- WHERE payment_status = 'succeeded'
-- GROUP BY billing_cycle;

-- Query 6: Recent failed payments
-- SELECT * FROM get_failed_payments(30); -- Last 30 days

SELECT 'Enhanced payment tracking system created successfully!' AS status;
