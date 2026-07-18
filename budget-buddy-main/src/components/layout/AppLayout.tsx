import { type ReactNode, useState, useEffect, useRef } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  BarChart3,
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  X,
  ChevronDown,
  PiggyBank,
  Brain,
  HelpCircle,
  Lock,
  Sparkles,
  Crown,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PremiumUpgradeModal } from "@/components/PremiumUpgradeModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Income", to: "/income", icon: ArrowUpCircle },
  { label: "Expenses", to: "/expenses", icon: ArrowDownCircle },
  { label: "Budgets", to: "/budgets", icon: Wallet },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Savings", to: "/savings", icon: PiggyBank },
  { label: "Predictions", to: "/predictions", icon: Brain },
  { label: "Premium", to: "/premium", icon: Crown },
  { label: "Settings", to: "/settings", icon: SettingsIcon },
];

const BOTTOM_NAV: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Expenses", to: "/expenses", icon: ArrowDownCircle },
  { label: "Budgets", to: "/budgets", icon: Wallet },
  { label: "Settings", to: "/settings", icon: SettingsIcon },
];

function NotificationBell() {
  const { notifications, markNotificationsRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <DropdownMenu onOpenChange={(o) => o && markNotificationsRead()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-expense px-1 text-[10px] font-semibold text-expense-foreground">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-80">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex flex-col gap-0.5 px-2 py-2.5 hover:bg-muted/50 rounded-md"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{n.title}</span>
                <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
              </div>
              <span className="text-xs text-muted-foreground">{n.message}</span>
            </div>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PREMIUM_ROUTES = new Set(["/budgets", "/savings", "/predictions"]);

export function AppLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, settings } = useApp();
  const { isAuthenticated, isLoading, logout, onboardingComplete, user } = useAuth();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Resize listener to track mobile breakpoint
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // One-time menu pulse cue logic
  useEffect(() => {
    const hasSeenPulse = localStorage.getItem("expensia-seen-menu-pulse");
    if (!hasSeenPulse) {
      setShouldPulse(true);
      const timer = setTimeout(() => {
        setShouldPulse(false);
        localStorage.setItem("expensia-seen-menu-pulse", "true");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  // One-time educational menu tooltip logic
  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem("expensia-seen-menu-tooltip");
    if (!hasSeenTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleMenuClick = () => {
    setIsDrawerOpen((v) => !v);
    if (shouldPulse) {
      setShouldPulse(false);
      localStorage.setItem("expensia-seen-menu-pulse", "true");
    }
  };

  // Esc key & Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setIsDrawerOpen(false);
        toggleBtnRef.current?.focus();
      }

      if (e.key === "Tab" && isDrawerOpen && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  // Focus trap focus first element
  useEffect(() => {
    if (isDrawerOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll('a[href], button');
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isDrawerOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Swipe Left gesture to close
  useEffect(() => {
    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      if (isLeftSwipe && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      window.addEventListener("touchstart", onTouchStart);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDrawerOpen, touchStart, touchEnd]);

  const isLoginPage = pathname === "/login";
  const isOnboardingPage = pathname === "/onboarding";
  const isResetPasswordPage = pathname === "/reset-password";
  const isVerifyPage = pathname === "/verify";
  const isVerifyEmailPage = pathname === "/verify-email";

  const initials = settings.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const avatar = settings.avatar;

  if (isLoading) return null;

  // Unauthenticated user redirection
  if (!isAuthenticated && !isLoginPage && !isOnboardingPage && !isResetPasswordPage && !isVerifyPage && !isVerifyEmailPage) {
    setTimeout(() => navigate({ to: "/login" }), 0);
    return null;
  }

  // Authenticated but email unverified redirection
  if (isAuthenticated && user && user.verified === false && !isVerifyEmailPage && !isVerifyPage) {
    setTimeout(() => navigate({ to: "/verify-email" }), 0);
    return null;
  }

  // Authenticated but onboarding not done redirection
  if (isAuthenticated && user?.verified !== false && !onboardingComplete && !isLoginPage && !isOnboardingPage && !isResetPasswordPage && !isVerifyPage && !isVerifyEmailPage) {
    setTimeout(() => navigate({ to: "/onboarding" }), 0);
    return null;
  }

  if (isLoginPage || isOnboardingPage || isResetPasswordPage || isVerifyPage || isVerifyEmailPage) return <>{children}</>;

  function handleSignOut() {
    logout();
    void navigate({ to: "/login" });
  }

  // Reusable avatar component used in sidebar + header
  function UserAvatar({ size = "md", noZoom }: { size?: "sm" | "md"; noZoom?: boolean }) {
    const cls = size === "sm" ? "h-8 w-8" : "h-9 w-9";
    const textCls = size === "sm" ? "text-xs" : "text-sm";
    return (
      <Avatar
        className={cn(cls, !noZoom && avatar ? "cursor-zoom-in" : "")}
        onClick={!noZoom && avatar ? () => setLightboxOpen(true) : undefined}
      >
        {avatar && <AvatarImage src={avatar} alt={settings.name} className="object-cover" />}
        <AvatarFallback className={cn("bg-primary/10 text-primary font-medium", textCls)}>
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* ── Lightbox ── */}
      {lightboxOpen && avatar && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={avatar}
              alt={settings.name}
              className="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="mt-3 text-center text-sm font-medium text-white/80">{settings.name}</p>
          </div>
        </div>
      )}

      {/* Custom Styles for pulse animations */}
      <style>{`
        @keyframes menuPulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px 6px rgba(20, 184, 166, 0.7);
            transform: scale(1.05);
          }
        }
        .animate-menu-pulse {
          animation: menuPulseGlow 1.6s infinite ease-in-out;
        }
      `}</style>

      {/* Backdrop (mobile only) */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Sidebar Drawer (mobile only) */}
      <aside
        ref={drawerRef}
        aria-hidden={!isDrawerOpen}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:hidden",
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            Expensia
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            // Hide items already present in the bottom navigation
            if (["Dashboard", "Expenses", "Budgets", "Settings"].includes(item.label)) {
              return null;
            }
            const isPremiumRoute = PREMIUM_ROUTES.has(item.to);
            const locked = isPremiumRoute && !isPremium;
            return (
              <Link
                key={item.to}
                to={locked ? "#" : item.to}
                onClick={(e) => {
                  if (locked) {
                    e.preventDefault();
                    setUpgradeOpen(true);
                  }
                  setIsDrawerOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  locked && "opacity-60",
                  isActive(item.to)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            Expensia
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const isPremiumRoute = PREMIUM_ROUTES.has(item.to);
            const locked = isPremiumRoute && !isPremium;
            return (
              <Link
                key={item.to}
                to={locked ? "#" : item.to}
                onClick={(e) => {
                  if (locked) { e.preventDefault(); setUpgradeOpen(true); }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  locked && "opacity-60",
                  isActive(item.to)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
              </Link>
            );
          })}
        </nav>
        {/* Sidebar bottom: avatar + name/email */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <UserAvatar size="md" />
            <Link to="/settings" className="min-w-0 flex-1 hover:opacity-80">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{settings.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{settings.email}</p>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          {/* Logo (mobile only) */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Expensia
            </span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            {/* Hamburger menu button (mobile only) */}
            <div className="relative flex items-center">
              <Button
                ref={toggleBtnRef}
                variant="ghost"
                size="icon"
                className={cn(
                  "lg:hidden rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:text-primary transition-all duration-200",
                  shouldPulse && "animate-menu-pulse"
                )}
                onClick={() => {
                  handleMenuClick();
                  setShowTooltip(false);
                  localStorage.setItem("expensia-seen-menu-tooltip", "true");
                }}
                aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
                aria-expanded={isDrawerOpen}
              >
                {isDrawerOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              {/* Educational discoverability popover tooltip */}
              {showTooltip && !isDrawerOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-xl bg-primary p-3.5 text-primary-foreground shadow-2xl animate-bounce lg:hidden text-left border border-primary-foreground/15">
                  <div className="absolute -top-1.5 right-3.5 h-3 w-3 rotate-45 bg-primary" />
                  <p className="text-xs font-semibold leading-relaxed">
                    💡 Tap here to find Income, Savings, Reports, Predictions, and more!
                  </p>
                  <div className="mt-2.5 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip(false);
                        localStorage.setItem("expensia-seen-menu-tooltip", "true");
                      }}
                      className="rounded-lg bg-primary-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary-foreground/90 transition-colors"
                    >
                      Got it
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setHelpOpen(true)}
              aria-label="Help"
              className="hidden lg:inline-flex"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden lg:inline-flex"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1.5 rounded-full px-2">
                  <UserAvatar size="sm" noZoom />
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>{settings.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">Profile & Settings</Link>
                </DropdownMenuItem>
                {avatar && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLightboxOpen(true)}>
                      View Picture
                    </DropdownMenuItem>
                  </>
                )}
                
                {/* Mobile-only menu items */}
                {isMobile && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleTheme} className="flex items-center justify-between">
                      <span>Theme Mode</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        {theme === "dark" ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-blue-500" />}
                        {theme === "dark" ? "Light" : "Dark"}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setHelpOpen(true)} className="flex items-center justify-between">
                      <span>Help Center</span>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Help dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>How to use Expensia</DialogTitle>
            <DialogDescription>A quick guide to every section of the app.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 text-sm">
            <Section title="Dashboard">
              Your financial overview. See your current balance, total income, expenses, and remaining budget at a glance. The monthly chart shows income vs spending over the last 6 months. The pie chart breaks down spending by category.
            </Section>
            <Section title="Expenses">
              Every expense you add appears here, 20 per page. Use the search bar to find by title or category. Filter by date range, category, or sort by date/amount. The summary card shows totals for the current filter. Click <strong>Add expense</strong> to log a new one — set amount with the slider, pick a category, and add optional notes or a receipt.
            </Section>
            <Section title="Income">
              Track money coming in. Search by source or category, filter by category, and sort by date/amount/source. Inline quick-add for $50/$100/$200/$500/$1000, or open the drawer for a full form with slider. Set recurring income (daily/weekly/monthly/yearly) and the app auto-advances the next date.
            </Section>
            <Section title="Budgets">
              Set monthly spending limits per category. The card shows progress with color coding (green = safe, yellow = near limit, red = exceeded). <strong>Hover</strong> any budget card to see a breakdown of transactions in that category. Alerts appear at the top when you're close to or over a limit.
            </Section>
            <Section title="Savings">
              Create savings goals with a target amount. Each goal shows your progress bar. Use <strong>Add $100</strong> / <strong>Withdraw $100</strong> for quick changes, or click <strong>Custom</strong> to open a slider for any amount. Edit or delete goals with the pencil / trash buttons.
            </Section>
            <Section title="Reports">
              Visual breakdown of your spending — category distribution, spending trends over time, and monthly comparisons. Useful for spotting where your money goes.
            </Section>
            <Section title="Predictions">
              AI-powered spending predictions based on your history. Shows forecasted amounts for the next period and highlights categories that may need attention.
            </Section>
            <Section title="Settings">
              Customize your experience — toggle dark/light theme, change your name or avatar, set your preferred date format and currency, and manage notification preferences.
            </Section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom nav (mobile only) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
          {BOTTOM_NAV.map((item) => {
            const isPremiumRoute = PREMIUM_ROUTES.has(item.to);
            const locked = isPremiumRoute && !isPremium;
            return (
              <Link
                key={item.to}
                to={locked ? "#" : item.to}
                onClick={(e) => {
                  if (locked) {
                    e.preventDefault();
                    setUpgradeOpen(true);
                  }
                }}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors",
                  isActive(item.to) ? "text-primary" : "text-muted-foreground",
                  locked && "opacity-60",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {locked && <Lock className="absolute -right-2 -top-0.5 h-3 w-3 text-muted-foreground" />}
              </Link>
            );
          })}
        </div>
      </nav>

      <PremiumUpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-1 font-semibold text-foreground">{title}</h4>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export { Badge };
