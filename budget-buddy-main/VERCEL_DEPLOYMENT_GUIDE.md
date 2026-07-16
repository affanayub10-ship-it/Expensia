# 🚀 Vercel Deployment Guide - Budget Buddy

## 📋 Vercel Configuration Settings

When deploying on Vercel, use these exact settings:

### Basic Settings
- **Framework Preset**: `Other`
- **Root Directory**: `./` (leave as root, or enter `budget-buddy-main` if deploying from parent folder)
- **Build Command**: `npm run build`
- **Output Directory**: `.output/public`
- **Install Command**: `npm install`

---

## 🔧 Environment Variables to Add in Vercel

Click on **"Environment Variables"** section and add these variables:

### 1. Supabase Configuration
```
VITE_SUPABASE_URL=https://fgsrxibdmkssywrpbxzv.supabase.co
```

```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDYyMDMsImV4cCI6MjA5OTA4MjIwM30.ftgC9E_MxKvDI3h8AuPsh8zxoEBk61Yz-mvloY-zMzI
```

```
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4
```

### 2. Stripe Configuration
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TshJWRp1jrpNofslBoN9OdjgfiORkoFDe6ZCpPFdBGcTbbeL99HodHxf3XzgJlWSFXsBGreRIuKYj5miSZA005b9qgWcf
```

```
VITE_STRIPE_SECRET_KEY=sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
```

```
VITE_STRIPE_PRODUCT_ID=prod_UsSckc6HY9hjIc
```

```
VITE_STRIPE_PREMIUM_PRICE_ID=price_1TshgvRp1jrpNofsa0P5jLAG
```

```
VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY=price_1TtkaWRp1jrpNofsKy0A1De1
```

```
STRIPE_WEBHOOK_SECRET=whsec_tlX56XMqSyVaSmOSMe0cKOxfPcUbWuLY
```

---

## 📝 Step-by-Step Deployment

### Step 1: Import Project
1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repo: `affanayub10-ship-it/Expensia`
4. Click **"Import"**

### Step 2: Configure Project
1. **Project Name**: `expensia` (or your preferred name)
2. **Framework Preset**: Select **"Other"**
3. **Root Directory**: 
   - If repo root is the project: `./`
   - If inside `budget-buddy-main` folder: `budget-buddy-main`

### Step 3: Build Settings
Click **"Build and Output Settings"** dropdown:
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `.output/public`
- **Install Command**: `npm install`

### Step 4: Environment Variables
1. Click **"Environment Variables"** section
2. Add all 9 variables listed above
3. For each variable:
   - Key: Variable name (e.g., `VITE_SUPABASE_URL`)
   - Value: Corresponding value from above
   - Environment: Select **All** (Production, Preview, Development)

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-4 minutes)
3. Once done, you'll get a URL like: `https://expensia.vercel.app`

---

## ⚠️ Important Notes

### Root Directory Configuration
- **If deploying from repo root**: Set Root Directory to `./`
- **If your code is in a subfolder**: Set Root Directory to `budget-buddy-main`

Looking at your GitHub repo structure, if the entire project (package.json, src, etc.) is at the root level, use `./`

### Environment Variables Visibility
- All variables starting with `VITE_` are exposed to the browser (client-side)
- Variables without `VITE_` prefix are server-side only
- This is correct for your setup

### Build Output
The build creates a static site in `.output/public` which Vercel will serve.

---

## 🔄 After Deployment

### 1. Update Stripe Webhook URL
Once deployed, update your Stripe webhook endpoint:

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook
3. Update the endpoint URL to:
   ```
   https://YOUR_PROJECT_NAME.vercel.app/api/stripe-webhook
   ```
   (Replace with your actual Vercel URL)

**Note**: Stripe webhooks are handled by Supabase Edge Functions, not Vercel directly. Your webhook URL should remain:
```
https://fgsrxibdmkssywrpbxzv.supabase.co/functions/v1/stripe-webhook
```

### 2. Update Stripe Checkout URLs
The checkout success/cancel URLs are dynamically set in code using `window.location.origin`, so they'll automatically work with your Vercel domain.

### 3. Test the Deployment
1. Visit your Vercel URL
2. Register a new account
3. Test premium subscription flow
4. Verify Supabase data is being saved

---

## 🐛 Troubleshooting

### Build Fails
**Error**: `Command "npm run build" exited with 1`
- Check build logs for specific error
- Common issue: Missing dependencies
- Solution: Ensure package.json has all dependencies

### Environment Variables Not Working
**Symptom**: App can't connect to Supabase/Stripe
- Ensure all `VITE_` prefixed variables are added
- Redeploy after adding variables (Vercel auto-redeploys)
- Check browser console for missing env errors

### 404 on Routes
**Symptom**: Refresh on `/premium` returns 404
- The `vercel.json` file handles this with rewrites
- Ensure `vercel.json` is committed to GitHub
- Redeploy if you just added it

### Premium Checkout Not Working
**Symptom**: Stripe checkout fails
- Verify all Stripe environment variables are set
- Check Supabase Edge Functions are still working
- Test webhook using Stripe CLI: `stripe trigger checkout.session.completed`

---

## 📊 Monitoring

### Vercel Dashboard
- View deployment logs: https://vercel.com/dashboard
- Monitor function executions
- Check error logs

### Supabase Dashboard
- Monitor database queries
- Check Edge Function logs (stripe-webhook)
- View authentication logs

---

## 🔐 Security Best Practices

### After Testing, Switch to Production
When ready for production:
1. Create production Stripe keys
2. Create production Supabase project
3. Update all environment variables in Vercel
4. Set environment variables to **"Production"** only

### Domain Configuration
1. Add custom domain in Vercel settings
2. Update allowed domains in Supabase auth settings:
   - Dashboard → Authentication → URL Configuration
   - Add your Vercel domain to "Site URL" and "Redirect URLs"

---

## ✅ Deployment Checklist

Before deploying:
- [x] `vercel.json` created and committed
- [ ] All 9 environment variables ready
- [ ] GitHub repo up to date
- [ ] Know your root directory path

During deployment:
- [ ] Select correct framework preset: "Other"
- [ ] Set root directory correctly
- [ ] Add all environment variables
- [ ] Deploy and wait for build

After deployment:
- [ ] Test authentication (register/login)
- [ ] Test premium subscription flow
- [ ] Verify database writes to Supabase
- [ ] Check Stripe webhook logs in Supabase
- [ ] Test on mobile devices

---

## 🎉 You're Done!

Your app should now be live at: `https://YOUR_PROJECT_NAME.vercel.app`

Any questions or issues during deployment? Check the Vercel build logs or Supabase logs for detailed error messages.
