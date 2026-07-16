# 🔧 Fix Vercel 404 Error - TanStack Start SSR Configuration

## 🔍 Problem
Getting **404: NOT_FOUND** error on Vercel because TanStack Start uses **Nitro for SSR**, not static builds.

## ✅ Solution Applied

### 1. Updated `vite.config.ts`
Added Nitro preset for Vercel:
```typescript
nitro: {
  preset: "vercel",
}
```

### 2. Simplified `vercel.json`
Removed static-site configs since this is an SSR app:
```json
{
  "buildCommand": "npm run build",
  "framework": "vite",
  "installCommand": "npm install"
}
```

---

## 🚀 Redeploy Instructions

### Step 1: Commit Changes
```bash
git add vite.config.ts vercel.json FIX_VERCEL_404.md
git commit -m "Fix Vercel 404: Configure Nitro for Vercel SSR"
git push origin main
```

### Step 2: Redeploy on Vercel
Vercel will automatically redeploy when you push. Or manually:
1. Go to your Vercel dashboard
2. Click on your project: `expensia`
3. Go to **Deployments** tab
4. Click **"Redeploy"** on the latest deployment

### Step 3: Verify Vercel Build Settings
In Vercel project settings, confirm:
- **Framework Preset**: `Other` or `Vite`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: (leave empty or use `.vercel`)
- **Install Command**: `npm install`

---

## 📋 How Nitro + Vercel Works

### Before (Wrong - Static Build)
```
npm run build → .output/public → Vercel serves static files → 404 on routes
```

### After (Correct - SSR)
```
npm run build → Nitro builds for Vercel → .vercel/output → Vercel runs serverless functions → ✅ Routes work
```

### Build Output Structure
With `preset: "vercel"`, Nitro creates:
```
.vercel/
  output/
    config.json
    functions/
      __nitro.func/
        index.mjs  # Serverless function
    static/        # Static assets
```

---

## 🧪 Testing After Redeploy

1. **Homepage**: `https://expensia-one.vercel.app/`
   - Should load ✅

2. **Login Page**: `https://expensia-one.vercel.app/login`
   - Should load (not 404) ✅

3. **Premium Page**: `https://expensia-one.vercel.app/premium`
   - Should load (not 404) ✅

4. **Direct URL Navigation**: 
   - Paste any route directly in browser
   - Should work (not 404) ✅

5. **Browser Refresh**:
   - Go to any page and hit F5
   - Should stay on same page (not 404) ✅

---

## 🔍 Debugging Build Issues

### Check Build Logs in Vercel
1. Go to **Deployments** tab
2. Click on the deployment
3. Look for build output

### Expected in Build Logs
```
✓ Nitro built in X ms
✓ Building Nitro Server (preset: vercel)
```

### If Build Fails
Check for:
- Missing dependencies
- TypeScript errors
- Environment variables issues

### Common Errors & Fixes

#### Error: "Cannot find module 'nitro'"
**Fix**: Already included in dependencies via `@lovable.dev/vite-tanstack-config`

#### Error: "Invalid preset 'vercel'"
**Fix**: Update vite-tanstack-config:
```bash
npm update @lovable.dev/vite-tanstack-config
```

#### Error: "Build output not found"
**Fix**: Don't set Output Directory in Vercel - let Nitro handle it

---

## 📁 Files Changed

1. ✅ `vite.config.ts` - Added `nitro: { preset: "vercel" }`
2. ✅ `vercel.json` - Simplified for SSR
3. ✅ `FIX_VERCEL_404.md` - This guide

---

## ⚙️ Alternative: Static Site Generation (If SSR Not Needed)

If you prefer a static site (no server):

### Option A: Use TanStack Router SPA Mode
Not applicable - your app uses TanStack Start which requires SSR.

### Option B: Build Static Pages
Would require major refactoring - not recommended.

**Recommendation**: Keep SSR with Vercel - it's the correct approach for TanStack Start.

---

## 🎉 Expected Result

After redeploying with these changes:
- ✅ All routes work
- ✅ Direct URL navigation works
- ✅ Browser refresh maintains route
- ✅ No 404 errors
- ✅ SSR enables better SEO
- ✅ Faster initial page loads

---

## 🆘 Still Having Issues?

1. **Check Vercel deployment logs**
2. **Verify environment variables are set**
3. **Make sure latest code is pushed to GitHub**
4. **Try manual redeploy in Vercel dashboard**

If 404 persists after redeploy:
- Check that build completed successfully
- Verify `.vercel/output` folder was created in build
- Contact me with the build logs
