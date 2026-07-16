import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { UploadCloud, X, FileText, ChevronDown, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { EXPENSE_CATEGORIES, type Expense, type Recurrence, type Status } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/format";

const RECURRENCES: Recurrence[] = ["None", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"];
const STATUSES: Status[] = ["Paid", "Pending", "Cancelled"];
const SLIDER_MIN = 0;
const SLIDER_MAX = 10000;
const SLIDER_STEP = 10;

function emptyExpense(category: string): Expense {
  return {
    id: "", title: "", amount: 0,
    date: new Date().toISOString().slice(0, 10),
    category, tags: [], status: "Paid", recurrence: "None",
  };
}

export function ExpenseDrawer({ open, onOpenChange, editing }: {
  open: boolean; onOpenChange: (o: boolean) => void; editing?: Expense | null;
}) {
  const { addExpense, updateExpense, settings } = useApp();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptPreview, setReceiptPreview] = useState<{ name: string; url: string; type: string } | null>(null);
  const [form, setForm] = useState<Expense>(emptyExpense(settings.defaultCategory));
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (open) {
      const base = editing ?? emptyExpense(settings.defaultCategory);
      setForm(base);
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
    if (file.size > 10 * 1024 * 1024) { toast.error("File must be under 10 MB"); return; }
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

  const submit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.amount || form.amount <= 0) return toast.error("Enter a valid amount");
    try {
      if (editing) {
        await updateExpense(form);
        toast.success("Expense updated");
      } else {
        await addExpense(form);
        toast.success("Expense added");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save expense");
    }
  };

  const isDirty = editing
    ? JSON.stringify(form) !== JSON.stringify(editing)
    : form.title.trim() !== "" || form.amount > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"} className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg h-[85vh] sm:h-full rounded-t-2xl sm:rounded-t-none">
        <SheetHeader className="pb-4">
          <SheetTitle>{editing ? "Edit expense" : "Add expense"}</SheetTitle>
          <SheetDescription>Record a new transaction and keep your budget on track.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-1 py-2">
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Grocery run" />
          </Field>

          <Field label="Category" required>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {EXPENSE_CATEGORIES.map((c) => {
                const Icon = c.icon;
                const isSelected = form.category === c.name;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set("category", c.name)}
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
          </Field>

          <Field label="Amount (USD)" required>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{formatMoney(form.amount)}</span>
              </div>
              <Slider
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step={SLIDER_STEP}
                value={[form.amount]}
                onValueChange={([v]) => set("amount", v)}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{formatMoney(SLIDER_MIN)}</span>
                <span>{formatMoney(SLIDER_MAX / 2)}</span>
                <span>{formatMoney(SLIDER_MAX)}</span>
              </div>
              <Input 
                type="number" 
                inputMode="decimal" 
                step="0.01" 
                value={form.amount || ""} 
                onChange={(e) => set("amount", parseFloat(e.target.value) || 0)} 
                placeholder="Or enter exact amount" 
                className="mt-2"
              />
            </div>
          </Field>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
          >
            <span>Advanced Options</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          <div className={`grid gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showAdvanced ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
              </Field>
              <Field label="Location">
                <Input value={form.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="Optional" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Status">
                <Select value={form.status} onValueChange={(v) => set("status", v as Status)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Recurrence">
                <Select value={form.recurrence} onValueChange={(v) => set("recurrence", v as Recurrence)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RECURRENCES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field label="Notes">
              <Textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Optional notes" rows={2} />
            </Field>

            <Field label="Receipt">
              <span className="text-[11px] text-muted-foreground">Optional</span>
              {receiptPreview ? (
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {receiptPreview.type.startsWith("image/") ? (
                        <img src={receiptPreview.url} alt="Receipt preview" className="h-12 w-12 rounded-lg object-cover shrink-0 border border-border" />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted border border-border">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <span className="truncate text-xs text-muted-foreground">{receiptPreview.name}</span>
                    </div>
                    <button type="button" onClick={removeReceipt} className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" aria-label="Remove receipt">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50">
                  <UploadCloud className="h-6 w-6" />
                  <span>Click or drag to upload</span>
                  <span className="text-[11px]">JPEG, PNG, PDF · max 10 MB</span>
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="hidden" onChange={handleReceiptChange} />
                </label>
              )}
            </Field>
          </div>
        </div>

        <SheetFooter className="mt-2">
          <Button onClick={submit} disabled={editing ? !isDirty : false}>{editing ? "Save changes" : "Add expense"}</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children, required = false }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-expense ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}
