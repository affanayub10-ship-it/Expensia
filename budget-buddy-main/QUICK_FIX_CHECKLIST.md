# ⚡ Quick Fix Checklist - Yearly & Currency Issues

## 🎯 Two Issues to Fix

### Issue 1: Yearly Subscription Shows Monthly ❌
**Root Cause**: Stripe yearly price is configured as "Monthly" billing period

### Issue 2: Checkout Shows PKR and USD ❌
**Root Cause**: Stripe prices have multi-currency enabled

---

## ✅ Fix Both Issues in Stripe Dashboard

### Step 1: Open Stripe Dashboard
Go to: https://dashboard.stripe.com/test/products

### Step 2: Find Your Premium Product
Click on your Premium product to see all prices

### Step 3: Create TWO New Prices (Both USD-Only)

#### A) Monthly Price - $9/month
1. Click **"Add another price"**
2. Set:
   - Amount: `9.00`
   - Currency: **USD** (disable multi-currency ✅)
   - Billing period: **Month** ✅
   - Type: Recurring
3. Click **"Add price"**
4. Copy the new price ID (e.g., `price_xxxxxxxxxxxxx`)

#### B) Yearly Price - $90/year
1. Click **"Add another price"**
2. Set:
   - Amount: `90.00`
   - Currency: **USD** (disable multi-currency ✅)
   - Billing period: **Year** ✅ (NOT Month!)
   - Type: Recurring
3. Click **"Add price"**
4. Copy the new price ID (e.g., `price_yyyyyyyyyyy`)

### Step 4: Update `.env` File
Replace BOTH price IDs with the NEW ones:

```env
# Replace these lines in your .env file:
VITE_STRIPE_PREMIUM_PRICE_ID=price_NEW_MONTHLY_ID_HERE
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_NEW_YEARLY_ID_HERE
```

### Step 5: Restart Dev Server
```bash
# Press Ctrl+C to stop current server
# Then restart:
npm run dev
```

---

## 🧪 Test Everything Works

### Test 1: Monthly Subscription
1. Go to: http://localhost:8080/premium
2. Make sure **"Monthly"** is selected
3. Click **"Continue to Secure Payment"**
4. Stripe checkout should show:
   - ✅ "$9.00 USD" (no PKR option)
   - ✅ "Billed monthly"
5. Use test card: `4242 4242 4242 4242`
6. Complete checkout
7. Check database:
   ```sql
   SELECT billing_cycle FROM subscriptions 
   WHERE user_id = 'YOUR_USER_ID';
   ```
   Should show: `monthly` ✅

### Test 2: Yearly Subscription
1. Go to: http://localhost:8080/premium
2. Toggle to **"Yearly"**
3. Click **"Continue to Secure Payment"**
4. Stripe checkout should show:
   - ✅ "$90.00 USD" (no PKR option)
   - ✅ "Billed yearly"
5. Use test card: `4242 4242 4242 4242`
6. Complete checkout
7. Check database:
   ```sql
   SELECT billing_cycle FROM subscriptions 
   WHERE user_id = 'YOUR_USER_ID';
   ```
   Should show: `yearly` ✅

### Test 3: Check Webhook Logs
1. Go to: Supabase Dashboard → Edge Functions → stripe-webhook
2. Click on latest execution
3. Look for these log lines:
   ```
   Monthly: [webhook] 🔍 Stripe interval detected: month ✅
   Yearly:  [webhook] 🔍 Stripe interval detected: year ✅
   ```

---

## 🎯 What Fixed Each Issue

### Currency Issue (PKR/USD) - FIXED BY:
- Creating new prices with **"Multi-currency pricing" disabled**
- Only USD selected when creating prices
- `currency: "usd"` already added in `create-checkout/index.ts` (done ✅)

### Yearly Billing Issue - FIXED BY:
- Creating new price with **"Billing period: Year"** (not Month!)
- Webhook already reads interval correctly from Stripe
- Frontend already displays billing_cycle correctly

---

## ⚠️ Important Notes

1. **Don't delete old prices** - existing subscriptions may be using them
2. **Archive old prices instead** - in Stripe Dashboard, click price → Archive
3. **Both new prices must be USD-only** - no multi-currency
4. **The yearly price MUST have billing period "Year"** - not Month!
5. **Restart dev server after updating .env** - required for changes to load

---

## 🚨 If Issues Persist

### Currency still shows PKR:
- Verify new price in Stripe has **only USD** enabled
- Check "Multi-currency pricing" is OFF
- Create another price if needed

### Yearly still shows monthly:
- Click on the yearly price in Stripe Dashboard
- Verify "Billing period" shows **"Every 1 year"** not "Every 1 month"
- If wrong, create a NEW price with correct settings
- Update `.env` with the NEW price ID
- Restart server

### Can't find price settings:
1. Dashboard → Products
2. Click your Premium product
3. See list of prices below product details
4. Click any price to edit/view settings
5. Look for "Billing period" and "Currencies" sections

---

## 📊 Current vs Fixed Configuration

### CURRENT (WRONG):
```
Monthly Price: price_1TshgvRp1jrpNofsa0P5jLAG
  - $9/month ✅
  - Has PKR + USD ❌
  
Yearly Price: price_1TtaP5Rp1jrpNofsqm3TfqBq
  - $90/month ❌ (should be /year!)
  - Has PKR + USD ❌
```

### AFTER FIX:
```
Monthly Price: price_NEW_MONTHLY
  - $9/month ✅
  - USD only ✅
  
Yearly Price: price_NEW_YEARLY
  - $90/year ✅
  - USD only ✅
```

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ No PKR option in Stripe checkout (only USD)
- ✅ Database shows `billing_cycle = 'yearly'` for yearly subs
- ✅ Database shows `billing_cycle = 'monthly'` for monthly subs
- ✅ Frontend displays correct billing cycle badge
- ✅ Webhook logs show correct interval from Stripe
- ✅ Renewal dates are 1 month (monthly) or 1 year (yearly) apart

---

## 🎉 You're Done!

After following these steps:
1. Both monthly and yearly subscriptions will work correctly
2. Only USD currency will show in checkout
3. Database will have correct billing_cycle values
4. Frontend will display correct subscription info

If you still see issues, send me:
1. Screenshot of Stripe price settings
2. Webhook logs from Supabase
3. Database query results for subscriptions table
