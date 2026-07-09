-- =====================================================
-- INSTANT DUMMY DATA
-- =====================================================
-- This automatically finds your user and adds dummy data
-- Just run this directly in Supabase SQL Editor!
-- 
-- Requirements:
--   1. You have run supabase-schema.sql
--   2. You have at least one user created (via signup or migration)
-- =====================================================

DO $$
DECLARE
  test_user_id UUID;
  user_email TEXT;
BEGIN
  -- Get the first user from auth.users
  SELECT id, email INTO test_user_id, user_email FROM auth.users ORDER BY created_at LIMIT 1;
  
  IF test_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found! Please create a user first.';
  END IF;

  RAISE NOTICE '✅ Adding dummy data for: % (ID: %)', user_email, test_user_id;

  -- =====================================================
  -- PAYMENT METHODS
  -- =====================================================
  INSERT INTO public.payment_methods (user_id, name) VALUES
  (test_user_id, 'Cash'),
  (test_user_id, 'Credit Card'),
  (test_user_id, 'Debit Card'),
  (test_user_id, 'Bank Transfer'),
  (test_user_id, 'PayPal')
  ON CONFLICT (user_id, name) DO NOTHING;

  -- =====================================================
  -- EXPENSES (21 realistic transactions)
  -- =====================================================
  INSERT INTO public.expenses (user_id, title, amount, date, category, payment_method, merchant, currency, tags, status, recurrence, deleted) VALUES
  -- Today
  (test_user_id, 'Morning coffee', 5.50, CURRENT_DATE, 'Food', 'Cash', 'Starbucks', 'USD', ARRAY['coffee'], 'Paid', 'Daily', false),
  (test_user_id, 'Lunch', 18.75, CURRENT_DATE, 'Food', 'Credit Card', 'Chipotle', 'USD', ARRAY['lunch'], 'Paid', 'None', false),
  
  -- Yesterday
  (test_user_id, 'Grocery shopping', 127.45, CURRENT_DATE - 1, 'Food', 'Debit Card', 'Whole Foods', 'USD', ARRAY['groceries'], 'Paid', 'Weekly', false),
  (test_user_id, 'Gas fill-up', 58.20, CURRENT_DATE - 1, 'Fuel', 'Credit Card', 'Shell', 'USD', ARRAY['car'], 'Paid', 'Weekly', false),
  
  -- 2-3 days ago
  (test_user_id, 'Netflix', 15.99, CURRENT_DATE - 2, 'Entertainment', 'Credit Card', 'Netflix', 'USD', ARRAY['streaming'], 'Paid', 'Monthly', false),
  (test_user_id, 'Gym membership', 49.99, CURRENT_DATE - 2, 'Healthcare', 'Credit Card', 'LA Fitness', 'USD', ARRAY['fitness'], 'Paid', 'Monthly', false),
  (test_user_id, 'Dinner out', 89.50, CURRENT_DATE - 3, 'Food', 'Credit Card', 'Olive Garden', 'USD', ARRAY['dining'], 'Paid', 'None', false),
  
  -- Last week
  (test_user_id, 'Amazon order', 124.99, CURRENT_DATE - 5, 'Shopping', 'Credit Card', 'Amazon', 'USD', ARRAY['online'], 'Paid', 'None', false),
  (test_user_id, 'Uber ride', 24.50, CURRENT_DATE - 6, 'Fuel', 'Credit Card', 'Uber', 'USD', ARRAY['transport'], 'Paid', 'None', false),
  (test_user_id, 'Movie tickets', 28.00, CURRENT_DATE - 7, 'Entertainment', 'Debit Card', 'AMC', 'USD', ARRAY['movies'], 'Paid', 'None', false),
  (test_user_id, 'Pharmacy', 35.60, CURRENT_DATE - 8, 'Healthcare', 'Cash', 'CVS', 'USD', ARRAY['medicine'], 'Paid', 'None', false),
  
  -- 2 weeks ago
  (test_user_id, 'Electricity bill', 125.40, CURRENT_DATE - 12, 'Bills', 'Bank Transfer', 'Power Co', 'USD', ARRAY['utilities'], 'Paid', 'Monthly', false),
  (test_user_id, 'Internet bill', 79.99, CURRENT_DATE - 13, 'Bills', 'Bank Transfer', 'Comcast', 'USD', ARRAY['utilities'], 'Paid', 'Monthly', false),
  (test_user_id, 'Phone bill', 55.00, CURRENT_DATE - 14, 'Bills', 'Credit Card', 'Verizon', 'USD', ARRAY['utilities'], 'Paid', 'Monthly', false),
  (test_user_id, 'New shoes', 89.99, CURRENT_DATE - 15, 'Shopping', 'Credit Card', 'Nike', 'USD', ARRAY['clothing'], 'Paid', 'None', false),
  
  -- This month
  (test_user_id, 'Monthly rent', 1850.00, CURRENT_DATE - 5, 'Rent', 'Bank Transfer', 'Landlord', 'USD', ARRAY['housing'], 'Paid', 'Monthly', false),
  (test_user_id, 'Spotify', 9.99, CURRENT_DATE - 10, 'Entertainment', 'Credit Card', 'Spotify', 'USD', ARRAY['music'], 'Paid', 'Monthly', false),
  (test_user_id, 'Online course', 49.99, CURRENT_DATE - 20, 'Education', 'Credit Card', 'Udemy', 'USD', ARRAY['learning'], 'Paid', 'None', false),
  (test_user_id, 'Book', 24.99, CURRENT_DATE - 22, 'Shopping', 'Credit Card', 'Amazon', 'USD', ARRAY['books'], 'Paid', 'None', false),
  (test_user_id, 'Car insurance', 156.00, CURRENT_DATE - 25, 'Bills', 'Bank Transfer', 'Geico', 'USD', ARRAY['insurance'], 'Paid', 'Monthly', false),
  
  -- Upcoming
  (test_user_id, 'Dentist', 75.00, CURRENT_DATE + 3, 'Healthcare', 'Credit Card', 'Dental Clinic', 'USD', ARRAY['health'], 'Pending', 'None', false);

  -- =====================================================
  -- INCOME (6 records)
  -- =====================================================
  INSERT INTO public.income (user_id, source, amount, date, category, currency, notes) VALUES
  (test_user_id, 'Monthly salary', 5000.00, CURRENT_DATE - 5, 'Salary', 'USD', 'Full-time job'),
  (test_user_id, 'Freelance project', 850.00, CURRENT_DATE - 15, 'Freelance', 'USD', 'Website project'),
  (test_user_id, 'Investment returns', 125.50, CURRENT_DATE - 20, 'Investment', 'USD', 'Dividends'),
  (test_user_id, 'Consulting', 320.00, CURRENT_DATE - 10, 'Freelance', 'USD', 'Side project'),
  (test_user_id, 'Bonus', 1000.00, CURRENT_DATE - 30, 'Bonus', 'USD', 'Q1 bonus'),
  (test_user_id, 'Tax refund', 650.00, CURRENT_DATE - 45, 'Refund', 'USD', 'Tax return');

  -- =====================================================
  -- BUDGETS (9 categories)
  -- =====================================================
  INSERT INTO public.budgets (user_id, category, limit_amount) VALUES
  (test_user_id, 'Food', 600.00),
  (test_user_id, 'Fuel', 250.00),
  (test_user_id, 'Entertainment', 200.00),
  (test_user_id, 'Shopping', 400.00),
  (test_user_id, 'Bills', 500.00),
  (test_user_id, 'Healthcare', 200.00),
  (test_user_id, 'Rent', 1850.00),
  (test_user_id, 'Education', 150.00),
  (test_user_id, 'Travel', 500.00)
  ON CONFLICT (user_id, category) DO NOTHING;

  -- =====================================================
  -- NOTIFICATIONS (7 items)
  -- =====================================================
  INSERT INTO public.notifications (user_id, type, title, message, read) VALUES
  (test_user_id, 'budget', 'Budget Warning', 'You have used 85% of your Food budget this month.', false),
  (test_user_id, 'recurring', 'Recurring Payment', 'Netflix subscription of $15.99 charged.', true),
  (test_user_id, 'bill', 'Upcoming Bill', 'Dentist payment of $75.00 due in 3 days.', false),
  (test_user_id, 'summary', 'Weekly Summary', 'You spent $456.23 this week.', true),
  (test_user_id, 'budget', 'Budget Update', 'Great! You are under Entertainment budget.', true),
  (test_user_id, 'income', 'Income Received', 'Freelance payment of $850.00 credited.', true),
  (test_user_id, 'bill', 'Bill Paid', 'Electricity bill paid successfully.', true);

  RAISE NOTICE '';
  RAISE NOTICE '✨ SUCCESS! Dummy data created for: %', user_email;
  RAISE NOTICE '';
  RAISE NOTICE '📊 Created:';
  RAISE NOTICE '   ✅ 5 payment methods';
  RAISE NOTICE '   ✅ 21 expenses ($3,095.81 total)';
  RAISE NOTICE '   ✅ 6 income records ($7,945.50 total)';
  RAISE NOTICE '   ✅ 9 budgets';
  RAISE NOTICE '   ✅ 7 notifications';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 You can now login and see your data!';
  
END $$;

-- Show summary
SELECT 
  'Expenses' as type, 
  COUNT(*)::text as count, 
  '$' || SUM(amount)::text as total 
FROM public.expenses WHERE deleted = false
UNION ALL
SELECT 
  'Income' as type, 
  COUNT(*)::text as count, 
  '$' || SUM(amount)::text as total 
FROM public.income
UNION ALL
SELECT 
  'Budgets' as type, 
  COUNT(*)::text as count, 
  '$' || SUM(limit_amount)::text as total 
FROM public.budgets;
