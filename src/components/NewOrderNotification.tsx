"use client";

import { X, MapPin, CreditCard, Smartphone, ArrowRight, Package } from "lucide-react";
import type { Order, OrderItem } from "@/lib/types";

interface Props {
  order: Order;
  queueLength: number;
  onDismiss: () => void;
  onViewOrder: () => void;
}

function formatMethod(method?: string) {
  if (method === "mobile_money") return "Mobile Money";
  if (method === "card") return "Card";
  return "—";
}

export default function NewOrderNotification({
  order,
  queueLength,
  onDismiss,
  onViewOrder,
}: Props) {
  const items = Array.isArray(order.items) ? (order.items as OrderItem[]) : [];

  return (
    <div
      className="fixed z-50 inset-x-4 bottom-4 sm:inset-auto sm:top-4 sm:right-4 sm:max-w-[360px] notification-enter"
      role="alertdialog"
      aria-modal="false"
      aria-labelledby="notif-order-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div
          className="px-5 py-4 flex items-start justify-between gap-3"
          style={{ background: "linear-gradient(135deg, #8b1a1a 0%, #4d0c0c 100%)" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0" aria-hidden="true">🔔</span>
            <div className="min-w-0">
              <p className="text-red-200 text-[10px] font-bold uppercase tracking-[0.15em]">
                New Paid Order{queueLength > 1 ? ` (+${queueLength - 1} more)` : ""}
              </p>
              <p
                id="notif-order-title"
                className="text-white font-bold text-base leading-tight truncate"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {order.order_number}
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-red-300 hover:text-white transition-colors shrink-0 mt-0.5 p-0.5 rounded"
            aria-label="Dismiss notification"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3.5 max-h-[60vh] overflow-y-auto text-sm">

          {/* Customer */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-1.5">
              Customer
            </p>
            <p className="font-semibold text-[#1a0808]">{order.customer_name}</p>
            <p className="text-gray-500 text-xs mt-0.5">{order.phone}</p>
            {order.whatsapp && order.whatsapp !== order.phone && (
              <p className="text-gray-400 text-xs">WA: {order.whatsapp}</p>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* Items */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-1.5">
              Order Items
            </p>
            {items.length > 0 ? (
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-gray-700">
                      {item.quantity} × {item.drinkName}
                    </span>
                    <span className="text-gray-400 text-xs tabular-nums">
                      GH₵{item.subtotal}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 flex items-center gap-1.5">
                <Package size={13} className="text-gray-400" aria-hidden="true" />
                Whisk It Fruity Fusion
              </p>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-[#fdf2f2] rounded-xl px-4 py-2.5">
            <span className="font-semibold text-gray-600 text-sm">Total</span>
            <span
              className="text-lg font-bold text-[#8b1a1a]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              GH₵{order.total_amount}
            </span>
          </div>

          <div className="border-t border-gray-100" />

          {/* Payment */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-1.5">
              Payment
            </p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-gray-600">
                {order.payment_method === "mobile_money" ? (
                  <Smartphone size={13} className="text-gray-400" aria-hidden="true" />
                ) : (
                  <CreditCard size={13} className="text-gray-400" aria-hidden="true" />
                )}
                {formatMethod(order.payment_method)}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Paid ✓
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Delivery / Pickup */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-1.5">
              Delivery / Pickup
            </p>
            <div className="flex items-start gap-2">
              <MapPin size={13} color="#8b1a1a" className="shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-gray-700 leading-snug text-sm">{order.delivery_info}</p>
            </div>
          </div>

          {/* Notes (only if present) */}
          {order.notes && (
            <>
              <div className="border-t border-gray-100" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-1.5">
                  Notes
                </p>
                <p className="text-gray-600 leading-snug italic text-sm">{order.notes}</p>
              </div>
            </>
          )}

          {/* Timestamp */}
          <div className="border-t border-gray-100" />
          <p className="text-xs text-gray-400">
            {new Date(order.created_at).toLocaleString("en-GH", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={onViewOrder}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] transition-colors"
          >
            View Order <ArrowRight size={12} aria-hidden="true" />
          </button>
          <button
            onClick={onDismiss}
            className="flex-1 py-2.5 text-xs font-semibold text-gray-600 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
