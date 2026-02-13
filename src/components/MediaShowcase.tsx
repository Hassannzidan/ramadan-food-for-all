import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Play, Image as ImageIcon } from "lucide-react";

import media1 from "@/assets/media-1.jpg";
import media2 from "@/assets/media-2.jpg";
import media3 from "@/assets/media-3.jpg";
import media4 from "@/assets/media-4.jpg";
import media5 from "@/assets/media-5.jpg";
import media6 from "@/assets/media-6.jpg";

const categories = ["الكل", "توزيع الطعام", "موائد الإفطار", "التجهيز والتحضير"];

const mediaItems = [
  { src: media1, title: "توزيع الطرود الغذائية", category: "توزيع الطعام", type: "image" as const },
  { src: media2, title: "مائدة إفطار جماعية", category: "موائد الإفطار", type: "image" as const },
  { src: media3, title: "تجهيز الوجبات", category: "التجهيز والتحضير", type: "image" as const },
  { src: media4, title: "فرحة الأطفال", category: "توزيع الطعام", type: "image" as const },
  { src: media5, title: "إفطار المئات", category: "موائد الإفطار", type: "image" as const },
  { src: media6, title: "شحن المواد الغذائية", category: "التجهيز والتحضير", type: "image" as const },
];

const MediaShowcase = () => {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "الكل"
    ? mediaItems
    : mediaItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-card islamic-pattern">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-accent font-bold text-sm tracking-wider">من أعمالنا</span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mt-3 mb-4">
            لحظات من <span className="text-gradient-gold">العطاء</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            شاهد صوراً من أنشطتنا وفعالياتنا في خدمة المجتمع خلال شهر رمضان المبارك
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gradient-gold text-primary-foreground shadow-golden"
                  : "bg-background text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              onClick={() => openLightbox(i)}
              className="break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer relative"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                <span className="text-accent text-xs font-bold mb-1">{item.category}</span>
                <p className="text-primary-foreground font-bold text-lg">{item.title}</p>
              </div>
              {/* Icon */}
              <div className="absolute top-3 left-3 bg-primary/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ImageIcon className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-xl flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-6 left-6 text-primary-foreground/80 hover:text-primary-foreground transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 md:right-8 text-primary-foreground/60 hover:text-primary-foreground transition-colors z-10"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 md:left-8 text-primary-foreground/60 hover:text-primary-foreground transition-colors z-10"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="max-w-5xl max-h-[85vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].title}
              className="w-full h-full object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <p className="text-primary-foreground font-bold text-xl">{filtered[lightboxIndex].title}</p>
              <span className="text-accent text-sm">{filtered[lightboxIndex].category}</span>
              <p className="text-primary-foreground/50 text-sm mt-1">
                {lightboxIndex + 1} / {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaShowcase;
