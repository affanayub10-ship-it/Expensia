# 🔐 Authentication System Rules, Conditions & Implementation Guide

This document contains the complete specification, validation rules, anti-spam protections, password complexity criteria, and copy-paste code snippets implemented in our authentication system. You can attach or reference this file in any new application project.

---

## 📋 1. Core Principles & User Experience Rules

1. **Always Clickable Submit Buttons (No Disabled Lockouts)**
   * Submit buttons ("Create Account", "Sign In", "Send Reset Link") must **NEVER** be disabled when fields are empty (`disabled={isLoading}` only during active network requests).
   * Clicking a submit button with empty or invalid fields triggers immediate inline error warnings under each specific field and highlights the input box in red (`border-destructive`).

2. **Strict Anti-Spam Character Limits**
   * **Full Name (`name`)**: Maximum **25 characters** (`maxLength={25}`).
   * **Email Address (`email`)**: Maximum **35 characters** (`maxLength={35}`).

3. **Dual Google OAuth Visibility**
   * The Google OAuth Sign In / Sign Up button must be rendered on **BOTH** the Sign In view and the Create Account (Sign Up) view.
   * Button label updates dynamically:
     * Sign In View: `"Sign in with Google"`
     * Sign Up View: `"Sign up with Google"`

4. **Native Browser Eye Suppression**
   * Browser-default password eye icons (Edge `::-ms-reveal` and Chrome caps lock indicators) are hidden via CSS so only the custom eye toggle button is visible.

---

## 🧪 2. Field Validation & Error Messages Matrix

| Field | Scope | Restrictions & Rules | Error Warning Message |
| :--- | :--- | :--- | :--- |
| **Full Name** | Sign Up | • Non-empty after `.trim()`<br>• Max **25 chars** | • *"Kindly fill your full name"*<br>• *"Full name must be 25 characters or less"* |
| **Email Address** | Sign In / Up / Forgot | • Non-empty after `.trim()`<br>• Max **35 chars**<br>• Valid email format (`/^\S+@\S+\.\S+$/`) | • *"Kindly fill your email address"*<br>• *"Email address must be 35 characters or less"*<br>• *"Kindly enter a valid email address"* |
| **Password** | Sign Up / Reset | • Non-empty<br>• Length: **9 to 25 characters**<br>• At least **2 letters** (`[a-zA-Z]`)<br>• At least **1 number** (`[0-9]`)<br>• At least **1 symbol** (`[^a-zA-Z0-9]`) | • *"Kindly fill your password"*<br>• *"Password must be 9–25 characters long and contain at least 2 letters, 1 number, and 1 symbol."* |
| **Confirm Password**| Sign Up / Reset | • Non-empty<br>• Must match `password` exactly | • *"Kindly confirm your password"*<br>• *"Passwords do not match. Please correct it"* |

---

## 💻 3. Code Implementation & Utility Functions

### A. Password Complexity Validator Function
```typescript
export interface PasswordRequirements {
  length: boolean;  // 9 - 25 characters
  letters: boolean; // >= 2 alphabets
  number: boolean;  // >= 1 digit
  symbol: boolean;  // >= 1 special character
}

export function getPasswordRequirements(password: string): PasswordRequirements {
  const alphabets = password.match(/[a-zA-Z]/g) || [];
  const numbers = password.match(/[0-9]/g) || [];
  const specialChars = password.match(/[^a-zA-Z0-9]/g) || [];
  
  return {
    length: password.length >= 9 && password.length <= 25,
    letters: alphabets.length >= 2,
    number: numbers.length >= 1,
    symbol: specialChars.length >= 1,
  };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  const reqs = getPasswordRequirements(password);
  if (!reqs.length) return { valid: false, error: "Password must be 9–25 characters long." };
  if (!reqs.letters) return { valid: false, error: "Password must contain at least 2 letters." };
  if (!reqs.number) return { valid: false, error: "Password must contain at least 1 number." };
  if (!reqs.symbol) return { valid: false, error: "Password must contain at least 1 special character." };
  return { valid: true };
}
```

---

### B. React Form Submit & Field Error Handler
```tsx
import { useState, FormEvent } from "react";
import { getPasswordRequirements, validatePassword } from "./auth-utils";

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const newErrors: typeof fieldErrors = {};

    if (mode === "signup") {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      if (!trimmedName) {
        newErrors.name = "Kindly fill your full name";
      } else if (trimmedName.length > 25) {
        newErrors.name = "Full name must be 25 characters or less";
      }

      if (!trimmedEmail) {
        newErrors.email = "Kindly fill your email address";
      } else if (trimmedEmail.length > 35) {
        newErrors.email = "Email address must be 35 characters or less";
      } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
        newErrors.email = "Kindly enter a valid email address";
      }

      if (!password) {
        newErrors.password = "Kindly fill your password";
      } else {
        const pwdValidation = validatePassword(password);
        if (!pwdValidation.valid) {
          newErrors.password = pwdValidation.error;
        }
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Kindly confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match. Please correct it";
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        setError("Kindly fill in all required info or correct invalid details.");
        return;
      }

      setIsLoading(true);
      // Perform Signup API Call
    } else if (mode === "login") {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        newErrors.email = "Kindly fill your email address";
      } else if (trimmedEmail.length > 35) {
        newErrors.email = "Email address must be 35 characters or less";
      }

      if (!password) {
        newErrors.password = "Kindly fill your password";
      }

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        setError("Kindly fill in all required info.");
        return;
      }

      setIsLoading(true);
      // Perform Login API Call
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Full Name (Sign Up only) */}
      {mode === "signup" && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Full name</label>
          <input
            type="text"
            value={name}
            maxLength={25}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
            }}
            placeholder="Full name (max 25 chars)"
            className={`w-full rounded-xl border px-3 py-2 text-sm ${
              fieldErrors.name ? "border-red-500 focus:ring-red-500" : "border-slate-700"
            }`}
          />
          {fieldErrors.name && (
            <p className="text-xs font-medium text-red-500 animate-fadeIn">
              ⚠️ {fieldErrors.name}
            </p>
          )}
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold">Email address</label>
        <input
          type="email"
          value={email}
          maxLength={35}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
          }}
          placeholder="name@example.com (max 35 chars)"
          className={`w-full rounded-xl border px-3 py-2 text-sm ${
            fieldErrors.email ? "border-red-500 focus:ring-red-500" : "border-slate-700"
          }`}
        />
        {fieldErrors.email && (
          <p className="text-xs font-medium text-red-500 animate-fadeIn">
            ⚠️ {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Dual Google OAuth Button */}
      {mode !== "forgot" && (
        <>
          <div className="my-4 text-center text-xs text-slate-400">or continue with</div>
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700/80 transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            <span>{mode === "login" ? "Sign in with Google" : "Sign up with Google"}</span>
          </button>
        </>
      )}

      {/* Submit Button (Always Clickable) */}
      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-teal-500 py-3 text-sm font-bold text-slate-950 hover:bg-teal-400 transition-all"
      >
        {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
      </button>
    </form>
  );
}
```

---

## 🎨 4. Native Password Reveal Suppression CSS
Add this block to your global `styles.css` file:
```css
/* Suppress browser native password-reveal eye button & caps-lock icons */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear,
input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-strong-password-auto-fill-button,
input[type="password"]::-webkit-caps-lock-indicator {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
```
