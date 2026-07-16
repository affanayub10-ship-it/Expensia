import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Crown, Sparkles, Check, Shield, Zap, BarChart3, PiggyBank, Brain,
  Wallet, CreditCard, Lock, Loader2, ChevronRight, Star,
  Calendar, RefreshCw, CreditCard as CreditCardIcon, Receipt, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSubscription } from "@/context/SubscriptionContext";
import { useApp } from "@/context/AppContext";
import { ManageSubscriptionModal } from "@/components/ManageSubscriptionModal";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/premium")({ component: PremiumPage });

type BillingInterval = "monthly" | "yearly";

const MONTHLY_PRICE = 9;
const YEARLY_PRICE = 90;

const COMPARISON_ROWS = [
  { feature: "Expense Tracking", free: true, premium: true },
  { feature: "Income Management", free: true, premium: true },
  { feature: "Dashboard Overview", free: true, premium: true },
  { feature: "Basic Reports", free: true, premium: true },
  { feature: "Recurring Income", free: true, premium: true },
  { feature: "CSV / JSON Export", free: true, premium: true },
  { feature: "Receipt Attachments", free: true, premium: true },
  { feature: "Budget Management", free: false, premium: true },
  { feature: "Savings Goals", free: false, premium: true },
  { feature: "Advanced Analytics", free: false, premium: true },
  { feature: "AI Predictions", free: false, premium: true },
  { feature: "Unlimited Budgets & Goals", free: false, premium: true },
  { feature: "Priority Support", free: false, premium: true },
  { feature: "Future Premium Features", free: false, premium: true },
];

const PREMIUM_FEATURES = [
  {
    icon: Wallet,
    title: "Budget Management",
    description: "Create and track budgets across categories with real-time alerts.",
  },
  {
    icon: PiggyBank,
    title: "Savings Goals",
    description: "Set savings targets, track progress, and build better habits.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into your spending patterns and financial health.",
  },
  {
    icon: Brain,
    title: "AI Predictions",
    description: "Smart forecasts based on your income and spending history.",
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Get help faster with priority email and chat support.",
  },
  {
    icon: Star,
    title: "Everything Unlocked",
    description: "No limits on budgets, goals, or any premium feature.",
  },
];

async function createCheckoutSession(priceId: string): Promise<string | null> {
  console.log("[Stripe] createCheckoutSession called with priceId:", priceId);
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error("[Stripe] ❌ No auth session found - user not logged in");
    throw new Error("You must be logged in to purchase premium");
  }
  
  console.log("[Stripe] ✅ Auth session found");
  console.log("[Stripe] 📡 Invoking create-checkout edge function...");
  
  const res = await supabase.functions.invoke("create-checkout", {
    body: {
      priceId,
      successUrl: `${window.location.origin}/premium?success=true`,
      cancelUrl: `${window.location.origin}/premium?canceled=true`,
    },
  });
  
  console.log("[Stripe] 📥 Edge function response:", res);
  
  if (res.error) {
    console.error("[Stripe] ❌ Edge function returned error:", res.error);
    console.error("[Stripe] ❌ Error details:", JSON.stringify(res.error, null, 2));
    
    // Check for common errors
    if (res.error.message?.includes("STRIPE_SECRET_KEY")) {
      throw new Error("Stripe not configured: Missing STRIPE_SECRET_KEY in Supabase Edge Functions. Check STRIPE_CHECKOUT_FIX.md");
    }
    
    throw new Error(res.error.message || "Edge function failed");
  }
  
  if (!res.data?.url) {
    console.error("[Stripe] ❌ No checkout URL in response");
    console.error("[Stripe] ❌ Full response data:", JSON.stringify(res.data, null, 2));
    throw new Error("Edge function did not return a checkout URL");
  }
  
  console.log("[Stripe] ✅ Checkout URL received:", res.data.url);
  return res.data.url;
}

