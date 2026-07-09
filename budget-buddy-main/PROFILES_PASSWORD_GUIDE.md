# 📋 Profiles Table Password Storage

## ✅ Complete Setup

Your profiles table now stores passwords for complete user record keeping!

---

## 🚀 Quick Setup

### Step 1: Add Password Column to Profiles

Run this SQL in Supabase SQL Editor:

**File:** `supabase-add-password-to-profiles.sql`

This will:
- ✅ Add `password` column to profiles table
- ✅ Sync existing passwords from user_credentials
- ✅ Create auto-sync triggers
- ✅ Keep everything in sync automatically

### Step 2: Restart Your App

```bash
npm run dev
```

Now all password operations update profiles table too!

---

## 📊 Database Structure

### Before
```
profiles                 user_credentials
├── id                   ├── email
├── name                 ├── password ✓
├── email                └── name
└── avatar
```

### After
```
profiles                 user_credentials
├── id                   ├── email
├── name                 ├── password ✓
├── email                └── name
├── password ✓ (NEW!)
└── avatar
```

---

## 🔄 Auto-Sync Features

Passwords are automatically synced in these scenarios:

### 1. User Signs Up
```
Create account
    ↓
Supabase Auth (encrypted)
    ↓
user_credentials (plain text)
    ↓
profiles (plain text) ✓
```

### 2. User Changes Password
```
Settings → Change Password
    ↓
Supabase Auth updated
    ↓
user_credentials updated
    ↓
profiles updated ✓ (Auto-trigger)
```

### 3. Direct Database Update
```sql
UPDATE user_credentials 
SET password = 'NewPass' 
WHERE email = 'user@email.com';

-- Automatically triggers:
UPDATE profiles 
SET password = 'NewPass' 
WHERE email = 'user@email.com';
```

---

## 🔍 View User Credentials

### Quick View All Users

Run: `supabase-view-all-credentials.sql`

Or run this query:

```sql
SELECT 
  email,
  password,
  name,
  created_at
FROM public.profiles
ORDER BY created_at DESC;
```

### View Specific User

```sql
SELECT 
  email,
  password,
  name,
  id as user_id
FROM public.profiles
WHERE email = 'demo@budgetbuddy.com';
```

### Check Sync Status

```sql
SELECT 
  p.email,
  p.password as profile_password,
  uc.password as credentials_password,
  CASE 
    WHEN p.password = uc.password THEN '✅ Synced'
    ELSE '❌ Out of sync'
  END as status
FROM public.profiles p
LEFT JOIN public.user_credentials uc ON p.email = uc.email;
```

---

## 📝 Common Operations

### Get User Password

```sql
SELECT password 
FROM public.profiles 
WHERE email = 'user@example.com';
```

### Update User Password

```sql
-- This updates all three places automatically!
UPDATE public.user_credentials 
SET password = 'NewPassword@123' 
WHERE email = 'user@example.com';

-- Profiles table is auto-updated by trigger ✓
```

### Find Users Without Passwords

```sql
SELECT email, name 
FROM public.profiles 
WHERE password IS NULL;
```

### Search by Name

```sql
SELECT email, password, name 
FROM public.profiles 
WHERE name ILIKE '%john%';
```

### Count Total Users

```sql
SELECT COUNT(*) as total_users 
FROM public.profiles;
```

### List All Demo Accounts

```sql
SELECT 
  p.email,
  p.password,
  p.name
FROM public.profiles p
INNER JOIN public.user_credentials uc ON p.email = uc.email
WHERE uc.is_demo = true;
```

---

## 🎯 Benefits

### 1. Complete User Records
- All user info in one table
- Easy to query and export
- Simple backup and restore

### 2. Easy Access
```sql
-- Get everything in one query
SELECT * FROM profiles WHERE email = 'user@email.com';

-- No need to join multiple tables!
```

### 3. Better Reporting
```sql
-- Export all users with passwords
SELECT email, password, name, created_at 
FROM profiles 
ORDER BY created_at;
```

### 4. Auto-Sync
- Never out of sync
- Triggers handle it automatically
- Update once, syncs everywhere

---

## 🔒 Security Considerations

### Development/Demo

✅ **Good for:**
- Development environments
- Testing and QA
- Demo accounts
- Internal tools

### Production

⚠️ **Consider:**
- Remove password from profiles
- Use only Supabase Auth (encrypted)
- Or encrypt passwords in profiles too

**Production Alternative:**

```sql
-- Remove password column
ALTER TABLE profiles DROP COLUMN password;

-- Or encrypt it
-- Use pgcrypto extension for encryption
```

---

## 🧪 Testing

### Test Password Storage

1. **Create new account**:
   - Email: `test@example.com`
   - Password: `Test@1234`

2. **Check it's stored**:
   ```sql
   SELECT email, password, name 
   FROM profiles 
   WHERE email = 'test@example.com';
   ```
   Should show: `Test@1234`

3. **Change password** in app settings

4. **Verify it updated**:
   ```sql
   SELECT password 
   FROM profiles 
   WHERE email = 'test@example.com';
   ```
   Should show new password!

### Test Auto-Sync

```sql
-- Update in credentials table
UPDATE user_credentials 
SET password = 'AutoSync@Test' 
WHERE email = 'demo@budgetbuddy.com';

-- Check profiles table (should auto-update)
SELECT password 
FROM profiles 
WHERE email = 'demo@budgetbuddy.com';
-- Should show: AutoSync@Test
```

---

## 📊 Export User Credentials

### CSV Export

```sql
COPY (
  SELECT email, password, name, created_at 
  FROM profiles 
  ORDER BY created_at
) TO '/tmp/users.csv' WITH CSV HEADER;
```

### JSON Export

```sql
SELECT json_agg(row_to_json(t)) 
FROM (
  SELECT email, password, name, created_at 
  FROM profiles
) t;
```

---

## 🛠️ Maintenance

### Sync Missing Passwords

If some users don't have passwords in profiles:

```sql
-- Sync from user_credentials
UPDATE profiles p
SET password = uc.password
FROM user_credentials uc
WHERE p.email = uc.email
  AND p.password IS NULL;
```

### Find Out-of-Sync Records

```sql
SELECT 
  p.email,
  p.password as profile_pass,
  uc.password as cred_pass
FROM profiles p
INNER JOIN user_credentials uc ON p.email = uc.email
WHERE p.password != uc.password;
```

### Fix Out-of-Sync

```sql
-- Use credentials table as source of truth
UPDATE profiles p
SET password = uc.password
FROM user_credentials uc
WHERE p.email = uc.email
  AND p.password != uc.password;
```

---

## 📱 Access from Application

### Get User with Password

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('email, password, name')
  .eq('email', 'user@example.com')
  .single();

console.log(profile.password); // Direct access!
```

### List All Users

```typescript
const { data: users } = await supabase
  .from('profiles')
  .select('email, password, name')
  .order('created_at', { ascending: false });
```

---

## ✨ Summary

Your profiles table now has complete user records including passwords:

✅ **Auto-syncs** on signup  
✅ **Auto-syncs** on password change  
✅ **Auto-syncs** on direct update  
✅ **Easy to query** - all data in one place  
✅ **Simple exports** - CSV, JSON, etc.  
✅ **Triggers handle** everything automatically  

---

## 🎉 You're Done!

Run the setup SQL and everything works automatically:

```bash
# 1. Run this SQL file
supabase-add-password-to-profiles.sql

# 2. Restart app
npm run dev

# 3. Check it works
supabase-view-all-credentials.sql
```

All password operations now update the profiles table! 🚀
