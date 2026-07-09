import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Pencil, Trash2, ArrowUpDown } from "lucide-react";
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
import { formatDate, formatMoney, convertAmount } from "@/lib/format";
import { INCOME_CATEGORIES, type Income } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/income")({
  component: IncomePage,
});

type SortKey = "date" | "amount" | "category" | "source";

function IncomePage() {
  const { income, deleteIncome, settings } = useApp();
  const cur = settings.currency;
  const dateFmt = settings.dateFormat;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [asc, setAsc] = useState(false);

  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [toDelete, setToDelete] = useState<Income | null>(null);

  const filtered = useMemo(() => {
    let list = income.filter((i) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        i.source.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        String(i.amount).includes(q);
      const matchesCat = category === "all" || i.category === category;
      return matchesQuery && matchesCat;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "amount") cmp = a.amount - b.amount;
      else if (sortKey === "category") cmp = a.category.localeCompare(b.category);
      else if (sortKey === "source") cmp = a.source.localeCompare(b.source);
      else cmp = a.date.localeCompare(b.date);
      return asc ? cmp : -cmp;
    });
    return list;
  }, [income, query, category, sortKey, asc]);

  const total = filtered.reduce(
    (s, i) => s + convertAmount(i.amount, cur, i.currency),
    0,
  );

  return (
    <>
      <PageHeader
        title="Income"
        description={`${filtered.length} entries · ${formatMoney(total, cur)} total`}
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
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search source, category, amount..."
              className="pl-9"
            />
          </div>
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
        </CardContent>
      </Card>

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
                {filtered.map((i) => (
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
                      +{formatMoney(i.amount, i.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
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
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No income entries match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view */}
          <div className="divide-y divide-border px-4 sm:hidden">
            {filtered.map((i) => (
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
                    <p className="text-sm font-semibold text-income">
                      +{formatMoney(i.amount, i.currency)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-0.5 border-l border-border pl-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                      onClick={() => {
                        setEditing(i);
                        setDrawer(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-expense"
                      onClick={() => setToDelete(i)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No income entries match your filters.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <IncomeDrawer open={drawer} onOpenChange={setDrawer} editing={editing} />

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
              onClick={() => {
                if (toDelete) {
                  deleteIncome(toDelete.id);
                  toast.success("Income deleted");
                }
                setToDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
