import AnimateOnScroll from "@/components/AnimateOnScroll";

const sharedIngredients = [
  {
    name: "Mango",
    description: "Sweet tropical mango for a rich, fruity depth.",
    image: "/ingredients/mango.png",
    featured: true,
  },
  {
    name: "Apple",
    description: "Crisp apple for a clean, bright finish.",
    image: "/ingredients/apple.png",
    featured: false,
  },
  {
    name: "Pawpaw",
    description: "Smooth, creamy pawpaw for a tropical twist.",
    image: "/ingredients/pawpaw.png",
    featured: false,
  },
  {
    name: "Watermelon",
    description: "Juicy watermelon for a cool, refreshing hit.",
    image: "/ingredients/watermelon.png",
    featured: false,
  },
  {
    name: "Sago Seeds",
    description: "Soft pearls that add a delightful chew.",
    image: "/ingredients/sago-seeds.png",
    featured: false,
  },
  {
    name: "Chia Seeds",
    description: "Tiny seeds that add texture and character.",
    image: "/ingredients/chia-seeds.png",
    featured: false,
  },
  {
    name: "Jelly",
    description: "Colourful jelly pieces for a fun, playful bite.",
    image: "/ingredients/jelly.png",
    featured: false,
  },
];

const baseOptions = [
  {
    name: "Milk",
    description: "Fresh milk — the classic creamy base option.",
    image: "/ingredients/milk.png",
  },
  {
    name: "Yoghurt",
    description: "Rich yoghurt — the tangy alternative base option.",
    image: "/ingredients/yoghurt.png",
  },
];

export default function IngredientsSection() {
  return (
    <section
      id="ingredients"
      className="py-24 lg:py-32 bg-white"
      aria-labelledby="ingredients-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-[#2d6a4f] text-xs font-bold uppercase tracking-[0.22em] mb-4">
            What Goes In
          </p>
          <h2
            id="ingredients-heading"
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#1a0808] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Fresh Ingredients.{" "}
            <span className="text-[#8b1a1a]">Delicious Fusion.</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Seven core ingredients in every bottle — four tropical fruits and
            three fun textures — plus your choice of one base: fresh milk or
            yoghurt.
          </p>
        </AnimateOnScroll>

        {/* Grid — shared ingredients + base options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">

          {/* Seven shared ingredients — Mango is tall on desktop */}
          {sharedIngredients.map((ingredient, i) => (
            <AnimateOnScroll
              key={ingredient.name}
              mode="reveal"
              stagger={Math.min(((i % 4) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, 8)}
              className={ingredient.featured ? "sm:row-span-2 lg:row-span-2" : ""}
            >
              <article className="group h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                <div
                  className="overflow-hidden"
                  style={{ height: ingredient.featured ? "clamp(220px, 30vw, 320px)" : "clamp(120px, 18vw, 180px)" }}
                >
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-600"
                    style={{ transition: "transform 0.6s ease" }}
                    loading="lazy"
                  />
                </div>
                <div className="px-4 py-3">
                  <h3
                    className="font-bold text-sm text-[#1a0808] leading-snug"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {ingredient.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {ingredient.description}
                  </p>
                </div>
              </article>
            </AnimateOnScroll>
          ))}

          {/* "Choose One Base" full-width label — separates shared from alternatives */}
          <div
            className="col-span-2 sm:col-span-3 lg:col-span-4 flex items-center gap-3 pt-3 pb-1"
            aria-hidden="true"
          >
            <div className="flex-1 h-px bg-gray-100" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8b1a1a] shrink-0">
              Choose One Base
            </p>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Two alternative base options — customer picks exactly one */}
          {baseOptions.map((ingredient, i) => (
            <AnimateOnScroll
              key={ingredient.name}
              mode="reveal"
              stagger={(i + 1) as 1 | 2}
              className="lg:col-span-2"
            >
              <article className="group h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                <div
                  className="overflow-hidden"
                  style={{ height: "clamp(120px, 18vw, 180px)" }}
                >
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-600"
                    style={{ transition: "transform 0.6s ease" }}
                    loading="lazy"
                  />
                </div>
                <div className="px-4 py-3">
                  <h3
                    className="font-bold text-sm text-[#1a0808] leading-snug"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {ingredient.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {ingredient.description}
                  </p>
                </div>
              </article>
            </AnimateOnScroll>
          ))}

        </div>

        <AnimateOnScroll className="mt-10 text-center">
          <p className="text-sm text-gray-400">
            Every bottle has the same seven core ingredients. You choose one base
            — milk or yoghurt — bringing the total to eight.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
