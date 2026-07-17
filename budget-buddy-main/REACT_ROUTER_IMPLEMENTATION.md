# React Router Implementation Guide

## Current Status
✅ Branch created: `migrate-to-react-router`
✅ package.json updated (removed TanStack, added react-router-dom)
✅ vite.config.ts updated (simple Vite + React config)
✅ index.html created

## Next: Install Dependencies
```bash
cd budget-buddy-main
npm install
```

This will install react-router-dom and remove TanStack packages.

## Files I'm Creating

### 1. src/main.tsx (Entry Point)
- Renders React app to DOM
- Wraps App with React.StrictMode

### 2. src/App.tsx (Router Setup) 
- Sets up BrowserRouter
- Defines all routes
- Wraps with AuthProvider and AppProvider
- Handles protected routes

### 3. src/pages/* (Converted Routes)
- Move each route from src/routes/* to src/pages/*
- Remove TanStack Router code
- Keep all component logic

## Key Changes Needed in Components

### Navigation Changes
**OLD:**
```tsx
import { Link, useNavigate } from '@tanstack/react-router'
const navigate = useNavigate()
navigate({ to: '/login' })
```

**NEW:**
```tsx
import { Link, useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/login')
```

### Route Component Changes
**OLD:**
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() { /* ... */ }
```

**NEW:**
```tsx
export default function LoginPage() {  /* ... */ }
```

## Testing Locally
```bash
npm run dev      # Should start on http://localhost:5173
npm run build    # Should create dist/ folder
npm run preview  # Test production build
```

## Vercel Deployment
Once working locally:
```bash
git add .
git commit -m "migrate: switch from TanStack Start to React Router"
git push origin migrate-to-react-router
```

Then merge to main and Vercel will deploy automatically.

## Status
Working on creating core files now...
