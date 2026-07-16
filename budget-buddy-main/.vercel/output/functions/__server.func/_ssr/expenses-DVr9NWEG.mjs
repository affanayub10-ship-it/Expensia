import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { n as CardContent, o as Badge, t as Card } from "./card-C5Nmk_bj.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BcaWptOW.mjs";
import { A as Plus, Ct as ChartColumn, E as Repeat, Mt as ArrowUpDown, N as Pencil, P as Paperclip, Y as FileText, bt as ChevronDown, c as Trophy, d as TrendingDown, f as Trash2, n as X, ot as CloudUpload, r as Wallet, w as Search, xt as Check, yt as ChevronRight, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as EXPENSE_CATEGORIES } from "./mock-data-Cl4Xf6-R.mjs";
import { a as StatusBadge, n as CategoryPill, r as PageHeader, t as CategoryIcon } from "./shared-Cu4KJl81.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as getExpensesSummary, f as useApp, n as formatDate, o as getExpensesWithFilters, r as formatMoney } from "./AppContext-BtlkEzV5.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as Slider } from "./slider-CuWUdOZr.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-g_nJl_ho.mjs";
import { a as SheetHeader, c as useIsMobile, i as SheetFooter, n as SheetContent, o as SheetTitle, r as SheetDescription, s as Textarea, t as Sheet } from "./use-mobile-DgnvvD2q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-DVr9NWEG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RECURRENCES = [
	"None",
	"Daily",
	"Weekly",
	"Monthly",
	"Quarterly",
	"Yearly"
];
var STATUSES = [
	"Paid",
	"Pending",
	"Cancelled"
];
var SLIDER_MIN = 0;
var SLIDER_MAX = 1e4;
var SLIDER_STEP = 10;
function emptyExpense(category) {
	return {
		id: "",
		title: "",
		amount: 0,
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		category,
		tags: [],
		status: "Paid",
		recurrence: "None"
	};
}
function ExpenseDrawer({ open, onOpenChange, editing }) {
	const { addExpense, updateExpense, settings } = useApp();
	const isMobile = useIsMobile();
	const fileInputRef = (0, import_react.useRef)(null);
	const [receiptPreview, setReceiptPreview] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyExpense(settings.defaultCategory));
	const [showAdvanced, setShowAdvanced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (open) {
			const base = editing ?? emptyExpense(settings.defaultCategory);
			setForm(base);
			if (editing?.receipt) {
				const isDataUrl = editing.receipt.startsWith("data:");
				setReceiptPreview(isDataUrl ? {
					name: "receipt",
					url: editing.receipt,
					type: editing.receipt.split(";")[0].replace("data:", "")
				} : null);
			} else setReceiptPreview(null);
		}
	}, [
		open,
		editing,
		settings
	]);
	const handleReceiptChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 10 * 1024 * 1024) {
			toast.error("File must be under 10 MB");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = reader.result;
			set("receipt", dataUrl);
			setReceiptPreview({
				name: file.name,
				url: dataUrl,
				type: file.type
			});
			toast.success(`Attached: ${file.name}`);
		};
		reader.readAsDataURL(file);
	};
	const removeReceipt = () => {
		set("receipt", void 0);
		setReceiptPreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const submit = async () => {
		if (!form.title.trim()) return toast.error("Title is required");
		if (!form.amount || form.amount <= 0) return toast.error("Enter a valid amount");
		try {
			if (editing) {
				await updateExpense(form);
				toast.success("Expense updated");
			} else {
				await addExpense(form);
				toast.success("Expense added");
			}
			onOpenChange(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save expense");
		}
	};
	const isDirty = editing ? JSON.stringify(form) !== JSON.stringify(editing) : form.title.trim() !== "" || form.amount > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: isMobile ? "bottom" : "right",
			className: "flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg h-[85vh] sm:h-full rounded-t-2xl sm:rounded-t-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
					className: "pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: editing ? "Edit expense" : "Add expense" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Record a new transaction and keep your budget on track." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 px-1 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.title,
								onChange: (e) => set("title", e.target.value),
								placeholder: "e.g. Grocery run"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Category",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2 sm:grid-cols-4",
								children: EXPENSE_CATEGORIES.map((c) => {
									const Icon = c.icon;
									const isSelected = form.category === c.name;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => set("category", c.name),
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
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Amount (USD)",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-between",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg font-bold text-foreground",
											children: formatMoney(form.amount)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										min: SLIDER_MIN,
										max: SLIDER_MAX,
										step: SLIDER_STEP,
										value: [form.amount],
										onValueChange: ([v]) => set("amount", v),
										className: "w-full"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(SLIDER_MIN) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(SLIDER_MAX / 2) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMoney(SLIDER_MAX) })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										inputMode: "decimal",
										step: "0.01",
										value: form.amount || "",
										onChange: (e) => set("amount", parseFloat(e.target.value) || 0),
										placeholder: "Or enter exact amount",
										className: "mt-2"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShowAdvanced(!showAdvanced),
							className: "flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Advanced Options" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}` })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `grid gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showAdvanced ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Date",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: form.date,
											onChange: (e) => set("date", e.target.value)
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Location",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: form.location ?? "",
											onChange: (e) => set("location", e.target.value),
											placeholder: "Optional"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Status",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.status,
											onValueChange: (v) => set("status", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: s,
												children: s
											}, s)) })]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Recurrence",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.recurrence,
											onValueChange: (v) => set("recurrence", v),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: RECURRENCES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: r,
												children: r
											}, r)) })]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Notes",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: form.notes ?? "",
										onChange: (e) => set("notes", e.target.value),
										placeholder: "Optional notes",
										rows: 2
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									label: "Receipt",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: "Optional"
									}), receiptPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-xl border border-border bg-muted/30 p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 min-w-0",
												children: [receiptPreview.type.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: receiptPreview.url,
													alt: "Receipt preview",
													className: "h-12 w-12 rounded-lg object-cover shrink-0 border border-border"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted border border-border",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6 text-muted-foreground" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate text-xs text-muted-foreground",
													children: receiptPreview.name
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: removeReceipt,
												className: "shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
												"aria-label": "Remove receipt",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
											})]
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-6 w-6" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Click or drag to upload" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px]",
												children: "JPEG, PNG, PDF · max 10 MB"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: fileInputRef,
												type: "file",
												accept: "image/png,image/jpeg,image/webp,application/pdf",
												className: "hidden",
												onChange: handleReceiptChange
											})
										]
									})]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetFooter, {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: submit,
						disabled: editing ? !isDirty : false,
						children: editing ? "Save changes" : "Add expense"
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
function Field({ label, children, required = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			className: "text-xs font-medium text-muted-foreground",
			children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-expense ml-1",
				children: "*"
			})]
		}), children]
	});
}
var GROUP_ORDER = [
	"Today",
	"Yesterday",
	"This Week",
	"Older"
];
function getDateRange(chip) {
	const today = /* @__PURE__ */ new Date();
	const y = today.getFullYear();
	const m = today.getMonth();
	const d = today.getDate();
	if (chip === "today") {
		const s = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
		return {
			dateFrom: s,
			dateTo: s
		};
	}
	if (chip === "thisWeek") {
		const dayOfWeek = today.getDay();
		const monOff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		const mon = new Date(today);
		mon.setDate(d + monOff);
		return { dateFrom: mon.toISOString().slice(0, 10) };
	}
	if (chip === "thisMonth") return { dateFrom: `${y}-${String(m + 1).padStart(2, "0")}-01` };
	return {};
}
function getGroupKey(dateStr) {
	new Date(dateStr);
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const input = new Date(dateStr);
	input.setHours(0, 0, 0, 0);
	if (input.getTime() === today.getTime()) return "Today";
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	if (input.getTime() === yesterday.getTime()) return "Yesterday";
	const weekAgo = new Date(today);
	weekAgo.setDate(weekAgo.getDate() - 7);
	if (input >= weekAgo) return "This Week";
	return "Older";
}
var CHIPS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "today",
		label: "Today"
	},
	{
		id: "thisWeek",
		label: "This Week"
	},
	{
		id: "thisMonth",
		label: "This Month"
	},
	{
		id: "Food",
		label: "Food"
	},
	{
		id: "Shopping",
		label: "Shopping"
	},
	{
		id: "Bills",
		label: "Bills"
	},
	{
		id: "Entertainment",
		label: "Entertainment"
	},
	{
		id: "Travel",
		label: "Travel"
	},
	{
		id: "highAmount",
		label: "High Amount"
	}
];
function Expenses() {
	const { deleteExpense, settings } = useApp();
	const dateFmt = settings.dateFormat;
	const [query, setQuery] = (0, import_react.useState)("");
	const [debouncedQuery, setDebouncedQuery] = (0, import_react.useState)("");
	const [dateChip, setDateChip] = (0, import_react.useState)("all");
	const [catChip, setCatChip] = (0, import_react.useState)("all");
	const [sortKey, setSortKey] = (0, import_react.useState)("date");
	const [sortOrder, setSortOrder] = (0, import_react.useState)("desc");
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const [customDateFrom, setCustomDateFrom] = (0, import_react.useState)("");
	const [customDateTo, setCustomDateTo] = (0, import_react.useState)("");
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [page, setPage] = (0, import_react.useState)(1);
	const [hasMore, setHasMore] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [loadingMore, setLoadingMore] = (0, import_react.useState)(false);
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [refreshKey, setRefreshKey] = (0, import_react.useState)(0);
	const [drawer, setDrawer] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [toDelete, setToDelete] = (0, import_react.useState)(null);
	const [expandedSections, setExpandedSections] = (0, import_react.useState)(/* @__PURE__ */ new Set(["Today"]));
	const observerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setDebouncedQuery(query), 300);
		return () => clearTimeout(t);
	}, [query]);
	const effectiveFilters = (0, import_react.useMemo)(() => {
		const dr = getDateRange(dateChip);
		const isCustom = dateChip === "all" && (customDateFrom || customDateTo);
		return {
			search: debouncedQuery || void 0,
			category: catChip !== "all" ? catChip : void 0,
			dateFrom: dr.dateFrom || (isCustom ? customDateFrom : void 0),
			dateTo: dr.dateTo || (isCustom ? customDateTo : void 0),
			sortBy: sortKey,
			sortOrder
		};
	}, [
		debouncedQuery,
		catChip,
		dateChip,
		customDateFrom,
		customDateTo,
		sortKey,
		sortOrder
	]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getExpensesSummary(effectiveFilters).then((s) => {
			if (!cancelled) setSummary(s);
		}).catch(console.error);
		return () => {
			cancelled = true;
		};
	}, [effectiveFilters, refreshKey]);
	const fetchFirstPage = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const r = await getExpensesWithFilters({
				...effectiveFilters,
				page: 1,
				limit: 20
			});
			setExpenses(r.data);
			setHasMore(r.hasMore);
			setPage(1);
		} catch {
			toast.error("Failed to load expenses");
		} finally {
			setLoading(false);
		}
	}, [effectiveFilters]);
	(0, import_react.useEffect)(() => {
		fetchFirstPage();
	}, [fetchFirstPage, refreshKey]);
	const loadMore = (0, import_react.useCallback)(async () => {
		if (loadingMore || !hasMore) return;
		setLoadingMore(true);
		const next = page + 1;
		try {
			const r = await getExpensesWithFilters({
				...effectiveFilters,
				page: next,
				limit: 20
			});
			setExpenses((prev) => [...prev, ...r.data]);
			setHasMore(r.hasMore);
			setPage(next);
		} catch {
			toast.error("Failed to load more");
		} finally {
			setLoadingMore(false);
		}
	}, [
		effectiveFilters,
		page,
		hasMore,
		loadingMore
	]);
	const sentinelRef = (0, import_react.useCallback)((node) => {
		if (observerRef.current) observerRef.current.disconnect();
		if (!node) return;
		observerRef.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore && !loadingMore) loadMore();
		}, { rootMargin: "200px" });
		observerRef.current.observe(node);
	}, [
		hasMore,
		loadingMore,
		loadMore
	]);
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const k of GROUP_ORDER) map.set(k, []);
		for (const e of expenses) map.get(getGroupKey(e.date))?.push(e);
		return GROUP_ORDER.map((k) => ({
			key: k,
			items: map.get(k) || []
		})).filter((g) => g.items.length > 0);
	}, [expenses]);
	const toggleSection = (key) => {
		setExpandedSections((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
	};
	const handleChip = (id) => {
		if (id === "all") {
			setDateChip("all");
			setCatChip("all");
			setSortKey("date");
			setSortOrder("desc");
		} else if (id === "today" || id === "thisWeek" || id === "thisMonth") setDateChip((p) => p === id ? "all" : id);
		else if (id === "highAmount") if (sortKey === "amount" && sortOrder === "desc") {
			setSortKey("date");
			setSortOrder("desc");
		} else {
			setSortKey("amount");
			setSortOrder("desc");
		}
		else setCatChip((p) => p === id ? "all" : id);
	};
	const handleDelete = () => {
		if (!toDelete) return;
		deleteExpense(toDelete.id);
		setExpenses((prev) => prev.filter((e) => e.id !== toDelete.id));
		setToDelete(null);
		toast.success("Expense deleted");
	};
	const afterSave = () => {
		setDrawer(false);
		setRefreshKey((k) => k + 1);
	};
	const isChipActive = (id) => {
		if (id === "all") return dateChip === "all" && catChip === "all" && !(sortKey === "amount" && sortOrder === "desc");
		if (id === "today" || id === "thisWeek" || id === "thisMonth") return dateChip === id;
		if (id === "highAmount") return sortKey === "amount" && sortOrder === "desc";
		return catChip === id;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Expenses",
			description: summary ? `${summary.totalCount} transactions · ${formatMoney(summary.totalAmount)} total` : "Loading...",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => {
					setEditing(null);
					setDrawer(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add expense"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-4 shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-3 sm:p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryTile, {
							label: "Total",
							value: summary ? formatMoney(summary.totalAmount) : "...",
							icon: Wallet,
							cls: "text-expense bg-expense/10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryTile, {
							label: "Transactions",
							value: summary ? String(summary.totalCount) : "...",
							icon: ChartColumn,
							cls: "text-primary bg-primary/10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryTile, {
							label: "Highest",
							value: summary ? formatMoney(summary.maxAmount) : "...",
							icon: Trophy,
							cls: "text-warning bg-warning/15"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryTile, {
							label: "Average",
							value: summary ? formatMoney(summary.avgAmount) : "...",
							icon: TrendingDown,
							cls: "text-income bg-income/10"
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex flex-wrap gap-1.5 sm:gap-2",
			children: CHIPS.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => handleChip(chip.id),
				className: cn("rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 border select-none active:scale-95", isChipActive(chip.id) ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105" : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-primary/40"),
				children: chip.label
			}, chip.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-4 shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-3 p-3 sm:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search by title...",
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setShowFilters(!showFilters),
						className: "flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: showFilters ? "Hide Filters" : "Show Filters" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("h-4 w-4 transition-transform duration-200", showFilters && "rotate-180") })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out sm:flex-row sm:flex-wrap sm:items-center", showFilters ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: customDateFrom,
										onChange: (e) => setCustomDateFrom(e.target.value),
										className: "w-full sm:w-36"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground text-sm",
										children: "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: customDateTo,
										onChange: (e) => setCustomDateTo(e.target.value),
										className: "w-full sm:w-36"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: sortKey,
								onValueChange: (v) => setSortKey(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full sm:w-36",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "date",
									children: "Sort: Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "amount",
									children: "Sort: Amount"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: () => setSortOrder((o) => o === "desc" ? "asc" : "desc"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: sortOrder === "desc" ? "Newest First" : "Oldest First"
							})
						]
					})
				]
			})
		}),
		loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
		}),
		!loading && expenses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-6 w-6 text-muted-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground mb-1",
							children: "No expenses found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mb-3",
							children: "Try adjusting your filters or add a new expense"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => {
								setEditing(null);
								setDrawer(true);
							},
							size: "sm",
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add expense"]
						})
					]
				})
			})
		}),
		!loading && groups.map(({ key, items }) => {
			const isOpen = expandedSections.has(key);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => toggleSection(key),
					className: "flex w-full items-center justify-between rounded-t-xl bg-muted/50 px-4 py-3 text-left transition-colors hover:bg-muted/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-foreground",
							children: key
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "text-[11px] font-medium",
							children: items.length
						})]
					}), isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground transition-transform duration-200" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground transition-transform duration-200" })]
				}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft rounded-t-none rounded-b-xl border-t-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "px-0 sm:px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden sm:block overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Title" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "hidden sm:table-cell",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Actions"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: items.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											e.title,
											e.recurrence !== "None" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												className: "gap-1 text-[10px]",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "h-3 w-3" }),
													" ",
													e.recurrence
												]
											}),
											e.receipt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3.5 w-3.5 text-muted-foreground" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryPill, { name: e.category }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "hidden whitespace-nowrap text-muted-foreground sm:table-cell",
									children: formatDate(e.date, dateFmt)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: e.status }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "whitespace-nowrap text-right font-semibold text-expense",
									children: ["-", formatMoney(e.amount)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-9 w-9",
											onClick: () => {
												setEditing(e);
												setDrawer(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-9 w-9 text-expense",
											onClick: () => setToDelete(e),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								})
							] }, e.id)) })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border px-4 sm:hidden",
							children: items.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between py-3.5 first:pt-0 last:pb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, { name: e.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold text-foreground",
											children: e.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap items-center gap-1.5 mt-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: formatDate(e.date, dateFmt)
											})
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold text-expense",
										children: ["-", formatMoney(e.amount)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-1 border-l border-border pl-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8",
											onClick: () => {
												setEditing(e);
												setDrawer(true);
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-8 w-8 text-expense",
											onClick: () => setToDelete(e),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})]
								})]
							}, e.id))
						})]
					})
				})]
			}, key);
		}),
		hasMore && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: sentinelRef,
			className: "flex items-center justify-center py-6",
			children: loadingMore ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading more..."]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: loadMore,
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Load more"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseDrawer, {
			open: drawer,
			onOpenChange: (o) => {
				if (!o) afterSave();
				else setDrawer(true);
			},
			editing
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!toDelete,
			onOpenChange: (o) => !o && setToDelete(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Delete this expense?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"\"",
				toDelete?.title,
				"\" will be moved to trash."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				className: "bg-expense text-expense-foreground hover:bg-expense/90",
				onClick: handleDelete,
				children: "Delete"
			})] })] })
		})
	] });
}
function SummaryTile({ label, value, icon: Icon, cls }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 sm:gap-3 rounded-xl bg-muted/30 p-2.5 sm:p-3 transition-colors hover:bg-muted/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl shrink-0", cls),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 sm:h-5 sm:w-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] sm:text-[11px] font-medium text-muted-foreground truncate",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs sm:text-sm font-bold text-foreground truncate",
				children: value
			})]
		})]
	});
}
//#endregion
export { Expenses as component };
