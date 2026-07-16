# 🔍 Debug Premium Issue - Let's Find What's Wrong

## Step 1: Check Current Database State

### Run this SQL in Supabase SQL Editor:
```sql
-- Check current subscriptions
SELECT 
  s.user_id,
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.billing_cycle,
  s.current_period_end,
  s.cancel_at_period_end,
  s.updated_at
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com')
ORDER BY s.updated_at DESC;
```

**Tell me what you see:**
- What is `subscription_plan`? (should be "premium")
- What is `subscription_status`? (should be "active")
- Is there a `stripe_subscription_id`?

---

## Step 2: Check if Payment History Table Exists

```sql
-- Check if payment_history table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'payment_history'
) as table_exists;

-- If it exists, check for payments
SELECT 
  ph.user_id,
  u.email,
  ph.amount,
  ph.payment_status,
  ph.subscription_plan,
  ph.payment_date,
  ph.created_at
FROM payment_history ph
JOIN auth.users u ON ph.user_id = u.id
ORDER BY ph.created_at DESC
LIMIT 5;
```

**Tell me:**
- Does the table exist? (true/false)
- Are there any payment records?

---

## Step 3: Check Edge Function Status

### Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions

**Tell me:**
- Do you see `stripe-webhook` function listed?
- What is its status? (Active/Paused/Error)
- When was it last deployed?

---

## Step 4: Check Edge Function Secrets

### Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/settings/functions

**Tell me which secrets are listed:**
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_ROLE_KEY

---

## Step 5: Check Webhook Logs

### Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions/stripe-webhook/logs

**Tell me:**
- Are there ANY logs at all?
- What is the most recent log message?
- Do you see any errors?

---

## Step 6: Check Stripe Webhook Endpoint

### Go to: https://dashboard.stripe.com/test/webhooks

**Tell me:**
- Is there a webhook endpoint configured?
- What URL is it pointing to?
- Click on the endpoint → "Recent deliveries" → What do you see?
- Any failed deliveries? What error message?

---

## Step 7: Test Frontend Premium Check

### Open browser console (F12) on your app and run:
```javascript
// In browser console
const { data: user } = await window.supabase.auth.getUser();
console.log('User ID:', user?.user?.id);

const { data: sub } = await window.supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', user?.user?.id)
  .single();
console.log('Subscription:', sub);

// Check what isPremium would be
const isPremium = sub?.subscription_plan === 'premium' && 
  (sub?.subscription_status === 'active' || sub?.subscription_status === 'trialing');
console.log('Is Premium:', isPremium);
```

**Tell me the output of each console.log**

---

## 🎯 Quick Fixes Based on Common Issues

### Issue 1: Subscription Status is Wrong
**If `subscription_status` is NOT 'active':**

Run this SQL immediately:
```sql
UPDATE subscriptions
SET 
  subscription_status = 'active',
  cancel_at_period_end = false,
  updated_at = NOW()
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com')
)
AND subscription_plan = 'premium';

-- Verify
SELECT u.email, s.subscription_status 
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com');
```

### Issue 2: Edge Function Not Deployed
**If stripe-webhook function doesn't exist:**

1. Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions
2. Click "Create a new function"
3. Name: `stripe-webhook`
4. ❌ UNCHECK "Verify JWT"
5. Copy code from `supabase/functions/stripe-webhook/index.ts`
6. Click "Deploy"

### Issue 3: Secrets Not Set
**If secrets are missing:**

1. Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/settings/functions
2. Add these secrets:

```
STRIPE_SECRET_KEY = sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj

STRIPE_WEBHOOK_SECRET = whsec_tlX56XMqSyVaSmOSMe0cKOxfPcUbWuLY

SUPABASE_URL = https://fgsrxibdmkssywrpbxzv.supabase.co

SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4
```

3. After adding secrets, RESTART the function

### Issue 4: Stripe Webhook Not Connected
**If Stripe isn't sending events:**

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://fgsrxibdmkssywrpbxzv.supabase.co/functions/v1/stripe-webhook`
4. Events: Select `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
5. Click "Add endpoint"

---

## 🔧 Nuclear Option: Complete Reset

If nothing above works, run this complete reset:

```sql
-- 1. Fix all premium users
UPDATE subscriptions
SET 
  subscription_status = 'active',
  cancel_at_period_end = false,
  updated_at = NOW()
WHERE subscription_plan = 'premium';

-- 2. Verify all premium users
SELECT 
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.stripe_customer_id
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_plan = 'premium';
```

Then:
1. Redeploy the edge function
2. Verify all 4 secrets are set
3. Restart the edge function
4. Test with a new payment

---

## 📊 Tell Me Your Results

Please run Steps 1-7 above and tell me:

1. **Database State** (Step 1): What's the current subscription_status?
2. **Payment Table** (Step 2): Does it exist? Any records?
3. **Edge Function** (Step 3): Is it deployed?
4. **Secrets** (Step 4): Which ones are configured?
5. **Logs** (Step 5): Any errors or messages?
6. **Stripe** (Step 6): Is webhook connected? Any failed deliveries?
7. **Frontend** (Step 7): What does the console show?

Once you tell me this, I can pinpoint the exact issue and give you the precise fix!
