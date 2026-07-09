import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Pencil, Trash2, Repeat, ArrowUpDown, Paperclip } from "lucide-react";
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
import { useApp, useActiveExpenses } from "@/context/AppContext";
import { formatCurrency, formatDate, formatMoney, convertAmount } from "@/lib/format";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, type Expense } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

type SortKey = "date" | "amount" | "category" | "merchant";

function Expenses() {
  const expenses = useActiveExpenses();
  const { deleteExpense, settings } = useApp();
  const cur = settings.currency;
  const dateFmt = settings.dateFormat;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [method, setMethod] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [asc, setAsc] = useState(false);

  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [toDelete, setToDelete] = useState<Expense | null>(null);

  const filtered = useMemo(() => {
    let list = expenses.filter((e) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.merchant ?? "").toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        String(e.amount).includes(q);
      const matchesCat = category === "all" || e.category === category;
      const matchesMethod = method === "all" || e.paymentMethod === method;
      return matchesQuery && matchesCat && matchesMethod;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "amount") cmp = a.amount - b.amount;
      else if (sortKey === "category") cmp = a.category.localeCompare(b.category);
      else if (sortKey === "merchant") cmp = (a.merchant ?? "").localeCompare(b.merchant ?? "");
      else cmp = a.date.localeCompare(b.date);
      return asc ? cmp : -cmp;
    });
    return list;
  }, [expenses, query, category, method, sortKey, asc]);

  const openEdit = (e: Expense) => {
    setEditing(e);
    setDrawer(true);
  };
  const openAdd = () => {
    setEditing(null);
    setDrawer(true);
  };

  // Total shown in header: convert each expense to user's display currency
  const total = filtered.reduce((s, e) => s + convertAmount(e.amount, cur, e.currency), 0);

  return (
    <>
      <PageHeader
        title="Expenses"
        description={`${filtered.length} transactions · ${formatMoney(total, cur)} total`}
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add expense
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
              placeholder="Search title, merchant, category, amount..."
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All methods</SelectItem>
              {PAYMENT_METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
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
              <SelectItem value="merchant">Sort: Merchant</SelectItem>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Merchant</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {e.title}
                        {e.recurrence !== "None" && (
                          <Badge variant="secondary" className="gap-1 text-[10px]">
                            <Repeat className="h-3 w-3" /> {e.recurrence}
                          </Badge>
                        )}
                        {e.receipt && <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <CategoryPill name={e.category} />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {e.merchant ?? "—"}
                    </TableCell>
                    <TableCell className="hidden whitespace-nowrap text-muted-foreground sm:table-cell">
                      {formatDate(e.date, dateFmt)}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {e.paymentMethod}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={e.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold text-expense">
                      -{formatMoney(e.amount, e.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(e)}
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
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                      No expenses match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile view */}
          <div className="divide-y divide-border px-4 sm:hidden">
            {filtered.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryIcon name={e.category} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-foreground">{e.title}</p>
                      {e.recurrence !== "None" && (
                        <Badge variant="secondary" className="px-1 text-[9px] shrink-0">
                          <Repeat className="h-2.5 w-2.5" />
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(e.date, dateFmt)}
                      </span>
                      {e.merchant && (
                        <span className="text-[10px] text-muted-foreground/80">• {e.merchant}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-expense">
                      -{formatMoney(e.amount, e.currency)}
                    </p>
                    <div className="mt-1 flex justify-end transform scale-90 origin-right">
                      <StatusBadge status={e.status} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5 border-l border-border pl-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground"
                      onClick={() => openEdit(e)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-expense"
                      onClick={() => setToDelete(e)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No expenses match your filters.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <ExpenseDrawer open={drawer} onOpenChange={setDrawer} editing={editing} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription>
              "{toDelete?.title}" will be moved to trash. This can be undone from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-expense text-expense-foreground hover:bg-expense/90"
              onClick={() => {
                if (toDelete) {
                  deleteExpense(toDelete.id);
                  toast.success("Expense deleted");
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
