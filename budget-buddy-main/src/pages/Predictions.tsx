import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Brain, AlertTriangle, CheckCircle, Target, Lightbulb, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared";
import { PremiumGate } from "@/components/PremiumGate";
import { formatMoney, formatDate } from "@/lib/format";
import { useApp, useActiveExpenses } from "@/context/AppContext";
import { cn } from "@/lib/utils";

type TimeRange = "monthly" | "yearly";

interface Insight {
  type: "success" | "warning" | "info";
  icon: React.ReactNode;
  title: string;
  message: string;
  metric?: string;
}

export default function Predictions() {
  const { income, budgets, savingsGoals } = useApp();
  const expenses = useActiveExpenses();
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");

  const predictions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate current month data
    const monthlyExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthlyIncome = income.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalMonthlyExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalMonthlyIncome = monthlyIncome.reduce((sum, i) => sum + i.amount, 0);
    const monthlyBalance = totalMonthlyIncome - totalMonthlyExpenses;

    // Calculate category spending
    const categorySpending = new Map<string, number>();
    monthlyExpenses.forEach(e => {
      categorySpending.set(e.category, (categorySpending.get(e.category) || 0) + e.amount);
    });

    // Calculate budget status
    const budgetStatus = budgets.map(b => {
      const spent = categorySpending.get(b.category) || 0;
      const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
      return { ...b, spent, pct };
    });

    // Calculate yearly projections
    const avgMonthlyExpenses = expenses.length > 0 
      ? expenses.reduce((sum, e) => sum + e.amount, 0) / Math.max(1, new Set(expenses.map(e => e.date.slice(0, 7))).size)
      : 0;
    
    const avgMonthlyIncome = income.length > 0
      ? income.reduce((sum, i) => sum + i.amount, 0) / Math.max(1, new Set(income.map(i => i.date.slice(0, 7))).size)
      : 0;

    const yearlyProjectedExpenses = avgMonthlyExpenses * 12;
    const yearlyProjectedIncome = avgMonthlyIncome * 12;
    const yearlyProjectedBalance = yearlyProjectedIncome - yearlyProjectedExpenses;

    // Calculate savings projections
    const totalSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalSavingsTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
    const monthlySavingsRate = monthlyBalance > 0 ? monthlyBalance : 0;
    const projectedYearlySavings = monthlySavingsRate * 12;

    // Generate insights
    const insights: Insight[] = [];

    // Budget warnings
    budgetStatus.forEach(b => {
      if (b.pct >= 90) {
        insights.push({
          type: "warning",
          icon: <AlertTriangle className="h-5 w-5" />,
          title: `${b.category} budget nearly exceeded`,
          message: `You've used ${Math.round(b.pct)}% of your ${formatMoney(b.limit)} budget.`,
          metric: `${formatMoney(b.spent)} / ${formatMoney(b.limit)}`,
        });
      } else if (b.pct <= 50 && b.spent > 0) {
        insights.push({
          type: "success",
          icon: <CheckCircle className="h-5 w-5" />,
          title: `Great job on ${b.category}`,
          message: `You're well within your budget with ${formatMoney(b.limit - b.spent)} remaining.`,
          metric: `${Math.round(b.pct)}% used`,
        });
      }
    });

    // Spending patterns
    const topCategory = Array.from(categorySpending.entries()).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      const avgSpend = categorySpending.size > 0 
        ? Array.from(categorySpending.values()).reduce((a, b) => a + b, 0) / categorySpending.size
        : 0;
      
      if (topCategory[1] > avgSpend * 1.5) {
        insights.push({
          type: "info",
          icon: <TrendingUp className="h-5 w-5" />,
          title: `High spending on ${topCategory[0]}`,
          message: `You spend ${formatMoney(topCategory[1])} on ${topCategory[0]}, which is higher than average.`,
          metric: formatMoney(topCategory[1]),
        });
      }
    }

    // Savings insights
    if (savingsGoals.length > 0) {
      const completedGoals = savingsGoals.filter(g => g.currentAmount >= g.targetAmount).length;
      if (completedGoals > 0) {
        insights.push({
          type: "success",
          icon: <Target className="h-5 w-5" />,
          title: `${completedGoals} savings goal${completedGoals > 1 ? 's' : ''} reached!`,
          message: "Congratulations on achieving your savings targets!",
          metric: `${completedGoals}/${savingsGoals.length} completed`,
        });
      }

      if (monthlySavingsRate > 0) {
        insights.push({
          type: "info",
          icon: <TrendingUp className="h-5 w-5" />,
          title: "Monthly savings rate",
          message: `At this rate, you could save ${formatMoney(projectedYearlySavings)} this year.`,
          metric: formatMoney(monthlySavingsRate) + "/month",
        });
      }
    }

    // Balance insights
    if (monthlyBalance < 0) {
      insights.push({
        type: "warning",
        icon: <TrendingDown className="h-5 w-5" />,
        title: "Monthly deficit detected",
        message: `You're spending ${formatMoney(Math.abs(monthlyBalance))} more than you earn this month.`,
        metric: formatMoney(monthlyBalance),
      });
    } else if (monthlyBalance > 0) {
      insights.push({
        type: "success",
        icon: <TrendingUp className="h-5 w-5" />,
        title: "Positive cash flow",
        message: `You have ${formatMoney(monthlyBalance)} surplus this month. Consider adding to savings.`,
        metric: formatMoney(monthlyBalance),
      });
    }

    return {
      monthly: {
        expenses: totalMonthlyExpenses,
        income: totalMonthlyIncome,
        balance: monthlyBalance,
        budgetStatus,
        categorySpending,
      },
      yearly: {
        projectedExpenses: yearlyProjectedExpenses,
        projectedIncome: yearlyProjectedIncome,
        projectedBalance: yearlyProjectedBalance,
        projectedSavings: projectedYearlySavings,
      },
      savings: {
        totalSaved: totalSavings,
        totalTarget: totalSavingsTarget,
        monthlyRate: monthlySavingsRate,
      },
      insights,
    };
  }, [expenses, income, budgets, savingsGoals]);

  const currentData = timeRange === "monthly" ? predictions.monthly : predictions.yearly;

  return (
    <PremiumGate feature="Financial Predictions and AI Insights">
      <PageHeader
        title="Predictions"
        description="AI-powered financial insights and future projections."
      />

      {/* Time Range Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={timeRange === "monthly" ? "default" : "outline"}
          onClick={() => setTimeRange("monthly")}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" /> Monthly
        </Button>
        <Button
          variant={timeRange === "yearly" ? "default" : "outline"}
          onClick={() => setTimeRange("yearly")}
          className="gap-2"
        >
          <Calendar className="h-4 w-4" /> Yearly
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <Card className="rounded-2xl border-0 bg-income/8 shadow-none">
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <TrendingUp className="h-3.5 w-3.5" /> Predicted Income
            </div>
            <p className="text-3xl font-bold tracking-tight text-income">
              {formatMoney(timeRange === "monthly" ? predictions.monthly.income : predictions.yearly.projectedIncome)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {timeRange === "monthly" ? "This month" : "This year"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 bg-expense/8 shadow-none">
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <TrendingDown className="h-3.5 w-3.5" /> Predicted Expenses
            </div>
            <p className="text-3xl font-bold tracking-tight text-expense">
              {formatMoney(timeRange === "monthly" ? predictions.monthly.expenses : predictions.yearly.projectedExpenses)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {timeRange === "monthly" ? "This month" : "This year"}
            </p>
          </CardContent>
        </Card>

        <Card className={cn(
          "rounded-2xl border-0 shadow-none",
          (timeRange === "monthly" ? predictions.monthly.balance : predictions.yearly.projectedBalance) >= 0
            ? "bg-income/8"
            : "bg-expense/8"
        )}>
          <CardContent className="p-5">
            <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Brain className="h-3.5 w-3.5" /> Predicted Balance
            </div>
            <p className={cn(
              "text-3xl font-bold tracking-tight",
              (timeRange === "monthly" ? predictions.monthly.balance : predictions.yearly.projectedBalance) >= 0
                ? "text-income"
                : "text-expense"
            )}>
              {formatMoney(timeRange === "monthly" ? predictions.monthly.balance : predictions.yearly.projectedBalance)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {timeRange === "monthly" ? "This month" : "This year"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          AI Insights
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {predictions.insights.map((insight, idx) => (
            <Card
              key={idx}
              className={cn(
                "rounded-2xl border-0 shadow-none transition-all hover:shadow-sm",
                insight.type === "success" && "bg-income/8",
                insight.type === "warning" && "bg-expense/8",
                insight.type === "info" && "bg-primary/8"
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    insight.type === "success" && "bg-income/20 text-income",
                    insight.type === "warning" && "bg-expense/20 text-expense",
                    insight.type === "info" && "bg-primary/20 text-primary"
                  )}>
                    {insight.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground mb-1">{insight.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{insight.message}</p>
                    {insight.metric && (
                      <span className={cn(
                        "inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-semibold",
                        insight.type === "success" && "bg-income/15 text-income",
                        insight.type === "warning" && "bg-expense/15 text-expense",
                        insight.type === "info" && "bg-primary/15 text-primary"
                      )}>
                        {insight.metric}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {predictions.insights.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
            <Brain className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">No insights available yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Add more transactions to get personalized insights</p>
          </div>
        )}
      </div>

      {/* Budget Status */}
      {timeRange === "monthly" && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Budget Status</h2>
          <div className="grid grid-cols-1 gap-3">
            {predictions.monthly.budgetStatus.map((b) => (
              <Card key={b.id} className="rounded-2xl border-0 shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground">{b.category}</h3>
                    <span className={cn(
                      "text-xs font-semibold",
                      b.pct >= 90 ? "text-expense" : b.pct >= 70 ? "text-warning" : "text-income"
                    )}>
                      {Math.round(b.pct)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 mb-2">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        b.pct >= 90 ? "bg-expense" : b.pct >= 70 ? "bg-warning" : "bg-income"
                      )}
                      style={{ width: `${Math.min(b.pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatMoney(b.spent)} spent</span>
                    <span>{formatMoney(b.limit - b.spent)} remaining</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {predictions.monthly.budgetStatus.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
              <Target className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No budgets set</p>
              <p className="mt-1 text-xs text-muted-foreground">Create budgets to track your spending</p>
            </div>
          )}
        </div>
      )}

      {/* Savings Projection */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-semibold">Savings Projection</h2>
        <Card className="rounded-2xl border-0 bg-primary/8 shadow-none">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Total Saved</p>
                <p className="text-2xl font-bold text-foreground">{formatMoney(predictions.savings.totalSaved)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Total Target</p>
                <p className="text-2xl font-bold text-foreground">{formatMoney(predictions.savings.totalTarget)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Monthly Savings Rate</p>
                <p className={cn(
                  "text-2xl font-bold",
                  predictions.savings.monthlyRate >= 0 ? "text-income" : "text-expense"
                )}>
                  {formatMoney(predictions.savings.monthlyRate)}
                </p>
              </div>
            </div>
            {predictions.savings.totalTarget > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Overall Progress</span>
                  <span className="text-xs font-semibold text-foreground">
                    {Math.round((predictions.savings.totalSaved / predictions.savings.totalTarget) * 100)}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min((predictions.savings.totalSaved / predictions.savings.totalTarget) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PremiumGate>
  );
}

