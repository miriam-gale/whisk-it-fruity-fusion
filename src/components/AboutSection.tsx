import AnimateOnScroll from "@/components/AnimateOnScroll";

const stats = [
  { value: "8", label: "Fresh\nIngredients" },
  { value: "GH₵15", label: "Per\nBottle" },
  { value: "100%", label: "Real\nFruit" },
];

// Fruit ingredient thumbnails used as decorative visual (not product photos)
const fruitMosaic = [
  { src: "/ingredients/mango.png",      alt: "Mango",      aspect: "row-span-2" },
  { src: "/ingredients/watermelon.png", alt: "Watermelon", aspect: "" },
  { src: "/ingredients/apple.png",      alt: "Apple",      aspect: "" },
  { src: "/ingredients/pawpaw.png",     alt: "Pawpaw",     aspect: "" },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "#FAFAF8" }}
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section label ── */}
        <AnimateOnScroll className="text-center mb-4">
          <p className="text-[#8b1a1a] text-xs font-bold uppercase tracking-[0.22em]">
            Our Story
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* ── Left: story + stats ── */}
          <div>
            <AnimateOnScroll>
              <h2
                id="about-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a0808] mb-6 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                A Delicious Fusion
                <br />
                <span className="text-[#8b1a1a]">Born in Ghana.</span>
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll stagger={2}>
              <div className="space-y-5 text-gray-600 text-base leading-relaxed mb-8">
                <p>
                  Whisk It Fruity Fusion is a Ghanaian fresh fruit milk drink brand
                  built on a simple idea: that great refreshment should be real,
                  fruity and full of personality.
                </p>
                <p>
                  Every bottle is a careful blend of fresh tropical fruits —
                  sweet mango, crisp apple, smooth pawpaw and juicy watermelon —
                  combined with creamy milk, sago seeds, chia seeds and jelly
                  for a drink that is as fun to drink as it is delicious.
                </p>
                <p>
                  We created Whisk It because we wanted something that tasted
                  homemade and brought a genuine smile to every sip. Whether
                  you&apos;re treating yourself or sharing with someone special,
                  Whisk It is made for you.
                </p>
              </div>
            </AnimateOnScroll>

            {/* Brand tags */}
            <AnimateOnScroll stagger={3}>
              <div className="flex flex-wrap gap-2 mb-10">
                {["Real Fruits", "Fresh Milk", "Fun Texture", "Made in Ghana", "Freshly Prepared"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-white border border-[#f9c9c9] rounded-full px-4 py-1.5 text-xs font-semibold text-[#8b1a1a] shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>

            {/* Stats row */}
            <AnimateOnScroll stagger={4}>
              <div className="grid grid-cols-3 gap-3 border-t border-gray-200 pt-8">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p
                      className="text-2xl sm:text-3xl font-bold text-[#8b1a1a] leading-none"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {s.value}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1 whitespace-pre-line leading-tight">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll stagger={5}>
              <p
                className="mt-8 text-lg font-medium text-gray-400 italic"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                &ldquo;Shake &bull; Sip &bull; Smile&rdquo;
              </p>
            </AnimateOnScroll>
          </div>

          {/* ── Right: ingredient mosaic ── */}
          <AnimateOnScroll mode="reveal-scale" className="mt-4 lg:mt-10">
            <div className="grid grid-cols-2 grid-rows-3 gap-3 h-[420px] sm:h-[480px] lg:h-[520px]">
              {/* Tall left image */}
              <div className="row-span-2 rounded-3xl overflow-hidden shadow-md">
                <img
                  src={fruitMosaic[0].src}
                  alt={fruitMosaic[0].alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Top-right */}
              <div className="rounded-3xl overflow-hidden shadow-md">
                <img
                  src={fruitMosaic[1].src}
                  alt={fruitMosaic[1].alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Middle-right */}
              <div className="rounded-3xl overflow-hidden shadow-md">
                <img
                  src={fruitMosaic[2].src}
                  alt={fruitMosaic[2].alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Bottom spanning both */}
              <div className="col-span-2 rounded-3xl overflow-hidden shadow-md">
                <img
                  src={fruitMosaic[3].src}
                  alt={fruitMosaic[3].alt}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
