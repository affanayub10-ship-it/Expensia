-- ============================================================
-- Subscriptions View with User Information
-- This view joins subscriptions with user data from auth.users and profiles
-- ============================================================

-- Create a view that shows subscription details with user information
CREATE OR REPLACE VIEW public.subscriptions_with_users AS
SELECT 
  s.id,
  s.user_id,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.subscription_plan,
  s.subscription_status,
  s.billing_cycle,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.created_at,
  s.updated_at,
  -- User email from auth.users
  u.email as user_email,
  -- User name from profiles table
  p.name as user_name,
  -- Additional useful user info
  u.created_at as user_created_at,
  u.last_sign_in_at as user_last_sign_in_at,
  -- Computed fields
  CASE 
    WHEN s.subscription_plan = 'premium' AND s.subscription_status = 'active' THEN true
    ELSE false
  END as is_active_premium
FROM 
  public.subscriptions s
  INNER JOIN auth.users u ON s.user_id = u.id
  LEFT JOIN public.profiles p ON s.user_id = p.id;

-- Grant access to the view
GRANT SELECT ON public.subscriptions_with_users TO authenticated;
GRANT SELECT ON public.subscriptions_with_users TO service_role;

-- Create a function to get premium subscribers only
CREATE OR REPLACE FUNCTION get_premium_subscribers()
RETURNS TABLE (
  user_id uuid,
  user_name text,
  user_email text,
  subscription_plan text,
  subscription_status text,
  billing_cycle text,
  stripe_customer_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    user_id,
    user_name,
    user_email,
    subscription_plan,
    subscription_status,
    billing_cycle,
    stripe_customer_id,
    current_period_start,
    current_period_end,
    created_at
  FROM public.subscriptions_with_users
  WHERE subscription_plan = 'premium'
  ORDER BY created_at DESC;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_premium_subscribers() TO authenticated;
GRANT EXECUTE ON FUNCTION get_premium_subscribers() TO service_role;

-- Create a function to get all subscribers with counts
CREATE OR REPLACE FUNCTION get_subscription_stats()
RETURNS TABLE (
  total_users bigint,
  free_users bigint,
  premium_users bigint,
  active_premium bigint,
  canceled_premium bigint,
  monthly_subscribers bigint,
  yearly_subscribers bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE subscription_plan = 'free')::bigint as free_users,
    COUNT(*) FILTER (WHERE subscription_plan = 'premium')::bigint as premium_users,
    COUNT(*) FILTER (WHERE subscription_plan = 'premium' AND subscription_status = 'active')::bigint as active_premium,
    COUNT(*) FILTER (WHERE subscription_plan = 'premium' AND cancel_at_period_end = true)::bigint as canceled_premium,
    COUNT(*) FILTER (WHERE subscription_plan = 'premium' AND billing_cycle = 'monthly')::bigint as monthly_subscribers,
    COUNT(*) FILTER (WHERE subscription_plan = 'premium' AND billing_cycle = 'yearly')::bigint as yearly_subscribers
  FROM public.subscriptions_with_users;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_subscription_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscription_stats() TO service_role;

-- ============================================================
-- Example Queries
-- ============================================================

-- Query 1: View all subscriptions with user info
-- SELECT * FROM subscriptions_with_users;

-- Query 2: View only premium subscribers
-- SELECT * FROM get_premium_subscribers();

-- Query 3: View subscription statistics
-- SELECT * FROM get_subscription_stats();

-- Query 4: Find premium subscribers by email
-- SELECT user_name, user_email, subscription_plan, current_period_end 
-- FROM subscriptions_with_users 
-- WHERE user_email ILIKE '%example.com%' AND subscription_plan = 'premium';

-- Query 5: Premium subscribers expiring soon (within 7 days)
-- SELECT user_name, user_email, current_period_end
-- FROM subscriptions_with_users
-- WHERE subscription_plan = 'premium' 
--   AND subscription_status = 'active'
--   AND current_period_end <= NOW() + INTERVAL '7 days'
-- ORDER BY current_period_end ASC;

SELECT 'Subscriptions view and functions created successfully!' AS status;
