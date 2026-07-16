# Vercel SSR Fix - Disable SSR for Static Deployment

## Problem
The application was experiencing 500 errors on Vercel due to module resolution issues with SSR:
- Error: `Cannot find package 'tslib'` in Vercel serverless environment
- Radix UI dependencies not resolving correctly during server-side rendering
- Works fine locally (client-side only) but fails on Vercel (SSR)

## Root Cause
TanStack Start with SSR enabled uses Nitro to create a serverless function. The bundling process wasn't correctly handling all Radix UI peer dependencies (like `tslib`) in Vercel's Node.js runtime environment.

## Solution
**Disabled SSR and switched to static site generation** to avoid serverless function complexity.

### Changes Made

#### 1. `vite.config.ts`
```typescript
export default defineConfig({
  tanstackStart: {
    // Disable SSR for Vercel deployment
    ssr: false,
  },
  nitro: {
    preset: "vercel",
    static: true, // Static site generation
    prerender: {
      crawlLinks: true,
      routes: ['/', '/login', '/expenses', ...], // Pre-render all routes
    },
  },
  vite: {
    ssr: {
      noExternal: ['@radix-ui/*', '@supabase/supabase-js'], // Bundle these in SSR context
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: { // Code splitting for better performance
            'radix-ui': [...],
            'supabase': [...],
            'charts': [...],
          },
        },
      },
    },
  },
});
```

#### 2. `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "framework": null, // Let Vercel treat as static site
  "outputDirectory": ".output/public", // Static files location
  "routes": [
    { "handle": "filesystem" }, // Serve static files first
    { "src": "/(.*)", "dest": "/index.html" } // SPA fallback
  ]
}
```

#### 3. `.vercelignore`
```
!.output/** # Ensure build output is uploaded
```

## Benefits of This Approach

### ✅ Pros
1. **No serverless complexity** - Pure static files, no Node.js runtime issues
2. **Faster cold starts** - Static files served instantly from CDN
3. **Lower costs** - No serverless function invocations
4. **No module resolution issues** - Everything bundled in browser JavaScript
5. **Better caching** - Static assets cached at edge locations
6. **Simpler debugging** - No server-side errors to troubleshoot

### ⚠️ Considerations
1. **All routes pre-rendered at build time** - Dynamic server routes won't work
2. **Client-side data fetching only** - Supabase calls happen from browser
3. **Environment variables** - Must be prefixed with `VITE_` to be accessible in browser
4. **SEO** - No server-side rendering for initial page load (but fine for SPAs)

## How It Works

### Build Process
```bash
npm run build
```

1. Vite builds all routes as static HTML/CSS/JS
2. Nitro with `static: true` generates `.output/public/` directory
3. All routes pre-rendered (/, /login, /expenses, etc.)
4. Vercel uploads static files to CDN

### Runtime
1. User requests `https://expensia-two.vercel.app/expenses`
2. Vercel CDN serves static files instantly
3. React hydrates in browser
4. Client-side routing with TanStack Router
5. Supabase calls from browser to Supabase API

## Environment Variables

Since we're now client-side only, all environment variables must be prefixed with `VITE_` to be embedded in the browser bundle:

```bash
# In Vercel Dashboard
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLIC_KEY=pk_...
# etc.
```

**Security Note**: Only put PUBLIC keys in `VITE_*` variables. They will be visible in browser. Keep secret keys (like Stripe secret key) in Supabase Edge Functions or backend only.

## Deployment Steps

1. **Commit and push changes**
   ```bash
   git add vite.config.ts vercel.json .vercelignore
   git commit -m "fix: disable SSR for static Vercel deployment"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if connected to GitHub)
   - Or manually: `vercel --prod`

3. **Verify deployment**
   - Check https://expensia-two.vercel.app/
   - All pages should load without 500 errors
   - Browser console should show no module errors

## Testing Checklist

- [ ] Homepage loads (`/`)
- [ ] Login page loads (`/login`)
- [ ] Expenses page loads (`/expenses`)
- [ ] Income page loads (`/income`)
- [ ] Reports page loads (`/reports`)
- [ ] Settings page loads (`/settings`)
- [ ] Premium page loads (`/premium`)
- [ ] Reset password page loads (`/reset-password`)
- [ ] Health check loads (`/health`)
- [ ] Supabase authentication works
- [ ] Data fetching from Supabase works
- [ ] Navigation between pages works
- [ ] No console errors

## Rollback Plan

If this doesn't work, we can:
1. Try `preset: "vercel-static"` instead of `preset: "vercel"`
2. Try `preset: "static"` for pure static hosting
3. Use a different deployment platform (Netlify, Cloudflare Pages)
4. Debug the SSR bundling issue further

## Alternative: Fix SSR Instead

If SSR is required (e.g., for better SEO), we could:
1. Use `vite build --ssr` with proper externals configuration
2. Manually configure Nitro bundling with all Radix UI packages
3. Create custom Vercel serverless function wrapper
4. Use Next.js instead of TanStack Start (more Vercel-optimized)

But for this expense tracking app, **static generation is the simpler and better solution**.

## Status
- ✅ Configuration updated
- ⏳ Awaiting deployment
- ⏳ Testing on Vercel

## Next Steps
1. Push to GitHub
2. Wait for Vercel deployment
3. Test all routes
4. Verify no 500 errors
5. Document any remaining issues
