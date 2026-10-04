import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Whisk It Fruity Fusion | Fresh Fruit Milk Drink – Ghana",
  description:
    "Whisk It Fruity Fusion offers delicious fresh fruit milk drinks made with real mango, apple, pawpaw, watermelon, milk, sago seeds, chia seeds and jelly. Order online for GH₵15 per bottle.",
  keywords:
    "Whisk It, Fruity Fusion, fresh fruit milk drink, Ghana, mango, pawpaw, watermelon, apple, sago seeds, chia seeds",
  openGraph: {
    title: "Whisk It Fruity Fusion | Fresh Fruit Milk Drink",
    description:
      "Fresh fruit milk drinks made with real fruits. Order online for GH₵15 per bottle.",
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
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#8b1a1a",
              color: "#fff",
              borderRadius: "8px",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
