# 🔐 Implement OTP-Based Password Reset (Stay in One Window)

## 🎯 Goal
User never leaves your app - everything happens in one window using a verification code.

## 📋 How It Works

### User Flow:
1. User clicks "Forgot Password" on login page
2. Enters email address
3. **Receives 6-digit code via email**
4. Enters code on YOUR app (same window)
5. Enters new password
6. Done! Password reset without leaving the app

---

## 🛠️ Implementation Steps

### Step 1: Install Required Package
```bash
npm install crypto
```

### Step 2: Create OTP Storage Table
Run this in Supabase SQL Editor:

```sql
-- Create OTP storage table
CREATE TABLE IF NOT EXISTS password_reset_otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_reset_otps_email ON password_reset_otps(user_email);
CREATE INDEX idx_reset_otps_expires ON password_reset_otps(expires_at);

-- Enable RLS
ALTER TABLE password_reset_otps ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for OTP generation)
CREATE POLICY "Anyone can insert OTP" ON password_reset_otps
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can read their own OTPs
CREATE POLICY "Users can read own OTP" ON password_reset_otps
  FOR SELECT USING (true);

-- Policy: System can update OTP usage
CREATE POLICY "System can update OTP" ON password_reset_otps
  FOR UPDATE USING (true);
```

### Step 3: Create Supabase Edge Function for Sending OTP

Create file: `supabase/functions/send-reset-otp/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  const { email } = await req.json();
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP in database (expires in 10 minutes)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  
  await supabase.from("password_reset_otps").insert({
    user_email: email.toLowerCase(),
    otp_code: otp,
    expires_at: expiresAt.toISOString(),
  });
  
  // Send email with OTP
  // TODO: Integrate with your email service (SendGrid, Resend, etc.)
  console.log(`OTP for ${email}: ${otp}`);
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

### Step 4: Update Login Page with OTP Flow

The login page needs these changes:
1. Add OTP input field
2. Add "Verify Code" step
3. Add "Resend Code" button
4. Show password reset form after OTP verification

---

## ⚡ Quick Alternative: Use Supabase Built-in OTP

Supabase has built-in OTP support! Here's the simpler approach:

### Method: Email OTP (No custom tables needed)

```typescript
// In AuthContext.tsx - Update resetPassword function

async function requestPasswordResetOTP(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase().trim(),
    options: {
      shouldCreateUser: false, // Don't create new user
    },
  });
  
  if (error) return { success: false, error: error.message };
  return { success: true };
}

async function verifyOTPAndResetPassword(
  email: string, 
  otp: string, 
  newPassword: string
) {
  // Verify OTP
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.toLowerCase().trim(),
    token: otp,
    type: 'email',
  });
  
  if (error) return { success: false, error: error.message };
  
  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (updateError) return { success: false, error: updateError.message };
  
  return { success: true };
}
```

---

## 🎨 Updated UI Flow

### Screen 1: Enter Email
```
Forgot Password?
Enter your email to receive a verification code

[Email input]
[Send Code →]
```

### Screen 2: Enter OTP
```
Check Your Email
We sent a 6-digit code to user@example.com

[OTP input: _ _ _ _ _ _]
[Verify Code →]

Didn't receive it? [Resend code]
```

### Screen 3: Reset Password
```
Set New Password
You've been verified! Enter your new password

[New password input]
[Confirm password input]
[Reset Password →]
```

### Screen 4: Success
```
✅ Password Reset!
Your password has been successfully updated

[Go to Login →]
```

---

## ⏱️ Implementation Time

- **Simple approach (using Supabase OTP)**: ~1 hour
- **Custom approach (with table)**: ~2 hours

---

## 🤔 Decision

Which would you prefer?

### Option A: Keep Email Link (Current)
- ✅ Already implemented
- ✅ Industry standard
- ❌ Opens new tab

### Option B: Implement OTP System
- ✅ Stays in one window
- ✅ Better UX
- ⏱️ Requires 1-2 hours implementation

### Option C: Hybrid Approach
- Email link for desktop
- OTP for mobile
- User chooses which method

Let me know and I'll implement your choice!
