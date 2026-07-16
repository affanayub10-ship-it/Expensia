# Supabase Web Dashboard Deployment Guide

## 🌐 Deploy Stripe Webhook via Supabase Web Interface

Since you're using the Supabase web dashboard instead of CLI, follow these steps:

---

## Step 1: Create Payment History Table (2 minutes)

### 1.1 Open SQL Editor
Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/sql/new

### 1.2 Copy & Paste This SQL
```sql
-- Drop everything related to old payment_history
DROP TABLE IF EXISTS public.payment_history CASCADE;
DROP TABLE IF EXISTS payment_history_backup CASCADE;
DROP VIEW IF EXISTS public.payment_stats CASCADE;
DROP FUNCTION IF EXISTS get_user_payment_history(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_payment_statistics() CASCADE;
DROP FUNCTION IF EXISTS get_failed_payments(INT) CASCADE;
DROP FUNCTION IF EXISTS update_payment_history_timestamp() CASCADE;

-- Create new enhanced payment_history table
CREATE TABLE public.payment_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Stripe IDs
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_invoice_id TEXT,
  stripe_charge_id TEXT,
  
  -- Payment Details
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  payment_method_type TEXT,
  payment_method_last4 TEXT,
  payment_method_brand TEXT,
  
  -- Payment Status
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_type TEXT NOT NULL DEFAULT 'subscription',
  failure_reason TEXT,
  
  -- Invoice & Receipt
  invoice_url TEXT,
  receipt_url TEXT,
  invoice_pdf TEXT,
  
  -- Subscription Info
  subscription_plan TEXT,
  billing_cycle TEXT,
  billing_period_start TIMESTAMP WITH TIME ZONE,
  billing_period_end TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  payment_date TIMESTAMP WITH TIME ZONE,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  succeeded_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_payment_history_user_id ON public.payment_history(user_id);
CREATE INDEX idx_payment_history_payment_date ON public.payment_history(payment_date DESC);
CREATE INDEX idx_payment_history_status ON public.payment_history(payment_status);
CREATE INDEX idx_payment_history_stripe_payment_intent ON public.payment_history(stripe_payment_intent_id);
CREATE INDEX idx_payment_history_created_at ON public.payment_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own payment history" ON public.payment_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage payment history" ON public.payment_history
  FOR ALL USING (true) WITH CHECK (true);

-- Create auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_payment_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  IF NEW.payment_status = 'succeeded' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'succeeded') THEN
    NEW.succeeded_at = NOW();
  END IF;
  
  IF NEW.payment_status = 'failed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'failed') THEN
    NEW.failed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_history_timestamp_trigger
  BEFORE UPDATE ON public.payment_history
  FOR EACH ROW EXECUTE FUNCTION update_payment_history_timestamp();

-- Create payment statistics view
CREATE OR REPLACE VIEW public.payment_stats AS
SELECT 
  user_id,
  COUNT(*) as total_payments,
  COUNT(*) FILTER (WHERE payment_status = 'succeeded') as successful_payments,
  COUNT(*) FILTER (WHERE payment_status = 'failed') as failed_payments,
  COUNT(*) FILTER (WHERE payment_status = 'pending') as pending_payments,
  SUM(amount) FILTER (WHERE payment_status = 'succeeded') as total_revenue,
  AVG(amount) FILTER (WHERE payment_status = 'succeeded') as avg_payment_amount,
  MAX(payment_date) FILTER (WHERE payment_status = 'succeeded') as last_successful_payment,
  MIN(payment_date) FILTER (WHERE payment_status = 'succeeded') as first_payment_date
FROM public.payment_history
GROUP BY user_id;

GRANT SELECT ON public.payment_stats TO authenticated;
GRANT SELECT ON public.payment_stats TO service_role;

-- Create helper functions
CREATE OR REPLACE FUNCTION get_user_payment_history(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  amount DECIMAL,
  currency TEXT,
  payment_status TEXT,
  payment_date TIMESTAMPTZ,
  subscription_plan TEXT,
  billing_cycle TEXT,
  receipt_url TEXT,
  failure_reason TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    amount,
    currency,
    payment_status,
    payment_date,
    subscription_plan,
    billing_cycle,
    receipt_url,
    failure_reason
  FROM public.payment_history
  WHERE user_id = p_user_id
  ORDER BY payment_date DESC;
$$;

CREATE OR REPLACE FUNCTION get_payment_statistics()
RETURNS TABLE (
  total_payments BIGINT,
  successful_payments BIGINT,
  failed_payments BIGINT,
  total_revenue NUMERIC,
  monthly_revenue NUMERIC,
  yearly_revenue NUMERIC,
  avg_transaction_value NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*)::BIGINT as total_payments,
    COUNT(*) FILTER (WHERE payment_status = 'succeeded')::BIGINT as successful_payments,
    COUNT(*) FILTER (WHERE payment_status = 'failed')::BIGINT as failed_payments,
    SUM(amount) FILTER (WHERE payment_status = 'succeeded') as total_revenue,
    SUM(amount) FILTER (WHERE payment_status = 'succeeded' AND billing_cycle = 'monthly') as monthly_revenue,
    SUM(amount) FILTER (WHERE payment_status = 'succeeded' AND billing_cycle = 'yearly') as yearly_revenue,
    AVG(amount) FILTER (WHERE payment_status = 'succeeded') as avg_transaction_value
  FROM public.payment_history;
$$;

CREATE OR REPLACE FUNCTION get_failed_payments(days_back INT DEFAULT 7)
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  amount DECIMAL,
  currency TEXT,
  failure_reason TEXT,
  attempted_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    ph.user_id,
    u.email as user_email,
    ph.amount,
    ph.currency,
    ph.failure_reason,
    ph.attempted_at,
    ph.stripe_payment_intent_id
  FROM public.payment_history ph
  INNER JOIN auth.users u ON ph.user_id = u.id
  WHERE ph.payment_status = 'failed'
    AND ph.attempted_at >= NOW() - (days_back || ' days')::INTERVAL
  ORDER BY ph.attempted_at DESC;
$$;

GRANT EXECUTE ON FUNCTION get_user_payment_history(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_failed_payments(INT) TO service_role;

SELECT 'Payment history table created successfully!' as status;
```

