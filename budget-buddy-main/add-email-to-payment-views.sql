-- ============================================================
-- Add Email to Payment History and Stats Views
-- Run this in Supabase SQL Editor
-- ============================================================

-- Drop existing views to recreate them with email
DROP VIEW IF EXISTS public.payment_stats CASCADE;
DROP VIEW IF EXISTS public.payment_history_with_email CASCADE;
DROP VIEW IF EXISTS public.subscription_revenue_stats CASCADE;

-- ============================================================
-- 1. Payment History with Email View
-- ============================================================
CREATE OR REPLACE VIEW public.payment_history_with_email AS
SELECT 
  ph.id,
  ph.user_id,
  u.email,
  ph.stripe_customer_id,
  ph.stripe_subscription_id,
  ph.stripe_payment_intent_id,
  ph.stripe_invoice_id,
  ph.stripe_charge_id,
  ph.amount,
  ph.currency,
  ph.payment_method_type,
  ph.payment_method_last4,
  ph.payment_method_brand,
  ph.payment_status,
  ph.payment_type,
  ph.failure_reason,
  ph.invoice_url,
  ph.receipt_url,
  ph.invoice_pdf,
  ph.subscription_plan,
  ph.billing_cycle,
  ph.billing_period_start,
  ph.billing_period_end,
  ph.description,
  ph.metadata,
  ph.payment_date,
  ph.attempted_at,
  ph.succeeded_at,
  ph.failed_at,
  ph.created_at,
  ph.updated_at
FROM public.payment_history ph
INNER JOIN auth.users u ON ph.user_id = u.id
ORDER BY ph.created_at DESC;

GRANT SELECT ON public.payment_history_with_email TO authenticated;
GRANT SELECT ON public.payment_history_with_email TO service_role;

