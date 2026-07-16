# Quick Fix - Currency & Yearly Subscription

## 🎯 Issue 1: Force USD Only (2 minutes)

### Go to Stripe Dashboard
https://dashboard.stripe.com/test/products

### Fix Currency:
1. Click on your "Premium" product
2. You'll see your price(s) listed
3. For each price:
   - Click the price
   - Check "Currency" field
   - If it shows multiple currencies or PKR: **Delete this price** and create a new USD-only price
   - Make sure it's set to **USD only**

---

## 🎯 Issue 2: Create Yearly Price (3 minutes)

### Step 1: Create Yearly Price in Stripe
1. Go to: https://dashboard.stripe.com/test/products
2. Click your "Premium" product
3. Click "Add another price"
4. Fill in:
   - **Price**: `90.00` (or your yearly price)
   - **Billing**: Select "Recurring"
   - **Billing period**: Select "Yearly"
   - **Currency**: **USD** (important!)
5. Click "Add price"
6. **Copy the new Price ID** (it looks like: `price_XXXXXXXXXXXXX`)

### Step 2: Add to Your .env File
Open: `.env`

Find this line:
```
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_your_yearly_price_id_here
```

Replace with your actual price ID:
```
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_XXXXXXXXXXXXX
```
(Paste the price ID you copied from Stripe)

### Step 3: Restart Your Dev Server
```bash
# Press Ctrl+C to stop
# Then start again:
npm run dev
```

---

## 🎯 Issue 3: Redeploy create-checkout (2 minutes)

### Update Supabase Edge Function:
1. Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions/create-checkout
2. Click "Edit" or "Code"
3. Find this section (around line 68):
```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  line_items: [{ price: priceId, quantity: 1 }],
  mode: "subscription",
  success_url: successUrl,
  cancel_url: cancelUrl,
  client_reference_id: user.id,
  subscription_data: {
    metadata: { supabase_user_id: user.id },
  },
});
```

4. Add `currency: "usd",` line after `client_reference_id`:
```typescript
const session = await stripe.checkout.sessions.create({
  customer: customerId,
  line_items: [{ price: priceId, quantity: 1 }],
  mode: "subscription",
  success_url: successUrl,
  cancel_url: cancelUrl,
  client_reference_id: user.id,
  currency: "usd", // ← ADD THIS LINE
  subscription_data: {
    metadata: { supabase_user_id: user.id },
  },
});
```

5. Click "Deploy"

---

## ✅ Test Everything:

### Test Monthly USD:
1. Go to your app → Premium page
2. Make sure "Monthly" is selected
3. Click subscribe
4. Should see: **$9.00 USD** (no PKR)
5. ✅ Pass

### Test Yearly USD:
1. Toggle to "Yearly"
2. Click subscribe
3. Should see: **$90.00 USD** (no PKR)
4. Complete with test card: `4242 4242 4242 4242`
5. Check database:
```sql
SELECT email, billing_cycle FROM active_premium_subscribers WHERE email = 'YOUR_EMAIL';
```
6. Should show `billing_cycle = 'yearly'` ✅

---

## 🔍 Verify Prices in Stripe:

Go to: https://dashboard.stripe.com/test/products

You should see:
```
Premium Product
├─ Monthly: $9.00 USD/month (price_1TshgvRp1jrpNofsa0P5jLAG)
└─ Yearly: $90.00 USD/year (price_XXXXX - your new price)
```

**Delete any prices that:**
- Show PKR currency
- Show multiple currencies
- Are not USD

---

## 📋 Checklist:

- [ ] Created yearly price in Stripe ($90 USD)
- [ ] Copied yearly price ID
- [ ] Added to `.env` file
- [ ] Restarted dev server
- [ ] Updated create-checkout function with `currency: "usd"`
- [ ] Redeployed create-checkout
- [ ] Deleted any non-USD prices from Stripe
- [ ] Tested monthly - shows USD only ✅
- [ ] Tested yearly - shows USD only ✅
- [ ] Database shows correct billing_cycle ✅

---

**Total Time: ~7 minutes** 🚀

After this, you'll have:
- ✅ Only USD currency in checkout
- ✅ Working yearly subscriptions ($90/year)
- ✅ Database correctly tracking billing cycles
