import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BHGcVbTW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { n as CardContent, o as Badge, t as Card } from "./card-C5Nmk_bj.mjs";
import { Ct as ChartColumn, D as RefreshCw, M as PiggyBank, R as Lock, _ as Star, _t as CircleAlert, at as CreditCard, dt as CirclePlay, et as ExternalLink, ft as CirclePause, it as Crown, k as Receipt, kt as Brain, lt as CircleX, n as X, nt as Download, pt as CircleCheck, r as Wallet, t as Zap, v as Sparkles, wt as Calendar, x as Shield, xt as Check, yt as ChevronRight, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as useApp, l as getPaymentHistory } from "./AppContext-BtlkEzV5.mjs";
import { n as useSubscription } from "./SubscriptionContext-B9Jsp-Ce.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/premium-CdsJvvpC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_CONFIG = {
	active: {
		label: "Active",
		color: "text-income",
		icon: CircleCheck
	},
	cancelling: {
		label: "Cancelling",
		color: "text-amber-500",
		icon: CircleAlert
	},
	canceled: {
		label: "Canceled",
		color: "text-expense",
		icon: CircleX
	},
	past_due: {
		label: "Past Due",
		color: "text-expense",
		icon: CircleAlert
	},
	trialing: {
		label: "Trial",
		color: "text-primary",
		icon: Shield
	}
};
var PAYMENT_STATUS = {
	succeeded: {
		label: "Paid",
		color: "text-income",
		icon: CircleCheck
	},
	completed: {
		label: "Completed",
		color: "text-income",
		icon: CircleCheck
	},
	processing: {
		label: "Processing",
		color: "text-amber-500",
		icon: CircleAlert
	},
	failed: {
		label: "Failed",
		color: "text-expense",
		icon: CircleX
	},
	pending: {
		label: "Pending",
		color: "text-muted-foreground",
		icon: CircleAlert
	}
};
function ManageSubscriptionModal({ open, onClose }) {
	const { subscription, isPremium, refreshSubscription } = useSubscription();
	const { addNotification } = useApp();
	const [paymentHistory, setPaymentHistory] = (0, import_react.useState)([]);
	const [historyLoading, setHistoryLoading] = (0, import_react.useState)(true);
	const [actionLoading, setActionLoading] = (0, import_react.useState)(null);
	const [portalLoading, setPortalLoading] = (0, import_react.useState)(false);
	const [confirmCancel, setConfirmCancel] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
			if (subscription.stripeSubscriptionId) await supabase.functions.invoke("cancel-subscription", { body: { subscriptionId: subscription.stripeSubscriptionId } });
			const { error } = await supabase.from("subscriptions").upsert({
				user_id: user.id,
				subscription_plan: "premium",
				subscription_status: "cancelling",
				cancel_at_period_end: true
			}, { onConflict: "user_id" });
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
			if (subscription.stripeSubscriptionId) await supabase.functions.invoke("cancel-subscription", { body: {
				subscriptionId: subscription.stripeSubscriptionId,
				cancel: false
			} });
			const { error } = await supabase.from("subscriptions").upsert({
				user_id: user.id,
				subscription_plan: "premium",
				subscription_status: "active",
				cancel_at_period_end: false
			}, { onConflict: "user_id" });
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
			const priceId = "price_1TshgvRp1jrpNofsa0P5jLAG";
			if (!priceId.includes("your_stripe")) {
				const { data: { session } } = await supabase.auth.getSession();
				if (!session) throw new Error("No session");
				const origin = typeof window !== "undefined" ? window.location.origin : "";
				const res = await supabase.functions.invoke("create-checkout", { body: {
					priceId,
					successUrl: `${origin}/premium?success=true`,
					cancelUrl: `${origin}/premium?canceled=true`
				} });
				if (res.error) throw new Error(res.error.message);
				if (res.data?.url && typeof window !== "undefined") {
					window.location.href = res.data.url;
					return;
				}
			}
			const { error } = await supabase.from("subscriptions").upsert({
				user_id: user.id,
				subscription_plan: "premium",
				subscription_status: "active",
				cancel_at_period_end: false,
				current_period_end: new Date(Date.now() + 720 * 60 * 60 * 1e3).toISOString(),
				current_period_start: (/* @__PURE__ */ new Date()).toISOString()
			}, { onConflict: "user_id" });
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
			if (res.data?.url && typeof window !== "undefined") {
				window.location.href = res.data.url;
				return;
			}
			toast.error("Could not open payment settings.");
		} catch (err) {
			console.error(err);
			toast.error("Failed to open payment settings.");
		} finally {
			setPortalLoading(false);
		}
	}
	function formatDate(dateStr) {
		if (!dateStr) return "—";
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	}
	function formatCurrency(amount, currency) {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency.toUpperCase()
		}).format(amount);
	}
	if (!open) return null;
	const statusInfo = STATUS_CONFIG[subscription.status] ?? STATUS_CONFIG.active;
	const StatusIcon = statusInfo.icon;
	const amount = subscription.plan === "premium" ? subscription.billingCycle === "yearly" ? "$90" : "$9" : "$0";
	subscription.status === "active" || subscription.status;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-0 shadow-2xl animate-in zoom-in-95 duration-200",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-5 w-5 text-primary" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold text-foreground",
							children: "Manage Subscription"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Manage your plan, billing, and payment settings"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "mb-3 flex items-center gap-2 text-sm font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary" }), "Subscription Information"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card divide-y divide-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Current Plan",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [isPremium ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium capitalize",
											children: subscription.plan
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { className: cn("h-4 w-4", statusInfo.color) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("text-sm font-medium", statusInfo.color),
											children: statusInfo.label
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Start Date",
									children: formatDate(subscription.currentPeriodStart)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Renewal Date",
									children: formatDate(subscription.currentPeriodEnd)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Amount Paid",
									children: amount
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Billing Cycle",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize",
										children: subscription.billingCycle
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Auto Renewal",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-2 w-2 rounded-full", subscription.cancelAtPeriodEnd ? "bg-expense" : "bg-income") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: subscription.cancelAtPeriodEnd ? "Off (cancelling)" : "On" })]
									})
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "mb-3 flex items-center gap-2 text-sm font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4 text-primary" }), "Payment Method"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-xl bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5 text-muted-foreground" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-foreground",
										children: "Stripe Secure Checkout"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Your payment info is securely stored by Stripe"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "gap-1.5",
									onClick: handleUpdatePayment,
									disabled: portalLoading,
									children: [portalLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5" }), portalLoading ? "Opening..." : "Update"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[11px] text-muted-foreground",
								children: "We never store card numbers, CVV, or expiry dates. All payment data is handled securely by Stripe."
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "mb-3 flex items-center gap-2 text-sm font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-4 w-4 text-primary" }), "Payment History"]
						}), historyLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-center rounded-xl border border-border bg-card py-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" })
						}) : paymentHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center rounded-xl border border-border bg-card py-8 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-8 w-8 text-muted-foreground mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No payment history yet"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border bg-muted/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground",
											children: "Invoice"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground",
											children: "Amount"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground",
											children: "Receipt"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: paymentHistory.map((p, i) => {
									const ps = PAYMENT_STATUS[p.payment_status] ?? PAYMENT_STATUS.pending;
									const PIcon = ps.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: cn("border-b border-border last:border-0", i % 2 === 0 ? "bg-background" : "bg-muted/20"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-sm text-foreground whitespace-nowrap",
												children: formatDate(p.payment_date)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-sm text-muted-foreground font-mono",
												children: p.invoice_id ? p.invoice_id.slice(0, 14) + "..." : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-sm font-medium text-foreground",
												children: formatCurrency(p.amount, p.currency)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PIcon, { className: cn("h-3.5 w-3.5", ps.color) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: cn("text-xs", ps.color),
														children: ps.label
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 py-3 text-right",
												children: [p.receipt_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: p.receipt_url,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }), " Receipt"]
												}), p.invoice_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: p.invoice_url,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "ml-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
													children: ["Invoice ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
												})]
											})
										]
									}, p.id);
								}) })]
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "mb-3 flex items-center gap-2 text-sm font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-4 w-4 text-primary" }), "Subscription Controls"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										isPremium && !subscription.cancelAtPeriodEnd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "gap-1.5 text-expense hover:text-expense",
											onClick: () => setConfirmCancel(true),
											disabled: actionLoading !== null,
											children: [actionLoading === "cancel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "h-3.5 w-3.5" }), "Cancel Subscription"]
										}),
										isPremium && subscription.cancelAtPeriodEnd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "gap-1.5 text-income hover:text-income",
											onClick: handleResume,
											disabled: actionLoading !== null,
											children: [actionLoading === "resume" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "h-3.5 w-3.5" }), "Resume Subscription"]
										}),
										(subscription.status === "canceled" || subscription.status === "past_due") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											className: "gap-1.5",
											onClick: handleRenew,
											disabled: actionLoading !== null,
											children: [actionLoading === "renew" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), "Renew Now"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											className: "gap-1.5",
											onClick: handleUpdatePayment,
											disabled: portalLoading,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5" }), "Update Payment Method"]
										})
									]
								}),
								confirmCancel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 rounded-xl border border-expense/30 bg-expense/5 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-foreground font-medium mb-2",
											children: "Cancel subscription?"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mb-3",
											children: [
												"Your Premium features will remain active until ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatDate(subscription.currentPeriodEnd) }),
												", then your subscription will end. You won't be charged again."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => setConfirmCancel(false),
												children: "Keep Premium"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "destructive",
												className: "gap-1.5",
												onClick: handleCancel,
												disabled: actionLoading === "cancel",
												children: [actionLoading === "cancel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : null, "Confirm Cancel"]
											})]
										})
									]
								}),
								subscription.cancelAtPeriodEnd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
										"Cancellation scheduled. Premium remains active until ",
										formatDate(subscription.currentPeriodEnd),
										"."
									]
								})
							]
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky bottom-0 border-t border-border bg-background px-6 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-[11px] text-muted-foreground",
						children: "Secure payments powered by Stripe. We never store your payment details."
					})
				})
			]
		})
	});
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-foreground",
			children
		})]
	});
}
var MONTHLY_PRICE = 9;
var YEARLY_PRICE = 90;
var COMPARISON_ROWS = [
	{
		feature: "Expense Tracking",
		free: true,
		premium: true
	},
	{
		feature: "Income Management",
		free: true,
		premium: true
	},
	{
		feature: "Dashboard Overview",
		free: true,
		premium: true
	},
	{
		feature: "Basic Reports",
		free: true,
		premium: true
	},
	{
		feature: "Recurring Income",
		free: true,
		premium: true
	},
	{
		feature: "CSV / JSON Export",
		free: true,
		premium: true
	},
	{
		feature: "Receipt Attachments",
		free: true,
		premium: true
	},
	{
		feature: "Budget Management",
		free: false,
		premium: true
	},
	{
		feature: "Savings Goals",
		free: false,
		premium: true
	},
	{
		feature: "Advanced Analytics",
		free: false,
		premium: true
	},
	{
		feature: "AI Predictions",
		free: false,
		premium: true
	},
	{
		feature: "Unlimited Budgets & Goals",
		free: false,
		premium: true
	},
	{
		feature: "Priority Support",
		free: false,
		premium: true
	},
	{
		feature: "Future Premium Features",
		free: false,
		premium: true
	}
];
var PREMIUM_FEATURES = [
	{
		icon: Wallet,
		title: "Budget Management",
		description: "Create and track budgets across categories with real-time alerts."
	},
	{
		icon: PiggyBank,
		title: "Savings Goals",
		description: "Set savings targets, track progress, and build better habits."
	},
	{
		icon: ChartColumn,
		title: "Advanced Analytics",
		description: "Deep insights into your spending patterns and financial health."
	},
	{
		icon: Brain,
		title: "AI Predictions",
		description: "Smart forecasts based on your income and spending history."
	},
	{
		icon: Shield,
		title: "Priority Support",
		description: "Get help faster with priority email and chat support."
	},
	{
		icon: Star,
		title: "Everything Unlocked",
		description: "No limits on budgets, goals, or any premium feature."
	}
];
async function createCheckoutSession(priceId) {
	console.log("[Stripe] createCheckoutSession called with priceId:", priceId);
	const { data: { session } } = await supabase.auth.getSession();
	if (!session) {
		console.error("[Stripe] ❌ No auth session found - user not logged in");
		throw new Error("You must be logged in to purchase premium");
	}
	console.log("[Stripe] ✅ Auth session found");
	console.log("[Stripe] 📡 Invoking create-checkout edge function...");
	const res = await supabase.functions.invoke("create-checkout", { body: {
		priceId,
		successUrl: `${window.location.origin}/premium?success=true`,
		cancelUrl: `${window.location.origin}/premium?canceled=true`
	} });
	console.log("[Stripe] 📥 Edge function response:", res);
	if (res.error) {
		console.error("[Stripe] ❌ Edge function returned error:", res.error);
		console.error("[Stripe] ❌ Error details:", JSON.stringify(res.error, null, 2));
		if (res.error.message?.includes("STRIPE_SECRET_KEY")) throw new Error("Stripe not configured: Missing STRIPE_SECRET_KEY in Supabase Edge Functions. Check STRIPE_CHECKOUT_FIX.md");
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
	const [billing, setBilling] = (0, import_react.useState)("monthly");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [showAnimation, setShowAnimation] = (0, import_react.useState)(false);
	const [manageOpen, setManageOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setShowAnimation(true);
		const params = new URLSearchParams(window.location.search);
		if (params.get("success") === "true") {
			console.log("[Premium] ✅ Payment success detected, refreshing subscription...");
			refreshSubscription().then(() => {
				console.log("[Premium] ✅ Subscription refreshed");
				const from = (/* @__PURE__ */ new Date()).toLocaleDateString();
				const to = new Date(Date.now() + 720 * 60 * 60 * 1e3).toLocaleDateString();
				addNotification("🎉 Premium Activated", `Your Premium subscription is active from ${from} to ${to}.`);
				toast.success("🎉 Payment successful! Premium is now active.");
				window.history.replaceState({}, "", "/premium");
				setTimeout(() => {
					console.log("[Premium] 🔄 Second refresh to ensure webhook completed");
					refreshSubscription();
				}, 2e3);
			});
		} else if (params.get("canceled") === "true") {
			toast.info("Checkout canceled. Your plan was not changed.");
			window.history.replaceState({}, "", "/premium");
		}
	}, [refreshSubscription, addNotification]);
	const yearlyMonthly = Math.round(YEARLY_PRICE / 12 * 10) / 10;
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
			const monthlyPriceId = "price_1TshgvRp1jrpNofsa0P5jLAG";
			const yearlyPriceId = "price_1TtkaWRp1jrpNofsKy0A1De1";
			console.log("[Stripe] Monthly price ID:", monthlyPriceId);
			console.log("[Stripe] Yearly price ID:", yearlyPriceId);
			const priceId = billing === "yearly" && !yearlyPriceId.includes("your_stripe") ? yearlyPriceId : monthlyPriceId;
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
						return;
					} else {
						console.error("[Stripe] ❌ Edge function returned success but no URL");
						toast.error("Failed to create checkout session. Check console for details.");
						return;
					}
				} catch (checkoutError) {
					console.error("[Stripe] ❌ Checkout session creation failed:", checkoutError);
					toast.error(`Checkout failed: ${checkoutError.message}`);
					return;
				}
			} else {
				console.log("[Stripe] 🎭 DEMO MODE: Directly updating subscription in database");
				const periodDays = billing === "yearly" ? 365 : 30;
				const { error } = await supabase.from("subscriptions").upsert({
					user_id: user.id,
					subscription_plan: "premium",
					subscription_status: "active",
					current_period_end: new Date(Date.now() + periodDays * 24 * 60 * 60 * 1e3).toISOString()
				}, { onConflict: "user_id" });
				if (error) {
					console.error("[Stripe] Demo upsert failed:", error);
					throw error;
				}
				console.log("[Stripe] Demo upsert succeeded");
				await refreshSubscription();
				const from = (/* @__PURE__ */ new Date()).toLocaleDateString();
				const to = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1e3).toLocaleDateString();
				addNotification("🎉 Premium Activated (Demo)", `Your ${billing === "yearly" ? "Yearly" : "Monthly"} Premium is active from ${from} to ${to}.`);
				toast.success("Demo: Premium activated without payment");
				navigate({ to: "/" });
			}
		} catch (err) {
			console.error("[Stripe] ❌ Upgrade error:", err);
			toast.error(`Error: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};
	if (isPremium) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center pt-10 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 inline-flex items-center gap-2 rounded-full bg-income/10 px-4 py-1.5 ring-1 ring-income/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4 text-income" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-income",
							children: "Premium Active"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-foreground sm:text-4xl",
						children: "Your Subscription"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground",
						children: "Manage your plan, billing, and subscription settings."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-income/20 to-income/5 ring-1 ring-income/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-8 w-8 text-income" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xl font-bold text-foreground capitalize",
									children: [subscription.plan, " Plan"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-income/10 text-income border-income/20",
									children: subscription.cancelAtPeriodEnd ? "Cancelling" : "Active"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: [subscription.billingCycle === "yearly" ? "$90/year" : "$9/month", subscription.cancelAtPeriodEnd ? ` · Active until ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : subscription.currentPeriodEnd ? ` · Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}` : ""]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "gap-2 rounded-xl",
							onClick: () => setManageOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4" }), "Manage Subscription"]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3 mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex items-center gap-3 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Billing Cycle"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground capitalize",
								children: subscription.billingCycle
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex items-center gap-3 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-income/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 text-income" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Auto Renewal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: subscription.cancelAtPeriodEnd ? "Off" : "On"
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex items-center gap-3 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5 text-amber-500" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Next Payment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : "—"
							})] })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-foreground mb-4",
						children: "Premium Features"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: PREMIUM_FEATURES.slice(0, 6).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-income shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-foreground",
								children: f.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: f.description
							})] })]
						}, f.title))
					})]
				})
			}),
			subscription.cancelAtPeriodEnd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-amber-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-foreground",
					children: "Cancellation Scheduled"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground mt-1",
					children: [
						"Your Premium subscription is set to cancel on ",
						new Date(subscription.currentPeriodEnd).toLocaleDateString(),
						". You can resume your subscription anytime before then."
					]
				})] })]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManageSubscriptionModal, {
		open: manageOpen,
		onClose: () => {
			setManageOpen(false);
			refreshSubscription();
		}
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("text-center pt-8 pb-6 transition-all duration-700", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-600/10 px-4 py-1.5 ring-1 ring-amber-500/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-amber-600 dark:text-amber-400",
							children: "Premium"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-4xl font-bold text-foreground sm:text-5xl",
						children: [
							"Take Control of Your",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
								children: "Financial Future"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-lg text-muted-foreground max-w-xl mx-auto",
						children: "Unlock powerful tools to budget smarter, save faster, and predict your financial future with AI."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("flex justify-center mb-10 transition-all duration-700 delay-100", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative inline-flex items-center rounded-2xl bg-muted p-1.5 ring-1 ring-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setBilling("monthly"),
							className: cn("relative z-10 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200", billing === "monthly" ? "text-foreground" : "text-muted-foreground hover:text-foreground"),
							children: "Monthly"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setBilling("yearly"),
							className: cn("relative z-10 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200", billing === "yearly" ? "text-foreground" : "text-muted-foreground hover:text-foreground"),
							children: "Yearly"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute top-1.5 bottom-1.5 rounded-xl bg-background shadow-sm transition-all duration-300 ease-out", billing === "monthly" ? "left-1.5 right-1/2" : "left-1/2 right-1.5") })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("grid gap-6 md:grid-cols-2 mb-12 transition-all duration-700 delay-200", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5 text-muted-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-foreground",
								children: "Free"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Basic tracking"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-1 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl font-black text-foreground",
								children: "$0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-sm",
								children: "/month"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3 mb-6",
							children: COMPARISON_ROWS.filter((r) => r.free).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-income shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: r.feature
								})]
							}, r.feature))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "w-full rounded-xl",
							disabled: true,
							children: "Current Plan"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative rounded-2xl border-2 border-primary/50 bg-card p-6 shadow-lg transition-all hover:shadow-xl animate-in zoom-in-95 duration-300",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -top-3 left-1/2 -translate-x-1/2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1 h-3 w-3" }), " Most Popular"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-4 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-5 w-5 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold text-foreground",
								children: "Premium"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Everything unlocked"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-1 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-4xl font-black text-foreground",
								children: ["$", billing === "yearly" ? YEARLY_PRICE : MONTHLY_PRICE]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-sm",
								children: billing === "yearly" ? "/year" : "/month"
							})]
						}),
						billing === "yearly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-income font-medium mb-5",
							children: [
								"$",
								yearlyMonthly,
								"/month — save $",
								MONTHLY_PRICE * 12 - YEARLY_PRICE,
								"/year"
							]
						}),
						billing === "monthly" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3 mb-6",
							children: PREMIUM_FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: f.title
								})]
							}, f.title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full rounded-xl gap-2 h-11 text-base shadow-lg",
							onClick: handleSubscribe,
							disabled: loading,
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Continue to Secure Payment", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })] })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mb-12 transition-all duration-700 delay-300", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold text-center text-foreground mb-8",
					children: "Compare Plans"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border bg-muted/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4 text-left text-sm font-semibold text-foreground",
									children: "Feature"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4 text-center text-sm font-semibold text-muted-foreground w-28",
									children: "Free"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4 text-center text-sm font-semibold text-primary w-28",
									children: "Premium"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: COMPARISON_ROWS.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: cn("border-b border-border last:border-0", i % 2 === 0 ? "bg-background" : "bg-muted/20"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-3.5 text-sm text-foreground",
									children: row.feature
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-3.5 text-center",
									children: row.free ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-income mx-auto" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground text-xs",
										children: "—"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-6 py-3.5 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary mx-auto" })
								})
							]
						}, row.feature)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mb-12 transition-all duration-700 delay-[400ms]", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold text-center text-foreground mb-8",
					children: "Everything You Get"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: PREMIUM_FEATURES.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/30"),
						style: { animationDelay: `${i * 100}ms` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5 text-primary" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-foreground mb-1",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground leading-relaxed",
								children: f.description
							})
						]
					}, f.title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("text-center transition-all duration-700 delay-500", showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border bg-muted/30 px-8 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), "Secure checkout"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5" }), "Powered by Stripe"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), "Cancel anytime"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), "No hidden fees"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs text-muted-foreground",
					children: "By subscribing, you agree to our Terms of Service. Your payment data is securely processed by Stripe."
				})]
			})
		]
	});
}
//#endregion
export { PremiumPage as component };
