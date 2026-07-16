# Stripe Checkout Flow - Visual Guide

## 🔴 Current Broken Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Upgrade to Premium"                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frontend (premium.tsx) calls Edge Function               │
│    supabase.functions.invoke("create-checkout", {...})      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Edge Function (create-checkout) runs                     │
│    const SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
   ❌ NOT FOUND               ✅ FOUND (after fix)
         │                           │
         ▼                           ▼
┌─────────────────────┐     ┌─────────────────────┐
│ Returns error       │     │ Creates Stripe      │
│ or no URL           │     │ Checkout Session    │
└────────┬────────────┘     └─────────┬───────────┘
         │                            │
         ▼                            ▼
┌─────────────────────┐     ┌─────────────────────┐
│ Frontend catches    │     │ Returns checkout    │
│ error/no URL        │     │ URL to frontend     │
└────────┬────────────┘     └─────────┬───────────┘
         │                            │
         ▼                            ▼
┌─────────────────────┐     ┌─────────────────────┐
│ 🎭 DEMO MODE:       │     │ Frontend redirects  │
│ Updates DB directly │     │ to Stripe           │
│ No Stripe payment!  │     └─────────┬───────────┘
└─────────────────────┘               │
                                      ▼
                            ┌─────────────────────┐
                            │ User on Stripe      │
                            │ checkout.stripe.com │
                            └─────────┬───────────┘
                                      │
                                      ▼
                            ┌─────────────────────┐
                            │ Completes payment   │
                            └─────────┬───────────┘
                                      │
                                      ▼
                            ┌─────────────────────┐
                            │ Webhook fires       │
                            │ Updates DB          │
                            │ Premium activated!  │
                            └─────────────────────┘
```

## 🟢 Where to Configure Secrets

```
┌────────────────────────────────────────────────────────────┐
│                    YOUR PROJECT STRUCTURE                   │
└────────────────────────────────────────────────────────────┘

📁 Local Project
├── 📄 .env ← Frontend variables (VITE_*)
│   ├── VITE_STRIPE_SECRET_KEY=sk_test_...      ✅ For frontend
│   ├── VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... ✅ For frontend
│   └── VITE_STRIPE_PREMIUM_PRICE_ID=price_...  ✅ For frontend
│
└── 📁 supabase/functions/
    └── 📁 create-checkout/
        └── 📄 index.ts ← Needs STRIPE_SECRET_KEY
            ❌ CANNOT read .env file
            ❌ Runs on Supabase servers
            ✅ MUST use Supabase Dashboard secrets

☁️  Supabase Dashboard (supabase.com)
└── ⚙️  Project Settings
    └── 🔧 Edge Functions
        └── 🔐 Secrets ← ADD SECRETS HERE!
            ├── STRIPE_SECRET_KEY=sk_test_...     ⚠️ MISSING!
            ├── SUPABASE_URL=https://...          ⚠️ MISSING!
            └── SUPABASE_ANON_KEY=eyJ...          ⚠️ MISSING!
```

## 🔑 Secret Name Mapping

| What You Have (.env)          | What Edge Functions Need     |
|-------------------------------|------------------------------|
| `VITE_STRIPE_SECRET_KEY`      | `STRIPE_SECRET_KEY` ⚠️       |
| `VITE_SUPABASE_URL`           | `SUPABASE_URL` ⚠️            |
| `VITE_SUPABASE_ANON_KEY`      | `SUPABASE_ANON_KEY` ⚠️       |

**Notice:** 
- Frontend uses `VITE_*` prefix
- Edge Functions use plain names (no `VITE_`)
- They're in DIFFERENT places!

## 📊 Comparison: Before vs After Fix

### BEFORE (Demo Mode)
```
User → Frontend → Edge Function (no secrets) → ❌ Fail
                       ↓
                  Demo Mode
                       ↓
              Update DB directly
                       ↓
              Premium without payment ⚠️
```

### AFTER (Real Stripe)
```
User → Frontend → Edge Function (has secrets) → ✅ Success
                       ↓
              Create Stripe Session
                       ↓
              Return checkout URL
                       ↓
              Redirect to Stripe
                       ↓
              User pays
                       ↓
              Webhook updates DB
                       ↓
              Premium activated! 🎉
```

## 🛠️ The Fix in 3 Steps

```
┌─────────────────────────────────────────┐
│ Step 1: Open Supabase Dashboard        │
│ https://supabase.com/dashboard         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Step 2: Navigate to Edge Functions      │
│ Settings → Edge Functions → Secrets    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Step 3: Add 3 Secrets                   │
│ • STRIPE_SECRET_KEY                     │
│ • SUPABASE_URL                          │
│ • SUPABASE_ANON_KEY                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ ✅ DONE! Edge functions now have access │
└─────────────────────────────────────────┘
```

## 🧪 Testing Workflow

```
1. Open Browser Console (F12)
        ↓
2. Navigate to /premium
        ↓
3. Click "Upgrade to Premium"
        ↓
4. Watch console logs:
        │
        ├─ [Stripe] ✅ Valid price ID found
        ├─ [Stripe] ✅ Auth session found  
        ├─ [Stripe] 📡 Invoking create-checkout...
        ├─ [Stripe] 📥 Edge function response: {...}
        └─ [Stripe] ✅ Checkout URL received
        ↓
5. Browser redirects → checkout.stripe.com
        ↓
6. Use test card: 4242 4242 4242 4242
        ↓
7. Complete payment
        ↓
8. Redirected back → /premium?success=true
        ↓
9. Premium activated! 🎉
```

## ⚠️ Common Errors

### Error 1: "STRIPE_SECRET_KEY is not set"
```
Edge Function
    ↓
Looks for STRIPE_SECRET_KEY
    ↓
❌ Not found in Supabase Dashboard
    ↓
Returns error
    ↓
Frontend falls back to demo mode
```
**Fix:** Add secret in Supabase Dashboard

### Error 2: "Missing Authorization header"
```
User not logged in
    ↓
No auth token sent to Edge Function
    ↓
❌ Edge function rejects request
```
**Fix:** Log in before upgrading

### Error 3: "No checkout URL returned"
```
Edge Function runs
    ↓
Creates Stripe session
    ↓
❌ Stripe API error (invalid price ID?)
    ↓
No URL returned
```
**Fix:** Check Stripe dashboard for valid price ID

---

**Visual Summary:**

```
 LOCAL .env        SUPABASE DASHBOARD
┌──────────┐      ┌────────────────┐
│ VITE_*   │      │ Plain names    │
│ Frontend │      │ Edge Functions │
│ Only     │ ❌ → │ Need secrets!  │
└──────────┘      └────────────────┘
                         ⬆️
                    ADD HERE!
```
