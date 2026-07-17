import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2, AlertTriangle, ArrowRight, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/verify")({
  component: VerifyPage,
});

function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    // Listen for auth state changes (Supabase client auto-parses token in hash)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && active && status === "loading") {
        await verifyUser(session.user.id);
      }
    });

    const checkAndVerify = async () => {
      try {
        // 1. Check if there is a 'code' query parameter in the URL (Supabase PKCE flow)
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get("code");
          if (code) {
            const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (!exchangeError && exchangeData?.session?.user) {
              await verifyUser(exchangeData.session.user.id);
              return;
            }
          }
        }

        // Wait 1 second to allow Supabase to process URL hash parameter tokens
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!active) return;

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await verifyUser(session.user.id);
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await verifyUser(user.id);
          } else {
            // Check if nothing is found after 3 seconds, show verification error
            setTimeout(() => {
              if (active && status === "loading") {
                setStatus("error");
                setErrorMsg("We couldn't establish a verified session. Please request a new link or sign in.");
              }
            }, 3000);
          }
        }
      } catch (err: any) {
        if (active) {
          setStatus("error");
          setErrorMsg(err.message || "An unexpected error occurred during verification.");
        }
      }
    };

    const verifyUser = async (userId: string) => {
      try {
        // Update verified = true in public.profiles table
        const { error } = await supabase
          .from("profiles")
          .update({ verified: true })
          .eq("id", userId);

        if (error) {
          console.error("Error setting verified column:", error);
          // RLS might fail if profile is not fully created yet, retry once
          await new Promise((r) => setTimeout(r, 1000));
          const { error: retryError } = await supabase
            .from("profiles")
            .update({ verified: true })
            .eq("id", userId);

          if (retryError) {
            if (active) {
              setStatus("error");
              setErrorMsg("Database profile verification failed: " + retryError.message);
            }
            return;
          }
        }

        if (active) {
          setStatus("success");
        }
      } catch (err: any) {
        if (active) {
          setStatus("error");
          setErrorMsg(err.message || "Failed to finalize database profile verification.");
        }
      }
    };

    checkAndVerify();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="verify-root">
      {/* Inline Scoped Styles for Wow-Factor Premium Animation */}
      <style>{`
        .verify-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #09090b 0%, #111115 50%, #0d0614 100%);
          font-family: 'Inter', sans-serif;
          color: #f4f4f5;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
        }

        .verify-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.35;
        }
        .verify-orb-1 {
          top: -10rem;
          left: -10rem;
          width: 35rem;
          height: 35rem;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
        }
        .verify-orb-2 {
          bottom: -10rem;
          right: -10rem;
          width: 35rem;
          height: 35rem;
          background: radial-gradient(circle, #a855f7 0%, transparent 70%);
        }

        .verify-card {
          width: 100%;
          max-width: 440px;
          background: rgba(24, 24, 27, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(63, 63, 70, 0.4);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          text-align: center;
          position: relative;
          z-index: 10;
        }

        /* Success Animation Classes */
        .animated-checkmark-wrapper {
          width: 90px;
          height: 90px;
          margin: 0 auto 1.5rem;
          position: relative;
        }

        .success-checkmark-circle {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          stroke: #10b981;
          stroke-width: 4;
          stroke-miterlimit: 10;
          fill: none;
          animation: draw-circle 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .success-checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 90;
          stroke-dashoffset: 90;
          stroke: #10b981;
          stroke-width: 5;
          stroke-linecap: round;
          fill: none;
          animation: draw-check 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.7s forwards;
        }

        @keyframes draw-circle {
          100% { stroke-dashoffset: 0; }
        }

        @keyframes draw-check {
          100% { stroke-dashoffset: 0; }
        }

        /* Ripple pulse effect */
        .checkmark-ripple {
          position: absolute;
          top: 0;
          left: 0;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 2px solid rgba(16, 185, 129, 0.4);
          animation: checkmark-pulse 1.8s ease-out infinite 1s;
          opacity: 0;
        }

        @keyframes checkmark-pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        /* Loading Ring */
        .spinner-loading {
          animation: spin 1.2s linear infinite;
          color: #6366f1;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .verify-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: opacity 0.2s;
          margin-top: 1.5rem;
        }
        .verify-btn:hover {
          opacity: 0.95;
        }
      `}</style>

      {/* Background orbs */}
      <div className="verify-orb verify-orb-1" />
      <div className="verify-orb verify-orb-2" />

      <div className="verify-card">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="h-14 w-14 spinner-loading" />
            <h2 className="text-xl font-bold tracking-tight mt-2">Confirming email address...</h2>
            <p className="text-sm text-zinc-400 max-w-sm">
              Please wait while we verify your credentials and establish your secure financial vault.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-2">
            <div className="animated-checkmark-wrapper">
              <div className="checkmark-ripple" />
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="42" className="success-checkmark-circle" />
                <path d="M30 52 L44 65 L70 35" className="success-checkmark-check" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-emerald-400 tracking-tight mt-1">Verification Successful!</h2>
            <p className="text-sm text-zinc-300 max-w-xs mt-2">
              Your email has been verified. You can now access your dashboard.
            </p>
            <Link to="/" className="w-full">
              <button className="verify-btn">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-500">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-rose-400 mt-2">Verification Failed</h2>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
              {errorMsg}
            </p>
            <div className="flex flex-col gap-2 w-full mt-4">
              <Link to="/login" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 text-white border border-zinc-700 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-700 transition-colors">
                  Back to Login <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
