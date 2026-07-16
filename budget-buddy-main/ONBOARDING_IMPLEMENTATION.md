# Onboarding Implementation Guide

## Overview

This document describes the onboarding feature that has been added to the Budget Buddy expense management system. The onboarding page collects income information from new users and saves it to the database.

## Changes Made

### 1. Database Schema Updates

#### New Column Added to `profiles` Table
- **Column Name**: `onboarding_complete`
- **Type**: `BOOLEAN`
- **Default**: `FALSE`
- **Purpose**: Tracks whether a user has completed the onboarding process

**Migration File**: `supabase-add-onboarding-column.sql`

To apply this migration in Supabase:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-add-onboarding-column.sql`
4. Execute the query

### 2. Authentication Context Updates

**File**: `src/context/AuthContext.tsx`

#### New Properties Added to `AuthUser` Interface
```typescript
onboardingComplete?: boolean;
```

#### New Properties Added to `AuthContextValue` Interface
```typescript
onboardingComplete: boolean;
completeOnboarding: () => Promise<{ success: boolean; error?: string }>;
```

#### New State Variable
```typescript
const [onboardingComplete, setOnboardingComplete] = useState(false);
```

#### New Method: `completeOnboarding()`
- Updates the user's profile in the database to set `onboarding_complete = true`
- Updates the local auth state
- Returns success/error status

#### Updated `loadUserProfile()` Function
- Now loads the `onboarding_complete` status from the database
- Sets both the user state and `onboardingComplete` state

### 3. Login/Signup Flow Updates

**File**: `src/routes/login.tsx`

#### Signup Redirect Change
- **Before**: New users were redirected to `/` (dashboard)
- **After**: New users are redirected to `/onboarding`

This ensures all new users see the onboarding page before accessing the dashboard.

### 4. Onboarding Page Updates

**File**: `src/routes/onboarding.tsx`

#### Updated `handleCompleteOnboarding()` Function
- Now calls `completeOnboarding()` from the auth context
- Updates the database with onboarding completion status
- Removes reliance on localStorage

#### Updated `handleSkip()` Function
- Now calls `completeOnboarding()` to mark onboarding as complete
- Users can skip adding income but still complete onboarding
- Ensures the flag is set in the database

#### Updated Component Imports
- Added `completeOnboarding` to the `useAuth()` hook

### 5. App Layout Global Redirect

**File**: `src/components/layout/AppLayout.tsx`

#### New Onboarding Check
```typescript
// Redirect to onboarding if user hasn't completed it (except on login/onboarding pages)
if (isAuthenticated && !onboardingComplete && !isLoginPage && !isOnboardingPage) {
  setTimeout(() => navigate({ to: "/onboarding" }), 0);
  return null;
}
```

This ensures:
- Any authenticated user who hasn't completed onboarding is redirected to `/onboarding`
- Users cannot bypass onboarding by directly accessing other routes
- The check is skipped on login and onboarding pages to avoid redirect loops

## User Flow

### For New Users (Sign Up)
1. User fills out signup form (name, email, password)
2. Account is created in Supabase
3. User is redirected to `/onboarding`
4. Onboarding page displays welcome screen with features
5. User clicks "Get Started" or "Skip for now"
6. If "Get Started": User adds income sources (optional but recommended)
7. User clicks "Complete Setup" or "Skip for now"
8. `completeOnboarding()` is called, setting `onboarding_complete = true`
9. User is redirected to dashboard `/`
10. All subsequent logins show the dashboard directly

### For Existing Users (Login)
1. User logs in with email and password
2. `onboarding_complete` status is loaded from database
3. If `true`: User goes directly to dashboard
4. If `false`: User is redirected to onboarding page

## Income Data Persistence

The onboarding page collects income information which is saved to the `income` table:
- **Source**: Income source name (e.g., "Monthly salary")
- **Amount**: Income amount
- **Category**: Income category (Salary, Freelance, Investment, etc.)
- **Recurrence**: Frequency (One-time, Daily, Weekly, Monthly, Yearly)
- **Currency**: Currency type
- **Date**: Start date of income
- **Notes**: Optional notes

All income data is saved through the existing `addIncome()` function in AppContext, which persists to Supabase.

## Database Queries

### Check if User Completed Onboarding
```sql
SELECT onboarding_complete FROM profiles WHERE id = user_id;
```

### Mark User as Completed Onboarding
```sql
UPDATE profiles SET onboarding_complete = true WHERE id = user_id;
```

## Testing the Feature

### Test Case 1: New User Signup
1. Create a new account
2. Verify you're redirected to `/onboarding`
3. Add income sources and complete setup
4. Verify you're redirected to dashboard
5. Log out and log back in
6. Verify you go directly to dashboard (no onboarding)

### Test Case 2: Skip Onboarding
1. Create a new account
2. On onboarding page, click "Skip for now"
3. Verify you're redirected to dashboard
4. Log out and log back in
5. Verify you go directly to dashboard

### Test Case 3: Existing User
1. Log in with an existing account that has `onboarding_complete = true`
2. Verify you go directly to dashboard
3. Verify no onboarding redirect

### Test Case 4: Direct Route Access
1. Create a new account (not completed onboarding)
2. Try to access `/expenses`, `/income`, `/budgets`, etc. directly
3. Verify you're redirected to `/onboarding`

## Rollback Instructions

If you need to revert these changes:

1. **Remove Database Column** (Optional, can keep for future use):
   ```sql
   ALTER TABLE public.profiles DROP COLUMN onboarding_complete;
   ```

2. **Revert Code Changes**:
   - Restore original `src/context/AuthContext.tsx`
   - Restore original `src/routes/login.tsx` (change redirect back to `/`)
   - Restore original `src/routes/onboarding.tsx` (remove `completeOnboarding` call)
   - Restore original `src/components/layout/AppLayout.tsx` (remove onboarding check)

## Future Enhancements

Possible improvements to the onboarding system:
- Add progress indicators for multi-step onboarding
- Collect additional user preferences (budget categories, payment methods)
- Add email verification step
- Add tutorial/walkthrough for dashboard features
- Add analytics to track onboarding completion rates
- Allow users to re-enter onboarding from settings

## Support

For issues or questions about the onboarding implementation, refer to:
- `src/routes/onboarding.tsx` - Onboarding page component
- `src/context/AuthContext.tsx` - Authentication and onboarding status management
- `src/components/layout/AppLayout.tsx` - Global routing logic
