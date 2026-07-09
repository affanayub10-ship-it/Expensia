import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  LineChart as LineChartIcon,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, StatCard, CategoryPill, StatusBadge, CategoryIcon } from "@/components/shared";
import { ExpenseDrawer } from "@/components/ExpenseDrawer";
import { useApp, useActiveExpenses } from "@/context/AppContext";
import { formatDate, convertAmount, formatMoney } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

// Hard-coded hex colors that work inside SVG (Recharts can't read CSS vars)
const COLORS = [
  "#3b9ede", // teal/blue  (chart-1)
  "#4caf8a", // green      (chart-2)
  "#e8a838", // amber      (chart-3)
  "#e05c3a", // coral      (chart-4)
  "#8b5cf6", // purple     (chart-5)
  "#60a5fa", // sky        (chart-6)
];

const INCOME_COLOR  = "#4caf8a";
const EXPENSE_COLOR = "#e05c3a";

function Dashboard() {
  const { income, budgets, settings } = useApp();
  const expenses = useActiveExpenses();
  const cur = settings.currency;
  const [chartType, setChartType] = useState<"line" | "bar">("bar");
  const [drawer, setDrawer] = useState(false);

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => {
    return s + convertAmount(e.amount, cur, e.currency);
  }, 0), [expenses, cur]);

  const totalIncome = useMemo(() => income.reduce((s, i) => {
    return s + convertAmount(i.amount, cur, i.currency);
  }, 0), [income, cur]);

  const totalBudget = useMemo(() => budgets.reduce((s, b) => s + b.limit, 0), [budgets]);
  const balance = totalIncome - totalExpenses;
  const remainingBudget = totalBudget - totalExpenses;

  const recent = useMemo(
    () => [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10),
    [expenses],
  );

  // Build real monthly series from actual data (last 6 months)
  const monthlySeries = useMemo(() => {
    const months: { month: string; income: number; expenses: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth();
      const label = d.toLocaleString("default", { month: "short" });

      const monthExpenses = expenses
        .filter((e) => {
          const ed = new Date(e.date);
          return ed.getFullYear() === y && ed.getMonth() === m;
        })
        .reduce((s, e) => s + convertAmount(e.amount, cur, e.currency), 0);

      const monthIncome = income
        .filter((inc) => {
          const id = new Date(inc.date);
          return id.getFullYear() === y && id.getMonth() === m;
        })
        .reduce((s, inc) => s + convertAmount(inc.amount, cur, inc.currency), 0);

      months.push({ month: label, income: monthIncome, expenses: monthExpenses });
    }
    return months;
  }, [expenses, income, cur]);

  const distribution = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((e) => {
      const converted = convertAmount(e.amount, cur, e.currency);
      map.set(e.category, (map.get(e.category) ?? 0) + converted);
    });
    return EXPENSE_CATEGORIES
      .map((c) => ({ name: c.name, value: map.get(c.name) ?? 0 }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses, cur]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your financial overview at a glance."
        action={
          <Button onClick={() => setDrawer(true)}>
            <Plus className="h-4 w-4" /> Add expense
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current Balance"
          value={formatMoney(balance, cur)}
          icon={Wallet}
          accent="primary"
          trend={{ value: "12% vs last month", positive: balance >= 0 }}
        />
        <StatCard
          label="Total Income"
          value={formatMoney(totalIncome, cur)}
          icon={TrendingUp}
          accent="income"
          trend={{ value: "This month", positive: true }}
        />
        <StatCard
          label="Total Expenses"
          value={formatMoney(totalExpenses, cur)}
          icon={TrendingDown}
          accent="expense"
          trend={{ value: "This month", positive: false }}
        />
        <StatCard
          label="Remaining Budget"
          value={formatMoney(remainingBudget, cur)}
          icon={PiggyBank}
          accent={remainingBudget < 0 ? "expense" : "warning"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Monthly Overview</CardTitle>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              <Button
                size="sm"
                variant={chartType === "bar" ? "default" : "ghost"}
                className="h-7 px-2"
                onClick={() => setChartType("bar")}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={chartType === "line" ? "default" : "ghost"}
                className="h-7 px-2"
                onClick={() => setChartType("line")}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={monthlySeries} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v, cur)} width={70} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number, name: string) => [formatMoney(v, cur), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="income" name="Income" fill={INCOME_COLOR} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill={EXPENSE_COLOR} radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v, cur)} width={70} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number, name: string) => [formatMoney(v, cur), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="income" name="Income" stroke={INCOME_COLOR} strokeWidth={2.5} dot={{ r: 4, fill: INCOME_COLOR }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke={EXPENSE_COLOR} strokeWidth={2.5} dot={{ r: 4, fill: EXPENSE_COLOR }} activeDot={{ r: 6 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {distribution.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No expense data yet
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {distribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number, name: string) => [formatMoney(v, cur), name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {distribution.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="truncate">{d.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-soft">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/expenses">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {/* Desktop view */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(e.date, "short")}
                    </TableCell>
                    <TableCell>
                      <CategoryPill name={e.category} />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {e.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={e.status} />
                    </TableCell>
                    <TableCell className="text-right font-semibold text-expense">
                      -{formatMoney(e.amount, e.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view */}
          <div className="divide-y divide-border px-4 sm:hidden">
            {recent.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <CategoryIcon name={e.category} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{e.title}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(e.date, "short")}
                      </span>
                      <span className="text-[10px] text-muted-foreground/80">
                        • {e.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-expense">
                    -{formatMoney(e.amount, e.currency)}
                  </p>
                  <div className="mt-1 flex justify-end transform scale-90 origin-right">
                    <StatusBadge status={e.status} />
                  </div>
                </div>
              </div>
            ))}
            {recent.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No recent transactions.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <ExpenseDrawer open={drawer} onOpenChange={setDrawer} />
    </>
  );
}

const tooltipStyle = {
  backgroundColor: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.75rem",
  color: "var(--color-popover-foreground)",
  fontSize: "12px",
};
