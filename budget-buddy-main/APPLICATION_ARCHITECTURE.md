# 🏗️ Budget Buddy - Complete Application Architecture

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagram](#architecture-diagram)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [Expense Management Flow](#expense-management-flow)
7. [Income Management Flow](#income-management-flow)
8. [Budget System](#budget-system)
9. [Reports & Analytics](#reports--analytics)
10. [Data Flow](#data-flow)
11. [State Management](#state-management)
12. [API Layer](#api-layer)

---

## Overview

**Budget Buddy** is a full-stack expense tracking and budget management application built with modern web technologies. It allows users to:
- Track expenses and income
- Set and monitor budgets
- View analytics and reports
- Manage multiple payment methods
- Secure multi-user authentication


---

## Technology Stack

### Frontend
- **Framework**: React 19.2.0 with TypeScript
- **Router**: TanStack Router (File-based routing)
- **UI Library**: Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **State Management**: React Context API
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Server Framework**: TanStack Start (SSR)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **API**: Server Functions (@tanstack/react-start)

### Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Edge-ready (Cloudflare/Vercel compatible)
- **Storage**: Supabase Storage (for receipts)


---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER BROWSER                         │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Application (Frontend)              │  │
│  │                                                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │   Routes    │  │  Components │  │   Context    │  │  │
│  │  │   (Pages)   │  │  (UI Layer) │  │  (State)     │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘  │  │
│  │         │                 │                 │          │  │
│  │         └─────────────────┴─────────────────┘          │  │
│  │                          │                              │  │
│  │                          ▼                              │  │
│  │              ┌───────────────────────┐                 │  │
│  │              │   Supabase Client     │                 │  │
│  │              │   (supabase-js)       │                 │  │
│  │              └───────────┬───────────┘                 │  │
│  └──────────────────────────┼─────────────────────────────┘  │
└─────────────────────────────┼─────────────────────────────────┘
                              │
                              │ HTTPS/WebSocket
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                       SUPABASE PLATFORM                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ Auth Service │  │  PostgreSQL  │  │  Storage Service  │   │
│  │              │  │   Database   │  │   (Receipts)      │   │
│  │  - JWT       │  │              │  │                   │   │
│  │  - Sessions  │  │  - RLS       │  │  - File Upload    │   │
│  │  - Password  │  │  - Triggers  │  │  - CDN            │   │
│  └──────────────┘  └──────────────┘  └───────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                  Row Level Security (RLS)                 │ │
│  │       Ensures users only access their own data           │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```


---

## Database Schema

### Tables Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                         │
└─────────────────────────────────────────────────────────────┘

auth.users (Supabase Auth)
├── id (UUID, Primary Key)
├── email
├── encrypted_password
└── metadata

profiles
├── id (UUID, FK → auth.users.id)
├── name
├── email
├── avatar
├── password (plain text for demo)
├── created_at
└── updated_at

expenses
├── id (UUID, Primary Key)
├── user_id (FK → profiles.id)
├── title
├── amount (DECIMAL)
├── date
├── category
├── payment_method
├── merchant
├── location
├── currency
├── tags (ARRAY)
├── status
├── recurrence
├── receipt
├── deleted (BOOLEAN)
├── created_at
└── updated_at

income
├── id (UUID, Primary Key)
├── user_id (FK → profiles.id)
├── source
├── amount (DECIMAL)
├── date
├── category
├── currency
├── notes
├── created_at
└── updated_at

budgets
├── id (UUID, Primary Key)
├── user_id (FK → profiles.id)
├── category
├── limit_amount (DECIMAL)
├── created_at
└── updated_at

notifications
├── id (UUID, Primary Key)
├── user_id (FK → profiles.id)
├── type
├── title
├── message
├── read (BOOLEAN)
├── created_at
└── updated_at

settings
├── id (UUID, Primary Key)
├── user_id (FK → profiles.id)
├── currency
├── timezone
├── date_format
├── language
├── default_payment_method
├── default_category
├── created_at
└── updated_at

payment_methods
├── id (UUID, Primary Key)
├── user_id (FK → profiles.id)
├── name
└── created_at

user_credentials
├── id (UUID, Primary Key)
├── email (UNIQUE)
├── password (plain text)
├── name
├── is_demo (BOOLEAN)
├── created_at
└── updated_at
```


---

## Authentication Flow

### 1. User Signup Process

```
User fills signup form
    ↓
1. Validate input (name, email, password)
    ↓
2. Check password strength (min 6 chars)
    ↓
3. Supabase Auth creates user account
    ↓
4. Trigger: create profile in profiles table
    ↓
5. Trigger: create default settings
    ↓
6. Trigger: add all 15 payment methods
    ↓
7. Store credentials in user_credentials table
    ↓
8. Auto-login user
    ↓
9. Redirect to dashboard
```

**Code Flow:**
```typescript
// 1. User submits form
AuthContext.signup(name, email, password)
    ↓
// 2. Hybrid authentication
auth-hybrid.registerWithStoredCredentials()
    ↓
// 3. Create Supabase user
supabase.auth.signUp({ email, password, data: { name } })
    ↓
// 4. Store in credentials table
INSERT INTO user_credentials (email, password, name)
    ↓
// 5. Database triggers fire automatically
    ├─ profiles table entry created
    ├─ settings table entry created
    └─ payment_methods entries created (x15)
    ↓
// 6. User logged in with JWT token
```



### 2. User Login Process

```
User enters email & password
    ↓
1. Try Supabase Auth login (encrypted password)
    ↓
2. If fails, check user_credentials table
    ↓
3. If found, create/sync Supabase Auth user
    ↓
4. Generate JWT session token
    ↓
5. Load user profile from profiles table
    ↓
6. Set authentication context
    ↓
7. Redirect to dashboard
```

**Code Flow:**
```typescript
// 1. User submits login
AuthContext.login(email, password)
    ↓
// 2. Try Supabase Auth first
supabase.auth.signInWithPassword({ email, password })
    ↓
// 3. If fails, check stored credentials
SELECT * FROM user_credentials WHERE email = ? AND password = ?
    ↓
// 4. Load user profile
SELECT * FROM profiles WHERE id = user_id
    ↓
// 5. Set context state
setUser({ email, name, avatar })
    ↓
// 6. Navigate to app
router.navigate('/')
```

### 3. Session Management

```typescript
// Session is maintained via:
1. JWT token stored in browser
2. Supabase Auth manages refresh
3. Context tracks user state
4. Auto-logout on token expiry
```


---

## Expense Management Flow

### 1. Adding an Expense

```
User clicks "Add Expense"
    ↓
ExpenseDrawer opens
    ↓
User fills form:
├─ Title: "Grocery shopping"
├─ Amount: 127.45
├─ Date: 2024-01-15
├─ Category: "Food"
├─ Payment Method: "Credit Card"
├─ Merchant: "Whole Foods"
├─ Location: "Downtown"
├─ Currency: "USD"
├─ Tags: ["groceries", "weekly"]
├─ Status: "Paid"
├─ Recurrence: "Weekly"
└─ Receipt: [optional file]
    ↓
Click "Add expense"
    ↓
Validation:
├─ Title not empty?
├─ Amount > 0?
└─ All required fields filled?
    ↓
AppContext.addExpense(expense)
    ↓
Optimistic UI Update:
├─ Add to local state immediately
└─ Show in expense list (instant feedback)
    ↓
API Call to Supabase:
supabase.from('expenses').insert({
  user_id: currentUserId,
  title: "Grocery shopping",
  amount: 127.45,
  // ... other fields
})
    ↓
Database saves with triggers:
├─ Auto-generates UUID
├─ Sets created_at timestamp
└─ Sets updated_at timestamp
    ↓
Response returns with real ID
    ↓
Update local state with real ID
    ↓
Show success toast notification
    ↓
Close drawer
    ↓
Expense visible in list
```



### 2. Editing an Expense

```
User clicks edit icon on expense
    ↓
ExpenseDrawer opens with existing data
    ↓
User modifies fields
    ↓
Click "Save changes"
    ↓
AppContext.updateExpense(modifiedExpense)
    ↓
Optimistic UI Update:
└─ Update in local state immediately
    ↓
API Call:
supabase.from('expenses').update(data)
  .eq('id', expenseId)
  .eq('user_id', userId)  // RLS check
    ↓
Database updates with trigger:
└─ Auto-updates updated_at timestamp
    ↓
Show success toast
    ↓
Changes reflected in UI
```

### 3. Deleting an Expense

```
User clicks delete icon
    ↓
Confirmation dialog (optional)
    ↓
AppContext.deleteExpense(expenseId)
    ↓
Soft delete (deleted = true):
└─ Mark as deleted in local state
    ↓
API Call:
supabase.from('expenses').update({ deleted: true })
  .eq('id', expenseId)
  .eq('user_id', userId)
    ↓
Expense hidden from UI
└─ Can be recovered if needed
```



### 4. Expense Data Structure

```typescript
interface Expense {
  id: string;              // UUID from database
  title: string;           // "Grocery shopping"
  amount: number;          // 127.45 (stored as DECIMAL)
  date: string;            // "2024-01-15" (ISO format)
  category: string;        // "Food"
  paymentMethod: string;   // "Credit Card"
  merchant?: string;       // "Whole Foods"
  location?: string;       // "Downtown"
  currency: string;        // "USD"
  tags: string[];          // ["groceries", "weekly"]
  status: Status;          // "Paid" | "Pending" | "Cancelled"
  recurrence: Recurrence;  // "None" | "Daily" | "Weekly" | "Monthly"
  receipt?: string;        // File name or URL
  deleted?: boolean;       // Soft delete flag
}
```

### 5. Expense Categories

```typescript
Available categories:
├─ Food (icon: Utensils)
├─ Fuel (icon: Fuel)
├─ Rent (icon: Home)
├─ Shopping (icon: ShoppingBag)
├─ Entertainment (icon: Clapperboard)
├─ Healthcare (icon: HeartPulse)
├─ Education (icon: GraduationCap)
├─ Bills (icon: ReceiptText)
├─ Travel (icon: Plane)
└─ Other (icon: MoreHorizontal)
```


---

## Income Management Flow

### 1. Adding Income

```
User clicks "Add Income"
    ↓
IncomeDrawer opens
    ↓
User fills form:
├─ Source: "Monthly Salary"
├─ Amount: 5000.00
├─ Date: 2024-01-01
├─ Category: "Salary"
├─ Currency: "USD"
└─ Notes: "Company XYZ"
    ↓
Click "Add income"
    ↓
AppContext.addIncome(income)
    ↓
Optimistic UI update
    ↓
API Call:
supabase.from('income').insert({
  user_id: currentUserId,
  source: "Monthly Salary",
  amount: 5000.00,
  date: "2024-01-01",
  category: "Salary",
  currency: "USD",
  notes: "Company XYZ"
})
    ↓
Database saves with auto-generated ID
    ↓
Update local state with real ID
    ↓
Show in income list
    ↓
Update analytics calculations
```



### 2. Income Categories

```typescript
Available categories:
├─ Salary (icon: Briefcase)
├─ Freelance (icon: Laptop)
├─ Investment (icon: TrendingUp)
├─ Business (icon: Building2)
├─ Refund (icon: RotateCcw)
├─ Bonus (icon: Gift)
└─ Other (icon: MoreHorizontal)
```

### 3. Income Data Structure

```typescript
interface Income {
  id: string;           // UUID from database
  source: string;       // "Monthly Salary"
  amount: number;       // 5000.00
  date: string;         // "2024-01-01"
  category: string;     // "Salary"
  currency: string;     // "USD"
  notes?: string;       // Optional notes
}
```

---

## Budget System

### 1. Budget Creation & Management

```
User navigates to Budgets page
    ↓
Clicks "Set Budget" for a category
    ↓
Budget Dialog opens
    ↓
User selects:
├─ Category: "Food"
└─ Limit: 600.00
    ↓
Click "Save"
    ↓
AppContext.saveBudget(budget)
    ↓
Check if budget exists for category:
├─ Exists → Update existing budget
└─ New → Create new budget
    ↓
API Call:
supabase.from('budgets').upsert({
  user_id: currentUserId,
  category: "Food",
  limit_amount: 600.00
}, { onConflict: 'user_id,category' })
    ↓
Database saves/updates
    ↓
Budget visible in budgets list
```



### 2. Budget Tracking & Calculation

```
System continuously monitors spending:
    ↓
For each category with a budget:
    ↓
1. Get budget limit from budgets table
   SELECT limit_amount FROM budgets 
   WHERE user_id = ? AND category = ?
    ↓
2. Calculate total expenses for category
   SELECT SUM(amount) FROM expenses 
   WHERE user_id = ? 
     AND category = ? 
     AND deleted = false
     AND EXTRACT(MONTH FROM date) = CURRENT_MONTH
    ↓
3. Calculate usage percentage
   percentage = (total_spent / budget_limit) * 100
    ↓
4. Determine status:
   ├─ < 70% → Safe (green)
   ├─ 70-90% → Warning (yellow)
   ├─ 90-100% → Danger (orange)
   └─ > 100% → Over budget (red)
    ↓
5. Display in UI:
   ├─ Progress bar with color coding
   ├─ "Spent $X of $Y"
   └─ Remaining amount
    ↓
6. Trigger notifications if:
   ├─ 85% reached → "Budget warning"
   └─ 100% reached → "Budget exceeded"
```



### 3. Budget Calculation Example

```typescript
// Frontend calculation
function calculateBudgetUsage(category: string) {
  // 1. Get budget for category
  const budget = budgets.find(b => b.category === category);
  if (!budget) return null;
  
  // 2. Filter expenses for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(e => 
    e.category === category &&
    !e.deleted &&
    new Date(e.date).getMonth() === currentMonth &&
    new Date(e.date).getFullYear() === currentYear
  );
  
  // 3. Calculate total spent
  const totalSpent = monthlyExpenses.reduce(
    (sum, e) => sum + e.amount, 
    0
  );
  
  // 4. Calculate percentage
  const percentage = (totalSpent / budget.limit) * 100;
  
  // 5. Calculate remaining
  const remaining = budget.limit - totalSpent;
  
  return {
    limit: budget.limit,
    spent: totalSpent,
    remaining: remaining,
    percentage: percentage,
    status: getStatus(percentage)
  };
}

function getStatus(percentage: number) {
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 90) return 'danger';
  if (percentage >= 70) return 'warning';
  return 'safe';
}
```

