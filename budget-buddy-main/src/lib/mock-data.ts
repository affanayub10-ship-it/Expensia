import {
  Utensils,
  Fuel,
  Home,
  ShoppingBag,
  Clapperboard,
  HeartPulse,
  GraduationCap,
  ReceiptText,
  Plane,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Building2,
  RotateCcw,
  Gift,
  type LucideIcon,
} from "lucide-react";

export type Status = "Paid" | "Pending" | "Cancelled";
export type Recurrence = "None" | "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly";
export type IncomeRecurrence = "One-time" | "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  date: string;
  category: string;
  location?: string;
  tags: string[];
  notes?: string;
  status: Status;
  recurrence: Recurrence;
  receipt?: string;
  deleted?: boolean;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  nextDate?: string;
  recurrence: IncomeRecurrence;
  category: string;
  notes?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: string;
  note?: string;
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  subscription_id: string;
  stripe_payment_intent: string;
  invoice_id: string;
  receipt_url: string;
  invoice_url: string;
  amount: number;
  currency: string;
  payment_status: string;
  payment_date: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  type: "budget" | "recurring" | "bill" | "summary";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", name: "Food", icon: Utensils, color: "chart-4" },
  { id: "fuel", name: "Fuel", icon: Fuel, color: "chart-3" },
  { id: "rent", name: "Rent", icon: Home, color: "chart-6" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, color: "chart-5" },
  { id: "entertainment", name: "Entertainment", icon: Clapperboard, color: "chart-1" },
  { id: "healthcare", name: "Healthcare", icon: HeartPulse, color: "chart-2" },
  { id: "education", name: "Education", icon: GraduationCap, color: "chart-6" },
  { id: "bills", name: "Bills", icon: ReceiptText, color: "chart-3" },
  { id: "travel", name: "Travel", icon: Plane, color: "chart-1" },
  { id: "furniture", name: "Furniture", icon: Home, color: "chart-4" },
  { id: "other", name: "Other", icon: MoreHorizontal, color: "chart-5" },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: "salary", name: "Salary", icon: Briefcase, color: "chart-2" },
  { id: "freelance", name: "Freelance", icon: Laptop, color: "chart-1" },
  { id: "investment", name: "Investment", icon: TrendingUp, color: "chart-6" },
  { id: "business", name: "Business", icon: Building2, color: "chart-3" },
  { id: "refund", name: "Refund", icon: RotateCcw, color: "chart-5" },
  { id: "bonus", name: "Bonus", icon: Gift, color: "chart-4" },
  { id: "other", name: "Other", icon: MoreHorizontal, color: "chart-5" },
];

export function categoryByName(name: string, list: Category[]): Category {
  return list.find((c) => c.name === name) ?? list[list.length - 1];
}

