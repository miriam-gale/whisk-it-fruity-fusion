import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Heart, Smile } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DRINKS } from "@/lib/types";

export const metadata: Metadata = {
  title: "About – Whisk It Fruity Fusion",
  description:
    "Learn about Whisk It Fruity Fusion — a Ghanaian fresh fruit drink brand crafted with real fruits, your choice of milk or yoghurt base, sago seeds, chia seeds and jelly.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section
          className="py-20 lg:py-28 text-center"
          style={{
            background: "linear-gradient(135deg, #fff8f0 0%, #fce4e4 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[#8b1a1a] text-sm font-semibold uppercase tracking-widest mb-4">
              Our Story
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a0808] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              About Whisk It
              <br />
              Fruity Fusion
            </h1>
            <p className="text-xl text-gray-600 italic max-w-xl mx-auto">
              &ldquo;Shake • Sip • Smile&rdquo;
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2
                  className="text-3xl font-bold text-[#1a0808] mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Who We Are
                </h2>
                <div className="space-y-5 text-gray-600 text-base leading-relaxed">
                  <p>
                    Whisk It Fruity Fusion is a Ghanaian beverage brand that
                    brings you freshly crafted fruit milk drinks. We believe
                    that a great drink should be full of real flavour — and that
                    is exactly what we deliver with every bottle.
                  </p>
                  <p>
                    We combine the richness of tropical fruits like mango,
                    pawpaw, watermelon and apple with your choice of fresh milk
                    or yoghurt, and finish each bottle with fun, playful
                    textures from sago seeds, chia seeds and jelly.
                  </p>
                  <p>
                    Our drinks are made for everyone — whether you want a
                    refreshing afternoon pick-me-up, a fruity treat for a
                    friend, or a fun drink experience for the whole family.
                  </p>
                </div>
              </div>

              <div>
                <h2
                  className="text-3xl font-bold text-[#1a0808] mb-6"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Why We Started
                </h2>
                <div className="space-y-5 text-gray-600 text-base leading-relaxed">
                  <p>
                    We started Whisk It because we wanted a drink that felt
                    personal — something that tasted like it was made with real
                    care and real fruit. Not something mass-produced, but
                    something you could feel good about drinking.
                  </p>
                  <p>
                    Ghana is blessed with incredible tropical fruits, and we
                    wanted to put those fruits front and centre in a way that
                    was fun, delicious and accessible to everyone.
                  </p>
                  <p>
                    Every combination we offer has been carefully thought out
                    to give you a drink that is creamy, refreshing and
                    genuinely enjoyable from the first sip to the last.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section
          className="py-20"
          style={{ backgroundColor: "#fff8f0" }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#1a0808] mb-12"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  Icon: Leaf,
                  bg: "#f0f7f4",
                  color: "#2d6a4f",
                  title: "Freshness",
                  body: "We use real, carefully selected fruits in every bottle.",
                },
                {
                  Icon: Heart,
                  bg: "#fff8f0",
                  color: "#8b1a1a",
                  title: "Warmth",
                  body: "We pour genuine care into every drink we make.",
                },
                {
                  Icon: Smile,
                  bg: "#fdf2f2",
                  color: "#8b1a1a",
                  title: "Joy",
                  body: "Every sip should put a smile on your face.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-8 shadow-sm text-center"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: v.bg }}
                    aria-hidden="true"
                  >
                    <v.Icon size={26} color={v.color} strokeWidth={1.5} />
                  </div>
                  <h3
                    className="font-bold text-[#8b1a1a] text-lg mb-3"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Combinations */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#1a0808] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Choose Your Base
            </h2>
            <p className="text-gray-500 text-base mb-10">
              GH₵20 per bottle — choose the base that suits you best.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-sm sm:max-w-none mx-auto">
              {DRINKS.map((drink) => (
                <div
                  key={drink.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <div className="h-24 overflow-hidden rounded-t-2xl">
                    <img
                      src={drink.images[0]}
                      alt={drink.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-3 py-3 text-center">
                    <p
                      className="text-xs font-semibold text-[#8b1a1a] leading-snug"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {drink.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">GH₵{drink.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/order"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] shadow-md transition-all"
            >
              Order Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
