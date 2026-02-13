import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import MediaShowcase from "@/components/MediaShowcase";
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
      <MediaShowcase />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
