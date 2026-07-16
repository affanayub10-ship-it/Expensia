import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { it as Crown, v as Sparkles } from "../_libs/lucide-react.mjs";
import { n as useSubscription } from "./SubscriptionContext-B9Jsp-Ce.mjs";
import { t as PremiumUpgradeModal } from "./PremiumUpgradeModal-CaxDN3KL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PremiumGate-C7UoENI_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PremiumGate({ children, feature = "this feature" }) {
	const { isPremium, isLoading } = useSubscription();
	const [showUpgrade, setShowUpgrade] = (0, import_react.useState)(false);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	if (isPremium) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-[300px] rounded-2xl overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none select-none opacity-20 blur-[3px]",
			"aria-hidden": true,
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-background/70 backdrop-blur-sm rounded-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 ring-1 ring-primary/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-7 w-7 text-primary" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold text-foreground",
					children: "Premium Feature"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed",
					children: [
						"Upgrade to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Premium" }),
						" to access ",
						feature,
						" and unlock all advanced tools."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-5 gap-2 rounded-xl",
					onClick: () => setShowUpgrade(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), "Upgrade to Premium"]
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumUpgradeModal, {
		open: showUpgrade,
		onClose: () => setShowUpgrade(false)
	})] });
}
//#endregion
export { PremiumGate as t };
