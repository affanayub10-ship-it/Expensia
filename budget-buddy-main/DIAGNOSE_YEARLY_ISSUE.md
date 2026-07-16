# 🔍 Diagnose Yearly Subscription Issue

## What I See in Your Screenshot:

1. ❌ **"Billed monthly"** - Even though you selected yearly
2. ❌ **PKR and USD currencies** - Should only show USD
3. ✅ Price shows $9.00 - This is the monthly price

---

## 🎯 Root Cause Analysis:

The issue is in the **frontend** - it's not using the yearly price ID when you select "Yearly".

Let me check what's happening:

### Check 1: Does Yearly Price ID Exist in .env?

Run this in browser console (F12) on your app:
```javascript
console.log('Monthly Price ID:', import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID);
console.log('Yearly Price ID:', import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY);
```

**Expected:**
```
Monthly Price ID: price_1TshgvRp1jrpNofsa0P5jLAG
Yearly Price ID: price_XXXXXXXXXXXXX (your yearly price)
```

**If you see:**
```
Yearly Price ID: price_your_yearly_price_id_here
```

→ **PROBLEM:** You haven't set the real yearly price ID in `.env`!

---

### Check 2: Is the Yearly Price ID Being Used?

The code in `premium.tsx` (line 240):
```typescript
const priceId = billing === "yearly" && yearlyPriceId && !yearlyPriceId.includes("your_stripe")
  ? yearlyPriceId
  : monthlyPriceId;
```

This logic says:
- If yearly is selected
- AND yearlyPriceId exists
- AND it doesn't contain "your_stripe" (placeholder check)
- → Use yearly price
- Otherwise → Use monthly price

**Your Issue:** The yearly price ID still has the placeholder text, so it falls back to monthly!

---

## ✅ THE FIX:

### Step 1: Create Yearly Price in Stripe (If Not Done)

1. Go to: https://dashboard.stripe.com/test/products
2. Click your Premium product
3. Click "Add another price"
4. Fill in:
   ```
   Price: $90.00
   Billing: Recurring
   Billing period: Yearly
   Currency: USD (ONLY!)
   ```
5. Click "Add price"
6. **Copy the Price ID** (e.g., `price_1XyzAbcDef123456`)

### Step 2: Update .env File

Open: `c:\Users\Leverify\Desktop\expenses\budget-buddy-main\.env`

Find:
```env
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_your_yearly_price_id_here
```

Replace with YOUR actual price ID:
```env
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_1XyzAbcDef123456
```

**CRITICAL:** Use the REAL price ID from Stripe, not the placeholder!

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
# Start again:
npm run dev
```

### Step 4: Clear Browser Cache

Press: `Ctrl+Shift+R` (hard refresh)

Or clear cache completely:
1. F12 (Dev Tools)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"

### Step 5: Test Again

1. Go to Premium page
2. Select "Yearly"
3. Click subscribe
4. Stripe checkout should now show:
   - **"Billed yearly"** ✅
   - **$90.00 USD** ✅
   - Only USD currency ✅

---

## 🔍 Additional Diagnostics:

### Diagnostic 1: Check What Price ID Is Being Sent

Add console.log in `premium.tsx` before creating checkout:

Find this line (around line 254):
```typescript
const priceId = billing === "yearly" && yearlyPriceId && !yearlyPriceId.includes("your_stripe")
  ? yearlyPriceId
  : monthlyPriceId;
```

Add logging RIGHT AFTER:
```typescript
const priceId = billing === "yearly" && yearlyPriceId && !yearlyPriceId.includes("your_stripe")
  ? yearlyPriceId
  : monthlyPriceId;

console.log('[Premium] Billing selected:', billing);
console.log('[Premium] Monthly Price ID:', monthlyPriceId);
console.log('[Premium] Yearly Price ID:', yearlyPriceId);
console.log('[Premium] FINAL priceId being sent:', priceId);
console.log('[Premium] Is yearly valid?', billing === "yearly" && yearlyPriceId && !yearlyPriceId.includes("your_stripe"));
```

Then test and check browser console!

---

### Diagnostic 2: Verify Stripe Price Configuration

Go to: https://dashboard.stripe.com/test/products

Your Premium product should show:

**Monthly Price:**
- Amount: $9.00
- Interval: Monthly
- Currency: **USD** ✅
- Price ID: `price_1TshgvRp1jrpNofsa0P5jLAG`

**Yearly Price:**
- Amount: $90.00
- Interval: Yearly  
- Currency: **USD** ✅
- Price ID: `price_XXXXXXXXXXXXX` (you need this!)

**If yearly price doesn't exist → CREATE IT!**

---

### Diagnostic 3: Check Currency Issue

The PKR showing up means:
1. Your Stripe price has multiple currency options enabled
2. Or your Stripe account location is set to Pakistan

**Fix:**
1. Go to each price (monthly & yearly)
2. Click the price
3. Look for "Currencies" section
4. If it shows multiple currencies:
   - Delete that price
   - Create a new price with ONLY USD
5. Make sure "Multi-currency pricing" is OFF

---

## 🎯 Quick Test Commands:

### In Browser Console:

```javascript
// Test 1: Check env variables
console.log('ENV CHECK:', {
  monthly: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
  yearly: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY,
  hasYearly: !!import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY,
  isPlaceholder: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY?.includes('your_stripe')
});

// Test 2: Simulate price selection logic
const monthlyPriceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID;
const yearlyPriceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY;
const billing = 'yearly'; // Test with yearly

const priceId = billing === "yearly" && yearlyPriceId && !yearlyPriceId.includes("your_stripe")
  ? yearlyPriceId
  : monthlyPriceId;

console.log('PRICE SELECTION TEST:', {
  billing,
  selectedPriceId: priceId,
  isUsingYearly: priceId === yearlyPriceId,
  reason: priceId === yearlyPriceId ? 'Using yearly ✅' : 'Fallback to monthly ❌'
});
```

Run this and tell me the output!

---

## 📋 Checklist to Fix:

- [ ] Go to Stripe Dashboard
- [ ] Create yearly price ($90/year, USD only)
- [ ] Copy the yearly price ID
- [ ] Update `.env` with real price ID (not placeholder)
- [ ] Restart dev server (`npm run dev`)
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Test yearly subscription
- [ ] Verify Stripe shows "Billed yearly" and "$90.00"
- [ ] Verify only USD currency shows

---

## 🆘 If Still Not Working:

1. Send me the output of the browser console tests above
2. Screenshot of your Stripe Products page
3. Tell me what the console.log shows when you click subscribe

Then I can pinpoint the exact issue!

---

**Most likely issue:** You need to actually CREATE the yearly price in Stripe and add the real price ID to `.env`. The placeholder value is causing it to fall back to monthly! 🎯
