# Password Reset Security Fix

## Issue
When users clicked the password reset link from their email, they were taken to the `/reset-password` page, but the sidebar and navigation were still visible on the left side. This created a security issue where users could navigate away from the password reset page and access other features without completing the password reset.

## Root Cause
The `AppLayout.tsx` component was only checking for `/login` and `/onboarding` pages to render without the sidebar/navigation. The `/reset-password` page was not included in this check, so it rendered with the full app layout including sidebar and navigation.

## Solution
Updated `AppLayout.tsx` to treat `/reset-password` the same way as `/login` and `/onboarding`:

### Changes Made:

1. **Added reset password page detection**:
```typescript
const isResetPasswordPage = pathname === "/reset-password";
```

2. **Updated authentication redirect logic**:
```typescript
if (!isAuthenticated && !isLoginPage && !isOnboardingPage && !isResetPasswordPage) {
  setTimeout(() => navigate({ to: "/login" }), 0);
  return null;
}
```

3. **Updated onboarding redirect logic**:
```typescript
if (isAuthenticated && !onboardingComplete && !isLoginPage && !isOnboardingPage && !isResetPasswordPage) {
  setTimeout(() => navigate({ to: "/onboarding" }), 0);
  return null;
}
```

4. **Updated render condition to exclude layout**:
```typescript
if (isLoginPage || isOnboardingPage || isResetPasswordPage) return <>{children}</>;
```

## Result
Now when users visit the `/reset-password` page:
- ✅ NO sidebar visible
- ✅ NO navigation menu
- ✅ NO ability to navigate to other pages
- ✅ Clean, focused password reset experience
- ✅ Users must complete or cancel the password reset

## Testing
1. Click password reset link from email
2. Verify NO sidebar is visible
3. Verify NO navigation options available
4. Verify users stay on the reset page until they complete or cancel
5. After successful reset, users are redirected to login

## Security Benefit
Users can no longer bypass the password reset process by navigating to other parts of the app. This ensures:
- Password reset must be completed or explicitly cancelled
- No unauthorized access to features during reset flow
- Better user experience with focused UI
- Reduced confusion about the password reset process

## Files Modified
- `src/components/layout/AppLayout.tsx`

## Commit
`e38f4e2` - "fix: hide sidebar and navigation on password reset page"
