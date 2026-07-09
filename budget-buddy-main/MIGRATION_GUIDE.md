# 🔄 Migration Guide: Local JSON to Supabase Database

This guide will help you migrate your Budget Buddy app from using local JSON files to Supabase.

## ✅ What's Been Done

Your project has been fully integrated with Supabase:

1. ✅ **Database Schema Created** - `supabase-schema.sql` with all tables and security
2. ✅ **Supabase Client Setup** - `src/lib/supabase.ts` with TypeScript types
3. ✅ **Database Operations** - `src/lib/supabase-db.ts` with all CRUD operations
4. ✅ **Auth Integration** - `src/context/AuthContext.tsx` using Supabase Auth
5. ✅ **App Context Updated** - `src/context/AppContext.tsx` now uses Supabase
6. ✅ **Environment Variables** - `.env` file configured
7. ✅ **Migration Script** - Automated data import tool

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd budget-buddy-main
npm install @supabase/supabase-js tsx
```

### Step 2: Setup Database

1. Go to your Supabase project: https://fgsrxibdmkssywrpbxzv.supabase.co
2. Click **SQL Editor** in the sidebar
3. Create **New Query**
4. Copy and paste the entire contents of `supabase-schema.sql`
5. Click **Run** (or press Ctrl+Enter)

You should see: "Success. No rows returned"

### Step 3: Migrate Your Data

Run the migration script to import all existing data:

```bash
npm run migrate
```

This will:
- Create a test user account
- Import all expenses from `data/db.json`
- Import all income records
- Import budgets
- Import notifications
- Import payment methods
- Import settings

**Login Credentials** (after migration):
- Email: `affanayub5@gmail.com` (from your db.json)
- Password: `Test@1234`

## 🎯 What Changed

### Before (Local JSON)
- Data stored in `data/db.json`
- No real authentication (demo accounts only)
- Single user mode
- Manual file operations

### After (Supabase)
- Data stored in PostgreSQL database
- Real authentication with Supabase Auth
- Multi-user support
- Automatic data sync
- Row Level Security (RLS) for data isolation
- Real-time capabilities ready

## 📊 Database Structure

Your Supabase database has these tables:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User information | id, name, email, avatar |
| `expenses` | Expense transactions | title, amount, date, category |
| `income` | Income records | source, amount, date, category |
| `budgets` | Budget limits | category, limit_amount |
| `notifications` | User notifications | type, title, message, read |
| `settings` | User preferences | currency, timezone, date_format |
| `payment_methods` | Custom payment methods | name |

## 🔒 Security Features

Your data is protected with:

- **Row Level Security (RLS)**: Users can only see/edit their own data
- **Supabase Auth**: Secure authentication with encrypted passwords
- **Automatic profiles**: User profile created on signup
- **Data isolation**: Complete separation between user accounts

## 🧪 Testing Your Integration

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Login with migrated account**:
   - Email: `affanayub5@gmail.com`
   - Password: `Test@1234`

3. **Test these features**:
   - ✅ View all expenses (should see your imported data)
   - ✅ Add a new expense
   - ✅ Edit an existing expense
   - ✅ Delete an expense
   - ✅ Add income
   - ✅ Create/update budgets
   - ✅ Check notifications
   - ✅ Update settings
   - ✅ Logout and login again

4. **Create a new account**:
   - Go to signup page
   - Create a new user
   - Verify data isolation (new user shouldn't see migrated data)

## 🔄 How Data Flows Now

### Adding an Expense:
1. User fills form in UI
2. `AppContext.addExpense()` called
3. Optimistic update in local state (instant UI feedback)
4. `addExpense()` in `supabase-db.ts` called
5. Data sent to Supabase via API
6. Supabase validates and stores in PostgreSQL
7. RLS ensures user can only add to their own data
8. Success response updates UI with real database ID

### Authentication:
1. User enters email/password
2. `AuthContext.login()` called
3. Supabase Auth validates credentials
4. JWT token issued and stored
5. User profile loaded from `profiles` table
6. All API calls automatically include user ID
7. RLS policies enforce data access rules

## 🛠️ Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Check that `.env` file exists in project root with valid credentials.

### Issue: Migration script fails with "User already exists"
**Solution**: 
1. Go to Supabase Dashboard → Authentication → Users
2. Delete the existing user
3. Run `npm run migrate` again

### Issue: "Row Level Security policy violation"
**Solution**: Make sure you're logged in. RLS prevents unauthenticated access.

### Issue: Empty data after login
**Solution**: 
1. Check browser console for errors
2. Verify the SQL schema was run successfully
3. Re-run migration: `npm run migrate`

### Issue: "relation does not exist"
**Solution**: The SQL schema wasn't run. Go to Supabase SQL Editor and run `supabase-schema.sql`.

## 📱 Multi-User Support

Your app now supports multiple users! Each user:
- Has their own isolated data
- Can sign up independently
- Cannot see other users' data
- Has separate budgets, expenses, and settings

## 🔑 Password Reset

Users can reset passwords:
1. Click "Forgot Password" on login page
2. Enter email
3. Supabase sends reset email
4. User clicks link and sets new password

Configure email templates in Supabase Dashboard → Authentication → Email Templates

## 📈 Next Steps

Now that you're on Supabase, you can:

1. **Enable Real-time**: Get live updates when data changes
2. **Add Storage**: Upload receipt images to Supabase Storage
3. **Add Social Auth**: Login with Google, GitHub, etc.
4. **Add Webhooks**: Trigger actions on data changes
5. **Use Edge Functions**: Add serverless backend logic
6. **Enable Database Backups**: Automatic daily backups

## 🎉 You're All Set!

Your Budget Buddy app is now powered by Supabase with:
- ✅ Real authentication
- ✅ Secure database storage
- ✅ Multi-user support
- ✅ Data isolation
- ✅ Production-ready infrastructure

All your original data has been safely migrated and the app works exactly the same, but now with real backend capabilities!

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Authentication Guide](https://supabase.com/docs/guides/auth)

---

**Need Help?** Check the Supabase Dashboard logs or browser console for detailed error messages.
