import { useState, type ReactNode } from "react";
import { Lock, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumUpgradeModal } from "@/components/PremiumUpgradeModal";
import { useSubscription } from "@/context/SubscriptionContext";

interface PremiumGateProps {
  children: ReactNode;
  feature?: string;
}

export function PremiumGate({ children, feature = "this feature" }: PremiumGateProps) {
  const { isPremium, isLoading } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (isLoading) return <>{children}</>;
  if (isPremium) return <>{children}</>;

  return (
    <>
      <div className="relative min-h-[300px] rounded-2xl overflow-hidden">
        <div className="pointer-events-none select-none opacity-20 blur-[3px]" aria-hidden>
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-background/70 backdrop-blur-sm rounded-2xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-4 ring-1 ring-primary/20">
            <Crown className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Premium Feature</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Upgrade to <strong>Premium</strong> to access {feature} and unlock all advanced tools.
          </p>
          <Button className="mt-5 gap-2 rounded-xl" onClick={() => setShowUpgrade(true)}>
            <Sparkles className="h-4 w-4" />
            Upgrade to Premium
          </Button>
        </div>
      </div>
      <PremiumUpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
