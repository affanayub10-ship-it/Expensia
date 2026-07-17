import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { INCOME_CATEGORIES } from "@/lib/mock-data";
import { getNextDate } from "@/lib/income-recurrence";
import type { Income, IncomeRecurrence } from "@/lib/mock-data";



const RECURRENCES: IncomeRecurrence[] = ["One-time", "Daily", "Weekly", "Monthly", "Yearly"];

const FEATURES = [
  { icon: TrendingUp, text: "Real-time expense tracking" },
  { icon: ShieldCheck, text: "Secure & private by default" },
  { icon: Sparkles, text: "Smart budgeting insights" },
];

interface IncomeEntry {
  id: string;
  source: string;
  amount: number;
  category: string;
  recurrence: IncomeRecurrence;
  date: string;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, completeOnboarding } = useAuth();
  const { addIncome, settings } = useApp();

  const [step, setStep] = useState<"welcome" | "income" | "complete">("welcome");
  const [incomes, setIncomes] = useState<IncomeEntry[]>([]);
  const [currentIncome, setCurrentIncome] = useState<IncomeEntry>({
    id: Math.random().toString(36).slice(2, 10),
    source: "",
    amount: 0,
    category: "Salary",
    recurrence: "Monthly",
        date: new Date().toISOString().slice(0, 10),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleAddIncome = () => {
    if (!currentIncome.source.trim()) {
      toast.error("Please enter an income source");
      return;
    }
    if (!currentIncome.amount || currentIncome.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIncomes([...incomes, { ...currentIncome, id: Math.random().toString(36).slice(2, 10) }]);
    setCurrentIncome({
      id: Math.random().toString(36).slice(2, 10),
      source: "",
      amount: 0,
      category: "Salary",
      recurrence: "Monthly",
            date: new Date().toISOString().slice(0, 10),
    });
    toast.success("Income added");
  };

  const handleRemoveIncome = (id: string) => {
    setIncomes(incomes.filter((i) => i.id !== id));
  };

  const handleCompleteOnboarding = async () => {
    if (incomes.length === 0) {
      toast.error("Please add at least one income source");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save all incomes to database
      for (const income of incomes) {
        const nextDate =
          income.recurrence === "One-time" ? undefined : getNextDate(income.date, income.recurrence);
        
        await addIncome({
          id: "",
          source: income.source,
          amount: income.amount,
          date: income.date,
          category: income.category,
          recurrence: income.recurrence,
          nextDate: nextDate,
        } as Income);
      }

      // Mark onboarding as complete in database
      const result = await completeOnboarding();
      if (!result.success) {
        throw new Error(result.error || "Failed to mark onboarding complete");
      }

      setStep("complete");
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to save income:", error);
      toast.error("Failed to save income. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      const result = await completeOnboarding();
      if (!result.success) {
        toast.error(result.error || "Failed to skip onboarding");
        return;
      }
      navigate("/");
    } catch (error) {
      console.error("Failed to skip onboarding:", error);
      toast.error("Failed to skip onboarding. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5">
      {/* Welcome Step */}
      {step === "welcome" && (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl space-y-8">
            {/* Logo & Title */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Wallet className="h-7 w-7" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Welcome to Expensia
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Let's get your finances organized. Start by adding your income sources.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.text}
                  className="rounded-xl border border-border bg-card p-4 text-center"
                >
                  <feature.icon className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm font-medium text-foreground">{feature.text}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={() => setStep("income")}
                className="gap-2"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleSkip}
              >
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Income Step */}
      {step === "income" && (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl space-y-6">
            {/* Header */}
            <div>
              <button
                onClick={() => setStep("welcome")}
                className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Add Your Income Sources
              </h2>
              <p className="mt-2 text-muted-foreground">
                Add one or more income sources. You can always update these later.
              </p>
            </div>

            {/* Income Form */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="source" className="text-xs font-medium">
                    Income Source
                  </Label>
                  <Input
                    id="source"
                    value={currentIncome.source}
                    onChange={(e) =>
                      setCurrentIncome({ ...currentIncome, source: e.target.value })
                    }
                    placeholder="e.g. Monthly salary"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="amount" className="text-xs font-medium">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={currentIncome.amount || ""}
                    onChange={(e) =>
                      setCurrentIncome({
                        ...currentIncome,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="category" className="text-xs font-medium">
                    Category
                  </Label>
                  <Select
                    value={currentIncome.category}
                    onValueChange={(v) =>
                      setCurrentIncome({ ...currentIncome, category: v })
                    }
                  >
                    <SelectTrigger id="category">
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
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="recurrence" className="text-xs font-medium">
                    Frequency
                  </Label>
                  <Select
                    value={currentIncome.recurrence}
                    onValueChange={(v) =>
                      setCurrentIncome({
                        ...currentIncome,
                        recurrence: v as IncomeRecurrence,
                      })
                    }
                  >
                    <SelectTrigger id="recurrence">
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
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-1">
                <div className="grid gap-1.5">
                  <Label htmlFor="date" className="text-xs font-medium">
                    Start Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={currentIncome.date}
                    onChange={(e) =>
                      setCurrentIncome({ ...currentIncome, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button                onClick={handleAddIncome}
                variant="outline"
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Income Source
              </Button>
            </div>

            {/* Income List */}
            {incomes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Added Income Sources ({incomes.length})
                </h3>
                <div className="space-y-2">
                  {incomes.map((income) => (
                    <div
                      key={income.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{income.source}</p>
                        <p className="text-xs text-muted-foreground">
                          {income.amount.toFixed(2)} Â· {income.category} Â· {income.recurrence}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveIncome(income.id)}
                        className="ml-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                onClick={handleSkip}
              >
                Skip for now
              </Button>
              <Button
                onClick={handleCompleteOnboarding}
                disabled={incomes.length === 0 || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Step */}
      {step === "complete" && (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-income/10 p-4">
                <CheckCircle2 className="h-12 w-12 text-income" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                All Set!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Your income sources have been saved. Redirecting to dashboard...
              </p>
            </div>
            <div className="h-1 w-12 mx-auto bg-gradient-to-r from-primary to-income rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}


