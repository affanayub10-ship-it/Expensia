import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadCloud, X, FileText } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { EXPENSE_CATEGORIES, type Expense, type Recurrence, type Status } from "@/lib/mock-data";
import { CURRENCIES } from "@/lib/format";

const RECURRENCES: Recurrence[] = ["None", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];
const STATUSES: Status[] = ["Paid", "Pending", "Cancelled"];

function emptyExpense(currency: string, category: string, pm: string): Expense {
  return {
    id: "",
    title: "",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    category,
    paymentMethod: pm,
    currency, // User's selected currency from settings
    tags: [],
    status: "Paid",
    recurrence: "None",
  };
}

export function ExpenseDrawer({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing?: Expense | null;
}) {
  const { addExpense, updateExpense, paymentMethods, settings } = useApp();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptPreview, setReceiptPreview] = useState<{ name: string; url: string; type: string } | null>(null);
  const [form, setForm] = useState<Expense>(
    emptyExpense(settings.currency, settings.defaultCategory, settings.defaultPaymentMethod),
  );

  useEffect(() => {
    if (open) {
      const base = editing ?? emptyExpense(settings.currency, settings.defaultCategory, settings.defaultPaymentMethod);
      setForm(base);
      // Restore preview if editing an existing receipt
      if (editing?.receipt) {
        const isDataUrl = editing.receipt.startsWith("data:");
        setReceiptPreview(isDataUrl ? { name: "receipt", url: editing.receipt, type: editing.receipt.split(";")[0].replace("data:", "") } : null);
      } else {
        setReceiptPreview(null);
      }
    }
  }, [open, editing, settings]);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      set("receipt", dataUrl);
      setReceiptPreview({ name: file.name, url: dataUrl, type: file.type });
      toast.success(`Attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    set("receipt", undefined);
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const set = <K extends keyof Expense>(k: K, v: Expense[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.amount || form.amount <= 0) return toast.error("Enter a valid amount");
    if (editing) {
      updateExpense(form);
      toast.success("Expense updated");
    } else {
      addExpense(form);
      toast.success("Expense added");
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg h-[85vh] sm:h-full rounded-t-2xl sm:rounded-t-none"
      >
        <SheetHeader className="pb-4">
          <SheetTitle>{editing ? "Edit expense" : "Add expense"}</SheetTitle>
          <SheetDescription>
            Record a new transaction and keep your budget on track.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-1 py-2">
          <Field label="Title">
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Grocery run"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount">
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={form.amount || ""}
                onChange={(e) => set("amount", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </Field>
            <Field label="Date">
              <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Payment method">
              <Select value={form.paymentMethod} onValueChange={(v) => set("paymentMethod", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Merchant">
              <Input
                value={form.merchant ?? ""}
                onChange={(e) => set("merchant", e.target.value)}
                placeholder="e.g. Amazon"
              />
            </Field>
            <Field label="Location">
              <Input
                value={form.location ?? ""}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Currency">
              <Select value={form.currency} onValueChange={(v) => set("currency", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CURRENCIES).map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => set("status", v as Status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Recurrence">
            <Select
              value={form.recurrence}
              onValueChange={(v) => set("recurrence", v as Recurrence)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECURRENCES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Notes">
            <Textarea
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Optional notes"
              rows={2}
            />
          </Field>
          <Field label="Receipt">
            {receiptPreview ? (
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {receiptPreview.type.startsWith("image/") ? (
                      <img
                        src={receiptPreview.url}
                        alt="Receipt preview"
                        className="h-12 w-12 rounded-lg object-cover shrink-0 border border-border"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted border border-border">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <span className="truncate text-xs text-muted-foreground">{receiptPreview.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeReceipt}
                    className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Remove receipt"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50">
                <UploadCloud className="h-6 w-6" />
                <span>Click or drag to upload</span>
                <span className="text-[11px]">JPEG, PNG, PDF · max 10 MB</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  className="hidden"
                  onChange={handleReceiptChange}
                />
              </label>
            )}
          </Field>
        </div>

        <SheetFooter className="mt-2">
          <Button onClick={submit}>{editing ? "Save changes" : "Add expense"}</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
