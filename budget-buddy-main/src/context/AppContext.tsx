import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type Expense,
  type Income,
  type Budget,
  type AppNotification,
  type SavingsGoal,
  type SavingsContribution,
} from "@/lib/mock-data";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;

  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  notifications: AppNotification[];
  savingsGoals: SavingsGoal[];

  addExpense: (e: Expense) => Promise<Expense>;
  updateExpense: (e: Expense) => Promise<Expense>;
  deleteExpense: (id: string) => void;

  addIncome: (i: Income) => Promise<Income>;
  updateIncome: (i: Income) => Promise<Income>;
  deleteIncome: (id: string) => void;

  saveBudget: (b: Budget) => void;
  deleteBudget: (id: string) => void;

  addSavingsGoal: (g: Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SavingsGoal>;
  updateSavingsGoal: (g: SavingsGoal) => Promise<SavingsGoal>;
  deleteSavingsGoal: (id: string) => void;
  addSavingsContribution: (c: Omit<SavingsContribution, 'id' | 'createdAt'>) => Promise<SavingsContribution>;

  markNotificationsRead: () => void;
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
}

const AppContext = createContext<AppState | null>(null);

import {
  getAppData,
  addExpense as addExpenseDb,
  updateExpense as updateExpenseDb,
  deleteExpense as deleteExpenseDb,
  addIncome as addIncomeDb,
  updateIncome as updateIncomeDb,
  deleteIncome as deleteIncomeDb,
  saveBudget as saveBudgetDb,
  deleteBudget as deleteBudgetDb,
  updateSettings as updateSettingsDb,
  markNotificationsRead as markNotificationsReadDb,
  getSavingsGoals,
  addSavingsGoal as addSavingsGoalDb,
  updateSavingsGoal as updateSavingsGoalDb,
  deleteSavingsGoal as deleteSavingsGoalDb,
  addSavingsContribution as addSavingsContributionDb,
} from "@/lib/supabase-db";
import { type Settings } from "@/lib/mock-data";
import { getDueRecurringIncomes, getNextDate } from "@/lib/income-recurrence";
import { checkBudgetNotifications, checkSavingsNotifications, type BudgetStatus } from "@/lib/notification-engine";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

