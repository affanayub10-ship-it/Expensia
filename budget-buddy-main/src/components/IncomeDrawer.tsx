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
import { UploadCloud, Repeat, CalendarDays, X, FileText } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { INCOME_CATEGORIES, type Income, type IncomeRecurrence } from "@/lib/mock-data";
import { CURRENCIES } from "@/lib/format";
import { getNextDate, recurrenceLabel } from "@/lib/income-recurrence";

const RECURRENCES: IncomeRecurrence[] = ["One-time", "Daily", "Weekly", "Monthly", "Yearly"];

function emptyIncome(currency: string): Income {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: "",
    source: "",
    amount: 0,
    date: today,
    recurrence: "Monthly",
    nextDate: getNextDate(today, "Monthly"),
    category: "Salary",
    currency,
  };
}

export function IncomeDrawer({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing?: Income | null;
}) {
  const { addIncome, updateIncome, settings } = useApp();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<{ name: string; url: string; type: string } | null>(null);
  const [form, setForm] = useState<Income>(emptyIncome(settings.currency));

  useEffect(() => {
    if (open) {
      setForm(editing ?? emptyIncome(settings.currency));
      setAttachment(null);
    }
  }, [open, editing, settings]);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({ name: file.name, url: reader.result as string, type: file.type });
      toast.success(`Attached: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const set = <K extends keyof Income>(k: K, v: Income[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // When recurrence or start date changes, recalculate nextDate
  const handleRecurrenceChange = (r: IncomeRecurrence) => {
    setForm((f) => ({
      ...f,
      recurrence: r,
      nextDate: r === "One-time" ? undefined : getNextDate(f.date, r),
    }));
  };

  const handleStartDateChange = (d: string) => {
    setForm((f) => ({
      ...f,
      date: d,
      nextDate: f.recurrence === "One-time" ? undefined : getNextDate(d, f.recurrence),
    }));
  };

  const submit = () => {
    if (!form.source.trim()) return toast.error("Income source is required");
    if (!form.amount || form.amount <= 0) return toast.error("Enter a valid amount");
    if (!form.date) return toast.error("Start date is required");

    if (editing) {
      updateIncome(form);
      toast.success("Income updated");
    } else {
      addIncome(form);
      const msg =
        form.recurrence === "One-time"
          ? "Income added"
          : `${recurrenceLabel(form.recurrence)} income scheduled — first entry added`;
      toast.success(msg);
    }
    onOpenChange(false);
  };

  const isRecurring = form.recurrence !== "One-time";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg h-[85vh] sm:h-full rounded-t-2xl sm:rounded-t-none"
      >
        <SheetHeader className="pb-4">
          <SheetTitle>{editing ? "Edit income" : "Add income"}</SheetTitle>
          <SheetDescription>
            Log money coming in. Set a recurrence to auto-add it on schedule.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-1 py-2">
          {/* Source */}
          <Field label="Income source">
            <Input
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
              placeholder="e.g. Monthly salary, Freelance project"
            />
          </Field>

          {/* Amount + Currency */}
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
          </div>

          {/* Recurrence — the key question */}
          <Field label="How often do you receive this?">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {RECURRENCES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRecurrenceChange(r)}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition-all ${
                    form.recurrence === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {r === "One-time" ? "One-time" : r}
                </button>
              ))}
            </div>
          </Field>

          {/* Start date */}
          <Field label={isRecurring ? "Start date (first payment)" : "Date received"}>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={form.date}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </Field>

          {/* Next occurrence preview */}
          {isRecurring && form.nextDate && (
            <div className="flex items-center gap-2 rounded-xl border border-income/30 bg-income/5 px-3 py-2.5 text-sm text-income">
              <Repeat className="h-4 w-4 shrink-0" />
              <span>
                Next auto-entry: <strong>{form.nextDate}</strong> · repeats{" "}
                {form.recurrence.toLowerCase()}
              </span>
            </div>
          )}

          {/* Category */}
          <Field label="Category">
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INCOME_CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <Textarea
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Optional notes (employer, project name, etc.)"
              rows={2}
            />
          </Field>

          {/* Attachment */}
          <Field label="Attachment">
            {attachment ? (
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {attachment.type.startsWith("image/") ? (
                      <img
                        src={attachment.url}
                        alt="Attachment preview"
                        className="h-12 w-12 rounded-lg object-cover shrink-0 border border-border"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted border border-border">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <span className="truncate text-xs text-muted-foreground">{attachment.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Remove attachment"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-5 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50">
                <UploadCloud className="h-5 w-5" />
                <span>Click or drag to upload</span>
                <span className="text-[11px]">JPEG, PNG, PDF · max 10 MB</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,application/pdf"
                  className="hidden"
                  onChange={handleAttachmentChange}
                />
              </label>
            )}
          </Field>
        </div>

        <SheetFooter className="mt-2">
          <Button onClick={submit}>{editing ? "Save changes" : "Add income"}</Button>
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
