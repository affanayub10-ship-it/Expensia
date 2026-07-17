import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Crown, 
  Users, 
  TrendingUp, 
  Search, 
  RefreshCw, 
  Calendar,
  Mail,
  User,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/shared";
import { toast } from "sonner";

interface SubscriptionWithUser {
  id: string;
  user_id: string;
  user_name: string | null;
  user_email: string;
  subscription_plan: string;
  subscription_status: string;
  billing_cycle: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  is_active_premium: boolean;
}

interface SubscriptionStats {
  total_users: number;
  free_users: number;
  premium_users: number;
  active_premium: number;
  canceled_premium: number;
  monthly_subscribers: number;
  yearly_subscribers: number;
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithUser[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<"all" | "free" | "premium">("all");

  const loadData = async () => {
    setLoading(true);
    try {
      // Load subscriptions with user info
      const { data: subsData, error: subsError } = await supabase
        .from("subscriptions_with_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (subsError) throw subsError;
      setSubscriptions(subsData || []);

      // Load stats
      const { data: statsData, error: statsError } = await supabase
        .rpc("get_subscription_stats");

      if (statsError) throw statsError;
      if (statsData && statsData.length > 0) {
        setStats(statsData[0]);
      }

      toast.success("Subscriptions loaded");
    } catch (err) {
      console.error("Failed to load subscriptions:", err);
      toast.error(`Failed to load data: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = 
      sub.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan = 
      filterPlan === "all" || sub.subscription_plan === filterPlan;

    return matchesSearch && matchesPlan;
  });

  const premiumSubscriptions = filteredSubscriptions.filter(
    (sub) => sub.subscription_plan === "premium"
  );

  return (
    <>
      <PageHeader
        title="Subscription Management"
        description="View and manage all user subscriptions"
        icon={Crown}
      />

      <div className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats.total_users}</p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Premium Users</p>
                    <p className="text-2xl font-bold text-income">{stats.active_premium}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.canceled_premium} canceling
                    </p>
                  </div>
                  <Crown className="h-8 w-8 text-income" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Plans</p>
                    <p className="text-2xl font-bold">{stats.monthly_subscribers}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Yearly Plans</p>
                    <p className="text-2xl font-bold">{stats.yearly_subscribers}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>
              {filteredSubscriptions.length} subscription{filteredSubscriptions.length !== 1 ? "s" : ""}
              {filterPlan !== "all" && ` (${filterPlan})`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant={filterPlan === "all" ? "default" : "outline"}
                onClick={() => setFilterPlan("all")}
              >
                All
              </Button>
              <Button
                variant={filterPlan === "free" ? "default" : "outline"}
                onClick={() => setFilterPlan("free")}
              >
                Free
              </Button>
              <Button
                variant={filterPlan === "premium" ? "default" : "outline"}
                onClick={() => setFilterPlan("premium")}
              >
                Premium
              </Button>
              <Button variant="outline" onClick={loadData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* Premium Subscribers Table */}
            {filterPlan === "premium" || filterPlan === "all" ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Billing</TableHead>
                      <TableHead>Period End</TableHead>
                      <TableHead>Stripe ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {sub.user_name || "No name"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{sub.user_email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={sub.subscription_plan === "premium" ? "default" : "secondary"}
                              className={sub.subscription_plan === "premium" ? "bg-income" : ""}
                            >
                              {sub.subscription_plan === "premium" && (
                                <Crown className="h-3 w-3 mr-1" />
                              )}
                              {sub.subscription_plan}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={sub.subscription_status === "active" ? "default" : "outline"}
                            >
                              {sub.subscription_status}
                            </Badge>
                            {sub.cancel_at_period_end && (
                              <Badge variant="outline" className="ml-1 text-amber-600 border-amber-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Canceling
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="capitalize text-sm">
                              {sub.billing_cycle || "â€”"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {sub.current_period_end 
                                ? new Date(sub.current_period_end).toLocaleDateString()
                                : "â€”"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {sub.stripe_customer_id ? (
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                  {sub.stripe_customer_id.slice(0, 12)}...
                                </code>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">â€”</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

