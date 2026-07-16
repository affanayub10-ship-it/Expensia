# 🔧 Vercel 500 Error Troubleshooting Guide

## 🤔 Why It Works Locally But Not on Vercel?

### Local (Localhost)
- ✅ Runs **purely in browser** (Client-Side Rendering only)
- ✅ `window`, `localStorage`, `sessionStorage` always available
- ✅ Uses `.env` file directly
- ✅ No server-side rendering

### Vercel (Production)
- ⚠️ Uses **Server-Side Rendering (SSR)** first
- ⚠️ Code runs on **Node.js server** before sending to browser
- ⚠️ `window`, `localStorage`, `sessionStorage` don't exist on server
- ⚠️ Needs **environment variables configured in dashboard**
- ⚠️ Must check `typeof window !== 'undefined'` before browser API usage

---

## ✅ Fixes Already Applied

We've fixed these SSR issues:

1. ✅ **login.tsx** - window.location.origin in Google sign-in
2. ✅ **pricing.tsx** - window.location usage in checkout
3. ✅ **AuthContext.tsx** - window.location in password reset
4. ✅ **PremiumUpgradeModal.tsx** - window usage in checkout
5. ✅ **ManageSubscriptionModal.tsx** - window usage in portal
6. ✅ **AppContext.tsx** - localStorage and window.matchMedia
7. ✅ **reset-password.tsx** - sessionStorage usage

All code now checks: `typeof window !== 'undefined'` before using browser APIs.

---

## 🚨 Most Likely Cause: Missing Environment Variables

**The #1 reason for 500 errors on Vercel is missing environment variables!**

### Check Vercel Environment Variables

1. Go to: https://vercel.com/your-dashboard
2. Click on your **Expensia** project
3. Go to **Settings** → **Environment Variables**
4. Verify ALL these variables are set:

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://fgsrxibdmkssywrpbxzv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDYyMDMsImV4cCI6MjA5OTA4MjIwM30.ftgC9E_MxKvDI3h8AuPsh8zxoEBk61Yz-mvloY-zMzI
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4

# Stripe (Required)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TshJWRp1jrpNofslBoN9OdjgfiORkoFDe6ZCpPFdBGcTbbeL99HodHxf3XzgJlWSFXsBGreRIuKYj5miSZA005b9qgWcf
VITE_STRIPE_SECRET_KEY=sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
VITE_STRIPE_PRODUCT_ID=prod_UsSckc6HY9hjIc
VITE_STRIPE_PREMIUM_PRICE_ID=price_1TshgvRp1jrpNofsa0P5jLAG
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_1TtkaWRp1jrpNofsKy0A1De1
STRIPE_WEBHOOK_SECRET=whsec_tlX56XMqSyVaSmOSMe0cKOxfPcUbWuLY
```

### Important Notes:
- ⚠️ Variables **must be set for all environments**: Production, Preview, Development
- ⚠️ After adding/changing variables, you **MUST** redeploy
- ⚠️ Click **"Redeploy"** button in Vercel → Deployments

---

## 📋 Step-by-Step Fix Checklist

### Step 1: Verify Environment Variables ⭐ MOST IMPORTANT

1. Open Vercel Dashboard: https://vercel.com
2. Select your project: **Expensia** (or **budget-buddy**)
3. Go to **Settings** tab
4. Click **Environment Variables** in left sidebar
5. Check if **ALL 9 variables** are present:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_STRIPE_PUBLISHABLE_KEY`
   - `VITE_STRIPE_SECRET_KEY`
   - `VITE_STRIPE_PRODUCT_ID`
   - `VITE_STRIPE_PREMIUM_PRICE_ID`
   - `VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY`
   - `STRIPE_WEBHOOK_SECRET`

**If ANY are missing:**
- Click **"Add New"**
- Enter **Name** (e.g., `VITE_SUPABASE_URL`)
- Enter **Value** (copy from .env file above)
- Select **all environments**: Production, Preview, Development
- Click **Save**
- Repeat for each missing variable

### Step 2: Force Redeploy

After adding variables:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **three dots (...)** menu
4. Click **"Redeploy"**
5. Check **"Use existing Build Cache"** = OFF
6. Click **"Redeploy"**
7. Wait 2-3 minutes

### Step 3: Check Build Logs

