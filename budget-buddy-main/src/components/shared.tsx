import { type ReactNode } from "react";
import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  categoryByName,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Status,
} from "@/lib/mock-data";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "primary" | "income" | "expense" | "warning";
  trend?: { value: string; positive: boolean };
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    income: "bg-income/10 text-income",
    expense: "bg-expense/10 text-expense",
    warning: "bg-warning/15 text-warning",
  } as const;
  return (
    <Card className="shadow-soft">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div
            className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accentMap[accent])}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
        {trend && (
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              trend.positive ? "text-income" : "text-expense",
            )}
          >
            {trend.positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function CategoryPill({
  name,
  type = "expense",
}: {
  name: string;
  type?: "expense" | "income";
}) {
  const cat = categoryByName(name, type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES);
  const Icon = cat.icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-md"
        style={{ backgroundColor: `var(--color-${cat.color})`, opacity: 0.95 }}
      >
        <Icon className="h-3.5 w-3.5 text-white" />
      </span>
      {name}
    </span>
  );
}

export function CategoryIcon({
  name,
  type = "expense",
  className,
}: {
  name: string;
  type?: "expense" | "income";
  className?: string;
}) {
  const cat = categoryByName(name, type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES);
  const Icon = cat.icon;
  return (
    <span
      className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", className)}
      style={{ backgroundColor: `var(--color-${cat.color})` }}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    Paid: "bg-income/12 text-income border-transparent",
    Pending: "bg-warning/15 text-warning border-transparent",
    Cancelled: "bg-muted text-muted-foreground border-transparent",
  };
  return <Badge className={map[status]}>{status}</Badge>;
}