const today = new Date();
function daysAgo(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const MOCK_EXPENSES: Expense[] = [
  { id: "e1", title: "Grocery run", amount: 84.2, date: daysAgo(0), category: "Food", location: "Downtown", tags: ["groceries"], status: "Paid", recurrence: "None" },
  { id: "e2", title: "Gas fill-up", amount: 52.6, date: daysAgo(1), category: "Fuel", tags: [], status: "Paid", recurrence: "Weekly" },
  { id: "e3", title: "Netflix subscription", amount: 15.49, date: daysAgo(2), category: "Entertainment", tags: ["streaming"], status: "Paid", recurrence: "Monthly" },
  { id: "e4", title: "New sneakers", amount: 129.99, date: daysAgo(3), category: "Shopping", tags: ["clothing"], status: "Paid", recurrence: "None" },
  { id: "e5", title: "Electricity bill", amount: 96.3, date: daysAgo(4), category: "Bills", tags: ["utilities"], status: "Pending", recurrence: "Monthly" },
  { id: "e6", title: "Dinner out", amount: 62.0, date: daysAgo(5), category: "Food", tags: [], status: "Paid", recurrence: "None" },
  { id: "e7", title: "Pharmacy", amount: 24.75, date: daysAgo(6), category: "Healthcare", tags: [], status: "Paid", recurrence: "None" },
  { id: "e8", title: "Monthly rent", amount: 1450, date: daysAgo(8), category: "Rent", tags: ["housing"], status: "Paid", recurrence: "Monthly" },
  { id: "e9", title: "Online course", amount: 39.99, date: daysAgo(10), category: "Education", tags: ["learning"], status: "Paid", recurrence: "None" },
  { id: "e10", title: "Flight to NYC", amount: 320, date: daysAgo(12), category: "Travel", tags: ["trip"], status: "Paid", recurrence: "None" },
  { id: "e11", title: "Coffee", amount: 5.75, date: daysAgo(13), category: "Food", tags: [], status: "Paid", recurrence: "Daily" },
  { id: "e12", title: "Gym membership", amount: 45, date: daysAgo(15), category: "Healthcare", tags: ["fitness"], status: "Paid", recurrence: "Monthly" },
  { id: "e13", title: "Amazon order", amount: 78.4, date: daysAgo(18), category: "Shopping", tags: [], status: "Paid", recurrence: "None" },
  { id: "e14", title: "Water bill", amount: 34.1, date: daysAgo(20), category: "Bills", tags: ["utilities"], status: "Paid", recurrence: "Monthly" },
  { id: "e15", title: "Movie night", amount: 28.5, date: daysAgo(22), category: "Entertainment", tags: [], status: "Paid", recurrence: "None" },
];

export const PAYMENT_METHODS = [
  "Cash",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Mobile Wallet",
  "UPI",
  "JazzCash",
  "EasyPaisa",
  "bKash",
  "Google Pay",
  "Apple Pay",
  "PayPal",
  "Cheque",
  "Net Banking",
  "Cryptocurrency",
  "Prepaid Card",
  "Gift Card",
  "Other",
];

export const MOCK_INCOME: Income[] = [
  { id: "i1", source: "Monthly salary", amount: 4200, date: daysAgo(2), category: "Salary", notes: "ACME Corp", recurrence: "Monthly" },
  { id: "i2", source: "Website project", amount: 850, date: daysAgo(6), category: "Freelance", recurrence: "One-time" },
  { id: "i3", source: "Dividends", amount: 120, date: daysAgo(9), category: "Investment", recurrence: "Monthly" },
  { id: "i4", source: "Store refund", amount: 45, date: daysAgo(12), category: "Refund", recurrence: "One-time" },
  { id: "i5", source: "Q2 bonus", amount: 600, date: daysAgo(20), category: "Bonus", recurrence: "One-time" },
];

export const MOCK_BUDGETS: Budget[] = [
  { id: "b1", category: "Food", limit: 600 },
  { id: "b2", category: "Fuel", limit: 300 },
  { id: "b3", category: "Entertainment", limit: 250 },
  { id: "b4", category: "Shopping", limit: 400 },
  { id: "b5", category: "Bills", limit: 350 },
  { id: "b6", category: "Rent", limit: 1500 },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: "n1", type: "budget", title: "Budget warning", message: "You've used 85% of your Food budget.", time: "2h ago", read: false },
  { id: "n2", type: "recurring", title: "Recurring payment", message: "Netflix subscription charged $15.49.", time: "1d ago", read: false },
  { id: "n3", type: "bill", title: "Upcoming bill", message: "Electricity bill of $96.30 is due in 3 days.", time: "1d ago", read: false },
  { id: "n4", type: "summary", title: "Weekly summary", message: "You spent $312 this week across 8 transactions.", time: "3d ago", read: true },
];

export interface Settings {
  timezone: string;
  dateFormat: string;
  language: string;
  defaultCategory: string;
  name: string;
  email: string;
  avatar?: string;
}

export const DEFAULT_SETTINGS: Settings = {
  timezone: "America/Los_Angeles",
  dateFormat: "MMM d, yyyy",
  language: "English",
  defaultCategory: "Food",
  name: "Alex Morgan",
  email: "alex@example.com",
};
