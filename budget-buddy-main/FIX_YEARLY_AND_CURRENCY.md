# Fix Yearly Subscription & Force USD Currency

## 🔴 Issues Found:

1. **Yearly subscription shows as "monthly"** - No yearly price ID configured in Stripe
2. **Two currencies showing (PKR & USD)** - Stripe checkout allowing multiple currencies

---

## ✅ Solutions:

### Issue 1: Fix Yearly Subscription

You need to create a yearly price in Stripe and add it to your `.env` file.

#### Step 1: Create Yearly Price in Stripe (3 minutes)

1. Go to Stripe Dashboard: https://dashboard.stripe.com/test/products
2. Find your Premium product (or create it if missing)
3. Click "Add another price"
4. Configure:
   - **Price**: `$90` (or your yearly price)
   - **Billing period**: `Yearly`
   - **Currency**: `USD`
5. Click "Add price"
6. **Copy the Price ID** (starts with `price_...`)

#### Step 2: Update .env File

Open: `c:\Users\Leverify\Desktop\expenses\budget-buddy-main\.env`

Replace this line:
```env
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_your_yearly_price_id_here
```

With your actual yearly price ID:
```env
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_XXXXXXXXXXXXX
```

#### Step 3: Restart Dev Server

```bash
# Stop your dev server (Ctrl+C)
# Then start it again
npm run dev
```

---

### Issue 2: Force USD Currency Only

#### Option A: Update Stripe Price Settings (Recommended)

1. Go to: https://dashboard.stripe.com/test/products
2. Click on your Premium product
3. For EACH price (monthly & yearly):
   - Click the price
   - Make sure "Currency" is set to **USD only**
   - If it shows multiple currencies, delete the non-USD prices
   - Keep only USD prices

#### Option B: Force USD in Checkout (Already Fixed!)

I already added `currency: "usd"` to your create-checkout function.

**But note:** The `currency` parameter in checkout sessions is for **one-time payments**, not subscriptions. For subscriptions, currency comes from the Price object in Stripe.

So you MUST fix the Stripe prices themselves (Option A above).

---

## 🔧 Alternative: If You Don't Have Yearly Price Yet

If you don't want to offer yearly billing yet, hide the toggle:

### Hide Yearly Toggle in Premium Page

Edit: `src/routes/premium.tsx`

Find this section (around line 200):
```typescript
{/* Billing Toggle */}
<div className={cn("flex justify-center mb-10 transition-all duration-700 delay-100", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
  <div className="relative inline-flex items-center rounded-2xl bg-muted p-1.5 ring-1 ring-border">
    <button onClick={() => setBilling("monthly")} ...>
      Monthly
    </button>
    <button onClick={() => setBilling("yearly")} ...>
      Yearly
    </button>
  </div>
</div>
```

**Option 1: Comment it out temporarily**
```typescript
{/* Billing Toggle - Temporarily disabled until yearly price is configured
<div className={cn("flex justify-center mb-10", ...)}>
  ...
</div>
*/}
```

**Option 2: Lock it to monthly only**

Replace the billing toggle section with:
```typescript
{/* Billing locked to monthly until yearly price configured */}
<div className="text-center mb-10">
  <Badge className="text-sm py-2 px-4">Monthly Billing</Badge>
</div>
```

---

## 📋 Complete Checklist:

### To Enable Yearly Billing:
- [ ] Create yearly price in Stripe ($90/year or your price)
- [ ] Copy the yearly price ID
- [ ] Add to `.env` as `VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY`
- [ ] Restart dev server
- [ ] Test yearly subscription

### To Force USD Only:
- [ ] Go to Stripe Products
- [ ] For each price (monthly & yearly):
  - [ ] Verify currency is USD
  - [ ] Delete any non-USD price variants
- [ ] Redeploy `create-checkout` function with currency fix (already done)
- [ ] Test checkout - should only show USD

---

## 🧪 Testing:

### Test Yearly Subscription:
1. Go to Premium page
2. Toggle to "Yearly"
3. Click "Continue to Secure Payment"
4. Should show: `$90.00 / year` in Stripe checkout
5. Complete payment with test card: `4242 4242 4242 4242`
6. After success, check database:
   ```sql
   SELECT email, billing_cycle, subscription_status
   FROM active_premium_subscribers;
   ```
7. Should show `billing_cycle = 'yearly'` ✅

### Test USD Only:
1. Go to checkout
2. Should only see USD ($) - no PKR or other currencies
3. If you still see multiple currencies:
   - Your Stripe prices have multiple currency variants
   - Delete the non-USD prices in Stripe Dashboard

---

## 🎯 Quick Commands:

### Check Current Subscriptions:
```sql
SELECT 
  email,
  subscription_plan,
  subscription_status,
  billing_cycle,
  current_period_end
FROM active_premium_subscribers
ORDER BY updated_at DESC;
```

### Check Yearly Price ID in Frontend:
Open browser console (F12) on your app:
```javascript
console.log('Monthly:', import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID);
console.log('Yearly:', import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY);
```

Should show:
```
Monthly: price_1TshgvRp1jrpNofsa0P5jLAG
Yearly: price_XXXXXXXXXXXXX (your yearly price)
```

---

## 📊 What Changed in Code:

### File: `supabase/functions/create-checkout/index.ts`

**Before:**
```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  line_items: [{ price: priceId, quantity: 1 }],
  mode: "subscription",
  // ... other options
});
```

**After:**
```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  line_items: [{ price: priceId, quantity: 1 }],
  mode: "subscription",
  currency: "usd", // ← ADDED: Force USD only
  // ... other options
});
```

**Note:** This helps but main fix is in Stripe Dashboard - prices must be USD-only.

---

## 🆘 Still Seeing Issues?

### Issue: "Yearly shows as monthly in database"

**Cause:** The webhook needs to detect billing cycle from Stripe price.

Check webhook code in: `supabase/functions/stripe-webhook/index.ts`

Around line 65:
```typescript
const billingCycle = sub.items.data[0]?.price?.recurring?.interval === "year" 
  ? "yearly" 
  : "monthly";
```

This should correctly detect yearly vs monthly from Stripe subscription data.

### Issue: "Still seeing PKR currency"

**Cause:** Your Stripe prices have multiple currency variants.

**Fix:**
1. Go to Stripe Dashboard → Products
2. Click your Premium product
3. For each price, check if it has multiple currencies
4. If yes, delete all except USD
5. Or create new USD-only prices

---

## 💡 Pro Tips:

### Verify Stripe Price Configuration:

Go to: https://dashboard.stripe.com/test/products

Your Premium product should have:
- ✅ Monthly price: $9/month (USD) - ID: `price_1TshgvRp1jrpNofsa0P5jLAG`
- ✅ Yearly price: $90/year (USD) - ID: `price_XXXXX` (needs to be created)
- ❌ No PKR prices
- ❌ No other currency variants

### Test with Stripe CLI (Optional):

If you have Stripe CLI installed:
```bash
stripe prices list --limit 10
```

Should show your monthly and yearly prices, both in USD.

---

## ✅ After Fixing:

You should have:
- ✅ Monthly subscription: $9/month USD
- ✅ Yearly subscription: $90/year USD (save $18!)
- ✅ Checkout only shows USD currency
- ✅ Database correctly shows "yearly" for yearly subscriptions
- ✅ Webhook correctly processes both billing cycles

---

**Ready to fix? Follow the checklist above!** 🚀
