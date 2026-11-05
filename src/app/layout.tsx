
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter-latin.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-latin-ext.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

const playfair = localFont({
  src: "../../public/fonts/playfair-display.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Whisk It Fruity Fusion | Fresh Fruit Drink – Ghana",
  description:
    "Whisk It Fruity Fusion offers fresh fruit drinks made with real mango, apple, pawpaw, watermelon, your choice of milk or yoghurt base, sago seeds, chia seeds and jelly. Order online for GH₵20 per bottle.",
  keywords:
    "Whisk It, Fruity Fusion, fresh fruit drink, Ghana, mango, pawpaw, watermelon, apple, milk, yoghurt, sago seeds, chia seeds",
  openGraph: {
    title: "Whisk It Fruity Fusion | Fresh Fruit Drink",
    description:
      "Fresh fruit drinks made with real fruits and your choice of milk or yoghurt base. Order online for GH₵20 per bottle.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
