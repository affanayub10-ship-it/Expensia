import { useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, AlertTriangle, TriangleAlert, TrendingDown, Wallet as WalletIcon, PiggyBank, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { PageHeader, CategoryPill } from "@/components/shared";
import { PremiumGate } from "@/components/PremiumGate";
import { formatDate } from "@/lib/format";
import { useApp, useActiveExpenses } from "@/context/AppContext";
import { formatPercent, formatMoney } from "@/lib/format";
import { EXPENSE_CATEGORIES, type Budget } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/budgets")({
  component: Budgets,
});

// Slider config
const SLIDER_MIN = 0;
const SLIDER_MAX = 50000;
const SLIDER_STEP = 100;

function barColor(pct: number) {
  if (pct >= 100) return "bg-expense";
  if (pct >= 80) return "bg-warning";
  return "bg-income";
}

function barBg(pct: number) {
  if (pct >= 100) return "bg-expense/10";
  if (pct >= 80) return "bg-warning/10";
  return "bg-income/10";
}

function textColor(pct: number) {
  if (pct >= 100) return "text-expense";
  if (pct >= 80) return "text-warning";
  return "text-income";
}

function Budgets() {
  const { budgets, saveBudget, deleteBudget, settings } = useApp();
  const expenses = useActiveExpenses();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [category, setCategory] = useState("Food");
  const [sliderVal, setSliderVal] = useState(1000);
  const [hoveredBudget, setHoveredBudget] = useState<string | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const spentByCat = useMemo(() => {
    const m = new Map<string, number>();
    expenses.forEach((e) => {
      m.set(e.category, (m.get(e.category) ?? 0) + e.amount);
    });
    return m;
  }, [expenses]);

  const expensesByCategory = useMemo(() => {
    const m = new Map<string, typeof expenses>();
    expenses.forEach((e) => {
      if (!m.has(e.category)) {
        m.set(e.category, []);
      }
      m.get(e.category)!.push(e);
    });
    return m;
  }, [expenses]);

  const rows = budgets.map((b) => {
    const spent = spentByCat.get(b.category) ?? 0;
    const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
    return { ...b, spent, pct };
  });

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  const remaining = totalLimit - totalSpent;
  const alerts = rows.filter((r) => r.pct >= 80);

  const openAdd = () => {
    setEditing(null);
    setCategory("Food");
    setSliderVal(1000);
    setOpen(true);
  };

  const openEdit = (b: Budget) => {
    setEditing(b);
    setCategory(b.category);
    setSliderVal(Math.min(Math.max(b.limit, SLIDER_MIN), SLIDER_MAX));
    setOpen(true);
  };

  const submit = () => {
    if (!sliderVal || sliderVal <= 0) return toast.error("Set a budget limit above zero");
    saveBudget({ id: editing?.id ?? "", category, limit: sliderVal });
    toast.success(editing ? "Budget updated" : "Budget created");
    setOpen(false);
  };

  const handleBudgetMouseEnter = (budgetId: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoveredBudget(budgetId);
  };

  const handleBudgetMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => {
      setHoveredBudget(null);
    }, 200);
  };

  const handlePopoverMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const handlePopoverMouseLeave = () => {
    setHoveredBudget(null);
  };

  const handleTouchStart = (budgetId: string) => {
    const timer = setTimeout(() => {
      setHoveredBudget(budgetId);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setHoveredBudget(null);
  };

  return (
    <PremiumGate feature="Budget Management">
      <PageHeader
        title="Budgets"
        description="Set monthly limits and track spending by category."
        action={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> New budget
          </Button>
        }
      />

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((r) => {
            const exceeded = r.pct >= 100;
            return (
              <Alert
                key={r.id}
                className={cn(
                  "rounded-xl",
                  exceeded ? "border-expense/40 bg-expense/8" : "border-warning/40 bg-warning/8",
                )}
              >
                {exceeded ? (
                  <TriangleAlert className="h-4 w-4 text-expense" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
                <AlertTitle className="text-sm">
                  {exceeded ? "Budget exceeded" : "Approaching limit"}
                </AlertTitle>
                <AlertDescription className="text-xs">
                  {r.category}: spent {formatMoney(r.spent)} of {formatMoney(r.limit)} ({formatPercent(r.pct)})
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Left column: summary cards ── */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          {/* Total Budget */}
          <Card className="rounded-2xl border-0 bg-primary/8 shadow-none">
            <CardContent className="p-5">
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <WalletIcon className="h-3.5 w-3.5" /> Total Budget
              </div>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {formatMoney(totalLimit)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{budgets.length} categories</p>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card className="rounded-2xl border-0 bg-expense/8 shadow-none">
            <CardContent className="p-5">
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <TrendingDown className="h-3.5 w-3.5" /> Total Spent
              </div>
              <p className="text-3xl font-bold tracking-tight text-expense">
                {formatMoney(totalSpent)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {totalLimit > 0 ? formatPercent((totalSpent / totalLimit) * 100) : "0%"} of budget
              </p>
            </CardContent>
          </Card>

          {/* Remaining / Over Budget */}
          <Card className={cn("rounded-2xl border-0 shadow-none", remaining < 0 ? "bg-expense/8" : "bg-income/8")}>
            <CardContent className="p-5">
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <PiggyBank className="h-3.5 w-3.5" /> {remaining < 0 ? "Over Budget" : "Remaining"}
              </div>
              <p className={cn("text-3xl font-bold tracking-tight", remaining < 0 ? "text-expense" : "text-income")}>
                {formatMoney(Math.abs(remaining))}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {remaining < 0 ? "over budget" : "available to spend"}
              </p>
            </CardContent>
          </Card>

          {/* Overall progress bar */}
          {totalLimit > 0 && (
            <Card className="rounded-2xl border-0 bg-muted/40 shadow-none">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">Overall spending</span>
                  <span className={cn("font-semibold", textColor((totalSpent / totalLimit) * 100))}>
                    {formatPercent((totalSpent / totalLimit) * 100)}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", barColor((totalSpent / totalLimit) * 100))}
                    style={{ width: `${Math.min((totalSpent / totalLimit) * 100, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right column: category cards ── */}
        <div className="space-y-3 lg:col-span-2">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <WalletIcon className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No budgets yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Create your first budget to start tracking</p>
              <Button onClick={openAdd} className="mt-4 gap-2" size="sm">
                <Plus className="h-4 w-4" /> New budget
              </Button>
            </div>
          ) : (
            rows.map((r) => {
              const categoryExpenses = expensesByCategory.get(r.category) || [];
              const remaining = r.limit - r.spent;
              
              return (
                <Popover key={r.id} open={hoveredBudget === r.id} onOpenChange={(open) => !open && setHoveredBudget(null)}>
                  <PopoverTrigger asChild>
                    <Card
                      className={cn(
                        "rounded-2xl border-0 shadow-none transition-all hover:shadow-sm cursor-pointer",
                        barBg(r.pct),
                      )}
                      onMouseEnter={() => handleBudgetMouseEnter(r.id)}
                      onMouseLeave={handleBudgetMouseLeave}
                      onTouchStart={() => handleTouchStart(r.id)}
                      onTouchEnd={handleTouchEnd}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <CategoryPill name={r.category} />
                              {r.pct >= 100 && (
                                <span className="rounded-full bg-expense/15 px-2 py-0.5 text-[10px] font-semibold text-expense">
                                  Over budget
                                </span>
                              )}
                              {r.pct >= 80 && r.pct < 100 && (
                                <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold text-warning">
                                  Near limit
                                </span>
                              )}
                            </div>

                            <div className="mt-3 flex items-end gap-2">
                              <span className="text-2xl font-bold leading-none">{formatMoney(r.spent)}</span>
                              <span className="mb-0.5 text-sm text-muted-foreground">
                                of {formatMoney(r.limit)}
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                              <div
                                className={cn("h-full rounded-full transition-all duration-500", barColor(r.pct))}
                                style={{ width: `${Math.min(r.pct, 100)}%` }}
                              />
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <span className={cn("text-xs font-semibold", textColor(r.pct))}>
                                {formatPercent(r.pct)} used
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {r.limit - r.spent >= 0
                                  ? `${formatMoney(r.limit - r.spent)} left`
                                  : `${formatMoney(r.spent - r.limit)} over`}
                              </span>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex shrink-0 flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl hover:bg-background/60"
                              onClick={(e) => { e.stopPropagation(); openEdit(r); }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl text-expense hover:bg-expense/10"
                              onClick={(e) => { e.stopPropagation(); deleteBudget(r.id); toast.success("Budget removed"); }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </PopoverTrigger>
                  <PopoverContent side="right" className="w-80 p-0" align="start" onMouseEnter={handlePopoverMouseEnter} onMouseLeave={handlePopoverMouseLeave}>
                    <div className="p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <CategoryPill name={r.category} />
                        <span className="text-sm font-semibold">Expenses</span>
                      </div>
                      
                      {categoryExpenses.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-sm text-muted-foreground">No expenses added for this category yet.</p>
                        </div>
                      ) : (
                        <>
                          <div className="max-h-48 space-y-2 overflow-y-auto">
                            {categoryExpenses.slice(0, 10).map((expense) => (
                              <div key={expense.id} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-medium">{expense.title}</p>
                                  <p className="text-[11px] text-muted-foreground">{formatDate(expense.date, settings.dateFormat)}</p>
                                </div>
                                <span className="ml-2 text-xs font-semibold text-expense">-{formatMoney(expense.amount)}</span>
                              </div>
                            ))}
                            {categoryExpenses.length > 10 && (
                              <p className="text-center text-xs text-muted-foreground">
                                +{categoryExpenses.length - 10} more expenses
                              </p>
                            )}
                          </div>
                          
                          <div className="mt-4 space-y-2 rounded-xl bg-muted/40 p-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Total Spent</span>
                              <span className="font-semibold">{formatMoney(r.spent)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Budget Limit</span>
                              <span className="font-semibold">{formatMoney(r.limit)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{remaining >= 0 ? "Remaining" : "Over Budget"}</span>
                              <span className={cn("font-semibold", remaining >= 0 ? "text-income" : "text-expense")}>
                                {formatMoney(Math.abs(remaining))}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Transactions</span>
                              <span className="font-semibold">{categoryExpenses.length}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            })
          )}
        </div>
      </div>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit budget" : "New budget"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Category grid */}
            <div className="space-y-3">
              <Label className="text-xs font-medium text-muted-foreground">Select category</Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {EXPENSE_CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.name;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => !editing && setCategory(c.name)}
                      disabled={!!editing}
                      className={cn(
                        "relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted/50",
                        editing && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute right-2 top-2">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <Icon className={cn("h-5 w-5", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                      <span className={cn("text-xs font-medium", isSelected ? "text-primary-foreground" : "text-foreground")}>
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Monthly limit</Label>
                <span className="rounded-lg bg-primary/10 px-3 py-1 text-lg font-bold text-primary">
                  {formatMoney(sliderVal)}
                </span>
              </div>

              <Slider
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step={SLIDER_STEP}
                value={[sliderVal]}
                onValueChange={([v]) => setSliderVal(v)}
                className="w-full"
              />

              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{formatMoney(SLIDER_MIN)}</span>
                <span>{formatMoney(SLIDER_MAX / 2)}</span>
                <span>{formatMoney(SLIDER_MAX)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={submit} className="rounded-xl">
              {editing ? "Save changes" : "Create budget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PremiumGate>
  );
}


