# Commands to Run - Copy & Paste Ready

## 📋 All Terminal Commands (Copy & Paste)

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
npx supabase login
```

### 3. Link Your Project
```bash
npx supabase link --project-ref fgsrxibdmkssywrpbxzv
```

### 4. Deploy Webhook Function
```bash
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

### 5. Set Stripe Secret Key
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
```

### 6. Set Webhook Secret
```bash
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_tlX56XMqSyVaSmOSMe0cKOxfPcUbWuLY
```

### 7. Set Supabase URL
```bash
npx supabase secrets set SUPABASE_URL=https://fgsrxibdmkssywrpbxzv.supabase.co
```

### 8. Set Service Role Key
```bash
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4
```

### 9. List Secrets (Verify)
```bash
npx supabase secrets list
```

---

## 🔗 Important URLs

### Supabase Dashboard
```
https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv
```

### SQL Editor
```
https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/sql/new
```

### Edge Functions
```
https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions
```

### Webhook Logs
```
https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions/stripe-webhook/logs
```

### Stripe Webhooks
```
https://dashboard.stripe.com/test/webhooks
```

### Your Webhook URL (for Stripe)
```
https://fgsrxibdmkssywrpbxzv.supabase.co/functions/v1/stripe-webhook
```

---

## 📝 SQL to Run in Supabase

### Fix Existing Premium Users
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
  u.email,
  s.subscription_plan,
  s.subscription_status
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_plan = 'premium';
```

### Create Payment History Table
(Run the entire `supabase-payment-tracking-fresh.sql` file)

### Verify Everything
```sql
-- Check subscriptions
SELECT 
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.billing_cycle,
  s.current_period_end
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_plan = 'premium';

-- Check payments
SELECT 
  u.email,
  ph.amount,
  ph.currency,
  ph.payment_status,
  ph.payment_date
FROM payment_history ph
JOIN auth.users u ON ph.user_id = u.id
ORDER BY ph.created_at DESC
LIMIT 10;

-- Check statistics
SELECT * FROM get_payment_statistics();
```

---

## 🧪 Stripe Test Card

### Successful Payment
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### Failed Payment (for testing)
```
Card Number: 4000 0000 0000 0002
```

---

## ✅ Verification Checklist

After running commands, verify:

```bash
# Check secrets are set
npx supabase secrets list
```

Should show:
- ✅ STRIPE_SECRET_KEY
- ✅ STRIPE_WEBHOOK_SECRET
- ✅ SUPABASE_URL
- ✅ SUPABASE_SERVICE_ROLE_KEY

```bash
# Check function is deployed
npx supabase functions list
```

Should show:
- ✅ stripe-webhook (deployed)

---

## 🔄 If You Need to Redeploy

### Redeploy Webhook
```bash
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

### Update a Secret
```bash
npx supabase secrets set SECRET_NAME=secret_value
```

### Delete a Secret
```bash
npx supabase secrets unset SECRET_NAME
```

---

## 📊 Monitoring Commands

### View Function Logs (Terminal)
```bash
npx supabase functions logs stripe-webhook
```

### Test Webhook Locally
```bash
npx supabase functions serve stripe-webhook
```

---

## 🚨 Emergency Commands

### If webhook is broken, redeploy:
```bash
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

### If secrets are wrong, reset all:
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_tlX56XMqSyVaSmOSMe0cKOxfPcUbWuLY
npx supabase secrets set SUPABASE_URL=https://fgsrxibdmkssywrpbxzv.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4
```

### Manually fix a user in SQL:
```sql
UPDATE subscriptions
SET 
  subscription_status = 'active',
  subscription_plan = 'premium',
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

---

## 💾 Save These Commands

Keep this file handy! You might need these commands later for:
- Updating webhook code
- Changing secrets
- Debugging issues
- Monitoring payments

---

## 🎯 Quick Test After Setup

1. Open app: `http://localhost:8080`
2. Login to test account
3. Go to Premium page
4. Subscribe with test card: `4242 4242 4242 4242`
5. Check webhook logs: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions/stripe-webhook/logs
6. Should see: ✅ "Event processed: checkout.session.completed"
7. Premium features should work!

---

Done! 🚀
