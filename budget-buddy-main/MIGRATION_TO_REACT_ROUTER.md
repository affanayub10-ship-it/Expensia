# Migration from TanStack Start to Vite + React Router

## Why?
TanStack Start has proven incompatible with Vercel's deployment platform after 15+ attempts with different configurations. All attempts resulted in module resolution errors, 404s, or 500 errors.

## Solution
Migrate to a simpler, more widely-supported stack:
- ✅ Vite (build tool)
- ✅ React Router v6 (routing)
- ✅ No SSR (client-side only)
- ✅ Static build for Vercel

## Steps

### 1. Update Dependencies
```bash
# Remove TanStack packages
npm uninstall @tanstack/react-start @tanstack/react-router @tanstack/router-plugin

# Install React Router
npm install react-router-dom

# Update vite config
npm install @vitejs/plugin-react vite-tsconfig-paths
```

### 2. File Structure Changes
```
OLD (TanStack Start):
src/
  routes/           # File-based routing
    index.tsx
    login.tsx
    expenses.tsx
    ...
  routeTree.gen.ts  # Auto-generated
  router.tsx        # Router config
  start.ts          # TanStack Start entry

NEW (React Router):
src/
  pages/            # Route components
    Index.tsx
    Login.tsx
    Expenses.tsx
    ...
  App.tsx           # Router setup
  main.tsx          # Entry point
```

### 3. Key Files to Create/Modify

#### New: `src/main.tsx` (Entry point)
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### New: `src/App.tsx` (Router setup)
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
// Import all page components
```

#### New: `index.html` (Root template)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Expensia</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### Update: `vite.config.ts`
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### 4. Route Migration

Each route file needs conversion:

**OLD** (`src/routes/login.tsx`):
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  // component code
}
```

**NEW** (`src/pages/Login.tsx`):
```tsx
export default function LoginPage() {
  // same component code
}
```

### 5. Navigation Updates

**OLD** (TanStack Router):
```tsx
import { Link, useNavigate } from '@tanstack/react-router'

<Link to="/expenses">Expenses</Link>
const navigate = useNavigate()
navigate({ to: '/login' })
```

**NEW** (React Router):
```tsx
import { Link, useNavigate } from 'react-router-dom'

<Link to="/expenses">Expenses</Link>
const navigate = useNavigate()
navigate('/login')
```

### 6. Files to Delete
- `src/routes/` (entire folder)
- `src/routeTree.gen.ts`
- `src/router.tsx`
- `src/start.ts`
- `src/server.ts`
- `.output/` folder
- `.vercel/output/` folder

### 7. Testing
```bash
npm run dev   # Should start on localhost:5173
npm run build # Should create dist/ folder
npm run preview # Test production build
```

### 8. Vercel Deployment
With plain Vite, Vercel will:
- Auto-detect it's a Vite project
- Build to `dist/` folder
- Serve as static site
- No SSR, no serverless functions
- Just works™

## Estimated Time
- Setup: 30 minutes
- Route conversion: 2-3 hours (12+ routes)
- Testing: 30 minutes
- Fixes: 1 hour
- **Total: 4-5 hours**

## Benefits
- ✅ Works reliably on Vercel
- ✅ Faster build times
- ✅ Simpler deployment
- ✅ No SSR complexity
- ✅ Wide community support
- ✅ Easy to debug

## Trade-offs
- ❌ No file-based routing (manual route definition)
- ❌ No SSR (client-side only - fine for this app)
- ❌ No TanStack Router features (most weren't being used anyway)

## Status
- [ ] Dependencies updated
- [ ] New files created
- [ ] Routes converted
- [ ] Navigation updated
- [ ] Local testing passed
- [ ] Deployed to Vercel
- [ ] Production testing passed

## Next Steps
Starting migration now...
