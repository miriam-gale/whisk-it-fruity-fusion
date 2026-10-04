import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendOwnerNotification } from "@/lib/notify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, order_id, payment_method } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey || secretKey === "your_paystack_secret_key") {
      // Demo mode
      return NextResponse.json({
        success: true,
        order: { id: order_id, payment_status: "paid" },
        paystack: {
          amount: 0,
          currency: "GHS",
          reference,
          paid_at: new Date().toISOString(),
        },
      });
    }

    console.log("[VerifyPayment] reference:", reference, "| order_id:", order_id);

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[VerifyPayment] Paystack HTTP status:", paystackRes.status);

    if (!paystackRes.ok) {
      let paystackError: { status?: boolean } = {};
      try { paystackError = await paystackRes.json(); } catch { /* ignore parse error */ }
      console.log("[VerifyPayment] Paystack error body status:", paystackError?.status, "| full:", JSON.stringify(paystackError));
      if (paystackError?.status === false) {
        // Reference not found (HTTP error path) — mark order failed so it doesn't stay pending.
        const supabase = getSupabaseAdmin();
        if (!supabase) {
          console.error("[VerifyPayment] not_found(http-err): Supabase admin client unavailable — payment_status NOT updated for order:", order_id);
        } else if (!order_id) {
          console.error("[VerifyPayment] not_found(http-err): order_id missing in request body — payment_status NOT updated");
        } else {
          const { data: rows, error: updateErr } = await supabase
            .from("orders")
            .update({ payment_status: "failed" })
            .eq("id", order_id)
            .neq("payment_status", "paid")
            .select();
          if (updateErr) {
            console.error("[VerifyPayment] not_found(http-err): Supabase update error for order", order_id, ":", JSON.stringify(updateErr));
          } else if (!rows?.length) {
            console.warn("[VerifyPayment] not_found(http-err): 0 rows updated for order_id:", order_id, "— row may not exist or is already 'paid'");
          } else {
            console.log("[VerifyPayment] not_found(http-err): payment_status set to 'failed' for order_id:", order_id);
          }
        }
        return NextResponse.json({ status: "not_found" });
      }
      console.error("[VerifyPayment] Paystack verification error:", paystackError);
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const paystackData = await paystackRes.json();
    console.log("[VerifyPayment] Paystack body status:", paystackData.status, "| transaction status:", paystackData.data?.status ?? "N/A");

    // Paystack returned 200 but status:false — reference not found.
    // This happens when Paystack's test UI "Decline" button is used (no real transaction
    // is created), OR when the user closed before initiating any payment attempt.
    // Mark the order failed so it does not stay pending indefinitely.
    if (!paystackData.status) {
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        console.error("[VerifyPayment] not_found: Supabase admin client unavailable — payment_status NOT updated for order:", order_id);
      } else if (!order_id) {
        console.error("[VerifyPayment] not_found: order_id missing in request body — payment_status NOT updated");
      } else {
        const { data: rows, error: updateErr } = await supabase
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("id", order_id)
          .neq("payment_status", "paid")
          .select();
        if (updateErr) {
          console.error("[VerifyPayment] not_found: Supabase update error for order", order_id, ":", JSON.stringify(updateErr));
        } else if (!rows?.length) {
          console.warn("[VerifyPayment] not_found: 0 rows updated for order_id:", order_id, "— row may not exist or is already 'paid'");
        } else {
          console.log("[VerifyPayment] not_found: payment_status set to 'failed' for order_id:", order_id);
        }
      }
      return NextResponse.json({ status: "not_found" });
    }

    // Transaction found in Paystack but explicitly declined, failed, or abandoned.
    // Guard with .neq() so a paid order can never be downgraded.
    if (paystackData.data?.status !== "success") {
      const txStatus = paystackData.data?.status ?? "failed";
      console.log("[VerifyPayment] declined: transaction status:", txStatus, "| order_id:", order_id);
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        console.error("[VerifyPayment] declined: Supabase admin client unavailable — payment_status NOT updated for order:", order_id);
      } else if (!order_id) {
        console.error("[VerifyPayment] declined: order_id missing in request body — payment_status NOT updated");
      } else {
        const { data: rows, error: updateErr } = await supabase
          .from("orders")
          .update({ payment_status: "failed", payment_reference: reference })
          .eq("id", order_id)
          .neq("payment_status", "paid")
          .select();
        if (updateErr) {
          console.error("[VerifyPayment] declined: Supabase update error for order", order_id, ":", JSON.stringify(updateErr));
        } else if (!rows?.length) {
          console.warn("[VerifyPayment] declined: 0 rows updated for order_id:", order_id, "— row may not exist, UUID mismatch, or RLS blocked the write. Check SUPABASE_SERVICE_ROLE_KEY and RLS UPDATE policies.");
        } else {
          console.log("[VerifyPayment] declined: payment_status set to 'failed' for order_id:", order_id);
        }
      }
      return NextResponse.json(
        { error: "Payment was not successful", status: txStatus },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        order: { id: order_id, payment_status: "paid" },
        paystack: {
          amount: paystackData.data.amount / 100,
          currency: paystackData.data.currency,
          reference: paystackData.data.reference,
          paid_at: paystackData.data.paid_at,
        },
      });
    }

    const updateFields: Record<string, unknown> = {
      payment_status: "paid",
      payment_reference: reference,
      order_status: "new",
    };
    if (payment_method) updateFields.payment_method = payment_method;

    let updateQuery = supabase.from("orders").update(updateFields);

    if (order_id) {
      updateQuery = updateQuery.eq("id", order_id);
    } else {
      updateQuery = updateQuery.eq("payment_reference", reference);
    }

    const { data: updatedOrder, error: updateError } = await updateQuery
      .select()
      .single();

    if (updateError) {
      console.error("Order update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // Fire-and-forget owner notification (don't block the response)
    if (updatedOrder) {
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
        totalAmount: updatedOrder.total_amount,
        paymentMethod: payment_method ?? updatedOrder.payment_method ?? "unknown",
        paymentReference: reference,
        paidAt: paystackData.data.paid_at,
      }).catch((e) => console.error("[Notify] Error:", e));
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      paystack: {
        amount: paystackData.data.amount / 100,
        currency: paystackData.data.currency,
        reference: paystackData.data.reference,
        paid_at: paystackData.data.paid_at,
      },
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
