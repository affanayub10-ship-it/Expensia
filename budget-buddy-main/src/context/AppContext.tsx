import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  MOCK_EXPENSES,
  MOCK_INCOME,
  MOCK_BUDGETS,
  MOCK_NOTIFICATIONS,
  PAYMENT_METHODS,
  type Expense,
  type Income,
  type Budget,
  type AppNotification,
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
  paymentMethods: string[];

  addExpense: (e: Expense) => void;
  updateExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;

  addIncome: (i: Income) => void;
  updateIncome: (i: Income) => void;
  deleteIncome: (id: string) => void;

  saveBudget: (b: Budget) => void;
  deleteBudget: (id: string) => void;

  addPaymentMethod: (name: string) => void;
  markNotificationsRead: () => void;
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
  addPaymentMethod as addPaymentMethodDb,
  updateSettings as updateSettingsDb,
  markNotificationsRead as markNotificationsReadDb,
} from "@/lib/supabase-db";
import { type Settings } from "@/lib/mock-data";
import { getDueRecurringIncomes, getNextDate } from "@/lib/income-recurrence";
import { useAuth } from "@/context/AuthContext";

const uid = () => Math.random().toString(36).slice(2, 10);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    currency: "USD",
    timezone: "America/Los_Angeles",
    dateFormat: "MMM d, yyyy",
    language: "English",
    defaultPaymentMethod: "Debit Card",
    defaultCategory: "Food",
    name: "Alex Morgan",
    email: "alex@example.com",
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

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
        setPaymentMethods(data.paymentMethods);
        setSettings(data.settings);

        // Process any due recurring income entries
        const due = getDueRecurringIncomes(data.income);
        if (due.length > 0) {
          due.forEach(async (newEntry) => {
            try {
              // Find the parent recurring income to advance its nextDate
              const parent = data.income.find(
                (i) => i.recurrence === newEntry.recurrence &&
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
      paymentMethods,
      addExpense: (e) => {
        const tempId = uid();
        const item = { ...e, id: tempId };
        setExpenses((list) => [item, ...list]);
        addExpenseDb(item).then((res) => {
          setExpenses((list) => list.map((x) => (x.id === tempId ? res : x)));
        }).catch(err => {
          console.error("Failed to add expense:", err);
          setExpenses((list) => list.filter((x) => x.id !== tempId));
        });
      },
      updateExpense: (e) => {
        const old = expenses.find((x) => x.id === e.id);
        setExpenses((list) => list.map((x) => (x.id === e.id ? e : x)));
        updateExpenseDb(e).catch(err => {
          console.error("Failed to update expense:", err);
          if (old) setExpenses((list) => list.map((x) => (x.id === e.id ? old : x)));
        });
      },
      deleteExpense: (id) => {
        setExpenses((list) => list.map((x) => (x.id === id ? { ...x, deleted: true } : x)));
        deleteExpenseDb(id).catch(err => {
          console.error("Failed to delete expense:", err);
        });
      },
      addIncome: (i) => {
        const tempId = uid();
        const item = { ...i, id: tempId };
        setIncome((list) => [item, ...list]);
        addIncomeDb(item).then((res) => {
          setIncome((list) => list.map((x) => (x.id === tempId ? res : x)));
        }).catch(err => {
          console.error("Failed to add income:", err);
          setIncome((list) => list.filter((x) => x.id !== tempId));
        });
      },
      updateIncome: (i) => {
        const old = income.find((x) => x.id === i.id);
        setIncome((list) => list.map((x) => (x.id === i.id ? i : x)));
        updateIncomeDb(i).catch(err => {
          console.error("Failed to update income:", err);
          if (old) setIncome((list) => list.map((x) => (x.id === i.id ? old : x)));
        });
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
      addPaymentMethod: (name) => {
        setPaymentMethods((list) => (list.includes(name) ? list : [...list, name]));
        addPaymentMethodDb(name).catch(err => {
          console.error("Failed to add payment method:", err);
        });
      },
      markNotificationsRead: () => {
        setNotifications((list) => list.map((n) => ({ ...n, read: true })));
        markNotificationsReadDb().catch(err => {
          console.error("Failed to mark notifications read:", err);
        });
      },
    }),
    [theme, settings, expenses, income, budgets, notifications, paymentMethods],
  );

  if (loading) {
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
