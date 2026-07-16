import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BHGcVbTW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { i as CardHeader, n as CardContent, o as Badge, t as Card } from "./card-C5Nmk_bj.mjs";
import { it as Crown, t as Zap, v as Sparkles, x as Shield, xt as Check, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./shared-Cu4KJl81.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as useApp } from "./AppContext-CvoDtxI1.mjs";
import { n as useSubscription } from "./SubscriptionContext-B9Jsp-Ce.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-Dqfh4VB0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FREE_FEATURES = [
	"Unlimited expense tracking",
	"Add & manage income",
	"Dashboard overview",
	"Basic reports & analytics",
	"Recurring income scheduling",
	"Export CSV / JSON",
	"Receipt attachments"
];
var PREMIUM_FEATURES = [
	"Everything in Free",
	"Budget Management",
	"Savings Goals",
	"Advanced Analytics",
	"Financial Predictions",
	"AI Insights",
	"Unlimited budgets & goals",
	"Priority support",
	"All future premium features"
];
async function createCheckoutSession(userId, priceId) {
	console.log("[Stripe] Creating checkout session for user:", userId, "priceId:", priceId);
	const { data: { session } } = await supabase.auth.getSession();
	if (!session) {
		console.error("[Stripe] ❌ No auth session");
		throw new Error("Not authenticated");
	}
	console.log("[Stripe] 📡 Invoking create-checkout edge function...");
	const res = await supabase.functions.invoke("create-checkout", { body: {
		priceId,
		successUrl: `${window.location.origin}/pricing?success=true`,
		cancelUrl: `${window.location.origin}/pricing?canceled=true`
	} });
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
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get("success") === "true") {
			console.log("[Pricing] ✅ Payment success detected, refreshing subscription...");
			refreshSubscription().then(() => {
				console.log("[Pricing] ✅ Subscription refreshed");
				const from = (/* @__PURE__ */ new Date()).toLocaleDateString();
				const to = new Date(Date.now() + 720 * 60 * 60 * 1e3).toLocaleDateString();
				addNotification("🎉 Premium Activated", `Your Premium subscription is active from ${from} to ${to}.`);
				toast.success("🎉 Payment successful! Premium is now active.");
				window.history.replaceState({}, "", "/pricing");
				setTimeout(() => {
					console.log("[Pricing] 🔄 Second refresh to ensure webhook completed");
					refreshSubscription();
				}, 2e3);
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
			const priceId = "price_1TshgvRp1jrpNofsa0P5jLAG";
			const hasPrice = !priceId.includes("your_stripe") && true;
			console.log("[Stripe] Price ID:", priceId, "| Valid:", hasPrice);
			if (!hasPrice) {
				console.warn("[Stripe] ⚠️ DEMO MODE: No valid Stripe price ID");
				toast.warning("Demo mode - no real payment");
				const { error } = await supabase.from("subscriptions").upsert({
					user_id: user.id,
					subscription_plan: "premium",
					subscription_status: "active",
					current_period_end: new Date(Date.now() + 720 * 60 * 60 * 1e3).toISOString()
				}, { onConflict: "user_id" });
				if (error) throw error;
				await refreshSubscription();
				const from = (/* @__PURE__ */ new Date()).toLocaleDateString();
				const to = new Date(Date.now() + 720 * 60 * 60 * 1e3).toLocaleDateString();
				addNotification("🎉 Premium Activated (Demo)", `Your Premium is active from ${from} to ${to}.`);
				toast.success("Demo: Premium activated without payment");
				navigate({ to: "/" });
				return;
			}
			console.log("[Stripe] ✅ Creating Stripe checkout session...");
			const checkoutUrl = await createCheckoutSession(user.id, priceId);
			if (checkoutUrl) {
				console.log("[Stripe] ✅ Redirecting to:", checkoutUrl);
				toast.info("Redirecting to secure checkout...");
				window.location.href = checkoutUrl;
			} else throw new Error("No checkout URL returned");
		} catch (err) {
			console.error("[Stripe] ❌ Error:", err);
			toast.error(`Error: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};
	const handleCancel = async () => {
		if (!confirm("Are you sure you want to cancel your Premium subscription?")) return;
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return;
		await supabase.from("subscriptions").upsert({
			user_id: user.id,
			subscription_plan: "free",
			subscription_status: "active",
			stripe_subscription_id: null
		}, { onConflict: "user_id" });
		await refreshSubscription();
		toast.success("Subscription canceled. You're now on the Free plan.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Subscription Plans",
		description: "Choose the plan that fits your financial journey."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			isPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3 rounded-2xl border border-income/30 bg-income/8 px-4 py-3 text-sm text-income",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"You're on the ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Premium plan" }),
					".",
					subscription.currentPeriodEnd && ` Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.`
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: cn("rounded-2xl border-2 transition-all", !isPremium ? "border-primary shadow-md" : "border-border"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-2 pt-6 px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-5 w-5 text-muted-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold",
								children: "Free"
							}), !isPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px] mt-0.5",
								children: "Current Plan"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl font-black",
								children: "$0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-sm",
								children: "/month"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "px-6 pb-6 space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2.5",
							children: FREE_FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-income shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
							}, f))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "w-full rounded-xl",
							disabled: true,
							children: !isPremium ? "Current Plan" : "Free Plan"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: cn("rounded-2xl border-2 transition-all", isPremium ? "border-primary shadow-md" : "border-primary/50"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-2 pt-6 px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-5 w-5 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-primary",
								children: "Premium"
							}), isPremium && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "text-[10px] mt-0.5",
								children: "Active"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl font-black",
								children: "$9"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-sm",
								children: "/month"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "px-6 pb-6 space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2.5",
							children: PREMIUM_FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: f === "Everything in Free" ? "text-muted-foreground" : "",
									children: f
								})]
							}, f))
						}), isPremium ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-income/10 px-3 py-2.5 text-xs text-income flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5 shrink-0" }), "Premium is active — all features unlocked!"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "w-full rounded-xl text-expense hover:text-expense",
								onClick: handleCancel,
								children: "Cancel Subscription"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full rounded-xl gap-2",
							onClick: handleUpgrade,
							disabled: loading,
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), "Upgrade to Premium"]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-center text-xs text-muted-foreground",
				children: "Secure payments powered by Stripe · Cancel anytime · No hidden fees"
			})
		]
	})] });
}
//#endregion
export { PricingPage as component };