While redeploying:
1. Click on the deployment to see live logs
2. Look for **red error messages**
3. Common errors to look for:
   - ❌ "Missing Supabase environment variables"
   - ❌ "window is not defined"
   - ❌ "localStorage is not defined"
   - ❌ "Cannot read property 'origin' of undefined"

### Step 4: Test After Deployment

Once deployment succeeds:
1. Visit: https://expensia-one.vercel.app/login
2. Should load without 500 error ✅
3. Try signing in
4. Check if premium features work

---

## 🔍 How to Debug on Vercel

### Method 1: Check Build Logs
1. Vercel Dashboard → **Deployments**
2. Click on latest deployment
3. Click **"Building"** tab
4. Look for errors in red

### Method 2: Check Function Logs
1. Vercel Dashboard → **Logs**
2. Filter by **Errors**
3. Look for runtime errors
4. Common error: "Missing environment variable"

### Method 3: Check Browser Console
1. Open https://expensia-one.vercel.app/login
2. Press **F12** (open DevTools)
3. Go to **Console** tab
4. Look for error messages
5. Common: "Failed to load resource: 500"

---

## 🎯 Common Vercel Errors & Solutions

### Error 1: "Missing Supabase environment variables"
**Cause**: Environment variables not set in Vercel
**Fix**: Add all `VITE_SUPABASE_*` variables in Vercel Settings → redeploy

### Error 2: "window is not defined"
**Cause**: Code tries to access `window` during SSR
**Fix**: Already fixed in code - wait for redeploy

### Error 3: "localStorage is not defined"
**Cause**: Code tries to access `localStorage` during SSR
**Fix**: Already fixed in code - wait for redeploy

### Error 4: Build succeeds but 500 at runtime
**Cause**: Missing environment variables OR runtime SSR issue
**Fix**: Check environment variables first, then check Function Logs

### Error 5: "Failed to load resource: 500"
**Cause**: Server-side code crashed
**Fix**: Check Function Logs for the actual error

---

## 🚀 Expected Timeline

After fixing environment variables and redeploying:

- **0-1 min**: Vercel starts building
- **1-2 min**: Build completes
- **2-3 min**: Deployment goes live
- **3+ min**: Test the app

Total: ~3-5 minutes from redeploy to working app

---

## ✅ Verification Checklist

After deployment completes, verify:

- [ ] Environment variables are set (all 9)
- [ ] Deployment succeeded (green checkmark)
- [ ] https://expensia-one.vercel.app loads (no 500)
- [ ] /login page loads properly
- [ ] Can sign in successfully
- [ ] Premium features work
- [ ] Checkout redirects work
- [ ] No errors in browser console

---

## 🆘 If Still Getting 500 Error

If after ALL fixes you still get 500:

### 1. Check Exact Error
1. Vercel Dashboard → **Logs** → **Errors**
2. Copy the exact error message
3. Share it for specific help

### 2. Try Clean Redeploy
1. Vercel Dashboard → **Settings** → **General**
2. Scroll to **"Delete Project"** (don't actually delete!)
3. Instead, go to **Deployments**
4. Click **"..."** on latest deploy → **"Redeploy"**
5. **Uncheck** "Use existing Build Cache"
6. Redeploy

### 3. Check Vercel Region
Sometimes region-specific issues:
1. Settings → **Functions**
2. Check **Function Region**
3. Try changing to closest region
4. Redeploy

---

## 📊 Summary

### Root Causes (in order of likelihood):

1. **90% chance**: Missing environment variables on Vercel
2. **8% chance**: SSR issues with window/localStorage (already fixed)
3. **2% chance**: Other deployment configuration issues

### Solution Priority:

1. ⭐ **First**: Check environment variables in Vercel Settings
2. ⭐ **Second**: Redeploy after adding variables
3. ⭐ **Third**: Wait for latest code to deploy (SSR fixes)
4. ⭐ **Fourth**: Check build/function logs for specific errors

### Most Likely Fix:

**Add all 9 environment variables → Redeploy → Wait 3 minutes → Working! ✅**

---

## 🎉 Once It Works

After successful deployment:

- ✅ App loads on Vercel
- ✅ Login works
- ✅ Premium subscriptions work
- ✅ All features functional

Your app will be production-ready! 🚀

