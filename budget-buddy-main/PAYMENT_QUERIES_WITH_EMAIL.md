# 📊 Payment History Queries with Email

After running `add-email-to-payment-views.sql`, you can use these queries to see who subscribed.

---

## 🚀 Quick Setup

### Step 1: Run the SQL File
1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/sql/new
2. Copy and paste the entire content of `add-email-to-payment-views.sql`
3. Click "Run"
4. ✅ You should see: "Views and functions created successfully!"

---

## 📋 Most Useful Queries

### 1️⃣ See All Payments with Email Addresses
```sql
SELECT 
  email,
  amount,
  currency,
  payment_status,
  subscription_plan,
  billing_cycle,
  payment_date,
  stripe_subscription_id
FROM payment_history_with_email
ORDER BY payment_date DESC
LIMIT 50;
```

**Shows:** All payments with user emails (most recent first)

---

### 2️⃣ See Active Premium Subscribers
```sql
SELECT 
  email,
  subscription_status,
  billing_cycle,
  current_period_end,
  total_payments,
  lifetime_value,
  stripe_customer_id
FROM active_premium_subscribers
ORDER BY lifetime_value DESC NULLS LAST;
```

**Shows:** All active premium users with their total spending

---

### 3️⃣ See Payment Stats Per User
```sql
SELECT 
  email,
  total_payments,
  successful_payments,
  failed_payments,
  total_revenue,
  monthly_subscriptions,
  yearly_subscriptions,
  last_successful_payment
FROM payment_stats
ORDER BY total_revenue DESC NULLS LAST;
```

**Shows:** Summary statistics for each user who has made payments

---

### 4️⃣ See Overall Revenue Statistics
```sql
SELECT * FROM subscription_revenue_stats;
```

**Shows:** 
- Total subscribers
- Total revenue
- Monthly vs yearly revenue
- Success rate
- Average transaction value

---

### 5️⃣ Get All Premium Subscribers with Details
```sql
SELECT * FROM get_all_premium_subscribers();
```

**Shows:** Complete list of premium subscribers with payment history

---

### 6️⃣ Find Specific User's Payments
```sql
SELECT 
  email,
  amount,
  payment_status,
  payment_date,
  subscription_plan,
  billing_cycle,
  receipt_url
FROM payment_history_with_email
WHERE email = 'affanayub5@gmail.com'
ORDER BY payment_date DESC;
```

**Replace email with any user's email**

---

### 7️⃣ See Who Paid Today
```sql
SELECT 
  email,
  amount,
  currency,
  payment_status,
  subscription_plan,
  payment_date
FROM payment_history_with_email
WHERE DATE(payment_date) = CURRENT_DATE
ORDER BY payment_date DESC;
```

**Shows:** All payments made today

---

### 8️⃣ See Failed Payments
```sql
SELECT 
  email,
  amount,
  currency,
  failure_reason,
  attempted_at,
  stripe_payment_intent_id
FROM payment_history_with_email
WHERE payment_status = 'failed'
ORDER BY attempted_at DESC
LIMIT 20;
```

**Shows:** Failed payments with reasons

---

### 9️⃣ Monthly vs Yearly Revenue Breakdown
```sql
SELECT * FROM get_revenue_by_cycle();
```

**Shows:** Revenue comparison between monthly and yearly plans

---

### 🔟 See Recent Subscriptions (Last 7 Days)
```sql
SELECT 
  email,
  subscription_plan,
  subscription_status,
  billing_cycle,
  subscription_created,
  total_payments,
  lifetime_value
FROM active_premium_subscribers
WHERE subscription_created >= NOW() - INTERVAL '7 days'
ORDER BY subscription_created DESC;
```

**Shows:** New premium subscribers in the last week

---

## 📊 Dashboard-Style Query

