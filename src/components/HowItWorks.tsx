import { HandHeart, Package, Truck, Smile } from "lucide-react";

const steps = [
  {
    icon: HandHeart,
    step: "٠١",
    title: "تبرع",
    description: "اختر المبلغ الذي تريد التبرع به عبر موقعنا أو تطبيقنا.",
  },
  {
    icon: Package,
    step: "٠٢",
    title: "تجهيز",
    description: "يقوم فريقنا بتجهيز الوجبات والطرود الغذائية بعناية.",
  },
  {
    icon: Truck,
    step: "٠٣",
    title: "توصيل",
    description: "يتم توصيل الوجبات إلى الأسر المحتاجة في مواعيدها.",
  },
  {
    icon: Smile,
    step: "٠٤",
    title: "فرحة",
    description: "تبرعك يرسم البسمة على وجوه المحتاجين في رمضان.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-accent font-bold text-sm tracking-wider">طريقة العمل</span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mt-3 mb-4">
            كيف <span className="text-gradient-gold">نعمل؟</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            خطوات بسيطة لتصل تبرعاتكم إلى من يستحقها
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <div key={i} className="relative text-center group">
              <div className="text-gold/20 text-7xl font-black absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 select-none">
                {item.step}
              </div>
              <div className="relative pt-12">
                <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-golden">
                  <item.icon className="text-primary-foreground" size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
