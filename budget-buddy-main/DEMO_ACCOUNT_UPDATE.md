# ✅ Demo Account Updated

## What Changed

The login page now shows only **one** demo account button:

### Before:
- Demo user (`demo@expensia.app`)
- Alex J. (`alex@expensia.app`)

### After:
- **Demo** (`demo@budgetbuddy.com` / `Demo@1234`)

---

## How It Looks

On the login page, users will see:

```
Try demo: [● Demo]
```

Clicking the "Demo" button automatically fills:
- **Email**: `demo@budgetbuddy.com`
- **Password**: `Demo@1234`

---

## Test It

1. Start your app: `npm run dev`
2. Go to login page
3. Click the **"Demo"** button
4. Email and password auto-filled!
5. Click "Sign in"
6. ✅ Logged in!

---

## Code Change

**File**: `src/routes/login.tsx`

```typescript
const DEMO_HINTS = [
  { label: "Demo", email: "demo@budgetbuddy.com", password: "Demo@1234" },
];
```

---

## ✨ Done!

Your login page now shows a single, clean demo account button with the correct credentials!
