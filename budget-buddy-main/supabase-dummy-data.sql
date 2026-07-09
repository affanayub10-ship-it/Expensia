-- =====================================================
-- DUMMY DATA FOR BUDGET BUDDY APPLICATION
-- =====================================================
-- This script creates test users and populates the database with sample data
-- Run this AFTER running supabase-schema.sql
-- 
-- WARNING: This will create real user accounts in Supabase Auth
-- You'll need to use Supabase Dashboard to create the actual auth users first,
-- or use the migration script (npm run migrate) which handles this automatically
-- =====================================================

-- =====================================================
-- TEST USERS
-- =====================================================
-- You need to create these users manually in Supabase Dashboard:
-- Go to Authentication → Users → Add User
-- 
-- User 1:
--   Email: demo@budgetbuddy.com
--   Password: Demo@1234
--   User ID: Copy the UUID after creation
--
-- User 2:
--   Email: alex@budgetbuddy.com
--   Password: Alex@1234
--   User ID: Copy the UUID after creation
-- =====================================================

-- Replace these UUIDs with the actual UUIDs from your created users
-- Get these from: Supabase Dashboard → Authentication → Users
DO $$
DECLARE
  user1_id UUID := 'REPLACE_WITH_DEMO_USER_UUID'; -- demo@budgetbuddy.com
  user2_id UUID := 'REPLACE_WITH_ALEX_USER_UUID'; -- alex@budgetbuddy.com
BEGIN

-- =====================================================
-- PROFILES (User Information)
-- =====================================================
INSERT INTO public.profiles (id, name, email, avatar) VALUES
(user1_id, 'Demo User', 'demo@budgetbuddy.com', NULL),
(user2_id, 'Alex Johnson', 'alex@budgetbuddy.com', NULL)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SETTINGS (User Preferences)
-- =====================================================
INSERT INTO public.settings (user_id, currency, timezone, date_format, language, default_payment_method, default_category) VALUES
(user1_id, 'USD', 'America/New_York', 'MMM d, yyyy', 'English', 'Credit Card', 'Food'),
(user2_id, 'EUR', 'Europe/London', 'dd/MM/yyyy', 'English', 'Debit Card', 'Shopping')
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- PAYMENT METHODS
-- =====================================================
INSERT INTO public.payment_methods (user_id, name) VALUES
(user1_id, 'Cash'),
(user1_id, 'Credit Card'),
(user1_id, 'Debit Card'),
(user1_id, 'Bank Transfer'),
(user1_id, 'PayPal'),
(user2_id, 'Cash'),
(user2_id, 'Debit Card'),
(user2_id, 'Apple Pay')
ON CONFLICT (user_id, name) DO NOTHING;

-- =====================================================
-- EXPENSES (User 1 - Demo User)
-- =====================================================
INSERT INTO public.expenses (user_id, title, amount, date, category, payment_method, merchant, location, currency, tags, status, recurrence, receipt, deleted) VALUES
-- Food & Dining
(user1_id, 'Grocery shopping', 127.45, CURRENT_DATE - INTERVAL '1 day', 'Food', 'Credit Card', 'Whole Foods', 'Downtown', 'USD', ARRAY['groceries', 'weekly'], 'Paid', 'None', NULL, false),
(user1_id, 'Lunch at cafe', 18.50, CURRENT_DATE - INTERVAL '2 days', 'Food', 'Credit Card', 'Blue Bottle Coffee', NULL, 'USD', ARRAY['lunch'], 'Paid', 'None', NULL, false),
(user1_id, 'Dinner with friends', 85.00, CURRENT_DATE - INTERVAL '3 days', 'Food', 'Credit Card', 'Olive Garden', 'Main Street', 'USD', ARRAY['dining', 'social'], 'Paid', 'None', NULL, false),
(user1_id, 'Coffee', 5.75, CURRENT_DATE - INTERVAL '1 day', 'Food', 'Cash', 'Starbucks', NULL, 'USD', ARRAY['coffee'], 'Paid', 'Daily', NULL, false),
(user1_id, 'Pizza delivery', 32.00, CURRENT_DATE - INTERVAL '5 days', 'Food', 'Credit Card', 'Dominos', NULL, 'USD', ARRAY[], 'Paid', 'None', NULL, false),

