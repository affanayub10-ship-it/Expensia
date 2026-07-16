import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Crown, Zap, Shield, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared";
import { useSubscription } from "@/context/SubscriptionContext";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

const FREE_FEATURES = [
  "Unlimited expense tracking",
  "Add & manage income",
  "Dashboard overview",
  "Basic reports & analytics",
  "Recurring income scheduling",
  "Export CSV / JSON",
  "Receipt attachments",
];

const PREMIUM_FEATURES = [
  "Everything in Free",
  "Budget Management",
  "Savings Goals",
  "Advanced Analytics",
  "Financial Predictions",
  "AI Insights",
  "Unlimited budgets & goals",
  "Priority support",
  "All future premium features",
];

async function createCheckoutSession(userId: string, priceId: string): Promise<string | null> {
  console.log("[Stripe] Creating checkout session for user:", userId, "priceId:", priceId);
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error("[Stripe] ❌ No auth session");
    throw new Error("Not authenticated");
  }

  console.log("[Stripe] 📡 Invoking create-checkout edge function...");
  const res = await supabase.functions.invoke("create-checkout", {
    body: {
      priceId,
      successUrl: `${window.location.origin}/pricing?success=true`,
      cancelUrl: `${window.location.origin}/pricing?canceled=true`,
    },
  });

  console.log("[Stripe] 📥 Response:", res);
  
  if (res.error) {
    console.error("[Stripe] ❌ Error:", res.error);
    throw new Error(res.error.message || "Edge function failed");
  }
  
  if (!res.data?.url) {
    console.error("[Stripe] ❌ No URL in response");
    throw new Error("No checkout URL returned");
  }
  
  console.log("[Stripe] ✅ Checkout URL:", res.data.url);
  return res.data.url;
}

function PricingPage() {
  const { subscription, isPremium, refreshSubscription } = useSubscription();
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get("success") === "true") {
      console.log("[Pricing] ✅ Payment success detected, refreshing subscription...");
      
      // Force refresh subscription immediately
      refreshSubscription().then(() => {
        console.log("[Pricing] ✅ Subscription refreshed");
        
        const from = new Date().toLocaleDateString();
        const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
        addNotification("🎉 Premium Activated", `Your Premium subscription is active from ${from} to ${to}.`);
        toast.success("🎉 Payment successful! Premium is now active.");
        
        // Clear URL params
        window.history.replaceState({}, "", "/pricing");
        
        // Reload subscription data again after a short delay
        setTimeout(() => {
          console.log("[Pricing] 🔄 Second refresh to ensure webhook completed");
          refreshSubscription();
        }, 2000);
      });
      
    } else if (params.get("canceled") === "true") {
      toast.info("Checkout canceled. Your plan was not changed.");
      window.history.replaceState({}, "", "/pricing");
    }
  }, [refreshSubscription, addNotification]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { 
        console.log("[Stripe] No user, redirecting to login");
        navigate({ to: "/login" }); 
        return; 
      }

      const priceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID ?? "";
      const hasPrice = priceId && !priceId.includes("your_stripe") && priceId.length > 0;

      console.log("[Stripe] Price ID:", priceId, "| Valid:", hasPrice);

      if (!hasPrice) {
        console.warn("[Stripe] ⚠️ DEMO MODE: No valid Stripe price ID");
        toast.warning("Demo mode - no real payment");
        
        // Demo mode — directly set premium
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
        addNotification("🎉 Premium Activated (Demo)", `Your Premium is active from ${from} to ${to}.`);
        toast.success("Demo: Premium activated without payment");
        navigate({ to: "/" });
        return;
      }

      // Real Stripe via Edge Function
      console.log("[Stripe] ✅ Creating Stripe checkout session...");
      const checkoutUrl = await createCheckoutSession(user.id, priceId);
      if (checkoutUrl) {
        console.log("[Stripe] ✅ Redirecting to:", checkoutUrl);
        toast.info("Redirecting to secure checkout...");
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("[Stripe] ❌ Error:", err);
      toast.error(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your Premium subscription?")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("subscriptions").upsert(
      { user_id: user.id, subscription_plan: "free", subscription_status: "active", stripe_subscription_id: null },
      { onConflict: "user_id" }
    );
    await refreshSubscription();
    toast.success("Subscription canceled. You're now on the Free plan.");
  };

  return (
    <>
      <PageHeader
        title="Subscription Plans"
        description="Choose the plan that fits your financial journey."
      />

      <div className="mx-auto max-w-3xl">
        {isPremium && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-income/30 bg-income/8 px-4 py-3 text-sm text-income">
            <Shield className="h-4 w-4 shrink-0" />
            <span>
              You're on the <strong>Premium plan</strong>.
              {subscription.currentPeriodEnd &&
                ` Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.`}
            </span>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Free Plan */}
          <Card className={cn("rounded-2xl border-2 transition-all", !isPremium ? "border-primary shadow-md" : "border-border")}>
            <CardHeader className="pb-2 pt-6 px-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Free</h2>
                  {!isPremium && <Badge variant="secondary" className="text-[10px] mt-0.5">Current Plan</Badge>}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">$0</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-5">
              <ul className="space-y-2.5">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-income shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-xl" disabled>
                {!isPremium ? "Current Plan" : "Free Plan"}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={cn("rounded-2xl border-2 transition-all", isPremium ? "border-primary shadow-md" : "border-primary/50")}>
            <CardHeader className="pb-2 pt-6 px-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary">Premium</h2>
                  {isPremium && <Badge className="text-[10px] mt-0.5">Active</Badge>}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">$9</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-5">
              <ul className="space-y-2.5">
                {PREMIUM_FEATURES.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className={f === "Everything in Free" ? "text-muted-foreground" : ""}>{f}</span>
                  </li>
                ))}
              </ul>

              {isPremium ? (
                <div className="space-y-2">
                  <div className="rounded-xl bg-income/10 px-3 py-2.5 text-xs text-income flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 shrink-0" />
                    Premium is active — all features unlocked!
                  </div>
                  <Button variant="outline" className="w-full rounded-xl text-expense hover:text-expense" onClick={handleCancel}>
                    Cancel Subscription
                  </Button>
                </div>
              ) : (
                <Button className="w-full rounded-xl gap-2" onClick={handleUpgrade} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Secure payments powered by Stripe · Cancel anytime · No hidden fees
        </p>
      </div>
    </>
  );
}