function PremiumPage() {
  const { isPremium, subscription, refreshSubscription } = useSubscription();
  const { addNotification } = useApp();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<BillingInterval>("monthly");
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
    const params = new URLSearchParams(window.location.search);
    
    if (params.get("success") === "true") {
      console.log("[Premium] ✅ Payment success detected, refreshing subscription...");
      
      // Force refresh subscription immediately
      refreshSubscription().then(() => {
        console.log("[Premium] ✅ Subscription refreshed");
        
        const from = new Date().toLocaleDateString();
        const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
        addNotification("🎉 Premium Activated", `Your Premium subscription is active from ${from} to ${to}.`);
        toast.success("🎉 Payment successful! Premium is now active.");
        
        // Clear URL params
        window.history.replaceState({}, "", "/premium");
        
        // Reload subscription data again after a short delay to ensure webhook processed
        setTimeout(() => {
          console.log("[Premium] 🔄 Second refresh to ensure webhook completed");
          refreshSubscription();
        }, 2000);
      });
      
    } else if (params.get("canceled") === "true") {
      toast.info("Checkout canceled. Your plan was not changed.");
      window.history.replaceState({}, "", "/premium");
    }
  }, [refreshSubscription, addNotification]);

  const price = billing === "monthly" ? MONTHLY_PRICE : YEARLY_PRICE;
  const yearlyMonthly = Math.round((YEARLY_PRICE / 12) * 10) / 10;

  const handleSubscribe = async () => {
    console.log("[Stripe] Upgrade button clicked, billing cycle:", billing);
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { 
        console.log("[Stripe] No user, redirecting to login"); 
        navigate({ to: "/login" }); 
        return; 
      }
      console.log("[Stripe] User authenticated:", user.id);

      const monthlyPriceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID ?? "";
      const yearlyPriceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID_YEARLY ?? "";
      console.log("[Stripe] Monthly price ID:", monthlyPriceId);
      console.log("[Stripe] Yearly price ID:", yearlyPriceId || "(not set — will use monthly)");
      
      const priceId = billing === "yearly" && yearlyPriceId && !yearlyPriceId.includes("your_stripe")
        ? yearlyPriceId
        : monthlyPriceId;
      const hasPrice = priceId && !priceId.includes("your_stripe") && priceId.length > 0;
      
      console.log("[Stripe] Selected price ID:", priceId, "| hasPrice:", hasPrice);

      if (!hasPrice) {
        console.warn("[Stripe] ⚠️ No valid Stripe price ID configured!");
        console.warn("[Stripe] ⚠️ Falling back to DEMO MODE (direct database update)");
        console.warn("[Stripe] ⚠️ This will NOT process real payments!");
        toast.warning("Demo mode active - no real payment processed");
      }

      if (hasPrice) {
        console.log("[Stripe] ✅ Valid price ID found, creating Stripe checkout session...");
        try {
          const checkoutUrl = await createCheckoutSession(priceId);
          if (checkoutUrl) {
            console.log("[Stripe] ✅ Checkout URL received:", checkoutUrl);
            console.log("[Stripe] 🔄 Redirecting to Stripe Checkout...");
            toast.info("Redirecting to secure checkout...");
            window.location.href = checkoutUrl;
            return; // Stop execution after redirect
          } else {
            console.error("[Stripe] ❌ Edge function returned success but no URL");
            toast.error("Failed to create checkout session. Check console for details.");
            return;
          }
        } catch (checkoutError) {
          console.error("[Stripe] ❌ Checkout session creation failed:", checkoutError);
          toast.error(`Checkout failed: ${(checkoutError as Error).message}`);
          return;
        }
      } else {
        // Demo mode fallback - direct database update (no Stripe)
        console.log("[Stripe] 🎭 DEMO MODE: Directly updating subscription in database");
        const periodDays = billing === "yearly" ? 365 : 30;
        const { error } = await supabase.from("subscriptions").upsert(
          {
            user_id: user.id,
            subscription_plan: "premium",
            subscription_status: "active",
            current_period_end: new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000).toISOString(),
          },
          { onConflict: "user_id" }
        );
        if (error) {
          console.error("[Stripe] Demo upsert failed:", error);
          throw error;
        }
        console.log("[Stripe] Demo upsert succeeded");
        await refreshSubscription();
        const from = new Date().toLocaleDateString();
        const to = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000).toLocaleDateString();
        const planLabel = billing === "yearly" ? "Yearly" : "Monthly";
        addNotification("🎉 Premium Activated (Demo)", `Your ${planLabel} Premium is active from ${from} to ${to}.`);
        toast.success("Demo: Premium activated without payment");
        navigate({ to: "/" });
      }
    } catch (err) {
      console.error("[Stripe] ❌ Upgrade error:", err);
      toast.error(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <>
        <div className="mx-auto max-w-3xl pb-16">
          {/* Premium Hero */}
          <div className="text-center pt-10 pb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-income/10 px-4 py-1.5 ring-1 ring-income/20">
              <Crown className="h-4 w-4 text-income" />
              <span className="text-sm font-semibold text-income">Premium Active</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Your Subscription</h1>
            <p className="mt-2 text-muted-foreground">Manage your plan, billing, and subscription settings.</p>
          </div>

          {/* Subscription Overview */}
          <Card className="shadow-soft mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-income/20 to-income/5 ring-1 ring-income/20">
                    <Crown className="h-8 w-8 text-income" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-foreground capitalize">{subscription.plan} Plan</h2>
                      <Badge className="bg-income/10 text-income border-income/20">
                        {subscription.cancelAtPeriodEnd ? "Cancelling" : "Active"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {subscription.billingCycle === "yearly" ? "$90/year" : "$9/month"}
                      {subscription.cancelAtPeriodEnd
                        ? ` · Active until ${new Date(subscription.currentPeriodEnd!).toLocaleDateString()}`
                        : subscription.currentPeriodEnd
                        ? ` · Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                </div>
                <Button className="gap-2 rounded-xl" onClick={() => setManageOpen(true)}>
                  <Crown className="h-4 w-4" />
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <Card className="shadow-soft">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Billing Cycle</p>
                  <p className="text-sm font-semibold text-foreground capitalize">{subscription.billingCycle}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-income/10">
                  <RefreshCw className="h-5 w-5 text-income" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Auto Renewal</p>
                  <p className="text-sm font-semibold text-foreground">
                    {subscription.cancelAtPeriodEnd ? "Off" : "On"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                  <CreditCardIcon className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Next Payment</p>
                  <p className="text-sm font-semibold text-foreground">
                    {subscription.currentPeriodEnd
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Features Summary */}
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Premium Features</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {PREMIUM_FEATURES.slice(0, 6).map((f) => (
                  <div key={f.title} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-income shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{f.title}</p>
                      <p className="text-xs text-muted-foreground">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {subscription.cancelAtPeriodEnd && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Cancellation Scheduled</p>
                <p className="text-muted-foreground mt-1">
                  Your Premium subscription is set to cancel on {new Date(subscription.currentPeriodEnd!).toLocaleDateString()}.
                  You can resume your subscription anytime before then.
                </p>
              </div>
            </div>
          )}
        </div>
        <ManageSubscriptionModal open={manageOpen} onClose={() => { setManageOpen(false); refreshSubscription(); }} />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-16">
      {/* Hero */}
      <div className={cn("text-center pt-8 pb-6 transition-all duration-700", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 px-4 py-1.5 ring-1 ring-amber-500/20">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Premium</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
          Take Control of Your<br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Financial Future</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Unlock powerful tools to budget smarter, save faster, and predict your financial future with AI.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className={cn("flex justify-center mb-10 transition-all duration-700 delay-100", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="relative inline-flex items-center rounded-2xl bg-muted p-1.5 ring-1 ring-border">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "relative z-10 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200",
              billing === "monthly" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={cn(
              "relative z-10 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200",
              billing === "yearly" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
          </button>
          <div
            className={cn(
              "absolute top-1.5 bottom-1.5 rounded-xl bg-background shadow-sm transition-all duration-300 ease-out",
              billing === "monthly" ? "left-1.5 right-1/2" : "left-1/2 right-1.5"
            )}
          />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className={cn("grid gap-6 md:grid-cols-2 mb-12 transition-all duration-700 delay-200", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        {/* Free Card */}
        <div className="relative rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <Zap className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Free</h3>
              <p className="text-xs text-muted-foreground">Basic tracking</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-black text-foreground">$0</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {COMPARISON_ROWS.filter(r => r.free).map(r => (
              <li key={r.feature} className="flex items-start gap-2.5 text-sm">
                <Check className="h-4 w-4 text-income shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{r.feature}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full rounded-xl" disabled>
            Current Plan
          </Button>
        </div>

        {/* Premium Card */}
        <div className="relative rounded-2xl border-2 border-primary/50 bg-card p-6 shadow-lg transition-all hover:shadow-xl animate-in zoom-in-95 duration-300">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
              <Sparkles className="mr-1 h-3 w-3" /> Most Popular
            </Badge>
          </div>
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Premium</h3>
              <p className="text-xs text-muted-foreground">Everything unlocked</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-black text-foreground">
              ${billing === "yearly" ? YEARLY_PRICE : MONTHLY_PRICE}
            </span>
            <span className="text-muted-foreground text-sm">
              {billing === "yearly" ? "/year" : "/month"}
            </span>
          </div>
          {billing === "yearly" && (
            <p className="text-xs text-income font-medium mb-5">
              ${yearlyMonthly}/month — save ${MONTHLY_PRICE * 12 - YEARLY_PRICE}/year
            </p>
          )}
          {billing === "monthly" && <div className="mb-5" />}
          <ul className="space-y-3 mb-6">
            {PREMIUM_FEATURES.map(f => (
              <li key={f.title} className="flex items-start gap-2.5 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground">{f.title}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full rounded-xl gap-2 h-11 text-base shadow-lg"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Continue to Secure Payment
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className={cn("mb-12 transition-all duration-700 delay-300", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">Compare Plans</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Feature</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground w-28">Free</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-primary w-28">Premium</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={row.feature} className={cn("border-b border-border last:border-0", i % 2 === 0 ? "bg-background" : "bg-muted/20")}>
                  <td className="px-6 py-3.5 text-sm text-foreground">{row.feature}</td>
                  <td className="px-6 py-3.5 text-center">
                    {row.free ? (
                      <Check className="h-4 w-4 text-income mx-auto" />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Check className="h-4 w-4 text-primary mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Features Detail */}
      <div className={cn("mb-12 transition-all duration-700 delay-[400ms]", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">Everything You Get</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PREMIUM_FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={cn(
                "rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/30",
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className={cn("text-center transition-all duration-700 delay-500", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border bg-muted/30 px-8 py-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Secure checkout
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" />
            Powered by Stripe
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            Cancel anytime
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5" />
            No hidden fees
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          By subscribing, you agree to our Terms of Service. Your payment data is securely processed by Stripe.
        </p>
      </div>
    </div>
  );
}
