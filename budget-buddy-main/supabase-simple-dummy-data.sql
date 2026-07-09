-- =====================================================
-- SIMPLE DUMMY DATA - SINGLE USER
-- =====================================================
-- This creates dummy data for the first user in your database
-- Run this AFTER:
--   1. Running supabase-schema.sql
--   2. Creating at least one user via signup or migration
-- =====================================================

-- This will use the FIRST user it finds in the auth.users table
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Get the first user ID from auth.users
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found! Please create a user first via signup or run the migration script.';
  END IF;

  RAISE NOTICE 'Adding dummy data for user: %', test_user_id;

  -- =====================================================
  -- PAYMENT METHODS
  -- =====================================================
  INSERT INTO public.payment_methods (user_id, name) VALUES
  (test_user_id, 'Cash'),
  (test_user_id, 'Credit Card'),
  (test_user_id, 'Debit Card'),
  (test_user_id, 'Bank Transfer'),
  (test_user_id, 'PayPal'),
  (test_user_id, 'Apple Pay')
  ON CONFLICT (user_id, name) DO NOTHING;

  -- =====================================================
  -- EXPENSES
  -- =====================================================
  INSERT INTO public.expenses (user_id, title, amount, date, category, payment_method, merchant, currency, tags, status, recurrence, deleted) VALUES
  -- This Week
  (test_user_id, 'Morning coffee', 5.50, CURRENT_DATE, 'Food', 'Cash', 'Starbucks', 'USD', ARRAY['coffee'], 'Paid', 'Daily', false),
  (test_user_id, 'Lunch meeting', 32.00, CURRENT_DATE, 'Food', 'Credit Card', 'Chipotle', 'USD', ARRAY['lunch', 'business'], 'Paid', 'None', false),
  (test_user_id, 'Grocery shopping', 145.78, CURRENT_DATE - 1, 'Food', 'Debit Card', 'Whole Foods', 'USD', ARRAY['groceries', 'weekly'], 'Paid', 'Weekly', false),
  (test_user_id, 'Gas station', 62.50, CURRENT_DATE - 1, 'Fuel', 'Credit Card', 'Shell', 'USD', ARRAY['car'], 'Paid', 'Weekly', false),
  (test_user_id, 'Netflix subscription', 15.99, CURRENT_DATE - 2, 'Entertainment', 'Credit Card', 'Netflix', 'USD', ARRAY['streaming'], 'Paid', 'Monthly', false),
  (test_user_id, 'Gym membership', 49.99, CURRENT_DATE - 2, 'Healthcare', 'Credit Card', 'LA Fitness', 'USD', ARRAY['fitness'], 'Paid', 'Monthly', false),
  (test_user_id, 'Dinner date', 89.50, CURRENT_DATE - 3, 'Food', 'Credit Card', 'Olive Garden', 'USD', ARRAY['dining', 'date'], 'Paid', 'None', false),
  (test_user_id, 'Amazon order', 124.99, CURRENT_DATE - 4, 'Shopping', 'Credit Card', 'Amazon', 'USD', ARRAY['online', 'electronics'], 'Paid', 'None', false),
  (test_user_id, 'Uber ride', 18.75, CURRENT_DATE - 5, 'Fuel', 'Apple Pay', 'Uber', 'USD', ARRAY['transportation'], 'Paid', 'None', false),
  (test_user_id, 'Movie tickets', 28.00, CURRENT_DATE - 6, 'Entertainment', 'Debit Card', 'AMC Theaters', 'USD', ARRAY['movies'], 'Paid', 'None', false),
  
  -- Last Week
  (test_user_id, 'Electricity bill', 125.40, CURRENT_DATE - 10, 'Bills', 'Bank Transfer', 'Power Company', 'USD', ARRAY['utilities'], 'Paid', 'Monthly', false),
  (test_user_id, 'Internet bill', 79.99, CURRENT_DATE - 12, 'Bills', 'Bank Transfer', 'Comcast', 'USD', ARRAY['utilities'], 'Paid', 'Monthly', false),
  (test_user_id, 'Phone bill', 55.00, CURRENT_DATE - 13, 'Bills', 'Credit Card', 'Verizon', 'USD', ARRAY['utilities'], 'Paid', 'Monthly', false),
  (test_user_id, 'Pharmacy', 35.60, CURRENT_DATE - 14, 'Healthcare', 'Debit Card', 'CVS', 'USD', ARRAY['medicine'], 'Paid', 'None', false),
  (test_user_id, 'New running shoes', 89.99, CURRENT_DATE - 15, 'Shopping', 'Credit Card', 'Nike', 'USD', ARRAY['clothing', 'fitness'], 'Paid', 'None', false),
  
  -- This Month
  (test_user_id, 'Monthly rent', 1850.00, CURRENT_DATE - 5, 'Rent', 'Bank Transfer', 'Property Manager', 'USD', ARRAY['housing'], 'Paid', 'Monthly', false),
  (test_user_id, 'Spotify Premium', 9.99, CURRENT_DATE - 8, 'Entertainment', 'Credit Card', 'Spotify', 'USD', ARRAY['music'], 'Paid', 'Monthly', false),
  (test_user_id, 'Online course', 49.99, CURRENT_DATE - 20, 'Education', 'Credit Card', 'Udemy', 'USD', ARRAY['learning'], 'Paid', 'None', false),
  (test_user_id, 'Book purchase', 24.99, CURRENT_DATE - 22, 'Shopping', 'Credit Card', 'Barnes & Noble', 'USD', ARRAY['books'], 'Paid', 'None', false),
  (test_user_id, 'Car insurance', 156.00, CURRENT_DATE - 25, 'Bills', 'Bank Transfer', 'Geico', 'USD', ARRAY['insurance'], 'Paid', 'Monthly', false),
  
  -- Pending/Upcoming
  (test_user_id, 'Dentist appointment', 75.00, CURRENT_DATE + 3, 'Healthcare', 'Credit Card', 'Dental Clinic', 'USD', ARRAY['health'], 'Pending', 'None', false);

  -- =====================================================
  -- INCOME
  -- =====================================================
  INSERT INTO public.income (user_id, source, amount, date, category, currency, notes) VALUES
  (test_user_id, 'Monthly salary', 5000.00, CURRENT_DATE - 5, 'Salary', 'USD', 'Primary employer'),
  (test_user_id, 'Freelance project', 850.00, CURRENT_DATE - 15, 'Freelance', 'USD', 'Website development'),
  (test_user_id, 'Stock dividends', 125.50, CURRENT_DATE - 20, 'Investment', 'USD', 'Portfolio dividends'),
  (test_user_id, 'Side gig', 320.00, CURRENT_DATE - 10, 'Freelance', 'USD', 'Consulting work'),
  (test_user_id, 'Bonus', 1000.00, CURRENT_DATE - 30, 'Bonus', 'USD', 'Q1 Performance bonus'),
  (test_user_id, 'Tax refund', 650.00, CURRENT_DATE - 45, 'Refund', 'USD', 'Federal tax refund');

  -- =====================================================
  -- BUDGETS
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
  -- NOTIFICATIONS
  -- =====================================================
  INSERT INTO public.notifications (user_id, type, title, message, read) VALUES
  (test_user_id, 'budget', '⚠️ Budget Alert', 'You have used 85% of your Food budget this month.', false),
  (test_user_id, 'recurring', '🔄 Recurring Payment', 'Netflix subscription of $15.99 has been charged.', true),
  (test_user_id, 'bill', '📅 Upcoming Bill', 'Your dentist appointment payment of $75.00 is coming up in 3 days.', false),
  (test_user_id, 'summary', '📊 Weekly Summary', 'You spent $456.23 this week across 15 transactions.', true),
  (test_user_id, 'budget', '🎯 Budget Update', 'Great job! You are 30% under your Entertainment budget.', true),
  (test_user_id, 'income', '💰 Income Received', 'Freelance payment of $850.00 has been credited to your account.', true),
  (test_user_id, 'bill', '✅ Bill Paid', 'Your electricity bill has been successfully paid.', true);

  RAISE NOTICE 'Successfully added dummy data!';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  - 6 payment methods';
  RAISE NOTICE '  - 21 expenses';
  RAISE NOTICE '  - 6 income records';
  RAISE NOTICE '  - 9 budgets';
  RAISE NOTICE '  - 7 notifications';
  
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Uncomment these to verify the data:

-- Total expenses
-- SELECT COUNT(*) as total_expenses, SUM(amount) as total_amount 
-- FROM public.expenses WHERE deleted = false;

-- Expenses by category
-- SELECT category, COUNT(*) as count, SUM(amount) as total 
-- FROM public.expenses WHERE deleted = false 
-- GROUP BY category ORDER BY total DESC;

-- Total income
-- SELECT COUNT(*) as total_income, SUM(amount) as total_amount 
-- FROM public.income;

-- Budget vs Actual spending
-- SELECT 
--   b.category,
--   b.limit_amount as budget,
--   COALESCE(SUM(e.amount), 0) as spent,
--   b.limit_amount - COALESCE(SUM(e.amount), 0) as remaining
-- FROM public.budgets b
-- LEFT JOIN public.expenses e ON e.category = b.category AND e.deleted = false
-- GROUP BY b.category, b.limit_amount;

-- Unread notifications
-- SELECT COUNT(*) FROM public.notifications WHERE read = false;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- Your database now has realistic dummy data for testing
-- =====================================================
