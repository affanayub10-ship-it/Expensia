import { supabase } from "./supabase";
import type {
  Expense,
  Income,
  Budget,
  AppNotification,
  Settings,
  SavingsGoal,
  SavingsContribution,
  PaymentHistory,
} from "./mock-data";

let _cachedUserId: string | null = null;
let _userIdPromise: Promise<string> | null = null;

async function getCurrentUserId(): Promise<string> {
  if (_cachedUserId) return _cachedUserId;
  if (_userIdPromise) return _userIdPromise;
  _userIdPromise = (async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user?.id) {
      _cachedUserId = session.user.id;
      return _cachedUserId;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    _cachedUserId = user.id;
    return _cachedUserId;
  })();
  return _userIdPromise;
}

// ── EXPENSES ──────────────────────────────────────────────────────────────────

export async function getExpenses(): Promise<Expense[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("expenses")
    .select(
      "id, title, amount, date, category, location, tags, status, recurrence, receipt, deleted",
    )
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    location: row.location || undefined,
    tags: row.tags || [],
    status: row.status,
    recurrence: row.recurrence,
    receipt: row.receipt || undefined,
    deleted: row.deleted,
  }));
}

export async function getExpensesPaginated(
  page: number = 1,
  limit: number = 20,
): Promise<{ data: Expense[]; hasMore: boolean }> {
  const userId = await getCurrentUserId();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("expenses")
    .select(
      "id, title, amount, date, category, location, tags, status, recurrence, receipt, deleted",
      { count: "exact" },
    )
    .eq("user_id", userId)
    .eq("deleted", false)
    .order("date", { ascending: false })
    .range(from, to);

  if (error) throw error;

  const expenses = (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    location: row.location || undefined,
    tags: row.tags || [],
    status: row.status,
    recurrence: row.recurrence,
    receipt: row.receipt || undefined,
    deleted: row.deleted,
  }));

  const hasMore = count ? from + limit < count : false;

  return { data: expenses, hasMore };
}

export async function getExpensesWithFilters(filters: {
  page?: number;
  limit?: number;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: "date" | "amount";
  sortOrder?: "asc" | "desc";
}): Promise<{ data: Expense[]; hasMore: boolean }> {
  const userId = await getCurrentUserId();
  const {
    page = 1,
    limit = 20,
    category,
    dateFrom,
    dateTo,
    search,
    sortBy = "date",
    sortOrder = "desc",
  } = filters;
  const fetchLimit = limit + 1;
  const from = (page - 1) * limit;
  const to = from + fetchLimit - 1;

  let query = supabase
    .from("expenses")
    .select("id, title, amount, date, category, location, tags, status, recurrence, receipt, deleted")
    .eq("user_id", userId)
    .eq("deleted", false);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  if (dateFrom) {
    query = query.gte("date", dateFrom);
  }

  if (dateTo) {
    query = query.lte("date", dateTo);
  }

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

  const expenses = raw.map((row) => ({
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    location: row.location || undefined,
    tags: row.tags || [],
    status: row.status,
    recurrence: row.recurrence,
    receipt: row.receipt || undefined,
    deleted: row.deleted,
  }));

  return { data: expenses, hasMore };
}

export async function addExpense(expense: Expense): Promise<Expense> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("expenses")
    .insert({
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
      deleted: expense.deleted || false,
    })
    .select(
      "id, title, amount, date, category, location, tags, status, recurrence, receipt, deleted",
    )
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    amount: Number(data.amount),
    date: data.date,
    category: data.category,
    location: data.location || undefined,
    tags: data.tags || [],
    status: data.status,
    recurrence: data.recurrence,
    receipt: data.receipt || undefined,
    deleted: data.deleted,
  };
}

export async function updateExpense(expense: Expense): Promise<Expense> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("expenses")
    .update({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      location: expense.location ?? null,
      tags: expense.tags || [],
      status: expense.status,
      recurrence: expense.recurrence,
      receipt: expense.receipt ?? null,
      deleted: expense.deleted || false,
    })
    .eq("id", expense.id)
    .eq("user_id", userId)
    .select(
      "id, title, amount, date, category, location, tags, status, recurrence, receipt, deleted",
    )
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    amount: Number(data.amount),
    date: data.date,
    category: data.category,
    location: data.location || undefined,
    tags: data.tags || [],
    status: data.status,
    recurrence: data.recurrence,
    receipt: data.receipt || undefined,
    deleted: data.deleted,
  };
}

