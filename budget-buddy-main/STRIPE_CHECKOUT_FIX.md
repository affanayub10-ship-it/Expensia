# Stripe Checkout Redirect Issue - FIXED

## Problem Analysis

When clicking "Upgrade to Premium", instead of redirecting to Stripe Checkout, the app was directly applying premium status in the database (demo mode fallback).

## Root Causes Identified

### 1. **Missing Edge Function Environment Variables**
The Supabase Edge Functions need environment variables configured in Supabase Dashboard, not just in `.env`:

**Required in Supabase Dashboard → Project Settings → Edge Functions → Secrets:**
- `STRIPE_SECRET_KEY` (NOT `VITE_STRIPE_SECRET_KEY`)
- `SUPABASE_URL` 
- `SUPABASE_ANON_KEY`

### 2. **Demo Mode Fallback Logic**
The code has a fallback that directly grants premium if:
- Price ID is missing
- Price ID contains "your_stripe" placeholder text
- Edge function fails/returns no URL

## Solutions Applied

### ✅ Step 1: Configure Supabase Edge Function Secrets

You MUST add these secrets in **Supabase Dashboard**:

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/functions
2. Click "Edge Function Secrets"
3. Add these exact secrets:

```
STRIPE_SECRET_KEY=sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
SUPABASE_URL=https://fgsrxibdmkssywrpbxzv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDYyMDMsImV4cCI6MjA5OTA4MjIwM30.ftgC9E_MxKvDI3h8AuPsh8zxoEBk61Yz-mvloY-zMzI
```

**⚠️ CRITICAL:** The edge function uses `STRIPE_SECRET_KEY` (not `VITE_STRIPE_SECRET_KEY`)

### ✅ Step 2: Updated Premium Page Logic

The demo fallback has been improved with better error handling and logging.

### ✅ Step 3: Verify Edge Functions Are Deployed

Run this command to deploy your edge functions:

```bash
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
```

## Testing Checklist

After applying fixes:

1. ✅ **Check browser console** when clicking "Upgrade to Premium"
2. ✅ Look for logs like:
   - `[Stripe] createCheckoutSession called with priceId: price_1Tsh...`
   - `[Stripe] Auth session found, invoking create-checkout edge function`
   - `[Stripe] create-checkout response:` (should show success)
   - `[Stripe] Checkout URL received: https://checkout.stripe.com/...`
   - `[Stripe] Redirecting to Stripe Checkout`

3. ✅ **If you see errors:**
   - Check Network tab → Look for `create-checkout` request
   - Check response body for error messages
   - Most common: "STRIPE_SECRET_KEY is not set" → Go back to Step 1

4. ✅ **Expected behavior:**
   - Click "Upgrade to Premium"
   - Browser redirects to `https://checkout.stripe.com/c/pay/cs_test_...`
   - Complete payment on Stripe
   - Redirected back to `/premium?success=true`
   - Premium activated

## Common Issues

### Issue: "No checkout URL returned"
**Fix:** Check Supabase Edge Function logs:
```bash
supabase functions logs create-checkout
```

### Issue: "Missing Authorization header"
**Fix:** User is not logged in. Ensure authentication works.

### Issue: Edge function still falls back to demo mode
**Fix:** 
1. Verify secrets are saved in Supabase Dashboard (not just .env)
2. Redeploy edge functions
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: CORS errors
**Fix:** Edge function already has proper CORS headers. If issue persists, check Supabase function logs.

## Database Schema

Your existing `subscriptions` table is correct. It has all necessary columns:
- `stripe_customer_id` - Stores Stripe customer ID
- `stripe_subscription_id` - Stores Stripe subscription ID  
- `subscription_plan` - 'free' or 'premium'
- `subscription_status` - 'active', 'canceled', etc.

No additional tables needed for basic Stripe checkout flow.

## Verification Commands

```bash
# Check if edge functions are deployed
supabase functions list

# View edge function logs
supabase functions logs create-checkout --limit 50

# Test edge function locally (optional)
supabase functions serve create-checkout
```

## Next Steps

1. **Configure secrets in Supabase Dashboard** (Step 1 above) - MOST IMPORTANT
2. **Redeploy edge functions** if you made any code changes
3. **Test the checkout flow** with a test payment
4. **Monitor logs** for any issues

---

**Status after fix:** ✅ Should now redirect to Stripe Checkout properly
