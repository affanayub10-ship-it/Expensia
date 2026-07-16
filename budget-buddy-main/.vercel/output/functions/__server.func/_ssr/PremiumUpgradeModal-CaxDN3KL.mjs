import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BHGcVbTW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { Nt as ArrowRight, it as Crown, n as X, v as Sparkles, xt as Check, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as useApp } from "./AppContext-CvoDtxI1.mjs";
import { n as useSubscription } from "./SubscriptionContext-B9Jsp-Ce.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PremiumUpgradeModal-CaxDN3KL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PREMIUM_FEATURES = [
	"Budget Management",
	"Savings Goals",
	"Advanced Analytics",
	"Financial Predictions",
	"AI-Powered Insights",
	"Unlimited budgets & goals",
	"Priority support",
	"All future premium features"
];
function PremiumUpgradeModal({ open, onClose }) {
	const { refreshSubscription } = useSubscription();
	const { addNotification } = useApp();
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	if (!open) return null;
	const handleUpgrade = async () => {
		setLoading(true);
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				toast.error("Please log in first");
				return;
			}
			const priceId = "price_1TshgvRp1jrpNofsa0P5jLAG";
			if (!!priceId.includes("your_stripe")) {
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
				addNotification("🎉 Premium Activated", `Your Premium subscription is active from ${from} to ${to}.`);
				toast.success("Welcome to Premium! All features unlocked.");
				onClose();
				return;
			}
			const { data: { session } } = await supabase.auth.getSession();
			if (!session) throw new Error("No session");
			const res = await supabase.functions.invoke("create-checkout", { body: {
				priceId,
				successUrl: `${window.location.origin}/premium?success=true`,
				cancelUrl: `${window.location.origin}/premium?canceled=true`
			} });
			if (res.error) throw new Error(res.error.message);
			if (res.data?.url) window.location.href = res.data.url;
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-4 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-200",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 ring-1 ring-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-7 w-7 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mb-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " PREMIUM"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-xl font-bold text-foreground",
							children: "Unlock Premium"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm",
							children: "Get full control of your finances with advanced tools, predictions, and insights."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
						children: "What you'll get:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-2",
						children: PREMIUM_FEATURES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-foreground",
								children: f
							})]
						}, f))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-baseline justify-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl font-black text-foreground",
						children: "$9"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "/month"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full gap-2 rounded-xl h-11 text-base",
							onClick: handleUpgrade,
							disabled: loading,
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), loading ? "Processing..." : "Upgrade to Premium"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "w-full rounded-xl text-muted-foreground",
							onClick: onClose,
							children: "Maybe Later"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								onClose();
								navigate({ to: "/premium" });
							},
							className: "inline-flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
							children: ["Compare plans ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-center text-[11px] text-muted-foreground",
					children: "Secure payments via Stripe · Cancel anytime"
				})
			]
		})
	});
}
//#endregion
export { PremiumUpgradeModal as t };
