import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, LineChart as LineChartIcon, BarChart3, Plus } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, StatCard, CategoryPill, StatusBadge, CategoryIcon } from "@/components/shared";
import { useApp, useActiveExpenses } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatMoney } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/mock-data";

export const Route = createFileRoute("/")({ component: Dashboard });

const COLORS = ["#3b9ede","#4caf8a","#e8a838","#e05c3a","#8b5cf6","#60a5fa"];
const INCOME_COLOR = "#4caf8a";
const EXPENSE_COLOR = "#e05c3a";

const tooltipStyle = { backgroundColor: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "0.75rem", color: "#ffffff", fontSize: "12px" };

function CustomChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 text-xs shadow-2xl backdrop-blur-md">
      {label && <p className="mb-1.5 text-[11px] font-bold text-slate-300">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color || entry.fill || "#3b9ede" }} />
            <span className="font-bold text-white text-xs">{entry.name || entry.dataKey} :</span>
            <span className="font-extrabold text-white text-xs ml-1">{formatMoney(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const { income, budgets, settings } = useApp();
  const expenses = useActiveExpenses();
  const dateFmt = settings.dateFormat;
  const [chartType, setChartType] = useState<"line" | "bar">("bar");

  if (isLoading || !isAuthenticated) return null;

  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalIncome   = useMemo(() => income.reduce((s, i) => s + i.amount, 0), [income]);
  const totalBudget   = useMemo(() => budgets.reduce((s, b) => s + b.limit, 0), [budgets]);
  const balance       = totalIncome - totalExpenses;
  const budgetedCategories = useMemo(() => new Set(budgets.map((b) => b.category)), [budgets]);
  const budgetedExpenses  = useMemo(() => expenses.filter((e) => budgetedCategories.has(e.category)).reduce((s, e) => s + e.amount, 0), [expenses, budgetedCategories]);
  const remainingBudget   = totalBudget - budgetedExpenses;

  const recent = useMemo(() => [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10), [expenses]);

  const monthlySeries = useMemo(() => {
    const months: { month: string; income: number; expenses: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const y = d.getFullYear(); const m = d.getMonth();
      const label = d.toLocaleString("default", { month: "short" });
      const monthExpenses = expenses.filter(e => { const ed = new Date(e.date); return ed.getFullYear() === y && ed.getMonth() === m; }).reduce((s, e) => s + e.amount, 0);
      const monthIncome   = income.filter(i => { const id = new Date(i.date); return id.getFullYear() === y && id.getMonth() === m; }).reduce((s, i) => s + i.amount, 0);
      months.push({ month: label, income: monthIncome, expenses: monthExpenses });
    }
    return months;
  }, [expenses, income]);

  const distribution = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach(e => map.set(e.category, (map.get(e.category) ?? 0) + e.amount));
    return EXPENSE_CATEGORIES.map(c => ({ name: c.name, value: map.get(c.name) ?? 0 })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
  }, [expenses]);

  return (
    <>
      <PageHeader title="Dashboard" description="Your financial overview at a glance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current Balance"   value={formatMoney(balance)}          icon={Wallet}      accent="primary"  trend={balance !== 0 ? { value: "This month", positive: balance >= 0 } : undefined} />
        <StatCard label="Total Income"      value={formatMoney(totalIncome)}      icon={TrendingUp}  accent="income"   trend={{ value: "This month", positive: true }} />
        <StatCard label="Total Expenses"    value={formatMoney(totalExpenses)}    icon={TrendingDown} accent="expense"  trend={{ value: "This month", positive: false }} />
        <StatCard label={remainingBudget < 0 ? "Over Budget" : "Remaining Budget"} value={formatMoney(Math.abs(remainingBudget))} icon={PiggyBank} accent={remainingBudget < 0 ? "expense" : "warning"} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Monthly Overview</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Chart type:</span>
              <div className="flex gap-1 rounded-lg bg-muted p-1">
                <Button size="sm" variant={chartType === "bar" ? "default" : "ghost"} className="h-7 px-2" onClick={() => setChartType("bar")}><BarChart3 className="h-4 w-4" /></Button>
                <Button size="sm" variant={chartType === "line" ? "default" : "ghost"} className="h-7 px-2" onClick={() => setChartType("line")}><LineChartIcon className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "bar" ? (
                <BarChart data={monthlySeries} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={formatMoney} width={80} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="income" name="Income" fill={INCOME_COLOR} radius={[6,6,0,0]} />
                  <Bar dataKey="expenses" name="Expenses" fill={EXPENSE_COLOR} radius={[6,6,0,0]} />
                </BarChart>
              ) : (
                <LineChart data={monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={formatMoney} width={80} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="income" name="Income" stroke={INCOME_COLOR} strokeWidth={2.5} dot={{ r: 4, fill: INCOME_COLOR }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke={EXPENSE_COLOR} strokeWidth={2.5} dot={{ r: 4, fill: EXPENSE_COLOR }} activeDot={{ r: 6 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Expense Distribution</CardTitle></CardHeader>
          <CardContent>
            {distribution.length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                  <TrendingDown className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No expense data yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add expenses to see your spending breakdown</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                      {distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
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
          <Button asChild variant="ghost" size="sm"><Link to="/expenses">View all</Link></Button>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">No transactions yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">Start tracking your expenses by adding your first transaction</p>
              <Button asChild variant="default" size="sm" className="gap-2">
                <Link to="/expenses"><Plus className="h-4 w-4" /> Add expense</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map(e => (
                      <TableRow key={e.id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(e.date, dateFmt)}</TableCell>
                        <TableCell className="font-medium">{e.title}</TableCell>
                        <TableCell><CategoryPill name={e.category} /></TableCell>
                        <TableCell><StatusBadge status={e.status} /></TableCell>
                        <TableCell className="text-right font-semibold text-expense">-{formatMoney(e.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="divide-y divide-border px-4 sm:hidden">
                {recent.map(e => (
                  <div key={e.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <CategoryIcon name={e.category} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{e.title}</p>
                        <span className="text-xs text-muted-foreground">{formatDate(e.date, dateFmt)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-expense">-{formatMoney(e.amount)}</p>
                      <div className="mt-1 flex justify-end transform scale-90 origin-right"><StatusBadge status={e.status} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