### 1.3 Click "Run"
✅ You should see: "Payment history table created successfully!"

---

## Step 2: Deploy Edge Function via Web Dashboard (5 minutes)

### 2.1 Go to Edge Functions
https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions

### 2.2 Click "Create a new function"

### 2.3 Function Settings
- **Name**: `stripe-webhook`
- **Verify JWT**: ❌ **UNCHECK THIS** (important!)

### 2.4 Copy the Webhook Code

Paste this complete code:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

console.log("[webhook] Initializing...");
console.log("[webhook] Environment:", {
  hasStripeKey: !!SECRET_KEY,
  hasSupabaseUrl: !!SUPABASE_URL,
  hasServiceKey: !!SUPABASE_SERVICE_KEY,
  hasWebhookSecret: !!WEBHOOK_SECRET,
});

const stripe = new Stripe(SECRET_KEY, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  console.log("[webhook] 📨 Request received");
  
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No Stripe signature");
    }

    const body = await req.text();
    
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
      console.log("[webhook] ✅ Event verified:", event.type);
    } catch (err) {
      console.error("[webhook] ❌ Verification failed:", (err as Error).message);
      return new Response(`Webhook error: ${(err as Error).message}`, { 
        status: 400,
        headers: corsHeaders,
      });
    }

    const updateSubscription = async (stripeCustomerId: string, data: Record<string, unknown>) => {
      await supabase.from("subscriptions").update(data).eq("stripe_customer_id", stripeCustomerId);
    };

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("[webhook] 💳 Checkout completed");
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        if (userId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          console.log("[webhook] ✅ Sub retrieved:", sub.id);
          
          const billingCycle = sub.items.data[0]?.price?.recurring?.interval === "year" ? "yearly" : "monthly";

          const subscriptionUpdate = {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_plan: "premium",
            subscription_status: "active",
            billing_cycle: billingCycle,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: false,
            updated_at: new Date().toISOString(),
          };

          console.log("[webhook] 📝 Updating subscription...");
          
          const { error: subError } = await supabase
            .from("subscriptions")
            .upsert(subscriptionUpdate, { onConflict: "user_id" });

          if (subError) {
            console.error("[webhook] ❌ Sub update error:", subError);
          } else {
            console.log("[webhook] ✅ Subscription updated!");
          }
          
          // Record payment
          const paymentData = {
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            amount: (session.amount_total ?? 0) / 100,
            currency: session.currency ?? "usd",
            payment_status: "succeeded",
            payment_type: "subscription",
            subscription_plan: "premium",
            billing_cycle: billingCycle,
            payment_date: new Date().toISOString(),
            succeeded_at: new Date().toISOString(),
          };

          const { error: paymentError } = await supabase.from("payment_history").insert(paymentData);

          if (paymentError) {
            console.error("[webhook] ❌ Payment record error:", paymentError);
          } else {
            console.log("[webhook] ✅ Payment recorded!");
          }
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const isPremium = sub.status === "active" || sub.status === "trialing";
        await updateSubscription(sub.customer as string, {
          subscription_plan: isPremium ? "premium" : "free",
          subscription_status: sub.status,
        });
        break;
      }
      
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await updateSubscription(sub.customer as string, {
          subscription_plan: "free",
          subscription_status: "canceled",
        });
        break;
      }
      
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await updateSubscription(invoice.customer as string, {
          subscription_status: "past_due",
        });
        break;
      }
    }

    console.log("[webhook] ✅ Event processed:", event.type);
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[webhook] ❌ ERROR:", msg);
    console.error("[webhook] Stack:", (err as Error).stack);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### 2.5 Click "Deploy"
