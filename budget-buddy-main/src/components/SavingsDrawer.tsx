import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { type SavingsGoal } from "@/lib/mock-data";
import { formatMoney } from "@/lib/format";

const SLIDER_MIN = 0;
const SLIDER_MAX = 100000;
const SLIDER_STEP = 100;

export function SavingsDrawer({ open, onOpenChange, editing }: {
  open: boolean; onOpenChange: (o: boolean) => void; editing?: SavingsGoal | null;
}) {
  const { addSavingsGoal, updateSavingsGoal } = useApp();
  const isMobile = useIsMobile();
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState(1000);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [note, setNote] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (editing) {
        setTitle(editing.title);
        setTargetAmount(editing.targetAmount);
        setCurrentAmount(editing.currentAmount);
        setNote(editing.note || "");
      } else {
        setTitle("");
        setTargetAmount(1000);
        setCurrentAmount(0);
        setNote("");
      }
      setShowAdvanced(false);
    }
  }, [open, editing]);

  const submit = async () => {
    if (!title.trim()) return toast.error("Title is required");
    if (targetAmount <= 0) return toast.error("Target amount must be greater than zero");
    setIsSubmitting(true);
    try {
      if (editing) {
        await updateSavingsGoal({ ...editing, title, targetAmount, currentAmount, note: note || undefined });
        toast.success("Savings goal updated");
      } else {
        await addSavingsGoal({ title, targetAmount, currentAmount, note: note || undefined });
        toast.success("Savings goal created");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save savings goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"} className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-lg h-[85vh] sm:h-full rounded-t-2xl sm:rounded-t-none">
        <SheetHeader className="pb-4">
          <SheetTitle>{editing ? "Edit goal" : "New savings goal"}</SheetTitle>
          <SheetDescription>Set a target and track your progress over time.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-1 py-2">
          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Title <span className="text-expense ml-1">*</span></Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Emergency Fund, Vacation" />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Target Amount <span className="text-expense ml-1">*</span></Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-primary/10 px-3 py-1 text-lg font-bold text-primary">
                  {formatMoney(targetAmount)}
                </span>
              </div>
              <Slider
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step={SLIDER_STEP}
                value={[targetAmount]}
                onValueChange={([v]) => setTargetAmount(v)}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{formatMoney(SLIDER_MIN)}</span>
                <span>{formatMoney(SLIDER_MAX / 2)}</span>
                <span>{formatMoney(SLIDER_MAX)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
          >
            <span>Advanced Options</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          <div className={`grid gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showAdvanced ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Current Saved Amount</Label>
              <Input
                type="number"
                value={currentAmount || ""}
                onChange={(e) => setCurrentAmount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Note (Optional - max 100 words)</Label>
              <Textarea
                value={note}
                onChange={(e) => {
                  const val = e.target.value;
                  const words = val.trim().split(/\s+/).filter(Boolean);
                  if (words.length <= 100) {
                    setNote(val);
                  } else {
                    let count = 0;
                    let charIndex = 0;
                    let inWord = false;
                    for (let i = 0; i < val.length; i++) {
                      if (!/\s/.test(val[i])) {
                        if (!inWord) {
                          inWord = true;
                          count++;
                          if (count > 100) break;
                        }
                      } else {
                        inWord = false;
                      }
                      charIndex = i + 1;
                    }
                    setNote(val.slice(0, charIndex));
                    toast.warning("Notes cannot exceed 100 words");
                  }
                }}
                placeholder="Optional notes..."
                rows={2}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="mt-2">
          <Button onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editing ? "Saving..." : "Creating..."}
              </>
            ) : (
              editing ? "Save changes" : "Create goal"
            )}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
