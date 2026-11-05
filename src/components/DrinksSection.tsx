import Link from "next/link";
import { DRINKS } from "@/lib/types";

export default function DrinksSection() {
  return (
    <section
      id="drinks"
      className="py-20 lg:py-28 bg-white"
      aria-labelledby="drinks-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-[#8b1a1a] text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Our Menu
          </p>
          <h2
            id="drinks-heading"
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#1a0808] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Choose Your Base
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto">
            Two base options. One fruity experience.
          </p>
        </div>

        {/* Drinks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {DRINKS.map((drink) => (
            <article
              key={drink.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Split ingredient image header */}
              <div className="relative h-44 overflow-hidden flex">
                {drink.images.map((src, i) => (
                  <div
                    key={src}
                    className="relative overflow-hidden flex-1"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                    {/* Thin divider between images */}
                    {i < drink.images.length - 1 && (
                      <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-white/60 z-10" />
                    )}
                  </div>
                ))}
                {/* Dark overlay at bottom for legibility */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)" }}
                  aria-hidden="true"
                />
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="text-base font-bold text-[#1a0808] mb-2 leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {drink.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                  {drink.description}
                </p>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <span
                      className="text-2xl font-bold text-[#8b1a1a]"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      GH₵{drink.price}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/ bottle</span>
                  </div>
                  <Link
                    href={`/order?flavour=${drink.slug}`}
                    className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] transition-colors shadow-sm hover:shadow-md"
                    aria-label={`Order ${drink.name}`}
                  >
                    Order This
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm mb-5">
            Both options are{" "}
            <span className="font-semibold text-[#8b1a1a]">GH₵20 per bottle</span>
          </p>
          <Link
            href="/order"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 text-base font-semibold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Order Now
          </Link>
        </div>
      </div>
    </section>
  );
}
