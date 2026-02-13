import { Mail, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-emerald relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold-light font-bold text-sm tracking-wider">تواصل معنا</span>
          <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mt-3 mb-4">
            كن جزءاً من <span className="text-gradient-gold">الخير</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
            تواصل معنا للتبرع أو التطوع أو لأي استفسار
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="text-gold-light" size={24} />
            </div>
            <p className="text-primary-foreground font-bold mb-1">الهاتف</p>
            <p className="text-primary-foreground/70" dir="ltr">+966 50 123 4567</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="text-gold-light" size={24} />
            </div>
            <p className="text-primary-foreground font-bold mb-1">البريد الإلكتروني</p>
            <p className="text-primary-foreground/70">info@ramadan-table.org</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-gold-light" size={24} />
            </div>
            <p className="text-primary-foreground font-bold mb-1">الموقع</p>
            <p className="text-primary-foreground/70">الرياض، المملكة العربية السعودية</p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="mailto:info@ramadan-table.org"
            className="inline-block bg-gradient-gold text-primary-foreground px-10 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-golden"
          >
            تبرع الآن 💛
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
