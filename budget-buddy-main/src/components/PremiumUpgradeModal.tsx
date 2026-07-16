import { useState } from "react";
import { Crown, Sparkles, Check, Loader2, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "@tanstack/react-router";
import { useSubscription } from "@/context/SubscriptionContext";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const PREMIUM_FEATURES = [
  "Budget Management",
  "Savings Goals",
  "Advanced Analytics",
  "Financial Predictions",
  "AI-Powered Insights",
  "Unlimited budgets & goals",
  "Priority support",
  "All future premium features",
];

export function PremiumUpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { refreshSubscription } = useSubscription();
  const { addNotification } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please log in first"); return; }

      const priceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID ?? "";
      const hasPrice = priceId && !priceId.includes("your_stripe");

      if (!hasPrice) {
        const { error } = await supabase.from("subscriptions").upsert(
          {
            user_id: user.id,
            subscription_plan: "premium",
            subscription_status: "active",
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          { onConflict: "user_id" }
        );
        if (error) throw error;
        await refreshSubscription();
        const from = new Date().toLocaleDateString();
        const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
        addNotification("🎉 Premium Activated", `Your Premium subscription is active from ${from} to ${to}.`);
        toast.success("Welcome to Premium! All features unlocked.");
        onClose();
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const res = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId,
          successUrl: `${window.location.origin}/premium?success=true`,
          cancelUrl: `${window.location.origin}/premium?canceled=true`,
        },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 ring-1 ring-primary/20">
            <Crown className="h-7 w-7 text-primary" />
          </div>

          <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> PREMIUM
          </span>

          <h2 className="mt-3 text-xl font-bold text-foreground">Unlock Premium</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm">
            Get full control of your finances with advanced tools, predictions, and insights.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">What you'll get:</p>
          <div className="grid grid-cols-1 gap-2">
            {PREMIUM_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-baseline justify-center gap-1">
          <span className="text-3xl font-black text-foreground">$9</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <Button className="w-full gap-2 rounded-xl h-11 text-base" onClick={handleUpgrade} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Processing..." : "Upgrade to Premium"}
          </Button>
          <Button variant="ghost" className="w-full rounded-xl text-muted-foreground" onClick={onClose}>
            Maybe Later
          </Button>
          <button
            onClick={() => { onClose(); navigate({ to: "/premium" }); }}
            className="inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Compare plans <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Secure payments via Stripe · Cancel anytime
        </p>
      </div>
    </div>
  );
}
