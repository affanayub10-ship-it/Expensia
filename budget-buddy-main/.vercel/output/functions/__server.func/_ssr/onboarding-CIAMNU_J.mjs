import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { A as Plus, Nt as ArrowRight, Pt as ArrowLeft, S as ShieldCheck, f as Trash2, pt as CircleCheck, r as Wallet, u as TrendingUp, v as Sparkles } from "../_libs/lucide-react.mjs";
import { n as INCOME_CATEGORIES } from "./mock-data-Cl4Xf6-R.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./AuthContext-B_dYwLk5.mjs";
import { c as getNextDate, f as useApp } from "./AppContext-BtlkEzV5.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-CIAMNU_J.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RECURRENCES = [
	"One-time",
	"Daily",
	"Weekly",
	"Monthly",
	"Yearly"
];
var FEATURES = [
	{
		icon: TrendingUp,
		text: "Real-time expense tracking"
	},
	{
		icon: ShieldCheck,
		text: "Secure & private by default"
	},
	{
		icon: Sparkles,
		text: "Smart budgeting insights"
	}
];
function OnboardingPage() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading: authLoading, completeOnboarding } = useAuth();
	const { addIncome, settings } = useApp();
	const [step, setStep] = (0, import_react.useState)("welcome");
	const [incomes, setIncomes] = (0, import_react.useState)([]);
	const [currentIncome, setCurrentIncome] = (0, import_react.useState)({
		id: Math.random().toString(36).slice(2, 10),
		source: "",
		amount: 0,
		category: "Salary",
		recurrence: "Monthly",
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	});
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !isAuthenticated) navigate({ to: "/login" });
	}, [
		isAuthenticated,
		authLoading,
		navigate
	]);
	const handleAddIncome = () => {
		if (!currentIncome.source.trim()) {
			toast.error("Please enter an income source");
			return;
		}
		if (!currentIncome.amount || currentIncome.amount <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}
		setIncomes([...incomes, {
			...currentIncome,
			id: Math.random().toString(36).slice(2, 10)
		}]);
		setCurrentIncome({
			id: Math.random().toString(36).slice(2, 10),
			source: "",
			amount: 0,
			category: "Salary",
			recurrence: "Monthly",
			date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
		});
		toast.success("Income added");
	};
	const handleRemoveIncome = (id) => {
		setIncomes(incomes.filter((i) => i.id !== id));
	};
	const handleCompleteOnboarding = async () => {
		if (incomes.length === 0) {
			toast.error("Please add at least one income source");
			return;
		}
		setIsSubmitting(true);
		try {
			for (const income of incomes) {
				const nextDate = income.recurrence === "One-time" ? void 0 : getNextDate(income.date, income.recurrence);
				await addIncome({
					id: "",
					source: income.source,
					amount: income.amount,
					date: income.date,
					category: income.category,
					recurrence: income.recurrence,
					nextDate
				});
			}
			const result = await completeOnboarding();
			if (!result.success) throw new Error(result.error || "Failed to mark onboarding complete");
			setStep("complete");
			setTimeout(() => {
				navigate({ to: "/" });
			}, 2e3);
		} catch (error) {
			console.error("Failed to save income:", error);
			toast.error("Failed to save income. Please try again.");
			setIsSubmitting(false);
		}
	};
	const handleSkip = async () => {
		try {
			const result = await completeOnboarding();
			if (!result.success) {
				toast.error(result.error || "Failed to skip onboarding");
				return;
			}
			navigate({ to: "/" });
		} catch (error) {
			console.error("Failed to skip onboarding:", error);
			toast.error("Failed to skip onboarding. Please try again.");
		}
	};
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading..."
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5",
		children: [
			step === "welcome" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-screen flex-col items-center justify-center px-4 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-2xl space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-6 flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-7 w-7" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-4xl font-bold tracking-tight text-foreground",
									children: "Welcome to Expensia"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-lg text-muted-foreground",
									children: "Let's get your finances organized. Start by adding your income sources."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: FEATURES.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card p-4 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(feature.icon, { className: "mx-auto h-6 w-6 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm font-medium text-foreground",
									children: feature.text
								})]
							}, feature.text))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								onClick: () => setStep("income"),
								className: "gap-2",
								children: ["Get Started ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								onClick: handleSkip,
								children: "Skip for now"
							})]
						})
					]
				})
			}),
			step === "income" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-screen flex-col items-center justify-center px-4 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-2xl space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setStep("welcome"),
								className: "mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold tracking-tight text-foreground",
								children: "Add Your Income Sources"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-muted-foreground",
								children: "Add one or more income sources. You can always update these later."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "source",
											className: "text-xs font-medium",
											children: "Income Source"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "source",
											value: currentIncome.source,
											onChange: (e) => setCurrentIncome({
												...currentIncome,
												source: e.target.value
											}),
											placeholder: "e.g. Monthly salary"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "amount",
											className: "text-xs font-medium",
											children: "Amount"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "amount",
											type: "number",
											inputMode: "decimal",
											step: "0.01",
											value: currentIncome.amount || "",
											onChange: (e) => setCurrentIncome({
												...currentIncome,
												amount: parseFloat(e.target.value) || 0
											}),
											placeholder: "0.00"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "category",
											className: "text-xs font-medium",
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: currentIncome.category,
											onValueChange: (v) => setCurrentIncome({
												...currentIncome,
												category: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "category",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: INCOME_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: c.name,
												children: c.name
											}, c.id)) })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "recurrence",
											className: "text-xs font-medium",
											children: "Frequency"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: currentIncome.recurrence,
											onValueChange: (v) => setCurrentIncome({
												...currentIncome,
												recurrence: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "recurrence",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: RECURRENCES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: r,
												children: r
											}, r)) })]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-4 sm:grid-cols-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "date",
											className: "text-xs font-medium",
											children: "Start Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "date",
											type: "date",
											value: currentIncome.date,
											onChange: (e) => setCurrentIncome({
												...currentIncome,
												date: e.target.value
											})
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleAddIncome,
									variant: "outline",
									className: "w-full gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add Income Source"]
								})
							]
						}),
						incomes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold text-foreground",
								children: [
									"Added Income Sources (",
									incomes.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: incomes.map((income) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium text-foreground",
											children: income.source
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												income.amount.toFixed(2),
												" · ",
												income.category,
												" · ",
												income.recurrence
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleRemoveIncome(income.id),
										className: "ml-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								}, income.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: handleSkip,
								children: "Skip for now"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleCompleteOnboarding,
								disabled: incomes.length === 0 || isSubmitting,
								className: "gap-2",
								children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" }), "Saving..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Complete Setup ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
							})]
						})
					]
				})
			}),
			step === "complete" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-screen flex-col items-center justify-center px-4 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md text-center space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-full bg-income/10 p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-12 w-12 text-income" })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-bold tracking-tight text-foreground",
							children: "All Set!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-muted-foreground",
							children: "Your income sources have been saved. Redirecting to dashboard..."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-12 mx-auto bg-gradient-to-r from-primary to-income rounded-full animate-pulse" })
					]
				})
			})
		]
	});
}
//#endregion
export { OnboardingPage as component };
