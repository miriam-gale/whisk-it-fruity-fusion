"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Home, MessageCircle, Smartphone, CreditCard, Package, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTACT_NUMBERS, WA_MESSAGE } from "@/lib/types";

interface ConfirmationData {
  orderNumber: string;
  orderId: string;
  items: { drinkName: string; quantity: number; subtotal: number }[];
  total: number;
  customerName: string;
  reference?: string;
  paymentMethod?: string;
  status: string;
}

function PaymentMethodBadge({ method }: { method?: string }) {
  if (method === "mobile_money") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
        <Smartphone size={11} /> Mobile Money
      </span>
    );
  }
  if (method === "card") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
        <CreditCard size={11} /> Card
      </span>
    );
  }
  return null;
}

/* Animated SVG checkmark */
function AnimatedCheck() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow ring */}
      <div className="absolute w-24 h-24 rounded-full bg-[#2d6a4f]/10 success-glow" aria-hidden />
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="#2d6a4f" />
        <circle cx="32" cy="32" r="26" fill="#2d6a4f" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <polyline
          points="18,32 27,42 46,22"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="check-line"
        />
      </svg>
    </div>
  );
}

/* Confetti dots */
function Confetti() {
  const pieces = [
    { color: "#8b1a1a", x: -48, y: -20, delay: "0s", size: 8 },
    { color: "#2d6a4f", x: 48, y: -28, delay: "0.06s", size: 6 },
    { color: "#f59e0b", x: -32, y: -48, delay: "0.12s", size: 7 },
    { color: "#8b1a1a", x: 32, y: -44, delay: "0.08s", size: 5 },
    { color: "#2d6a4f", x: -60, y: -8, delay: "0.18s", size: 6 },
    { color: "#f59e0b", x: 60, y: -10, delay: "0.15s", size: 8 },
    { color: "#8b1a1a", x: 0, y: -56, delay: "0.22s", size: 5 },
    { color: "#2d6a4f", x: -20, y: -56, delay: "0.04s", size: 7 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
      {pieces.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-sm confetti-piece"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            transform: `translate(${p.x}px, ${p.y}px)`,
            animationDelay: p.delay,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

function ConfirmationInner() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const isDemo = searchParams.get("demo") === "true";
  const [data, setData] = useState<ConfirmationData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("order_confirmation");
    if (stored) {
      try { setData(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const waLink = `https://wa.me/${CONTACT_NUMBERS[0].wa.replace("+", "")}?text=${WA_MESSAGE}`;

  const nextSteps = [
    { icon: Package, text: "Your order is confirmed and being prepared fresh." },
    { icon: MessageCircle, text: "We'll reach out on WhatsApp to arrange delivery or pickup." },
    { icon: CheckCircle2, text: "Your Whisk It drink will be on its way to you!" },
  ];

  return (
    <>
      <Header />
      <main
        className="pt-20 min-h-screen"
        style={{ background: "linear-gradient(160deg, #f0f7f4 0%, #fff8f0 55%, #fdf2f2 100%)" }}
      >
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center">

          {/* Checkmark with confetti */}
          <div className="relative flex justify-center mb-6 confirm-icon">
            <Confetti />
            <AnimatedCheck />
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold text-[#1a0808] mb-3 confirm-title"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Payment Successful!
          </h1>

          <div className="confirm-sub">
            <p className="text-gray-500 text-base mb-1">
              Thank you for ordering from{" "}
              <span className="font-semibold text-[#8b1a1a]">Whisk It Fruity Fusion</span>.
            </p>
            {data?.customerName && (
              <p className="text-gray-500 text-sm mt-1">
                Hi <span className="font-semibold text-[#8b1a1a]">{data.customerName}</span>,
                your order is confirmed!
              </p>
            )}
          </div>

          {/* ── Order confirmation card ── */}
          {data && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md text-left mt-8 mb-5 overflow-hidden confirm-card">

              {/* Card header */}
              <div className="px-6 py-4 bg-gradient-to-r from-[#fdf2f2] to-[#fff8f0] border-b border-[#f9c9c9]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Order Number</p>
                    <p className="text-lg font-bold text-[#8b1a1a]" style={{ fontFamily: "var(--font-playfair)" }}>
                      {data.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Status</p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d6a4f] bg-[#f0f7f4] px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2d6a4f]" />
                      {isDemo ? "Demo Paid" : "Paid"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {data.items.map((item) => (
                  <div key={item.drinkName} className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#fff8f0] flex items-center justify-center border border-gray-100 shrink-0">
                        <img src="/hero-image.png" alt="" className="w-full h-full object-contain p-1" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1a0808]">Whisk It Fruity Fusion</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.drinkName}</p>
                        <p className="text-xs text-gray-400">{item.quantity} bottle{item.quantity !== 1 ? "s" : ""} × GH₵15</p>
                      </div>
                    </div>
                    <p className="font-bold text-[#8b1a1a] shrink-0">GH₵{item.subtotal}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-between items-center">
                <p className="font-bold text-gray-700">Total Paid</p>
                <p className="text-2xl font-bold text-[#8b1a1a]" style={{ fontFamily: "var(--font-playfair)" }}>
                  GH₵{data.total}
                </p>
              </div>

              {/* Payment method + reference */}
              {(data.paymentMethod || ref) && (
                <div className="px-6 py-4 border-t border-gray-100 space-y-2.5">
                  {data.paymentMethod && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Payment method</span>
                      <PaymentMethodBadge method={data.paymentMethod} />
                    </div>
                  )}
                  {(ref || isDemo) && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Transaction reference</span>
                      <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{ref || "DEMO-MODE"}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Fallback when no session data */}
          {!data && (
            <div className="bg-white rounded-2xl p-8 text-center mb-5 border border-gray-100 shadow-sm confirm-card">
              <CheckCircle2 size={32} className="text-[#2d6a4f] mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Your order has been placed successfully. We will contact you on WhatsApp shortly.
              </p>
            </div>
          )}

          {/* ── What happens next ── */}
          <div className="bg-white rounded-2xl border border-gray-100 text-left px-5 py-5 mb-7 confirm-card shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">What happens next</p>
            <ol className="space-y-3.5">
              {nextSteps.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#fdf2f2] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} className="text-[#8b1a1a]" />
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pt-1">{text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Action buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center confirm-btns">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold text-[#8b1a1a] border-2 border-[#8b1a1a] rounded-full hover:bg-[#fdf2f2] transition-colors"
            >
              <Home size={15} /> Back to Home
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold text-white bg-[#25d366] rounded-full hover:bg-[#1da851] transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <MessageCircle size={15} /> Chat on WhatsApp
            </a>
          </div>

          <p className="mt-9 text-xs text-gray-400 italic" style={{ fontFamily: "var(--font-playfair)" }}>
            Shake · Sip · Smile
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f0f7f4" }}>
        <div className="w-8 h-8 border-2 border-[#2d6a4f]/20 border-t-[#2d6a4f] rounded-full animate-spin" />
      </div>
    }>
      <ConfirmationInner />
    </Suspense>
  );
}
