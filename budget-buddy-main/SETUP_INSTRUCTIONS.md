# 🚀 Complete Setup Instructions

## ⚡ Quick Start (2 SQL Scripts)

### Step 1: Run Main Database Schema
1. Open: https://fgsrxibdmkssywrpbxzv.supabase.co
2. Click **SQL Editor** → **New Query**
3. Copy ALL from `supabase-schema.sql`
4. Click **RUN**
5. ✅ Should see: "Success. No rows returned"

### Step 2: Add Demo Users
1. Click **New Query** again
2. Copy ALL from `supabase-complete-with-demo-users.sql`
3. Click **RUN**
4. ✅ Should see demo accounts listed

### Step 3: Start App & Login
```bash
npm run dev
```

**Login with:**
- Email: `demo@budgetbuddy.com`
- Password: `Demo@1234`

---

## 📋 What You Get

After setup, you can login with these accounts:

| Email | Password | Name |
|-------|----------|------|
| `demo@budgetbuddy.com` | `Demo@1234` | Demo User |
| `alex@budgetbuddy.com` | `Alex@1234` | Alex Johnson |
| `test@budgetbuddy.com` | `Test@1234` | Test User |
| `admin@budgetbuddy.com` | `Admin@1234` | Admin User |

---

## 📊 Optional: Add Dummy Data

Want sample expenses/income for testing? Run this:

1. **SQL Editor** → **New Query**
2. Copy from `supabase-instant-dummy-data.sql`
3. **RUN**

This adds:
- 21 realistic expenses
- 6 income records
- 9 budgets
- 7 notifications

**Note**: First login with a demo account, then run this script.

---

## 🗂️ File Reference

### Required Files (Run in order):
1. `supabase-schema.sql` - Database structure
2. `supabase-complete-with-demo-users.sql` - Demo accounts

### Optional Files:
- `supabase-instant-dummy-data.sql` - Sample data
- `supabase-add-credentials-table.sql` - Just credentials table
- `DATABASE_CREDENTIALS_SETUP.md` - Full documentation

---

## ✅ Verification

Check everything works:

```sql
-- 1. Check demo accounts exist
SELECT email, name FROM user_credentials;

-- 2. Check tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- 3. View table structure
SELECT * FROM profiles LIMIT 1;
```

---

## 🎯 That's It!

You're ready to go:
1. ✅ Database set up
2. ✅ Demo accounts ready
3. ✅ Start app and login!

```bash
npm run dev
```

**Login**: `demo@budgetbuddy.com` / `Demo@1234`
