# Subscription Management - Enhanced View Setup

## Overview

This upgrade adds the ability to view user information (name and email) alongside subscription data. This is implemented using database views and functions for optimal performance.

## Features Added

✅ **Database View**: `subscriptions_with_users` - Joins subscriptions with user data  
✅ **Premium Subscribers Function**: Get only premium users  
✅ **Statistics Function**: Get subscription counts and metrics  
✅ **Admin Page**: Full subscription management interface  

## Database Architecture

### Why Use a VIEW Instead of Duplicating Data?

**Database normalization principles:**
- ✅ **Single Source of Truth**: User email is stored once in `auth.users`
- ✅ **No Data Redundancy**: Names stored once in `profiles`
- ✅ **Automatic Updates**: Changes to user email/name are reflected immediately
- ✅ **Data Integrity**: No risk of sync issues between tables

**How it works:**
```
subscriptions table ──┐
                      ├─→ VIEW (subscriptions_with_users)
auth.users table ─────┤         ↓
                      │    Admin sees combined data
profiles table ───────┘
```

## Setup Instructions

### Step 1: Run the SQL Migration

Run this in **Supabase SQL Editor**:

```sql
-- Copy and paste the entire contents of:
-- supabase-subscriptions-view.sql
```

Or run it from the file:
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Paste the contents of `supabase-subscriptions-view.sql`
4. Click "Run"

### Step 2: Verify the View is Created

Run this query to test:
```sql
SELECT * FROM subscriptions_with_users LIMIT 5;
```

You should see columns:
- `user_name` - from profiles table
- `user_email` - from auth.users table
- All subscription columns

### Step 3: Access the Admin Page

Navigate to: `/admin-subscriptions`

Example: http://localhost:8080/admin-subscriptions

## What's Included

### 1. Database View: `subscriptions_with_users`

This view combines data from:
- `subscriptions` - subscription details
- `auth.users` - user email, created_at, last_sign_in
- `profiles` - user name

**Columns available:**
```sql
- id, user_id, stripe_customer_id, stripe_subscription_id
- subscription_plan, subscription_status, billing_cycle
- current_period_start, current_period_end, cancel_at_period_end
- user_email, user_name
- user_created_at, user_last_sign_in_at
- is_active_premium (computed boolean)
```

### 2. Function: `get_premium_subscribers()`

Returns only premium subscribers with their details.

**Usage:**
```sql
SELECT * FROM get_premium_subscribers();
```

### 3. Function: `get_subscription_stats()`

Returns aggregate statistics:
- Total users
- Free vs premium counts
- Active vs canceled premium
- Monthly vs yearly subscribers

**Usage:**
```sql
SELECT * FROM get_subscription_stats();
```

### 4. Admin Page: `/admin-subscriptions`

**Features:**
- 📊 Statistics dashboard (4 metric cards)
- 🔍 Search by name or email
- 🎛️ Filter by plan (All/Free/Premium)
- 📋 Detailed table with all subscription info
- 🔄 Refresh button
- 👤 User info display
- 💳 Stripe customer ID
- ⚠️ Cancellation warnings

## Example Queries

### Query 1: All Premium Subscribers with Email
```sql
SELECT 
  user_name, 
  user_email, 
  billing_cycle,
  current_period_end,
  stripe_customer_id
FROM subscriptions_with_users
WHERE subscription_plan = 'premium'
ORDER BY created_at DESC;
```

### Query 2: Find User by Email
```sql
SELECT *
FROM subscriptions_with_users
WHERE user_email = 'user@example.com';
```

### Query 3: Premium Subscribers Expiring Soon
```sql
SELECT 
  user_name, 
  user_email, 
  current_period_end
FROM subscriptions_with_users
WHERE subscription_plan = 'premium' 
  AND subscription_status = 'active'
  AND current_period_end <= NOW() + INTERVAL '7 days'
ORDER BY current_period_end ASC;
```

### Query 4: Users with Canceled Subscriptions
```sql
SELECT 
  user_name,
  user_email,
  current_period_end
FROM subscriptions_with_users
WHERE cancel_at_period_end = true
ORDER BY current_period_end ASC;
```

### Query 5: Monthly vs Yearly Revenue Estimate
```sql
SELECT 
  billing_cycle,
  COUNT(*) as subscriber_count,
  CASE 
    WHEN billing_cycle = 'monthly' THEN COUNT(*) * 9
    WHEN billing_cycle = 'yearly' THEN COUNT(*) * 90
  END as estimated_monthly_revenue
FROM subscriptions_with_users
WHERE subscription_plan = 'premium'
  AND subscription_status = 'active'
GROUP BY billing_cycle;
```

## Admin Page Features

### Stats Cards
Shows real-time metrics:
- Total Users
- Active Premium Users (with canceling count)
- Monthly Subscribers
- Yearly Subscribers

### Search & Filter
- Search by name or email
- Filter by plan (All/Free/Premium)
- Real-time filtering

### Subscription Table
Displays:
- User name and icon
- Email address
- Plan badge (with crown for premium)
- Status badge
- Cancellation warning badge
- Billing cycle
- Period end date
- Stripe customer ID (truncated)

### Color Coding
- 🟢 Premium plans - Income color (green)
- 🟡 Canceling subscriptions - Amber warning
- ⚪ Free plans - Secondary badge

## Security

### Row Level Security (RLS)
The view respects existing RLS policies:
- Users can only see their own subscription via RLS
- Admin access requires proper authentication
- Service role can see all subscriptions

### Permissions
```sql
-- View is accessible by authenticated users
GRANT SELECT ON subscriptions_with_users TO authenticated;
GRANT SELECT ON subscriptions_with_users TO service_role;

-- Functions are also secured
GRANT EXECUTE ON FUNCTION get_premium_subscribers() TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscription_stats() TO authenticated;
```

## Performance Considerations

✅ **Indexed Columns**: `user_id` is already indexed  
✅ **No Data Duplication**: View doesn't store data, just queries it  
✅ **Fast Joins**: Uses indexed foreign keys  
✅ **Computed Fields**: `is_active_premium` calculated on-the-fly  

**Performance tips:**
- Views are performant for read operations
- Add indexes if querying by email frequently
- Use functions for complex aggregations

## Troubleshooting

### Issue: "relation subscriptions_with_users does not exist"
**Fix:** Run the SQL migration from `supabase-subscriptions-view.sql`

### Issue: "permission denied for view subscriptions_with_users"
**Fix:** The GRANT statements in the migration should fix this. Re-run the migration.

### Issue: Admin page shows no data
**Fix:** 
1. Check if view exists: `SELECT * FROM subscriptions_with_users LIMIT 1;`
2. Check browser console for errors
3. Verify user is authenticated

### Issue: User name shows "No name"
**Fix:** The `profiles` table might not have name data. Check:
```sql
SELECT id, name FROM profiles WHERE name IS NOT NULL;
```

## Future Enhancements

Potential additions:
- Export to CSV functionality
- Email notifications to expiring subscriptions
- Subscription history timeline
- Revenue analytics dashboard
- Bulk actions (cancel, upgrade, etc.)
- Webhook event log viewer

## Related Files

- `supabase-subscriptions-view.sql` - Database migration
- `src/routes/admin-subscriptions.tsx` - Admin page component
- `supabase-stripe-schema.sql` - Original subscription schema

---

**Status:** ✅ Ready to use! Run the SQL migration and access `/admin-subscriptions`
