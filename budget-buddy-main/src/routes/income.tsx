import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Pencil, Trash2, ArrowUpDown, Loader2, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { PageHeader, CategoryPill, CategoryIcon } from "@/components/shared";
import { IncomeDrawer } from "@/components/IncomeDrawer";
import { useApp } from "@/context/AppContext";
import { formatDate, formatMoney } from "@/lib/format";
import { INCOME_CATEGORIES, type Income } from "@/lib/mock-data";
import { getIncomeWithFilters } from "@/lib/supabase-db";
import { toast } from "sonner";

export const Route = createFileRoute("/income")({
  component: IncomePage,
});

type SortKey = "date" | "amount" | "category" | "source";

function IncomePage() {
  const { deleteIncome, settings } = useApp();
  const dateFmt = settings.dateFormat;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [asc, setAsc] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [toDelete, setToDelete] = useState<Income | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [incomes, setIncomes] = useState<Income[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchFirstPage = useCallback(async () => {
    setLoading(true);
    setPage(1);
    try {
      const r = await getIncomeWithFilters({
        page: 1, limit: 20,
        search: debouncedQuery || undefined,
        category: category !== "all" ? category : undefined,
        sortBy: sortKey,
        sortOrder: asc ? "asc" : "desc",
      });
      setIncomes(r.data);
      setHasMore(r.hasMore);
    } catch {
      toast.error("Failed to load income");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, category, sortKey, asc]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const next = page + 1;
    try {
      const r = await getIncomeWithFilters({
        page: next, limit: 20,
        search: debouncedQuery || undefined,
        category: category !== "all" ? category : undefined,
        sortBy: sortKey,
        sortOrder: asc ? "asc" : "desc",
      });
      setIncomes((prev) => [...prev, ...r.data]);
      setPage(next);
      setHasMore(r.hasMore);
    } catch {
      toast.error("Failed to load more income");
    } finally {
      setLoadingMore(false);
    }
  }, [debouncedQuery, category, sortKey, asc, page, hasMore, loadingMore]);

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

  const total = incomes.reduce((s, i) => s + i.amount, 0);

  const handleDelete = () => {
    if (!toDelete) return;
    deleteIncome(toDelete.id);
    setIncomes((list) => list.filter((i) => i.id !== toDelete.id));
    setToDelete(null);
    toast.success("Income deleted");
  };

  return (
    <>
      <PageHeader
        title="Income"
        description={`${incomes.length} entries · ${formatMoney(total)} total`}
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setDrawer(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add income
          </Button>
        }
      />

      <Card className="mb-6 shadow-soft">
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[^a-zA-Z0-9\s.\-_@]/g, "");
                setQuery(cleanValue);
              }}
              maxLength={35}
              placeholder="Search source, category... (max 35 chars)"
              className="pl-9"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-muted/30 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
          >
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            <ArrowUpDown
              className={`h-4 w-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out sm:flex-row sm:flex-wrap sm:items-center ${showFilters ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {INCOME_CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort: Date</SelectItem>
                <SelectItem value="amount">Sort: Amount</SelectItem>
                <SelectItem value="category">Sort: Category</SelectItem>
                <SelectItem value="source">Sort: Source</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAsc((a) => !a)}
              aria-label="Toggle sort direction"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card className="shadow-soft">
          <CardContent className="px-0 sm:px-6">
            {/* Desktop view */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Notes</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomes.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.source}</TableCell>
                      <TableCell>
                        <CategoryPill name={i.category} type="income" />
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                        {formatDate(i.date, dateFmt)}
                      </TableCell>
                      <TableCell className="hidden max-w-[200px] truncate text-muted-foreground md:table-cell">
                        {i.notes ?? "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right font-semibold text-income">
                        +{formatMoney(i.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => {
                              setEditing(i);
                              setDrawer(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-expense"
                            onClick={() => setToDelete(i)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {incomes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                            <Search className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            No income found
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            Try adjusting your filters or add a new income entry
                          </p>
                          <Button
                            onClick={() => {
                              setEditing(null);
                              setDrawer(true);
                            }}
                            size="sm"
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" /> Add income
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile view */}
            <div className="divide-y divide-border px-4 sm:hidden">
              {incomes.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryIcon name={i.category} type="income" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{i.source}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(i.date, dateFmt)}
                        </span>
                        <span className="text-[10px] text-muted-foreground/80">• {i.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-income">+{formatMoney(i.amount)}</p>
                    </div>
                    <div className="flex flex-col gap-1 border-l border-border pl-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => {
                          setEditing(i);
                          setDrawer(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-expense"
                        onClick={() => setToDelete(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {incomes.length === 0 && (
                <div className="py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3 mx-auto">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">No income found</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Try adjusting your filters or add a new income entry
                  </p>
                  <Button
                    onClick={() => {
                      setEditing(null);
                      setDrawer(true);
                    }}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add income
                  </Button>
                </div>
              )}
            </div>

            {hasMore && !loading && (
              <div ref={sentinelRef} className="flex items-center justify-center py-6">
                {loadingMore ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  <Button variant="outline" size="sm" onClick={loadMore} className="gap-2">
                    <ChevronDown className="h-4 w-4" /> Load more
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <IncomeDrawer
        open={drawer}
        onOpenChange={(o) => {
          setDrawer(o);
          if (!o) {
            setEditing(null);
            fetchFirstPage();
          }
        }}
        editing={editing}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this income entry?</AlertDialogTitle>
            <AlertDialogDescription>
              "{toDelete?.source}" will be permanently removed.
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
