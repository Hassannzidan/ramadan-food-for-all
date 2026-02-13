import { useState } from "react";
import logo from "@/assets/logo.jpg";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
        <a href="#hero" className="flex items-center gap-2">
          <img src={logo} alt="شعار مائدة الخير" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-xl font-bold" style={{ color: 'hsl(195, 55%, 18%)' }}>طبق الخير</span>
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
        <button onClick={() => setOpen(true)} className="md:hidden text-foreground">
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile drawer from left */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <img src={logo} alt="شعار" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-bold" style={{ color: 'hsl(195, 55%, 18%)' }}>طبق الخير</span>
            </SheetTitle>
          </SheetHeader>
          <ul className="flex flex-col gap-2 p-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-foreground/80 hover:text-accent transition-colors font-medium block py-2 text-right"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-4">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="bg-gradient-gold text-primary-foreground px-6 py-2.5 rounded-lg font-bold block text-center shadow-golden"
              >
                تبرع الآن
              </a>
            </li>
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
