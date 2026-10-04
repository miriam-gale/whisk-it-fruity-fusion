import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `WIF-${dateStr}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_name,
      phone,
      whatsapp,
      delivery_info,
      notes,
      items,
      total_amount,
      payment_method,
    } = body;

    if (
      !customer_name ||
      !phone ||
      !whatsapp ||
      !delivery_info ||
      !items ||
      !total_amount
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order_number = generateOrderNumber();
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      // Demo mode: return a mock order
      return NextResponse.json(
        {
          order: {
            id: `demo-${Date.now()}`,
            order_number,
            customer_name,
            phone,
            whatsapp,
            delivery_info,
            notes: notes || null,
            items,
            total_amount,
            payment_method: payment_method || null,
            payment_status: "pending",
            order_status: "new",
            created_at: new Date().toISOString(),
          },
        },
        { status: 201 }
      );
    }

    const insertPayload: Record<string, unknown> = {
      order_number,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      delivery_info: delivery_info.trim(),
      notes: notes?.trim() || null,
      items,
      total_amount,
      payment_status: "pending",
      order_status: "new",
    };
    if (payment_method) insertPayload.payment_method = payment_method;

    const { data, error } = await supabase
      .from("orders")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ order: data }, { status: 201 });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminKey = searchParams.get("admin_key");

  if (adminKey !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ orders: [] });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
