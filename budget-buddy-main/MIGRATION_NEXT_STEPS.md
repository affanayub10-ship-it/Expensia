# Migration to React Router - Remaining Steps

## ✅ Completed
1. Created new branch: `migrate-to-react-router`
2. Updated package.json (removed TanStack, added react-router-dom)
3. Created new vite.config.ts (simple Vite + React)
4. Created index.html
5. Created src/main.tsx (entry point)
6. Created src/App.tsx (router setup with all 17 routes)

## 🚧 Next Steps (In Order)

### STEP 1: Install Dependencies (5 min)
```bash
cd budget-buddy-main
npm install
```

This will fail initially due to missing page files. That's expected.

### STEP 2: Update AppLayout (15 min)
File: `src/components/layout/AppLayout.tsx`

**Find and replace:**
```tsx
// OLD
import { Link, useRouterState, useNavigate } from "@tanstack/react-router"

// NEW
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
```

**Update active link detection:**
```tsx
// OLD
const router = useRouterState()
const pathname = router.location.pathname

// NEW
const location = useLocation()
const pathname = location.pathname
```

**Add Outlet at the end:**
```tsx
// At the end of AppLayout component, add:
return (
  <div className="flex h-screen">
    {/* existing sidebar/header code */}
    <main className="flex-1 overflow-auto">
      <Outlet />  {/* ADD THIS */}
    </main>
  </div>
)
```

### STEP 3: Create Pages Folder (2 min)
```bash
mkdir src/pages
```

### STEP 4: Convert Each Route to Page Component (2-3 hours)

For EACH file in `src/routes/*.tsx` (except `__root.tsx` and `README.md`):

**Example: Converting `src/routes/login.tsx` → `src/pages/Login.tsx`**

1. Copy the file
2. Remove TanStack Router imports:
   ```tsx
   // REMOVE
   import { createFileRoute } from "@tanstack/react-router"
   export const Route = createFileRoute('/login')({ component: LoginPage })
   ```

3. Change to default export:
   ```tsx
   // ADD
   export default function LoginPage() {
     // existing component code
   }
   ```

4. Update any navigation:
   ```tsx
   // OLD
   import { useNavigate } from "@tanstack/react-router"
   navigate({ to: '/dashboard' })
   
   // NEW
   import { useNavigate } from "react-router-dom"
   navigate('/dashboard')
   ```

**Files to convert (17 total):**
- [ ] index.tsx → pages/Index.tsx
- [ ] login.tsx → pages/Login.tsx
- [ ] onboarding.tsx → pages/Onboarding.tsx
- [ ] expenses.tsx → pages/Expenses.tsx
- [ ] income.tsx → pages/Income.tsx
- [ ] budgets.tsx → pages/Budgets.tsx
- [ ] savings.tsx → pages/Savings.tsx
- [ ] reports.tsx → pages/Reports.tsx
- [ ] predictions.tsx → pages/Predictions.tsx
- [ ] settings.tsx → pages/Settings.tsx
- [ ] premium.tsx → pages/Premium.tsx
- [ ] pricing.tsx → pages/Pricing.tsx
- [ ] reset-password.tsx → pages/ResetPassword.tsx
- [ ] health.tsx → pages/Health.tsx
- [ ] admin-subscriptions.tsx → pages/AdminSubscriptions.tsx

### STEP 5: Search and Replace Throughout Codebase (30 min)

**Find all files using TanStack Router:**
```bash
# Search for TanStack imports
grep -r "@tanstack/react-router" src/
```

**Common replacements needed:**
1. Navigation in components:
   ```tsx
   // OLD
   import { Link, useNavigate } from "@tanstack/react-router"
   navigate({ to: '/path', params: { id } })
   
   // NEW  
   import { Link, useNavigate } from "react-router-dom"
   navigate('/path/' + id)
   ```

2. Link components:
   ```tsx
   // Usually no changes needed - Link works same way
   <Link to="/expenses">Expenses</Link>
   ```

3. Active link detection:
   ```tsx
   // OLD
   import { useRouterState } from "@tanstack/react-router"
   const router = useRouterState()
   const isActive = router.location.pathname === '/expenses'
   
   // NEW
   import { useLocation } from "react-router-dom"
   const location = useLocation()
   const isActive = location.pathname === '/expenses'
   ```

### STEP 6: Delete Old Files (5 min)
```bash
# Delete TanStack specific files
rm src/routes/__root.tsx
rm src/router.tsx
rm src/routeTree.gen.ts
rm src/start.ts
rm src/server.ts
rm -rf src/lib/error-capture.ts
rm -rf src/lib/error-page.tsx
rm -rf src/lib/lovable-error-reporting.ts
```

### STEP 7: Test Locally (30 min)
```bash
npm run dev
```

Visit http://localhost:5173 and test:
- [ ] Login page works
- [ ] Authentication works
- [ ] All pages load
- [ ] Navigation between pages works
- [ ] No console errors

### STEP 8: Fix Any Issues (1 hour buffer)
Common issues:
- Missing imports
- Navigation syntax errors
- Component not found errors

### STEP 9: Build and Deploy (15 min)
```bash
# Test production build
npm run build
npm run preview

# If working, commit and push
git add .
git commit -m "feat: migrate from TanStack Start to React Router for Vercel compatibility"
git push origin migrate-to-react-router

# Create PR or merge to main
git checkout main
git merge migrate-to-react-router
git push origin main
```

Vercel will auto-deploy and it should work!

## Quick Reference: Component Conversion Template

```tsx
// ========== OLD (TanStack) ==========
import { createFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute('/example')({
  component: ExamplePage,
})

function ExamplePage() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate({ to: '/other-page' })
  }
  
  return <div>...</div>
}

// ========== NEW (React Router) ==========
import { useNavigate } from "react-router-dom"

export default function ExamplePage() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/other-page')
  }
  
  return <div>...</div>
}
```

## Time Estimate
- Steps 1-3: 20 minutes
- Step 4 (convert routes): 2-3 hours  
- Step 5 (update components): 30 minutes
- Steps 6-7: 35 minutes
- Step 8 (fixes): 1 hour
- Step 9: 15 minutes
**Total: 4.5-5.5 hours**

## Current Progress
✅ 40% complete - Core infrastructure done
⏳ 60% remaining - Route conversion and testing

## Need Help?
If you get stuck, the pattern is simple:
1. Remove TanStack imports
2. Add React Router imports
3. Change navigation syntax
4. Make it a default export

The component logic stays the same - only routing changes!
