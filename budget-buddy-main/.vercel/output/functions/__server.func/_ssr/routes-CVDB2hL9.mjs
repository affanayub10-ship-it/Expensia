import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BcaWptOW.mjs";
import { A as Plus, Ct as ChartColumn, M as PiggyBank, St as ChartLine, d as TrendingDown, r as Wallet, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { t as EXPENSE_CATEGORIES } from "./mock-data-Cl4Xf6-R.mjs";
import { a as StatusBadge, i as StatCard, n as CategoryPill, r as PageHeader, t as CategoryIcon } from "./shared-Cu4KJl81.mjs";
import { d as useActiveExpenses, f as useApp, n as formatDate, r as formatMoney } from "./AppContext-BtlkEzV5.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CVDB2hL9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#3b9ede",
	"#4caf8a",
	"#e8a838",
	"#e05c3a",
	"#8b5cf6",
	"#60a5fa"
];
var INCOME_COLOR = "#4caf8a";
var EXPENSE_COLOR = "#e05c3a";
var tooltipStyle = {
	backgroundColor: "#1e293b",
	border: "none",
	borderRadius: "0.75rem",
	color: "#f1f5f9",
	fontSize: "12px"
};
function Dashboard() {
	const { income, budgets, settings } = useApp();
	const expenses = useActiveExpenses();
	const dateFmt = settings.dateFormat;
	const [chartType, setChartType] = (0, import_react.useState)("bar");
	const totalExpenses = (0, import_react.useMemo)(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
	const totalIncome = (0, import_react.useMemo)(() => income.reduce((s, i) => s + i.amount, 0), [income]);
	const totalBudget = (0, import_react.useMemo)(() => budgets.reduce((s, b) => s + b.limit, 0), [budgets]);
	const balance = totalIncome - totalExpenses;
	const budgetedCategories = (0, import_react.useMemo)(() => new Set(budgets.map((b) => b.category)), [budgets]);
	const remainingBudget = totalBudget - (0, import_react.useMemo)(() => expenses.filter((e) => budgetedCategories.has(e.category)).reduce((s, e) => s + e.amount, 0), [expenses, budgetedCategories]);
	const recent = (0, import_react.useMemo)(() => [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10), [expenses]);
	const monthlySeries = (0, import_react.useMemo)(() => {
		const months = [];
		for (let i = 5; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setMonth(d.getMonth() - i);
			const y = d.getFullYear();
			const m = d.getMonth();
			const label = d.toLocaleString("default", { month: "short" });
			const monthExpenses = expenses.filter((e) => {
				const ed = new Date(e.date);
				return ed.getFullYear() === y && ed.getMonth() === m;
			}).reduce((s, e) => s + e.amount, 0);
			const monthIncome = income.filter((i) => {
				const id = new Date(i.date);
				return id.getFullYear() === y && id.getMonth() === m;
			}).reduce((s, i) => s + i.amount, 0);
			months.push({
				month: label,
				income: monthIncome,
				expenses: monthExpenses
			});
		}
		return months;
	}, [expenses, income]);
	const distribution = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		expenses.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
		return EXPENSE_CATEGORIES.map((c) => ({
			name: c.name,
			value: map.get(c.name) ?? 0
		})).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
	}, [expenses]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Dashboard",
			description: "Your financial overview at a glance."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Current Balance",
					value: formatMoney(balance),
					icon: Wallet,
					accent: "primary",
					trend: balance !== 0 ? {
						value: "This month",
						positive: balance >= 0
					} : void 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Income",
					value: formatMoney(totalIncome),
					icon: TrendingUp,
					accent: "income",
					trend: {
						value: "This month",
						positive: true
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Expenses",
					value: formatMoney(totalExpenses),
					icon: TrendingDown,
					accent: "expense",
					trend: {
						value: "This month",
						positive: false
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: remainingBudget < 0 ? "Over Budget" : "Remaining Budget",
					value: formatMoney(Math.abs(remainingBudget)),
					icon: PiggyBank,
					accent: remainingBudget < 0 ? "expense" : "warning"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex-row items-center justify-between space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Monthly Overview"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Chart type:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1 rounded-lg bg-muted p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: chartType === "bar" ? "default" : "ghost",
								className: "h-7 px-2",
								onClick: () => setChartType("bar"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: chartType === "line" ? "default" : "ghost",
								className: "h-7 px-2",
								onClick: () => setChartType("line"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-4 w-4" })
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 300,
					children: chartType === "bar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: monthlySeries,
						barGap: 4,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "#e2e8f0",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								tick: {
									fontSize: 12,
									fill: "#94a3b8"
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fontSize: 12,
									fill: "#94a3b8"
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: formatMoney,
								width: 80
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: tooltipStyle,
								formatter: (v, n) => [formatMoney(v), n]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "income",
								name: "Income",
								fill: INCOME_COLOR,
								radius: [
									6,
									6,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "expenses",
								name: "Expenses",
								fill: EXPENSE_COLOR,
								radius: [
									6,
									6,
									0,
									0
								]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: monthlySeries,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "#e2e8f0",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								tick: {
									fontSize: 12,
									fill: "#94a3b8"
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fontSize: 12,
									fill: "#94a3b8"
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: formatMoney,
								width: 80
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: tooltipStyle,
								formatter: (v, n) => [formatMoney(v), n]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "income",
								name: "Income",
								stroke: INCOME_COLOR,
								strokeWidth: 2.5,
								dot: {
									r: 4,
									fill: INCOME_COLOR
								},
								activeDot: { r: 6 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "expenses",
								name: "Expenses",
								stroke: EXPENSE_COLOR,
								strokeWidth: 2.5,
								dot: {
									r: 4,
									fill: EXPENSE_COLOR
								},
								activeDot: { r: 6 }
							})
						]
					})
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Expense Distribution"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: distribution.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-[300px] flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-6 w-6 text-muted-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No expense data yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Add expenses to see your spending breakdown"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 240,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: distribution,
						dataKey: "value",
						nameKey: "name",
						innerRadius: 55,
						outerRadius: 90,
						paddingAngle: 3,
						children: distribution.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
							fill: COLORS[i % COLORS.length],
							stroke: "transparent"
						}, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: tooltipStyle,
						formatter: (v, n) => [formatMoney(v), n]
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-2 gap-1.5",
					children: distribution.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2.5 w-2.5 shrink-0 rounded-full",
							style: { backgroundColor: COLORS[i % COLORS.length] }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: d.name
						})]
					}, d.name))
				})] }) })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6 shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex-row items-center justify-between space-y-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Recent Transactions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/expenses",
						children: "View all"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "px-0 sm:px-6",
				children: recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-8 w-8 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold text-foreground mb-1",
							children: "No transactions yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mb-4 max-w-xs",
							children: "Start tracking your expenses by adding your first transaction"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "default",
							size: "sm",
							className: "gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/expenses",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add expense"]
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden sm:block overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Title" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Amount"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: recent.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "whitespace-nowrap text-muted-foreground",
							children: formatDate(e.date, dateFmt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: e.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryPill, { name: e.category }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: e.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-right font-semibold text-expense",
							children: ["-", formatMoney(e.amount)]
						})
					] }, e.id)) })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border px-4 sm:hidden",
					children: recent.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-3.5 first:pt-0 last:pb-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, { name: e.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold text-foreground",
									children: e.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: formatDate(e.date, dateFmt)
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-semibold text-expense",
								children: ["-", formatMoney(e.amount)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex justify-end transform scale-90 origin-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: e.status })
							})]
						})]
					}, e.id))
				})] })
			})]
		})
	] });
}
//#endregion
export { Dashboard as component };
