import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { 
  Mail, 
  Send, 
  RefreshCw, 
  Edit3, 
  LogOut, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Change email states
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // SMTP Configuration Warnings
  const [showSmtpWarning, setShowSmtpWarning] = useState(false);
  const [smtpWarningMsg, setSmtpWarningMsg] = useState("");

  // Persistent Cooldown using localStorage
  useEffect(() => {
    const savedCooldownEnd = localStorage.getItem("verify-email-cooldown-end");
    if (savedCooldownEnd) {
      const remaining = Math.round((parseInt(savedCooldownEnd) - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("verify-email-cooldown-end");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const triggerCooldown = (seconds: number = 60) => {
    setCooldown(seconds);
    localStorage.setItem("verify-email-cooldown-end", (Date.now() + seconds * 1000).toString());
  };

  const handleResendEmail = async () => {
    if (cooldown > 0 || !user?.email) return;
    setIsResending(true);
    setShowSmtpWarning(false);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify`,
        },
      });

      if (error) {
        console.error("Resend error details:", error);
        
        // Detect Supabase default provider rate limits or configuration issues
        const errMsg = error.message.toLowerCase();
        if (errMsg.includes("rate limit") || errMsg.includes("exceeded") || errMsg.includes("smtp")) {
          setShowSmtpWarning(true);
          setSmtpWarningMsg(
            "Supabase default email rate limit hit (3 emails/hour). Please wait or configure a custom SMTP provider (Resend, SendGrid, Mailgun) in Supabase Dashboard → Settings → Authentication → SMTP."
          );
        }
        throw error;
      }

      toast.success("Verification link sent! Please check your inbox.");
      triggerCooldown(60);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || isUpdatingEmail) return;
    if (newEmail.toLowerCase().trim() === user?.email.toLowerCase().trim()) {
      toast.error("That is already your current email address.");
      return;
    }

    setIsUpdatingEmail(true);
    setShowSmtpWarning(false);

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail.trim().toLowerCase(),
      }, {
        emailRedirectTo: `${window.location.origin}/verify`,
      });

      if (error) {
        console.error("Update email error details:", error);
        const errMsg = error.message.toLowerCase();
        if (errMsg.includes("rate limit") || errMsg.includes("exceeded") || errMsg.includes("smtp")) {
          setShowSmtpWarning(true);
          setSmtpWarningMsg(
            "Failed to send verification to new email due to Supabase email limitations. Please configure a custom SMTP provider in Supabase settings."
          );
        }
        throw error;
      }

      toast.success("Email updated! A verification link has been sent to your new email address.");
      setIsEditingEmail(false);
      setNewEmail("");
      triggerCooldown(60);
      
      // Reload profile to reflect changed email locally
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to update email address.");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleCheckVerificationStatus = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    try {
      // 1. Force reload user metadata from Supabase Auth
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      if (authUser?.email_confirmed_at) {
        // 2. Update database profile verified status to true
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ verified: true })
          .eq("id", authUser.id);

        if (profileError) throw profileError;

        toast.success("Email verified! Welcome to Expensia.");
        
        // 3. Force reload page to let AppLayout redirect to onboarding/dashboard
        window.location.href = "/";
      } else {
        toast.error("Email not verified yet. Please check your inbox and click the verification link.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to check verification status. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="verify-email-root">
      {/* Inline styles for wow-factor layout */}
      <style>{`
        .verify-email-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #09090b 0%, #111115 50%, #0c0819 100%);
          font-family: 'Inter', sans-serif;
          color: #f4f4f5;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
        }

        .verify-email-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          opacity: 0.25;
        }
        .verify-email-orb-1 {
          top: -12rem;
          left: -12rem;
          width: 40rem;
          height: 40rem;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
        }
        .verify-email-orb-2 {
          bottom: -12rem;
          right: -12rem;
          width: 40rem;
          height: 40rem;
          background: radial-gradient(circle, #ec4899 0%, transparent 70%);
        }

        .verify-email-card {
          width: 100%;
          max-width: 460px;
          background: rgba(24, 24, 27, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(63, 63, 70, 0.4);
          border-radius: 28px;
          padding: 2.5rem;
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
          position: relative;
          z-index: 10;
        }

        .verify-email-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 2rem;
        }

        .verify-email-icon-box {
          height: 72px;
          width: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%);
          border: 1px solid rgba(99, 102, 241, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818cf8;
          margin-bottom: 1.25rem;
          box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.2);
        }

        .verify-email-pill {
          background: rgba(63, 63, 70, 0.3);
          border: 1px solid rgba(82, 82, 91, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-family: monospace;
          color: #e4e4e7;
          font-size: 0.875rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          max-width: 100%;
          word-break: break-all;
          margin: 0.75rem 0;
        }

        .btn-verify-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          border: none;
          border-radius: 14px;
          padding: 0.875rem 1.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px -3px rgba(99, 102, 241, 0.4);
        }
        .btn-verify-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px -3px rgba(99, 102, 241, 0.5);
        }
        .btn-verify-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-verify-secondary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(39, 39, 42, 0.6);
          color: #e4e4e7;
          border: 1px solid rgba(63, 63, 70, 0.5);
          border-radius: 14px;
          padding: 0.875rem 1.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-verify-secondary:hover:not(:disabled) {
          background: rgba(39, 39, 42, 0.9);
          border-color: rgba(82, 82, 91, 0.8);
        }
        .btn-verify-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .verify-input {
          width: 100%;
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid rgba(63, 63, 70, 0.5);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }
        .verify-input:focus {
          outline: none;
          border-color: #6366f1;
        }

        .warning-banner {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.25);
          color: #f59e0b;
          border-radius: 16px;
          padding: 1rem;
          font-size: 0.825rem;
          line-height: 1.4;
          text-align: left;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 0.75rem;
        }

        .animated-pulse-circle {
          animation: verify-pulse 2s infinite;
        }
        @keyframes verify-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Glow Orbs */}
      <div className="verify-email-orb verify-email-orb-1" />
      <div className="verify-email-orb verify-email-orb-2" />

      <div className="verify-email-card">
        {/* Warning Banner for SMTP Rate Limiting */}
        {showSmtpWarning && (
          <div className="warning-banner">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">SMTP Notice:</span> {smtpWarningMsg}
            </div>
          </div>
        )}

        <div className="verify-email-header">
          <div className="verify-email-icon-box animated-pulse-circle">
            <Mail className="h-9 w-9" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Verify your Email</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-sm">
            We sent a verification link to your email address. Please click the link to confirm your account.
          </p>

          <div className="verify-email-pill mt-4">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span>{user?.email}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Main Action: I've Verified My Email */}
          <button 
            onClick={handleCheckVerificationStatus}
            disabled={isRefreshing}
            className="btn-verify-primary"
          >
            {isRefreshing ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            I've Verified My Email
          </button>

          {/* Resend Verification Email */}
          <button 
            onClick={handleResendEmail}
            disabled={cooldown > 0 || isResending}
            className="btn-verify-secondary"
          >
            {isResending ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : cooldown > 0 ? (
              <>
                <Clock className="h-5 w-5 text-indigo-400 animate-pulse" />
                Resend in {cooldown}s
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Resend Verification Email
              </>
            )}
          </button>

          {/* Edit Email Toggle */}
          {!isEditingEmail ? (
            <button 
              onClick={() => setIsEditingEmail(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold mt-4 transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Change Email Address
            </button>
          ) : (
            <form onSubmit={handleChangeEmail} className="mt-4 border-t border-zinc-800 pt-4 flex flex-col gap-2.5">
              <label className="text-xs text-zinc-400 text-left font-semibold">
                Enter your new email address:
              </label>
              <input 
                type="email" 
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new-email@example.com"
                className="verify-input"
              />
              <div className="flex gap-2">
                <button 
                  type="submit"
                  disabled={isUpdatingEmail}
                  className="flex-1 btn-verify-primary text-xs py-2"
                >
                  {isUpdatingEmail ? "Updating..." : "Update & Resend"}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditingEmail(false);
                    setNewEmail("");
                  }}
                  className="px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold rounded-xl text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Logout Button */}
          <button 
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
            className="mt-6 border-t border-zinc-800 pt-4 text-xs text-zinc-500 hover:text-zinc-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
