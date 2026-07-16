import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BHGcVbTW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SubscriptionContext-B9Jsp-Ce.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_SUBSCRIPTION = {
	plan: "free",
	status: "active",
	stripeCustomerId: null,
	stripeSubscriptionId: null,
	billingCycle: "monthly",
	currentPeriodStart: null,
	currentPeriodEnd: null,
	cancelAtPeriodEnd: false
};
var SubscriptionContext = (0, import_react.createContext)({
	subscription: DEFAULT_SUBSCRIPTION,
	isPremium: false,
	isLoading: true,
	refreshSubscription: async () => {}
});
function SubscriptionProvider({ children }) {
	const [subscription, setSubscription] = (0, import_react.useState)(DEFAULT_SUBSCRIPTION);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const loadSubscription = async () => {
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				setSubscription(DEFAULT_SUBSCRIPTION);
				setIsLoading(false);
				return;
			}
			const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single();
			if (error || !data) {
				await supabase.from("subscriptions").upsert({
					user_id: user.id,
					subscription_plan: "free",
					subscription_status: "active"
				}, { onConflict: "user_id" });
				setSubscription(DEFAULT_SUBSCRIPTION);
			} else setSubscription({
				plan: data.subscription_plan ?? "free",
				status: data.subscription_status ?? "active",
				stripeCustomerId: data.stripe_customer_id ?? null,
				stripeSubscriptionId: data.stripe_subscription_id ?? null,
				billingCycle: data.billing_cycle ?? "monthly",
				currentPeriodStart: data.current_period_start ?? null,
				currentPeriodEnd: data.current_period_end ?? null,
				cancelAtPeriodEnd: data.cancel_at_period_end ?? false
			});
		} catch (err) {
			console.error("Failed to load subscription:", err);
			setSubscription(DEFAULT_SUBSCRIPTION);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadSubscription();
		const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) loadSubscription();
			else {
				setSubscription(DEFAULT_SUBSCRIPTION);
				setIsLoading(false);
			}
		});
		return () => authSub.unsubscribe();
	}, []);
	const isPremium = subscription.plan === "premium" && (subscription.status === "active" || subscription.status === "trialing");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscriptionContext.Provider, {
		value: {
			subscription,
			isPremium,
			isLoading,
			refreshSubscription: loadSubscription
		},
		children
	});
}
function useSubscription() {
	const ctx = (0, import_react.useContext)(SubscriptionContext);
	if (!ctx) return {
		subscription: DEFAULT_SUBSCRIPTION,
		isPremium: false,
		isLoading: false,
		refreshSubscription: async () => {}
	};
	return ctx;
}
//#endregion
export { useSubscription as n, SubscriptionProvider as t };
