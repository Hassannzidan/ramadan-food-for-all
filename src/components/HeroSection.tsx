import heroImg from "@/assets/hero-donate-food.jpg";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="مائدة رمضان" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-primary/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="animate-fade-up">
          <p className="text-gold-light text-lg md:text-xl mb-4 font-medium">
            ✦ حفظ النعمة · نشر الخير ✦
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-primary-foreground mb-6 leading-tight">
            مائدة الخير
            <br />
            <span className="text-gradient-gold">من فائض إلى أمل</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            نجمع فائض الطعام ونُعيد تجهيزه في وجبات متكاملة
            لنقدمها للأسر الأكثر احتياجًا بكرامة واحترام.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-gradient-gold text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-golden"
            >
              ساهم في التبرع
            </a>
            <a
              href="#about"
              className="border-2 border-gold-light/40 text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-foreground/10 transition-colors"
            >
              تعرف علينا
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-gold-light/50 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-gold-light/70 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