-- Transportation
(user1_id, 'Gas fill-up', 58.20, CURRENT_DATE - INTERVAL '4 days', 'Fuel', 'Debit Card', 'Shell Gas Station', NULL, 'USD', ARRAY['car'], 'Paid', 'Weekly', NULL, false),
(user1_id, 'Uber ride', 24.50, CURRENT_DATE - INTERVAL '2 days', 'Fuel', 'Credit Card', 'Uber', NULL, 'USD', ARRAY['transportation'], 'Paid', 'None', NULL, false),
(user1_id, 'Car wash', 15.00, CURRENT_DATE - INTERVAL '6 days', 'Fuel', 'Cash', 'Quick Wash', NULL, 'USD', ARRAY[], 'Paid', 'None', NULL, false),

-- Entertainment
(user1_id, 'Netflix subscription', 15.99, CURRENT_DATE - INTERVAL '1 day', 'Entertainment', 'Credit Card', 'Netflix', NULL, 'USD', ARRAY['streaming'], 'Paid', 'Monthly', NULL, false),
(user1_id, 'Movie tickets', 28.00, CURRENT_DATE - INTERVAL '5 days', 'Entertainment', 'Credit Card', 'AMC Theaters', NULL, 'USD', ARRAY['movies'], 'Paid', 'None', NULL, false),
(user1_id, 'Spotify Premium', 9.99, CURRENT_DATE - INTERVAL '2 days', 'Entertainment', 'Credit Card', 'Spotify', NULL, 'USD', ARRAY['music', 'streaming'], 'Paid', 'Monthly', NULL, false),
(user1_id, 'Concert tickets', 125.00, CURRENT_DATE - INTERVAL '10 days', 'Entertainment', 'Credit Card', 'Ticketmaster', NULL, 'USD', ARRAY['concert', 'event'], 'Paid', 'None', NULL, false),

-- Shopping
(user1_id, 'New running shoes', 89.99, CURRENT_DATE - INTERVAL '7 days', 'Shopping', 'Credit Card', 'Nike', 'Mall', 'USD', ARRAY['clothing', 'fitness'], 'Paid', 'None', NULL, false),
(user1_id, 'Amazon order', 156.78, CURRENT_DATE - INTERVAL '3 days', 'Shopping', 'Credit Card', 'Amazon', NULL, 'USD', ARRAY['online'], 'Paid', 'None', NULL, false),
(user1_id, 'Book purchase', 24.99, CURRENT_DATE - INTERVAL '8 days', 'Shopping', 'Credit Card', 'Barnes & Noble', NULL, 'USD', ARRAY['books'], 'Paid', 'None', NULL, false),

-- Bills & Utilities
(user1_id, 'Electricity bill', 125.40, CURRENT_DATE - INTERVAL '15 days', 'Bills', 'Bank Transfer', 'Pacific Gas & Electric', NULL, 'USD', ARRAY['utilities'], 'Paid', 'Monthly', NULL, false),
(user1_id, 'Internet bill', 79.99, CURRENT_DATE - INTERVAL '12 days', 'Bills', 'Bank Transfer', 'Comcast', NULL, 'USD', ARRAY['utilities'], 'Paid', 'Monthly', NULL, false),
(user1_id, 'Water bill', 45.20, CURRENT_DATE - INTERVAL '20 days', 'Bills', 'Bank Transfer', 'City Water', NULL, 'USD', ARRAY['utilities'], 'Paid', 'Monthly', NULL, false),
(user1_id, 'Phone bill', 55.00, CURRENT_DATE - INTERVAL '5 days', 'Bills', 'Credit Card', 'Verizon', NULL, 'USD', ARRAY['utilities'], 'Paid', 'Monthly', NULL, false),

-- Healthcare
(user1_id, 'Gym membership', 49.99, CURRENT_DATE - INTERVAL '1 day', 'Healthcare', 'Credit Card', '24 Hour Fitness', NULL, 'USD', ARRAY['fitness'], 'Paid', 'Monthly', NULL, false),
(user1_id, 'Pharmacy', 35.60, CURRENT_DATE - INTERVAL '9 days', 'Healthcare', 'Cash', 'CVS', NULL, 'USD', ARRAY['medicine'], 'Paid', 'None', NULL, false),
(user1_id, 'Doctor visit copay', 25.00, CURRENT_DATE - INTERVAL '14 days', 'Healthcare', 'Credit Card', 'Medical Center', NULL, 'USD', ARRAY['health'], 'Paid', 'None', NULL, false),

