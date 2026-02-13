import { Heart, Users, Utensils } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "رسالتنا",
    description: "نؤمن بأن لكل محتاج حق في وجبة كريمة خلال شهر رمضان المبارك.",
  },
  {
    icon: Users,
    title: "مجتمعنا",
    description: "نعمل مع أكثر من ٥٠٠ متطوع لتوصيل الطعام إلى الأسر في جميع المناطق.",
  },
  {
    icon: Utensils,
    title: "رؤيتنا",
    description: "مائدة رمضان تجمع الجميع — لا نريد أن يبقى أحد جائعاً في الشهر الكريم.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 islamic-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-accent font-bold text-sm tracking-wider">من نحن</span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mt-3 mb-4">
            نشر الخير في <span className="text-gradient-gold">رمضان</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            حملة مائدة رمضان هي مبادرة خيرية لتوفير وجبات الإفطار والسحور للأسر المحتاجة
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-golden transition-shadow duration-300 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-primary-foreground" size={28} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
