import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, HandCoins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/shared";
import { PremiumGate } from "@/components/PremiumGate";
import { SavingsDrawer } from "@/components/SavingsDrawer";
import { formatMoney } from "@/lib/format";
import { useApp } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { type SavingsGoal } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/savings")({
  component: Savings,
});

function progressColor(pct: number) {
  if (pct >= 71) return "bg-income";
  if (pct >= 31) return "bg-warning";
  return "bg-expense";
}

function progressBg(pct: number) {
  if (pct >= 71) return "bg-income/10";
  if (pct >= 31) return "bg-warning/10";
  return "bg-expense/10";
}

function textColor(pct: number) {
  if (pct >= 71) return "text-income";
  if (pct >= 31) return "text-warning";
  return "text-expense";
}

function Savings() {
  const { savingsGoals, deleteSavingsGoal, addSavingsContribution, expenses, income } = useApp();
  
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<SavingsGoal | null>(null);
  const [toDeleteGoal, setToDeleteGoal] = useState<SavingsGoal | null>(null);
  const [contribGoal, setContribGoal] = useState<SavingsGoal | null>(null);
  const [contribAmount, setContribAmount] = useState(100);
  const [contribType, setContribType] = useState<"deposit" | "withdrawal">("deposit");
  const isMobile = useIsMobile();

  const totalSaved = useMemo(() => savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0), [savingsGoals]);
  const totalTarget = useMemo(() => savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0), [savingsGoals]);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const rows = useMemo(() => {
    return savingsGoals.map((g) => {
      const remaining = g.targetAmount - g.currentAmount;
      const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
      return { ...g, remaining, pct };
    });
  }, [savingsGoals]);

  const openAdd = () => {
    setEditing(null);
    setDrawer(true);
  };

  const openEdit = (g: SavingsGoal) => {
    setEditing(g);
    setDrawer(true);
  };

  const handleAddMoney = async (goalId: string, amount: number) => {
    const totalIncome = income.reduce((s, inc) => s + inc.amount, 0);
    const totalExpenses = expenses.filter((e) => !e.deleted).reduce((s, e) => s + e.amount, 0);
    const totalSaved = savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
    const availableBalance = totalIncome - totalExpenses - totalSaved;

    if (amount > availableBalance) {
      const avail = Math.max(0, availableBalance);
      toast.error(`Insufficient balance. Your current available balance is ${formatMoney(avail)}, so you cannot add ${formatMoney(amount)} to savings.`);
      return;
    }

    try {
      await addSavingsContribution({
        goalId,
        amount,
        type: 'deposit',
        date: new Date().toISOString().slice(0, 10),
      });
      toast.success(`Added ${formatMoney(amount)} to savings`);
    } catch (err) {
      toast.error("Failed to add money to savings");
    }
  };

  const handleWithdrawMoney = async (goalId: string, amount: number) => {
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal) return;
    
    if (goal.currentAmount < amount) {
      toast.error(`Insufficient funds. You only have ${formatMoney(goal.currentAmount)} in this goal.`);
      return;
    }
    
    try {
      await addSavingsContribution({
        goalId,
        amount,
        type: 'withdrawal',
        date: new Date().toISOString().slice(0, 10),
      });
      toast.success(`Withdrew ${formatMoney(amount)} from savings`);
    } catch (err) {
      toast.error("Failed to withdraw money from savings");
    }
  };

  return (
    <PremiumGate feature="Savings Goals">
      <PageHeader
        title="Savings"
        description="Track your savings goals and build your financial future."
        action={<Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" /> New goal</Button>}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <Card className="rounded-2xl border-0 bg-primary/8 shadow-none">
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Wallet className="h-3.5 w-3.5" /> Total Saved
            </div>
            <p className="text-3xl font-bold tracking-tight text-foreground">{formatMoney(totalSaved)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{savingsGoals.length} goals</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-income/8 shadow-none">
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <TrendingUp className="h-3.5 w-3.5" /> Total Target
            </div>
            <p className="text-3xl font-bold tracking-tight text-income">{formatMoney(totalTarget)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatPercent(overallProgress)} complete</p>
          </CardContent>
        </Card>

        <Card className={cn("rounded-2xl border-0 shadow-none", progressBg(overallProgress))}>
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <TrendingUp className="h-3.5 w-3.5" /> Overall Progress
            </div>
            <p className={cn("text-3xl font-bold tracking-tight", textColor(overallProgress))}>
              {formatPercent(overallProgress)}
            </p>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div
                className={cn("h-full rounded-full transition-all duration-500", progressColor(overallProgress))}
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals List */}
      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
            <Wallet className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No savings goals yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Create your first goal to start saving</p>

          </div>
        ) : (
          rows.map((r) => (
            <Card
              key={r.id}
              className={cn("rounded-2xl border-0 shadow-none transition-all hover:shadow-sm", progressBg(r.pct))}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-base font-semibold text-foreground">{r.title}</h3>
                      {r.pct >= 100 && (
                        <span className="rounded-full bg-income/15 px-2 py-0.5 text-[10px] font-semibold text-income">
                          Goal reached!
                        </span>
                      )}
                    </div>

                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-2xl font-bold leading-none">{formatMoney(r.currentAmount)}</span>
                      <span className="mb-0.5 text-sm text-muted-foreground">
                        of {formatMoney(r.targetAmount)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 mb-2">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", progressColor(r.pct))}
                        style={{ width: `${Math.min(r.pct, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className={cn("text-xs font-semibold", textColor(r.pct))}>
                        {formatPercent(r.pct)} complete
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {r.remaining >= 0
                          ? `${formatMoney(r.remaining)} to go`
                          : `${formatMoney(Math.abs(r.remaining))} over target!`
                        }
                      </span>
                    </div>

                    {r.note && (
                      <p className="text-xs text-muted-foreground mb-3">{r.note}</p>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleAddMoney(r.id, 100)}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" /> Add $100
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleWithdrawMoney(r.id, 100)}
                      >
                        <ArrowDownRight className="h-3.5 w-3.5" /> Withdraw $100
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          setContribGoal(r);
                          setContribAmount(100);
                          setContribType("deposit");
                        }}
                      >
                        <HandCoins className="h-3.5 w-3.5" /> Custom
                      </Button>
                    </div>
                  </div>

                  {/* Edit/Delete buttons */}
                  <div className="flex shrink-0 flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl hover:bg-background/60"
                      onClick={() => openEdit(r)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-expense hover:bg-expense/10"
                      onClick={() => setToDeleteGoal(r)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <SavingsDrawer open={drawer} onOpenChange={setDrawer} editing={editing} />

      {/* Custom contribution Sheet */}
      <Sheet open={!!contribGoal} onOpenChange={(o) => !o && setContribGoal(null)}>
        <SheetContent side={isMobile ? "bottom" : "right"} className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-sm h-[70vh] sm:h-full rounded-t-2xl sm:rounded-t-none">
          <SheetHeader className="pb-4">
            <SheetTitle>
              {contribType === "deposit" ? "Add money" : "Withdraw money"}
            </SheetTitle>
            <SheetDescription>
              {contribType === "deposit"
                ? `Add to "${contribGoal?.title ?? ""}"`
                : `Withdraw from "${contribGoal?.title ?? ""}"`
              }
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 px-1 py-2">
            <div className="text-center">
              <span className="text-4xl font-bold tracking-tight text-foreground">
                {formatMoney(contribAmount)}
              </span>
            </div>

            <Slider
              min={0}
              max={5000}
              step={50}
              value={[contribAmount]}
              onValueChange={([v]) => setContribAmount(v)}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{formatMoney(0)}</span>
              <span>{formatMoney(2500)}</span>
              <span>{formatMoney(5000)}</span>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[50, 100, 200, 500, 1000].map((a) => (
                <Button
                  key={a}
                  variant={contribAmount === a ? "default" : "outline"}
                  size="sm"
                  onClick={() => setContribAmount(a)}
                >
                  {formatMoney(a)}
                </Button>
              ))}
            </div>
          </div>

          <SheetFooter className="mt-4">
            {contribType === "deposit" ? (
              <Button onClick={async () => {
                if (!contribGoal) return;
                await handleAddMoney(contribGoal.id, contribAmount);
                setContribGoal(null);
              }}>
                Add {formatMoney(contribAmount)}
              </Button>
            ) : (
              <Button onClick={async () => {
                if (!contribGoal) return;
                await handleWithdrawMoney(contribGoal.id, contribAmount);
                setContribGoal(null);
              }}>
                Withdraw {formatMoney(contribAmount)}
              </Button>
            )}
            <Button variant="outline" onClick={() => setContribGoal(null)}>Cancel</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!toDeleteGoal} onOpenChange={(o) => !o && setToDeleteGoal(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this savings goal?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{toDeleteGoal?.title}"? Any accumulated savings in this goal will be released back to your available balance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-expense text-expense-foreground hover:bg-expense/90"
              onClick={() => {
                if (toDeleteGoal) {
                  deleteSavingsGoal(toDeleteGoal.id);
                  toast.success(`Savings goal "${toDeleteGoal.title}" removed`);
                  setToDeleteGoal(null);
                }
              }}
            >
              Confirm & Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PremiumGate>
  );
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
