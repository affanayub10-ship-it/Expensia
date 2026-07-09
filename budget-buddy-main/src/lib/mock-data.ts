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

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string; // chart token key, e.g. "chart-1"
}

export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  merchant?: string;
  location?: string;
  currency: string;
  tags: string[];
  notes?: string;
  status: Status;
  recurrence: Recurrence;
  receipt?: string;
  deleted?: boolean;
}

export type IncomeRecurrence = "One-time" | "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;          // start date / last occurrence date
  nextDate?: string;     // next scheduled occurrence
  recurrence: IncomeRecurrence;
  category: string;
  notes?: string;
  currency: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
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

export const PAYMENT_METHODS = [
  "Cash",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Mobile Wallet",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "UPI",
  "Cryptocurrency",
  "Gift Card",
  "Check",
  "Money Order",
  "Venmo",
  "Zelle",
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
  {
    id: "e1",
    title: "Grocery run",
    amount: 84.2,
    date: daysAgo(0),
    category: "Food",
    paymentMethod: "Debit Card",
    merchant: "Whole Foods",
    location: "Downtown",
    currency: "USD",
    tags: ["groceries"],
    status: "Paid",
    recurrence: "None",
  },
  {
    id: "e2",
    title: "Gas fill-up",
    amount: 52.6,
    date: daysAgo(1),
    category: "Fuel",
    paymentMethod: "Credit Card",
    merchant: "Shell",
    currency: "USD",
    tags: [],
    status: "Paid",
    recurrence: "Weekly",
  },
  {
    id: "e3",
    title: "Netflix subscription",
    amount: 15.49,
    date: daysAgo(2),
    category: "Entertainment",
    paymentMethod: "Credit Card",
    merchant: "Netflix",
    currency: "USD",
    tags: ["streaming"],
    status: "Paid",
    recurrence: "Monthly",
  },
  {
    id: "e4",
    title: "New sneakers",
    amount: 129.99,
    date: daysAgo(3),
    category: "Shopping",
    paymentMethod: "Credit Card",
    merchant: "Nike",
    currency: "USD",
    tags: ["clothing"],
    status: "Paid",
    recurrence: "None",
  },
  {
    id: "e5",
    title: "Electricity bill",
    amount: 96.3,
    date: daysAgo(4),
    category: "Bills",
    paymentMethod: "Bank Transfer",
    merchant: "PG&E",
    currency: "USD",
    tags: ["utilities"],
    status: "Pending",
    recurrence: "Monthly",
  },
  {
    id: "e6",
    title: "Dinner out",
    amount: 62.0,
    date: daysAgo(5),
    category: "Food",
    paymentMethod: "Mobile Wallet",
    merchant: "Olive Garden",
    currency: "USD",
    tags: [],
    status: "Paid",
    recurrence: "None",
  },
  {
    id: "e7",
    title: "Pharmacy",
    amount: 24.75,
    date: daysAgo(6),
    category: "Healthcare",
    paymentMethod: "Cash",
    merchant: "CVS",
    currency: "USD",
    tags: [],
    status: "Paid",
    recurrence: "None",
  },
  {
    id: "e8",
    title: "Monthly rent",
    amount: 1450,
    date: daysAgo(8),
    category: "Rent",
    paymentMethod: "Bank Transfer",
    merchant: "Landlord",
    currency: "USD",
    tags: ["housing"],
    status: "Paid",
    recurrence: "Monthly",
  },
  {
    id: "e9",
    title: "Online course",
    amount: 39.99,
    date: daysAgo(10),
    category: "Education",
    paymentMethod: "Credit Card",
    merchant: "Udemy",
    currency: "USD",
    tags: ["learning"],
    status: "Paid",
    recurrence: "None",
  },
  {
    id: "e10",
    title: "Flight to NYC",
    amount: 320,
    date: daysAgo(12),
    category: "Travel",
    paymentMethod: "Credit Card",
    merchant: "Delta",
    currency: "USD",
    tags: ["trip"],
    status: "Paid",
    recurrence: "None",
  },
  {
    id: "e11",
    title: "Coffee",
    amount: 5.75,
    date: daysAgo(13),
    category: "Food",
    paymentMethod: "Cash",
    merchant: "Starbucks",
    currency: "USD",
    tags: [],
    status: "Paid",
    recurrence: "Daily",
  },
  {
    id: "e12",
    title: "Gym membership",
    amount: 45,
    date: daysAgo(15),
    category: "Healthcare",
    paymentMethod: "Credit Card",
    merchant: "Equinox",
    currency: "USD",
    tags: ["fitness"],
    status: "Paid",
    recurrence: "Monthly",
  },
  {
    id: "e13",
    title: "Amazon order",
    amount: 78.4,
    date: daysAgo(18),
    category: "Shopping",
    paymentMethod: "Credit Card",
    merchant: "Amazon",
    currency: "USD",
    tags: [],
    status: "Paid",
    recurrence: "None",
  },
  {
    id: "e14",
    title: "Water bill",
    amount: 34.1,
    date: daysAgo(20),
    category: "Bills",
    paymentMethod: "Bank Transfer",
    merchant: "City Water",
    currency: "USD",
    tags: ["utilities"],
    status: "Paid",
    recurrence: "Monthly",
  },
  {
    id: "e15",
    title: "Movie night",
    amount: 28.5,
    date: daysAgo(22),
    category: "Entertainment",
    paymentMethod: "Debit Card",
    merchant: "AMC",
    currency: "USD",
    tags: [],
    status: "Paid",
    recurrence: "None",
  },
];

