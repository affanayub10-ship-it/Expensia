import { useMemo, useState } from "react";
import { FileDown, FileSpreadsheet, FileText, Trophy, Tag, CalendarClock, Store, Check, ChevronDown } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader, StatCard } from "@/components/shared";
import { useApp, useActiveExpenses } from "@/context/AppContext";
import { formatPercent, formatMoney, formatDate } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#3b9ede","#4caf8a","#e8a838","#e05c3a","#8b5cf6","#60a5fa","#f472b6","#34d399","#fb923c","#a78bfa","#38bdf8"];

const TIME_RANGES = [
  { value: "last7days", label: "Last 7 Days" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "custom", label: "Custom Range" },
];

export default function Reports() {
  const { income, budgets, settings } = useApp();
  const expenses = useActiveExpenses();
  const [range, setRange] = useState("monthly");
  const [analysisTab, setAnalysisTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("last30days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const { startDate, chartBuckets } = useMemo(() => {
    const start = new Date();
    if (range === "daily") {
      start.setDate(start.getDate() - 6); start.setHours(0,0,0,0);
      const buckets = Array.from({length:7}, (_,i) => {
        const d = new Date(); d.setDate(d.getDate() - (6-i));
        const s = new Date(d); s.setHours(0,0,0,0);
        const e = new Date(d); e.setHours(23,59,59,999);
        return { label: d.toLocaleString("default", { weekday: "short" }), start: s, end: e };
      });
      return { startDate: start, chartBuckets: buckets };
    }
    if (range === "weekly") {
      start.setDate(start.getDate() - 27); start.setHours(0,0,0,0);
      const buckets = Array.from({length:4}, (_,i) => {
        const wEnd = new Date(); wEnd.setDate(wEnd.getDate() - (3-i)*7); wEnd.setHours(23,59,59,999);
        const wStart = new Date(wEnd); wStart.setDate(wStart.getDate() - 6); wStart.setHours(0,0,0,0);
        return { label: `W${i+1}`, start: wStart, end: wEnd };
      });
      return { startDate: start, chartBuckets: buckets };
    }
    if (range === "quarterly") {
      start.setMonth(start.getMonth()-2); start.setDate(1); start.setHours(0,0,0,0);
      const buckets = Array.from({length:3}, (_,i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (2-i));
        return { label: d.toLocaleString("default",{month:"short"}), start: new Date(d.getFullYear(),d.getMonth(),1), end: new Date(d.getFullYear(),d.getMonth()+1,0,23,59,59,999) };
      });
      return { startDate: start, chartBuckets: buckets };
    }
    if (range === "yearly") {
      start.setFullYear(start.getFullYear()-1); start.setDate(1); start.setHours(0,0,0,0);
      const buckets = Array.from({length:12}, (_,i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (11-i));
        return { label: d.toLocaleString("default",{month:"short"}), start: new Date(d.getFullYear(),d.getMonth(),1), end: new Date(d.getFullYear(),d.getMonth()+1,0,23,59,59,999) };
      });
      return { startDate: start, chartBuckets: buckets };
    }
    // monthly
    start.setDate(1); start.setHours(0,0,0,0);
    const buckets = Array.from({length:4}, (_,i) => {
      const wEnd = new Date(); wEnd.setDate(wEnd.getDate() - (3-i)*7); wEnd.setHours(23,59,59,999);
      const wStart = new Date(wEnd); wStart.setDate(wStart.getDate()-6); wStart.setHours(0,0,0,0);
      return { label: `W${i+1}`, start: wStart, end: wEnd };
    });
    return { startDate: start, chartBuckets: buckets };
  }, [range]);

  const filteredExpenses = useMemo(() => expenses.filter(e => new Date(e.date) >= startDate), [expenses, startDate]);
  const filteredIncome   = useMemo(() => income.filter(i => new Date(i.date) >= startDate), [income, startDate]);

  const totalExpenses = useMemo(() => filteredExpenses.reduce((s,e) => s + e.amount, 0), [filteredExpenses]);
  const totalIncome   = useMemo(() => filteredIncome.reduce((s,i) => s + i.amount, 0), [filteredIncome]);
  const totalBudget   = budgets.reduce((s,b) => s + b.limit, 0);
  const savings       = totalIncome - totalExpenses;

  const monthlySeries = useMemo(() => chartBuckets.map(({label,start,end}) => ({
    month: label,
    income:   filteredIncome.filter(i => { const d=new Date(i.date); return d>=start && d<=end; }).reduce((s,i)=>s+i.amount,0),
    expenses: filteredExpenses.filter(e => { const d=new Date(e.date); return d>=start && d<=end; }).reduce((s,e)=>s+e.amount,0),
  })), [chartBuckets, filteredExpenses, filteredIncome]);

  const byCategory = useMemo(() => {
    const m = new Map<string,number>();
    filteredExpenses.forEach(e => m.set(e.category, (m.get(e.category)??0) + e.amount));
    return EXPENSE_CATEGORIES.map(c=>({name:c.name,value:m.get(c.name)??0})).filter(d=>d.value>0).sort((a,b)=>b.value-a.value);
  }, [filteredExpenses]);

  const highest = useMemo(() => [...filteredExpenses].sort((a,b)=>b.amount-a.amount)[0], [filteredExpenses]);
  const frequentCategory = useMemo(() => {
    if (!filteredExpenses.length) return "â€”";
    const m = new Map<string,number>();
    filteredExpenses.forEach(e => { const cat=e.category.trim(); m.set(cat,(m.get(cat)??0)+1); });
    return [...m.entries()].sort((a,b)=>b[1]-a[1])[0][0];
  }, [filteredExpenses]);

  const days = range==="daily"?7:range==="weekly"?28:range==="monthly"?30:range==="quarterly"?90:365;
  const avgDaily = totalExpenses / days;
  const rangeLabel = range==="daily"?"Last 7 days":range==="weekly"?"Last 4 weeks":range==="monthly"?"This month":range==="quarterly"?"Last 3 months":"Last 12 months";

  function exportCSV() {
    const rows = filteredExpenses.map(e => [e.date,`"${e.title}"`,e.category,e.amount.toFixed(2),e.status].join(","));
    downloadFile(["Date,Title,Category,Amount,Status",...rows].join("\n"), `expenses-${rangeLabel.replace(/ /g,"-")}.csv`, "text/csv");
  }
  function exportJSON() {
    downloadFile(JSON.stringify({range:rangeLabel,summary:{totalExpenses,totalIncome,savings},expenses:filteredExpenses,income:filteredIncome},null,2), `report-${rangeLabel.replace(/ /g,"-")}.json`, "application/json");
  }
  function exportPDF() {
    const rows = filteredExpenses.map(e=>`<tr><td>${e.date}</td><td>${e.title}</td><td>${e.category}</td><td>$${e.amount.toFixed(2)}</td><td>${e.status}</td></tr>`).join("");
    const html=`<html><head><title>Report</title><style>body{font-family:sans-serif;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px}th{background:#f3f4f6}</style></head><body><h2>Expense Report â€” ${rangeLabel}</h2><p>Expenses: ${formatMoney(totalExpenses)} | Income: ${formatMoney(totalIncome)} | Savings: ${formatMoney(savings)}</p><table><thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const w=window.open("","_blank"); if(w){w.document.write(html);w.document.close();w.print();}
  }
  function downloadFile(content:string,filename:string,type:string){const b=new Blob([content],{type});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=filename;a.click();URL.revokeObjectURL(u);}

  // Category Analysis Logic
  const { dateRangeStart, dateRangeEnd, dateRangeLabel } = useMemo(() => {
    const now = new Date();
    const start = new Date();
    const end = new Date();
    
    switch (timeRange) {
      case "last7days":
        start.setDate(start.getDate() - 6);
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        return { dateRangeStart: start, dateRangeEnd: end, dateRangeLabel: "Last 7 Days" };
      case "last30days":
        start.setDate(start.getDate() - 29);
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        return { dateRangeStart: start, dateRangeEnd: end, dateRangeLabel: "Last 30 Days" };
      case "thisMonth":
        start.setDate(1);
        start.setHours(0,0,0,0);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23,59,59,999);
        return { dateRangeStart: start, dateRangeEnd: end, dateRangeLabel: "This Month" };
      case "lastMonth":
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        start.setHours(0,0,0,0);
        end.setMonth(end.getMonth());
        end.setDate(0);
        end.setHours(23,59,59,999);
        return { dateRangeStart: start, dateRangeEnd: end, dateRangeLabel: "Last Month" };
      case "custom":
        if (customStartDate && customEndDate) {
          return { 
            dateRangeStart: new Date(customStartDate), 
            dateRangeEnd: new Date(customEndDate), 
            dateRangeLabel: "Custom Range" 
          };
        }
        return { dateRangeStart: start, dateRangeEnd: end, dateRangeLabel: "Custom Range" };
      default:
        start.setDate(start.getDate() - 29);
        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);
        return { dateRangeStart: start, dateRangeEnd: end, dateRangeLabel: "Last 30 Days" };
    }
  }, [timeRange, customStartDate, customEndDate]);

  const categoryExpenses = useMemo(() => {
    if (!selectedCategory) return [];
    return expenses.filter(e => {
      const eDate = new Date(e.date);
      return e.category === selectedCategory && eDate >= dateRangeStart && eDate <= dateRangeEnd;
    });
  }, [expenses, selectedCategory, dateRangeStart, dateRangeEnd]);

  const totalCategorySpending = useMemo(() => 
    categoryExpenses.reduce((sum, e) => sum + e.amount, 0), 
    [categoryExpenses]
  );

  const totalSpendingInRange = useMemo(() => 
    expenses.filter(e => {
      const eDate = new Date(e.date);
      return eDate >= dateRangeStart && eDate <= dateRangeEnd;
    }).reduce((sum, e) => sum + e.amount, 0), 
    [expenses, dateRangeStart, dateRangeEnd]
  );

  const categoryStats = useMemo(() => {
    if (categoryExpenses.length === 0) return null;
    
    const amounts = categoryExpenses.map(e => e.amount);
    const total = amounts.reduce((a, b) => a + b, 0);
    const avg = total / amounts.length;
    const highest = Math.max(...amounts);
    const lowest = Math.min(...amounts);
    const daysInPeriod = Math.ceil((dateRangeEnd.getTime() - dateRangeStart.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const avgDaily = total / daysInPeriod;
    const percentageOfTotal = totalSpendingInRange > 0 ? (total / totalSpendingInRange) * 100 : 0;
    
    const highestExpense = categoryExpenses.find(e => e.amount === highest);
    const lowestExpense = categoryExpenses.find(e => e.amount === lowest);
    
    return {
      total,
      transactionCount: categoryExpenses.length,
      averageExpense: avg,
      highestExpense,
      lowestExpense,
      averageDailySpending: avgDaily,
      percentageOfTotal,
    };
  }, [categoryExpenses, dateRangeStart, dateRangeEnd, totalSpendingInRange]);

  const categorySpendingChart = useMemo(() => {
    if (!selectedCategory || categoryExpenses.length === 0) return [];
    
    const dailySpending = new Map<string, number>();
    categoryExpenses.forEach(e => {
      const dateKey = e.date;
      dailySpending.set(dateKey, (dailySpending.get(dateKey) || 0) + e.amount);
    });
    
    const sortedDates = Array.from(dailySpending.keys()).sort();
    return sortedDates.map(date => ({
      date: formatDate(date, settings.dateFormat),
      amount: dailySpending.get(date) || 0,
    }));
  }, [categoryExpenses, settings.dateFormat]);

  return (
    <>
      <PageHeader title="Reports & Analytics" description={`Showing data for: ${rangeLabel}`}
        action={<div className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={exportCSV}><FileDown className="h-4 w-4" /> CSV</Button>
          <Button variant="outline" size="sm" onClick={exportJSON}><FileSpreadsheet className="h-4 w-4" /> JSON</Button>
          <Button variant="outline" size="sm" onClick={exportPDF}><FileText className="h-4 w-4" /> PDF</Button>
        </div>}
      />

      <Tabs value={analysisTab} onValueChange={setAnalysisTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="category">Category Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
        <StatCard label="Total Income"   value={formatMoney(totalIncome)}   icon={TrendingUp}  accent="income" />
        <StatCard label="Total Expense"  value={formatMoney(totalExpenses)} icon={TrendingDown} accent="expense" />
        <StatCard label="Savings"        value={formatMoney(savings)}       icon={PiggyBank}   accent={savings>=0?"income":"expense"} />
        <StatCard label="Budget Used"    value={formatPercent(totalBudget?(totalExpenses/totalBudget)*100:0)} icon={Wallet} accent="warning" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-soft"><CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-expense/10 text-expense"><Trophy className="h-5 w-5" /></div>
          <div className="min-w-0"><p className="text-xs text-muted-foreground">Highest Expense</p><p className="truncate font-semibold">{highest?.title??"â€”"}</p><p className="text-sm text-expense">{highest?formatMoney(highest.amount):""}</p></div>
        </CardContent></Card>
        <Card className="shadow-soft"><CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Tag className="h-5 w-5" /></div>
          <div className="min-w-0"><p className="text-xs text-muted-foreground">Most Frequent Category</p><p className="truncate font-semibold">{frequentCategory}</p></div>
        </CardContent></Card>
        <Card className="shadow-soft"><CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/15 text-warning"><CalendarClock className="h-5 w-5" /></div>
          <div className="min-w-0"><p className="text-xs text-muted-foreground">Avg Daily Spending</p><p className="truncate font-semibold">{formatMoney(avgDaily)}</p></div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Income vs Expenses â€” {rangeLabel}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySeries} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={formatMoney} width={80} />
                <Tooltip contentStyle={{backgroundColor:"#1e293b",border:"none",borderRadius:"0.75rem",fontSize:"12px",color:"#f1f5f9"}} formatter={(v:number,n:string)=>[formatMoney(v),n]} />
                <Legend wrapperStyle={{fontSize:12}} />
                <Bar dataKey="income" name="Income" fill="#4caf8a" radius={[6,6,0,0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#e05c3a" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Spending by Category</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {byCategory.length===0 ? <p className="py-6 text-center text-sm text-muted-foreground">No expense data yet</p> :
              byCategory.map((c,i)=>{const pct=totalExpenses>0?(c.value/totalExpenses)*100:0; return (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{backgroundColor:COLORS[i%COLORS.length]}} /><span>{c.name}</span></div>
                    <span className="text-muted-foreground">{formatMoney(c.value)} Â· {formatPercent(pct)}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full transition-all" style={{width:`${pct}%`,backgroundColor:COLORS[i%COLORS.length]}} /></div>
                </div>);})
            }
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Top Expenses</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {filteredExpenses.length===0 ? <p className="py-6 text-center text-sm text-muted-foreground">No expense data yet</p> :
              [...filteredExpenses].sort((a,b)=>b.amount-a.amount).slice(0,8).map((e,i)=>(
                <div key={e.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{backgroundColor:COLORS[i%COLORS.length]}} />
                    <span className="truncate">{e.title}</span>
                  </div>
                  <span className="text-muted-foreground shrink-0 ml-2">{formatMoney(e.amount)}</span>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="category">
          <div className="space-y-6">
            {/* Category Selection */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Select Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {EXPENSE_CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    const isSelected = selectedCategory === c.name;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCategory(c.name)}
                        className={cn(
                          "relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all duration-200",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"
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
              </CardContent>
            </Card>

            {/* Time Range Selection */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Select Time Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {TIME_RANGES.map((tr) => (
                    <button
                      key={tr.value}
                      type="button"
                      onClick={() => setTimeRange(tr.value)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                        timeRange === tr.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background hover:border-primary/40"
                      )}
                    >
                      {tr.label}
                    </button>
                  ))}
                </div>
                
                {timeRange === "custom" && (
                  <div className="mt-4 flex gap-4">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Start Date</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">End Date</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Analytics */}
            {selectedCategory && categoryStats && (
              <>
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Total Spent" value={formatMoney(categoryStats.total)} icon={TrendingDown} accent="expense" />
                  <StatCard label="Transactions" value={categoryStats.transactionCount.toString()} icon={Tag} accent="primary" />
                  <StatCard label="Average Expense" value={formatMoney(categoryStats.averageExpense)} icon={Wallet} accent="warning" />
                  <StatCard label="Avg Daily Spending" value={formatMoney(categoryStats.averageDailySpending)} icon={CalendarClock} accent="income" />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Card className="shadow-soft"><CardContent className="flex items-center gap-3 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-expense/10 text-expense"><Trophy className="h-5 w-5" /></div>
                    <div className="min-w-0"><p className="text-xs text-muted-foreground">Highest Expense</p><p className="truncate font-semibold">{categoryStats.highestExpense?.title??"â€”"}</p><p className="text-sm text-expense">{formatMoney(categoryStats.highestExpense?.amount||0)}</p></div>
                  </CardContent></Card>
                  <Card className="shadow-soft"><CardContent className="flex items-center gap-3 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-income/10 text-income"><TrendingUp className="h-5 w-5" /></div>
                    <div className="min-w-0"><p className="text-xs text-muted-foreground">Lowest Expense</p><p className="truncate font-semibold">{categoryStats.lowestExpense?.title??"â€”"}</p><p className="text-sm text-income">{formatMoney(categoryStats.lowestExpense?.amount||0)}</p></div>
                  </CardContent></Card>
                  <Card className="shadow-soft"><CardContent className="flex items-center gap-3 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Store className="h-5 w-5" /></div>
                    <div className="min-w-0"><p className="text-xs text-muted-foreground">% of Total Spending</p><p className="truncate font-semibold">{formatPercent(categoryStats.percentageOfTotal)}</p></div>
                  </CardContent></Card>
                </div>

                {/* Spending Chart */}
                {categorySpendingChart.length > 0 && (
                  <Card className="mb-6 shadow-soft">
                    <CardHeader><CardTitle className="text-base">Spending Over Time â€” {selectedCategory}</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={categorySpendingChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis dataKey="date" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
                          <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={formatMoney} width={70} />
                          <Tooltip contentStyle={{backgroundColor:"#1e293b",border:"none",borderRadius:"0.75rem",fontSize:"12px",color:"#f1f5f9"}} formatter={(v:number)=>[formatMoney(v),"Spent"]} />
                          <Line type="monotone" dataKey="amount" stroke="#3b9ede" strokeWidth={2.5} dot={{r:4,fill:"#3b9ede"}} activeDot={{r:6}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Transaction List */}
                <Card className="shadow-soft">
                  <CardHeader><CardTitle className="text-base">Transactions â€” {selectedCategory} ({dateRangeLabel})</CardTitle></CardHeader>
                  <CardContent>
                    {categoryExpenses.length === 0 ? (
                      <p className="py-6 text-center text-sm text-muted-foreground">No transactions found for this category and time range</p>
                    ) : (
                      <div className="space-y-2">
                        {categoryExpenses.map((e) => (
                          <div key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Tag className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{e.title}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(e.date, settings.dateFormat)}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-expense">{formatMoney(e.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {!selectedCategory && (
              <Card className="shadow-soft">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Store className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">Select a category above to view detailed analysis</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

