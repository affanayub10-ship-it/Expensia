import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-PwNqyxv_.mjs";
import { n as CardContent, o as Badge, t as Card } from "./card-C5Nmk_bj.mjs";
import { Ft as ArrowDownRight, jt as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { n as INCOME_CATEGORIES, r as categoryByName, t as EXPENSE_CATEGORIES } from "./mock-data-Cl4Xf6-R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shared-Cu4KJl81.js
var import_jsx_runtime = require_jsx_runtime();
function PageHeader({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "truncate text-2xl font-bold tracking-tight sm:text-3xl",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: description
			})]
		}), action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: action
		})]
	});
}
function StatCard({ label, value, icon: Icon, accent = "primary", trend }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-muted-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("flex h-9 w-9 items-center justify-center rounded-xl", {
							primary: "bg-primary/10 text-primary",
							income: "bg-income/10 text-income",
							expense: "bg-expense/10 text-expense",
							warning: "bg-warning/15 text-warning"
						}[accent]),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-2xl font-bold tracking-tight",
					children: value
				}),
				trend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("mt-1 flex items-center gap-1 text-xs font-medium", trend.positive ? "text-income" : "text-expense"),
					children: [trend.positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3.5 w-3.5" }), trend.value]
				})
			]
		})
	});
}
function CategoryPill({ name, type = "expense" }) {
	const cat = categoryByName(name, type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES);
	const Icon = cat.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex h-6 w-6 items-center justify-center rounded-md",
			style: {
				backgroundColor: `var(--color-${cat.color})`,
				opacity: .95
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5 text-white" })
		}), name]
	});
}
function CategoryIcon({ name, type = "expense", className }) {
	const cat = categoryByName(name, type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES);
	const Icon = cat.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", className),
		style: { backgroundColor: `var(--color-${cat.color})` },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: {
			Paid: "bg-income/12 text-income border-transparent",
			Pending: "bg-warning/15 text-warning border-transparent",
			Cancelled: "bg-muted text-muted-foreground border-transparent"
		}[status],
		children: status
	});
}
//#endregion
export { StatusBadge as a, StatCard as i, CategoryPill as n, PageHeader as r, CategoryIcon as t };
