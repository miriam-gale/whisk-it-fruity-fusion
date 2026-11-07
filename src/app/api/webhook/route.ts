import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendOwnerNotification } from "@/lib/notify";

export async function POST(request: NextRequest) {
  try {
    // Read raw body BEFORE any parsing — signature is computed over the raw bytes
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (process.env.NODE_ENV === "production" && secretKey?.startsWith("sk_test_")) {
      console.warn("[Webhook] Production is using a TEST secret key. Update PAYSTACK_SECRET_KEY in Vercel to a live key (sk_live_...).");
    }

    if (!secretKey || secretKey === "your_paystack_secret_key") {
      console.error("[Webhook] PAYSTACK_SECRET_KEY is not configured");
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    // Reject requests with no signature header
    if (!signature) {
  console.error("[Webhook] Paystack signature header is missing");
  return NextResponse.json({ error: "Missing signature" }, { status: 401 });
}

    // Verify HMAC-SHA512 signature
    const expectedHash = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    // ── TEMPORARY DIAGNOSTIC — REMOVE after root cause confirmed ──────────────
    // Logs ONLY shape facts + match booleans. Never logs the key, the
    // signature, or any HMAC hash. Safe to run on live events.
    {
      const trimmedKey = secretKey.trim();
      const trimmedHash = crypto
        .createHmac("sha512", trimmedKey)
        .update(rawBody)
        .digest("hex");
      const keyMode = secretKey.startsWith("sk_live_")
        ? "sk_live_"
        : secretKey.startsWith("sk_test_")
        ? "sk_test_"
        : "neither";
      console.log(
        "[Webhook Diag] " +
          JSON.stringify({
            keyMode,
            keyLength: secretKey.length,
            hasLeadingOrTrailingWhitespace:
              secretKey.length !== trimmedKey.length,
            hasWrappingQuotes:
              /^["']/.test(secretKey) || /["']$/.test(secretKey),
            rawKeyMatchesSignature: expectedHash === signature,
            trimmedKeyMatchesSignature: trimmedHash === signature,
            signatureLength: signature.length,
          })
      );
    }
    // ──────────────────────────────────────────────────────────────────────────

    if (expectedHash !== signature) {
  console.error("[Webhook] Signature mismatch");
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}

    // Safe to parse now that the body is verified
    const event = JSON.parse(rawBody) as {
      event: string;
      data: {
        reference: string;
        status: string;
        amount: number;
        currency: string;
        paid_at?: string;
      };
    };

    // Only act on charge.success — acknowledge all other events with 200
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const { reference, status, paid_at } = event.data;

    if (status !== "success") {
      return NextResponse.json({ received: true });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      // Supabase not configured — return 500 so Paystack retries when the service is available
      console.error("[Webhook] Supabase not configured — cannot persist payment for", reference);
      return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
    }

    // Extract the order UUID from the reference (format: WIF-{uuid}-{13-digit-timestamp})
    let orderId: string | null = null;
    if (reference && reference.startsWith("WIF-")) {
      const withoutPrefix = reference.slice(4);
      const match = withoutPrefix.match(/^(.+)-\d{13}$/);
      if (match) {
        orderId = match[1];
      }
    }

    if (!orderId) {
      // Reference format not recognised — not an order we created
      return NextResponse.json({ received: true });
    }

    // Fetch the order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError) {
      // Real database error — return 500 so Paystack retries
      console.error("[Webhook] Failed to fetch order:", fetchError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!order) {
      // Order not found with no DB error — could be a demo order or unrelated reference
      return NextResponse.json({ received: true });
    }

    // ── Idempotency guard ──────────────────────────────────────────────────────
    // If this order is already marked paid, a duplicate webhook was received.
    // Acknowledge it silently so Paystack stops retrying.
    if (order.payment_status === "paid") {
      return NextResponse.json({ received: true });
    }

    // Atomically update to paid only when the current status is still pending/failed.
    // The .neq() ensures that if the verify-payment route already ran concurrently,
    // this update is a no-op (0 rows affected) and we don't double-notify.
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        payment_reference: reference,
        order_status: "new",
      })
      .eq("id", orderId)
      .neq("payment_status", "paid")
      .select()
      .single();

    if (updateError) {
      // PGRST116 = "no rows returned" from PostgREST — the .neq() guard matched 0 rows,
      // meaning the verify-payment route won the race and already marked this order paid.
      if (updateError.code === "PGRST116") {
        return NextResponse.json({ received: true });
      }
      // Any other error is a real database failure — return 500 so Paystack retries
      console.error("[Webhook] Failed to update order:", updateError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!updatedOrder) {
      // Should not happen when updateError is null, but guard for unexpected states
      return NextResponse.json({ error: "Update returned no data" }, { status: 500 });
    }

    // Send owner notification — fire-and-forget, don't block the 200 response
    const firstItem = Array.isArray(updatedOrder.items) ? updatedOrder.items[0] : null;
    sendOwnerNotification({
      orderNumber: updatedOrder.order_number,
      customerName: updatedOrder.customer_name,
      customerPhone: updatedOrder.phone,
      customerWhatsapp: updatedOrder.whatsapp,
      deliveryInfo: updatedOrder.delivery_info,
      notes: updatedOrder.notes ?? undefined,
      flavour: firstItem?.drinkName ?? "Whisk It Fruity Fusion",
      quantity: firstItem?.quantity ?? 1,
      unitPrice: firstItem?.price ?? 20,
      totalAmount: updatedOrder.total_amount,
      paymentMethod: updatedOrder.payment_method ?? "unknown",
      paymentReference: reference,
      paidAt: paid_at,
    }).catch((e) => console.error("[Webhook Notify] Error:", e));

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook] Unhandled error:", err);
    // Return 500 so Paystack retries — an unhandled exception means we did NOT
    // successfully process the event and the order state is unknown.
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