Wait for deployment to complete (usually 30-60 seconds)

✅ You should see: "Function deployed successfully"

---

## Step 3: Configure Environment Secrets (3 minutes)

### 3.1 Go to Edge Functions Settings
https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/settings/functions

### 3.2 Click "Add new secret" for each of these:

#### Secret 1: STRIPE_SECRET_KEY
```
Name: STRIPE_SECRET_KEY
Value: sk_test_51TshJWRp1jrpNofsZd0pEZuwYDdn3C7UIQkWqJq4LjeeEKbAaPkGfW91Oj3Z0YecGosyudAcs08x32sQQKORRxGU00akdcKwIj
```

#### Secret 2: STRIPE_WEBHOOK_SECRET
```
Name: STRIPE_WEBHOOK_SECRET
Value: whsec_tlX56XMqSyVaSmOSMe0cKOxfPcUbWuLY
```

#### Secret 3: SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://fgsrxibdmkssywrpbxzv.supabase.co
```

#### Secret 4: SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4
```

### 3.3 Verify Secrets
After adding all 4 secrets, you should see them listed:
- ✅ STRIPE_SECRET_KEY
- ✅ STRIPE_WEBHOOK_SECRET
- ✅ SUPABASE_URL
- ✅ SUPABASE_SERVICE_ROLE_KEY

### 3.4 Restart Function (Important!)
After adding secrets, you need to restart the function:
1. Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions
2. Click on `stripe-webhook`
3. Click the "Restart" button (or redeploy)

---

## Step 4: Get Your Webhook URL (1 minute)

### 4.1 Find Function URL
Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions

Click on `stripe-webhook` function

### 4.2 Copy the Function URL
It should be:
```
https://fgsrxibdmkssywrpbxzv.supabase.co/functions/v1/stripe-webhook
```

---

## Step 5: Configure Stripe Webhook (3 minutes)

### 5.1 Go to Stripe Webhooks
https://dashboard.stripe.com/test/webhooks

### 5.2 Click "Add endpoint"

### 5.3 Configure Endpoint
**Endpoint URL**:
```
https://fgsrxibdmkssywrpbxzv.supabase.co/functions/v1/stripe-webhook
```

**Description** (optional):
```
Premium Subscription Webhook
```