export async function deleteExpense(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from("expenses")
    .update({ deleted: true })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

// ── INCOME ────────────────────────────────────────────────────────────────────

export async function getIncome(): Promise<Income[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("income")
    .select("id, source, amount, date, category, notes, recurrence, next_date")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    source: row.source,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    notes: row.notes || undefined,
    recurrence: (row.recurrence ?? "One-time") as Income["recurrence"],
    nextDate: row.next_date ?? undefined,
  }));
}

export async function addIncome(income: Income): Promise<Income> {
  const userId = await getCurrentUserId();
  const payload: Record<string, unknown> = {
    user_id: userId,
    source: income.source,
    amount: income.amount,
    date: income.date,
    category: income.category,
    notes: income.notes ?? null,
    recurrence: income.recurrence ?? "One-time",
    next_date: income.nextDate ?? null,
  };
  const { data, error } = await supabase
    .from("income")
    .insert(payload)
    .select("id, source, amount, date, category, notes, recurrence, next_date")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    source: data.source,
    amount: Number(data.amount),
    date: data.date,
    category: data.category,
    notes: data.notes || undefined,
    recurrence: (data.recurrence as Income["recurrence"]) ?? "One-time",
    nextDate: data.next_date ?? undefined,
  };
}

export async function updateIncome(income: Income): Promise<Income> {
  const userId = await getCurrentUserId();
  const payload: Record<string, unknown> = {
    source: income.source,
    amount: income.amount,
    date: income.date,
    category: income.category,
    notes: income.notes ?? null,
    recurrence: income.recurrence ?? "One-time",
    next_date: income.nextDate ?? null,
  };
  const { data, error } = await supabase
    .from("income")
    .update(payload)
    .eq("id", income.id)
    .eq("user_id", userId)
    .select("id, source, amount, date, category, notes, recurrence, next_date")
    .single();
  if (error) {
    if (error.code === "42703") {
      const { data: d2, error: e2 } = await supabase
        .from("income")
        .update({
          source: income.source,
          amount: income.amount,
          date: income.date,
          category: income.category,
          notes: income.notes ?? null,
        })
        .eq("id", income.id)
        .eq("user_id", userId)
        .select("id, source, amount, date, category, notes, recurrence, next_date")
        .single();
      if (e2) throw e2;
      return {
        id: d2.id,
        source: d2.source,
        amount: Number(d2.amount),
        date: d2.date,
        category: d2.category,
        notes: d2.notes || undefined,
        recurrence: income.recurrence ?? "One-time",
        nextDate: income.nextDate,
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
    notes: data.notes || undefined,
    recurrence: (data.recurrence as Income["recurrence"]) ?? "One-time",
    nextDate: data.next_date ?? undefined,
  };
}

export async function deleteIncome(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase.from("income").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function getIncomeWithFilters(filters: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<{ data: Income[]; hasMore: boolean }> {
  const userId = await getCurrentUserId();
  const { page = 1, limit = 20 } = filters;
  const fetchLimit = limit + 1;
  const from = (page - 1) * limit;
  const to = from + fetchLimit - 1;

  let query = supabase
    .from("income")
    .select("id, source, amount, date, category, notes, recurrence, next_date")
    .eq("user_id", userId)
    .order(
      filters.sortBy === "amount" || filters.sortBy === "source" || filters.sortBy === "category"
        ? filters.sortBy
        : "date",
      {
        ascending: filters.sortOrder === "asc",
      },
    );
  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters.search) {
    const s = filters.search.replace(/'/g, "''");
    query = query.or(`source.ilike.%${s}%,category.ilike.%${s}%,notes.ilike.%${s}%`);
  }
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  const raw = data || [];
  const hasMore = raw.length > limit;
  if (hasMore) raw.pop();
  const parsed = raw.map((row) => ({
    id: row.id,
    source: row.source,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    notes: row.notes || undefined,
    recurrence: (row.recurrence ?? "One-time") as Income["recurrence"],
    nextDate: row.next_date ?? undefined,
  }));
  return { data: parsed, hasMore };
}

// ── BUDGETS ───────────────────────────────────────────────────────────────────

export async function getBudgets(): Promise<Budget[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("budgets")
    .select("id, category, limit_amount")
    .eq("user_id", userId);
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    category: row.category,
    limit: Number(row.limit_amount),
  }));
}

export async function saveBudget(budget: Budget): Promise<Budget> {
  const userId = await getCurrentUserId();
  const { data: existing } = await supabase
    .from("budgets")
    .select("id")
    .eq("user_id", userId)
    .eq("category", budget.category)
    .single();
  if (existing) {
    const { data, error } = await supabase
      .from("budgets")
      .update({ limit_amount: budget.limit })
      .eq("id", existing.id)
      .eq("user_id", userId)
      .select("id, category, limit_amount")
      .single();
    if (error) throw error;
    return { id: data.id, category: data.category, limit: Number(data.limit_amount) };
  }
  const { data, error } = await supabase
    .from("budgets")
    .insert({ user_id: userId, category: budget.category, limit_amount: budget.limit })
    .select("id, category, limit_amount")
    .single();
  if (error) throw error;
  return { id: data.id, category: data.category, limit: Number(data.limit_amount) };
}

export async function deleteBudget(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase.from("budgets").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────

function formatTimeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export async function getNotifications(): Promise<AppNotification[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, message, created_at, read")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    time: formatTimeAgo(new Date(row.created_at)),
    read: row.read,
  }));
}

