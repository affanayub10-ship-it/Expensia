import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
import { Et as CalendarClock, M as PiggyBank, X as FileSpreadsheet, Y as FileText, Z as FileDown, c as Trophy, d as TrendingDown, g as Store, m as Tag, r as Wallet, u as TrendingUp, xt as Check } from "../_libs/lucide-react.mjs";
import { t as EXPENSE_CATEGORIES } from "./mock-data-Cl4Xf6-R.mjs";
import { i as StatCard, r as PageHeader } from "./shared-Cu4KJl81.mjs";
import { d as useActiveExpenses, f as useApp, i as formatPercent, n as formatDate, r as formatMoney } from "./AppContext-CvoDtxI1.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid } from "../_libs/recharts+[...].mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-CCQzNKY_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var COLORS = [
	"#3b9ede",
	"#4caf8a",
	"#e8a838",
	"#e05c3a",
	"#8b5cf6",
	"#60a5fa",
	"#f472b6",
	"#34d399",
	"#fb923c",
	"#a78bfa",
	"#38bdf8"
];
var TIME_RANGES = [
	{
		value: "last7days",
		label: "Last 7 Days"
	},
	{
		value: "last30days",
		label: "Last 30 Days"
	},
	{
		value: "thisMonth",
		label: "This Month"
	},
	{
		value: "lastMonth",
		label: "Last Month"
	},
	{
		value: "custom",
		label: "Custom Range"
	}
];
function Reports() {
	const { income, budgets, settings } = useApp();
	const expenses = useActiveExpenses();
	const [range, setRange] = (0, import_react.useState)("monthly");
	const [analysisTab, setAnalysisTab] = (0, import_react.useState)("overview");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)(null);
	const [timeRange, setTimeRange] = (0, import_react.useState)("last30days");
	const [customStartDate, setCustomStartDate] = (0, import_react.useState)("");
	const [customEndDate, setCustomEndDate] = (0, import_react.useState)("");
	const { startDate, chartBuckets } = (0, import_react.useMemo)(() => {
		const start = /* @__PURE__ */ new Date();
		if (range === "daily") {
			start.setDate(start.getDate() - 6);
			start.setHours(0, 0, 0, 0);
			return {
				startDate: start,
				chartBuckets: Array.from({ length: 7 }, (_, i) => {
					const d = /* @__PURE__ */ new Date();
					d.setDate(d.getDate() - (6 - i));
					const s = new Date(d);
					s.setHours(0, 0, 0, 0);
					const e = new Date(d);
					e.setHours(23, 59, 59, 999);
					return {
						label: d.toLocaleString("default", { weekday: "short" }),
						start: s,
						end: e
					};
				})
			};
		}
		if (range === "weekly") {
			start.setDate(start.getDate() - 27);
			start.setHours(0, 0, 0, 0);
			return {
				startDate: start,
				chartBuckets: Array.from({ length: 4 }, (_, i) => {
					const wEnd = /* @__PURE__ */ new Date();
					wEnd.setDate(wEnd.getDate() - (3 - i) * 7);
					wEnd.setHours(23, 59, 59, 999);
					const wStart = new Date(wEnd);
					wStart.setDate(wStart.getDate() - 6);
					wStart.setHours(0, 0, 0, 0);
					return {
						label: `W${i + 1}`,
						start: wStart,
						end: wEnd
					};
				})
			};
		}
		if (range === "quarterly") {
			start.setMonth(start.getMonth() - 2);
			start.setDate(1);
			start.setHours(0, 0, 0, 0);
			return {
				startDate: start,
				chartBuckets: Array.from({ length: 3 }, (_, i) => {
					const d = /* @__PURE__ */ new Date();
					d.setMonth(d.getMonth() - (2 - i));
					return {
						label: d.toLocaleString("default", { month: "short" }),
						start: new Date(d.getFullYear(), d.getMonth(), 1),
						end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
					};
				})
			};
		}
		if (range === "yearly") {
			start.setFullYear(start.getFullYear() - 1);
			start.setDate(1);
			start.setHours(0, 0, 0, 0);
			return {
				startDate: start,
				chartBuckets: Array.from({ length: 12 }, (_, i) => {
					const d = /* @__PURE__ */ new Date();
					d.setMonth(d.getMonth() - (11 - i));
					return {
						label: d.toLocaleString("default", { month: "short" }),
						start: new Date(d.getFullYear(), d.getMonth(), 1),
						end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
					};
				})
			};
		}
		start.setDate(1);
		start.setHours(0, 0, 0, 0);
		return {
			startDate: start,
			chartBuckets: Array.from({ length: 4 }, (_, i) => {
				const wEnd = /* @__PURE__ */ new Date();
				wEnd.setDate(wEnd.getDate() - (3 - i) * 7);
				wEnd.setHours(23, 59, 59, 999);
				const wStart = new Date(wEnd);
				wStart.setDate(wStart.getDate() - 6);
				wStart.setHours(0, 0, 0, 0);
				return {
					label: `W${i + 1}`,
					start: wStart,
					end: wEnd
				};
			})
		};
	}, [range]);
	const filteredExpenses = (0, import_react.useMemo)(() => expenses.filter((e) => new Date(e.date) >= startDate), [expenses, startDate]);
	const filteredIncome = (0, import_react.useMemo)(() => income.filter((i) => new Date(i.date) >= startDate), [income, startDate]);
	const totalExpenses = (0, import_react.useMemo)(() => filteredExpenses.reduce((s, e) => s + e.amount, 0), [filteredExpenses]);
	const totalIncome = (0, import_react.useMemo)(() => filteredIncome.reduce((s, i) => s + i.amount, 0), [filteredIncome]);
	const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
	const savings = totalIncome - totalExpenses;
	const monthlySeries = (0, import_react.useMemo)(() => chartBuckets.map(({ label, start, end }) => ({
		month: label,
		income: filteredIncome.filter((i) => {
			const d = new Date(i.date);
			return d >= start && d <= end;
		}).reduce((s, i) => s + i.amount, 0),
		expenses: filteredExpenses.filter((e) => {
			const d = new Date(e.date);
			return d >= start && d <= end;
		}).reduce((s, e) => s + e.amount, 0)
	})), [
		chartBuckets,
		filteredExpenses,
		filteredIncome
	]);
	const byCategory = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		filteredExpenses.forEach((e) => m.set(e.category, (m.get(e.category) ?? 0) + e.amount));
		return EXPENSE_CATEGORIES.map((c) => ({
			name: c.name,
			value: m.get(c.name) ?? 0
		})).filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
	}, [filteredExpenses]);
	const highest = (0, import_react.useMemo)(() => [...filteredExpenses].sort((a, b) => b.amount - a.amount)[0], [filteredExpenses]);
	const frequentCategory = (0, import_react.useMemo)(() => {
		if (!filteredExpenses.length) return "—";
		const m = /* @__PURE__ */ new Map();
		filteredExpenses.forEach((e) => {
			const cat = e.category.trim();
			m.set(cat, (m.get(cat) ?? 0) + 1);
		});
		return [...m.entries()].sort((a, b) => b[1] - a[1])[0][0];
	}, [filteredExpenses]);
	const avgDaily = totalExpenses / (range === "daily" ? 7 : range === "weekly" ? 28 : range === "monthly" ? 30 : range === "quarterly" ? 90 : 365);
	const rangeLabel = range === "daily" ? "Last 7 days" : range === "weekly" ? "Last 4 weeks" : range === "monthly" ? "This month" : range === "quarterly" ? "Last 3 months" : "Last 12 months";
	function exportCSV() {
		downloadFile(["Date,Title,Category,Amount,Status", ...filteredExpenses.map((e) => [
			e.date,
			`"${e.title}"`,
			e.category,
			e.amount.toFixed(2),
			e.status
		].join(","))].join("\n"), `expenses-${rangeLabel.replace(/ /g, "-")}.csv`, "text/csv");
	}
	function exportJSON() {
		downloadFile(JSON.stringify({
			range: rangeLabel,
			summary: {
				totalExpenses,
				totalIncome,
				savings
			},
			expenses: filteredExpenses,
			income: filteredIncome
		}, null, 2), `report-${rangeLabel.replace(/ /g, "-")}.json`, "application/json");
	}
	function exportPDF() {
		const rows = filteredExpenses.map((e) => `<tr><td>${e.date}</td><td>${e.title}</td><td>${e.category}</td><td>$${e.amount.toFixed(2)}</td><td>${e.status}</td></tr>`).join("");
		const html = `<html><head><title>Report</title><style>body{font-family:sans-serif;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px}th{background:#f3f4f6}</style></head><body><h2>Expense Report — ${rangeLabel}</h2><p>Expenses: ${formatMoney(totalExpenses)} | Income: ${formatMoney(totalIncome)} | Savings: ${formatMoney(savings)}</p><table><thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
		const w = window.open("", "_blank");
		if (w) {
			w.document.write(html);
			w.document.close();
			w.print();
		}
	}
	function downloadFile(content, filename, type) {
		const b = new Blob([content], { type });
		const u = URL.createObjectURL(b);
		const a = document.createElement("a");
		a.href = u;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(u);
	}
	const { dateRangeStart, dateRangeEnd, dateRangeLabel } = (0, import_react.useMemo)(() => {
		const start = /* @__PURE__ */ new Date();
		const end = /* @__PURE__ */ new Date();
		switch (timeRange) {
			case "last7days":
				start.setDate(start.getDate() - 6);
				start.setHours(0, 0, 0, 0);
				end.setHours(23, 59, 59, 999);
				return {
					dateRangeStart: start,
					dateRangeEnd: end,
					dateRangeLabel: "Last 7 Days"
				};
			case "last30days":
				start.setDate(start.getDate() - 29);
				start.setHours(0, 0, 0, 0);
				end.setHours(23, 59, 59, 999);
				return {
					dateRangeStart: start,
					dateRangeEnd: end,
					dateRangeLabel: "Last 30 Days"
				};
			case "thisMonth":
				start.setDate(1);
				start.setHours(0, 0, 0, 0);
				end.setMonth(end.getMonth() + 1);
				end.setDate(0);
				end.setHours(23, 59, 59, 999);
				return {
					dateRangeStart: start,
					dateRangeEnd: end,
					dateRangeLabel: "This Month"
				};
			case "lastMonth":
				start.setMonth(start.getMonth() - 1);
				start.setDate(1);
				start.setHours(0, 0, 0, 0);
				end.setMonth(end.getMonth());
				end.setDate(0);
				end.setHours(23, 59, 59, 999);
				return {
					dateRangeStart: start,
					dateRangeEnd: end,
					dateRangeLabel: "Last Month"
				};
			case "custom":
				if (customStartDate && customEndDate) return {
					dateRangeStart: new Date(customStartDate),
					dateRangeEnd: new Date(customEndDate),
					dateRangeLabel: "Custom Range"
				};
				return {
					dateRangeStart: start,
					dateRangeEnd: end,
					dateRangeLabel: "Custom Range"
				};
			default:
				start.setDate(start.getDate() - 29);
				start.setHours(0, 0, 0, 0);
				end.setHours(23, 59, 59, 999);
				return {
					dateRangeStart: start,
					dateRangeEnd: end,
					dateRangeLabel: "Last 30 Days"
				};
		}
	}, [
		timeRange,
		customStartDate,
		customEndDate
	]);
	const categoryExpenses = (0, import_react.useMemo)(() => {
		if (!selectedCategory) return [];
		return expenses.filter((e) => {
			const eDate = new Date(e.date);
			return e.category === selectedCategory && eDate >= dateRangeStart && eDate <= dateRangeEnd;
		});
	}, [
		expenses,
		selectedCategory,
		dateRangeStart,
		dateRangeEnd
	]);
	(0, import_react.useMemo)(() => categoryExpenses.reduce((sum, e) => sum + e.amount, 0), [categoryExpenses]);
	const totalSpendingInRange = (0, import_react.useMemo)(() => expenses.filter((e) => {
		const eDate = new Date(e.date);
		return eDate >= dateRangeStart && eDate <= dateRangeEnd;
	}).reduce((sum, e) => sum + e.amount, 0), [
		expenses,
		dateRangeStart,
		dateRangeEnd
	]);
	const categoryStats = (0, import_react.useMemo)(() => {
		if (categoryExpenses.length === 0) return null;
		const amounts = categoryExpenses.map((e) => e.amount);
		const total = amounts.reduce((a, b) => a + b, 0);
		const avg = total / amounts.length;
		const highest = Math.max(...amounts);
		const lowest = Math.min(...amounts);
		const avgDaily = total / (Math.ceil((dateRangeEnd.getTime() - dateRangeStart.getTime()) / (1e3 * 60 * 60 * 24)) || 1);
		const percentageOfTotal = totalSpendingInRange > 0 ? total / totalSpendingInRange * 100 : 0;
		const highestExpense = categoryExpenses.find((e) => e.amount === highest);
		const lowestExpense = categoryExpenses.find((e) => e.amount === lowest);
		return {
			total,
			transactionCount: categoryExpenses.length,
			averageExpense: avg,
			highestExpense,
			lowestExpense,
			averageDailySpending: avgDaily,
			percentageOfTotal
		};
	}, [
		categoryExpenses,
		dateRangeStart,
		dateRangeEnd,
		totalSpendingInRange
	]);
	const categorySpendingChart = (0, import_react.useMemo)(() => {
		if (!selectedCategory || categoryExpenses.length === 0) return [];
		const dailySpending = /* @__PURE__ */ new Map();
		categoryExpenses.forEach((e) => {
			const dateKey = e.date;
			dailySpending.set(dateKey, (dailySpending.get(dateKey) || 0) + e.amount);
		});
		return Array.from(dailySpending.keys()).sort().map((date) => ({
			date: formatDate(date, settings.dateFormat),
			amount: dailySpending.get(date) || 0
		}));
	}, [categoryExpenses, settings.dateFormat]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Reports & Analytics",
		description: `Showing data for: ${rangeLabel}`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportCSV,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "h-4 w-4" }), " CSV"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportJSON,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4" }), " JSON"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: exportPDF,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), " PDF"]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		value: analysisTab,
		onValueChange: setAnalysisTab,
		className: "mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "overview",
				children: "Overview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "category",
				children: "Category Analysis"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "overview",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
						value: range,
						onValueChange: setRange,
						className: "mb-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "daily",
								children: "Daily"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "weekly",
								children: "Weekly"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "monthly",
								children: "Monthly"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "quarterly",
								children: "Quarterly"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "yearly",
								children: "Yearly"
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Total Income",
								value: formatMoney(totalIncome),
								icon: TrendingUp,
								accent: "income"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Total Expense",
								value: formatMoney(totalExpenses),
								icon: TrendingDown,
								accent: "expense"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Savings",
								value: formatMoney(savings),
								icon: PiggyBank,
								accent: savings >= 0 ? "income" : "expense"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Budget Used",
								value: formatPercent(totalBudget ? totalExpenses / totalBudget * 100 : 0),
								icon: Wallet,
								accent: "warning"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "flex items-center gap-3 p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-xl bg-expense/10 text-expense",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Highest Expense"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-semibold",
												children: highest?.title ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-expense",
												children: highest ? formatMoney(highest.amount) : ""
											})
										]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "flex items-center gap-3 p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Most Frequent Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-semibold",
											children: frequentCategory
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "flex items-center gap-3 p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Avg Daily Spending"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-semibold",
											children: formatMoney(avgDaily)
										})]
									})]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-soft lg:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base",
									children: ["Income vs Expenses — ", rangeLabel]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: 280,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
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
												contentStyle: {
													backgroundColor: "#1e293b",
													border: "none",
													borderRadius: "0.75rem",
													fontSize: "12px",
													color: "#f1f5f9"
												},
												formatter: (v, n) => [formatMoney(v), n]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "income",
												name: "Income",
												fill: "#4caf8a",
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
												fill: "#e05c3a",
												radius: [
													6,
													6,
													0,
													0
												]
											})
										]
									})
								}) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-base",
									children: "Spending by Category"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "space-y-3",
									children: byCategory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "py-6 text-center text-sm text-muted-foreground",
										children: "No expense data yet"
									}) : byCategory.map((c, i) => {
										const pct = totalExpenses > 0 ? c.value / totalExpenses * 100 : 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "h-2.5 w-2.5 shrink-0 rounded-full",
													style: { backgroundColor: COLORS[i % COLORS.length] }
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [
													formatMoney(c.value),
													" · ",
													formatPercent(pct)
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 h-2 w-full overflow-hidden rounded-full bg-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full transition-all",
												style: {
													width: `${pct}%`,
													backgroundColor: COLORS[i % COLORS.length]
												}
											})
										})] }, c.name);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-base",
									children: "Top Expenses"
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "space-y-3",
									children: filteredExpenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "py-6 text-center text-sm text-muted-foreground",
										children: "No expense data yet"
									}) : [...filteredExpenses].sort((a, b) => b.amount - a.amount).slice(0, 8).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-2.5 w-2.5 shrink-0 rounded-full",
												style: { backgroundColor: COLORS[i % COLORS.length] }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: e.title
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground shrink-0 ml-2",
											children: formatMoney(e.amount)
										})]
									}, e.id))
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "category",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Select Category"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2 sm:grid-cols-4",
								children: EXPENSE_CATEGORIES.map((c) => {
									const Icon = c.icon;
									const isSelected = selectedCategory === c.name;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setSelectedCategory(c.name),
										className: cn("relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all duration-200", isSelected ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"),
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
							}) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Select Time Range"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: TIME_RANGES.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTimeRange(tr.value),
									className: cn("rounded-lg border px-3 py-2 text-sm font-medium transition-all", timeRange === tr.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:border-primary/40"),
									children: tr.label
								}, tr.value))
							}), timeRange === "custom" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium text-muted-foreground",
										children: "Start Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: customStartDate,
										onChange: (e) => setCustomStartDate(e.target.value),
										className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-medium text-muted-foreground",
										children: "End Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: customEndDate,
										onChange: (e) => setCustomEndDate(e.target.value),
										className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
									})]
								})]
							})] })]
						}),
						selectedCategory && categoryStats && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										label: "Total Spent",
										value: formatMoney(categoryStats.total),
										icon: TrendingDown,
										accent: "expense"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										label: "Transactions",
										value: categoryStats.transactionCount.toString(),
										icon: Tag,
										accent: "primary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										label: "Average Expense",
										value: formatMoney(categoryStats.averageExpense),
										icon: Wallet,
										accent: "warning"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
										label: "Avg Daily Spending",
										value: formatMoney(categoryStats.averageDailySpending),
										icon: CalendarClock,
										accent: "income"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "shadow-soft",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "flex items-center gap-3 p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-10 w-10 items-center justify-center rounded-xl bg-expense/10 text-expense",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground",
														children: "Highest Expense"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "truncate font-semibold",
														children: categoryStats.highestExpense?.title ?? "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-expense",
														children: formatMoney(categoryStats.highestExpense?.amount || 0)
													})
												]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "shadow-soft",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "flex items-center gap-3 p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-10 w-10 items-center justify-center rounded-xl bg-income/10 text-income",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground",
														children: "Lowest Expense"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "truncate font-semibold",
														children: categoryStats.lowestExpense?.title ?? "—"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-income",
														children: formatMoney(categoryStats.lowestExpense?.amount || 0)
													})
												]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "shadow-soft",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
											className: "flex items-center gap-3 p-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-5 w-5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: "% of Total Spending"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate font-semibold",
													children: formatPercent(categoryStats.percentageOfTotal)
												})]
											})]
										})
									})
								]
							}),
							categorySpendingChart.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "mb-6 shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base",
									children: ["Spending Over Time — ", selectedCategory]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: 250,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: categorySpendingChart,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												stroke: "#e2e8f0",
												vertical: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "date",
												tick: {
													fontSize: 11,
													fill: "#94a3b8"
												},
												axisLine: false,
												tickLine: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												tick: {
													fontSize: 11,
													fill: "#94a3b8"
												},
												axisLine: false,
												tickLine: false,
												tickFormatter: formatMoney,
												width: 70
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
												contentStyle: {
													backgroundColor: "#1e293b",
													border: "none",
													borderRadius: "0.75rem",
													fontSize: "12px",
													color: "#f1f5f9"
												},
												formatter: (v) => [formatMoney(v), "Spent"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "amount",
												stroke: "#3b9ede",
												strokeWidth: 2.5,
												dot: {
													r: 4,
													fill: "#3b9ede"
												},
												activeDot: { r: 6 }
											})
										]
									})
								}) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-soft",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base",
									children: [
										"Transactions — ",
										selectedCategory,
										" (",
										dateRangeLabel,
										")"
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: categoryExpenses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "py-6 text-center text-sm text-muted-foreground",
									children: "No transactions found for this category and time range"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: categoryExpenses.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-sm font-medium",
													children: e.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: formatDate(e.date, settings.dateFormat)
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold text-expense",
											children: formatMoney(e.amount)
										})]
									}, e.id))
								}) })]
							})
						] }),
						!selectedCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "shadow-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "flex flex-col items-center justify-center py-12",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "h-12 w-12 text-muted-foreground mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-muted-foreground",
									children: "Select a category above to view detailed analysis"
								})]
							})
						})
					]
				})
			})
		]
	})] });
}
//#endregion
export { Reports as component };
