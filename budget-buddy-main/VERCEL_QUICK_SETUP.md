# ⚡ Vercel Quick Setup - Copy & Paste Ready

## 🎯 Vercel Configuration (In the Web Interface)

### Framework & Build Settings
```
Application Preset: Other
Root Directory: ./
Build Command: npm run build
Output Directory: .output/public
Install Command: npm install
```

---

## 📋 Environment Variables (Add in Vercel Dashboard)

Copy each block and paste in Vercel's environment variables section:

### Variable 1
```
Name: VITE_SUPABASE_URL
Value: https://fgsrxibdmkssywrpbxzv.supabase.co
```

### Variable 2
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDYyMDMsImV4cCI6MjA5OTA4MjIwM30.ftgC9E_MxKvDI3h8AuPsh8zxoEBk61Yz-mvloY-zMzI
```

### Variable 3
```
Name: VITE_SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4
```

### Variable 4
```
Name: VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_test_51TshJWRp1jrpNofslBoN9OdjgfiORkoFDe6ZCpPFdBGcTbbeL99HodHxf3XzgJlWSFXsBGreRIuKYj5miSZA005b9qgWcf
```

### Variable 5
```
Name: VITE_STRIPE_SECRET_KEY
Value: sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
```

### Variable 6
```
Name: VITE_STRIPE_PRODUCT_ID
Value: prod_UsSckc6HY9hjIc
```

### Variable 7
```
Name: VITE_STRIPE_PREMIUM_PRICE_ID
Value: price_1TshgvRp1jrpNofsa0P5jLAG
```

### Variable 8
```
Name: VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY
Value: price_1TtkaWRp1jrpNofsKy0A1De1
```

### Variable 9
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_tlX56XMqSyVaSmOSMe0cKOxfPcUbWuLY
```

---

## 🚀 Deployment Steps

1. **Go to Vercel**: https://vercel.com/new
2. **Import** your GitHub repo: `affanayub10-ship-it/Expensia`
3. **Configure**:
   - Application Preset: `Other`
   - Root Directory: `./`
   - Leave Build/Output settings as default
4. **Add** all 9 environment variables above
5. **Click Deploy**

---

## ✅ After Deployment

Your app will be live at: `https://expensia-XXXX.vercel.app`

Test these:
- [ ] Login/Register works
- [ ] Dashboard loads
- [ ] Premium subscription checkout
- [ ] Database saves data

---

## 📁 Files Created

- ✅ `vercel.json` - Deployment configuration
- ✅ `VERCEL_DEPLOYMENT_GUIDE.md` - Full guide
- ✅ `VERCEL_QUICK_SETUP.md` - This file

---

## 🔄 Commit & Push These Files

Before deploying, push the new vercel.json to GitHub:

```bash
git add vercel.json VERCEL_DEPLOYMENT_GUIDE.md VERCEL_QUICK_SETUP.md
git commit -m "Add Vercel deployment configuration"
git push origin main
```

Then deploy on Vercel!
