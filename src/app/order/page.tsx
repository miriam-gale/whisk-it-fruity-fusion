"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import {
  Minus, Plus, ArrowLeft, ArrowRight, Check,
  ShoppingBag, Smartphone, CreditCard, Lock, RefreshCw,
  AlertCircle, Phone, Shield, Star, MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { type CustomerInfo, type OrderItem, DRINKS } from "@/lib/types";

type Step = "select" | "info" | "summary";
type PaymentMethod = "mobile_money" | "card";
type ProcessingStage = null | "creating" | "verifying";

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        channels?: string[];
        metadata?: object;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
      }) => { openIframe: () => void };
    };
  }
}

const STEP_ORDER: Step[] = ["select", "info", "summary"];

function stepIndex(s: Step) {
  return STEP_ORDER.indexOf(s);
}

/* ── Processing overlay for MoMo ── */
function MoMoProcessingOverlay() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 mx-4 max-w-sm w-full text-center">
        {/* Animated phone icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#fdf2f2] flex items-center justify-center momo-pulse">
              <Smartphone size={36} className="text-[#8b1a1a]" />
            </div>
          </div>
        </div>
        <h3 className="font-bold text-[#1a0808] text-lg mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Check Your Phone
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          A Mobile Money payment prompt has been sent to your phone.
        </p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-left mb-5">
          <p className="text-xs text-amber-800 font-semibold mb-1">To complete your payment:</p>
          <ol className="text-xs text-amber-700 space-y-0.5 list-decimal list-inside">
            <li>Open the prompt on your phone</li>
            <li>Enter your Mobile Money PIN</li>
            <li>Approve the payment</li>
          </ol>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8b1a1a] pulse-dot" />
          <span>Waiting for payment confirmation…</span>
        </div>
        <p className="mt-3 text-[11px] text-gray-300">Your PIN is never entered on this website</p>
      </div>
    </div>
  );
}

/* ── Verification overlay ── */
function VerifyingOverlay() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-10 mx-4 max-w-xs w-full text-center">
        <div className="flex justify-center mb-5">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-4 border-gray-100" />
            <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-t-[#8b1a1a] animate-spin" />
          </div>
        </div>
        <p className="font-bold text-[#1a0808] text-base mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Verifying payment…
        </p>
        <p className="text-sm text-gray-400 leading-relaxed">
          Please wait while we confirm your transaction.
        </p>
      </div>
    </div>
  );
}

function OrderPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlFlavour = searchParams.get("flavour") ?? "milk-based";
  const [selectedBase, setSelectedBase] = useState<string>(
    DRINKS.some(d => d.id === urlFlavour) ? urlFlavour : "milk-based"
  );
  const selectedDrink = DRINKS.find(d => d.id === selectedBase) ?? DRINKS[0];
  const [step, setStep] = useState<Step>("select");
  const [prevStep, setPrevStep] = useState<Step | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile_money");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "", phone: "", whatsapp: "", delivery_info: "", notes: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<CustomerInfo>>({});
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(null);
  const [momoWaiting, setMomoWaiting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

  function goToStep(next: Step) {
    setPrevStep(step);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const PRICE = selectedDrink.price;
  const totalAmount = quantity * PRICE;
  const PICKUP_LOCATION = "Adama Akuredza Avenue, Dzorwulu, Accra, Ghana";
  const effectiveDeliveryInfo = `Pickup — ${PICKUP_LOCATION}`;
  const orderItems: OrderItem[] = [{
    drinkId: selectedDrink.id,
    drinkName: selectedDrink.name,
    quantity,
    price: PRICE,
    subtotal: quantity * PRICE,
  }];

  function adjustQuantity(delta: number) {
    setQuantity((prev) => Math.max(1, Math.min(20, prev + delta)));
  }

  function validateInfo(): boolean {
    const errors: Partial<CustomerInfo> = {};
    if (!customerInfo.name.trim()) errors.name = "Full name is required";
    if (!customerInfo.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^[0-9+\s()-]{7,15}$/.test(customerInfo.phone.trim()))
      errors.phone = "Enter a valid phone number";
    if (!customerInfo.whatsapp.trim()) errors.whatsapp = "WhatsApp number is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNextFromInfo() {
    if (!validateInfo()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    goToStep("summary");
  }

  async function handlePay() {
    if (!window.PaystackPop) {
      toast.error("Payment system is still loading. Please wait a moment.");
      return;
    }
    setPaymentError(null);
    setProcessingStage("creating");

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerInfo.name,
          phone: customerInfo.phone,
          whatsapp: customerInfo.whatsapp,
          delivery_info: effectiveDeliveryInfo,
          notes: customerInfo.notes,
          items: orderItems,
          total_amount: totalAmount,
          payment_method: paymentMethod,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setPaymentError(orderData.error || "Failed to create order. Please try again.");
        setProcessingStage(null);
        return;
      }

      const orderId: string = orderData.order.id;
      const orderNumber: string = orderData.order.order_number;
      setCreatedOrderId(orderId);
      setCreatedOrderNumber(orderNumber);
      setProcessingStage(null);

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

      if (process.env.NODE_ENV === "production" && publicKey?.startsWith("pk_test_")) {
        console.warn("[Paystack] Production build is using a TEST public key. Update NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in Vercel to a live key (pk_live_...).");
      }

      if (!publicKey || publicKey === "your_paystack_public_key") {
        setProcessingStage("verifying");
        await new Promise((r) => setTimeout(r, 1200));
        const confirmData = {
          orderNumber, orderId,
          items: orderItems, total: totalAmount,
          customerName: customerInfo.name,
          paymentMethod, status: "demo_paid",
        };
        sessionStorage.setItem("order_confirmation", JSON.stringify(confirmData));
        router.push("/order/confirmation?demo=true");
        return;
      }

      const paystackChannels =
        paymentMethod === "mobile_money" ? ["mobile_money"] : ["card"];

      const paystackRef = `WIF-${orderId}-${Date.now()}`;
      let callbackFired = false;
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: `${customerInfo.phone.replace(/\s/g, "")}@whiskitorder.com`,
        amount: totalAmount * 100,
        currency: "GHS",
        ref: paystackRef,
        channels: paystackChannels,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: customerInfo.name },
            { display_name: "Order Number", variable_name: "order_number", value: orderNumber },
            { display_name: "Payment Method", variable_name: "payment_method", value: paymentMethod },
          ],
        },
        onClose: () => {
          // callback already fired (successful payment in progress) — don't interfere
          if (callbackFired) return;
          setMomoWaiting(false);
          setProcessingStage(null);
          // Verify to distinguish an explicit Paystack decline from a plain cancellation
          (async () => {
            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference: paystackRef, order_id: orderId, payment_method: paymentMethod }),
              });
              if (!verifyRes.ok) {
                // Paystack found the transaction and it was explicitly declined/failed
                setPaymentError("Your payment was declined. Please try a different card or payment method.");
              } else {
                // Reference not found — user closed before any transaction was attempted
                setPaymentError("Payment was cancelled. You can try again when you're ready.");
              }
            } catch {
              setPaymentError("Payment was cancelled. You can try again when you're ready.");
            }
          })();
        },
        callback: (response) => {
          (async () => {
            callbackFired = true;
            setMomoWaiting(false);
            const { reference } = response;
            setProcessingStage("verifying");
            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference, order_id: orderId, payment_method: paymentMethod }),
              });
              const verifyData = await verifyRes.json();

              if (verifyRes.ok && verifyData.success) {
                const confirmData = {
                  orderNumber, orderId,
                  items: orderItems, total: totalAmount,
                  customerName: customerInfo.name,
                  reference, paymentMethod, status: "paid",
                };
                sessionStorage.setItem("order_confirmation", JSON.stringify(confirmData));
                router.push(`/order/confirmation?ref=${reference}`);
              } else {
                setProcessingStage(null);
                setPaymentError(
                  "We couldn't verify your payment. If money was deducted, please contact us with your reference: " + reference
                );
              }
            } catch {
              setProcessingStage(null);
              setPaymentError("Verification error. Please contact us with reference: " + reference);
            }
          })();
        },
      });

      // Open the Paystack iframe first. Only show the MoMo overlay after
      // openIframe() returns — this prevents a stuck overlay if the call throws.
      handler.openIframe();
      if (paymentMethod === "mobile_money") {
        setMomoWaiting(true);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setMomoWaiting(false);
      setProcessingStage(null);
      setPaymentError("Something went wrong. Please try again.");
    }
  }

  const steps = [
    { key: "select" as Step, label: "Choose Base" },
    { key: "info" as Step, label: "Your Details" },
    { key: "summary" as Step, label: "Review & Pay" },
  ];
  const currentStepIndex = stepIndex(step);
  const isProcessing = processingStage !== null || momoWaiting;

  /* Determine animation direction */
  const isGoingForward = prevStep === null || stepIndex(step) > stepIndex(prevStep);
  const stepAnimClass = isGoingForward ? "step-enter" : "step-enter-left";

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" />

      {/* Mobile Money waiting overlay */}
      {momoWaiting && !processingStage && <MoMoProcessingOverlay />}

      {/* Verification overlay */}
      {processingStage === "verifying" && <VerifyingOverlay />}

      <Header />
      <main className="pt-20 min-h-screen" style={{ backgroundColor: "#fff8f0" }}>

        {/* ── Page header + stepper ── */}
        <div className="py-8 sm:py-10 text-center border-b border-[#f9c9c9]" style={{ backgroundColor: "#fdf2f2" }}>
          <p className="text-[#8b1a1a] text-xs font-semibold uppercase tracking-widest mb-2">
            Place Your Order
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a0808]" style={{ fontFamily: "var(--font-playfair)" }}>
            Order Your Whisk It
          </h1>
          <p className="text-gray-400 text-sm mt-1.5">GH₵20 per bottle · Your choice of base</p>

          {/* Progress stepper */}
          <div className="flex items-center justify-center gap-0 mt-7">
            {steps.map((s, i) => {
              const done = i < currentStepIndex;
              const active = i === currentStepIndex;
              return (
                <div key={s.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 ${
                      done
                        ? "bg-[#2d6a4f] text-white shadow-sm"
                        : active
                          ? "bg-[#8b1a1a] text-white shadow-md ring-4 ring-[#8b1a1a]/15"
                          : "bg-gray-100 text-gray-400"
                    }`}>
                      {done ? <Check size={13} strokeWidth={3} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-semibold mt-1.5 hidden sm:block transition-colors ${
                      active ? "text-[#8b1a1a]" : done ? "text-[#2d6a4f]" : "text-gray-300"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-12 sm:w-20 h-0.5 mx-1 transition-all duration-500 ${
                      i < currentStepIndex ? "bg-[#2d6a4f]" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {/* ── STEP 1: Choose Base ── */}
          {step === "select" && (
            <div key="select" className={`space-y-4 ${stepAnimClass}`}>
              {/* Product image + quantity */}
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">

                {/* Product image */}
                <div className="bg-gradient-to-br from-[#fff8f0] to-[#fdf2f2] flex items-center justify-center" style={{ height: "clamp(200px, 44vw, 300px)" }}>
                  <img
                    src="/hero-image.png"
                    alt="Whisk It Fruity Fusion"
                    className="h-full object-contain drop-shadow-lg"
                    style={{ filter: "drop-shadow(0 16px 32px rgba(139,26,26,0.12))" }}
                  />
                </div>

                <div className="p-5 sm:p-6">
                  {/* Product name + price */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-[#1a0808]" style={{ fontFamily: "var(--font-playfair)" }}>
                        Whisk It Fruity Fusion
                      </h2>
                      <p className="text-gray-400 text-sm mt-0.5">Fresh fruit drink · Made in Ghana</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        {[1,2,3,4,5].map(s => <Star key={s} size={11} fill="#f59e0b" className="text-amber-400" />)}
                        <span className="text-xs text-gray-400 ml-1">Handmade fresh</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-[#8b1a1a]" style={{ fontFamily: "var(--font-playfair)" }}>GH₵{PRICE}</p>
                      <p className="text-xs text-gray-400">per bottle</p>
                    </div>
                  </div>

                  {/* Base selector */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-600 mb-3">Choose Your Base</p>
                    <div className="grid grid-cols-2 gap-3">
                      {DRINKS.map((drink) => (
                        <button
                          key={drink.id}
                          type="button"
                          onClick={() => setSelectedBase(drink.id)}
                          className={`relative flex flex-col gap-2 p-3.5 rounded-2xl border-2 text-left transition-all ${
                            selectedBase === drink.id
                              ? "border-[#8b1a1a] bg-[#fdf2f2]"
                              : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                          }`}
                          aria-pressed={selectedBase === drink.id}
                        >
                          <div className="flex items-center gap-2.5 w-full">
                            <img
                              src={drink.images[0]}
                              alt={drink.name}
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                            <p className={`text-sm font-bold leading-snug flex-1 ${selectedBase === drink.id ? "text-[#8b1a1a]" : "text-[#1a0808]"}`}>
                              {drink.name}
                            </p>
                            {selectedBase === drink.id && (
                              <div className="w-5 h-5 rounded-full bg-[#8b1a1a] flex items-center justify-center shrink-0">
                                <Check size={10} color="#fff" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 leading-snug">{drink.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-sm font-semibold text-gray-600">Quantity</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => adjustQuantity(-1)}
                        disabled={quantity <= 1}
                        className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#8b1a1a] hover:text-[#8b1a1a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>
                      <span key={quantity} className="w-8 text-center text-xl font-bold text-[#1a0808] qty-tick" style={{ fontFamily: "var(--font-playfair)" }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => adjustQuantity(1)}
                        disabled={quantity >= 20}
                        className="w-9 h-9 rounded-full border-2 border-[#8b1a1a] bg-[#8b1a1a] flex items-center justify-center text-white hover:bg-[#6b1212] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live price summary */}
              <div className="bg-white rounded-2xl border-2 border-[#8b1a1a] px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={16} className="text-[#8b1a1a]" />
                    <div>
                      <p className="text-sm font-semibold text-[#1a0808]">Whisk It Fruity Fusion</p>
                      <p className="text-xs text-gray-400">{selectedDrink.name} · {quantity} bottle{quantity !== 1 ? "s" : ""} × GH₵{PRICE}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Total</p>
                    <p key={totalAmount} className="text-2xl font-bold text-[#8b1a1a] leading-none qty-tick" style={{ fontFamily: "var(--font-playfair)" }}>
                      GH₵{totalAmount}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => goToStep("info")}
                className="w-full flex items-center justify-center gap-2 py-4 text-base font-semibold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Continue <ArrowRight size={18} />
              </button>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-5 text-xs text-gray-400 py-1">
                <span className="flex items-center gap-1.5"><Shield size={12} className="text-[#2d6a4f]" /> Secure checkout</span>
                <span className="flex items-center gap-1.5"><Lock size={12} className="text-[#2d6a4f]" /> Powered by Paystack</span>
              </div>
            </div>
          )}

          {/* ── STEP 2: Customer Details ── */}
          {step === "info" && (
            <div key="info" className={`${stepAnimClass}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-full bg-[#fdf2f2] flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-[#8b1a1a]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a0808]" style={{ fontFamily: "var(--font-playfair)" }}>
                    Your Details
                  </h2>
                  <p className="text-xs text-gray-400">We need this to reach you about your order</p>
                </div>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); handleNextFromInfo(); }}
                className="space-y-4"
                noValidate
              >
                <Field
                  id="name" label="Full Name" required
                  value={customerInfo.name} error={formErrors.name}
                  placeholder="Your full name" autoComplete="name"
                  onChange={(v) => { setCustomerInfo((p) => ({ ...p, name: v })); setFormErrors((p) => ({ ...p, name: undefined })); }}
                />
                <Field
                  id="phone" label="Phone Number" required type="tel"
                  value={customerInfo.phone} error={formErrors.phone}
                  placeholder="e.g. 0241652034" autoComplete="tel"
                  onChange={(v) => { setCustomerInfo((p) => ({ ...p, phone: v })); setFormErrors((p) => ({ ...p, phone: undefined })); }}
                />
                <Field
                  id="whatsapp" label="WhatsApp Number" required type="tel"
                  value={customerInfo.whatsapp} error={formErrors.whatsapp}
                  placeholder="e.g. 0241652034" autoComplete="tel"
                  hint="We'll confirm your order on WhatsApp"
                  onChange={(v) => { setCustomerInfo((p) => ({ ...p, whatsapp: v })); setFormErrors((p) => ({ ...p, whatsapp: undefined })); }}
                />
                {/* Pickup info */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <div className="flex items-start gap-2.5 bg-[#fff8f0] border border-[#f9c9c9] rounded-xl px-4 py-3">
                    <MapPin size={15} color="#8b1a1a" className="shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[#1a0808]">{PICKUP_LOCATION}</p>
                      <p className="text-xs text-gray-500 mt-0.5">All orders are pickup only. You arrange your own transport to collect your order.</p>
                      <p className="text-xs text-gray-400 mt-0.5">Pickup time confirmed via WhatsApp after your order.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Order Notes <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Any special requests"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8b1a1a] focus:border-transparent transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => goToStep("select")}
                    className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-gray-600 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] flex items-center justify-center gap-2 py-4 text-sm font-semibold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Review Order <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── STEP 3: Review & Pay ── */}
          {step === "summary" && (
            <div key="summary" className={`space-y-4 ${stepAnimClass}`}>

              {/* ── Order summary card ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Order</h3>
                  <button onClick={() => goToStep("select")} className="text-xs text-[#8b1a1a] font-semibold hover:underline">
                    Edit
                  </button>
                </div>

                <div className="px-5 py-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#fff8f0] flex items-center justify-center border border-gray-100">
                    <img src="/hero-image.png" alt="" className="w-full h-full object-contain p-1" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1a0808] text-sm">Whisk It Fruity Fusion</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedDrink.name} · Made in Ghana</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[#8b1a1a]">GH₵{totalAmount}</p>
                    <p className="text-xs text-gray-400">{quantity} × GH₵{PRICE}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-5 py-3 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#1a0808]">GH₵{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Pickup</span>
                    <span className="text-[#2d6a4f] font-medium text-xs">You arrange transport</span>
                  </div>
                </div>
                <div className="border-t-2 border-[#f9c9c9] px-5 py-4 bg-[#fdf2f2] flex justify-between items-center">
                  <p className="font-bold text-[#1a0808]">Total</p>
                  <p className="text-2xl font-bold text-[#8b1a1a]" style={{ fontFamily: "var(--font-playfair)" }}>
                    GH₵{totalAmount}
                  </p>
                </div>
              </div>

              {/* ── Customer details card ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Details</h3>
                  <button onClick={() => goToStep("info")} className="text-xs text-[#8b1a1a] font-semibold hover:underline">
                    Edit
                  </button>
                </div>
                <div className="px-5 py-4 space-y-2">
                  {[
                    { label: "Name", value: customerInfo.name },
                    { label: "Phone", value: customerInfo.phone },
                    { label: "WhatsApp", value: customerInfo.whatsapp },
                    { label: "Pickup", value: PICKUP_LOCATION },
                    ...(customerInfo.notes ? [{ label: "Notes", value: customerInfo.notes }] : []),
                  ].map((f) => (
                    <div key={f.label} className="flex gap-3 text-sm">
                      <span className="text-gray-400 w-20 shrink-0">{f.label}</span>
                      <span className="text-gray-700 font-medium">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Payment method selector ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payment Method</h3>
                </div>
                <div className="px-5 py-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">

                    {/* Mobile Money */}
                    <button
                      onClick={() => setPaymentMethod("mobile_money")}
                      className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left pay-method-card ${
                        paymentMethod === "mobile_money"
                          ? "border-[#8b1a1a] bg-[#fdf2f2]"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                      }`}
                      aria-pressed={paymentMethod === "mobile_money"}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${paymentMethod === "mobile_money" ? "bg-[#8b1a1a] shadow-md" : "bg-gray-100"}`}>
                        <Smartphone size={20} color={paymentMethod === "mobile_money" ? "#fff" : "#666"} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold leading-snug ${paymentMethod === "mobile_money" ? "text-[#8b1a1a]" : "text-[#1a0808]"}`}>
                          Mobile Money
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">MTN · Telecel · AirtelTigo</p>
                      </div>
                      {paymentMethod === "mobile_money" && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#8b1a1a] flex items-center justify-center">
                          <Check size={10} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                    </button>

                    {/* Card */}
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left pay-method-card ${
                        paymentMethod === "card"
                          ? "border-[#8b1a1a] bg-[#fdf2f2]"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                      }`}
                      aria-pressed={paymentMethod === "card"}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${paymentMethod === "card" ? "bg-[#8b1a1a] shadow-md" : "bg-gray-100"}`}>
                        <CreditCard size={20} color={paymentMethod === "card" ? "#fff" : "#666"} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold leading-snug ${paymentMethod === "card" ? "text-[#8b1a1a]" : "text-[#1a0808]"}`}>
                          Card
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">Visa · Mastercard</p>
                      </div>
                      {paymentMethod === "card" && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#8b1a1a] flex items-center justify-center">
                          <Check size={10} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Contextual note */}
                  {paymentMethod === "mobile_money" && (
                    <div className="step-enter-up bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                      <p className="text-xs text-blue-700 leading-relaxed">
                        <strong>How it works:</strong> After clicking Pay, you&apos;ll receive a prompt on your phone.
                        Approve it securely through your network — your PIN is <strong>never</strong> entered here.
                      </p>
                    </div>
                  )}
                  {paymentMethod === "card" && (
                    <div className="step-enter-up bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                      <p className="text-xs text-blue-700 leading-relaxed">
                        <strong>Secure checkout:</strong> Your card details are entered directly through Paystack&apos;s
                        encrypted interface. We never see or store your card number.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment error */}
              {paymentError && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-4 step-enter-up">
                  <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700 font-medium leading-snug">{paymentError}</p>
                    <button
                      onClick={() => setPaymentError(null)}
                      className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-semibold hover:underline"
                    >
                      <RefreshCw size={12} /> Try again
                    </button>
                  </div>
                </div>
              )}

              {/* ── Pay button ── */}
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 text-base font-bold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-2xl hover:-translate-y-0.5 disabled:translate-y-0 disabled:shadow-lg"
                style={{ letterSpacing: "0.01em" }}
              >
                {processingStage === "creating" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating order…
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Pay GH₵{totalAmount}
                  </>
                )}
              </button>

              {/* Security line */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><Shield size={12} className="text-[#2d6a4f]" /> Secured by Paystack</span>
                <span className="w-1 h-1 rounded-full bg-gray-200" aria-hidden />
                <span className="flex items-center gap-1.5"><Lock size={11} /> PIN never shared</span>
              </div>

              {/* Back button */}
              <button
                onClick={() => goToStep("info")}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
              >
                <ArrowLeft size={15} /> Back to details
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ── Reusable field component ── */
function Field({
  id, label, required, type = "text", value, error, hint, placeholder, autoComplete, onChange,
}: {
  id: string; label: string; required?: boolean; type?: string;
  value: string; error?: string; hint?: string; placeholder?: string;
  autoComplete?: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-[#8b1a1a]">*</span>}
      </label>
      <input
        id={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"} text-sm focus:outline-none focus:ring-2 focus:ring-[#8b1a1a] focus:border-transparent transition-colors`}
      />
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500" role="alert">{error}</p>}
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fff8f0" }}>
        <div className="w-8 h-8 border-3 border-[#8b1a1a]/20 border-t-[#8b1a1a] rounded-full animate-spin" />
      </div>
    }>
      <OrderPageInner />
    </Suspense>
  );
}
