-- ============================================================
-- IMMEDIATE FIX: Update Existing Premium Users
-- Run this FIRST to fix users who already paid
-- ============================================================

-- Step 1: Fix subscription status for existing premium users
UPDATE subscriptions
SET 
  subscription_status = 'active',
  cancel_at_period_end = false,
  updated_at = NOW()
WHERE subscription_plan = 'premium'
  AND subscription_status != 'active'
  AND subscription_status != 'canceled';

-- Step 2: Verify the fix worked
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
  s.updated_at
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_plan = 'premium'
ORDER BY s.updated_at DESC;

-- Step 3: Show summary
SELECT 
  subscription_plan,
  subscription_status,
  COUNT(*) as user_count
FROM subscriptions
GROUP BY subscription_plan, subscription_status
ORDER BY subscription_plan, subscription_status;
