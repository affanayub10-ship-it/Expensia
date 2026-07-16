-- PostgreSQL Indexes for Performance Optimization
-- Run these SQL commands in your Supabase SQL Editor to improve query performance

-- ============================================================
-- EXPENSES TABLE INDEXES
-- ============================================================

-- Primary index for user_id filtering (most common query)
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);

-- Composite index for user_id + date ordering (dashboard recent transactions)
CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date ON expenses(user_id, date DESC);

-- Composite index for user_id + category (budget calculations)
CREATE INDEX IF NOT EXISTS idx_expenses_user_id_category ON expenses(user_id, category);

-- Index for deleted status filtering (active expenses)
CREATE INDEX IF NOT EXISTS idx_expenses_deleted ON expenses(deleted) WHERE deleted = false;

-- Composite index for user_id + deleted + date (common dashboard query)
CREATE INDEX IF NOT EXISTS idx_expenses_user_id_deleted_date ON expenses(user_id, deleted, date DESC);

-- ============================================================
-- INCOME TABLE INDEXES
-- ============================================================

-- Primary index for user_id filtering
CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);

-- Composite index for user_id + date ordering
CREATE INDEX IF NOT EXISTS idx_income_user_id_date ON income(user_id, date DESC);

-- Composite index for user_id + category
CREATE INDEX IF NOT EXISTS idx_income_user_id_category ON income(user_id, category);

-- Index for recurrence filtering (recurring income processing)
CREATE INDEX IF NOT EXISTS idx_income_recurrence ON income(recurrence);

-- Composite index for user_id + recurrence + next_date (due income processing)
CREATE INDEX IF NOT EXISTS idx_income_user_id_recurrence_next_date ON income(user_id, recurrence, next_date);

-- ============================================================
-- BUDGETS TABLE INDEXES
-- ============================================================

-- Primary index for user_id filtering
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);

-- Unique composite index for user_id + category (enforce one budget per category per user)
CREATE UNIQUE INDEX IF NOT EXISTS idx_budgets_user_id_category ON budgets(user_id, category);

-- ============================================================
-- NOTIFICATIONS TABLE INDEXES
-- ============================================================

-- Primary index for user_id filtering
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Composite index for user_id + read status (unread notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON notifications(user_id, read);

-- Composite index for user_id + created_at (recent notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON notifications(user_id, created_at DESC);

-- ============================================================
-- SETTINGS TABLE INDEXES
-- ============================================================

-- Primary index for user_id (should already exist, but ensuring it)
CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);

-- ============================================================
-- PROFILES TABLE INDEXES
-- ============================================================

-- Primary index for id (should already exist)
-- Email index for potential future authentication features
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ============================================================
-- PERFORMANCE ANALYSIS QUERIES
-- ============================================================

-- Check index usage after running queries
-- Run this after using the app to see which indexes are being used
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================
-- MAINTENANCE COMMANDS
-- ============================================================

-- Analyze tables to update statistics (run periodically)
ANALYZE expenses;
ANALYZE income;
ANALYZE budgets;
ANALYZE notifications;
ANALYZE settings;
ANALYZE profiles;

-- Vacuum to reclaim space (run during low traffic periods)
VACUUM ANALYZE expenses;
VACUUM ANALYZE income;
VACUUM ANALYZE budgets;
VACUUM ANALYZE notifications;
VACUUM ANALYZE settings;
VACUUM ANALYZE profiles;
