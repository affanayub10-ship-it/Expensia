-- ============================================================
-- IMMEDIATE FIX - Run this SQL NOW
-- ============================================================

-- Fix the user with "cancelling" status
UPDATE subscriptions
SET 
  subscription_status = 'active',
  cancel_at_period_end = false,
  updated_at = NOW()
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'affanayub10@gmail.com'
);

-- Verify the fix
SELECT 
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.cancel_at_period_end,
  CASE 
    WHEN s.subscription_plan = 'premium' 
      AND (s.subscription_status = 'active' OR s.subscription_status = 'trialing')
    THEN '✅ WILL HAVE PREMIUM'
    ELSE '❌ NO PREMIUM'
  END as premium_check
FROM auth.users u
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com')
ORDER BY u.email;
