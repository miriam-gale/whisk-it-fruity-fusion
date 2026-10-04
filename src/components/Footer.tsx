"use client";

import Link from "next/link";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { CONTACT_NUMBERS, WA_MESSAGE } from "@/lib/types";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a0808] text-gray-300" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5" aria-label="Whisk It Fruity Fusion – Home">
              <img
                src="/logo.png"
                alt="Whisk It Fruity Fusion"
                className="h-14 w-auto object-contain"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.style.display = "none";
                  const fallback = img.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <span
                className="hidden text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Whisk It
              </span>
            </Link>
            <p
              className="text-base font-semibold text-white mb-1"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Whisk It Fruity Fusion
            </p>
            <p className="text-sm text-gray-400 mb-1">Fresh Fruit Milk Drink</p>
            <p className="text-sm text-gray-400 italic mb-4">Shake • Sip • Smile</p>
            <p className="text-xs text-gray-600 uppercase tracking-wider">Made in Ghana</p>
            <div className="flex items-start gap-1.5 mt-3">
              <MapPin size={11} className="text-gray-600 shrink-0 mt-0.5" aria-hidden="true" />
              <address className="not-italic text-xs text-gray-600 leading-snug">
                Adama Akuredza Avenue,<br />
                Dzorwulu, Accra, Ghana
              </address>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/#drinks", label: "Our Drinks" },
                  { href: "/#ingredients", label: "Ingredients" },
                  { href: "/#location", label: "Our Location" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" },
                  { href: "/order", label: "Order Now" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-5">
              Call or WhatsApp Us
            </h3>
            <div className="space-y-5">
              {CONTACT_NUMBERS.map((num) => (
                <div key={num.display} className="flex flex-col gap-2">
                  <a
                    href={`tel:${num.tel}`}
                    className="text-white font-semibold text-base hover:text-gray-300 transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}
                    aria-label={`Call ${num.display}`}
                  >
                    {num.display}
                  </a>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${num.tel}`}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors border border-gray-700 hover:border-gray-500 rounded-full px-3 py-1.5"
                      aria-label={`Call ${num.display}`}
                    >
                      <Phone size={11} aria-hidden="true" />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${num.wa.replace("+", "")}?text=${WA_MESSAGE}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#25d366] transition-colors border border-gray-700 hover:border-[#25d366] rounded-full px-3 py-1.5"
                      aria-label={`WhatsApp ${num.display}`}
                    >
                      <MessageCircle size={11} aria-hidden="true" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {year} Whisk It Fruity Fusion. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Fresh Fruit Milk Drink · Ghana
          </p>
        </div>
      </div>
    </footer>
  );
}
