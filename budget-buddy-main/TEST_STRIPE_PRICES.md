# 🧪 Test Stripe Price Configuration

## Current Configuration
- **Monthly Price ID**: `price_1TshgvRp1jrpNofsa0P5jLAG`
- **Yearly Price ID**: `price_1TtkaWRp1jrpNofsKy0A1De1` (NEW)

---

## 🔍 Step-by-Step Diagnosis

### Step 1: Verify Stripe Dashboard Configuration

Go to: https://dashboard.stripe.com/test/prices/price_1TtkaWRp1jrpNofsKy0A1De1

Check these settings for the yearly price:
- [ ] **Amount**: Should be $90.00
- [ ] **Billing period**: Should show "Every **1 year**" (NOT "Every 1 month")
- [ ] **Currency**: Should be USD only (multi-currency OFF)
- [ ] **Type**: Recurring

Also check monthly price: https://dashboard.stripe.com/test/prices/price_1TshgvRp1jrpNofsa0P5jLAG
- [ ] **Amount**: Should be $9.00
- [ ] **Billing period**: Should show "Every 1 month"
- [ ] **Currency**: Should be USD only (multi-currency OFF)
- [ ] **Type**: Recurring

---

### Step 2: Test Yearly Subscription Flow

1. **Open your app**: http://localhost:8080/premium
2. **Toggle to "Yearly"**
3. **Click "Continue to Secure Payment"**
4. **Check Stripe Checkout page**:
   - What does it say? "Billed monthly" or "Billed yearly"?
   - What currency options are shown? USD only or USD + PKR?
5. **Use test card**: `4242 4242 4242 4242`, any future date, any CVV
6. **Complete checkout**

---

### Step 3: Check Webhook Logs

1. Go to Supabase Dashboard
2. Navigate to: **Edge Functions** → **stripe-webhook**
3. Click on the **latest execution**
4. Look for these lines:

**What you SHOULD see for yearly:**
```
[webhook] 🔍 Stripe interval detected: year
[webhook] 📅 Billing cycle set to: yearly
```

**If you see this, it's WRONG:**
```
[webhook] 🔍 Stripe interval detected: month
[webhook] 📅 Billing cycle set to: monthly
```

---

### Step 4: Check Database

Run this in Supabase SQL Editor:

```sql
SELECT 
  user_id,
  subscription_plan,
  subscription_status,
  billing_cycle,  -- Should be 'yearly' for yearly subscriptions
  stripe_subscription_id,
  current_period_start,
  current_period_end,
  created_at
FROM subscriptions
WHERE subscription_status = 'active'
ORDER BY created_at DESC
LIMIT 3;
```

**For yearly subscription, billing_cycle should show**: `yearly`
**If it shows**: `monthly` → Stripe price is still configured wrong

---

### Step 5: Check Payment History

```sql
SELECT 
  user_id,
  amount,
  currency,
  billing_cycle,  -- Should be 'yearly'
  subscription_plan,
  payment_status,
  payment_date
FROM payment_history
ORDER BY payment_date DESC
LIMIT 3;
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Webhook shows "month" instead of "year"
**Cause**: The Stripe price is configured with monthly billing period
**Solution**: 
1. The price `price_1TtkaWRp1jrpNofsKy0A1De1` is configured incorrectly in Stripe
2. Go to Stripe Dashboard and check the billing period
3. If it says "Every 1 month", you need to create a NEW price with "Every 1 year"
4. You cannot edit billing period after creating a price - must create new one

### Issue 2: Checkout shows PKR and USD options
**Cause**: Stripe price has multi-currency enabled
**Solution**:
1. In Stripe Dashboard, check if "Multi-currency pricing" is enabled
2. If yes, create a NEW price with multi-currency DISABLED
3. Set currency to USD only

### Issue 3: Database shows "monthly" for yearly subscription
**Cause**: Same as Issue 1 - Stripe price billing period is wrong
**Fix**: Create correct yearly price in Stripe

---

## 🛠️ How to Create Correct Yearly Price

If the current yearly price is still configured incorrectly:

1. **Go to**: https://dashboard.stripe.com/test/products/prod_UsSckc6HY9hjIc
2. **Click**: "Add another price"
3. **Configure**:
   - Price: `90.00`
   - Currency: **USD** (make sure to UNCHECK "Enable multi-currency pricing")
   - Billing period: **Year** (select from dropdown - NOT Month!)
   - Usage is metered: OFF
   - Type: Recurring
4. **Click**: "Add price"
5. **Copy** the new price ID (will be different from `price_1TtkaWRp1jrpNofsKy0A1De1`)
6. **Update** `.env` file with the new price ID
7. **Restart** dev server

---

## 📸 Screenshot Verification

If still having issues, take screenshots of:
1. Stripe yearly price settings (showing billing period and currency)
2. Stripe checkout page (showing what it says "Billed yearly" or "Billed monthly")
3. Webhook logs from Supabase
4. Database query results showing billing_cycle

This will help identify where the configuration is wrong.

---

## ✅ Success Criteria

Everything is working correctly when:
- ✅ Stripe Dashboard shows yearly price with "Every 1 year" billing period
- ✅ Stripe Dashboard shows both prices with USD only (no PKR)
- ✅ Stripe Checkout says "Billed yearly" for yearly subscription
- ✅ Stripe Checkout shows "$90.00 USD" (no PKR option)
- ✅ Webhook logs show: `[webhook] 🔍 Stripe interval detected: year`
- ✅ Database billing_cycle column shows: `yearly`
- ✅ Frontend displays: "Yearly Plan" badge

---

## 🔄 Quick Test Command

After making changes, restart server:
```bash
# Stop server (Ctrl+C) then:
npm run dev
```

Then test the flow end-to-end and check all the verification points above.
