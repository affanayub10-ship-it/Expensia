import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Repeat,
  ArrowUpDown,
  Paperclip,
  ChevronDown,
  ChevronRight,
  Wallet,
  BarChart3,
  Trophy,
  TrendingDown,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { PageHeader, CategoryPill, StatusBadge, CategoryIcon } from "@/components/shared";
import { ExpenseDrawer } from "@/components/ExpenseDrawer";
import { useApp } from "@/context/AppContext";
import { formatDate, formatMoney } from "@/lib/format";
import { EXPENSE_CATEGORIES, type Expense } from "@/lib/mock-data";
import { getExpensesWithFilters, getExpensesSummary, type ExpenseSummary } from "@/lib/supabase-db";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/expenses")({ component: Expenses });

type SortKey = "date" | "amount";
type SortOrder = "asc" | "desc";
type GroupKey = "Today" | "Yesterday" | "This Week" | "Older";
type DateChip = "all" | "today" | "thisWeek" | "thisMonth";

const GROUP_ORDER: GroupKey[] = ["Today", "Yesterday", "This Week", "Older"];

function getDateRange(chip: DateChip): { dateFrom?: string; dateTo?: string } {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  if (chip === "today") {
    const s = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return { dateFrom: s, dateTo: s };
  }
  if (chip === "thisWeek") {
    const dayOfWeek = today.getDay();
    const monOff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mon = new Date(today);
    mon.setDate(d + monOff);
    return { dateFrom: mon.toISOString().slice(0, 10) };
  }
  if (chip === "thisMonth") {
    return { dateFrom: `${y}-${String(m + 1).padStart(2, "0")}-01` };
  }
  return {};
}

function getGroupKey(dateStr: string): GroupKey {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const input = new Date(dateStr);
  input.setHours(0, 0, 0, 0);
  if (input.getTime() === today.getTime()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (input.getTime() === yesterday.getTime()) return "Yesterday";
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (input >= weekAgo) return "This Week";
  return "Older";
}

const CHIPS = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "thisWeek", label: "This Week" },
  { id: "thisMonth", label: "This Month" },
  { id: "Food", label: "Food" },
  { id: "Shopping", label: "Shopping" },
  { id: "Bills", label: "Bills" },
  { id: "Entertainment", label: "Entertainment" },
  { id: "Travel", label: "Travel" },
  { id: "highAmount", label: "High Amount" },
];

