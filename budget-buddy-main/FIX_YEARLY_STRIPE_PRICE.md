# 🔧 Fix Yearly Subscription - Stripe Price Configuration Issue

## 🔍 Root Cause Identified

The yearly price ID `price_1TtaP5Rp1jrpNofsqm3TfqBq` in your Stripe Dashboard is configured with:
- **Billing Period: Monthly** ❌ (WRONG)
- **Should be: Yearly** ✅

This is why the webhook logs show:
```
[webhook] 🔍 Stripe interval detected: month
[webhook] 📅 Billing cycle set to: monthly
```

The webhook is reading Stripe's data correctly - the problem is the Stripe price configuration itself.

---

## ✅ Solution: Create Correct Yearly Price in Stripe

### Step 1: Go to Stripe Dashboard
1. Open: https://dashboard.stripe.com/test/products
2. Find your **Premium** product
3. Click on it to view details

### Step 2: Check Current Prices
You should see something like:
- `price_1TshgvRp1jrpNofsa0P5jLAG` - $9.00 / month ✅ (correct)
- `price_1TtaP5Rp1jrpNofsqm3TfqBq` - $90.00 / month ❌ (WRONG!)

### Step 3: Create New Yearly Price
1. Click **"Add another price"** button
2. Configure:
   - **Price**: `90.00`
   - **Billing period**: Select **"Year"** (not Month!)
   - **Currency**: USD only (disable multi-currency)
   - **Payment type**: Recurring
3. Click **"Add price"**
4. Copy the new price ID (starts with `price_`)

### Step 4: Update Your `.env` File
Replace the old yearly price ID with the new one:

```env
# OLD (wrong billing period)
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_1TtaP5Rp1jrpNofsqm3TfqBq

# NEW (correct yearly billing)
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_NEW_YEARLY_ID_HERE
```

### Step 5: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

---

## 🧪 Testing the Fix

### 1. Subscribe to Yearly Plan
1. Go to: http://localhost:8080/premium
2. Toggle to **"Yearly"**
3. Click **"Continue to Secure Payment"**
4. Use test card: `4242 4242 4242 4242`, any future date, any CVV
5. Complete checkout

### 2. Check Webhook Logs
Open Supabase Edge Functions logs, you should now see:
```
[webhook] 🔍 Stripe interval detected: year  ✅
[webhook] 📅 Billing cycle set to: yearly    ✅
```

### 3. Verify Database
Run this query in Supabase SQL Editor:
```sql
SELECT 
  user_id,
  subscription_plan,
  subscription_status,
  billing_cycle,  -- Should show 'yearly' ✅
  current_period_end
FROM subscriptions
WHERE subscription_status = 'active'
ORDER BY created_at DESC
LIMIT 5;
```

### 4. Check Frontend
- Go to http://localhost:8080/premium
- Should show "Yearly Plan" badge ✅
- Should show "$90/year" ✅
- Should show correct renewal date ✅

---

## 🛡️ Currency Fix (USD Only)

While creating the new yearly price, ensure:
1. **Multi-currency pricing** is OFF
2. Only **USD** is selected
3. No PKR or other currencies enabled

This prevents the checkout from showing multiple currency options.

---

## 📊 What Each Component Does

1. **Frontend (`premium.tsx`)**:
   - Reads `VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY` from env
   - Sends correct price ID to `create-checkout` function

2. **Create Checkout (`create-checkout/index.ts`)**:
   - Creates Stripe checkout session with the price ID
   - Forces `currency: "usd"`
   - Redirects user to Stripe hosted checkout

3. **Stripe**:
   - Processes payment
   - Sends webhook event with subscription data
   - **Includes `interval` from the price configuration** ⚠️

4. **Webhook (`stripe-webhook/index.ts`)**:
   - Reads `interval` from Stripe: `sub.items.data[0]?.price?.recurring?.interval`
   - Sets `billing_cycle` based on interval: `interval === "year" ? "yearly" : "monthly"`
   - Updates database

**The webhook is working correctly** - it's reading what Stripe sends. The issue is Stripe is sending `interval: "month"` because the price is configured as monthly.

---

## ⚠️ Common Mistakes to Avoid

1. ❌ Don't edit the old price - create a NEW price with correct settings
2. ❌ Don't use monthly billing period for yearly price
3. ❌ Don't enable multi-currency (causes PKR/USD selection issue)
4. ❌ Don't forget to restart dev server after updating `.env`
5. ❌ Don't use old price ID after creating new one

---

## 🎯 Expected Results After Fix

- ✅ Yearly subscriptions show "yearly" in database
- ✅ Checkout shows "$90.00 USD" (no PKR option)
- ✅ Webhook logs show "interval detected: year"
- ✅ Frontend displays "Yearly Plan" correctly
- ✅ Renewal date is 1 year from subscription date

---

## 🚨 If Still Not Working

If the yearly billing still shows as monthly after following all steps:

1. **Verify the new price in Stripe Dashboard**:
   - Click on the price
   - Check "Billing period" shows "Year" not "Month"

2. **Check `.env` file**:
   - Price ID matches the NEW yearly price
   - No typos in price ID
   - Server was restarted after change

3. **Test with different account**:
   - Use a fresh email for testing
   - Clear any cached subscriptions

4. **Check webhook received event**:
   - Supabase → Edge Functions → stripe-webhook → Logs
   - Look for `[webhook] 🔍 Stripe interval detected:` line
   - Should say "year" not "month"

---

## 📝 Summary

The code is correct. The Stripe price configuration is wrong. Create a new yearly price with billing period set to "Year" and update your `.env` file.
