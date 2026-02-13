const stats = [
  { number: "٥٠,٠٠٠+", label: "وجبة تم توزيعها" },
  { number: "١٢,٠٠٠+", label: "أسرة مستفيدة" },
  { number: "٥٠٠+", label: "متطوع ومتطوعة" },
  { number: "١٥+", label: "مدينة ومنطقة" },
];

const StatsSection = () => {
  return (
    <section id="stats" className="py-24 bg-gradient-emerald relative overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold-light font-bold text-sm tracking-wider">تأثيرنا</span>
          <h2 className="text-3xl md:text-5xl font-black text-primary-foreground mt-3">
            أرقام تتحدث عن <span className="text-gradient-gold">أثرنا</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-black text-gradient-gold mb-2">
                {stat.number}
              </p>
              <p className="text-primary-foreground/80 font-medium text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
