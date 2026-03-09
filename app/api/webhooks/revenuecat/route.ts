export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedAuth = process.env.REVENUECAT_WEBHOOK_SECRET;

  // Basic auth check if configured
  if (expectedAuth && authHeader !== `Bearer ${expectedAuth}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[revenuecat webhook] Missing required environment variables");
    return NextResponse.json(
      { error: "Server misconfigured. Missing Supabase credentials." },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await req.json();
    const event = body.event;

    if (!event) {
      return NextResponse.json({ error: "No event found in body" }, { status: 400 });
    }

    // Handle initial purchase or renewal
    if (
      event.type === "INITIAL_PURCHASE" ||
      event.type === "RENEWAL" ||
      event.type === "NON_RENEWING_PURCHASE"
    ) {
      const userId = event.app_user_id;

      if (!userId) {
        console.error("[revenuecat webhook] missing app_user_id");
        return NextResponse.json({ error: "Missing app_user_id" }, { status: 400 });
      }

      const { error } = await supabaseAdmin
        .from("profiles")
        .upsert({ id: userId, has_paid: true }, { onConflict: "id" });

      if (error) {
        console.error("[revenuecat webhook] supabase upsert failed:", error.message);
        return NextResponse.json({ error: "Database update failed" }, { status: 500 });
      }

      console.log(`[revenuecat webhook] unlocked access for user ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[revenuecat webhook] error processing request:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
