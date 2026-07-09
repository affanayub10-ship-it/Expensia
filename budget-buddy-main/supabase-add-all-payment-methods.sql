-- =====================================================
-- ADD ALL PAYMENT METHODS FOR USERS
-- =====================================================
-- This adds all available payment methods to users
-- so they can select from the complete list
-- =====================================================

DO $$
DECLARE
  user_record RECORD;
  payment_method TEXT;
  payment_methods TEXT[] := ARRAY[
    'Cash',
    'Debit Card',
    'Credit Card',
    'Bank Transfer',
    'Mobile Wallet',
    'PayPal',
    'Apple Pay',
    'Google Pay',
    'UPI',
    'Cryptocurrency',
    'Gift Card',
    'Check',
    'Money Order',
    'Venmo',
    'Zelle'
  ];
BEGIN
  -- Loop through all users
  FOR user_record IN SELECT id FROM auth.users LOOP
    -- Add each payment method for this user
    FOREACH payment_method IN ARRAY payment_methods LOOP
      INSERT INTO public.payment_methods (user_id, name)
      VALUES (user_record.id, payment_method)
      ON CONFLICT (user_id, name) DO NOTHING;
    END LOOP;
    
    RAISE NOTICE 'Added % payment methods for user: %', array_length(payment_methods, 1), user_record.id;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ All payment methods added to all users!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Available payment methods:';
  FOREACH payment_method IN ARRAY payment_methods LOOP
    RAISE NOTICE '   • %', payment_method;
  END LOOP;
  RAISE NOTICE '';
END $$;

-- Verify payment methods for each user
SELECT 
  u.email,
  COUNT(pm.name) as payment_method_count,
  array_agg(pm.name ORDER BY pm.name) as methods
FROM auth.users u
LEFT JOIN public.payment_methods pm ON u.id = pm.user_id
GROUP BY u.email
ORDER BY u.email;

-- Show all unique payment methods in database
SELECT DISTINCT name as payment_method
FROM public.payment_methods
ORDER BY name;
