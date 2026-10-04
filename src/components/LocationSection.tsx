import AnimateOnScroll from "@/components/AnimateOnScroll";
import { MapPin, Navigation, ShoppingBag, Truck } from "lucide-react";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Adama+Akuredza+Avenue%2C+Dzorwulu%2C+Accra%2C+Ghana";

export default function LocationSection() {
  return (
    <section
      id="location"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "#FAFAF8" }}
      aria-labelledby="location-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section label + heading ── */}
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-[#8b1a1a] text-xs font-bold uppercase tracking-[0.22em] mb-4">
            Find Us
          </p>
          <h2
            id="location-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a0808] leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our Location &amp;{" "}
            <span className="text-[#8b1a1a]">Delivery</span>
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

          {/* ── Left: Our Location ── */}
          <AnimateOnScroll stagger={1}>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Visual map banner */}
              <div
                className="h-44 flex flex-col items-center justify-center gap-3 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #fdf2f2 0%, #fff8f0 100%)" }}
                aria-hidden="true"
              >
                {/* Decorative rings */}
                <div className="absolute w-56 h-56 rounded-full border border-[#f9c9c9] opacity-60" />
                <div className="absolute w-36 h-36 rounded-full border border-[#f9c9c9] opacity-80" />
                <div className="w-16 h-16 rounded-full bg-[#8b1a1a] flex items-center justify-center shadow-lg z-10">
                  <MapPin size={28} color="#fff" strokeWidth={1.75} />
                </div>
                <span className="z-10 text-xs font-bold text-[#8b1a1a] uppercase tracking-[0.18em]">
                  Dzorwulu, Accra
                </span>
              </div>

              {/* Address + button */}
              <div className="p-6 sm:p-8">
                <p className="text-[#8b1a1a] text-xs font-bold uppercase tracking-[0.18em] mb-1">
                  Our Location
                </p>
                <h3
                  className="text-xl font-bold text-[#1a0808] mb-5"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Business Address
                </h3>

                <div className="flex items-start gap-3 mb-6">
                  <div
                    className="w-9 h-9 rounded-xl bg-[#fdf2f2] flex items-center justify-center shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <MapPin size={16} color="#8b1a1a" strokeWidth={1.75} />
                  </div>
                  <address className="not-italic text-gray-700 text-base font-medium leading-relaxed">
                    Adama Akuredza Avenue,<br />
                    Dzorwulu, Accra,<br />
                    Ghana
                  </address>
                </div>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 text-sm font-semibold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  aria-label="Open Whisk It location in Google Maps"
                >
                  <Navigation size={15} aria-hidden="true" />
                  Get Directions
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          {/* ── Right: Pickup & Delivery ── */}
          <div className="flex flex-col gap-5">

            {/* Pickup card */}
            <AnimateOnScroll stagger={2}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl bg-[#fdf2f2] flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <ShoppingBag size={18} color="#8b1a1a" strokeWidth={1.75} />
                  </div>
                  <h3
                    className="text-lg font-bold text-[#1a0808]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Pickup
                  </h3>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  Collect your order directly from our business address:
                </p>

                <div className="flex items-start gap-2.5 bg-[#fff8f0] border border-[#f9c9c9] rounded-xl px-4 py-3 mb-3">
                  <MapPin size={15} color="#8b1a1a" className="shrink-0 mt-0.5" aria-hidden="true" />
                  <address className="not-italic text-sm font-semibold text-[#1a0808]">
                    Adama Akuredza Avenue, Dzorwulu, Accra
                  </address>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  Pickup time and details are confirmed via WhatsApp after your order is placed.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Delivery card */}
            <AnimateOnScroll stagger={3}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl bg-[#f0f7f4] flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <Truck size={18} color="#2d6a4f" strokeWidth={1.75} />
                  </div>
                  <h3
                    className="text-lg font-bold text-[#1a0808]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Delivery
                  </h3>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  We deliver within Accra. When placing your order, enter your{" "}
                  <strong className="text-[#1a0808]">delivery address</strong> and any relevant
                  delivery details directly on the website. This is separate from our pickup location.
                </p>

                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>Available within Accra</strong> — a delivery fee may apply depending on
                    your location. Our team will review your order and confirm delivery details with
                    you via WhatsApp.
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

        </div>
      </div>
    </section>
  );
}
