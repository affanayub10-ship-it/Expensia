"use server";

import { createServerFn } from "@tanstack/react-start";
import * as fs from "fs/promises";
import * as path from "path";
import {
  MOCK_EXPENSES,
  MOCK_INCOME,
  MOCK_BUDGETS,
  MOCK_NOTIFICATIONS,
  PAYMENT_METHODS,
  DEFAULT_SETTINGS,
  type Expense,
  type Income,
  type Budget,
  type AppNotification,
  type Settings,
} from "./mock-data";

export interface AppData {
  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  notifications: AppNotification[];
  paymentMethods: string[];
  settings: Settings;
}

const dbPath = path.resolve(process.cwd(), "data", "db.json");

// Mutex to avoid concurrent write corruption
class Mutex {
  private promise: Promise<void> = Promise.resolve();

  async acquire(): Promise<() => void> {
    let release: () => void = () => {};
    const nextPromise = new Promise<void>((resolve) => {
      release = resolve;
    });
    const currentPromise = this.promise;
    this.promise = nextPromise;
    await currentPromise;
    return release;
  }
}

const dbMutex = new Mutex();

async function readDb(): Promise<AppData> {
  try {
    const content = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(content) as AppData;
  } catch (err) {
    // If doesn't exist, create it with default mock data
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      const defaultData: AppData = {
        expenses: MOCK_EXPENSES,
        income: MOCK_INCOME,
        budgets: MOCK_BUDGETS,
        notifications: MOCK_NOTIFICATIONS,
        paymentMethods: PAYMENT_METHODS,
        settings: DEFAULT_SETTINGS,
      };
      await writeDb(defaultData);
      return defaultData;
    }
    throw err;
  }
}

async function writeDb(data: AppData): Promise<void> {
  const dir = path.dirname(dbPath);
  await fs.mkdir(dir, { recursive: true });
  // Write to temporary file first then rename atomically
  const tempPath = `${dbPath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tempPath, dbPath);
}

// Server functions exported for front-end consumption

export const getAppDataServer = createServerFn({ method: "GET" }).handler(async () => {
  const release = await dbMutex.acquire();
  try {
    return await readDb();
  } finally {
    release();
  }
});

export const addExpenseServer = createServerFn({ method: "POST" })
  .validator((d: Expense) => d)
  .handler(async ({ data: newExpense }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      const expenseWithId = {
        ...newExpense,
        id: newExpense.id || Math.random().toString(36).slice(2, 10),
      };
      db.expenses = [expenseWithId, ...db.expenses];
      await writeDb(db);
      return expenseWithId;
    } finally {
      release();
    }
  });

export const updateExpenseServer = createServerFn({ method: "POST" })
  .validator((d: Expense) => d)
  .handler(async ({ data: updatedExpense }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      db.expenses = db.expenses.map((x) => (x.id === updatedExpense.id ? updatedExpense : x));
      await writeDb(db);
      return updatedExpense;
    } finally {
      release();
    }
  });

export const deleteExpenseServer = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      db.expenses = db.expenses.map((x) => (x.id === id ? { ...x, deleted: true } : x));
      await writeDb(db);
      return id;
    } finally {
      release();
    }
  });

export const addIncomeServer = createServerFn({ method: "POST" })
  .validator((d: Income) => d)
  .handler(async ({ data: newIncome }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      const incomeWithId = {
        ...newIncome,
        id: newIncome.id || Math.random().toString(36).slice(2, 10),
      };
      db.income = [incomeWithId, ...db.income];
      await writeDb(db);
      return incomeWithId;
    } finally {
      release();
    }
  });

export const updateIncomeServer = createServerFn({ method: "POST" })
  .validator((d: Income) => d)
  .handler(async ({ data: updatedIncome }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      db.income = db.income.map((x) => (x.id === updatedIncome.id ? updatedIncome : x));
      await writeDb(db);
      return updatedIncome;
    } finally {
      release();
    }
  });

export const deleteIncomeServer = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      db.income = db.income.filter((x) => x.id !== id);
      await writeDb(db);
      return id;
    } finally {
      release();
    }
  });

export const saveBudgetServer = createServerFn({ method: "POST" })
  .validator((d: Budget) => d)
  .handler(async ({ data: budget }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      const hasBudget = db.budgets.some((x) => x.id === budget.id);
      let savedBudget = budget;
      if (hasBudget) {
        db.budgets = db.budgets.map((x) => (x.id === budget.id ? budget : x));
      } else {
        savedBudget = { ...budget, id: budget.id || Math.random().toString(36).slice(2, 10) };
        db.budgets = [...db.budgets, savedBudget];
      }
      await writeDb(db);
      return savedBudget;
    } finally {
      release();
    }
  });

export const deleteBudgetServer = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      db.budgets = db.budgets.filter((x) => x.id !== id);
      await writeDb(db);
      return id;
    } finally {
      release();
    }
  });

export const addPaymentMethodServer = createServerFn({ method: "POST" })
  .validator((name: string) => name)
  .handler(async ({ data: name }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      if (!db.paymentMethods.includes(name)) {
        db.paymentMethods = [...db.paymentMethods, name];
        await writeDb(db);
      }
      return name;
    } finally {
      release();
    }
  });

export const updateSettingsServer = createServerFn({ method: "POST" })
  .validator((settings: Partial<Settings>) => settings)
  .handler(async ({ data: patch }) => {
    const release = await dbMutex.acquire();
    try {
      const db = await readDb();
      db.settings = { ...db.settings, ...patch };
      await writeDb(db);
      return db.settings;
    } finally {
      release();
    }
  });

export const markNotificationsReadServer = createServerFn({ method: "POST" }).handler(async () => {
  const release = await dbMutex.acquire();
  try {
    const db = await readDb();
    db.notifications = db.notifications.map((n) => ({ ...n, read: true }));
    await writeDb(db);
    return db.notifications;
  } finally {
    release();
  }
});
