import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BHGcVbTW.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./AuthContext-B_dYwLk5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppContext-BtlkEzV5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var _cachedUserId = null;
var _userIdPromise = null;
async function getCurrentUserId() {
	if (_cachedUserId) return _cachedUserId;
	if (_userIdPromise) return _userIdPromise;
	_userIdPromise = (async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (session?.user?.id) {
			_cachedUserId = session.user.id;
			return _cachedUserId;
		}
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error("Not authenticated");
		_cachedUserId = user.id;
		return _cachedUserId;
	})();
	return _userIdPromise;
}
async function getExpenses() {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("expenses").select("id, title, amount, date, category, location, tags, status, recurrence, receipt, deleted").eq("user_id", userId).order("date", { ascending: false });
	if (error) throw error;
	return (data || []).map((row) => ({
		id: row.id,
		title: row.title,
		amount: Number(row.amount),
		date: row.date,
		category: row.category,
		location: row.location || void 0,
		tags: row.tags || [],
		status: row.status,
		recurrence: row.recurrence,
		receipt: row.receipt || void 0,
		deleted: row.deleted
	}));
}
async function getExpensesWithFilters(filters) {
	const userId = await getCurrentUserId();
	const { page = 1, limit = 20, category, dateFrom, dateTo, search, sortBy = "date", sortOrder = "desc" } = filters;
	const fetchLimit = limit + 1;
	const from = (page - 1) * limit;
	const to = from + fetchLimit - 1;
	let query = supabase.from("expenses").select("id, title, amount, date, category, location, tags, status, recurrence, receipt, deleted").eq("user_id", userId).eq("deleted", false);
	if (category && category !== "all") query = query.eq("category", category);
	if (dateFrom) query = query.gte("date", dateFrom);
	if (dateTo) query = query.lte("date", dateTo);
	if (search) {
		const s = search.replace(/'/g, "''");
		query = query.or(`title.ilike.%${s}%,category.ilike.%${s}%,notes.ilike.%${s}%`);
	}
	query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(from, to);
	const { data, error } = await query;
	if (error) throw error;
	const raw = data || [];
	const hasMore = raw.length > limit;
	if (hasMore) raw.pop();
	return {
		data: raw.map((row) => ({
			id: row.id,
			title: row.title,
			amount: Number(row.amount),
			date: row.date,
			category: row.category,
			location: row.location || void 0,
			tags: row.tags || [],
			status: row.status,
			recurrence: row.recurrence,
			receipt: row.receipt || void 0,
			deleted: row.deleted
		})),
		hasMore
	};
}
async function addExpense(expense) {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("expenses").insert({
		user_id: userId,
		title: expense.title,
		amount: expense.amount,
		date: expense.date,
		category: expense.category,
		location: expense.location ?? null,
		tags: expense.tags || [],
		status: expense.status,
		recurrence: expense.recurrence,
		receipt: expense.receipt ?? null,
		deleted: expense.deleted || false
	}).select("id, title, amount, date, category, location, tags, status, recurrence, receipt, deleted").single();
	if (error) throw error;
	return {
		id: data.id,
		title: data.title,
		amount: Number(data.amount),
		date: data.date,
		category: data.category,
		location: data.location || void 0,
		tags: data.tags || [],
		status: data.status,
		recurrence: data.recurrence,
		receipt: data.receipt || void 0,
		deleted: data.deleted
	};
}
async function updateExpense(expense) {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("expenses").update({
		title: expense.title,
		amount: expense.amount,
		date: expense.date,
		category: expense.category,
		location: expense.location ?? null,
		tags: expense.tags || [],
		status: expense.status,
		recurrence: expense.recurrence,
		receipt: expense.receipt ?? null,
		deleted: expense.deleted || false
	}).eq("id", expense.id).eq("user_id", userId).select("id, title, amount, date, category, location, tags, status, recurrence, receipt, deleted").single();
	if (error) throw error;
	return {
		id: data.id,
		title: data.title,
		amount: Number(data.amount),
		date: data.date,
		category: data.category,
		location: data.location || void 0,
		tags: data.tags || [],
		status: data.status,
		recurrence: data.recurrence,
		receipt: data.receipt || void 0,
		deleted: data.deleted
	};
}
async function deleteExpense(id) {
	const userId = await getCurrentUserId();
	const { error } = await supabase.from("expenses").update({ deleted: true }).eq("id", id).eq("user_id", userId);
	if (error) throw error;
}
async function getIncome() {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("income").select("id, source, amount, date, category, notes, recurrence, next_date").eq("user_id", userId).order("date", { ascending: false });
	if (error) throw error;
	return (data || []).map((row) => ({
		id: row.id,
		source: row.source,
		amount: Number(row.amount),
		date: row.date,
		category: row.category,
		notes: row.notes || void 0,
		recurrence: row.recurrence ?? "One-time",
		nextDate: row.next_date ?? void 0
	}));
}
async function addIncome(income) {
	const payload = {
		user_id: await getCurrentUserId(),
		source: income.source,
		amount: income.amount,
		date: income.date,
		category: income.category,
		notes: income.notes ?? null,
		recurrence: income.recurrence ?? "One-time",
		next_date: income.nextDate ?? null
	};
	const { data, error } = await supabase.from("income").insert(payload).select("id, source, amount, date, category, notes, recurrence, next_date").single();
	if (error) throw error;
	return {
		id: data.id,
		source: data.source,
		amount: Number(data.amount),
		date: data.date,
		category: data.category,
		notes: data.notes || void 0,
		recurrence: data.recurrence ?? "One-time",
		nextDate: data.next_date ?? void 0
	};
}
async function updateIncome(income) {
	const userId = await getCurrentUserId();
	const payload = {
		source: income.source,
		amount: income.amount,
		date: income.date,
		category: income.category,
		notes: income.notes ?? null,
		recurrence: income.recurrence ?? "One-time",
		next_date: income.nextDate ?? null
	};
	const { data, error } = await supabase.from("income").update(payload).eq("id", income.id).eq("user_id", userId).select("id, source, amount, date, category, notes, recurrence, next_date").single();
	if (error) {
		if (error.code === "42703") {
			const { data: d2, error: e2 } = await supabase.from("income").update({
				source: income.source,
				amount: income.amount,
				date: income.date,
				category: income.category,
				notes: income.notes ?? null
			}).eq("id", income.id).eq("user_id", userId).select("id, source, amount, date, category, notes, recurrence, next_date").single();
			if (e2) throw e2;
			return {
				id: d2.id,
				source: d2.source,
				amount: Number(d2.amount),
				date: d2.date,
				category: d2.category,
				notes: d2.notes || void 0,
				recurrence: income.recurrence ?? "One-time",
				nextDate: income.nextDate
			};
		}
		throw error;
	}
	return {
		id: data.id,
		source: data.source,
		amount: Number(data.amount),
		date: data.date,
		category: data.category,
		notes: data.notes || void 0,
		recurrence: data.recurrence ?? "One-time",
		nextDate: data.next_date ?? void 0
	};
}
async function deleteIncome(id) {
	const userId = await getCurrentUserId();
	const { error } = await supabase.from("income").delete().eq("id", id).eq("user_id", userId);
	if (error) throw error;
}
async function getIncomeWithFilters(filters) {
	const userId = await getCurrentUserId();
	const { page = 1, limit = 20 } = filters;
	const fetchLimit = limit + 1;
	const from = (page - 1) * limit;
	const to = from + fetchLimit - 1;
	let query = supabase.from("income").select("id, source, amount, date, category, notes, recurrence, next_date").eq("user_id", userId).order(filters.sortBy === "amount" || filters.sortBy === "source" || filters.sortBy === "category" ? filters.sortBy : "date", { ascending: filters.sortOrder === "asc" });
	if (filters.category && filters.category !== "all") query = query.eq("category", filters.category);
	if (filters.search) {
		const s = filters.search.replace(/'/g, "''");
		query = query.or(`source.ilike.%${s}%,category.ilike.%${s}%,notes.ilike.%${s}%`);
	}
	const { data, error } = await query.range(from, to);
	if (error) throw error;
	const raw = data || [];
	const hasMore = raw.length > limit;
	if (hasMore) raw.pop();
	return {
		data: raw.map((row) => ({
			id: row.id,
			source: row.source,
			amount: Number(row.amount),
			date: row.date,
			category: row.category,
			notes: row.notes || void 0,
			recurrence: row.recurrence ?? "One-time",
			nextDate: row.next_date ?? void 0
		})),
		hasMore
	};
}
async function getBudgets() {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("budgets").select("id, category, limit_amount").eq("user_id", userId);
	if (error) throw error;
	return (data || []).map((row) => ({
		id: row.id,
		category: row.category,
		limit: Number(row.limit_amount)
	}));
}
async function saveBudget(budget) {
	const userId = await getCurrentUserId();
	const { data: existing } = await supabase.from("budgets").select("id").eq("user_id", userId).eq("category", budget.category).single();
	if (existing) {
		const { data, error } = await supabase.from("budgets").update({ limit_amount: budget.limit }).eq("id", existing.id).eq("user_id", userId).select("id, category, limit_amount").single();
		if (error) throw error;
		return {
			id: data.id,
			category: data.category,
			limit: Number(data.limit_amount)
		};
	}
	const { data, error } = await supabase.from("budgets").insert({
		user_id: userId,
		category: budget.category,
		limit_amount: budget.limit
	}).select("id, category, limit_amount").single();
	if (error) throw error;
	return {
		id: data.id,
		category: data.category,
		limit: Number(data.limit_amount)
	};
}
async function deleteBudget(id) {
	const userId = await getCurrentUserId();
	const { error } = await supabase.from("budgets").delete().eq("id", id).eq("user_id", userId);
	if (error) throw error;
}
function formatTimeAgo(date) {
	const s = Math.floor((Date.now() - date.getTime()) / 1e3);
	if (s < 60) return "just now";
	if (s < 3600) return `${Math.floor(s / 60)}m ago`;
	if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
	return `${Math.floor(s / 86400)}d ago`;
}
async function getNotifications() {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("notifications").select("id, type, title, message, created_at, read").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
	if (error) throw error;
	return (data || []).map((row) => ({
		id: row.id,
		type: row.type,
		title: row.title,
		message: row.message,
		time: formatTimeAgo(new Date(row.created_at)),
		read: row.read
	}));
}
async function markNotificationsRead() {
	const userId = await getCurrentUserId();
	const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
	if (error) throw error;
}
async function getSettings() {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("settings").select("timezone, date_format, language, default_category").eq("user_id", userId).single();
	if (error) return createDefaultSettings(userId);
	const { data: profile } = await supabase.from("profiles").select("name, email, avatar").eq("id", userId).single();
	return {
		timezone: data.timezone,
		dateFormat: data.date_format,
		language: data.language,
		defaultCategory: data.default_category,
		name: profile?.name || "User",
		email: profile?.email || "",
		avatar: profile?.avatar || void 0
	};
}
async function createDefaultSettings(userId) {
	const { data: profile } = await supabase.from("profiles").select("name, email, avatar").eq("id", userId).single();
	const defaults = {
		timezone: "America/Los_Angeles",
		dateFormat: "MMM d, yyyy",
		language: "English",
		defaultCategory: "Food",
		name: profile?.name || "User",
		email: profile?.email || "",
		avatar: profile?.avatar || void 0
	};
	await supabase.from("settings").insert({
		user_id: userId,
		timezone: defaults.timezone,
		date_format: defaults.dateFormat,
		language: defaults.language,
		default_category: defaults.defaultCategory
	});
	return defaults;
}
async function updateSettings(patch) {
	const userId = await getCurrentUserId();
	const upd = {};
	if (patch.timezone) upd.timezone = patch.timezone;
	if (patch.dateFormat) upd.date_format = patch.dateFormat;
	if (patch.language) upd.language = patch.language;
	if (patch.defaultCategory) upd.default_category = patch.defaultCategory;
	if (Object.keys(upd).length > 0) {
		const { error } = await supabase.from("settings").update(upd).eq("user_id", userId);
		if (error) throw error;
	}
	if (patch.name || patch.email || patch.avatar !== void 0) {
		const profileUpd = {};
		if (patch.name) profileUpd.name = patch.name;
		if (patch.email) profileUpd.email = patch.email;
		if (patch.avatar !== void 0) profileUpd.avatar = patch.avatar ?? null;
		const { error } = await supabase.from("profiles").update(profileUpd).eq("id", userId);
		if (error) throw error;
	}
	return getSettings();
}
async function getAppData() {
	const [expenses, income, budgets, notifications, settings] = await Promise.all([
		getExpenses(),
		getIncome(),
		getBudgets(),
		getNotifications(),
		getSettings()
	]);
	return {
		expenses,
		income,
		budgets,
		notifications,
		settings
	};
}
async function getSavingsGoals() {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("savings_goals").select("id, title, target_amount, current_amount, note, created_at, updated_at").eq("user_id", userId).order("created_at", { ascending: false });
	if (error) throw error;
	return (data || []).map((row) => ({
		id: row.id,
		title: row.title,
		targetAmount: Number(row.target_amount),
		currentAmount: Number(row.current_amount),
		note: row.note || void 0,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	}));
}
async function addSavingsGoal(goal) {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("savings_goals").insert({
		user_id: userId,
		title: goal.title,
		target_amount: goal.targetAmount,
		current_amount: goal.currentAmount || 0,
		note: goal.note || null
	}).select("id, title, target_amount, current_amount, note, created_at, updated_at").single();
	if (error) throw error;
	return {
		id: data.id,
		title: data.title,
		targetAmount: Number(data.target_amount),
		currentAmount: Number(data.current_amount),
		note: data.note || void 0,
		createdAt: data.created_at,
		updatedAt: data.updated_at
	};
}
async function updateSavingsGoal(goal) {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("savings_goals").update({
		title: goal.title,
		target_amount: goal.targetAmount,
		current_amount: goal.currentAmount,
		note: goal.note || null
	}).eq("id", goal.id).eq("user_id", userId).select("id, title, target_amount, current_amount, note, created_at, updated_at").single();
	if (error) throw error;
	return {
		id: data.id,
		title: data.title,
		targetAmount: Number(data.target_amount),
		currentAmount: Number(data.current_amount),
		note: data.note || void 0,
		createdAt: data.created_at,
		updatedAt: data.updated_at
	};
}
async function deleteSavingsGoal(id) {
	const userId = await getCurrentUserId();
	const { error } = await supabase.from("savings_goals").delete().eq("id", id).eq("user_id", userId);
	if (error) throw error;
}
async function addSavingsContribution(contribution) {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("savings_contributions").insert({
		user_id: userId,
		goal_id: contribution.goalId,
		amount: contribution.amount,
		type: contribution.type,
		date: contribution.date,
		note: contribution.note || null
	}).select("id, goal_id, amount, type, date, note, created_at").single();
	if (error) throw error;
	return {
		id: data.id,
		goalId: data.goal_id,
		amount: Number(data.amount),
		type: data.type,
		date: data.date,
		note: data.note || void 0,
		createdAt: data.created_at
	};
}
async function getExpensesSummary(filters) {
	const userId = await getCurrentUserId();
	let query = supabase.from("expenses").select("amount", { count: "exact" }).eq("user_id", userId).eq("deleted", false);
	if (filters.category && filters.category !== "all") query = query.eq("category", filters.category);
	if (filters.dateFrom) query = query.gte("date", filters.dateFrom);
	if (filters.dateTo) query = query.lte("date", filters.dateTo);
	if (filters.search) query = query.ilike("title", `%${filters.search}%`);
	const { data, error, count } = await query;
	if (error) throw error;
	const amounts = (data || []).map((row) => Number(row.amount));
	const totalAmount = amounts.reduce((sum, a) => sum + a, 0);
	const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
	const avgAmount = amounts.length > 0 ? totalAmount / amounts.length : 0;
	return {
		totalCount: count || 0,
		totalAmount,
		maxAmount,
		avgAmount
	};
}
async function getPaymentHistory() {
	const userId = await getCurrentUserId();
	const { data, error } = await supabase.from("payment_history").select("*").eq("user_id", userId).order("payment_date", { ascending: false });
	if (error) throw error;
	return (data || []).map((row) => ({
		id: row.id,
		user_id: row.user_id,
		subscription_id: row.subscription_id,
		stripe_payment_intent: row.stripe_payment_intent,
		invoice_id: row.invoice_id ?? "",
		receipt_url: row.receipt_url ?? "",
		invoice_url: row.invoice_url ?? "",
		amount: Number(row.amount),
		currency: row.currency,
		payment_status: row.payment_status,
		payment_date: row.payment_date,
		created_at: row.created_at
	}));
}
/**
* Calculate the next occurrence date based on recurrence type.
*/
function getNextDate(fromDate, recurrence) {
	if (recurrence === "One-time") return void 0;
	const d = new Date(fromDate);
	switch (recurrence) {
		case "Daily":
			d.setDate(d.getDate() + 1);
			break;
		case "Weekly":
			d.setDate(d.getDate() + 7);
			break;
		case "Monthly":
			d.setMonth(d.getMonth() + 1);
			break;
		case "Yearly":
			d.setFullYear(d.getFullYear() + 1);
			break;
	}
	return d.toISOString().slice(0, 10);
}
/**
* Given a list of recurring income entries, return new income entries
* that are due today or earlier and haven't been posted yet.
*/
function getDueRecurringIncomes(incomeList) {
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	return incomeList.filter((i) => i.recurrence !== "One-time" && i.nextDate && i.nextDate <= today).map((i) => ({
		...i,
		id: "",
		date: i.nextDate,
		nextDate: getNextDate(i.nextDate, i.recurrence)
	}));
}
/**
* Human-readable label for a recurrence.
*/
function recurrenceLabel(r) {
	switch (r) {
		case "Daily": return "Every day";
		case "Weekly": return "Every week";
		case "Monthly": return "Every month";
		case "Yearly": return "Every year";
		default: return "One-time";
	}
}
/** Format a monetary amount in USD. */
function formatMoney(amount) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2
	}).format(amount);
}
/** Format a date string using the user's chosen date format pattern. */
function formatDate(date, fmt = "medium") {
	const d = typeof date === "string" ? new Date(date) : date;
	if (fmt === "short") return d.toLocaleDateString(void 0, {
		month: "short",
		day: "numeric"
	});
	if (fmt === "medium") return d.toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	const d2 = String(d.getDate());
	const monthShort = d.toLocaleString("default", { month: "short" });
	switch (fmt) {
		case "dd/MM/yyyy": return `${dd}/${mm}/${yyyy}`;
		case "MM/dd/yyyy": return `${mm}/${dd}/${yyyy}`;
		case "yyyy-MM-dd": return `${yyyy}-${mm}-${dd}`;
		default: return `${monthShort} ${d2}, ${yyyy}`;
	}
}
function formatPercent(value) {
	return `${Math.round(value)}%`;
}
/**
* Notification Engine — simplified, reliable version.
* Uses only sessionStorage for dedup (no async DB checks blocking the flow).
* Notifications are stored in Supabase AND shown in the bell.
*/
function sessionKey(base) {
	const now = /* @__PURE__ */ new Date();
	return `${base}_${now.getFullYear()}_${now.getMonth()}`;
}
function seen(key) {
	try {
		return sessionStorage.getItem(key) === "1";
	} catch {
		return false;
	}
}
function markSeen(key) {
	try {
		sessionStorage.setItem(key, "1");
	} catch {}
}
async function saveToDb(userId, type, title, message) {
	await supabase.from("notifications").insert({
		user_id: userId,
		type,
		title,
		message,
		read: false
	});
}
function checkBudgetNotifications(statuses, userId) {
	const newNotifs = [];
	for (const { budget, spent, pct } of statuses) {
		if (pct < 80) continue;
		const makeNotif = (title, message, type = "budget") => ({
			id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
			type,
			title,
			message,
			time: "just now",
			read: false
		});
		if (pct >= 100) {
			const key = sessionKey(`budget_exceeded_${budget.id}`);
			if (!seen(key)) {
				const over = spent - budget.limit;
				const title = "🚨 Budget Exceeded";
				const message = `Your ${budget.category} budget is exceeded by ${formatMoney(over)} (${formatMoney(spent)} of ${formatMoney(budget.limit)}).`;
				const n = makeNotif(title, message);
				newNotifs.push(n);
				markSeen(key);
				saveToDb(userId, "budget", title, message);
			}
		} else if (pct >= 80) {
			const key = sessionKey(`budget_warning_${budget.id}`);
			if (!seen(key)) {
				const title = "⚠️ Budget Warning";
				const message = `You've used ${Math.round(pct)}% of your ${budget.category} budget (${formatMoney(spent)} of ${formatMoney(budget.limit)}).`;
				const n = makeNotif(title, message);
				newNotifs.push(n);
				markSeen(key);
				saveToDb(userId, "budget", title, message);
			}
		}
	}
	return newNotifs;
}
function checkSavingsNotifications(goals, userId) {
	const newNotifs = [];
	for (const goal of goals) {
		if (!goal.targetAmount || goal.targetAmount <= 0 || goal.currentAmount <= 0) continue;
		const pct = goal.currentAmount / goal.targetAmount * 100;
		const makeNotif = (title, message) => ({
			id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
			type: "summary",
			title,
			message,
			time: "just now",
			read: false
		});
		if (pct >= 100) {
			const key = `savings_100_${goal.id}`;
			if (!seen(key)) {
				const title = "🎉 Goal Reached!";
				const message = `Congratulations! You've reached your "${goal.title}" savings goal of ${formatMoney(goal.targetAmount)}!`;
				newNotifs.push(makeNotif(title, message));
				markSeen(key);
				saveToDb(userId, "summary", title, message);
			}
		} else if (pct >= 75) {
			const key = `savings_75_${goal.id}`;
			if (!seen(key)) {
				const left = goal.targetAmount - goal.currentAmount;
				const title = "🔥 Almost There!";
				const message = `You're 75% toward your "${goal.title}" goal! Just ${formatMoney(left)} left to save.`;
				newNotifs.push(makeNotif(title, message));
				markSeen(key);
				saveToDb(userId, "summary", title, message);
			}
		} else if (pct >= 50) {
			const key = `savings_50_${goal.id}`;
			if (!seen(key)) {
				const left = goal.targetAmount - goal.currentAmount;
				const title = "🎯 Halfway There!";
				const message = `You've saved 50% toward "${goal.title}"! ${formatMoney(goal.currentAmount)} saved, ${formatMoney(left)} to go.`;
				newNotifs.push(makeNotif(title, message));
				markSeen(key);
				saveToDb(userId, "summary", title, message);
			}
		} else if (pct >= 25) {
			const key = `savings_25_${goal.id}`;
			if (!seen(key)) {
				const title = "� Savings Milestone";
				const message = `You're 25% of the way to your "${goal.title}" goal! Saved ${formatMoney(goal.currentAmount)} of ${formatMoney(goal.targetAmount)}.`;
				newNotifs.push(makeNotif(title, message));
				markSeen(key);
				saveToDb(userId, "summary", title, message);
			}
		}
		if (goal.currentAmount === 0 && goal.createdAt) {
			if (Math.floor((Date.now() - new Date(goal.createdAt).getTime()) / 864e5) >= 7) {
				const key = `savings_inactive_${goal.id}`;
				if (!seen(key)) {
					const title = "💤 Savings Goal Inactive";
					const message = `Your "${goal.title}" goal has no contributions yet. Start saving today!`;
					newNotifs.push({
						id: `local_${Date.now()}`,
						type: "bill",
						title,
						message,
						time: "just now",
						read: false
					});
					markSeen(key);
					saveToDb(userId, "bill", title, message);
				}
			}
		}
	}
	return newNotifs;
}
var AppContext = (0, import_react.createContext)(null);
function isNoDataPage() {
	if (typeof window === "undefined") return false;
	const path = window.location.pathname;
	return path === "/onboarding" || path === "/login";
}
var uid = () => Math.random().toString(36).slice(2, 10);
function AppProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)("light");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [settings, setSettings] = (0, import_react.useState)({
		timezone: "America/Los_Angeles",
		dateFormat: "MMM d, yyyy",
		language: "English",
		defaultCategory: "Food",
		name: "Alex Morgan",
		email: "alex@example.com"
	});
	const [expenses, setExpenses] = (0, import_react.useState)([]);
	const [income, setIncome] = (0, import_react.useState)([]);
	const [budgets, setBudgets] = (0, import_react.useState)([]);
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [savingsGoals, setSavingsGoals] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const initial = localStorage.getItem("ems-theme") ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
		setTheme(initial);
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		document.documentElement.classList.toggle("dark", theme === "dark");
		localStorage.setItem("ems-theme", theme);
	}, [theme]);
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated || budgets.length === 0 || expenses.length === 0) return;
		supabase.auth.getUser().then(({ data: { user } }) => {
			if (!user) return;
			const now = /* @__PURE__ */ new Date();
			const spentByCat = /* @__PURE__ */ new Map();
			expenses.filter((e) => {
				if (e.deleted) return false;
				const d = new Date(e.date);
				return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
			}).forEach((e) => spentByCat.set(e.category, (spentByCat.get(e.category) ?? 0) + e.amount));
			const alertStatuses = budgets.map((b) => {
				const spent = spentByCat.get(b.category) ?? 0;
				return {
					budget: b,
					spent,
					pct: b.limit > 0 ? spent / b.limit * 100 : 0
				};
			}).filter((s) => s.pct >= 80);
			if (alertStatuses.length === 0) return;
			const newNotifs = checkBudgetNotifications(alertStatuses, user.id);
			if (newNotifs.length > 0) setNotifications((list) => {
				const existingIds = new Set(list.map((n) => n.title + "_" + n.message));
				const unique = newNotifs.filter((n) => !existingIds.has(n.title + "_" + n.message));
				return unique.length > 0 ? [...unique, ...list] : list;
			});
		});
	}, [
		expenses,
		budgets,
		isAuthenticated
	]);
	(0, import_react.useEffect)(() => {
		if (!isAuthenticated || savingsGoals.length === 0) return;
		supabase.auth.getUser().then(({ data: { user } }) => {
			if (!user) return;
			const newNotifs = checkSavingsNotifications(savingsGoals, user.id);
			if (newNotifs.length > 0) setNotifications((list) => {
				const existingIds = new Set(list.map((n) => n.title + "_" + n.message));
				const unique = newNotifs.filter((n) => !existingIds.has(n.title + "_" + n.message));
				return unique.length > 0 ? [...unique, ...list] : list;
			});
		});
	}, [savingsGoals, isAuthenticated]);
	(0, import_react.useEffect)(() => {
		if (authLoading) return;
		if (!isAuthenticated) {
			setLoading(false);
			return;
		}
		getAppData().then((data) => {
			setExpenses(data.expenses);
			setIncome(data.income);
			setBudgets(data.budgets);
			setNotifications(data.notifications);
			setSettings(data.settings);
			const due = getDueRecurringIncomes(data.income);
			if (due.length > 0) due.forEach(async (newEntry) => {
				try {
					const parent = data.income.find((i) => i.recurrence === newEntry.recurrence && i.source === newEntry.source && i.nextDate === newEntry.date);
					const saved = await addIncome(newEntry);
					setIncome((list) => [saved, ...list]);
					if (parent) {
						const updated = {
							...parent,
							nextDate: getNextDate(newEntry.date, newEntry.recurrence)
						};
						await updateIncome(updated);
						setIncome((list) => list.map((i) => i.id === parent.id ? updated : i));
					}
				} catch (err) {
					console.error("Failed to post recurring income:", err);
				}
			});
			return getSavingsGoals();
		}).then((savingsData) => {
			setSavingsGoals(savingsData);
		}).catch((err) => {
			console.error("Failed to load app data:", err);
		}).finally(() => {
			setLoading(false);
		});
	}, [isAuthenticated, authLoading]);
	const value = (0, import_react.useMemo)(() => ({
		theme,
		toggleTheme: () => setTheme((t) => t === "light" ? "dark" : "light"),
		settings,
		updateSettings: (patch) => {
			const old = { ...settings };
			setSettings((s) => ({
				...s,
				...patch
			}));
			updateSettings(patch).catch((err) => {
				console.error("Failed to update settings:", err);
				setSettings(old);
			});
		},
		expenses,
		income,
		budgets,
		notifications,
		addExpense: async (e) => {
			const tempId = uid();
			const item = {
				...e,
				id: tempId
			};
			setExpenses((list) => [item, ...list]);
			try {
				const res = await addExpense(item);
				setExpenses((list) => list.map((x) => x.id === tempId ? res : x));
				return res;
			} catch (err) {
				console.error("Failed to add expense:", err);
				setExpenses((list) => list.filter((x) => x.id !== tempId));
				throw err;
			}
		},
		updateExpense: async (e) => {
			const old = expenses.find((x) => x.id === e.id);
			setExpenses((list) => list.map((x) => x.id === e.id ? e : x));
			try {
				await updateExpense(e);
				return e;
			} catch (err) {
				console.error("Failed to update expense:", err);
				if (old) setExpenses((list) => list.map((x) => x.id === e.id ? old : x));
				throw err;
			}
		},
		deleteExpense: (id) => {
			setExpenses((list) => list.map((x) => x.id === id ? {
				...x,
				deleted: true
			} : x));
			deleteExpense(id).catch((err) => {
				console.error("Failed to delete expense:", err);
			});
		},
		addIncome: async (i) => {
			const tempId = uid();
			const item = {
				...i,
				id: tempId
			};
			setIncome((list) => [item, ...list]);
			try {
				const res = await addIncome(item);
				setIncome((list) => list.map((x) => x.id === tempId ? res : x));
				return res;
			} catch (err) {
				console.error("Failed to add income:", err);
				setIncome((list) => list.filter((x) => x.id !== tempId));
				throw err;
			}
		},
		updateIncome: async (i) => {
			const old = income.find((x) => x.id === i.id);
			setIncome((list) => list.map((x) => x.id === i.id ? i : x));
			try {
				await updateIncome(i);
				return i;
			} catch (err) {
				console.error("Failed to update income:", err);
				if (old) setIncome((list) => list.map((x) => x.id === i.id ? old : x));
				throw err;
			}
		},
		deleteIncome: (id) => {
			setIncome((list) => list.filter((x) => x.id !== id));
			deleteIncome(id).catch((err) => {
				console.error("Failed to delete income:", err);
			});
		},
		saveBudget: (b) => {
			if (budgets.some((x) => x.id === b.id)) {
				const old = budgets.find((x) => x.id === b.id);
				setBudgets((list) => list.map((x) => x.id === b.id ? b : x));
				saveBudget(b).catch((err) => {
					console.error("Failed to save budget:", err);
					if (old) setBudgets((list) => list.map((x) => x.id === b.id ? old : x));
				});
			} else {
				const tempId = uid();
				const item = {
					...b,
					id: tempId
				};
				setBudgets((list) => [...list, item]);
				saveBudget(item).then((res) => {
					setBudgets((list) => list.map((x) => x.id === tempId ? res : x));
				}).catch((err) => {
					console.error("Failed to save budget:", err);
					setBudgets((list) => list.filter((x) => x.id !== tempId));
				});
			}
		},
		deleteBudget: (id) => {
			setBudgets((list) => list.filter((x) => x.id !== id));
			deleteBudget(id).catch((err) => {
				console.error("Failed to delete budget:", err);
			});
		},
		markNotificationsRead: () => {
			setNotifications((list) => list.map((n) => ({
				...n,
				read: true
			})));
			markNotificationsRead().catch((err) => {
				console.error("Failed to mark notifications read:", err);
			});
		},
		addNotification: (title, message, type = "summary") => {
			const notif = {
				id: uid(),
				type,
				title,
				message,
				time: "just now",
				read: false
			};
			setNotifications((list) => [notif, ...list]);
			(async () => {
				const { data: { user } } = await supabase.auth.getUser();
				if (!user) return;
				await supabase.from("notifications").insert({
					user_id: user.id,
					type,
					title,
					message,
					read: false
				});
			})().catch((_err) => console.error("Failed to save notification:", _err));
		},
		savingsGoals,
		addSavingsGoal: async (g) => {
			const tempId = uid();
			const item = {
				...g,
				id: tempId,
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			setSavingsGoals((list) => [item, ...list]);
			try {
				const res = await addSavingsGoal(g);
				setSavingsGoals((list) => list.map((x) => x.id === tempId ? res : x));
				return res;
			} catch (err) {
				console.error("Failed to add savings goal:", err);
				setSavingsGoals((list) => list.filter((x) => x.id !== tempId));
				throw err;
			}
		},
		updateSavingsGoal: async (g) => {
			const old = savingsGoals.find((x) => x.id === g.id);
			setSavingsGoals((list) => list.map((x) => x.id === g.id ? g : x));
			try {
				return await updateSavingsGoal(g);
			} catch (err) {
				console.error("Failed to update savings goal:", err);
				if (old) setSavingsGoals((list) => list.map((x) => x.id === g.id ? old : x));
				throw err;
			}
		},
		deleteSavingsGoal: (id) => {
			setSavingsGoals((list) => list.filter((x) => x.id !== id));
			deleteSavingsGoal(id).catch((err) => {
				console.error("Failed to delete savings goal:", err);
			});
		},
		addSavingsContribution: async (c) => {
			try {
				const res = await addSavingsContribution(c);
				const goal = savingsGoals.find((g) => g.id === c.goalId);
				if (goal) {
					const newAmount = c.type === "deposit" ? goal.currentAmount + c.amount : goal.currentAmount - c.amount;
					const updatedGoal = {
						...goal,
						currentAmount: newAmount,
						updatedAt: (/* @__PURE__ */ new Date()).toISOString()
					};
					setSavingsGoals((list) => list.map((g) => g.id === goal.id ? updatedGoal : g));
					await updateSavingsGoal(updatedGoal);
					if (c.type === "deposit") {
						const savingsExpense = {
							id: uid(),
							title: `Savings: ${goal.title}`,
							amount: c.amount,
							date: c.date,
							category: "Savings",
							status: "Paid",
							recurrence: "None",
							tags: ["savings"],
							deleted: false
						};
						await addExpense(savingsExpense);
						setExpenses((list) => [savingsExpense, ...list]);
					} else if (c.type === "withdrawal") {
						const savingsIncome = {
							id: uid(),
							source: `Savings: ${goal.title}`,
							amount: c.amount,
							date: c.date,
							category: "Savings",
							recurrence: "One-time"
						};
						await addIncome(savingsIncome);
						setIncome((list) => [savingsIncome, ...list]);
					}
				}
				return res;
			} catch (err) {
				console.error("Failed to add savings contribution:", err);
				throw err;
			}
		}
	}), [
		theme,
		settings,
		expenses,
		income,
		budgets,
		notifications,
		savingsGoals
	]);
	if (loading && !isNoDataPage()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex h-16 w-16 items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 animate-ping rounded-2xl bg-primary/20 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-12 animate-spin rounded-xl border-4 border-primary border-t-transparent" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-lg font-semibold tracking-tight",
					children: "Expensia"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground animate-pulse",
					children: "Loading financial vault..."
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppContext.Provider, {
		value,
		children
	});
}
function useApp() {
	const ctx = (0, import_react.useContext)(AppContext);
	if (!ctx) throw new Error("useApp must be used within AppProvider");
	return ctx;
}
/** Active (non-deleted) expenses helper. */
function useActiveExpenses() {
	const { expenses } = useApp();
	return (0, import_react.useMemo)(() => expenses.filter((e) => !e.deleted), [expenses]);
}
//#endregion
export { getExpensesSummary as a, getNextDate as c, useActiveExpenses as d, useApp as f, formatPercent as i, getPaymentHistory as l, formatDate as n, getExpensesWithFilters as o, formatMoney as r, getIncomeWithFilters as s, AppProvider as t, recurrenceLabel as u };
