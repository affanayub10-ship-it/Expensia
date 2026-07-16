# Stripe Setup - Step by Step Guide

## 🚨 CRITICAL: Configure Supabase Edge Function Secrets

The app is falling back to "demo mode" because the Edge Functions don't have access to Stripe credentials.

### Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project: `fgsrxibdmkssywrpbxzv`
3. Navigate to: **Settings** → **Edge Functions** (in left sidebar)
4. Look for section called **"Secrets"** or **"Function Secrets"**

### Step 2: Add These 3 Secrets

Click **"Add Secret"** or **"New Secret"** and add each of these:

#### Secret 1: STRIPE_SECRET_KEY
```
Name: STRIPE_SECRET_KEY
Value: sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
```

#### Secret 2: SUPABASE_URL  
```
Name: SUPABASE_URL
Value: https://fgsrxibdmkssywrpbxzv.supabase.co
```

#### Secret 3: SUPABASE_ANON_KEY
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDYyMDMsImV4cCI6MjA5OTA4MjIwM30.ftgC9E_MxKvDI3h8AuPsh8zxoEBk61Yz-mvloY-zMzI
```

### Step 3: Save All Secrets

Click **"Save"** or **"Add"** for each secret.

### Step 4: Redeploy Edge Functions (If Needed)

If your edge functions are already deployed, they should automatically pick up the new secrets. 

If not working, redeploy them:

```bash
# If you have Supabase CLI installed
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
supabase functions deploy create-portal-session
supabase functions deploy cancel-subscription
```

**Don't have Supabase CLI?** You can also deploy via the Supabase Dashboard:
1. Go to **Edge Functions** tab
2. Click on each function
3. Click **"Redeploy"** button

### Step 5: Test the Checkout Flow

1. Open your app in browser
2. Open browser console (F12)
3. Navigate to `/premium` page
4. Click "Upgrade to Premium"
5. Check console logs:

**✅ Success logs you should see:**
```
[Stripe] ✅ Valid price ID found, creating Stripe checkout session...
[Stripe] ✅ Auth session found
[Stripe] 📡 Invoking create-checkout edge function...
[Stripe] 📥 Edge function response: {data: {url: "https://checkout.stripe.com/..."}}
[Stripe] ✅ Checkout URL received: https://checkout.stripe.com/c/pay/...
[Stripe] 🔄 Redirecting to Stripe Checkout...
```

**❌ Error logs (if secrets not configured):**
```
[Stripe] ❌ Edge function returned error: {message: "STRIPE_SECRET_KEY is not set"}
```

### Step 6: Complete Test Payment

1. Browser should redirect to `https://checkout.stripe.com/...`
2. Use test card: `4242 4242 4242 4242`
3. Use any future expiry date
4. Use any CVC
5. Complete checkout
6. You'll be redirected back to `/premium?success=true`
7. Premium should be activated! 🎉

## Troubleshooting

### Issue: Still seeing demo mode activation
**Solution:** 
1. Double-check secrets are saved in Supabase Dashboard
2. Secret names must be EXACT (case-sensitive)
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for error details

### Issue: "Missing Authorization header"
**Solution:** User is not logged in. Log in first, then try upgrade.

### Issue: CORS errors in console
**Solution:** Edge functions already have CORS configured. If you still see this:
1. Check edge function is deployed
2. Verify function URL matches your project
3. Check Supabase project status (should be active)

### Issue: "No checkout URL returned"
**Solution:**
1. Check Supabase Edge Function logs in Dashboard
2. Look for errors in the `create-checkout` function
3. Most common: Stripe price ID is invalid

## Verify Secrets Are Set

You can check if secrets are configured:

1. Go to Supabase Dashboard → Edge Functions
2. Click on `create-checkout` function
3. Look for "Secrets" section
4. You should see 3 secrets listed:
   - `STRIPE_SECRET_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## Database Schema

Your database schema is already correct! No changes needed to tables.

The `subscriptions` table has all necessary columns:
- ✅ `stripe_customer_id` 
- ✅ `stripe_subscription_id`
- ✅ `subscription_plan`
- ✅ `subscription_status`
- ✅ `current_period_start`
- ✅ `current_period_end`
- ✅ `cancel_at_period_end`

## Next Steps After Setup

1. ✅ Configure secrets (above)
2. ✅ Test with browser console open
3. ✅ Verify redirect to Stripe
4. ✅ Complete test payment
5. ✅ Verify premium activation

---

**Need help?** Check the detailed fix guide: `STRIPE_CHECKOUT_FIX.md`
