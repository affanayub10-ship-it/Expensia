import { useState, useEffect } from "react";
import { Crown, Shield, Sparkles, CreditCard, Download, ExternalLink, Receipt, Calendar, CircleAlert, Loader2, X, CheckCircle2, XCircle, AlertCircle, RefreshCw, PauseCircle, PlayCircle, ArrowUpCircle, ArrowDownCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/context/SubscriptionContext";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabase";
import { getPaymentHistory } from "@/lib/supabase-db";
import type { PaymentHistory } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Active", color: "text-income", icon: CheckCircle2 },
  cancelling: { label: "Cancelling", color: "text-amber-500", icon: AlertCircle },
  canceled: { label: "Canceled", color: "text-expense", icon: XCircle },
  past_due: { label: "Past Due", color: "text-expense", icon: AlertCircle },
  trialing: { label: "Trial", color: "text-primary", icon: Shield },
};

const PAYMENT_STATUS: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  succeeded: { label: "Paid", color: "text-income", icon: CheckCircle2 },
  completed: { label: "Completed", color: "text-income", icon: CheckCircle2 },
  processing: { label: "Processing", color: "text-amber-500", icon: AlertCircle },
  failed: { label: "Failed", color: "text-expense", icon: XCircle },
  pending: { label: "Pending", color: "text-muted-foreground", icon: CircleAlert },
};

