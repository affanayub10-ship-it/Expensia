# Quick Start Checklist - Premium Access Fix

## ✅ Complete These Steps in Order

### 1️⃣ Fix Existing Users (2 minutes)
- [ ] Open Supabase SQL Editor: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/sql/new
- [ ] Copy and run this SQL:
```sql
UPDATE subscriptions
SET 
  subscription_status = 'active',
  cancel_at_period_end = false,
  updated_at = NOW()
WHERE subscription_plan = 'premium'
  AND subscription_status != 'active'
  AND subscription_status != 'canceled';

SELECT 
  s.user_id,
  u.email,
  s.subscription_plan,
  s.subscription_status
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_plan = 'premium';
```
- [ ] Verify: All premium users show `subscription_status = 'active'`

---

### 2️⃣ Create Payment History Table (2 minutes)
- [ ] Open Supabase SQL Editor
- [ ] Run the entire SQL from file: `supabase-payment-tracking-fresh.sql`
- [ ] Verify: See message "Payment history table created successfully!"

---

### 3️⃣ Install & Setup Supabase CLI (3 minutes)
- [ ] Run in terminal: `npm install -g supabase`
- [ ] Run: `npx supabase login` (opens browser)
- [ ] Run: `npx supabase link --project-ref fgsrxibdmkssywrpbxzv`
- [ ] Enter your database password when prompted

---

### 4️⃣ Deploy Webhook Function (1 minute)
- [ ] Run in terminal:
```bash
npx supabase functions deploy stripe-webhook --no-verify-jwt
```
- [ ] Verify: See "Deployed Function stripe-webhook"

---

### 5️⃣ Configure Secrets (2 minutes)
- [ ] Run these commands one by one:
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj

npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_tlX56XMqSyVaSmOSMe0cKOxfPcUbWuLY

npx supabase secrets set SUPABASE_URL=https://fgsrxibdmkssywrpbxzv.supabase.co

npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4
```
- [ ] Verify: Each command shows "Successfully set secret"

---

### 6️⃣ Connect Stripe Webhook (3 minutes)
- [ ] Go to: https://dashboard.stripe.com/test/webhooks
- [ ] Click "Add endpoint"
- [ ] Enter: `https://fgsrxibdmkssywrpbxzv.supabase.co/functions/v1/stripe-webhook`
- [ ] Select events:
  - ✅ `checkout.session.completed`
  - ✅ `customer.subscription.updated`
  - ✅ `customer.subscription.deleted`
  - ✅ `invoice.payment_failed`
- [ ] Click "Add endpoint"
- [ ] Copy the signing secret (starts with `whsec_`)
- [ ] Run: `npx supabase secrets set STRIPE_WEBHOOK_SECRET=<new_secret>`

---

### 7️⃣ Test Everything (5 minutes)
- [ ] Open your app at http://localhost:8080
- [ ] Login with test account
- [ ] Go to Premium/Pricing page
- [ ] Click "Subscribe to Premium"
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Wait for redirect (page should refresh)
- [ ] Try accessing premium features
- [ ] ✅ Should work!

---

### 8️⃣ Verify in Database (1 minute)
- [ ] Open Supabase SQL Editor
- [ ] Run:
```sql
-- Check subscriptions
SELECT 
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.billing_cycle
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_plan = 'premium';

-- Check payments
SELECT 
  u.email,
  ph.amount,
  ph.payment_status,
  ph.payment_date
FROM payment_history ph
JOIN auth.users u ON ph.user_id = u.id
ORDER BY ph.created_at DESC
LIMIT 5;
```
- [ ] Verify: See your test payment with status 'succeeded'

---

## 🎉 Done!

All future payments will automatically:
- ✅ Grant premium access
- ✅ Record payment history
- ✅ Update subscription status
- ✅ Track statistics

---

## 🚨 Troubleshooting

**If webhook fails:**
- Check logs: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions/stripe-webhook/logs

**If premium not granted:**
- Run Step 1 SQL again to manually fix
- Check subscription_status in database
- Refresh the page in your app

**If payment not recorded:**
- Check Stripe Dashboard → Webhooks → Recent deliveries
- Verify webhook URL is correct
- Check Edge Function logs

---

## 📋 Total Time: ~15-20 minutes

After this, everything works automatically forever! 🚀
