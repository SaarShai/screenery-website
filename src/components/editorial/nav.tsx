"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { sections } from "@/data/catalog";

export default function NavA() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#f6f1e8]/90 backdrop-blur border-b border-[#17150f]/10" : ""}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <a href="#"><Image src="/images/screenery-logo-dark.svg" alt="Screenery" width={200} height={41} className="h-6 w-auto md:h-7" priority /></a>
        <div className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.22em] md:flex">
          {sections.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="hover:text-[#8b7355] transition-colors">{s.name}</a>
          ))}
          <a href="#contact" className="border border-[#17150f] px-4 py-2 hover:bg-[#17150f] hover:text-[#f6f1e8] transition-colors">Quote</a>
        </div>
      </div>
    </nav>
  );
}
