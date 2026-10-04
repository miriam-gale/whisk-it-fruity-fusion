"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Full-bleed background image ── */}
      <img
        src="/hero-image.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center center" }}
      />

      {/* ── Warm cream gradient overlay — left opaque for text, right reveals image ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(255,248,240,0.97) 0%, rgba(255,248,240,0.94) 24%, rgba(255,248,240,0.82) 42%, rgba(255,248,240,0.46) 60%, rgba(255,248,240,0.20) 78%, rgba(255,248,240,0.12) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Bottom fade — softens where hero meets the next section ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(255,248,240,0.70) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Hero content ── */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 lg:pt-32 lg:pb-28">
        <div className="max-w-[560px]">

          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-[#f3c9c9] rounded-full px-4 py-1.5 mb-7 shadow-sm">
            <span
              className="w-2 h-2 rounded-full bg-[#8b1a1a] shrink-0"
              style={{ animation: "pulse 2s infinite" }}
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold text-[#8b1a1a] uppercase tracking-[0.18em]">
              Fresh Fruit Milk Drink · Ghana
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-h1 text-[2.6rem] sm:text-5xl lg:text-[3.6rem] font-bold leading-[1.10] text-[#1a0808] mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Fresh.{" "}
            <span className="text-[#8b1a1a]">Fruity.</span>
            <br />
            Made to Make
            <br />
            You Smile.
          </h1>

          {/* Description */}
          <p className="hero-sub text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-[400px]">
            Refreshing fruit milk drinks made with real fruits, milk,
            sago seeds, chia seeds and jelly.
          </p>

          {/* Price */}
          <div className="hero-price flex items-baseline gap-2 mb-8">
            <span
              className="text-3xl font-bold text-[#8b1a1a]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              GH₵15
            </span>
            <span className="text-gray-500 text-sm font-medium">/ bottle</span>
          </div>

          {/* CTAs */}
          <div className="hero-ctas flex flex-col sm:flex-row gap-3">
            <Link
              href="/order"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white rounded-full bg-[#8b1a1a] hover:bg-[#6b1212] shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Order Now
            </Link>
            <Link
              href="/#ingredients"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#8b1a1a] rounded-full bg-white/90 border-2 border-[#8b1a1a] hover:bg-[#fdf2f2] transition-all duration-200 backdrop-blur-sm"
            >
              See What&apos;s Inside
            </Link>
          </div>

          {/* Tagline */}
          <p
            className="hero-tagline mt-8 text-sm text-gray-500 italic"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shake • Sip • Smile
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500 hover:text-[#8b1a1a] transition-colors cursor-pointer bg-transparent border-0"
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </button>
    </section>
  );
}
