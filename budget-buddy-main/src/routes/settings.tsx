import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Lock, Palette, SlidersHorizontal, Upload, Eye, EyeOff, Crown, Sparkles, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { EXPENSE_CATEGORIES } from "@/lib/mock-data";
import { toast } from "sonner";

const getPasswordRequirements = (password: string) => {
  const alphabets = password.match(/[a-zA-Z]/g) || [];
  const numbers = password.match(/[0-9]/g) || [];
  const specialChars = password.match(/[^a-zA-Z0-9]/g) || [];
  
  return {
    length: password.length >= 9 && password.length <= 25,
    letters: alphabets.length >= 2,
    number: numbers.length >= 1,
    symbol: specialChars.length >= 1,
  };
};

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});


const DATE_FORMATS = ["MMM d, yyyy", "dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd"];
const LANGUAGES = ["English", "Spanish", "French", "German", "Hindi"];

function SettingsPage() {
  const { settings, updateSettings, theme, toggleTheme } = useApp();
  const { changePassword } = useAuth();
  const { subscription, isPremium } = useSubscription();
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(settings.avatar ?? null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Eye toggle state for each password field
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const initials = settings.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  // Convert selected image file to base64 for preview and storage
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAvatarPreview(base64);
      toast.success("Picture selected — click Save profile to apply");
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    const reqs = getPasswordRequirements(newPassword);
    if (!reqs.length || !reqs.letters || !reqs.number || !reqs.symbol) {
      toast.error("New password does not meet complexity requirements.");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setIsChangingPassword(true);

    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        toast.success("Password updated successfully!");
        // Clear fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      {/* Suppress browser native password-reveal button so only our custom eye icon shows */}
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input[type="password"]::-webkit-credentials-auto-fill-button,
        input[type="password"]::-webkit-strong-password-auto-fill-button {
          display: none !important;
          visibility: hidden !important;
        }
      `}</style>
      <PageHeader
        title="Settings"
        description="Manage your profile, preferences, and app configuration."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent transition-colors">
                    <Upload className="h-3.5 w-3.5" /> Upload picture
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
                {avatarPreview && avatarPreview !== settings.avatar && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground underline text-left"
                    onClick={() => setAvatarPreview(settings.avatar ?? null)}
                  >
                    Remove
                  </button>
                )}
                <p className="text-[11px] text-muted-foreground">JPEG, PNG, WebP · max 2 MB</p>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button
              onClick={() => {
                updateSettings({ name, email, avatar: avatarPreview ?? undefined });
                toast.success("Profile saved");
              }}
            >
              Save profile
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4 text-primary" /> Change password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Current password</Label>
              <div className="relative">
                <Input
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showCurrentPw ? "Hide password" : "Show password"}
                >
                  {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">New password</Label>
              <div className="relative">
                <Input
                  type={showNewPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showNewPw ? "Hide password" : "Show password"}
                >
                  {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-1 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] space-y-1.5 animate-in fade-in duration-200">
                  <p className="font-semibold text-zinc-400 mb-0.5 text-left">Password Requirements:</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <div className="flex items-center gap-1 text-left">
                      <span className={`h-3.5 w-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${getPasswordRequirements(newPassword).length ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>
                        {getPasswordRequirements(newPassword).length ? "✓" : "○"}
                      </span>
                      <span className={getPasswordRequirements(newPassword).length ? "text-emerald-400 font-medium" : "text-zinc-500"}>9-25 characters</span>
                    </div>
                    <div className="flex items-center gap-1 text-left">
                      <span className={`h-3.5 w-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${getPasswordRequirements(newPassword).letters ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>
                        {getPasswordRequirements(newPassword).letters ? "✓" : "○"}
                      </span>
                      <span className={getPasswordRequirements(newPassword).letters ? "text-emerald-400 font-medium" : "text-zinc-500"}>At least 2 letters</span>
                    </div>
                    <div className="flex items-center gap-1 text-left">
                      <span className={`h-3.5 w-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${getPasswordRequirements(newPassword).number ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>
                        {getPasswordRequirements(newPassword).number ? "✓" : "○"}
                      </span>
                      <span className={getPasswordRequirements(newPassword).number ? "text-emerald-400 font-medium" : "text-zinc-500"}>At least 1 number</span>
                    </div>
                    <div className="flex items-center gap-1 text-left">
                      <span className={`h-3.5 w-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${getPasswordRequirements(newPassword).symbol ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}>
                        {getPasswordRequirements(newPassword).symbol ? "✓" : "○"}
                      </span>
                      <span className={getPasswordRequirements(newPassword).symbol ? "text-emerald-400 font-medium" : "text-zinc-500"}>At least 1 symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs text-muted-foreground">Confirm new password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPw ? "Hide password" : "Show password"}
                >
                  {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Updating..." : "Update password"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4 text-primary" /> Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <div>
                <p className="text-sm font-medium">Dark mode</p>
                <p className="text-xs text-muted-foreground">Toggle light and dark theme</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
            <SettingSelect
              label="Language"
              value={settings.language}
              options={LANGUAGES}
              onChange={(v) => updateSettings({ language: v })}
            />
            <SettingSelect
              label="Date format"
              value={settings.dateFormat}
              options={DATE_FORMATS}
              onChange={(v) => updateSettings({ dateFormat: v })}
            />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <SettingSelect
              label="Default expense category"
              value={settings.defaultCategory}
              options={EXPENSE_CATEGORIES.map((c) => c.name)}
              onChange={(v) => updateSettings({ defaultCategory: v })}
            />
          </CardContent>
        </Card>

        {/* ── Subscription Status Card ── */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              {isPremium
                ? <Crown className="h-4 w-4 text-primary" />
                : <Sparkles className="h-4 w-4 text-muted-foreground" />}
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold capitalize">{subscription.plan} Plan</span>
                {isPremium && subscription.cancelAtPeriodEnd && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-500">Cancelling</span>
                )}
                {isPremium && !subscription.cancelAtPeriodEnd && (
                  <span className="rounded-full bg-income/15 px-2 py-0.5 text-[10px] font-semibold text-income">Active</span>
                )}
                {!isPremium && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {subscription.status === "canceled" ? "Canceled" : "Free"}
                  </span>
                )}
              </div>
              {isPremium && subscription.currentPeriodEnd && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  {subscription.cancelAtPeriodEnd
                    ? `Active until ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`
                    : `Renews ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
                </p>
              )}
              {!isPremium && (
                <p className="text-xs text-muted-foreground">Upgrade to unlock Budgets, Savings & more</p>
              )}
            </div>
            <Link to="/premium">
              <Button variant={isPremium ? "outline" : "default"} size="sm" className="gap-1.5 shrink-0">
                {isPremium ? <><Crown className="h-3.5 w-3.5" /> View Premium</> : <><Sparkles className="h-3.5 w-3.5" /> View Premium</>}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function SettingSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


