import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export type Plan = "free" | "premium";
export type SubStatus = "active" | "canceled" | "past_due" | "trialing" | "cancelling";
export type BillingCycle = "monthly" | "yearly";

export interface Subscription {
  plan: Plan;
  status: SubStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  billingCycle: BillingCycle;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface SubscriptionContextValue {
  subscription: Subscription;
  isPremium: boolean;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
}

const DEFAULT_SUBSCRIPTION: Subscription = {
  plan: "free",
  status: "active",
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  billingCycle: "monthly",
  currentPeriodStart: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};

const SubscriptionContext = createContext<SubscriptionContextValue>({
  subscription: DEFAULT_SUBSCRIPTION,
  isPremium: false,
  isLoading: true,
  refreshSubscription: async () => {},
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription>(DEFAULT_SUBSCRIPTION);
  const [isLoading, setIsLoading] = useState(true);

  const loadSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubscription(DEFAULT_SUBSCRIPTION);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        // Create free subscription if missing
        await supabase.from("subscriptions").upsert(
          { user_id: user.id, subscription_plan: "free", subscription_status: "active" },
          { onConflict: "user_id" }
        );
        setSubscription(DEFAULT_SUBSCRIPTION);
      } else {
        setSubscription({
          plan: (data.subscription_plan as Plan) ?? "free",
          status: (data.subscription_status as SubStatus) ?? "active",
          stripeCustomerId: data.stripe_customer_id ?? null,
          stripeSubscriptionId: data.stripe_subscription_id ?? null,
          billingCycle: (data.billing_cycle as BillingCycle) ?? "monthly",
          currentPeriodStart: data.current_period_start ?? null,
          currentPeriodEnd: data.current_period_end ?? null,
          cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
        });
      }
    } catch (err) {
      console.error("Failed to load subscription:", err);
      setSubscription(DEFAULT_SUBSCRIPTION);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          loadSubscription();
        } else {
          setSubscription(DEFAULT_SUBSCRIPTION);
          setIsLoading(false);
        }
      }
    );

    return () => authSub.unsubscribe();
  }, []);

  const isPremium =
    subscription.plan === "premium" &&
    (subscription.status === "active" || subscription.status === "trialing" || subscription.status === "cancelling");

  return (
    <SubscriptionContext.Provider
      value={{ subscription, isPremium, isLoading, refreshSubscription: loadSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  // Return safe default if called outside provider (prevents null crash)
  if (!ctx) {
    return {
      subscription: DEFAULT_SUBSCRIPTION,
      isPremium: false,
      isLoading: false,
      refreshSubscription: async () => {},
    };
  }
  return ctx;
}