export const MOCK_INCOME: Income[] = [
  {
    id: "i1",
    source: "Monthly salary",
    amount: 4200,
    date: daysAgo(2),
    category: "Salary",
    currency: "USD",
    notes: "ACME Corp",
    recurrence: "Monthly",
  },
  {
    id: "i2",
    source: "Website project",
    amount: 850,
    date: daysAgo(6),
    category: "Freelance",
    currency: "USD",
    recurrence: "One-time",
  },
  {
    id: "i3",
    source: "Dividends",
    amount: 120,
    date: daysAgo(9),
    category: "Investment",
    currency: "USD",
    recurrence: "Monthly",
  },
  {
    id: "i4",
    source: "Store refund",
    amount: 45,
    date: daysAgo(12),
    category: "Refund",
    currency: "USD",
    recurrence: "One-time",
  },
  {
    id: "i5",
    source: "Q2 bonus",
    amount: 600,
    date: daysAgo(20),
    category: "Bonus",
    currency: "USD",
    recurrence: "One-time",
  },
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
  {
    id: "n1",
    type: "budget",
    title: "Budget warning",
    message: "You've used 85% of your Food budget.",
    time: "2h ago",
    read: false,
  },
  {
    id: "n2",
    type: "recurring",
    title: "Recurring payment",
    message: "Netflix subscription charged $15.49.",
    time: "1d ago",
    read: false,
  },
  {
    id: "n3",
    type: "bill",
    title: "Upcoming bill",
    message: "Electricity bill of $96.30 is due in 3 days.",
    time: "1d ago",
    read: false,
  },
  {
    id: "n4",
    type: "summary",
    title: "Weekly summary",
    message: "You spent $312 this week across 8 transactions.",
    time: "3d ago",
    read: true,
  },
];

export const MONTHLY_SERIES = [
  { month: "Jan", income: 4600, expenses: 3100 },
  { month: "Feb", income: 4800, expenses: 3400 },
  { month: "Mar", income: 5200, expenses: 2900 },
  { month: "Apr", income: 4900, expenses: 3600 },
  { month: "May", income: 5100, expenses: 3200 },
  { month: "Jun", income: 5815, expenses: 2853 },
];

export interface Settings {
  currency: string;
  timezone: string;
  dateFormat: string;
  language: string;
  defaultPaymentMethod: string;
  defaultCategory: string;
  name: string;
  email: string;
  avatar?: string;
}

export const DEFAULT_SETTINGS: Settings = {
  currency: "USD",
  timezone: "America/Los_Angeles",
  dateFormat: "MMM d, yyyy",
  language: "English",
  defaultPaymentMethod: "Debit Card",
  defaultCategory: "Food",
  name: "Alex Morgan",
  email: "alex@example.com",
};
