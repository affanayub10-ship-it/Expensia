import { useNavigate } from "react-router-dom";
import { useState, useEffect, type FormEvent } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, Wallet, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";



export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user came from a valid reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // No session means invalid or expired link
        toast.error("Invalid or expired reset link. Please request a new password reset.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setIsValidSession(true);
        
        // SECURITY: Store a flag to prevent navigation during password reset
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("password_reset_in_progress", "true");
        }
      }
    });

    // SECURITY: Cleanup the flag when leaving this page
    return () => {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem("password_reset_in_progress");
      }
    };
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Password updated successfully!");
      
      // SECURITY: Clear the reset flag before signing out
      sessionStorage.removeItem("password_reset_in_progress");
      
      // Sign out the user after password reset for security
      await supabase.auth.signOut();
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Failed to update password");
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  }

  // Don't render anything until we've verified the session
  if (!isValidSession) {
    return (
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "hsl(240 10% 3.9%)",
        color: "#f8fafc",
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "3px solid rgba(99, 102, 241, 0.3)",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p>Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .reset-root {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          background: hsl(240 10% 3.9%);
          padding: 2rem 1.5rem;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reset-card {
          width: 100%;
          max-width: 26rem;
          opacity: 0;
          animation: slideUp 0.55s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        .reset-card.mounted { opacity: 1; }

        .reset-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .reset-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #6366f1, #a855f7);
        }
        .reset-logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }

        .reset-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.03em;
          margin: 0 0 0.375rem;
          text-align: center;
        }

        .reset-subtitle {
          font-size: 0.9rem;
          color: hsl(240 5% 64.9%);
          margin: 0 0 2rem;
          text-align: center;
        }

        .reset-field {
          margin-bottom: 1.125rem;
        }

        .reset-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }

        .reset-input-wrap {
          position: relative;
        }

        .reset-input-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(240 5% 44.9%);
          pointer-events: none;
          width: 1rem;
          height: 1rem;
        }

        .reset-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 3rem 0.75rem 2.5rem;
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

        .reset-input::placeholder {
          color: hsl(240 5% 44.9%);
        }

        .reset-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
        }

        .reset-eye-btn {
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

        .reset-eye-btn:hover {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.12);
        }

        .reset-error {
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

        .reset-success-box {
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

        .reset-success-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #34d399;
          margin: 0.75rem 0 0.375rem;
        }

        .reset-success-desc {
          font-size: 0.875rem;
          color: hsl(240 5% 74.9%);
          line-height: 1.5;
          margin: 0;
        }

        .reset-btn {
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

        .reset-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99, 102, 241, 0.55);
        }

        .reset-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .reset-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .reset-spinner {
          width: 1.125rem;
          height: 1.125rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .reset-back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: hsl(240 5% 64.9%);
          background: none;
          border: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.18s;
          padding: 0;
          font-family: inherit;
          width: 100%;
          text-decoration: none;
        }

        .reset-back-btn:hover {
          color: #f8fafc;
        }

        .reset-hint {
          font-size: 0.75rem;
          color: hsl(240 5% 54.9%);
          margin-top: 0.375rem;
          line-height: 1.4;
        }

        /* Hide browser's password reveal */
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none !important;
        }
      `}</style>

      <div className="reset-root">
        <div className={`reset-card ${mounted ? "mounted" : ""}`}>
          {/* Logo */}
          <div className="reset-logo">
            <div className="reset-logo-icon">
              <Wallet size={18} color="#fff" />
            </div>
            <span className="reset-logo-text">Expensia</span>
          </div>

          {isSuccess ? (
            <>
              {/* Success State */}
              <div className="reset-success-box">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <h3 className="reset-success-title">Password Updated!</h3>
                <p className="reset-success-desc">
                  Your password has been successfully updated. You'll be redirected to the login page shortly.
                </p>
              </div>
              
              <button
                type="button"
                className="reset-back-btn"
                onClick={() => {
                  sessionStorage.removeItem("password_reset_in_progress");
                  navigate("/login");
                }}
              >
                <ArrowLeft size={16} />
                Back to sign in
              </button>
            </>
          ) : (
            <>
              {/* Title */}
              <h2 className="reset-title">Reset your password</h2>
              <p className="reset-subtitle">
                Enter your new password below
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* New Password */}
                <div className="reset-field">
                  <label htmlFor="new-password" className="reset-label">
                    New Password
                  </label>
                  <div className="reset-input-wrap">
                    <Lock className="reset-input-icon" />
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      className="reset-input"
                    />
                    <button
                      type="button"
                      className="reset-eye-btn"
                      onClick={() => setShowNewPassword((v) => !v)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="reset-hint">Must be at least 6 characters long</p>
                </div>

                {/* Confirm Password */}
                <div className="reset-field">
                  <label htmlFor="confirm-password" className="reset-label">
                    Confirm New Password
                  </label>
                  <div className="reset-input-wrap">
                    <Lock className="reset-input-icon" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      className="reset-input"
                    />
                    <button
                      type="button"
                      className="reset-eye-btn"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="reset-error" role="alert">
                    <span>âš </span>
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="reset-btn"
                  disabled={isLoading || !newPassword || !confirmPassword}
                >
                  {isLoading ? (
                    <>
                      <div className="reset-spinner" />
                      Updating password...
                    </>
                  ) : (
                    <>
                      Update Password
                      <Lock size={16} />
                    </>
                  )}
                </button>

                {/* Back to Login */}
                <button
                  type="button"
                  className="reset-back-btn"
                  onClick={() => {
                    sessionStorage.removeItem("password_reset_in_progress");
                    navigate("/login");
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to sign in
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