export async function markNotificationsRead(): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
  if (error) throw error;
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("settings")
    .select("timezone, date_format, language, default_category")
    .eq("user_id", userId)
    .single();
  
  const settingsData = error ? await createDefaultSettings(userId) : data;

  let profile = null;
  const { data: profileData } = await supabase
    .from("profiles")
    .select("name, email, avatar")
    .eq("id", userId)
    .single();

  if (profileData) {
    profile = profileData;
  } else {
    // Self-heal: Create profile from Auth user details if missing in profiles table
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const email = authUser.email || "";
        const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || "User";
        
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            name,
            email,
            onboarding_complete: false
          })
          .select()
          .single();
          
        if (newProfile) {
          profile = newProfile;
        } else {
          profile = { name, email, avatar: null };
        }
      }
    } catch (err) {
      console.error("Failed to self-heal profile inside getSettings:", err);
    }
  }

  return {
    timezone: settingsData.timezone,
    dateFormat: settingsData.date_format,
    language: settingsData.language,
    defaultCategory: settingsData.default_category,
    name: profile?.name || "User",
    email: profile?.email || "",
    avatar: profile?.avatar || undefined,
  };
}

async function createDefaultSettings(userId: string): Promise<Settings> {
  let profile = null;
  const { data: profileData } = await supabase
    .from("profiles")
    .select("name, email, avatar")
    .eq("id", userId)
    .single();

  if (profileData) {
    profile = profileData;
  } else {
    // Try to get auth user details and auto-create the missing profile
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const email = authUser.email || "";
        const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || "User";
        
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            name,
            email,
            onboarding_complete: false
          })
          .select()
          .single();
          
        if (newProfile) {
          profile = newProfile;
        } else {
          profile = { name, email, avatar: null };
        }
      }
    } catch (err) {
      console.error("Failed to self-heal profile inside createDefaultSettings:", err);
    }
  }

  const defaults: Settings = {
    timezone: "America/Los_Angeles",
    dateFormat: "MMM d, yyyy",
    language: "English",
    defaultCategory: "Food",
    name: profile?.name || "User",
    email: profile?.email || "",
    avatar: profile?.avatar || undefined,
  };

  await supabase.from("settings").insert({
    user_id: userId,
    timezone: defaults.timezone,
    date_format: defaults.dateFormat,
    language: defaults.language,
    default_category: defaults.defaultCategory,
  });

  return defaults;
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const userId = await getCurrentUserId();
  const upd: Record<string, unknown> = {};
  if (patch.timezone) upd.timezone = patch.timezone;
  if (patch.dateFormat) upd.date_format = patch.dateFormat;
  if (patch.language) upd.language = patch.language;
  if (patch.defaultCategory) upd.default_category = patch.defaultCategory;
  if (Object.keys(upd).length > 0) {
    const { error } = await supabase.from("settings").update(upd).eq("user_id", userId);
    if (error) throw error;
  }
  if (patch.name || patch.email || patch.avatar !== undefined) {
    const profileUpd: Record<string, unknown> = {};
    if (patch.name) profileUpd.name = patch.name;
    if (patch.email) profileUpd.email = patch.email;
    if (patch.avatar !== undefined) profileUpd.avatar = patch.avatar ?? null;
    const { error } = await supabase.from("profiles").update(profileUpd).eq("id", userId);
    if (error) throw error;
  }
  return getSettings();
}

