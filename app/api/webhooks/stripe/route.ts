export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error("[stripe webhook] Missing required environment variables");
    return NextResponse.json(
      { error: "Server misconfigured. Missing Stripe or Supabase credentials." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-01-27.acacia",
  });

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[stripe webhook] signature verification failed:", message);
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (!userId) {
      console.error("[stripe webhook] checkout.session.completed missing client_reference_id");
      return NextResponse.json({ error: "Missing client_reference_id" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({ id: userId, has_paid: true }, { onConflict: "id" });

    if (error) {
      console.error("[stripe webhook] supabase upsert failed:", error.message);
      return NextResponse.json({ error: "Database update failed" }, { status: 500 });
    }

    console.log(`[stripe webhook] unlocked access for user ${userId}`);
  }

  return NextResponse.json({ received: true });
}
