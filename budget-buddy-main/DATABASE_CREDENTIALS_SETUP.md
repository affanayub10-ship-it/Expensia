# 🔐 Database-Stored Credentials Setup

This guide shows you how to set up a system where user credentials (email/password) are stored in the database and can be fetched for login.

## ⚡ Quick Setup (3 Steps)

### Step 1: Run Main Schema
1. Open Supabase SQL Editor: https://fgsrxibdmkssywrpbxzv.supabase.co
2. Copy ALL content from `supabase-schema.sql`
3. Paste and click **RUN**

### Step 2: Add Credentials Table & Demo Users
1. In SQL Editor, create **New Query**
2. Copy ALL content from `supabase-complete-with-demo-users.sql`
3. Paste and click **RUN**

### Step 3: Start Your App
```bash
npm run dev
```

Login with any demo account:
- **Email**: `demo@budgetbuddy.com` | **Password**: `Demo@1234`
- **Email**: `alex@budgetbuddy.com` | **Password**: `Alex@1234`
- **Email**: `test@budgetbuddy.com` | **Password**: `Test@1234`
- **Email**: `admin@budgetbuddy.com` | **Password**: `Admin@1234`

---

## 📊 What This Does

### Database Structure

```
┌─────────────────────────┐
│  user_credentials       │  ← New table for login
├─────────────────────────┤
│ email                   │
│ password                │  ⚠️ Plain text (demo only!)
│ name                    │
│ is_demo                 │
└─────────────────────────┘
         │
         │ (Login checks this first)
         │
         ▼
┌─────────────────────────┐
│  Supabase Auth          │  ← Created on first login
├─────────────────────────┤
│ (encrypted password)    │
└─────────────────────────┘
         │
         │ (Session management)
         │
         ▼
┌─────────────────────────┐
│  profiles + data        │  ← User's actual data
└─────────────────────────┘
```

### How It Works

1. **User enters email/password** on login page
2. **System checks** `user_credentials` table
3. **If valid**, creates/signs in to Supabase Auth
4. **Session created**, user can access their data

---

## 🔍 View Stored Credentials

Run this in SQL Editor to see all demo accounts:

```sql
SELECT 
  email,
  password,
  name,
  is_demo
FROM public.user_credentials
ORDER BY email;
```

---

## ➕ Add More Demo Users

Run this SQL to add more accounts:

```sql
INSERT INTO public.user_credentials (email, password, name, is_demo) VALUES
('john@budgetbuddy.com', 'John@1234', 'John Doe', true),
('sarah@budgetbuddy.com', 'Sarah@1234', 'Sarah Smith', true)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  name = EXCLUDED.name;
```

---

## 🔄 How Hybrid Authentication Works

### Login Process:

```typescript
// 1. User submits login form
loginWithStoredCredentials(email, password)

// 2. Check if credentials exist in database
SELECT * FROM user_credentials 
WHERE email = ? AND password = ?

// 3. If valid, try Supabase Auth login
supabase.auth.signInWithPassword({ email, password })

// 4. If no Supabase user exists, create one
supabase.auth.signUp({ email, password })

// 5. User is now authenticated!
```

### Signup Process:

```typescript
// 1. User submits signup form
registerWithStoredCredentials(name, email, password)

// 2. Create Supabase Auth user
supabase.auth.signUp({ email, password })

// 3. Store credentials in database
INSERT INTO user_credentials (email, password, name)

// 4. User can now login!
```

---

## 📝 Code Integration

Your app now uses these files:

### 1. `src/lib/auth-hybrid.ts`
Contains functions:
- `getDemoCredentials()` - Fetch all demo accounts
- `checkCredentials()` - Validate email/password
- `loginWithStoredCredentials()` - Login with DB check
- `registerWithStoredCredentials()` - Register new user
- `getAvailableDemoAccounts()` - List all demos