-- Rent
(user1_id, 'Monthly rent', 1850.00, CURRENT_DATE - INTERVAL '3 days', 'Rent', 'Bank Transfer', 'Property Manager', NULL, 'USD', ARRAY['housing'], 'Paid', 'Monthly', NULL, false),

-- Education
(user1_id, 'Online course', 49.99, CURRENT_DATE - INTERVAL '11 days', 'Education', 'Credit Card', 'Udemy', NULL, 'USD', ARRAY['learning', 'tech'], 'Paid', 'None', NULL, false),

-- Travel
(user1_id, 'Flight to NYC', 385.00, CURRENT_DATE - INTERVAL '25 days', 'Travel', 'Credit Card', 'Delta Airlines', NULL, 'USD', ARRAY['vacation', 'flight'], 'Paid', 'None', NULL, false),
(user1_id, 'Hotel booking', 450.00, CURRENT_DATE - INTERVAL '24 days', 'Travel', 'Credit Card', 'Marriott', NULL, 'USD', ARRAY['vacation', 'accommodation'], 'Paid', 'None', NULL, false);

-- =====================================================
-- EXPENSES (User 2 - Alex Johnson)
-- =====================================================
INSERT INTO public.expenses (user_id, title, amount, date, category, payment_method, merchant, location, currency, tags, status, recurrence, receipt, deleted) VALUES
(user2_id, 'Weekly groceries', 95.30, CURRENT_DATE - INTERVAL '2 days', 'Food', 'Debit Card', 'Tesco', NULL, 'EUR', ARRAY['groceries'], 'Paid', 'Weekly', NULL, false),
(user2_id, 'Coffee shop', 4.50, CURRENT_DATE - INTERVAL '1 day', 'Food', 'Cash', 'Costa Coffee', NULL, 'EUR', ARRAY['coffee'], 'Paid', 'Daily', NULL, false),
(user2_id, 'Restaurant dinner', 67.80, CURRENT_DATE - INTERVAL '4 days', 'Food', 'Debit Card', 'The Italian Place', NULL, 'EUR', ARRAY['dining'], 'Paid', 'None', NULL, false),
(user2_id, 'Petrol', 72.00, CURRENT_DATE - INTERVAL '3 days', 'Fuel', 'Debit Card', 'BP', NULL, 'EUR', ARRAY['car'], 'Paid', 'Weekly', NULL, false),
(user2_id, 'New headphones', 129.99, CURRENT_DATE - INTERVAL '5 days', 'Shopping', 'Debit Card', 'Apple Store', NULL, 'EUR', ARRAY['electronics'], 'Paid', 'None', NULL, false),
(user2_id, 'Electricity', 89.50, CURRENT_DATE - INTERVAL '10 days', 'Bills', 'Bank Transfer', 'British Gas', NULL, 'EUR', ARRAY['utilities'], 'Paid', 'Monthly', NULL, false),
(user2_id, 'Gym membership', 35.00, CURRENT_DATE - INTERVAL '2 days', 'Healthcare', 'Debit Card', 'PureGym', NULL, 'EUR', ARRAY['fitness'], 'Paid', 'Monthly', NULL, false),
(user2_id, 'Train tickets', 45.60, CURRENT_DATE - INTERVAL '6 days', 'Fuel', 'Apple Pay', 'National Rail', NULL, 'EUR', ARRAY['transportation'], 'Paid', 'None', NULL, false);

-- =====================================================
-- INCOME (User 1 - Demo User)
-- =====================================================
INSERT INTO public.income (user_id, source, amount, date, category, currency, notes) VALUES
(user1_id, 'Monthly salary', 4500.00, CURRENT_DATE - INTERVAL '5 days', 'Salary', 'USD', 'Tech Company Inc.'),
(user1_id, 'Freelance project', 850.00, CURRENT_DATE - INTERVAL '12 days', 'Freelance', 'USD', 'Website redesign for local business'),
(user1_id, 'Stock dividends', 125.50, CURRENT_DATE - INTERVAL '20 days', 'Investment', 'USD', 'Quarterly dividends'),
(user1_id, 'Side hustle', 320.00, CURRENT_DATE - INTERVAL '8 days', 'Freelance', 'USD', 'Consulting work'),
(user1_id, 'Tax refund', 560.00, CURRENT_DATE - INTERVAL '30 days', 'Refund', 'USD', 'Federal tax refund'),
(user1_id, 'Bonus', 1000.00, CURRENT_DATE - INTERVAL '45 days', 'Bonus', 'USD', 'Q1 performance bonus');