export function ManageSubscriptionModal({ open, onClose }: Props) {
  const { subscription, isPremium, refreshSubscription } = useSubscription();
  const { addNotification } = useApp();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (open) loadPaymentHistory();
  }, [open]);

  async function loadPaymentHistory() {
    setHistoryLoading(true);
    try {
      const data = await getPaymentHistory();
      setPaymentHistory(data);
    } catch (err) {
      console.error("Failed to load payment history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleCancel() {
    setActionLoading("cancel");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (subscription.stripeSubscriptionId) {
        await supabase.functions.invoke("cancel-subscription", {
          body: { subscriptionId: subscription.stripeSubscriptionId },
        });
      }

      const { error } = await supabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          subscription_plan: "premium",
          subscription_status: "cancelling",
          cancel_at_period_end: true,
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
      await refreshSubscription();
      addNotification("Subscription Cancelling", "Your Premium will remain active until the end of the billing period, then cancel automatically.");
      toast.success("Cancellation scheduled. Premium active until period end.");
      setConfirmCancel(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel subscription.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleResume() {
    setActionLoading("resume");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (subscription.stripeSubscriptionId) {
        await supabase.functions.invoke("cancel-subscription", {
          body: { subscriptionId: subscription.stripeSubscriptionId, cancel: false },
        });
      }

      const { error } = await supabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          subscription_plan: "premium",
          subscription_status: "active",
          cancel_at_period_end: false,
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
      await refreshSubscription();
      addNotification("Subscription Resumed", "Your Premium subscription has been reactivated and will continue normally.");
      toast.success("Subscription resumed successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resume subscription.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRenew() {
    setActionLoading("renew");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const priceId = import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID ?? "";
      if (priceId && !priceId.includes("your_stripe")) {
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
        if (res.data?.url) { window.location.href = res.data.url; return; }
      }

      const { error } = await supabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          subscription_plan: "premium",
          subscription_status: "active",
          cancel_at_period_end: false,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          current_period_start: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
      await refreshSubscription();
      toast.success("Subscription renewed successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to renew subscription.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUpdatePayment() {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");
      const res = await supabase.functions.invoke("create-portal-session", {});
      if (res.error) throw new Error(res.error.message);
      if (res.data?.url) { window.location.href = res.data.url; return; }
      toast.error("Could not open payment settings.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to open payment settings.");
    } finally {
      setPortalLoading(false);
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  }

  if (!open) return null;

  const statusInfo = STATUS_CONFIG[subscription.status] ?? STATUS_CONFIG.active;
  const StatusIcon = statusInfo.icon;
  const amount = subscription.plan === "premium" ? (subscription.billingCycle === "yearly" ? "$90" : "$9") : "$0";
  const isActive = subscription.status === "active" || subscription.status === "trialing";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="relative mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-0 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Manage Subscription</h2>
              <p className="text-xs text-muted-foreground">Manage your plan, billing, and payment settings</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* ───── Subscription Information ───── */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Subscription Information
            </h3>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              <Row label="Current Plan">
                <div className="flex items-center gap-2">
                  {isPremium ? <Crown className="h-4 w-4 text-primary" /> : <Sparkles className="h-4 w-4 text-muted-foreground" />}
                  <span className="font-medium capitalize">{subscription.plan}</span>
                </div>
              </Row>
              <Row label="Status">
                <div className="flex items-center gap-1.5">
                  <StatusIcon className={cn("h-4 w-4", statusInfo.color)} />
                  <span className={cn("text-sm font-medium", statusInfo.color)}>{statusInfo.label}</span>
                </div>
              </Row>
              <Row label="Start Date">{formatDate(subscription.currentPeriodStart)}</Row>
              <Row label="Renewal Date">{formatDate(subscription.currentPeriodEnd)}</Row>
              <Row label="Amount Paid">{amount}</Row>
              <Row label="Billing Cycle">
                <span className="capitalize">{subscription.billingCycle}</span>
              </Row>
              <Row label="Auto Renewal">
                <div className="flex items-center gap-1.5">
                  <div className={cn("h-2 w-2 rounded-full", subscription.cancelAtPeriodEnd ? "bg-expense" : "bg-income")} />
                  <span>{subscription.cancelAtPeriodEnd ? "Off (cancelling)" : "On"}</span>
                </div>
              </Row>
            </div>
          </section>

          {/* ───── Payment Method ───── */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              Payment Method
            </h3>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Stripe Secure Checkout</p>
                    <p className="text-xs text-muted-foreground">Your payment info is securely stored by Stripe</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleUpdatePayment} disabled={portalLoading}>
                  {portalLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                  {portalLoading ? "Opening..." : "Update"}
                </Button>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                We never store card numbers, CVV, or expiry dates. All payment data is handled securely by Stripe.
              </p>
            </div>
          </section>

          {/* ───── Payment History ───── */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Receipt className="h-4 w-4 text-primary" />
              Payment History
            </h3>
            {historyLoading ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-8 text-center">
                <Receipt className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No payment history yet</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Date</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Invoice</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Amount</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((p, i) => {
                      const ps = PAYMENT_STATUS[p.payment_status] ?? PAYMENT_STATUS.pending;
                      const PIcon = ps.icon;
                      return (
                        <tr key={p.id} className={cn("border-b border-border last:border-0", i % 2 === 0 ? "bg-background" : "bg-muted/20")}>
                          <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                            {formatDate(p.payment_date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                            {p.invoice_id ? p.invoice_id.slice(0, 14) + "..." : "—"}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {formatCurrency(p.amount, p.currency)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <PIcon className={cn("h-3.5 w-3.5", ps.color)} />
                              <span className={cn("text-xs", ps.color)}>{ps.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {p.receipt_url && (
                              <a href={p.receipt_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                                <Download className="h-3 w-3" /> Receipt
                              </a>
                            )}
                            {p.invoice_url && (
                              <a href={p.invoice_url} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                                Invoice <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ───── Subscription Controls ───── */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <PauseCircle className="h-4 w-4 text-primary" />
              Subscription Controls
            </h3>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap gap-2">
                {isPremium && !subscription.cancelAtPeriodEnd && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-expense hover:text-expense" onClick={() => setConfirmCancel(true)} disabled={actionLoading !== null}>
                    {actionLoading === "cancel" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PauseCircle className="h-3.5 w-3.5" />}
                    Cancel Subscription
                  </Button>
                )}
                {isPremium && subscription.cancelAtPeriodEnd && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-income hover:text-income" onClick={handleResume} disabled={actionLoading !== null}>
                    {actionLoading === "resume" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
                    Resume Subscription
                  </Button>
                )}
                {(subscription.status === "canceled" || subscription.status === "past_due") && (
                  <Button size="sm" className="gap-1.5" onClick={handleRenew} disabled={actionLoading !== null}>
                    {actionLoading === "renew" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    Renew Now
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleUpdatePayment} disabled={portalLoading}>
                  <CreditCard className="h-3.5 w-3.5" />
                  Update Payment Method
                </Button>
              </div>

              {confirmCancel && (
                <div className="mt-4 rounded-xl border border-expense/30 bg-expense/5 p-4">
                  <p className="text-sm text-foreground font-medium mb-2">Cancel subscription?</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Your Premium features will remain active until <strong>{formatDate(subscription.currentPeriodEnd)}</strong>, then your subscription will end. You won't be charged again.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setConfirmCancel(false)}>Keep Premium</Button>
                    <Button size="sm" variant="destructive" className="gap-1.5" onClick={handleCancel} disabled={actionLoading === "cancel"}>
                      {actionLoading === "cancel" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                      Confirm Cancel
                    </Button>
                  </div>
                </div>
              )}

              {subscription.cancelAtPeriodEnd && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Cancellation scheduled. Premium remains active until {formatDate(subscription.currentPeriodEnd)}.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-border bg-background px-6 py-3">
          <p className="text-center text-[11px] text-muted-foreground">
            Secure payments powered by Stripe. We never store your payment details.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
