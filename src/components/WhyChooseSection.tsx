import Link from "next/link";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Leaf, Tag, ShoppingBag, MessageCircle, MapPin, Check } from "lucide-react";

const reasons = [
  { Icon: Leaf,          color: "#2d6a4f", bg: "#f0f7f4", text: "Real, fresh ingredients" },
  { Icon: Tag,           color: "#8b1a1a", bg: "#fdf2f2", text: "GH₵20 per bottle" },
  { Icon: ShoppingBag,   color: "#2d5a8e", bg: "#eff6ff", text: "Easy online ordering" },
  { Icon: MessageCircle, color: "#276749", bg: "#f0fff4", text: "WhatsApp support" },
  { Icon: MapPin,        color: "#8b1a1a", bg: "#fdf2f2", text: "Proudly Ghanaian" },
  { Icon: Leaf,          color: "#8b4513", bg: "#fff8f0", text: "Freshly prepared" },
];

export default function WhyChooseSection() {
  return (
    <section
      className="py-24 lg:py-32 bg-white"
      aria-labelledby="why-choose-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── Left: bold statement + CTA ── */}
          <div>
            <AnimateOnScroll>
              <p className="text-[#8b1a1a] text-xs font-bold uppercase tracking-[0.22em] mb-4">
                Why Whisk It
              </p>
              <h2
                id="why-choose-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a0808] mb-6 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                The refreshment
                <br />
                <span className="text-[#8b1a1a]">you deserve.</span>
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll stagger={2}>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                We make it easy to enjoy a premium, freshly prepared fruit drink
                with your choice of milk or yoghurt base — made with real
                ingredients, at an honest price.
              </p>
            </AnimateOnScroll>

            {/* Price callout */}
            <AnimateOnScroll stagger={3}>
              <div
                className="inline-flex items-baseline gap-2 rounded-2xl px-7 py-5 mb-8"
                style={{ background: "linear-gradient(135deg, #fff8f0 0%, #fce4e4 100%)" }}
              >
                <span
                  className="text-5xl font-bold text-[#8b1a1a]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  GH₵20
                </span>
                <span className="text-gray-500 text-sm font-medium">per bottle</span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll stagger={4}>
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Order Now
              </Link>
            </AnimateOnScroll>
          </div>

          {/* ── Right: reasons list ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reasons.map((r, i) => (
              <AnimateOnScroll key={r.text} stagger={((i % 6) + 1) as 1|2|3|4|5|6}>
                <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-[#f9c9c9] hover:shadow-md transition-all duration-200">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: r.bg }}
                    aria-hidden="true"
                  >
                    <r.Icon size={18} color={r.color} strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-semibold text-[#1a0808]">{r.text}</span>
                </div>
              </AnimateOnScroll>
            ))}

            {/* Bottom-spanning tagline card */}
            <AnimateOnScroll stagger={7} className="sm:col-span-2">
              <div
                className="flex items-center gap-4 rounded-2xl p-5"
                style={{ background: "linear-gradient(135deg, #f0f7f4 0%, #fff8f0 100%)" }}
              >
                <div className="w-8 h-8 rounded-full bg-[#2d6a4f] flex items-center justify-center shrink-0" aria-hidden="true">
                  <Check size={14} color="#fff" strokeWidth={2.5} />
                </div>
                <p className="text-sm text-gray-600 leading-snug">
                  <span className="font-bold text-[#1a0808]">Two base options — milk or yoghurt</span>{" "}
                  — each one crafted to be refreshing, fruity and satisfying.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