-- =====================================================
-- INCOME (User 2 - Alex Johnson)
-- =====================================================
INSERT INTO public.income (user_id, source, amount, date, category, currency, notes) VALUES
(user2_id, 'Monthly salary', 3200.00, CURRENT_DATE - INTERVAL '3 days', 'Salary', 'EUR', 'Marketing Agency Ltd'),
(user2_id, 'Freelance writing', 450.00, CURRENT_DATE - INTERVAL '15 days', 'Freelance', 'EUR', 'Blog articles'),
(user2_id, 'Rental income', 800.00, CURRENT_DATE - INTERVAL '7 days', 'Investment', 'EUR', 'Property rental'),
(user2_id, 'Gift', 100.00, CURRENT_DATE - INTERVAL '25 days', 'Refund', 'EUR', 'Birthday gift');

-- =====================================================
-- BUDGETS (User 1 - Demo User)
-- =====================================================
INSERT INTO public.budgets (user_id, category, limit_amount) VALUES
(user1_id, 'Food', 600.00),
(user1_id, 'Fuel', 250.00),
(user1_id, 'Entertainment', 200.00),
(user1_id, 'Shopping', 400.00),
(user1_id, 'Bills', 400.00),
(user1_id, 'Healthcare', 150.00),
(user1_id, 'Rent', 1850.00),
(user1_id, 'Travel', 500.00)
ON CONFLICT (user_id, category) DO NOTHING;

-- =====================================================
-- BUDGETS (User 2 - Alex Johnson)
-- =====================================================
INSERT INTO public.budgets (user_id, category, limit_amount) VALUES
(user2_id, 'Food', 450.00),
(user2_id, 'Fuel', 200.00),
(user2_id, 'Shopping', 300.00),
(user2_id, 'Bills', 350.00),
(user2_id, 'Healthcare', 100.00)
ON CONFLICT (user_id, category) DO NOTHING;

-- =====================================================
-- NOTIFICATIONS (User 1 - Demo User)
-- =====================================================
INSERT INTO public.notifications (user_id, type, title, message, read) VALUES
(user1_id, 'budget', 'Budget Warning', 'You have used 92% of your Food budget this month.', false),
(user1_id, 'recurring', 'Recurring Payment', 'Netflix subscription of $15.99 has been charged.', true),
(user1_id, 'bill', 'Upcoming Bill', 'Your phone bill of $55.00 is due in 3 days.', false),
(user1_id, 'summary', 'Weekly Summary', 'You spent $456.23 this week across 15 transactions.', true),
(user1_id, 'budget', 'Budget Alert', 'You are close to exceeding your Entertainment budget.', false),
(user1_id, 'income', 'Income Received', 'Freelance payment of $850.00 has been credited.', true);

-- =====================================================
-- NOTIFICATIONS (User 2 - Alex Johnson)
-- =====================================================
INSERT INTO public.notifications (user_id, type, title, message, read) VALUES
(user2_id, 'budget', 'Budget Update', 'You have used 67% of your Food budget.', false),
(user2_id, 'summary', 'Monthly Summary', 'Your total expenses for the month: €1,234.50', true),
(user2_id, 'bill', 'Bill Paid', 'Your electricity bill has been successfully paid.', true);

END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the data was inserted correctly:

-- Count expenses per user
-- SELECT user_id, COUNT(*) as expense_count FROM public.expenses GROUP BY user_id;

-- Count income per user
-- SELECT user_id, COUNT(*) as income_count FROM public.income GROUP BY user_id;

-- Count budgets per user
-- SELECT user_id, COUNT(*) as budget_count FROM public.budgets GROUP BY user_id;

-- View all notifications
-- SELECT user_id, type, title, read FROM public.notifications;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Replace the UUIDs at the top with your actual user IDs
-- 2. You must create the users in Supabase Auth first
-- 3. This creates realistic dummy data for testing
-- 4. Data includes various categories, amounts, and dates
-- 5. Both users have different spending patterns and currencies
-- =====================================================
