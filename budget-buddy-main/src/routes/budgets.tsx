import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, AlertTriangle, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, StatCard, CategoryPill } from "@/components/shared";
import { useApp, useActiveExpenses } from "@/context/AppContext";
import { formatCurrency, formatPercent, formatMoney, convertAmount } from "@/lib/format";
import { EXPENSE_CATEGORIES, type Budget } from "@/lib/mock-data";
import { Wallet as WalletIcon, PiggyBank, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/budgets")({
  component: Budgets,
});

function barColor(pct: number) {
  if (pct >= 90) return "bg-expense";
  if (pct >= 80) return "bg-warning";
  return "bg-income";
}

function Budgets() {
  const { budgets, saveBudget, deleteBudget, settings } = useApp();
  const expenses = useActiveExpenses();
  const cur = settings.currency;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");

  const spentByCat = useMemo(() => {
    const m = new Map<string, number>();
    expenses.forEach((e) => {
      // Convert each expense to the user's display currency before summing
      const converted = convertAmount(e.amount, cur, e.currency);
      m.set(e.category, (m.get(e.category) ?? 0) + converted);
    });
    return m;
  }, [expenses, cur]);

  const rows = budgets.map((b) => {
    const spent = spentByCat.get(b.category) ?? 0;
    const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
    return { ...b, spent, pct };
  });

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  const alerts = rows.filter((r) => r.pct >= 80);

  const openAdd = () => {
    setEditing(null);
    setCategory("Food");
    setLimit("");
    setOpen(true);
  };
  const openEdit = (b: Budget) => {
    setEditing(b);
    setCategory(b.category);
    setLimit(String(b.limit));
    setOpen(true);
  };
  const submit = () => {
    const num = parseFloat(limit);
    if (!num || num <= 0) return toast.error("Enter a valid monthly limit");
    saveBudget({ id: editing?.id ?? "", category, limit: num });
    toast.success(editing ? "Budget updated" : "Budget created");
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Set monthly limits and track spending by category."
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> New budget
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Monthly Budget"
          value={formatMoney(totalLimit, cur)}
          icon={WalletIcon}
          accent="primary"
        />
        <StatCard
          label="Total Spent"
          value={formatMoney(totalSpent, cur)}
          icon={TrendingDown}
          accent="expense"
        />
        <StatCard
          label="Remaining"
          value={formatMoney(totalLimit - totalSpent, cur)}
          icon={PiggyBank}
          accent={totalLimit - totalSpent < 0 ? "expense" : "income"}
        />
      </div>

      {alerts.length > 0 && (
        <div className="mb-6 space-y-3">
          {alerts.map((r) => {
            const exceeded = r.pct >= 100;
            return (
              <Alert
                key={r.id}
                className={cn(
                  exceeded ? "border-expense/40 bg-expense/10" : "border-warning/40 bg-warning/10",
                )}
              >
                {exceeded ? (
                  <TriangleAlert className="h-4 w-4 text-expense" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
                <AlertTitle>{exceeded ? "Budget exceeded" : "Approaching budget limit"}</AlertTitle>
                <AlertDescription>
                  {r.category}: {formatMoney(r.spent, cur)} of {formatMoney(r.limit, cur)} (
                  {formatPercent(r.pct)})
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <Card key={r.id} className="shadow-soft">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">
                <CategoryPill name={r.category} />
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-expense"
                  onClick={() => {
                    deleteBudget(r.id);
                    toast.success("Budget removed");
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">{formatMoney(r.spent, cur)}</span>
                <span className="text-sm text-muted-foreground">
                  of {formatMoney(r.limit, cur)}
                </span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", barColor(r.pct))}
                  style={{ width: `${Math.min(r.pct, 100)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span
                  className={cn(
                    "font-medium",
                    r.pct >= 90 ? "text-expense" : r.pct >= 80 ? "text-warning" : "text-income",
                  )}
                >
                  {formatPercent(r.pct)} used
                </span>
                <span className="text-muted-foreground">
                  {r.limit - r.spent >= 0
                    ? `${formatMoney(r.limit - r.spent, cur)} left`
                    : `${formatMoney(r.spent - r.limit, cur)} over`}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit budget" : "New budget"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={!!editing}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Monthly limit</Label>
              <Input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