// Check if we're on a page that doesn't need data loaded
function isNoDataPage() {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return path === "/onboarding" || path === "/login";
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    timezone: "America/Los_Angeles",
    dateFormat: "MMM d, yyyy",
    language: "English",
    defaultCategory: "Food",
    name: "Alex Morgan",
    email: "alex@example.com",
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("ems-theme") as Theme | null;
    const initial =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("ems-theme", theme);
  }, [theme]);

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // ── Budget notification checker ───────────────────────────────────────────
  // Runs whenever expenses or budgets change (e.g. after adding an expense)
  useEffect(() => {
    if (!isAuthenticated || budgets.length === 0 || expenses.length === 0) return;

    // Get userId async but keep the rest sync
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      // Calculate spending per category for current month only
      const now = new Date();
      const spentByCat = new Map<string, number>();
      expenses
        .filter(e => {
          if (e.deleted) return false;
          const d = new Date(e.date);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })
        .forEach(e => spentByCat.set(e.category, (spentByCat.get(e.category) ?? 0) + e.amount));

      const statuses: BudgetStatus[] = budgets.map(b => {
        const spent = spentByCat.get(b.category) ?? 0;
        return { budget: b, spent, pct: b.limit > 0 ? (spent / b.limit) * 100 : 0 };
      });

      // Only check budgets at 80%+ — synchronous, fast
      const alertStatuses = statuses.filter(s => s.pct >= 80);
      if (alertStatuses.length === 0) return;

      const newNotifs = checkBudgetNotifications(alertStatuses, user.id);
      if (newNotifs.length > 0) {
        setNotifications(list => {
          const existingIds = new Set(list.map(n => n.title + '_' + n.message));
          const unique = newNotifs.filter(n => !existingIds.has(n.title + '_' + n.message));
          return unique.length > 0 ? [...unique, ...list] : list;
        });
      }
    });
  }, [expenses, budgets, isAuthenticated]);

  // ── Savings notification checker ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || savingsGoals.length === 0) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      const newNotifs = checkSavingsNotifications(savingsGoals, user.id);
      if (newNotifs.length > 0) {
        setNotifications(list => {
          const existingIds = new Set(list.map(n => n.title + '_' + n.message));
          const unique = newNotifs.filter(n => !existingIds.has(n.title + '_' + n.message));
          return unique.length > 0 ? [...unique, ...list] : list;
        });
      }
    });
  }, [savingsGoals, isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    getAppData()
      .then((data) => {
        setExpenses(data.expenses);
        setIncome(data.income);
        setBudgets(data.budgets);
        setNotifications(data.notifications);
        setSettings(data.settings);

        // Process any due recurring income entries
        const due = getDueRecurringIncomes(data.income);
        if (due.length > 0) {
          due.forEach(async (newEntry) => {
            try {
              // Find the parent recurring income to advance its nextDate
              const parent = data.income.find(
                (i: Income) => i.recurrence === newEntry.recurrence &&
                       i.source === newEntry.source &&
                       i.nextDate === newEntry.date
              );

              // Post the new income entry
              const saved = await addIncomeDb(newEntry);
              setIncome((list) => [saved, ...list]);

              // Advance the parent's nextDate so it doesn't fire again
              if (parent) {
                const updated = {
                  ...parent,
                  nextDate: getNextDate(newEntry.date, newEntry.recurrence),
                };
                await updateIncomeDb(updated);
                setIncome((list) =>
                  list.map((i) => (i.id === parent.id ? updated : i))
                );
              }
            } catch (err) {
              console.error('Failed to post recurring income:', err);
            }
          });
        }

        return getSavingsGoals();
      })
      .then((savingsData) => {
        setSavingsGoals(savingsData);
      })
      .catch((err) => {
        console.error("Failed to load app data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated, authLoading]);

  const value = useMemo<AppState>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      settings,
      updateSettings: (patch) => {
        const old = { ...settings };
        setSettings((s) => ({ ...s, ...patch }));
        updateSettingsDb(patch).catch(err => {
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
        const item = { ...e, id: tempId };
        setExpenses((list) => [item, ...list]);
        try {
          const res = await addExpenseDb(item);
          setExpenses((list) => list.map((x) => (x.id === tempId ? res : x)));
          return res;
        } catch (err) {
          console.error("Failed to add expense:", err);
          setExpenses((list) => list.filter((x) => x.id !== tempId));
          throw err;
        }
      },
      updateExpense: async (e) => {
        const old = expenses.find((x) => x.id === e.id);
        setExpenses((list) => list.map((x) => (x.id === e.id ? e : x)));
        try {
          await updateExpenseDb(e);
          return e;
        } catch (err) {
          console.error("Failed to update expense:", err);
          if (old) setExpenses((list) => list.map((x) => (x.id === e.id ? old : x)));
          throw err;
        }
      },
      deleteExpense: (id) => {
        setExpenses((list) => list.map((x) => (x.id === id ? { ...x, deleted: true } : x)));
        deleteExpenseDb(id).catch(err => {
          console.error("Failed to delete expense:", err);
        });
      },
      addIncome: async (i) => {
        const tempId = uid();
        const item = { ...i, id: tempId };
        setIncome((list) => [item, ...list]);
        try {
          const res = await addIncomeDb(item);
          setIncome((list) => list.map((x) => (x.id === tempId ? res : x)));
          return res;
        } catch (err) {
          console.error("Failed to add income:", err);
          setIncome((list) => list.filter((x) => x.id !== tempId));
          throw err;
        }
      },
      updateIncome: async (i) => {
        const old = income.find((x) => x.id === i.id);
        setIncome((list) => list.map((x) => (x.id === i.id ? i : x)));
        try {
          await updateIncomeDb(i);
          return i;
        } catch (err) {
          console.error("Failed to update income:", err);
          if (old) setIncome((list) => list.map((x) => (x.id === i.id ? old : x)));
          throw err;
        }
      },
      deleteIncome: (id) => {
        setIncome((list) => list.filter((x) => x.id !== id));
        deleteIncomeDb(id).catch(err => {
          console.error("Failed to delete income:", err);
        });
      },
      saveBudget: (b) => {
        const hasBudget = budgets.some((x) => x.id === b.id);
        if (hasBudget) {
          const old = budgets.find((x) => x.id === b.id);
          setBudgets((list) => list.map((x) => (x.id === b.id ? b : x)));
          saveBudgetDb(b).catch(err => {
            console.error("Failed to save budget:", err);
            if (old) setBudgets((list) => list.map((x) => (x.id === b.id ? old : x)));
          });
        } else {
          const tempId = uid();
          const item = { ...b, id: tempId };
          setBudgets((list) => [...list, item]);
          saveBudgetDb(item).then((res) => {
            setBudgets((list) => list.map((x) => (x.id === tempId ? res : x)));
          }).catch(err => {
            console.error("Failed to save budget:", err);
            setBudgets((list) => list.filter((x) => x.id !== tempId));
          });
        }
      },
      deleteBudget: (id) => {
        setBudgets((list) => list.filter((x) => x.id !== id));
        deleteBudgetDb(id).catch(err => {
          console.error("Failed to delete budget:", err);
        });
      },
      markNotificationsRead: () => {
        setNotifications((list) => list.map((n) => ({ ...n, read: true })));
        markNotificationsReadDb().catch(err => {
          console.error("Failed to mark notifications read:", err);
        });
      },
      addNotification: (title, message, type = "summary") => {
        const notif: AppNotification = {
          id: uid(),
          type,
          title,
          message,
          time: "just now",
          read: false,
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
            read: false,
          });
        })().catch((_err: unknown) => console.error("Failed to save notification:", _err));
      },
      savingsGoals,
      addSavingsGoal: async (g) => {
        const tempId = uid();
        const item = { ...g, id: tempId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        setSavingsGoals((list) => [item, ...list]);
        try {
          const res = await addSavingsGoalDb(g);
          setSavingsGoals((list) => list.map((x) => (x.id === tempId ? res : x)));
          return res;
        } catch (err) {
          console.error("Failed to add savings goal:", err);
          setSavingsGoals((list) => list.filter((x) => x.id !== tempId));
          throw err;
        }
      },
      updateSavingsGoal: async (g) => {
        const old = savingsGoals.find((x) => x.id === g.id);
        setSavingsGoals((list) => list.map((x) => (x.id === g.id ? g : x)));
        try {
          const res = await updateSavingsGoalDb(g);
          return res;
        } catch (err) {
          console.error("Failed to update savings goal:", err);
          if (old) setSavingsGoals((list) => list.map((x) => (x.id === g.id ? old : x)));
          throw err;
        }
      },
      deleteSavingsGoal: (id) => {
        setSavingsGoals((list) => list.filter((x) => x.id !== id));
        deleteSavingsGoalDb(id).catch(err => {
          console.error("Failed to delete savings goal:", err);
        });
      },
      addSavingsContribution: async (c) => {
        try {
          const res = await addSavingsContributionDb(c);
          // Update the goal's current amount
          const goal = savingsGoals.find((g) => g.id === c.goalId);
          if (goal) {
            const newAmount = c.type === 'deposit' ? goal.currentAmount + c.amount : goal.currentAmount - c.amount;
            const updatedGoal = { ...goal, currentAmount: newAmount, updatedAt: new Date().toISOString() };
            setSavingsGoals((list) => list.map((g) => (g.id === goal.id ? updatedGoal : g)));
            await updateSavingsGoalDb(updatedGoal);

            // When depositing to savings, create an expense entry to deduct from balance
            if (c.type === 'deposit') {
              const savingsExpense = {
                id: uid(),
                title: `Savings: ${goal.title}`,
                amount: c.amount,
                date: c.date,
                category: "Savings",
                status: "Paid" as const,
                recurrence: "None" as const,
                tags: ["savings"],
                deleted: false,
              };
              await addExpenseDb(savingsExpense);
              setExpenses((list) => [savingsExpense, ...list]);
            }
            // When withdrawing from savings, create an income entry to add to balance
            else if (c.type === 'withdrawal') {
              const savingsIncome = {
                id: uid(),
                source: `Savings: ${goal.title}`,
                amount: c.amount,
                date: c.date,
                category: "Savings",
                recurrence: "One-time" as const,
              };
              await addIncomeDb(savingsIncome);
              setIncome((list) => [savingsIncome, ...list]);
            }
          }
          return res;
        } catch (err) {
          console.error("Failed to add savings contribution:", err);
          throw err;
        }
      },
    }),
    [theme, settings, expenses, income, budgets, notifications, savingsGoals],
  );

  if (loading && !isNoDataPage()) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20 opacity-75"></div>
            <div className="h-12 w-12 animate-spin rounded-xl border-4 border-primary border-t-transparent"></div>
          </div>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">Expensia</h2>
          <p className="text-sm text-muted-foreground animate-pulse">Loading financial vault...</p>
        </div>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

/** Active (non-deleted) expenses helper. */
export function useActiveExpenses() {
  const { expenses } = useApp();
  return useMemo(() => expenses.filter((e) => !e.deleted), [expenses]);
}