**Events to send**:
Click "Select events" and choose:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_failed`

### 5.4 Click "Add endpoint"

### 5.5 Copy Signing Secret
After creating the endpoint, you'll see the signing secret.

It starts with `whsec_...`

**IMPORTANT**: If this is different from the one in Step 3, you need to update it:
1. Go back to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/settings/functions
2. Find `STRIPE_WEBHOOK_SECRET`
3. Update with the new value
4. Restart the function

---

## Step 6: Test the Complete Flow (2 minutes)

### 6.1 Open Your App
Go to: http://localhost:8080

### 6.2 Login
Use a test account

### 6.3 Go to Premium/Pricing Page
Click "Subscribe to Premium"

### 6.4 Complete Stripe Checkout
Use test card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### 6.5 Complete Payment
Click "Pay"

### 6.6 Verify Premium Access
After redirect back to your app:
- Wait 2 seconds (auto-refresh)
- Try accessing premium features
- ✅ Should work!

---

## Step 7: Verify in Database (1 minute)

### 7.1 Check Subscriptions
Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/sql/new

Run:
```sql
SELECT 
  u.email,
  s.subscription_plan,
  s.subscription_status,
  s.billing_cycle,
  s.current_period_end
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.subscription_plan = 'premium'
ORDER BY s.updated_at DESC;
```

✅ Should show your test user with `subscription_status = 'active'`

### 7.2 Check Payment History
```sql
SELECT 
  u.email,
  ph.amount,
  ph.currency,
  ph.payment_status,
  ph.subscription_plan,
  ph.payment_date
FROM payment_history ph
JOIN auth.users u ON ph.user_id = u.id
ORDER BY ph.created_at DESC
LIMIT 5;
```

✅ Should show your test payment with `payment_status = 'succeeded'`

### 7.3 Check Webhook Logs
Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions/stripe-webhook/logs

✅ Should see logs like:
```
[webhook] 📨 Request received
[webhook] ✅ Event verified: checkout.session.completed
[webhook] 💳 Checkout completed
[webhook] ✅ Sub retrieved: sub_xxx
[webhook] 📝 Updating subscription...
[webhook] ✅ Subscription updated!
[webhook] ✅ Payment recorded!
[webhook] ✅ Event processed: checkout.session.completed
```

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Payment history table created (Step 1)
- [ ] Edge function deployed (Step 2)
- [ ] 4 secrets configured (Step 3)
- [ ] Function restarted after adding secrets (Step 3.4)
- [ ] Webhook URL obtained (Step 4)
- [ ] Stripe webhook endpoint created (Step 5)
- [ ] Test payment completed (Step 6)
- [ ] Premium access granted (Step 6)
- [ ] Database shows active subscription (Step 7.1)
- [ ] Payment recorded in payment_history (Step 7.2)
- [ ] Webhook logs show success (Step 7.3)

---

## 🆘 Troubleshooting

### Function won't deploy?
- Check for syntax errors in the code
- Make sure "Verify JWT" is unchecked

### Secrets not working?
- Make sure you restarted the function after adding secrets
- Check spelling of secret names (case-sensitive)

### Webhook not receiving events?
- Verify webhook URL in Stripe matches your function URL
- Check webhook signing secret is correct
- Look at Stripe webhook delivery logs

### Premium still not granted?
- Check webhook logs for errors
- Verify subscription_status in database
- Run the emergency fix SQL from FIX_EXISTING_PREMIUM_USERS.sql

---

## 🎉 Success!

If all steps completed successfully:
- ✅ Webhook deployed and running
- ✅ Secrets configured
- ✅ Stripe connected
- ✅ Payment tracking working
- ✅ Premium access automatic

**Every future payment will now automatically grant premium access!** 🚀

---

## 📊 What to Monitor

### Regularly check:
1. **Webhook Logs**: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions/stripe-webhook/logs
2. **Stripe Deliveries**: https://dashboard.stripe.com/test/webhooks → Click your endpoint → Recent deliveries
3. **Payment Statistics**:
   ```sql
   SELECT * FROM get_payment_statistics();
   ```

---

## 🔄 If You Need to Update the Webhook

1. Go to: https://supabase.com/dashboard/project/fgsrxibdmkssywrpbxzv/functions
2. Click on `stripe-webhook`
3. Click "Edit"
4. Update the code
5. Click "Deploy"

The function will automatically use the existing secrets.

---

**You're all set! Everything is now automated!** 🎉
