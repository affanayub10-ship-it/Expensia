# ⚡ Quick Start - Supabase Integration

## 3 Simple Steps to Get Running

### 1️⃣ Run SQL Schema (2 minutes)

1. Go to: https://fgsrxibdmkssywrpbxzv.supabase.co
2. Click **SQL Editor** → **New Query**
3. Copy all content from `supabase-schema.sql`
4. Paste and click **RUN**

### 2️⃣ Migrate Data (1 minute)

```bash
cd budget-buddy-main
npm run migrate
```

### 3️⃣ Start App

```bash
npm run dev
```

Login with:
- **Email**: `affanayub5@gmail.com`
- **Password**: `Test@1234`

---

## ✅ That's It!

Your app is now connected to Supabase with all your data migrated.

## 📁 Important Files

- `supabase-schema.sql` - Database structure (run in Supabase)
- `.env` - Your API keys (already configured)
- `src/lib/supabase-db.ts` - All database operations
- `src/context/AuthContext.tsx` - Authentication logic
- `MIGRATION_GUIDE.md` - Detailed documentation

## 🆘 Issues?

**Error: "relation does not exist"**
→ Run the SQL schema first (Step 1)

**Error: "Not authenticated"**  
→ Make sure you're logged in

**No data showing**
→ Run migration script (Step 2)

---

## 🎯 What You Got

- ✅ Real PostgreSQL database
- ✅ User authentication  
- ✅ Secure data storage
- ✅ Multi-user support
- ✅ All data migrated

## 📚 Full Docs

- `SUPABASE_COMPLETE.md` - Complete integration details
- `MIGRATION_GUIDE.md` - Migration walkthrough
- `SUPABASE_SETUP.md` - Setup instructions

---

**Ready? Start with Step 1!** 🚀
