import { supabase } from './supabase';
import type {
  Expense,
  Income,
  Budget,
  AppNotification,
  Settings,
} from './mock-data';

// Helper to get current user ID
async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

// ============================================
// EXPENSES
// ============================================

export async function getExpenses(): Promise<Expense[]> {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    paymentMethod: row.payment_method,
    merchant: row.merchant || undefined,
    location: row.location || undefined,
    currency: row.currency,
    tags: row.tags || [],
    status: row.status,
    recurrence: row.recurrence,
    receipt: row.receipt || undefined,
    deleted: row.deleted,
  }));
}

export async function addExpense(expense: Expense): Promise<Expense> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      user_id: userId,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      payment_method: expense.paymentMethod,
      merchant: expense.merchant,
      location: expense.location,
      currency: expense.currency,
      tags: expense.tags || [],
      status: expense.status,
      recurrence: expense.recurrence,
      receipt: expense.receipt,
      deleted: expense.deleted || false,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    amount: Number(data.amount),
    date: data.date,
    category: data.category,
    paymentMethod: data.payment_method,
    merchant: data.merchant || undefined,
    location: data.location || undefined,
    currency: data.currency,
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
    .from('expenses')
    .update({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      payment_method: expense.paymentMethod,
      merchant: expense.merchant,
      location: expense.location,
      currency: expense.currency,
      tags: expense.tags || [],
      status: expense.status,
      recurrence: expense.recurrence,
      receipt: expense.receipt,
      deleted: expense.deleted || false,
    })
    .eq('id', expense.id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    amount: Number(data.amount),
    date: data.date,
    category: data.category,
    paymentMethod: data.payment_method,
    merchant: data.merchant || undefined,
    location: data.location || undefined,
    currency: data.currency,
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
    .from('expenses')
    .update({ deleted: true })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============================================
// INCOME
// ============================================

export async function getIncome(): Promise<Income[]> {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from('income')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    source: row.source,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    currency: row.currency,
    notes: row.notes || undefined,
    recurrence: (row.recurrence ?? 'One-time') as Income['recurrence'],
    nextDate: row.next_date ?? undefined,
  }));
}

export async function addIncome(income: Income): Promise<Income> {
  const userId = await getCurrentUserId();

  // Build the insert payload — only include recurrence/next_date if the
  // Income type carries them, so the function works even before the SQL
  // migration that adds those columns has been run.
  const payload: Record<string, unknown> = {
    user_id: userId,
    source: income.source,
    amount: income.amount,
    date: income.date,
    category: income.category,
    currency: income.currency,
    notes: income.notes ?? null,
    recurrence: income.recurrence ?? 'One-time',
    next_date: income.nextDate ?? null,
  };

  const { data, error } = await supabase
    .from('income')
    .insert(payload)
    .select()
    .single();

  if (error) {
    // If the column doesn't exist yet, retry without the new fields
    if (error.code === '42703') {
      const { data: data2, error: error2 } = await supabase
        .from('income')
        .insert({
          user_id: userId,
          source: income.source,
          amount: income.amount,
          date: income.date,
          category: income.category,
          currency: income.currency,
          notes: income.notes ?? null,
        })
        .select()
        .single();
      if (error2) throw error2;
      return {
        id: data2.id,
        source: data2.source,
        amount: Number(data2.amount),
        date: data2.date,
        category: data2.category,
        currency: data2.currency,
        notes: data2.notes || undefined,
        recurrence: 'One-time',
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
    currency: data.currency,
    notes: data.notes || undefined,
    recurrence: (data.recurrence as Income['recurrence']) ?? 'One-time',
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
    currency: income.currency,
    notes: income.notes ?? null,
    recurrence: income.recurrence ?? 'One-time',
    next_date: income.nextDate ?? null,
  };

  const { data, error } = await supabase
    .from('income')
    .update(payload)
    .eq('id', income.id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    // Retry without new columns if they don't exist yet
    if (error.code === '42703') {
      const { data: data2, error: error2 } = await supabase
        .from('income')
        .update({
          source: income.source,
          amount: income.amount,
          date: income.date,
          category: income.category,
          currency: income.currency,
          notes: income.notes ?? null,
        })
        .eq('id', income.id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error2) throw error2;
      return {
        id: data2.id,
        source: data2.source,
        amount: Number(data2.amount),
        date: data2.date,
        category: data2.category,
        currency: data2.currency,
        notes: data2.notes || undefined,
        recurrence: income.recurrence ?? 'One-time',
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
    currency: data.currency,
    notes: data.notes || undefined,
    recurrence: (data.recurrence as Income['recurrence']) ?? 'One-time',
    nextDate: data.next_date ?? undefined,
  };
}

export async function deleteIncome(id: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('income')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============================================
// BUDGETS
// ============================================

export async function getBudgets(): Promise<Budget[]> {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    category: row.category,
    limit: Number(row.limit_amount),
  }));
}

export async function saveBudget(budget: Budget): Promise<Budget> {
  const userId = await getCurrentUserId();

  // Check if budget exists
  const { data: existing } = await supabase
    .from('budgets')
    .select('id')
    .eq('user_id', userId)
    .eq('category', budget.category)
    .single();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('budgets')
      .update({ limit_amount: budget.limit })
      .eq('id', existing.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      category: data.category,
      limit: Number(data.limit_amount),
    };
  } else {
    // Insert new
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        user_id: userId,
        category: budget.category,
        limit_amount: budget.limit,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      category: data.category,
      limit: Number(data.limit_amount),
    };
  }
}