function Expenses() {
  const { deleteExpense, settings } = useApp();
  const dateFmt = settings.dateFormat;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [dateChip, setDateChip] = useState<DateChip>("all");
  const [catChip, setCatChip] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [toDelete, setToDelete] = useState<Expense | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<GroupKey>>(new Set(["Today"]));

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const effectiveFilters = useMemo(() => {
    const dr = getDateRange(dateChip);
    const isCustom = dateChip === "all" && (customDateFrom || customDateTo);
    return {
      search: debouncedQuery || undefined,
      category: catChip !== "all" ? catChip : undefined,
      dateFrom: dr.dateFrom || (isCustom ? customDateFrom : undefined),
      dateTo: dr.dateTo || (isCustom ? customDateTo : undefined),
      sortBy: sortKey,
      sortOrder,
    };
  }, [debouncedQuery, catChip, dateChip, customDateFrom, customDateTo, sortKey, sortOrder]);

  useEffect(() => {
    let cancelled = false;
    getExpensesSummary(effectiveFilters)
      .then((s) => {
        if (!cancelled) setSummary(s);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [effectiveFilters, refreshKey]);

  const fetchFirstPage = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getExpensesWithFilters({ ...effectiveFilters, page: 1, limit: 20 });
      setExpenses(r.data);
      setHasMore(r.hasMore);
      setPage(1);
    } catch {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [effectiveFilters]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage, refreshKey]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const next = page + 1;
    try {
      const r = await getExpensesWithFilters({ ...effectiveFilters, page: next, limit: 20 });
      setExpenses((prev) => [...prev, ...r.data]);
      setHasMore(r.hasMore);
      setPage(next);
    } catch {
      toast.error("Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }, [effectiveFilters, page, hasMore, loadingMore]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) loadMore();
        },
        { rootMargin: "200px" },
      );
      observerRef.current.observe(node);
    },
    [hasMore, loadingMore, loadMore],
  );

  const groups = useMemo(() => {
    const map = new Map<GroupKey, Expense[]>();
    for (const k of GROUP_ORDER) map.set(k, []);
    for (const e of expenses) map.get(getGroupKey(e.date))?.push(e);
    return GROUP_ORDER.map((k) => ({ key: k, items: map.get(k) || [] })).filter(
      (g) => g.items.length > 0,
    );
  }, [expenses]);

  const toggleSection = (key: GroupKey) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleChip = (id: string) => {
    if (id === "all") {
      setDateChip("all");
      setCatChip("all");
      setSortKey("date");
      setSortOrder("desc");
    } else if (id === "today" || id === "thisWeek" || id === "thisMonth")
      setDateChip((p) => (p === id ? "all" : (id as DateChip)));
    else if (id === "highAmount") {
      if (sortKey === "amount" && sortOrder === "desc") {
        setSortKey("date");
        setSortOrder("desc");
      } else {
        setSortKey("amount");
        setSortOrder("desc");
      }
    } else setCatChip((p) => (p === id ? "all" : id));
  };

  const handleDelete = () => {
    if (!toDelete) return;
    deleteExpense(toDelete.id);
    setExpenses((prev) => prev.filter((e) => e.id !== toDelete.id));
    setToDelete(null);
    toast.success("Expense deleted");
  };

  const afterSave = () => {
    setDrawer(false);
    setRefreshKey((k) => k + 1);
  };

  const isChipActive = (id: string) => {
    if (id === "all")
      return (
        dateChip === "all" && catChip === "all" && !(sortKey === "amount" && sortOrder === "desc")
      );
    if (id === "today" || id === "thisWeek" || id === "thisMonth") return dateChip === id;
    if (id === "highAmount") return sortKey === "amount" && sortOrder === "desc";
    return catChip === id;
  };

  return (
    <>
      <PageHeader
        title="Expenses"
        description={
          summary
            ? `${summary.totalCount} transactions · ${formatMoney(summary.totalAmount)} total`
            : "Loading..."
        }
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setDrawer(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add expense
          </Button>
        }
      />

      {/* Summary Card */}
      <Card className="mb-4 shadow-soft">
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <SummaryTile
              label="Total"
              value={summary ? formatMoney(summary.totalAmount) : "..."}
              icon={Wallet}
              cls="text-expense bg-expense/10"
            />
            <SummaryTile
              label="Transactions"
              value={summary ? String(summary.totalCount) : "..."}
              icon={BarChart3}
              cls="text-primary bg-primary/10"
            />
            <SummaryTile
              label="Highest"
              value={summary ? formatMoney(summary.maxAmount) : "..."}
              icon={Trophy}
              cls="text-warning bg-warning/15"
            />
            <SummaryTile
              label="Average"
              value={summary ? formatMoney(summary.avgAmount) : "..."}
              icon={TrendingDown}
              cls="text-income bg-income/10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Filter Chips */}
      <div className="mb-4 flex flex-wrap gap-1.5 sm:gap-2">
        {CHIPS.map((chip) => (
          <button
            key={chip.id}
            onClick={() => handleChip(chip.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 border select-none active:scale-95",
              isChipActive(chip.id)
                ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground hover:border-primary/40",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Search & Advanced Filters */}
      <Card className="mb-4 shadow-soft">
        <CardContent className="flex flex-col gap-3 p-3 sm:p-4">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[^a-zA-Z0-9\s.\-_@]/g, "");
                setQuery(cleanValue);
              }}
              maxLength={35}
              placeholder="Search by title..."
              className="pl-9"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
          >
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                showFilters && "rotate-180",
              )}
            />
          </button>
          <div
            className={cn(
              "flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out sm:flex-row sm:flex-wrap sm:items-center",
              showFilters ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="w-full sm:w-36"
              />
              <span className="text-muted-foreground text-sm">—</span>
              <Input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="w-full sm:w-36"
              />
            </div>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort: Date</SelectItem>
                <SelectItem value="amount">Sort: Amount</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && expenses.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No expenses found</p>
              <p className="text-xs text-muted-foreground mb-3">
                Try adjusting your filters or add a new expense
              </p>
              <Button
                onClick={() => {
                  setEditing(null);
                  setDrawer(true);
                }}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> Add expense
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collapsible Grouped Sections */}
      {!loading &&
        groups.map(({ key, items }) => {
          const isOpen = expandedSections.has(key);
          return (
            <div key={key} className="mb-3">
              <button
                onClick={() => toggleSection(key)}
                className="flex w-full items-center justify-between rounded-t-xl bg-muted/50 px-4 py-3 text-left transition-colors hover:bg-muted/70"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{key}</span>
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    {items.length}
                  </Badge>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                )}
              </button>
              {isOpen && (
                <Card className="shadow-soft rounded-t-none rounded-b-xl border-t-0">
                  <CardContent className="px-0 sm:px-6">
                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((e) => (
                            <TableRow key={e.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {e.title}
                                  {e.recurrence !== "None" && (
                                    <Badge variant="secondary" className="gap-1 text-[10px]">
                                      <Repeat className="h-3 w-3" /> {e.recurrence}
                                    </Badge>
                                  )}
                                  {e.receipt && (
                                    <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <CategoryPill name={e.category} />
                              </TableCell>
                              <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                                {formatDate(e.date, dateFmt)}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={e.status} />
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-right font-semibold text-expense">
                                -{formatMoney(e.amount)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => {
                                      setEditing(e);
                                      setDrawer(true);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-expense"
                                    onClick={() => setToDelete(e)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {/* Mobile Cards */}
                    <div className="divide-y divide-border px-4 sm:hidden">
                      {items.map((e) => (
                        <div
                          key={e.id}
                          className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <CategoryIcon name={e.category} />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {e.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(e.date, dateFmt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <p className="text-sm font-semibold text-expense">
                              -{formatMoney(e.amount)}
                            </p>
                            <div className="flex flex-col gap-1 border-l border-border pl-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditing(e);
                                  setDrawer(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-expense"
                                onClick={() => setToDelete(e)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}

      {/* Infinite Scroll Sentinel */}
      {hasMore && !loading && (
        <div ref={sentinelRef} className="flex items-center justify-center py-6">
          {loadingMore ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more...
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={loadMore} className="gap-2">
              <Plus className="h-3.5 w-3.5" /> Load more
            </Button>
          )}
        </div>
      )}

      <ExpenseDrawer
        open={drawer}
        onOpenChange={(o) => {
          if (!o) afterSave();
          else setDrawer(true);
        }}
        editing={editing}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription>
              "{toDelete?.title}" will be moved to trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-expense text-expense-foreground hover:bg-expense/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function SummaryTile({
  label,
  value,
  icon: Icon,
  cls,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  cls: string;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 rounded-xl bg-muted/30 p-2.5 sm:p-3 transition-colors hover:bg-muted/50">
      <div
        className={cn(
          "flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl shrink-0",
          cls,
        )}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground truncate">
          {label}
        </p>
        <p className="text-xs sm:text-sm font-bold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}


