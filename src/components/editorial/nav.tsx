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
    <nav className={`fixed inset-x-0 top-0 z-50 border-b bg-[#f6f1e8] transition-shadow duration-500 ${scrolled ? "border-[#d8d0c4] shadow-[0_1px_12px_rgba(23,21,15,0.06)]" : "border-transparent"}`}>
      <div className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between px-6 md:px-12">
        <a href="#"><Image src="/images/screenery-logo-dark.svg" alt="Screenery" width={200} height={41} className="h-7 w-auto md:h-8" priority /></a>
        <div className="flex items-center gap-8 text-[12px] uppercase tracking-[0.14em]">
          {sections.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="hidden md:inline hover:text-[#8b7355] transition-colors">{s.name}</a>
          ))}
          <a href="#contact" className="bg-[#17150f] px-5 py-3 text-[#f6f1e8] hover:bg-[#70593f] transition-colors">Quote</a>
        </div>
      </div>
    </nav>
  );
}
