import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
import { B as Lightbulb, d as TrendingDown, kt as Brain, l as TriangleAlert, mt as CircleCheckBig, p as Target, u as TrendingUp, wt as Calendar } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./shared-Cu4KJl81.mjs";
import { d as useActiveExpenses, f as useApp, r as formatMoney } from "./AppContext-CvoDtxI1.mjs";
import { t as PremiumGate } from "./PremiumGate-C7UoENI_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/predictions-CKQ0kuJA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Predictions() {
	const { income, budgets, savingsGoals } = useApp();
	const expenses = useActiveExpenses();
	const [timeRange, setTimeRange] = (0, import_react.useState)("monthly");
	const predictions = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();
		const monthlyExpenses = expenses.filter((e) => {
			const d = new Date(e.date);
			return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
		});
		const monthlyIncome = income.filter((i) => {
			const d = new Date(i.date);
			return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
		});
		const totalMonthlyExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
		const totalMonthlyIncome = monthlyIncome.reduce((sum, i) => sum + i.amount, 0);
		const monthlyBalance = totalMonthlyIncome - totalMonthlyExpenses;
		const categorySpending = /* @__PURE__ */ new Map();
		monthlyExpenses.forEach((e) => {
			categorySpending.set(e.category, (categorySpending.get(e.category) || 0) + e.amount);
		});
		const budgetStatus = budgets.map((b) => {
			const spent = categorySpending.get(b.category) || 0;
			const pct = b.limit > 0 ? spent / b.limit * 100 : 0;
			return {
				...b,
				spent,
				pct
			};
		});
		const avgMonthlyExpenses = expenses.length > 0 ? expenses.reduce((sum, e) => sum + e.amount, 0) / Math.max(1, new Set(expenses.map((e) => e.date.slice(0, 7))).size) : 0;
		const avgMonthlyIncome = income.length > 0 ? income.reduce((sum, i) => sum + i.amount, 0) / Math.max(1, new Set(income.map((i) => i.date.slice(0, 7))).size) : 0;
		const yearlyProjectedExpenses = avgMonthlyExpenses * 12;
		const yearlyProjectedIncome = avgMonthlyIncome * 12;
		const yearlyProjectedBalance = yearlyProjectedIncome - yearlyProjectedExpenses;
		const totalSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
		const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
		const monthlySavingsRate = monthlyBalance > 0 ? monthlyBalance : 0;
		const projectedYearlySavings = monthlySavingsRate * 12;
		const insights = [];
		budgetStatus.forEach((b) => {
			if (b.pct >= 90) insights.push({
				type: "warning",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" }),
				title: `${b.category} budget nearly exceeded`,
				message: `You've used ${Math.round(b.pct)}% of your ${formatMoney(b.limit)} budget.`,
				metric: `${formatMoney(b.spent)} / ${formatMoney(b.limit)}`
			});
			else if (b.pct <= 50 && b.spent > 0) insights.push({
				type: "success",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-5 w-5" }),
				title: `Great job on ${b.category}`,
				message: `You're well within your budget with ${formatMoney(b.limit - b.spent)} remaining.`,
				metric: `${Math.round(b.pct)}% used`
			});
		});
		const topCategory = Array.from(categorySpending.entries()).sort((a, b) => b[1] - a[1])[0];
		if (topCategory) {
			const avgSpend = categorySpending.size > 0 ? Array.from(categorySpending.values()).reduce((a, b) => a + b, 0) / categorySpending.size : 0;
			if (topCategory[1] > avgSpend * 1.5) insights.push({
				type: "info",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }),
				title: `High spending on ${topCategory[0]}`,
				message: `You spend ${formatMoney(topCategory[1])} on ${topCategory[0]}, which is higher than average.`,
				metric: formatMoney(topCategory[1])
			});
		}
		if (savingsGoals.length > 0) {
			const completedGoals = savingsGoals.filter((g) => g.currentAmount >= g.targetAmount).length;
			if (completedGoals > 0) insights.push({
				type: "success",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-5 w-5" }),
				title: `${completedGoals} savings goal${completedGoals > 1 ? "s" : ""} reached!`,
				message: "Congratulations on achieving your savings targets!",
				metric: `${completedGoals}/${savingsGoals.length} completed`
			});
			if (monthlySavingsRate > 0) insights.push({
				type: "info",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }),
				title: "Monthly savings rate",
				message: `At this rate, you could save ${formatMoney(projectedYearlySavings)} this year.`,
				metric: formatMoney(monthlySavingsRate) + "/month"
			});
		}
		if (monthlyBalance < 0) insights.push({
			type: "warning",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-5 w-5" }),
			title: "Monthly deficit detected",
			message: `You're spending ${formatMoney(Math.abs(monthlyBalance))} more than you earn this month.`,
			metric: formatMoney(monthlyBalance)
		});
		else if (monthlyBalance > 0) insights.push({
			type: "success",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5" }),
			title: "Positive cash flow",
			message: `You have ${formatMoney(monthlyBalance)} surplus this month. Consider adding to savings.`,
			metric: formatMoney(monthlyBalance)
		});
		return {
			monthly: {
				expenses: totalMonthlyExpenses,
				income: totalMonthlyIncome,
				balance: monthlyBalance,
				budgetStatus,
				categorySpending
			},
			yearly: {
				projectedExpenses: yearlyProjectedExpenses,
				projectedIncome: yearlyProjectedIncome,
				projectedBalance: yearlyProjectedBalance,
				projectedSavings: projectedYearlySavings
			},
			savings: {
				totalSaved: totalSavings,
				totalTarget: totalSavingsTarget,
				monthlyRate: monthlySavingsRate
			},
			insights
		};
	}, [
		expenses,
		income,
		budgets,
		savingsGoals
	]);
	timeRange === "monthly" ? predictions.monthly : predictions.yearly;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PremiumGate, {
		feature: "Financial Predictions and AI Insights",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Predictions",
				description: "AI-powered financial insights and future projections."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: timeRange === "monthly" ? "default" : "outline",
					onClick: () => setTimeRange("monthly"),
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" }), " Monthly"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: timeRange === "yearly" ? "default" : "outline",
					onClick: () => setTimeRange("yearly"),
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" }), " Yearly"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl border-0 bg-income/8 shadow-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }), " Predicted Income"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-3xl font-bold tracking-tight text-income",
									children: formatMoney(timeRange === "monthly" ? predictions.monthly.income : predictions.yearly.projectedIncome)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: timeRange === "monthly" ? "This month" : "This year"
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5" }), " Predicted Expenses"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-3xl font-bold tracking-tight text-expense",
									children: formatMoney(timeRange === "monthly" ? predictions.monthly.expenses : predictions.yearly.projectedExpenses)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: timeRange === "monthly" ? "This month" : "This year"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: cn("rounded-2xl border-0 shadow-none", (timeRange === "monthly" ? predictions.monthly.balance : predictions.yearly.projectedBalance) >= 0 ? "bg-income/8" : "bg-expense/8"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-3.5 w-3.5" }), " Predicted Balance"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-3xl font-bold tracking-tight", (timeRange === "monthly" ? predictions.monthly.balance : predictions.yearly.projectedBalance) >= 0 ? "text-income" : "text-expense"),
									children: formatMoney(timeRange === "monthly" ? predictions.monthly.balance : predictions.yearly.projectedBalance)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: timeRange === "monthly" ? "This month" : "This year"
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-4 text-lg font-semibold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-5 w-5 text-warning" }), "AI Insights"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: predictions.insights.map((insight, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: cn("rounded-2xl border-0 shadow-none transition-all hover:shadow-sm", insight.type === "success" && "bg-income/8", insight.type === "warning" && "bg-expense/8", insight.type === "info" && "bg-primary/8"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", insight.type === "success" && "bg-income/20 text-income", insight.type === "warning" && "bg-expense/20 text-expense", insight.type === "info" && "bg-primary/20 text-primary"),
										children: insight.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-sm font-semibold text-foreground mb-1",
												children: insight.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground mb-2",
												children: insight.message
											}),
											insight.metric && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-semibold", insight.type === "success" && "bg-income/15 text-income", insight.type === "warning" && "bg-expense/15 text-expense", insight.type === "info" && "bg-primary/15 text-primary"),
												children: insight.metric
											})
										]
									})]
								})
							})
						}, idx))
					}),
					predictions.insights.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted-foreground",
								children: "No insights available yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Add more transactions to get personalized insights"
							})
						]
					})
				]
			}),
			timeRange === "monthly" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-lg font-semibold",
					children: "Budget Status"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-3",
					children: predictions.monthly.budgetStatus.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl border-0 shadow-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold text-foreground",
										children: b.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("text-xs font-semibold", b.pct >= 90 ? "text-expense" : b.pct >= 70 ? "text-warning" : "text-income"),
										children: [Math.round(b.pct), "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 mb-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("h-full rounded-full transition-all duration-500", b.pct >= 90 ? "bg-expense" : b.pct >= 70 ? "bg-warning" : "bg-income"),
										style: { width: `${Math.min(b.pct, 100)}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatMoney(b.spent), " spent"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatMoney(b.limit - b.spent), " remaining"] })]
								})
							]
						})
					}, b.id))
				}),
				predictions.monthly.budgetStatus.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-muted-foreground",
							children: "No budgets set"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Create budgets to track your spending"
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-lg font-semibold",
					children: "Savings Projection"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-2xl border-0 bg-primary/8 shadow-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground mb-1",
									children: "Total Saved"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-foreground",
									children: formatMoney(predictions.savings.totalSaved)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground mb-1",
									children: "Total Target"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-bold text-foreground",
									children: formatMoney(predictions.savings.totalTarget)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-muted-foreground mb-1",
									children: "Monthly Savings Rate"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-2xl font-bold", predictions.savings.monthlyRate >= 0 ? "text-income" : "text-expense"),
									children: formatMoney(predictions.savings.monthlyRate)
								})] })
							]
						}), predictions.savings.totalTarget > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Overall Progress"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-foreground",
									children: [Math.round(predictions.savings.totalSaved / predictions.savings.totalTarget * 100), "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-primary transition-all duration-500",
									style: { width: `${Math.min(predictions.savings.totalSaved / predictions.savings.totalTarget * 100, 100)}%` }
								})
							})]
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { Predictions as component };
