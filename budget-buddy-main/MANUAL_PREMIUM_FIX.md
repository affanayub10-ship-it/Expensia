# 🚨 Manual Premium Fix - Works 100%

If automation isn't working yet, use this manual approach to grant premium access immediately.

---

## ✅ Instant Fix (30 seconds)

### Step 1: Open Supabase SQL Editor
https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/sql/new

### Step 2: Run This SQL
```sql
-- Grant premium to specific users by email
UPDATE subscriptions
SET 
  subscription_plan = 'premium',
  subscription_status = 'active',
  cancel_at_period_end = false,
  current_period_end = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN (
    'affanayub5@gmail.com',
    'affanayub10@gmail.com'
  )
);

-- Verify it worked
SELECT 
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.current_period_end
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com');
```

### Step 3: Refresh Your App
1. Go to your app
2. Press Ctrl+Shift+R (hard refresh)
3. Premium should work now! ✅

---

## 🔍 If Still Not Working

The issue is likely in the frontend. Let's check:

### Check 1: Verify Database
```sql
-- What does the database actually show?
SELECT 
  u.id as user_id,
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.billing_cycle,
  s.current_period_end
FROM auth.users u
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com');
```

**Expected result:**
- subscription_plan: "premium"
- subscription_status: "active"

### Check 2: Test Frontend Logic

Open browser console (F12) on your app and paste:

```javascript
// Check subscription from database
const checkSubscription = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  console.log('1. Current User:', user?.email);
  
  const { data: sub, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user?.id)
    .single();
  
  console.log('2. Subscription from DB:', sub);
  console.log('3. Subscription Error:', error);
  
  if (sub) {
    const isPremium = 
      sub.subscription_plan === 'premium' && 
      (sub.subscription_status === 'active' || sub.subscription_status === 'trialing');
    
    console.log('4. Plan:', sub.subscription_plan);
    console.log('5. Status:', sub.subscription_status);
    console.log('6. Is Premium (should be true):', isPremium);
  }
};

checkSubscription();
```

**Tell me what each console.log shows!**

---

## 🎯 Different Scenarios

### Scenario A: Database shows premium, but frontend doesn't
**This means the frontend isn't reading it correctly**

Fix: Force refresh the subscription context

```javascript
// In browser console
localStorage.clear();
window.location.reload();
```

### Scenario B: Database doesn't show premium
**This means the SQL update didn't work**

Fix: Check if user exists in subscriptions table

```sql
-- Check if user has a subscription record at all
SELECT 
  u.id,
  u.email,
  s.id as subscription_id
FROM auth.users u
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'affanayub5@gmail.com';
```

If subscription_id is NULL, create it:

```sql
-- Create subscription record
INSERT INTO subscriptions (
  user_id,
  subscription_plan,
  subscription_status,
  billing_cycle,
  current_period_start,
  current_period_end,
  cancel_at_period_end,
  created_at,
  updated_at
)
SELECT 
  id,
  'premium',
  'active',
  'monthly',
  NOW(),
  NOW() + INTERVAL '30 days',
  false,
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'affanayub5@gmail.com'
ON CONFLICT (user_id) DO UPDATE
SET 
  subscription_plan = 'premium',
  subscription_status = 'active',
  updated_at = NOW();

-- Repeat for second user
INSERT INTO subscriptions (
  user_id,
  subscription_plan,
  subscription_status,
  billing_cycle,
  current_period_start,
  current_period_end,
  cancel_at_period_end,
  created_at,
  updated_at
)
SELECT 
  id,
  'premium',
  'active',
  'monthly',
  NOW(),
  NOW() + INTERVAL '30 days',
  false,
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'affanayub10@gmail.com'
ON CONFLICT (user_id) DO UPDATE
SET 
  subscription_plan = 'premium',
  subscription_status = 'active',
  updated_at = NOW();
```

### Scenario C: Everything looks right but premium still locked
**This means there's a frontend code issue**

Let's check the actual component logic. Run in console:

```javascript
// Check what the SubscriptionContext sees
const ctx = document.querySelector('[data-subscription-context]');
console.log('Context element:', ctx);

// Or check React DevTools
// Look for SubscriptionProvider component
// Check its state values
```

---

## 🔧 Force Premium in Frontend (Temporary Debug)

If you need to test premium features RIGHT NOW while debugging:

### Option 1: Modify SubscriptionContext temporarily

Open: `src/context/SubscriptionContext.tsx`

Find the line:
```typescript
const isPremium =
  subscription.plan === "premium" &&
  (subscription.status === "active" || subscription.status === "trialing");
```

Temporarily change to:
```typescript
const isPremium = true; // TEMPORARY - FOR TESTING ONLY
```

Save and refresh. Premium features will work.

**Remember to change it back after testing!**

---

## 📊 Complete Diagnostic Query

Run this mega-query to see EVERYTHING:

```sql
-- Complete diagnostic view
WITH user_data AS (
  SELECT 
    u.id,
    u.email,
    u.created_at as user_created
  FROM auth.users u
  WHERE u.email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com')
)
SELECT 
  ud.email,
  ud.user_created,
  s.subscription_plan,
  s.subscription_status,
  s.billing_cycle,
  s.stripe_customer_id,
  s.stripe_subscription_id,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  s.created_at as sub_created,
  s.updated_at as sub_updated,
  -- Check if would pass isPremium check
  CASE 
    WHEN s.subscription_plan = 'premium' 
      AND (s.subscription_status = 'active' OR s.subscription_status = 'trialing')
    THEN 'YES - Should have premium'
    ELSE 'NO - Will not have premium'
  END as should_have_premium,
  -- Payment history count
  (SELECT COUNT(*) FROM payment_history ph WHERE ph.user_id = ud.id) as payment_count
FROM user_data ud
LEFT JOIN subscriptions s ON ud.id = s.user_id
ORDER BY ud.email;
```

**This shows EVERYTHING. Tell me what it outputs!**

---

## 🎯 The Guaranteed Fix

If NOTHING else works, this will:

```sql
-- Step 1: Delete and recreate subscription (nuclear option)
DELETE FROM subscriptions 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com')
);

-- Step 2: Create fresh premium subscriptions
INSERT INTO subscriptions (
  user_id,
  subscription_plan,
  subscription_status,
  billing_cycle,
  current_period_start,
  current_period_end,
  cancel_at_period_end
)
SELECT 
  id,
  'premium'::text,
  'active'::text,
  'monthly'::text,
  NOW(),
  NOW() + INTERVAL '1 year',
  false
FROM auth.users
WHERE email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com');

-- Step 3: Verify
SELECT 
  u.email,
  s.*
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email IN ('affanayub5@gmail.com', 'affanayub10@gmail.com');
```

Then:
1. Close your browser completely
2. Reopen it
3. Go to your app
4. Login again
5. Premium WILL work

---

## 🆘 Still Not Working?

Run the complete diagnostic query above and send me:
1. The complete output
2. Screenshot of your browser console with the JavaScript check
3. Screenshot of Supabase Edge Functions page

Then I can give you the exact fix!

---

## 💡 Pro Tip

While debugging automation, use this SQL to manually grant premium to ANY user:

```sql
-- Replace email with any user
UPDATE subscriptions
SET 
  subscription_plan = 'premium',
  subscription_status = 'active',
  current_period_end = NOW() + INTERVAL '1 year',
  updated_at = NOW()
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'USER_EMAIL_HERE');
```

This bypasses all automation and just GIVES them premium directly in the database.

The frontend will pick it up on next refresh! ✅
