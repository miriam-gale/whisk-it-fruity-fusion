import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Leaf, Droplets, Wind, Sparkles, GlassWater, MapPin } from "lucide-react";

const features = [
  {
    Icon: Leaf,
    color: "#2d6a4f",
    bg: "#f0f7f4",
    title: "Real Fruit",
    body: "Mango, apple, pawpaw and watermelon — real tropical fruits in every bottle.",
  },
  {
    Icon: Droplets,
    color: "#2d5a8e",
    bg: "#eff6ff",
    title: "Your Choice of Base",
    body: "Choose fresh milk for a classic creamy smoothness, or yoghurt for a richer, tangier twist.",
  },
  {
    Icon: Wind,
    color: "#2d6a4f",
    bg: "#f0f7f4",
    title: "Fruity & Refreshing",
    body: "Best served chilled — a vibrant, cooling drink for any time of day.",
  },
  {
    Icon: Sparkles,
    color: "#8b4513",
    bg: "#fff8f0",
    title: "Fun Texture",
    body: "Sago seeds, chia seeds and jelly add an enjoyable, playful texture.",
  },
  {
    Icon: GlassWater,
    color: "#8b1a1a",
    bg: "#fdf2f2",
    title: "Two Base Options",
    body: "Choose milk-based or yoghurt-based — both packed with real tropical fruits.",
  },
  {
    Icon: MapPin,
    color: "#8b1a1a",
    bg: "#fdf2f2",
    title: "Made in Ghana",
    body: "A homemade, homegrown Ghanaian brand crafted with genuine care.",
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "#FAFAF8" }}
      aria-labelledby="benefits-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top: central statement ── */}
        <AnimateOnScroll className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#2d6a4f] text-xs font-bold uppercase tracking-[0.22em] mb-4">
            Goodness in Every Bottle
          </p>
          <h2
            id="benefits-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a0808] leading-tight mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Why You&apos;ll Love{" "}
            <span className="text-[#8b1a1a]">Whisk It</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Real ingredients. Real taste. Crafted for a genuinely great drinking
            experience.
          </p>
        </AnimateOnScroll>

        {/* ── Feature layout ── */}
        {/* Desktop: 3-col asymmetric; Mobile: 1-col */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Left column — two stacked */}
          <div className="flex flex-col gap-5">
            {features.slice(0, 2).map((f, i) => (
              <AnimateOnScroll key={f.title} stagger={(i + 1) as 1 | 2} className="h-full">
                <div className="h-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#f9c9c9] transition-all duration-300 flex flex-col gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: f.bg }}
                    aria-hidden="true"
                  >
                    <f.Icon size={22} color={f.color} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[#1a0808] text-base mb-2"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Centre column — featured tall card */}
          <AnimateOnScroll mode="reveal-scale" stagger={3}>
            <div
              className="relative rounded-3xl overflow-hidden flex flex-col justify-end min-h-[320px]"
              style={{ background: "linear-gradient(145deg, #8b1a1a 0%, #4d0c0c 100%)" }}
            >
              {/* Decorative circles */}
              <div
                className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full opacity-10"
                style={{ background: "rgba(255,255,255,0.8)" }}
                aria-hidden="true"
              />
              <div
                className="absolute bottom-[100px] left-[-20px] w-24 h-24 rounded-full opacity-10"
                style={{ background: "rgba(255,255,255,0.8)" }}
                aria-hidden="true"
              />
              <div className="relative p-8">
                <p
                  className="text-red-200 text-xs font-bold uppercase tracking-[0.2em] mb-3"
                >
                  Freshly Prepared
                </p>
                <p
                  className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  &ldquo;Made with care.
                  <br />
                  Every single bottle.&rdquo;
                </p>
                <p className="text-red-200 text-sm leading-relaxed">
                  Each Whisk It drink is carefully prepared using fresh,
                  handpicked ingredients for the best possible taste.
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right column — two stacked */}
          <div className="flex flex-col gap-5">
            {features.slice(3).map((f, i) => (
              <AnimateOnScroll key={f.title} stagger={(i + 4) as 4 | 5 | 6} className="h-full">
                <div className="h-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#f9c9c9] transition-all duration-300 flex flex-col gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: f.bg }}
                    aria-hidden="true"
                  >
                    <f.Icon size={22} color={f.color} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-[#1a0808] text-base mb-2"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
