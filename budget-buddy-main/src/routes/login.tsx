import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  User,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

/* =========================================================
   Feature pills shown in the brand panel
========================================================= */
const FEATURES = [
  { icon: TrendingUp, text: "Real-time expense tracking" },
  { icon: ShieldCheck, text: "Secure & private by default" },
  { icon: Sparkles, text: "Smart budgeting insights" },
];

/* =========================================================
   Demo credential hint chips
========================================================= */
const DEMO_HINTS = [
  { label: "Demo", email: "demo@budgetbuddy.com", password: "Demo@1234" },
];

/* =========================================================
   Main Login Page
========================================================= */
function LoginPage() {
  const { login, signup, resetPassword, isAuthenticated, onboardingComplete } = useAuth();
  const navigate = useNavigate();

  // Mode: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResetSent, setIsResetSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      navigate({ to: onboardingComplete ? "/" : "/onboarding" });
    }
  }, [isAuthenticated, onboardingComplete, navigate]);

  // Reset errors and fields on mode change
  const handleModeChange = (newMode: "login" | "signup" | "forgot") => {
    setMode(newMode);
    setError("");
    setIsLoading(false);
    setIsResetSent(false);
    setPassword("");
    setConfirmPassword("");
    if (newMode === "login" || newMode === "forgot") {
      setName("");
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (mode === "login") {
      const result = await login(email, password);
      if (result.success) {
        // onboardingComplete will be set by loadUserProfile after login
        // AppLayout handles the redirect, but we do a best-effort navigation here
        await navigate({ to: onboardingComplete ? "/" : "/onboarding" });
      } else {
        setError(result.error ?? "Login failed. Please try again.");
        setIsLoading(false);
      }
    } else if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }

      const result = await signup(name, email, password);
      if (result.success) {
        await navigate({ to: "/onboarding" });
      } else {
        setError(result.error ?? "Registration failed. Please try again.");
        setIsLoading(false);
      }
    } else if (mode === "forgot") {
      const result = await resetPassword(email);
      if (result.success) {
        setIsResetSent(true);
      } else {
        setError(result.error ?? "Failed to send reset link.");
      }
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : '/',
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  }

  function fillDemo(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
    setMode("login");
  }

  return (
    <>
      {/* Inline styles scoped to login page */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .login-root {
          min-height: 100dvh;
          display: flex;
          font-family: 'Inter', sans-serif;
          background: hsl(240 10% 3.9%);
        }

        /* Brand panel */
        .login-brand {
          display: none;
          position: relative;
          overflow: hidden;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #4c1d95 65%, #1e1b4b 100%);
        }
        @media (min-width: 1024px) {
          .login-brand { display: flex; }
        }

        /* mesh glow orbs */
        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.5;
        }
        .login-orb-1 {
          top: -8rem; left: -8rem;
          width: 28rem; height: 28rem;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
        }
        .login-orb-2 {
          bottom: -6rem; right: -6rem;
          width: 22rem; height: 22rem;
          background: radial-gradient(circle, #a855f7 0%, transparent 70%);
        }
        .login-orb-3 {
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 18rem; height: 18rem;
          background: radial-gradient(circle, #818cf8 0%, transparent 70%);
          opacity: 0.25;
        }

        .login-brand-top { position: relative; z-index: 1; }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 3.5rem;
        }
        .login-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem; height: 2.75rem;
          border-radius: 0.875rem;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .login-logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .login-brand-heading {
          font-size: 2.5rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
        }
        .login-brand-heading span {
          background: linear-gradient(90deg, #a5b4fc, #e879f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .login-brand-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          max-width: 22rem;
          margin-bottom: 2.5rem;
        }
        .login-features {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .login-feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }
        .login-feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem; height: 2rem;
          border-radius: 0.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          flex-shrink: 0;
        }

        /* Form panel */
        .login-form-panel {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem 1.5rem;
          background: hsl(240 10% 3.9%);
          overflow-y: auto;
        }
        @media (min-width: 640px) {
          .login-form-panel { padding: 3rem 2.5rem; }
        }

        /* slide-up entrance */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card {
          width: 100%;
          max-width: 26rem;
          opacity: 0;
          animation: slideUp 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .login-card.mounted { opacity: 1; }

        /* mobile-only logo */
        .login-mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        @media (min-width: 1024px) { .login-mobile-logo { display: none; } }
        .login-mobile-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem; height: 2.25rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #6366f1, #a855f7);
        }
        .login-mobile-logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }

        .login-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.03em;
          margin: 0 0 0.375rem;
        }
        .login-subtitle {
          font-size: 0.9rem;
          color: hsl(240 5% 64.9%);
          margin: 0 0 2rem;
        }

        /* Demo chips */
        .login-demo-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .login-demo-chip {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.3125rem 0.75rem;
          border-radius: 9999px;
          border: 1px solid hsl(240 3.7% 20%);
          background: hsl(240 3.7% 10%);
          font-size: 0.75rem;
          font-weight: 500;
          color: hsl(240 5% 64.9%);
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: inherit;
        }
        .login-demo-chip:hover {
          border-color: #6366f1;
          color: #a5b4fc;
          background: rgba(99,102,241,0.08);
        }
        .login-demo-chip-dot {
          width: 0.375rem; height: 0.375rem;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
        }

        /* Input group */
        .login-field { margin-bottom: 1.125rem; }
        .login-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }
        .login-input-wrap {
          position: relative;
        }
        .login-input-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(240 5% 44.9%);
          pointer-events: none;
          width: 1rem; height: 1rem;
        }
        .login-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(240 3.7% 20%);
          background: hsl(240 3.7% 10%);
          color: #f8fafc;
          font-size: 0.9375rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          -webkit-appearance: none;
        }
        .login-input::placeholder { color: hsl(240 5% 44.9%); }
        .login-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
        }
        .login-input.has-right { padding-right: 3rem; }
        .login-eye-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: hsl(240 5% 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.375rem;
          padding: 0;
          transition: color 0.18s, background 0.18s;
          flex-shrink: 0;
        }
        .login-eye-btn:hover {
          color: #a5b4fc;
          background: rgba(99,102,241,0.12);
        }

        /* Remember / forgot row */
        .login-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .login-remember {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: hsl(240 5% 64.9%);
          cursor: pointer;
          user-select: none;
        }
        .login-remember input[type="checkbox"] { accent-color: #6366f1; width: 1rem; height: 1rem; cursor: pointer; }
        .login-forgot {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #818cf8;
          text-decoration: none;
          transition: color 0.18s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
        }
        .login-forgot:hover { color: #a5b4fc; }

        /* Error box */
        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 1.125rem;
        }

        /* Success box */
        .login-success-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1.5rem;
          border-radius: 1rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          margin-bottom: 1.5rem;
        }
        .login-success-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #34d399;
          margin: 0.75rem 0 0.375rem;
        }
        .login-success-desc {
          font-size: 0.875rem;
          color: hsl(240 5% 74.9%);
          line-height: 1.5;
          margin: 0;
        }

        /* Submit button */
        .login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border-radius: 0.875rem;
          border: none;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99, 102, 241, 0.55);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-spinner {
          width: 1.125rem; height: 1.125rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        /* Google OAuth button */
        .login-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          border-radius: 0.875rem;
          border: 1px solid hsl(240 3.7% 20%);
          background: hsl(240 3.7% 10%);
          color: #f8fafc;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.18s ease;
          margin-bottom: 1.5rem;
        }
        .login-google-btn:hover:not(:disabled) {
          border-color: #6366f1;
          background: rgba(99,102,241,0.08);
          transform: translateY(-1px);
        }
        .login-google-btn:active:not(:disabled) { transform: translateY(0); }
        .login-google-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .login-google-icon {
          width: 1.25rem; height: 1.25rem;
        }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          color: hsl(240 5% 34.9%);
          font-size: 0.75rem;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: hsl(240 3.7% 20%);
        }

        /* Footer */
        .login-footer {
          text-align: center;
          font-size: 0.8125rem;
          color: hsl(240 5% 54.9%);
        }
        .login-footer button, .login-footer a {
          background: none;
          border: none;
          padding: 0;
          color: #818cf8;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          font-family: inherit;
        }
        .login-footer button:hover, .login-footer a:hover { color: #a5b4fc; }

        /* Back to login header action */
        .login-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: hsl(240 5% 64.9%);
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.18s;
          padding: 0;
          margin-bottom: 1.5rem;
          font-family: inherit;
        }
        .login-back-btn:hover {
          color: #f8fafc;
        }

        /* Hide the browser's built-in password reveal eye so only our custom button shows */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-strong-password-auto-fill-button {
          display: none !important;
          visibility: hidden !important;
        }
      `}</style>

      <div className="login-root">
        {/* Brand Panel */}
        <div className="login-brand">
          <div className="login-orb login-orb-1" />
          <div className="login-orb login-orb-2" />
          <div className="login-orb login-orb-3" />

          <div className="login-brand-top">
            <div className="login-logo">
              <div className="login-logo-icon">
                <Wallet size={20} color="#fff" />
              </div>
              <span className="login-logo-text">Expensia</span>
            </div>

            <h1 className="login-brand-heading">
              Your money,
              <br />
              <span>crystal clear.</span>
            </h1>
            <p className="login-brand-sub">
              Effortlessly track every rupee, set smart budgets, and get insights that help you
              spend better — all in one place.
            </p>

            <div className="login-features">
              {FEATURES.map((f) => (
                <div key={f.text} className="login-feature">
                  <div className="login-feature-icon">
                    <f.icon size={14} color="#a5b4fc" />
                  </div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="login-form-panel">
          <div className={`login-card ${mounted ? "mounted" : ""}`}>
            {/* Mobile-only logo */}
            <div className="login-mobile-logo">
              <div className="login-mobile-logo-icon">
                <Wallet size={18} color="#fff" />
              </div>
              <span className="login-mobile-logo-text">Expensia</span>
            </div>

            {/* Back to Login action button for forgot/signup */}
            {mode !== "login" && (
              <button
                type="button"
                className="login-back-btn"
                onClick={() => handleModeChange("login")}
              >
                <ArrowLeft size={16} />
                Back to sign in
              </button>
            )}

            {/* Title / Subtitle based on Mode */}
            {mode === "login" && (
              <>
                <h2 className="login-title">Welcome back</h2>
                <p className="login-subtitle">Sign in to continue to your dashboard</p>
              </>
            )}
            {mode === "signup" && (
              <>
                <h2 className="login-title">Create an account</h2>
                <p className="login-subtitle">Start tracking your expenses and budgeting today</p>
              </>
            )}
            {mode === "forgot" && (
              <>
                <h2 className="login-title">Forgot password?</h2>
                <p className="login-subtitle">
                  {!isResetSent
                    ? "Enter your email address and we'll send you a link to reset your password"
                    : "Instructions sent"}
                </p>
              </>
            )}

            {/* Demo account chips (Only on login page) */}
            {mode === "login" && (
              <div className="login-demo-row">
                <span
                  style={{ fontSize: "0.75rem", color: "hsl(240 5% 44.9%)", alignSelf: "center" }}
                >
                  Try demo:
                </span>
                {DEMO_HINTS.map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    className="login-demo-chip"
                    onClick={() => fillDemo(d.email, d.password)}
                  >
                    <span className="login-demo-chip-dot" />
                    {d.label}
                  </button>
                ))}
              </div>
            )}

            {/* Forgot password success state */}
            {mode === "forgot" && isResetSent ? (
              <div className="login-success-box">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <h3 className="login-success-title">Check your inbox</h3>
                <p className="login-success-desc">
                  We've sent a password recovery link to <strong>{email}</strong>.
                  <br /><br />
                  <strong>Note:</strong> Click the link in your email, then come back to this page to stay logged in.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name field (signup mode only) */}
                {mode === "signup" && (
                  <div className="login-field">
                    <label htmlFor="login-name" className="login-label">
                      Full name
                    </label>
                    <div className="login-input-wrap">
                      <User className="login-input-icon" />
                      <input
                        id="login-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setError("");
                        }}
                        className="login-input"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address (all modes) */}
                <div className="login-field">
                  <label htmlFor="login-email" className="login-label">
                    Email address
                  </label>
                  <div className="login-input-wrap">
                    <Mail className="login-input-icon" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="login-input"
                      inputMode="email"
                    />
                  </div>
                </div>

                {/* Password field (login and signup mode) */}
                {mode !== "forgot" && (
                  <div className="login-field">
                    <label htmlFor="login-password" className="login-label">
                      Password
                    </label>
                    <div className="login-input-wrap">
                      <Lock className="login-input-icon" />
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        className="login-input has-right"
                      />
                      <button
                        type="button"
                        className="login-eye-btn"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password field (signup mode only) */}
                {mode === "signup" && (
                  <div className="login-field">
                    <label htmlFor="login-confirm-password" className="login-label">
                      Confirm password
                    </label>
                    <div className="login-input-wrap">
                      <Lock className="login-input-icon" />
                      <input
                        id="login-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError("");
                        }}
                        className="login-input has-right"
                      />
                      <button
                        type="button"
                        className="login-eye-btn"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember me (login mode only) */}
                {mode === "login" && (
                  <div className="login-row">
                    <label className="login-remember">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="login-forgot"
                      onClick={() => handleModeChange("forgot")}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Error messages */}
                {error && (
                  <div className="login-error" role="alert">
                    <span>⚠</span>
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  className="login-btn"
                  disabled={
                    isLoading ||
                    !email ||
                    (mode !== "forgot" && !password) ||
                    (mode === "signup" && (!name || !confirmPassword))
                  }
                >
                  {isLoading ? (
                    <>
                      <span className="login-spinner" />
                      {mode === "login"
                        ? "Signing in..."
                        : mode === "signup"
                        ? "Creating account..."
                        : "Sending..."}
                    </>
                  ) : (
                    <>
                      {mode === "login"
                        ? "Sign in"
                        : mode === "signup"
                        ? "Create account"
                        : "Send recovery link"}
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <div className="login-divider">or continue with</div>

                {/* Google OAuth button (login mode only) */}
                {mode === "login" && (
                  <button
                    type="button"
                    className="login-google-btn"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg className="login-google-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </button>
                )}

                <div className="login-divider">or</div>

                {/* Mode toggle footer */}
                <p className="login-footer">
                  {mode === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button type="button" onClick={() => handleModeChange("signup")}>
                        Create one free
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button type="button" onClick={() => handleModeChange("login")}>
                        Sign in instead
                      </button>
                    </>
                  )}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
