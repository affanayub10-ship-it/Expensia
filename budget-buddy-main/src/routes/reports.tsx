import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileDown, FileSpreadsheet, FileText, Trophy, Store, CalendarClock } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, StatCard } from "@/components/shared";
import { useApp, useActiveExpenses } from "@/context/AppContext";
import { formatPercent, convertAmount, formatMoney } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";

export const Route = createFileRoute("/reports")({
  component: Reports,
});

// Hard-coded hex colors for SVG rendering (CSS vars don't work in Recharts)
const COLORS = [
  "#3b9ede",
  "#4caf8a",
  "#e8a838",
  "#e05c3a",
  "#8b5cf6",
  "#60a5fa",
  "#f472b6",
  "#34d399",
  "#fb923c",
  "#a78bfa",
  "#38bdf8",
];

function Reports() {
  const { income, budgets, settings } = useApp();
  const expenses = useActiveExpenses();
  const cur = settings.currency;
  const [range, setRange] = useState("monthly");

  // --- Date window based on selected range ---
  const { startDate, chartBuckets } = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const start = new Date();

    if (range === "daily") {
      start.setDate(start.getDate() - 6);   // last 7 days
      start.setHours(0, 0, 0, 0);
      // Build day buckets
      const buckets: { label: string; start: Date; end: Date }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const s = new Date(d); s.setHours(0,0,0,0);
        const e = new Date(d); e.setHours(23,59,59,999);
        buckets.push({ label: d.toLocaleString("default", { weekday: "short" }), start: s, end: e });
      }
      return { startDate: start, chartBuckets: buckets };
    }

    if (range === "weekly") {
      start.setDate(start.getDate() - 27); // last 4 weeks
      start.setHours(0, 0, 0, 0);
      const buckets: { label: string; start: Date; end: Date }[] = [];
      for (let i = 3; i >= 0; i--) {
        const wEnd = new Date(); wEnd.setDate(wEnd.getDate() - i * 7); wEnd.setHours(23,59,59,999);
        const wStart = new Date(wEnd); wStart.setDate(wStart.getDate() - 6); wStart.setHours(0,0,0,0);
        buckets.push({ label: `W${4 - i}`, start: wStart, end: wEnd });
      }
      return { startDate: start, chartBuckets: buckets };
    }

    if (range === "quarterly") {
      start.setMonth(start.getMonth() - 2);
      start.setDate(1); start.setHours(0,0,0,0);
      const buckets: { label: string; start: Date; end: Date }[] = [];
      for (let i = 2; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i);
        const s = new Date(d.getFullYear(), d.getMonth(), 1);
        const e = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
        buckets.push({ label: d.toLocaleString("default", { month: "short" }), start: s, end: e });
      }
      return { startDate: start, chartBuckets: buckets };
    }

    if (range === "yearly") {
      start.setFullYear(start.getFullYear() - 1);
      start.setDate(1); start.setHours(0,0,0,0);
      const buckets: { label: string; start: Date; end: Date }[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i);
        const s = new Date(d.getFullYear(), d.getMonth(), 1);
        const e = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
        buckets.push({ label: d.toLocaleString("default", { month: "short" }), start: s, end: e });
      }
      return { startDate: start, chartBuckets: buckets };
    }

    // monthly (default) — current month
    start.setDate(1); start.setHours(0,0,0,0);
    const buckets: { label: string; start: Date; end: Date }[] = [];
    // weekly buckets within this month
    for (let i = 3; i >= 0; i--) {
      const wEnd = new Date(); wEnd.setDate(wEnd.getDate() - i * 7); wEnd.setHours(23,59,59,999);
      const wStart = new Date(wEnd); wStart.setDate(wStart.getDate() - 6); wStart.setHours(0,0,0,0);
      buckets.push({ label: `W${4 - i}`, start: wStart, end: wEnd });
    }
    return { startDate: start, chartBuckets: buckets };
  }, [range]);

  // Filter data to selected window
  const filteredExpenses = useMemo(() =>
    expenses.filter((e) => new Date(e.date) >= startDate),
  [expenses, startDate]);

  const filteredIncome = useMemo(() =>
    income.filter((i) => new Date(i.date) >= startDate),
  [income, startDate]);

  // Totals for stat cards
  const totalExpenses = useMemo(() =>
    filteredExpenses.reduce((s, e) => s + convertAmount(e.amount, cur, e.currency), 0),
  [filteredExpenses, cur]);

  const totalIncome = useMemo(() =>
    filteredIncome.reduce((s, i) => s + convertAmount(i.amount, cur, i.currency), 0),
  [filteredIncome, cur]);

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const savings = totalIncome - totalExpenses;

  // Chart series bucketed by range
  const monthlySeries = useMemo(() =>
    chartBuckets.map(({ label, start, end }) => {
      const exp = filteredExpenses
        .filter((e) => { const d = new Date(e.date); return d >= start && d <= end; })
        .reduce((s, e) => s + convertAmount(e.amount, cur, e.currency), 0);
      const inc = filteredIncome
        .filter((i) => { const d = new Date(i.date); return d >= start && d <= end; })
        .reduce((s, i) => s + convertAmount(i.amount, cur, i.currency), 0);
      return { month: label, income: inc, expenses: exp };
    }),
  [chartBuckets, filteredExpenses, filteredIncome, cur]);

  // Category breakdown for filtered window
  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    filteredExpenses.forEach((e) => {
      const v = convertAmount(e.amount, cur, e.currency);
      m.set(e.category, (m.get(e.category) ?? 0) + v);
    });
    return EXPENSE_CATEGORIES.map((c) => ({ name: c.name, value: m.get(c.name) ?? 0 }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses, cur]);

  // Payment method breakdown for filtered window
  const byMethod = useMemo(() => {
    const m = new Map<string, number>();
    filteredExpenses.forEach((e) => {
      const v = convertAmount(e.amount, cur, e.currency);
      m.set(e.paymentMethod, (m.get(e.paymentMethod) ?? 0) + v);
    });
    return [...m.entries()].map(([name, value]) => ({ name, value }));
  }, [filteredExpenses, cur]);

  const highest = useMemo(() =>
    [...filteredExpenses]
      .map(e => ({ ...e, convertedAmount: convertAmount(e.amount, cur, e.currency) }))
      .sort((a, b) => b.convertedAmount - a.convertedAmount)[0],
  [filteredExpenses, cur]);

  // Most frequent merchant — count by spend amount, not just visits
  const frequentMerchant = useMemo(() => {
    if (filteredExpenses.length === 0) return "—";
    const counts = new Map<string, number>();
    filteredExpenses.forEach((e) => {
      const merchant = (e.merchant ?? "").trim();
      if (merchant) counts.set(merchant, (counts.get(merchant) ?? 0) + 1);
    });
    if (counts.size === 0) return "—";
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }, [filteredExpenses]);

  // Avg daily spending — total ÷ actual days in the window
  const avgDaily = useMemo(() => {
    if (filteredExpenses.length === 0) return 0;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const windowDays = Math.max(
      1,
      Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    return totalExpenses / windowDays;
  }, [filteredExpenses, totalExpenses, startDate]);

  const rangeLabel = range === "daily" ? "Last 7 days" : range === "weekly" ? "Last 4 weeks" : range === "monthly" ? "This month" : range === "quarterly" ? "Last 3 months" : "Last 12 months";

  // --- Export helpers ---
  function exportCSV() {
    const headers = ["Date", "Title", "Category", "Amount", "Currency", "Payment Method", "Merchant", "Status"];
    const rows = filteredExpenses.map((e) => [
      e.date,
      `"${e.title}"`,
      e.category,
      e.amount.toFixed(2),
      e.currency,
      e.paymentMethod,
      `"${e.merchant ?? ""}"`,
      e.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadFile(csv, `expenses-${rangeLabel.replace(/ /g, "-")}.csv`, "text/csv");
  }

  function exportJSON() {
    const data = {
      range: rangeLabel,
      exportedAt: new Date().toISOString(),
      summary: { totalExpenses, totalIncome, savings },
      expenses: filteredExpenses,
      income: filteredIncome,
    };
    downloadFile(JSON.stringify(data, null, 2), `report-${rangeLabel.replace(/ /g, "-")}.json`, "application/json");
  }

  function exportPDF() {
    // Build a simple printable HTML page and trigger browser print
    const rows = filteredExpenses
      .map((e) => `<tr><td>${e.date}</td><td>${e.title}</td><td>${e.category}</td><td>${e.currency} ${e.amount.toFixed(2)}</td><td>${e.paymentMethod}</td><td>${e.status}</td></tr>`)
      .join("");
    const html = `
      <html><head><title>Expense Report — ${rangeLabel}</title>
      <style>body{font-family:sans-serif;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f3f4f6}</style>
      </head><body>
      <h2>Expense Report — ${rangeLabel}</h2>
      <p>Total Expenses: ${formatMoney(totalExpenses, cur)} | Total Income: ${formatMoney(totalIncome, cur)} | Savings: ${formatMoney(savings, cur)}</p>
      <table><thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody></table>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  }

  function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        description={`Showing data for: ${rangeLabel}`}
        action={
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <FileDown className="h-4 w-4" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportJSON}>
              <FileSpreadsheet className="h-4 w-4" /> JSON
            </Button>
            <Button variant="outline" size="sm" onClick={exportPDF}>
              <FileText className="h-4 w-4" /> PDF
            </Button>
          </div>
        }
      />

      <Tabs value={range} onValueChange={setRange} className="mb-6">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Income"
          value={formatMoney(totalIncome, cur)}
          icon={TrendingUp}
          accent="income"
        />
        <StatCard
          label="Total Expense"
          value={formatMoney(totalExpenses, cur)}
          icon={TrendingDown}
          accent="expense"
        />
        <StatCard
          label="Savings"
          value={formatMoney(savings, cur)}
          icon={PiggyBank}
          accent={savings >= 0 ? "income" : "expense"}
        />
        <StatCard
          label="Budget Used"
          value={formatPercent(totalBudget ? (totalExpenses / totalBudget) * 100 : 0)}
          icon={Wallet}
          accent="warning"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-soft">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-expense/10 text-expense">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Highest Expense</p>
              <p className="truncate font-semibold">{highest?.title ?? "—"}</p>
              <p className="text-sm text-expense">
                {highest ? formatMoney(highest.convertedAmount, cur) : ""}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Most Frequent Merchant</p>
              <p className="truncate font-semibold">{frequentMerchant}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Avg Daily Spending</p>
              <p className="truncate font-semibold">{formatMoney(avgDaily, cur)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Income vs Expenses — {rangeLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySeries} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v, cur)} width={72} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "0.75rem", fontSize: "12px", color: "#f1f5f9" }}
                  formatter={(v: number, name: string) => [formatMoney(v, cur), name]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" name="Income" fill="#4caf8a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#e05c3a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {byCategory.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No expense data yet</p>
            ) : (
              byCategory.map((c, i) => {
                const pct = totalExpenses > 0 ? (c.value / totalExpenses) * 100 : 0;
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span>{c.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatMoney(c.value, cur)} · {formatPercent(pct)}
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: COLORS[i % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Payment Method Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {byMethod.length === 0 ? (
              <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
                No expense data yet
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={byMethod}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      label={({ name, percent }) =>
                        percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
                      }
                      labelLine={false}
                    >
                      {byMethod.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                        color: "#f1f5f9",
                      }}
                      formatter={(v: number, name: string) => [formatMoney(v, cur), name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {byMethod.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="truncate">{d.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
