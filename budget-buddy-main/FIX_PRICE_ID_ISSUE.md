# Fix: Price ID Showing as Placeholder

## 🔴 Problem

Console shows:
```
[Stripe] Monthly price ID: price_your_stripe_price_id_here
[Stripe] Selected price ID: price_your_stripe_price_id_here | hasPrice: false
```

But your `.env` file has the correct value:
```
VITE_STRIPE_PREMIUM_PRICE_ID=price_1TshgvRp1jrpNofsa0P5jLAG
```

## ✅ Solution

**The app is running with OLD environment variables!**

You need to restart the development server to pick up the new values.

### Steps:

1. **Stop the dev server**
   - Press `Ctrl+C` in the terminal running the app
   - Or close the terminal

2. **Start the dev server again**
   ```bash
   npm run dev
   ```
   Or if using another command:
   ```bash
   npm start
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Hard refresh the browser**
   - Press `Ctrl+Shift+R` (Windows/Linux)
   - Or `Cmd+Shift+R` (Mac)
   - Or open DevTools (F12) → Right-click refresh → "Empty Cache and Hard Reload"

4. **Test again**
   - Open browser console (F12)
   - Go to `/premium`
   - Click "Upgrade to Premium"
   - Should now show: `[Stripe] Monthly price ID: price_1TshgvRp1jrpNofsa0P5jLAG`

## 🔍 Why This Happens

Environment variables (`.env` files) are loaded when the app **starts**, not while it's running.

- ✅ `.env` file has correct value: `price_1TshgvRp1jrpNofsa0P5jLAG`
- ❌ Running app still has old placeholder: `price_your_stripe_price_id_here`
- 🔄 Solution: Restart to reload environment variables

## ⚠️ After Restart - Next Issue

Once the price ID loads correctly, you'll need to configure **Supabase Edge Function Secrets** (see `QUICK_FIX.md`).

The flow will be:
1. ✅ Price ID loads correctly
2. ✅ App calls Edge Function
3. ❌ Edge Function fails (no secrets configured)
4. Follow `QUICK_FIX.md` to add secrets

## 🧪 Expected Logs After Restart

```
[Stripe] Upgrade button clicked, billing cycle: monthly
[Stripe] User authenticated: dd08aa55-1b18-4f87-8eda-fdd77b287d02
[Stripe] Monthly price ID: price_1TshgvRp1jrpNofsa0P5jLAG ✅
[Stripe] Yearly price ID: (not set — will use monthly)
[Stripe] Selected price ID: price_1TshgvRp1jrpNofsa0P5jLAG | hasPrice: true ✅
[Stripe] ✅ Valid price ID found, creating Stripe checkout session...
[Stripe] ✅ Auth session found
[Stripe] 📡 Invoking create-checkout edge function...
```

Then either:
- ✅ Redirects to Stripe (if secrets configured)
- ❌ Edge function error (if secrets NOT configured) → See `QUICK_FIX.md`

---

**TL;DR:** Restart your dev server with `npm run dev` and hard refresh browser!
