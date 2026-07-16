import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Secrets check ──
const SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

console.log("[create-checkout] Starting up");
console.log("[create-checkout] STRIPE_SECRET_KEY present:", !!SECRET_KEY);
console.log("[create-checkout] SUPABASE_URL present:", !!SUPABASE_URL);
console.log("[create-checkout] SUPABASE_ANON_KEY present:", !!SUPABASE_ANON_KEY);

if (!SECRET_KEY) {
  console.error("[create-checkout] FATAL: STRIPE_SECRET_KEY is not set");
}
if (!SUPABASE_URL) {
  console.error("[create-checkout] FATAL: SUPABASE_URL is not set");
}
if (!SUPABASE_ANON_KEY) {
  console.error("[create-checkout] FATAL: SUPABASE_ANON_KEY is not set");
}

const stripe = new Stripe(SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("[create-checkout] Request received:", req.method, req.url);

  if (req.method === "OPTIONS") {
    console.log("[create-checkout] Handling OPTIONS preflight");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { priceId, successUrl, cancelUrl } = body;
    console.log("[create-checkout] Body parsed:", { priceId, successUrl, cancelUrl });

    if (!priceId) {
      throw new Error("Missing priceId in request body");
    }

    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    console.log("[create-checkout] Auth header present, creating Supabase client");

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error("[create-checkout] Auth error:", authError);
      throw new Error(`Auth error: ${authError.message}`);
    }
    if (!user) {
      console.error("[create-checkout] No user found from JWT");
      throw new Error("Unauthorized — no user in JWT");
    }
    console.log("[create-checkout] Authenticated user:", user.id, user.email);

    // Get or create Stripe customer
    console.log("[create-checkout] Looking up existing Stripe customer");
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = sub?.stripe_customer_id;
    console.log("[create-checkout] Existing stripe_customer_id:", customerId || "(none)");

    if (!customerId) {
      console.log("[create-checkout] Creating new Stripe customer for:", user.email);
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      console.log("[create-checkout] Stripe customer created:", customerId);
      await supabase.from("subscriptions").upsert(
        { user_id: user.id, stripe_customer_id: customerId },
        { onConflict: "user_id" }
      );
      console.log("[create-checkout] Customer ID saved to DB");
    }

    // Create Checkout Session
    console.log("[create-checkout] Creating Stripe Checkout Session with priceId:", priceId);
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      currency: "usd", // Force USD only
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
    });
    console.log("[create-checkout] Checkout Session created:", session.id, "url:", session.url);

    if (!session.url) {
      throw new Error("Stripe returned a session but no checkout URL. Session: " + session.id);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[create-checkout] ERROR:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
