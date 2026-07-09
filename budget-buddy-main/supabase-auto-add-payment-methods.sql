-- =====================================================
-- AUTO-ADD ALL PAYMENT METHODS ON USER CREATION
-- =====================================================
-- This trigger automatically adds all available payment
-- methods when a new user signs up
-- =====================================================

-- Create function to add default payment methods
CREATE OR REPLACE FUNCTION add_default_payment_methods()
RETURNS TRIGGER AS $$
DECLARE
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
  -- Add each payment method for the new user
  FOREACH payment_method IN ARRAY payment_methods LOOP
    INSERT INTO public.payment_methods (user_id, name)
    VALUES (NEW.id, payment_method)
    ON CONFLICT (user_id, name) DO NOTHING;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS add_payment_methods_on_signup ON public.profiles;

-- Create trigger that fires when new profile is created
CREATE TRIGGER add_payment_methods_on_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION add_default_payment_methods();

-- Add payment methods to existing users who don't have them
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
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Adding payment methods to existing users...';
  RAISE NOTICE '';
  
  -- Loop through all existing profiles
  FOR user_record IN SELECT id FROM public.profiles LOOP
    -- Add each payment method for this user
    FOREACH payment_method IN ARRAY payment_methods LOOP
      INSERT INTO public.payment_methods (user_id, name)
      VALUES (user_record.id, payment_method)
      ON CONFLICT (user_id, name) DO NOTHING;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE '✅ Payment methods added to all existing users!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Available payment methods (15 total):';
  RAISE NOTICE '   • Cash';
  RAISE NOTICE '   • Debit Card';
  RAISE NOTICE '   • Credit Card';
  RAISE NOTICE '   • Bank Transfer';
  RAISE NOTICE '   • Mobile Wallet';
  RAISE NOTICE '   • PayPal';
  RAISE NOTICE '   • Apple Pay';
  RAISE NOTICE '   • Google Pay';
  RAISE NOTICE '   • UPI';
  RAISE NOTICE '   • Cryptocurrency';
  RAISE NOTICE '   • Gift Card';
  RAISE NOTICE '   • Check';
  RAISE NOTICE '   • Money Order';
  RAISE NOTICE '   • Venmo';
  RAISE NOTICE '   • Zelle';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 New users will automatically get all payment methods!';
  RAISE NOTICE '';
END $$;

-- Verify: Show payment method count for each user
SELECT 
  p.email,
  p.name,
  COUNT(pm.name) as payment_method_count
FROM public.profiles p
LEFT JOIN public.payment_methods pm ON p.id = pm.user_id
GROUP BY p.email, p.name
ORDER BY p.email;