### 2. `src/context/AuthContext.tsx` (Updated)
Now uses hybrid authentication:
```typescript
login(email, password) → loginWithStoredCredentials()
signup(name, email, password) → registerWithStoredCredentials()
```

---

## 🧪 Testing

### Test Login
1. Start app: `npm run dev`
2. Go to login page
3. Enter: `demo@budgetbuddy.com` / `Demo@1234`
4. Should login successfully

### Test Signup
1. Go to signup page
2. Create new account with any email/password
3. Credentials automatically stored
4. Can login with new account

### View in Database
```sql
-- See all credentials
SELECT * FROM user_credentials;

-- See all Supabase auth users
SELECT * FROM auth.users;
```

---

## 🔒 Security Notes

### ⚠️ Important Warnings

1. **Plain Text Passwords**: This system stores passwords in plain text for DEMO purposes only
2. **Production Use**: Never store plain text passwords in production
3. **Recommended**: Use only Supabase Auth for production apps

### Why This Approach?

This is useful for:
- ✅ Demo/testing environments
- ✅ Development without email verification
- ✅ Quick prototyping
- ✅ Client presentations

### Production Alternative

For production, remove the `user_credentials` table and use only:
```typescript
// Direct Supabase Auth (secure)
await supabase.auth.signInWithPassword({ email, password });
```

---

## 🎯 Common Use Cases

### 1. Add Test Users for QA
```sql
INSERT INTO user_credentials (email, password, name, is_demo) VALUES
('qa1@test.com', 'Test@1234', 'QA Tester 1', true),
('qa2@test.com', 'Test@1234', 'QA Tester 2', true);
```

### 2. Share Demo Account with Client
```sql
INSERT INTO user_credentials (email, password, name, is_demo) VALUES
('client@demo.com', 'ClientDemo@2024', 'Demo Account', true);
```

### 3. Create Admin Account
```sql
INSERT INTO user_credentials (email, password, name, is_demo) VALUES
('admin@myapp.com', 'SecureAdminPass@123', 'Admin User', false);
```

---

## 📊 Database Queries

### Count Total Users
```sql
SELECT COUNT(*) as total_users FROM user_credentials;
```

### List Demo vs Real Users
```sql
SELECT 
  is_demo,
  COUNT(*) as count
FROM user_credentials
GROUP BY is_demo;
```

### Find User by Email
```sql
SELECT * FROM user_credentials 
WHERE email = 'demo@budgetbuddy.com';
```

### Update Password
```sql
UPDATE user_credentials 
SET password = 'NewPassword@123' 
WHERE email = 'demo@budgetbuddy.com';
```

### Delete User
```sql
DELETE FROM user_credentials 
WHERE email = 'old@account.com';
```

---

## 🐛 Troubleshooting

### "Invalid email or password"
- Check credentials exist: `SELECT * FROM user_credentials WHERE email = '...'`
- Verify exact email and password match

### "User already exists" on signup
- Email already in `user_credentials` table
- Use different email or delete existing record

### Can't login after adding credential
- Make sure `is_demo` is `true`
- Verify no typos in email/password
- Check RLS policy allows SELECT

---

## ✅ Verification Checklist

- [ ] `supabase-schema.sql` executed successfully
- [ ] `supabase-complete-with-demo-users.sql` executed
- [ ] Can see credentials: `SELECT * FROM user_credentials`
- [ ] Demo accounts listed (4 accounts)
- [ ] App starts without errors
- [ ] Can login with `demo@budgetbuddy.com`
- [ ] Can see user data after login

---

## 🎉 You're Done!

Your app now has database-stored credentials with these benefits:

✅ Easy demo account management  
✅ No email verification needed  
✅ Quick testing and development  
✅ Share credentials with team  
✅ View/edit users in SQL Editor  

**Start your app and login with any demo account!**

```bash
npm run dev
```

Login: `demo@budgetbuddy.com` / `Demo@1234`
