import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

const images = [
  { src: gallery1, alt: "توزيع الطعام على الأسر" },
  { src: gallery2, alt: "مائدة إفطار رمضانية" },
  { src: gallery3, alt: "تجهيز الطرود الغذائية" },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-24 bg-card islamic-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-accent font-bold text-sm tracking-wider">معرض الصور</span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mt-3 mb-4">
            لحظات من <span className="text-gradient-gold">العطاء</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden group cursor-pointer relative aspect-square"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-primary-foreground font-bold text-lg">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
