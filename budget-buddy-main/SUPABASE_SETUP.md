# 🚀 Supabase Integration Guide for Budget Buddy

This guide will help you integrate Supabase as your database for the Budget Buddy application.

## 📋 Prerequisites

- A Supabase account ([Sign up here](https://supabase.com))
- Node.js installed on your machine
- Basic understanding of React and TypeScript

## 🔧 Step 1: Install Dependencies

Install the Supabase client library:

```bash
npm install @supabase/supabase-js
```

## 🗄️ Step 2: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in your project details:
   - Project name: `budget-buddy`
   - Database password: (choose a strong password)
   - Region: (select closest to your users)
4. Click **"Create new project"** and wait for setup to complete

## 📊 Step 3: Run SQL Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste into the SQL editor
5. Click **"Run"** to execute the schema

This will create:
- ✅ All necessary tables (expenses, income, budgets, notifications, etc.)
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Automatic triggers for timestamps
- ✅ User profile creation on signup

## 🔑 Step 4: Get Your API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Find these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ⚙️ Step 5: Configure Environment Variables

1. Create a `.env` file in the root of your project:

```bash
cp .env.example .env
```

2. Open `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

⚠️ **Important**: Never commit `.env` to version control. It's already in `.gitignore`.

## 🔄 Step 6: Update Your Code

### A. Update AuthContext to use Supabase Auth

Replace the content of `src/context/AuthContext.tsx` with Supabase authentication:

```typescript
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUserProfile(userId: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profile) {
      setUser({
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar || undefined,
      });
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  async function signup(name: string, email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  async function updateUser(name: string, email: string) {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return { success: false, error: "Not authenticated" };

    const { error } = await supabase
      .from("profiles")
      .update({ name, email })
      .eq("id", authUser.id);

    if (error) {
      return { success: false, error: error.message };
    }

    setUser({ email, name, avatar: user?.avatar });
    return { success: true };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        resetPassword,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
```

### B. Update db-server.ts to use Supabase

Replace database operations with Supabase queries. The file is already created at `src/lib/supabase.ts`.

## 🧪 Step 7: Test Your Integration

1. Start your development server:
```bash
npm run dev
```

2. Try to:
   - ✅ Sign up a new user
   - ✅ Log in with the user
   - ✅ Add an expense
   - ✅ Add income
   - ✅ Create a budget
   - ✅ Check notifications

## 🔒 Security Features

Your database is protected with:

- **Row Level Security (RLS)**: Users can only access their own data
- **Authentication**: Supabase Auth handles secure user sessions
- **Automatic user profiles**: Created on signup via database trigger
- **Data isolation**: Each user's data is completely separate

## 📚 Database Structure

Your database includes:

| Table | Description |
|-------|-------------|
| `profiles` | User profile information |
| `expenses` | All expense transactions |
| `income` | Income records |
| `budgets` | Budget limits by category |
| `notifications` | User notifications |
| `settings` | User preferences |
| `payment_methods` | Custom payment methods |

## 🎨 Optional: Enable Email Authentication

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates under **Email Templates**

## 🔗 Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## ❓ Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure `.env` file exists and contains valid values.

### Issue: "Row Level Security policy violation"
**Solution**: Ensure you're logged in and RLS policies are correctly applied.

### Issue: "Table does not exist"
**Solution**: Run the `supabase-schema.sql` in SQL Editor again.

## 🎉 You're Done!

Your Budget Buddy app is now connected to Supabase! Users can sign up, log in, and all their financial data will be securely stored in your Supabase database.