// ── APP DATA ──────────────────────────────────────────────────────────────────

export async function getAppData() {
  const [expenses, income, budgets, notifications, settings] = await Promise.all([
    getExpenses(),
    getIncome(),
    getBudgets(),
    getNotifications(),
    getSettings(),
  ]);
  return { expenses, income, budgets, notifications, settings };
}

// ── SAVINGS ───────────────────────────────────────────────────────────────────

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("savings_goals")
    .select("id, title, target_amount, current_amount, note, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    targetAmount: Number(row.target_amount),
    currentAmount: Number(row.current_amount),
    note: row.note || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function addSavingsGoal(
  goal: Omit<SavingsGoal, "id" | "createdAt" | "updatedAt">,
): Promise<SavingsGoal> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("savings_goals")
    .insert({
      user_id: userId,
      title: goal.title,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount || 0,
      note: goal.note || null,
    })
    .select("id, title, target_amount, current_amount, note, created_at, updated_at")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    targetAmount: Number(data.target_amount),
    currentAmount: Number(data.current_amount),
    note: data.note || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateSavingsGoal(goal: SavingsGoal): Promise<SavingsGoal> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("savings_goals")
    .update({
      title: goal.title,
      target_amount: goal.targetAmount,
      current_amount: goal.currentAmount,
      note: goal.note || null,
    })
    .eq("id", goal.id)
    .eq("user_id", userId)
    .select("id, title, target_amount, current_amount, note, created_at, updated_at")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    targetAmount: Number(data.target_amount),
    currentAmount: Number(data.current_amount),
    note: data.note || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function deleteSavingsGoal(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from("savings_goals")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function addSavingsContribution(
  contribution: Omit<SavingsContribution, "id" | "createdAt">,
): Promise<SavingsContribution> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("savings_contributions")
    .insert({
      user_id: userId,
      goal_id: contribution.goalId,
      amount: contribution.amount,
      type: contribution.type,
      date: contribution.date,
      note: contribution.note || null,
    })
    .select("id, goal_id, amount, type, date, note, created_at")
    .single();
  if (error) throw error;
  return {
    id: data.id,
    goalId: data.goal_id,
    amount: Number(data.amount),
    type: data.type,
    date: data.date,
    note: data.note || undefined,
    createdAt: data.created_at,
  };
}

export interface ExpenseSummary {
  totalCount: number;
  totalAmount: number;
  maxAmount: number;
  avgAmount: number;
}

export async function getExpensesSummary(filters: {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}): Promise<ExpenseSummary> {
  const userId = await getCurrentUserId();
  let query = supabase
    .from("expenses")
    .select("amount", { count: "exact" })
    .eq("user_id", userId)
    .eq("deleted", false);
  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters.dateFrom) {
    query = query.gte("date", filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte("date", filters.dateTo);
  }
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }
  const { data, error, count } = await query;
  if (error) throw error;
  const amounts = (data || []).map((row) => Number(row.amount));
  const totalAmount = amounts.reduce((sum, a) => sum + a, 0);
  const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
  const avgAmount = amounts.length > 0 ? totalAmount / amounts.length : 0;
  return { totalCount: count || 0, totalAmount, maxAmount, avgAmount };
}

export async function getSavingsContributions(goalId: string): Promise<SavingsContribution[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("savings_contributions")
    .select("id, goal_id, amount, type, date, note, created_at")
    .eq("user_id", userId)
    .eq("goal_id", goalId)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    goalId: row.goal_id,
    amount: Number(row.amount),
    type: row.type,
    date: row.date,
    note: row.note || undefined,
    createdAt: row.created_at,
  }));
}

export async function getPaymentHistory(): Promise<PaymentHistory[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("payment_history")
    .select("*")
    .eq("user_id", userId)
    .order("payment_date", { ascending: false });
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
    created_at: row.created_at,
  }));
}
