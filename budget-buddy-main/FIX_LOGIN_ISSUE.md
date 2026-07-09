# 🔧 Fix: Can't Login After Signup

## The Problem

When you create a new account and then logout, trying to login again shows "Invalid email or password".

### Why This Happens

1. **Signup creates user** in Supabase Auth with encrypted password
2. **Password NOT stored** in `user_credentials` table
3. **Login checks** `user_credentials` table first (doesn't find it)
4. **Fallback to Supabase** Auth fails because the login flow was checking credentials table first

## ✅ The Fix (2 Steps)

### Step 1: Update Database Policies

Run this SQL in Supabase SQL Editor:

```sql
-- Copy content from: supabase-fix-credentials-policy.sql
```

Or run this directly:

```sql
-- Allow inserts to user_credentials
DROP POLICY IF EXISTS "Allow insert via service role" ON public.user_credentials;

CREATE POLICY "Allow insert credentials" ON public.user_credentials
  FOR INSERT WITH CHECK (true);
```

### Step 2: Restart Your App

```bash
# Stop your dev server (Ctrl+C)
npm run dev
```

The code has been updated to:
- ✅ Store password in database during signup
- ✅ Try Supabase Auth login first
- ✅ Fallback to stored credentials for demo accounts
- ✅ Auto-login after successful signup

---

## 🧪 Test It Works

### Test Signup → Login Flow

1. **Create new account**:
   - Email: `test123@example.com`
   - Password: `Test@1234`
   - Name: `Test User`

2. **Logout**

3. **Login again** with same credentials
   - Should work now! ✅

### Verify in Database

Check credentials were stored:

```sql
SELECT email, name, password 
FROM user_credentials 
WHERE email = 'test123@example.com';
```

You should see your account listed!

---

## 🔄 How It Works Now

### Signup Process:
```
1. User fills signup form
   ↓
2. Create Supabase Auth user (encrypted password)
   ↓
3. Store plain password in user_credentials table
   ↓
4. Auto-login user
   ↓
✅ User is logged in
```

### Login Process:
```
1. User enters email/password
   ↓
2. Try Supabase Auth login (checks encrypted password)
   ↓
3a. Success → User logged in ✅
   ↓
3b. Failed → Check user_credentials table
   ↓
4. If found in user_credentials → Create/sync Auth user
   ↓
✅ User logged in
```

---

## 🎯 Benefits

✅ **Real users**: Stored in Supabase Auth (secure)  
✅ **Demo users**: Stored in credentials table (easy)  
✅ **No conflicts**: System handles both automatically  
✅ **Re-login works**: Checks both sources  

---

## 🔍 Troubleshooting

### Still can't login?

1. **Check user exists in Auth**:
   - Supabase Dashboard → Authentication → Users
   - Find your email

2. **Check credentials stored**:
   ```sql
   SELECT * FROM user_credentials WHERE email = 'your@email.com';
   ```

3. **Check browser console** for errors:
   - Open DevTools (F12)
   - Look at Console tab

4. **Try demo account** (always works):
   - Email: `demo@budgetbuddy.com`
   - Password: `Demo@1234`

### "Email already registered"

The email exists but you can't login. Fix:

```sql
-- Reset the account
DELETE FROM user_credentials WHERE email = 'your@email.com';
```

Then go to Supabase Dashboard → Authentication → Users → Delete the user

Now try signing up again.

---

## ✨ Summary

After applying the fix:

1. ✅ Run `supabase-fix-credentials-policy.sql`
2. ✅ Restart your app
3. ✅ Create account → Logout → Login again
4. ✅ Should work perfectly!

The system now properly stores credentials during signup and checks both Supabase Auth and the credentials table during login.
