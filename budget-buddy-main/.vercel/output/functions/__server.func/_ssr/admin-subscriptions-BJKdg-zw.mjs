import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BHGcVbTW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, o as Badge, r as CardDescription, t as Card } from "./card-C5Nmk_bj.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BcaWptOW.mjs";
import { D as RefreshCw, L as Mail, _t as CircleAlert, a as Users, it as Crown, o as User, rt as DollarSign, u as TrendingUp, w as Search, wt as Calendar } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./shared-Cu4KJl81.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-subscriptions-BJKdg-zw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSubscriptionsPage() {
	const [subscriptions, setSubscriptions] = (0, import_react.useState)([]);
	const [stats, setStats] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [filterPlan, setFilterPlan] = (0, import_react.useState)("all");
	const loadData = async () => {
		setLoading(true);
		try {
			const { data: subsData, error: subsError } = await supabase.from("subscriptions_with_users").select("*").order("created_at", { ascending: false });
			if (subsError) throw subsError;
			setSubscriptions(subsData || []);
			const { data: statsData, error: statsError } = await supabase.rpc("get_subscription_stats");
			if (statsError) throw statsError;
			if (statsData && statsData.length > 0) setStats(statsData[0]);
			toast.success("Subscriptions loaded");
		} catch (err) {
			console.error("Failed to load subscriptions:", err);
			toast.error(`Failed to load data: ${err.message}`);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const filteredSubscriptions = subscriptions.filter((sub) => {
		const matchesSearch = sub.user_email.toLowerCase().includes(searchTerm.toLowerCase()) || sub.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesPlan = filterPlan === "all" || sub.subscription_plan === filterPlan;
		return matchesSearch && matchesPlan;
	});
	filteredSubscriptions.filter((sub) => sub.subscription_plan === "premium");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Subscription Management",
		description: "View and manage all user subscriptions",
		icon: Crown
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [stats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "pt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Total Users"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold",
							children: stats.total_users
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-8 w-8 text-muted-foreground" })]
					})
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "pt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Premium Users"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold text-income",
								children: stats.active_premium
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [stats.canceled_premium, " canceling"]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-8 w-8 text-income" })]
					})
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "pt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Monthly Plans"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold",
							children: stats.monthly_subscribers
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-8 w-8 text-muted-foreground" })]
					})
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "pt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Yearly Plans"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold",
							children: stats.yearly_subscribers
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-8 w-8 text-muted-foreground" })]
					})
				}) })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Subscriptions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [
			filteredSubscriptions.length,
			" subscription",
			filteredSubscriptions.length !== 1 ? "s" : "",
			filterPlan !== "all" && ` (${filterPlan})`
		] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by name or email...",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value),
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: filterPlan === "all" ? "default" : "outline",
						onClick: () => setFilterPlan("all"),
						children: "All"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: filterPlan === "free" ? "default" : "outline",
						onClick: () => setFilterPlan("free"),
						children: "Free"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: filterPlan === "premium" ? "default" : "outline",
						onClick: () => setFilterPlan("premium"),
						children: "Premium"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: loadData,
						disabled: loading,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` })
					})
				]
			}), filterPlan === "premium" || filterPlan === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "User" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Email" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Plan" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Billing" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Period End" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Stripe ID" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "text-center",
					children: "Loading..."
				}) }) : filteredSubscriptions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "text-center text-muted-foreground",
					children: "No subscriptions found"
				}) }) : filteredSubscriptions.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: sub.user_name || "No name"
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: sub.user_email
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: sub.subscription_plan === "premium" ? "default" : "secondary",
						className: sub.subscription_plan === "premium" ? "bg-income" : "",
						children: [sub.subscription_plan === "premium" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3 w-3 mr-1" }), sub.subscription_plan]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: sub.subscription_status === "active" ? "default" : "outline",
						children: sub.subscription_status
					}), sub.cancel_at_period_end && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "ml-1 text-amber-600 border-amber-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 mr-1" }), "Canceling"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "capitalize text-sm",
						children: sub.billing_cycle || "—"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : "—"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: sub.stripe_customer_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
							className: "text-xs bg-muted px-1.5 py-0.5 rounded",
							children: [sub.stripe_customer_id.slice(0, 12), "..."]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground text-sm",
						children: "—"
					}) })
				] }, sub.id)) })] })
			}) : null]
		})] })]
	})] });
}
//#endregion
export { AdminSubscriptionsPage as component };
