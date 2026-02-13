import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="font-cairo">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <HowItWorks />
      <GallerySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
