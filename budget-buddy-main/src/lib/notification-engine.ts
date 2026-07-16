/**
 * Notification Engine — simplified, reliable version.
 * Uses only sessionStorage for dedup (no async DB checks blocking the flow).
 * Notifications are stored in Supabase AND shown in the bell.
 */
import { supabase } from './supabase';
import type { Budget, SavingsGoal, AppNotification } from './mock-data';
import { formatMoney } from './format';

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  pct: number;
}

// ── Session-level dedup ────────────────────────────────────────────────────────
// Key format includes month so warnings reset each month automatically.

function sessionKey(base: string): string {
  const now = new Date();
  return `${base}_${now.getFullYear()}_${now.getMonth()}`;
}

function seen(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === '1';
  } catch { return false; }
}

function markSeen(key: string): void {
  try { sessionStorage.setItem(key, '1'); } catch {}
}

// ── Fire & forget notification insert ─────────────────────────────────────────

async function saveToDb(
  userId: string,
  type: AppNotification['type'],
  title: string,
  message: string,
): Promise<void> {
  await supabase
    .from('notifications')
    .insert({ user_id: userId, type, title, message, read: false });
  // Intentionally not throwing — DB save is best-effort
}

// ── Budget notifications ───────────────────────────────────────────────────────

export function checkBudgetNotifications(
  statuses: BudgetStatus[],
  userId: string,
): AppNotification[] {
  const newNotifs: AppNotification[] = [];

  for (const { budget, spent, pct } of statuses) {
    if (pct < 80) continue; // skip budgets under 80%

    const makeNotif = (title: string, message: string, type: AppNotification['type'] = 'budget'): AppNotification => ({
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type,
      title,
      message,
      time: 'just now',
      read: false,
    });

    if (pct >= 100) {
      const key = sessionKey(`budget_exceeded_${budget.id}`);
      if (!seen(key)) {
        const over = spent - budget.limit;
        const title = '🚨 Budget Exceeded';
        const message = `Your ${budget.category} budget is exceeded by ${formatMoney(over)} (${formatMoney(spent)} of ${formatMoney(budget.limit)}).`;
        const n = makeNotif(title, message);
        newNotifs.push(n);
        markSeen(key);
        saveToDb(userId, 'budget', title, message);
      }
    } else if (pct >= 80) {
      const key = sessionKey(`budget_warning_${budget.id}`);
      if (!seen(key)) {
        const title = '⚠️ Budget Warning';
        const message = `You've used ${Math.round(pct)}% of your ${budget.category} budget (${formatMoney(spent)} of ${formatMoney(budget.limit)}).`;
        const n = makeNotif(title, message);
        newNotifs.push(n);
        markSeen(key);
        saveToDb(userId, 'budget', title, message);
      }
    }
  }

  return newNotifs;
}

// ── Savings notifications ──────────────────────────────────────────────────────

export function checkSavingsNotifications(
  goals: SavingsGoal[],
  userId: string,
): AppNotification[] {
  const newNotifs: AppNotification[] = [];

  for (const goal of goals) {
    if (!goal.targetAmount || goal.targetAmount <= 0 || goal.currentAmount <= 0) continue;
    const pct = (goal.currentAmount / goal.targetAmount) * 100;

    const makeNotif = (title: string, message: string): AppNotification => ({
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type: 'summary',
      title,
      message,
      time: 'just now',
      read: false,
    });

    // Find the highest applicable milestone
    if (pct >= 100) {
      const key = `savings_100_${goal.id}`;
      if (!seen(key)) {
        const title = '🎉 Goal Reached!';
        const message = `Congratulations! You've reached your "${goal.title}" savings goal of ${formatMoney(goal.targetAmount)}!`;
        newNotifs.push(makeNotif(title, message));
        markSeen(key);
        saveToDb(userId, 'summary', title, message);
      }
    } else if (pct >= 75) {
      const key = `savings_75_${goal.id}`;
      if (!seen(key)) {
        const left = goal.targetAmount - goal.currentAmount;
        const title = '🔥 Almost There!';
        const message = `You're 75% toward your "${goal.title}" goal! Just ${formatMoney(left)} left to save.`;
        newNotifs.push(makeNotif(title, message));
        markSeen(key);
        saveToDb(userId, 'summary', title, message);
      }
    } else if (pct >= 50) {
      const key = `savings_50_${goal.id}`;
      if (!seen(key)) {
        const left = goal.targetAmount - goal.currentAmount;
        const title = '🎯 Halfway There!';
        const message = `You've saved 50% toward "${goal.title}"! ${formatMoney(goal.currentAmount)} saved, ${formatMoney(left)} to go.`;
        newNotifs.push(makeNotif(title, message));
        markSeen(key);
        saveToDb(userId, 'summary', title, message);
      }
    } else if (pct >= 25) {
      const key = `savings_25_${goal.id}`;
      if (!seen(key)) {
        const title = '� Savings Milestone';
        const message = `You're 25% of the way to your "${goal.title}" goal! Saved ${formatMoney(goal.currentAmount)} of ${formatMoney(goal.targetAmount)}.`;
        newNotifs.push(makeNotif(title, message));
        markSeen(key);
        saveToDb(userId, 'summary', title, message);
      }
    }

    // Inactive 7+ days
    if (goal.currentAmount === 0 && goal.createdAt) {
      const days = Math.floor((Date.now() - new Date(goal.createdAt).getTime()) / 86400000);
      if (days >= 7) {
        const key = `savings_inactive_${goal.id}`;
        if (!seen(key)) {
          const title = '💤 Savings Goal Inactive';
          const message = `Your "${goal.title}" goal has no contributions yet. Start saving today!`;
          newNotifs.push({ id: `local_${Date.now()}`, type: 'bill', title, message, time: 'just now', read: false });
          markSeen(key);
          saveToDb(userId, 'bill', title, message);
        }
      }
    }
  }

  return newNotifs;
}
