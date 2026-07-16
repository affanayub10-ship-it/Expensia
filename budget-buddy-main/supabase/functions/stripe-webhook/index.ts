/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

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
      // Use constructEventAsync for Deno/async context
      event = await stripe.webhooks.constructEventAsync(
        body, 
        signature, 
        WEBHOOK_SECRET,
        undefined,
        Stripe.createSubtleCryptoProvider()
      );
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
          
          // Detect billing cycle from Stripe subscription
          const interval = sub.items.data[0]?.price?.recurring?.interval;
          console.log("[webhook] 🔍 Stripe interval detected:", interval);
          const billingCycle = interval === "year" ? "yearly" : "monthly";
          console.log("[webhook] 📅 Billing cycle set to:", billingCycle);

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