export async function deleteBudget(id: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function getNotifications(): Promise<AppNotification[]> {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(row => ({
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
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ============================================
// SETTINGS
// ============================================

export async function getSettings(): Promise<Settings> {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // If no settings exist, create default
    return await createDefaultSettings(userId);
  }

  // Get user profile for name and email
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', userId)
    .single();

  return {
    currency: data.currency,
    timezone: data.timezone,
    dateFormat: data.date_format,
    language: data.language,
    defaultPaymentMethod: data.default_payment_method,
    defaultCategory: data.default_category,
    name: profile?.name || 'User',
    email: profile?.email || '',
  };
}

async function createDefaultSettings(userId: string): Promise<Settings> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', userId)
    .single();

  const defaultSettings = {
    currency: 'USD',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MMM d, yyyy',
    language: 'English',
    defaultPaymentMethod: 'Debit Card',
    defaultCategory: 'Food',
    name: profile?.name || 'User',
    email: profile?.email || '',
  };

  await supabase.from('settings').insert({
    user_id: userId,
    currency: defaultSettings.currency,
    timezone: defaultSettings.timezone,
    date_format: defaultSettings.dateFormat,
    language: defaultSettings.language,
    default_payment_method: defaultSettings.defaultPaymentMethod,
    default_category: defaultSettings.defaultCategory,
  });

  return defaultSettings;
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const userId = await getCurrentUserId();

  // Update settings table
  const settingsUpdate: any = {};
  if (patch.currency) settingsUpdate.currency = patch.currency;
  if (patch.timezone) settingsUpdate.timezone = patch.timezone;
  if (patch.dateFormat) settingsUpdate.date_format = patch.dateFormat;
  if (patch.language) settingsUpdate.language = patch.language;
  if (patch.defaultPaymentMethod) settingsUpdate.default_payment_method = patch.defaultPaymentMethod;
  if (patch.defaultCategory) settingsUpdate.default_category = patch.defaultCategory;

  if (Object.keys(settingsUpdate).length > 0) {
    const { error } = await supabase
      .from('settings')
      .update(settingsUpdate)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Update profile if name, email, or avatar changed
  if (patch.name || patch.email || patch.avatar !== undefined) {
    const profileUpdate: Record<string, unknown> = {};
    if (patch.name) profileUpdate.name = patch.name;
    if (patch.email) profileUpdate.email = patch.email;
    if (patch.avatar !== undefined) profileUpdate.avatar = patch.avatar ?? null;

    const { error } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', userId);

    if (error) throw error;
  }

  return await getSettings();
}

// ============================================
// PAYMENT METHODS
// ============================================

export async function getPaymentMethods(): Promise<string[]> {
  const userId = await getCurrentUserId();
  
  const { data, error } = await supabase
    .from('payment_methods')
    .select('name')
    .eq('user_id', userId);

  if (error) throw error;

  return (data || []).map(row => row.name);
}

export async function addPaymentMethod(name: string): Promise<void> {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from('payment_methods')
    .insert({
      user_id: userId,
      name: name,
    });

  if (error && error.code !== '23505') { // Ignore duplicate error
    throw error;
  }
}

// ============================================
// GET ALL APP DATA
// ============================================

export async function getAppData() {
  const [expenses, income, budgets, notifications, paymentMethods, settings] = await Promise.all([
    getExpenses(),
    getIncome(),
    getBudgets(),
    getNotifications(),
    getPaymentMethods(),
    getSettings(),
  ]);

  return {
    expenses,
    income,
    budgets,
    notifications,
    paymentMethods,
    settings,
  };
}