-- ============================================================
-- 2. Payment Stats with Email
-- ============================================================
CREATE OR REPLACE VIEW public.payment_stats AS
SELECT 
  ph.user_id,
  u.email,
  COUNT(*) as total_payments,
  COUNT(*) FILTER (WHERE ph.payment_status = 'succeeded') as successful_payments,
  COUNT(*) FILTER (WHERE ph.payment_status = 'failed') as failed_payments,
  COUNT(*) FILTER (WHERE ph.payment_status = 'pending') as pending_payments,
  SUM(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded') as total_revenue,
  AVG(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded') as avg_payment_amount,
  MAX(ph.payment_date) FILTER (WHERE ph.payment_status = 'succeeded') as last_successful_payment,
  MIN(ph.payment_date) FILTER (WHERE ph.payment_status = 'succeeded') as first_payment_date,
  -- Additional useful stats
  COUNT(*) FILTER (WHERE ph.billing_cycle = 'monthly') as monthly_subscriptions,
  COUNT(*) FILTER (WHERE ph.billing_cycle = 'yearly') as yearly_subscriptions,
  SUM(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded' AND ph.billing_cycle = 'monthly') as monthly_revenue,
  SUM(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded' AND ph.billing_cycle = 'yearly') as yearly_revenue
FROM public.payment_history ph
INNER JOIN auth.users u ON ph.user_id = u.id
GROUP BY ph.user_id, u.email
ORDER BY total_revenue DESC NULLS LAST;

GRANT SELECT ON public.payment_stats TO authenticated;
GRANT SELECT ON public.payment_stats TO service_role;

-- ============================================================
-- 3. Subscription Revenue Stats (Overall)
-- ============================================================
CREATE OR REPLACE VIEW public.subscription_revenue_stats AS
SELECT 
  COUNT(DISTINCT ph.user_id) as total_subscribers,
  COUNT(*) as total_transactions,
  COUNT(*) FILTER (WHERE ph.payment_status = 'succeeded') as successful_transactions,
  COUNT(*) FILTER (WHERE ph.payment_status = 'failed') as failed_transactions,
  SUM(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded') as total_revenue,
  AVG(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded') as avg_transaction_value,
  SUM(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded' AND ph.billing_cycle = 'monthly') as monthly_plan_revenue,
  SUM(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded' AND ph.billing_cycle = 'yearly') as yearly_plan_revenue,
  COUNT(*) FILTER (WHERE ph.billing_cycle = 'monthly') as monthly_plan_count,
  COUNT(*) FILTER (WHERE ph.billing_cycle = 'yearly') as yearly_plan_count,
  MAX(ph.payment_date) as last_payment_date,
  MIN(ph.payment_date) as first_payment_date
FROM public.payment_history ph;

GRANT SELECT ON public.subscription_revenue_stats TO authenticated;
GRANT SELECT ON public.subscription_revenue_stats TO service_role;

-- ============================================================
-- 4. Active Subscribers with Email
-- ============================================================
CREATE OR REPLACE VIEW public.active_premium_subscribers AS
SELECT 
  s.user_id,
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.billing_cycle,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.created_at as subscription_created,
  s.updated_at as subscription_updated,
  -- Payment stats for this user
  (SELECT COUNT(*) FROM payment_history ph WHERE ph.user_id = s.user_id) as total_payments,
  (SELECT SUM(amount) FROM payment_history ph WHERE ph.user_id = s.user_id AND ph.payment_status = 'succeeded') as lifetime_value
FROM subscriptions s
INNER JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_plan = 'premium'
  AND (s.subscription_status = 'active' OR s.subscription_status = 'trialing')
ORDER BY s.updated_at DESC;

GRANT SELECT ON public.active_premium_subscribers TO authenticated;
GRANT SELECT ON public.active_premium_subscribers TO service_role;

-- ============================================================
-- 5. Update Helper Functions to Include Email
-- ============================================================

-- Get user payment history (updated to include email)
CREATE OR REPLACE FUNCTION get_user_payment_history_with_email(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  amount DECIMAL,
  currency TEXT,
  payment_status TEXT,
  payment_date TIMESTAMPTZ,
  subscription_plan TEXT,
  billing_cycle TEXT,
  receipt_url TEXT,
  failure_reason TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    ph.id,
    ph.user_id,
    u.email,
    ph.amount,
    ph.currency,
    ph.payment_status,
    ph.payment_date,
    ph.subscription_plan,
    ph.billing_cycle,
    ph.receipt_url,
    ph.failure_reason,
    ph.stripe_subscription_id,
    ph.created_at
  FROM public.payment_history ph
  INNER JOIN auth.users u ON ph.user_id = u.id
  WHERE (p_user_id IS NULL OR ph.user_id = p_user_id)
  ORDER BY ph.payment_date DESC;
$$;

GRANT EXECUTE ON FUNCTION get_user_payment_history_with_email(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_payment_history_with_email(UUID) TO service_role;

-- ============================================================
-- 6. Useful Query Functions
-- ============================================================

-- Get all premium subscribers with their payment info
CREATE OR REPLACE FUNCTION get_all_premium_subscribers()
RETURNS TABLE (
  email TEXT,
  subscription_status TEXT,
  billing_cycle TEXT,
  current_period_end TIMESTAMPTZ,
  total_payments BIGINT,
  total_spent NUMERIC,
  last_payment_date TIMESTAMPTZ,
  stripe_customer_id TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    u.email,
    s.subscription_status,
    s.billing_cycle,
    s.current_period_end,
    COUNT(ph.id) as total_payments,
    COALESCE(SUM(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded'), 0) as total_spent,
    MAX(ph.payment_date) as last_payment_date,
    s.stripe_customer_id
  FROM subscriptions s
  INNER JOIN auth.users u ON s.user_id = u.id
  LEFT JOIN payment_history ph ON s.user_id = ph.user_id
  WHERE s.subscription_plan = 'premium'
  GROUP BY u.email, s.subscription_status, s.billing_cycle, s.current_period_end, s.stripe_customer_id
  ORDER BY total_spent DESC NULLS LAST;
$$;

GRANT EXECUTE ON FUNCTION get_all_premium_subscribers() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_premium_subscribers() TO service_role;

-- Get revenue by billing cycle
CREATE OR REPLACE FUNCTION get_revenue_by_cycle()
RETURNS TABLE (
  billing_cycle TEXT,
  subscriber_count BIGINT,
  total_revenue NUMERIC,
  avg_revenue_per_subscriber NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    ph.billing_cycle,
    COUNT(DISTINCT ph.user_id) as subscriber_count,
    SUM(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded') as total_revenue,
    AVG(ph.amount) FILTER (WHERE ph.payment_status = 'succeeded') as avg_revenue_per_subscriber
  FROM payment_history ph
  WHERE ph.billing_cycle IS NOT NULL
  GROUP BY ph.billing_cycle
  ORDER BY total_revenue DESC NULLS LAST;
$$;

GRANT EXECUTE ON FUNCTION get_revenue_by_cycle() TO authenticated;
GRANT EXECUTE ON FUNCTION get_revenue_by_cycle() TO service_role;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================
SELECT 
  'Views and functions created successfully!' as status,
  'You can now query payment data with email addresses' as message;

-- ============================================================
-- EXAMPLE QUERIES TO USE
-- ============================================================

-- Show all payment history with emails (most recent first)
-- SELECT * FROM payment_history_with_email LIMIT 20;

-- Show payment stats per user with email
-- SELECT * FROM payment_stats;

-- Show overall revenue statistics
-- SELECT * FROM subscription_revenue_stats;

-- Show all active premium subscribers
-- SELECT * FROM active_premium_subscribers;

-- Get all premium subscribers with payment details
-- SELECT * FROM get_all_premium_subscribers();

-- Get revenue breakdown by billing cycle
-- SELECT * FROM get_revenue_by_cycle();

-- Get specific user's payment history by email
-- SELECT * FROM payment_history_with_email WHERE email = 'user@example.com';
