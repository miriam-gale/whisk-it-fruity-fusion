import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import IngredientsSection from "@/components/IngredientsSection";
import BenefitsSection from "@/components/BenefitsSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <IngredientsSection />
        <BenefitsSection />
        <WhyChooseSection />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
