import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "الرئيسية", href: "#hero" },
  { label: "من نحن", href: "#about" },
  { label: "تأثيرنا", href: "#stats" },
  { label: "كيف نعمل", href: "#how" },
  { label: "معرض الصور", href: "#gallery" },
  { label: "تواصل معنا", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <a href="#hero" className="text-2xl font-bold text-primary">
          🌙 <span className="text-gradient-gold">مائدة رمضان</span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-foreground/80 hover:text-accent transition-colors font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-block bg-gradient-gold text-primary-foreground px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-golden"
        >
          تبرع الآن
        </a>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground/80 hover:text-accent transition-colors font-medium block"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="bg-gradient-gold text-primary-foreground px-6 py-2.5 rounded-lg font-bold block text-center shadow-golden"
              >
                تبرع الآن
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