### Complete Overview of Your Premium Business
```sql
-- Overall stats
SELECT 
  'Total Subscribers' as metric,
  total_subscribers::text as value
FROM subscription_revenue_stats
UNION ALL
SELECT 
  'Total Revenue',
  '$' || ROUND(total_revenue::numeric, 2)::text
FROM subscription_revenue_stats
UNION ALL
SELECT 
  'Monthly Plan Revenue',
  '$' || ROUND(monthly_plan_revenue::numeric, 2)::text
FROM subscription_revenue_stats
UNION ALL
SELECT 
  'Yearly Plan Revenue',
  '$' || ROUND(yearly_plan_revenue::numeric, 2)::text
FROM subscription_revenue_stats
UNION ALL
SELECT 
  'Success Rate',
  ROUND((successful_transactions::numeric / NULLIF(total_transactions, 0) * 100), 2)::text || '%'
FROM subscription_revenue_stats;
```

---

## 🔍 Advanced Queries

### Find Users Who Haven't Paid Yet
```sql
SELECT 
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.created_at
FROM subscriptions s
INNER JOIN auth.users u ON s.user_id = u.id
LEFT JOIN payment_history ph ON s.user_id = ph.user_id
WHERE s.subscription_plan = 'premium'
  AND ph.id IS NULL
ORDER BY s.created_at DESC;
```

### Top 10 Paying Customers
```sql
SELECT 
  email,
  total_revenue as total_spent,
  total_payments,
  successful_payments,
  first_payment_date,
  last_successful_payment
FROM payment_stats
WHERE total_revenue > 0
ORDER BY total_revenue DESC
LIMIT 10;
```

### Churn Risk (Premium but Canceled)
```sql
SELECT 
  email,
  subscription_status,
  current_period_end,
  cancel_at_period_end,
  lifetime_value
FROM active_premium_subscribers
WHERE cancel_at_period_end = true
ORDER BY current_period_end ASC;
```

### Monthly Recurring Revenue (MRR)
```sql
SELECT 
  COUNT(*) as active_monthly_subscribers,
  SUM(
    CASE 
      WHEN s.billing_cycle = 'monthly' THEN 9.99
      WHEN s.billing_cycle = 'yearly' THEN 99.99 / 12
      ELSE 0
    END
  ) as estimated_mrr
FROM subscriptions s
WHERE s.subscription_plan = 'premium'
  AND (s.subscription_status = 'active' OR s.subscription_status = 'trialing')
  AND s.cancel_at_period_end = false;
```

---

## 🎯 Quick Copy-Paste Queries

### "Show me everyone who subscribed"
```sql
SELECT email, subscription_status, billing_cycle, lifetime_value
FROM active_premium_subscribers
ORDER BY lifetime_value DESC NULLS LAST;
```

### "Show me all payments"
```sql
SELECT email, amount, payment_status, payment_date, subscription_plan
FROM payment_history_with_email
ORDER BY payment_date DESC
LIMIT 100;
```

### "Show me revenue stats"
```sql
SELECT * FROM subscription_revenue_stats;
```

### "Show me who paid this month"
```sql
SELECT email, amount, payment_date
FROM payment_history_with_email
WHERE payment_date >= DATE_TRUNC('month', CURRENT_DATE)
  AND payment_status = 'succeeded'
ORDER BY payment_date DESC;
```

---

## 💡 Tips

### Export to CSV
After running any query in Supabase:
1. Click the "Export" button
2. Choose CSV format
3. Open in Excel/Google Sheets

### Bookmark Useful Queries
Save queries you use often in the Supabase SQL Editor:
1. Run the query
2. Click "Save" in top right
3. Give it a name
4. Access from "Saved" sidebar

### Schedule Reports
Use these queries in your admin dashboard to show:
- Daily revenue
- New subscribers
- Failed payments to follow up
- Churn risk customers

---

## 🚀 Next Steps

1. ✅ Run `add-email-to-payment-views.sql` in Supabase
2. ✅ Try the "See All Payments with Email" query
3. ✅ Bookmark your favorite queries
4. ✅ Build an admin dashboard using these views

Now you can easily see which accounts have subscribed! 📊
