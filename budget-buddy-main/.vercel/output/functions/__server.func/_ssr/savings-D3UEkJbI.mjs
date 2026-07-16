import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { A as Plus, Ft as ArrowDownRight, G as HandCoins, N as Pencil, bt as ChevronDown, f as Trash2, jt as ArrowUpRight, r as Wallet, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { r as PageHeader } from "./shared-Cu4KJl81.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as useApp, r as formatMoney } from "./AppContext-BtlkEzV5.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as Slider } from "./slider-CuWUdOZr.mjs";
import { t as PremiumGate } from "./PremiumGate-CJux7pqd.mjs";
import { a as SheetHeader, c as useIsMobile, i as SheetFooter, n as SheetContent, o as SheetTitle, r as SheetDescription, s as Textarea, t as Sheet } from "./use-mobile-DgnvvD2q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/savings-D3UEkJbI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SLIDER_MIN = 0;
var SLIDER_MAX = 1e5;
var SLIDER_STEP = 100;
function SavingsDrawer({ open, onOpenChange, editing }) {
	const { addSavingsGoal, updateSavingsGoal } = useApp();
	const isMobile = useIsMobile();
	const [title, setTitle] = (0, import_react.useState)("");
	const [targetAmount, setTargetAmount] = (0, import_react.useState)(1e3);
	const [currentAmount, setCurrentAmount] = (0, import_react.useState)(0);
	const [note, setNote] = (0, import_react.useState)("");
	const [showAdvanced, setShowAdvanced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			if (editing) {
				setTitle(editing.title);
				setTargetAmount(editing.targetAmount);
				setCurrentAmount(editing.currentAmount);
				setNote(editing.note || "");
			} else {
				setTitle("");
				setTargetAmount(1e3);
				setCurrentAmount(0);
				setNote("");
			}
			setShowAdvanced(false);
		}
	}, [open, editing]);
	const submit = async () => {
		if (!title.trim()) return toast.error("Title is required");
		if (targetAmount <= 0) return toast.error("Target amount must be greater than zero");
		try {
			if (editing) {
				await updateSavingsGoal({
					...editing,
					title,
					targetAmount,
					currentAmount,
					note: note || void 0
				});
				toast.success("Savings goal updated");
			} else {
				await addSavingsGoal({
					title,
					targetAmount,
					currentAmount,
					note: note || void 0
				});
				toast.success("Savings goal created");
			}
			onOpenChange(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save savings goal");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: isMobile ? "bottom" : "right",
			className: "flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg h-[85vh] sm:h-full rounded-t-2xl sm:rounded-t-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
					className: "pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: editing ? "Edit goal" : "New savings goal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Set a target and track your progress over time." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 px-1 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "text-xs font-medium text-muted-foreground",
								children: ["Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-expense ml-1",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: title,
								onChange: (e) => setTitle(e.target.value),
								placeholder: "e.g. Emergency Fund, Vacation"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "text-xs font-medium text-muted-foreground",
								children: ["Target Amount ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-expense ml-1",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-lg bg-primary/10 px-3 py-1 text-lg font-bold text-primary",
											children: formatMoney(targetAmount)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										min: SLIDER_MIN,
										max: SLIDER_MAX,
										step: SLIDER_STEP,
										value: [targetAmount],
										onValueChange: ([v]) => setTargetAmount(v),
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShowAdvanced(!showAdvanced),
							className: "flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Advanced Options" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}` })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `grid gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showAdvanced ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Current Saved Amount"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: currentAmount || "",
									onChange: (e) => setCurrentAmount(parseFloat(e.target.value) || 0),
									placeholder: "0.00"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Note (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: note,
									onChange: (e) => setNote(e.target.value),
									placeholder: "Optional notes...",
									rows: 2
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetFooter, {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: submit,
						children: editing ? "Save changes" : "Create goal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					})]
				})
			]
		})
	});
}
function progressColor(pct) {
	if (pct >= 71) return "bg-income";
	if (pct >= 31) return "bg-warning";
	return "bg-expense";
}
function progressBg(pct) {
	if (pct >= 71) return "bg-income/10";
	if (pct >= 31) return "bg-warning/10";
	return "bg-expense/10";
}
function textColor(pct) {
	if (pct >= 71) return "text-income";
	if (pct >= 31) return "text-warning";
	return "text-expense";
}
function Savings() {
	const { savingsGoals, deleteSavingsGoal, addSavingsContribution } = useApp();
	const [drawer, setDrawer] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [contribGoal, setContribGoal] = (0, import_react.useState)(null);
	const [contribAmount, setContribAmount] = (0, import_react.useState)(100);
	const [contribType, setContribType] = (0, import_react.useState)("deposit");
	const isMobile = useIsMobile();
	const totalSaved = (0, import_react.useMemo)(() => savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0), [savingsGoals]);
	const totalTarget = (0, import_react.useMemo)(() => savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0), [savingsGoals]);
	const overallProgress = totalTarget > 0 ? totalSaved / totalTarget * 100 : 0;
	const rows = (0, import_react.useMemo)(() => {
		return savingsGoals.map((g) => {
			const remaining = g.targetAmount - g.currentAmount;
			const pct = g.targetAmount > 0 ? g.currentAmount / g.targetAmount * 100 : 0;
			return {
				...g,
				remaining,
				pct
			};
		});
	}, [savingsGoals]);
	const openAdd = () => {
		setEditing(null);
		setDrawer(true);
	};
	const openEdit = (g) => {
		setEditing(g);
		setDrawer(true);
	};
	const handleAddMoney = async (goalId, amount) => {
		try {
			await addSavingsContribution({
				goalId,
				amount,
				type: "deposit",
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
			});
			toast.success(`Added ${formatMoney(amount)} to savings`);
		} catch (err) {
			toast.error("Failed to add money to savings");
		}
	};
	const handleWithdrawMoney = async (goalId, amount) => {
		const goal = savingsGoals.find((g) => g.id === goalId);
		if (!goal) return;
		if (goal.currentAmount < amount) {
			toast.error(`Insufficient funds. You only have ${formatMoney(goal.currentAmount)} in this goal.`);
			return;
		}
		try {
			await addSavingsContribution({
				goalId,
				amount,
				type: "withdrawal",
				date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
			});
			toast.success(`Withdrew ${formatMoney(amount)} from savings`);
		} catch (err) {
			toast.error("Failed to withdraw money from savings");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PremiumGate, {
		feature: "Savings Goals",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Savings",
				description: "Track your savings goals and build your financial future.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openAdd,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New goal"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl border-0 bg-primary/8 shadow-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3.5 w-3.5" }), " Total Saved"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-3xl font-bold tracking-tight text-foreground",
									children: formatMoney(totalSaved)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [savingsGoals.length, " goals"]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl border-0 bg-income/8 shadow-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }), " Total Target"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-3xl font-bold tracking-tight text-income",
									children: formatMoney(totalTarget)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [formatPercent(overallProgress), " complete"]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: cn("rounded-2xl border-0 shadow-none", progressBg(overallProgress)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5" }), " Overall Progress"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-3xl font-bold tracking-tight", textColor(overallProgress)),
									children: formatPercent(overallProgress)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("h-full rounded-full transition-all duration-500", progressColor(overallProgress)),
										style: { width: `${Math.min(overallProgress, 100)}%` }
									})
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "mb-3 h-10 w-10 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-muted-foreground",
							children: "No savings goals yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Create your first goal to start saving"
						})
					]
				}) : rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: cn("rounded-2xl border-0 shadow-none transition-all hover:shadow-sm", progressBg(r.pct)),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-base font-semibold text-foreground",
											children: r.title
										}), r.pct >= 100 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-income/15 px-2 py-0.5 text-[10px] font-semibold text-income",
											children: "Goal reached!"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-end gap-2 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl font-bold leading-none",
											children: formatMoney(r.currentAmount)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mb-0.5 text-sm text-muted-foreground",
											children: ["of ", formatMoney(r.targetAmount)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 mb-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("h-full rounded-full transition-all duration-500", progressColor(r.pct)),
											style: { width: `${Math.min(r.pct, 100)}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: cn("text-xs font-semibold", textColor(r.pct)),
											children: [formatPercent(r.pct), " complete"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: r.remaining >= 0 ? `${formatMoney(r.remaining)} to go` : `${formatMoney(Math.abs(r.remaining))} over target!`
										})]
									}),
									r.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mb-3",
										children: r.note
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "gap-1",
												onClick: () => handleAddMoney(r.id, 100),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" }), " Add $100"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "gap-1",
												onClick: () => handleWithdrawMoney(r.id, 100),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-3.5 w-3.5" }), " Withdraw $100"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "gap-1",
												onClick: () => {
													setContribGoal(r);
													setContribAmount(100);
													setContribType("deposit");
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCoins, { className: "h-3.5 w-3.5" }), " Custom"]
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-8 w-8 rounded-xl hover:bg-background/60",
									onClick: () => openEdit(r),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "h-8 w-8 rounded-xl text-expense hover:bg-expense/10",
									onClick: () => {
										deleteSavingsGoal(r.id);
										toast.success("Savings goal removed");
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})]
							})]
						})
					})
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavingsDrawer, {
				open: drawer,
				onOpenChange: setDrawer,
				editing
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!contribGoal,
				onOpenChange: (o) => !o && setContribGoal(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: isMobile ? "bottom" : "right",
					className: "flex w-full flex-col gap-0 overflow-y-auto sm:max-w-sm h-[70vh] sm:h-full rounded-t-2xl sm:rounded-t-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
							className: "pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: contribType === "deposit" ? "Add money" : "Withdraw money" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: contribType === "deposit" ? `Add to "${contribGoal?.title ?? ""}"` : `Withdraw from "${contribGoal?.title ?? ""}"` })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 px-1 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-4xl font-bold tracking-tight text-foreground",
										children: formatMoney(contribAmount)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 5e3,
									step: 50,
									value: [contribAmount],
									onValueChange: ([v]) => setContribAmount(v),
									className: "w-full"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(0) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(2500) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(5e3) })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2 justify-center",
									children: [
										50,
										100,
										200,
										500,
										1e3
									].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: contribAmount === a ? "default" : "outline",
										size: "sm",
										onClick: () => setContribAmount(a),
										children: formatMoney(a)
									}, a))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetFooter, {
							className: "mt-4",
							children: [contribType === "deposit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: async () => {
									if (!contribGoal) return;
									await handleAddMoney(contribGoal.id, contribAmount);
									setContribGoal(null);
								},
								children: ["Add ", formatMoney(contribAmount)]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: async () => {
									if (!contribGoal) return;
									await handleWithdrawMoney(contribGoal.id, contribAmount);
									setContribGoal(null);
								},
								children: ["Withdraw ", formatMoney(contribAmount)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setContribGoal(null),
								children: "Cancel"
							})]
						})
					]
				})
			})
		]
	});
}
function formatPercent(value) {
	return `${Math.round(value)}%`;
}
//#endregion
export { Savings as component };
