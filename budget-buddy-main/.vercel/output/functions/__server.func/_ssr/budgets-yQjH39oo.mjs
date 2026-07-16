import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
import { A as Plus, M as PiggyBank, N as Pencil, d as TrendingDown, f as Trash2, l as TriangleAlert, r as Wallet, xt as Check } from "../_libs/lucide-react.mjs";
import { t as EXPENSE_CATEGORIES } from "./mock-data-Cl4Xf6-R.mjs";
import { n as CategoryPill, r as PageHeader } from "./shared-Cu4KJl81.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as useActiveExpenses, f as useApp, i as formatPercent, n as formatDate, r as formatMoney } from "./AppContext-CvoDtxI1.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BA-nrckz.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as Slider } from "./slider-CuWUdOZr.mjs";
import { t as PremiumGate } from "./PremiumGate-C7UoENI_.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/budgets-yQjH39oo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
	variants: { variant: {
		default: "bg-background text-foreground",
		destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
var Alert = import_react.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	role: "alert",
	className: cn(alertVariants({ variant }), className),
	...props
}));
Alert.displayName = "Alert";
var AlertTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
	ref,
	className: cn("mb-1 font-medium leading-none tracking-tight", className),
	...props
}));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm [&_p]:leading-relaxed", className),
	...props
}));
AlertDescription.displayName = "AlertDescription";
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var SLIDER_MIN = 0;
var SLIDER_MAX = 5e4;
var SLIDER_STEP = 100;
function barColor(pct) {
	if (pct >= 100) return "bg-expense";
	if (pct >= 80) return "bg-warning";
	return "bg-income";
}
function barBg(pct) {
	if (pct >= 100) return "bg-expense/10";
	if (pct >= 80) return "bg-warning/10";
	return "bg-income/10";
}
function textColor(pct) {
	if (pct >= 100) return "text-expense";
	if (pct >= 80) return "text-warning";
	return "text-income";
}
function Budgets() {
	const { budgets, saveBudget, deleteBudget, settings } = useApp();
	const expenses = useActiveExpenses();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [category, setCategory] = (0, import_react.useState)("Food");
	const [sliderVal, setSliderVal] = (0, import_react.useState)(1e3);
	const [hoveredBudget, setHoveredBudget] = (0, import_react.useState)(null);
	const hoverTimerRef = (0, import_react.useRef)(null);
	const [longPressTimer, setLongPressTimer] = (0, import_react.useState)(null);
	const spentByCat = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		expenses.forEach((e) => {
			m.set(e.category, (m.get(e.category) ?? 0) + e.amount);
		});
		return m;
	}, [expenses]);
	const expensesByCategory = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		expenses.forEach((e) => {
			if (!m.has(e.category)) m.set(e.category, []);
			m.get(e.category).push(e);
		});
		return m;
	}, [expenses]);
	const rows = budgets.map((b) => {
		const spent = spentByCat.get(b.category) ?? 0;
		const pct = b.limit > 0 ? spent / b.limit * 100 : 0;
		return {
			...b,
			spent,
			pct
		};
	});
	const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
	const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
	const remaining = totalLimit - totalSpent;
	const alerts = rows.filter((r) => r.pct >= 80);
	const openAdd = () => {
		setEditing(null);
		setCategory("Food");
		setSliderVal(1e3);
		setOpen(true);
	};
	const openEdit = (b) => {
		setEditing(b);
		setCategory(b.category);
		setSliderVal(Math.min(Math.max(b.limit, SLIDER_MIN), SLIDER_MAX));
		setOpen(true);
	};
	const submit = () => {
		if (!sliderVal || sliderVal <= 0) return toast.error("Set a budget limit above zero");
		saveBudget({
			id: editing?.id ?? "",
			category,
			limit: sliderVal
		});
		toast.success(editing ? "Budget updated" : "Budget created");
		setOpen(false);
	};
	const handleBudgetMouseEnter = (budgetId) => {
		if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
		setHoveredBudget(budgetId);
	};
	const handleBudgetMouseLeave = () => {
		hoverTimerRef.current = setTimeout(() => {
			setHoveredBudget(null);
		}, 200);
	};
	const handlePopoverMouseEnter = () => {
		if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
	};
	const handlePopoverMouseLeave = () => {
		setHoveredBudget(null);
	};
	const handleTouchStart = (budgetId) => {
		const timer = setTimeout(() => {
			setHoveredBudget(budgetId);
		}, 500);
		setLongPressTimer(timer);
	};
	const handleTouchEnd = () => {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			setLongPressTimer(null);
		}
		setHoveredBudget(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PremiumGate, {
		feature: "Budget Management",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Budgets",
				description: "Set monthly limits and track spending by category.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openAdd,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New budget"]
				})
			}),
			alerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 space-y-2",
				children: alerts.map((r) => {
					const exceeded = r.pct >= 100;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
						className: cn("rounded-xl", exceeded ? "border-expense/40 bg-expense/8" : "border-warning/40 bg-warning/8"),
						children: [
							exceeded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-expense" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-warning" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
								className: "text-sm",
								children: exceeded ? "Budget exceeded" : "Approaching limit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
								className: "text-xs",
								children: [
									r.category,
									": spent ",
									formatMoney(r.spent),
									" of ",
									formatMoney(r.limit),
									" (",
									formatPercent(r.pct),
									")"
								]
							})
						]
					}, r.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 lg:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "rounded-2xl border-0 bg-primary/8 shadow-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3.5 w-3.5" }), " Total Budget"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-3xl font-bold tracking-tight text-foreground",
										children: formatMoney(totalLimit)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [budgets.length, " categories"]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "rounded-2xl border-0 bg-expense/8 shadow-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5" }), " Total Spent"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-3xl font-bold tracking-tight text-expense",
										children: formatMoney(totalSpent)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [totalLimit > 0 ? formatPercent(totalSpent / totalLimit * 100) : "0%", " of budget"]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: cn("rounded-2xl border-0 shadow-none", remaining < 0 ? "bg-expense/8" : "bg-income/8"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "h-3.5 w-3.5" }),
											" ",
											remaining < 0 ? "Over Budget" : "Remaining"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cn("text-3xl font-bold tracking-tight", remaining < 0 ? "text-expense" : "text-income"),
										children: formatMoney(Math.abs(remaining))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: remaining < 0 ? "over budget" : "available to spend"
									})
								]
							})
						}),
						totalLimit > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "rounded-2xl border-0 bg-muted/40 shadow-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex items-center justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Overall spending"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("font-semibold", textColor(totalSpent / totalLimit * 100)),
										children: formatPercent(totalSpent / totalLimit * 100)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-3 w-full overflow-hidden rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("h-full rounded-full transition-all duration-500", barColor(totalSpent / totalLimit * 100)),
										style: { width: `${Math.min(totalSpent / totalLimit * 100, 100)}%` }
									})
								})]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 lg:col-span-2",
					children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted-foreground",
								children: "No budgets yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Create your first budget to start tracking"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: openAdd,
								className: "mt-4 gap-2",
								size: "sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New budget"]
							})
						]
					}) : rows.map((r) => {
						const categoryExpenses = expensesByCategory.get(r.category) || [];
						const remaining = r.limit - r.spent;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
							open: hoveredBudget === r.id,
							onOpenChange: (open) => !open && setHoveredBudget(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: cn("rounded-2xl border-0 shadow-none transition-all hover:shadow-sm cursor-pointer", barBg(r.pct)),
									onMouseEnter: () => handleBudgetMouseEnter(r.id),
									onMouseLeave: handleBudgetMouseLeave,
									onTouchStart: () => handleTouchStart(r.id),
									onTouchEnd: handleTouchEnd,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "p-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryPill, { name: r.category }),
															r.pct >= 100 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "rounded-full bg-expense/15 px-2 py-0.5 text-[10px] font-semibold text-expense",
																children: "Over budget"
															}),
															r.pct >= 80 && r.pct < 100 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning",
																children: "Near limit"
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-3 flex items-end gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-2xl font-bold leading-none",
															children: formatMoney(r.spent)
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "mb-0.5 text-sm text-muted-foreground",
															children: ["of ", formatMoney(r.limit)]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: cn("h-full rounded-full transition-all duration-500", barColor(r.pct)),
															style: { width: `${Math.min(r.pct, 100)}%` }
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2 flex items-center justify-between",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: cn("text-xs font-semibold", textColor(r.pct)),
															children: [formatPercent(r.pct), " used"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-muted-foreground",
															children: r.limit - r.spent >= 0 ? `${formatMoney(r.limit - r.spent)} left` : `${formatMoney(r.spent - r.limit)} over`
														})]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex shrink-0 flex-col gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8 rounded-xl hover:bg-background/60",
													onClick: (e) => {
														e.stopPropagation();
														openEdit(r);
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "h-8 w-8 rounded-xl text-expense hover:bg-expense/10",
													onClick: (e) => {
														e.stopPropagation();
														deleteBudget(r.id);
														toast.success("Budget removed");
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})]
											})]
										})
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
								side: "right",
								className: "w-80 p-0",
								align: "start",
								onMouseEnter: handlePopoverMouseEnter,
								onMouseLeave: handlePopoverMouseLeave,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryPill, { name: r.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold",
											children: "Expenses"
										})]
									}), categoryExpenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "py-8 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "No expenses added for this category yet."
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "max-h-48 space-y-2 overflow-y-auto",
										children: [categoryExpenses.slice(0, 10).map((expense) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-xs font-medium",
													children: expense.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground",
													children: formatDate(expense.date, settings.dateFormat)
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "ml-2 text-xs font-semibold text-expense",
												children: ["-", formatMoney(expense.amount)]
											})]
										}, expense.id)), categoryExpenses.length > 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-center text-xs text-muted-foreground",
											children: [
												"+",
												categoryExpenses.length - 10,
												" more expenses"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 space-y-2 rounded-xl bg-muted/40 p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Total Spent"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: formatMoney(r.spent)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Budget Limit"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: formatMoney(r.limit)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: remaining >= 0 ? "Remaining" : "Over Budget"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("font-semibold", remaining >= 0 ? "text-income" : "text-expense"),
													children: formatMoney(Math.abs(remaining))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Transactions"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: categoryExpenses.length
												})]
											})
										]
									})] })]
								})
							})]
						}, r.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit budget" : "New budget" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Select category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-3 gap-2 sm:grid-cols-4",
									children: EXPENSE_CATEGORIES.map((c) => {
										const Icon = c.icon;
										const isSelected = category === c.name;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => !editing && setCategory(c.name),
											disabled: !!editing,
											className: cn("relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all duration-200", isSelected ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background hover:border-primary/40 hover:bg-muted/50", editing && "cursor-not-allowed opacity-50"),
											children: [
												isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute right-2 top-2",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-5 w-5", isSelected ? "text-primary-foreground" : "text-muted-foreground") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("text-xs font-medium", isSelected ? "text-primary-foreground" : "text-foreground"),
													children: c.name
												})
											]
										}, c.id);
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-medium text-muted-foreground",
											children: "Monthly limit"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-lg bg-primary/10 px-3 py-1 text-lg font-bold text-primary",
											children: formatMoney(sliderVal)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										min: SLIDER_MIN,
										max: SLIDER_MAX,
										step: SLIDER_STEP,
										value: [sliderVal],
										onValueChange: ([v]) => setSliderVal(v),
										className: "w-full"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(SLIDER_MIN) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(SLIDER_MAX / 2) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(SLIDER_MAX) })
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setOpen(false),
								className: "rounded-xl",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: submit,
								className: "rounded-xl",
								children: editing ? "Save changes" : "Create budget"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Budgets as component };
