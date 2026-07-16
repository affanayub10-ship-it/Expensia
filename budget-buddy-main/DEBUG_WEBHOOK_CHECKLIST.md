# 🔍 Debug Webhook - Why Data Isn't Coming from Stripe

## The Problem
- ❌ Supabase not receiving data from Stripe
- ❌ `payment_history` table not updating
- ❌ Subscriptions not auto-updating after payment

**This means the webhook is broken.** Let's find out why.

---

## ✅ Step-by-Step Checklist

### Step 1: Check if Edge Function Exists

Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions

**Questions:**
- [ ] Do you see a function called `stripe-webhook`?
- [ ] What color is the status indicator? (Green = running, Red = error)
- [ ] When was it last deployed?

**Screenshot this page and tell me what you see!**

---

### Step 2: Check Edge Function Secrets

Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/settings/functions

Scroll down to "Secrets" section.

**Questions - Which secrets do you see listed?**
- [ ] STRIPE_SECRET_KEY
- [ ] STRIPE_WEBHOOK_SECRET
- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_ROLE_KEY

**If any are missing, the webhook CANNOT work!**

**Screenshot this and tell me which secrets are there!**

---

### Step 3: Check Webhook Logs

Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions/stripe-webhook/logs

**Questions:**
- [ ] Are there ANY logs at all?
- [ ] What is the most recent timestamp?
- [ ] Do you see any errors in red?
- [ ] Do you see messages like "[webhook] Request received"?

**Screenshot the logs and tell me what you see!**

---

### Step 4: Check Stripe Webhook Configuration

Go to: https://dashboard.stripe.com/test/webhooks

**Questions:**
- [ ] Do you see an endpoint configured?
- [ ] What URL is it pointing to?
- [ ] Is it enabled (not disabled)?

**Expected URL:** `https://fgsrxibdmkssywrpbxzv.supabase.co/functions/v1/stripe-webhook`

**Screenshot this page!**

---

### Step 5: Check Stripe Webhook Deliveries

On the same Stripe webhooks page:
1. Click on your webhook endpoint
2. Look for "Recent deliveries" or "Attempts" tab

**Questions:**
- [ ] Are there any delivery attempts?
- [ ] What status do they show? (Succeeded / Failed)
- [ ] If failed, what error message?

**Screenshot the delivery attempts!**

---

## 🎯 Common Issues & Fixes

### Issue 1: Edge Function Doesn't Exist
**Fix:** Deploy it!

1. Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions
2. Click "Create a new function"
3. Name: `stripe-webhook`
4. ❌ **UNCHECK "Verify JWT"** (critical!)
5. Copy the code from: `supabase/functions/stripe-webhook/index.ts`
6. Click "Deploy"

---

### Issue 2: Secrets Are Missing
**Fix:** Add all 4 secrets!

Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/settings/functions

Click "Add new secret" and add each:

```
Name: STRIPE_SECRET_KEY
Value: sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
```

```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_tlX56XMqSyVaSmOSMe0cKOxfPcUbWuLY
```

```
Name: SUPABASE_URL
Value: https://fgsrxibdmkssywrpbxzv.supabase.co
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4
```

**After adding secrets:** Go back to Functions and click "Restart" on stripe-webhook!

---

### Issue 3: Stripe Webhook Not Configured
**Fix:** Add the webhook endpoint!

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://fgsrxibdmkssywrpbxzv.supabase.co/functions/v1/stripe-webhook`
4. Description: "Premium Subscriptions"
5. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_failed`
6. Click "Add endpoint"

---

### Issue 4: Wrong Webhook Secret
**Fix:** Update the secret!

After creating the Stripe webhook endpoint:
1. You'll see a "Signing secret" (starts with `whsec_`)
2. Copy it
3. Go to Supabase: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/settings/functions
4. Find `STRIPE_WEBHOOK_SECRET` and update it with the new value
5. Restart the function

---

## 🧪 Test the Webhook

After fixing the issues above, test it:

### Test 1: Manual Webhook Test from Stripe

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select event: `checkout.session.completed`
5. Click "Send test webhook"

**Then check:**
- Supabase function logs: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions/stripe-webhook/logs
- Should see: "[webhook] Request received"

### Test 2: Real Payment Test

1. Go to your app: http://localhost:8080
2. Login with a test account
3. Subscribe to premium
4. Use test card: `4242 4242 4242 4242`
5. Complete payment

**Then check:**
1. Stripe webhook deliveries (should show successful delivery)
2. Supabase function logs (should show webhook processing)
3. Database subscriptions table (should update to "active")
4. Database payment_history table (should have new record)

---

## 📊 Quick Diagnostic SQL

Run this to see if webhook has EVER worked:

```sql
-- Check if payment_history table exists and has data
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_history')
    THEN 'Table exists ✅'
    ELSE 'Table missing ❌'
  END as table_status,
  (SELECT COUNT(*) FROM payment_history) as payment_count,
  (SELECT MAX(created_at) FROM payment_history) as last_payment;

-- Check subscription updates
SELECT 
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.stripe_subscription_id,
  s.updated_at,
  CASE 
    WHEN s.stripe_subscription_id IS NOT NULL 
    THEN 'Has Stripe data ✅'
    ELSE 'No Stripe data ❌'
  END as stripe_connection
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_plan = 'premium'
ORDER BY s.updated_at DESC;
```

---

## 🎯 Most Likely Issues (In Order)

### 1. Edge Function Not Deployed (90% chance)
**Symptom:** Function doesn't appear in Supabase dashboard  
**Fix:** Deploy it using instructions in Issue 1 above

### 2. Secrets Not Configured (80% chance)
**Symptom:** Function exists but logs show "Missing environment variables"  
**Fix:** Add all 4 secrets using instructions in Issue 2 above

### 3. Stripe Webhook Not Connected (70% chance)
**Symptom:** No delivery attempts in Stripe dashboard  
**Fix:** Add webhook endpoint using instructions in Issue 3 above

### 4. Wrong Webhook Secret (50% chance)
**Symptom:** Stripe shows failed deliveries with "Invalid signature"  
**Fix:** Update webhook secret using instructions in Issue 4 above

---

## 📸 What I Need From You

Please send me screenshots or tell me:

1. **Supabase Functions page** - Does stripe-webhook exist?
2. **Supabase Secrets page** - Which of the 4 secrets are configured?
3. **Supabase Logs page** - Any logs? Any errors?
4. **Stripe Webhooks page** - Is endpoint configured?
5. **Stripe Deliveries** - Any delivery attempts? Status?

With this info, I can tell you EXACTLY what to fix!

---

## ⚡ Emergency Bypass

While debugging webhook automation, you can manually update after each payment:

```sql
-- After a user pays, run this manually:
UPDATE subscriptions
SET 
  subscription_status = 'active',
  subscription_plan = 'premium',
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'USER_EMAIL_HERE');

-- Record payment manually:
INSERT INTO payment_history (
  user_id,
  amount,
  currency,
  payment_status,
  subscription_plan,
  billing_cycle,
  payment_date,
  succeeded_at
)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'USER_EMAIL_HERE'),
  9.99,
  'usd',
  'succeeded',
  'premium',
  'monthly',
  NOW(),
  NOW()
);
```

This bypasses the webhook and grants premium manually.

But we NEED to fix the webhook for automation! 🎯
