# 🚨 QUICK FIX - Stripe Not Redirecting

## Problem
Clicking "Upgrade to Premium" doesn't redirect to Stripe - it just applies premium directly.

## Solution (2 Minutes)

### 1️⃣ Go to Supabase Dashboard
https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/settings/functions

### 2️⃣ Click "Edge Function Secrets" or "Secrets"

### 3️⃣ Add These 3 Secrets

**Secret 1:**
```
Name: STRIPE_SECRET_KEY
Value: sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
```

**Secret 2:**
```
Name: SUPABASE_URL
Value: https://fgsrxibdmkssywrpbxzv.supabase.co
```

**Secret 3:**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDYyMDMsImV4cCI6MjA5OTA4MjIwM30.ftgC9E_MxKvDI3h8AuPsh8zxoEBk61Yz-mvloY-zMzI
```

### 4️⃣ Click "Save" for each

### 5️⃣ Test

1. Open app with browser console (F12)
2. Go to `/premium`
3. Click "Upgrade to Premium"
4. Should redirect to `https://checkout.stripe.com/...`

## ✅ Success Indicators

Console should show:
```
[Stripe] ✅ Valid price ID found
[Stripe] ✅ Auth session found
[Stripe] 📡 Invoking create-checkout edge function...
[Stripe] ✅ Checkout URL received
[Stripe] 🔄 Redirecting to Stripe Checkout...
```

Then browser redirects to Stripe!

## ❌ Still Not Working?

Check console for:
- `[Stripe] ❌ Edge function returned error:` - Secrets not saved correctly
- `[Stripe] ⚠️ DEMO MODE` - Price ID issue or edge function failed
- `Missing Authorization header` - Not logged in

**Need details?** See `STRIPE_ISSUE_SUMMARY.md`

## Why This Fix Works

Your `.env` has `VITE_STRIPE_SECRET_KEY` but Edge Functions need `STRIPE_SECRET_KEY` configured in Supabase Dashboard, not in `.env`.

Edge Functions run on Supabase servers and can't read your local `.env` file!

---

**That's it!** 2 minutes to fix. 🎉
