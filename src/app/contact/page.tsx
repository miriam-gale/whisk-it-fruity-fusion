import type { Metadata } from "next";
import { Phone, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTACT_NUMBERS, WA_MESSAGE } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contact – Whisk It Fruity Fusion",
  description:
    "Contact Whisk It Fruity Fusion to place an order or ask a question. Available on phone and WhatsApp.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section
          className="py-20 lg:py-24 text-center"
          style={{
            background: "linear-gradient(135deg, #fff8f0 0%, #fce4e4 100%)",
          }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <p className="text-[#8b1a1a] text-sm font-semibold uppercase tracking-widest mb-4">
              Get in Touch
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold text-[#1a0808] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Contact Us
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              We would love to hear from you. Reach us on any of the numbers
              below — all are available for both calls and WhatsApp.
            </p>
          </div>
        </section>

        {/* Contact Numbers */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-[#1a0808] mb-10 text-center"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Our Contact Numbers
            </h2>

            <div className="space-y-6">
              {CONTACT_NUMBERS.map((num) => (
                <div
                  key={num.display}
                  className="bg-[#fff8f0] border border-[#f9c9c9] rounded-2xl p-6 sm:p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p
                        className="text-2xl sm:text-3xl font-bold text-[#1a0808]"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {num.display}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Available for calls &amp; WhatsApp
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <a
                        href={`tel:${num.tel}`}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#8b1a1a] border-2 border-[#8b1a1a] rounded-full hover:bg-[#8b1a1a] hover:text-white transition-colors"
                        aria-label={`Call ${num.display}`}
                      >
                        <Phone size={16} aria-hidden="true" />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${num.wa.replace("+", "")}?text=${WA_MESSAGE}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#25d366] rounded-full hover:bg-[#1da851] transition-colors shadow-sm"
                        aria-label={`WhatsApp ${num.display}`}
                      >
                        <MessageCircle size={16} aria-hidden="true" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order CTA */}
            <div
              className="mt-14 rounded-3xl p-10 text-center"
              style={{
                background: "linear-gradient(135deg, #8b1a1a 0%, #6b1212 100%)",
              }}
            >
              <p className="text-red-200 text-sm uppercase tracking-widest font-semibold mb-3">
                Ready to Order?
              </p>
              <h3
                className="text-white text-2xl sm:text-3xl font-bold mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Order Online in Minutes
              </h3>
              <p className="text-red-100 text-base mb-8 max-w-sm mx-auto">
                Choose your flavour and pay securely online. Four combinations
                at GH₵15 each.
              </p>
              <a
                href="/order"
                className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-[#8b1a1a] bg-white rounded-full hover:bg-[#fff8f0] transition-colors shadow-lg"
              >
                Order Now
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
