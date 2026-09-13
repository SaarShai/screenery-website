"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { sections } from "@/data/catalog";

export default function NavB() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div className={`mx-auto flex max-w-[1400px] items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${scrolled ? "bg-white/90 text-black shadow-lg backdrop-blur" : "bg-white/10 text-white backdrop-blur"}`}>
        <a href="#"><Image src={scrolled ? "/images/screenery-logo-dark.svg" : "/images/screenery logo.svg"} alt="Screenery" width={200} height={41} className="h-6 w-auto" priority /></a>
        <div className="hidden items-center gap-1 text-[12px] font-bold uppercase tracking-[0.15em] md:flex">
          {sections.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="rounded-full px-3 py-1.5 transition hover:bg-black/10">{s.name}</a>
          ))}
          <a href="#contact" className={`ml-2 rounded-full px-4 py-1.5 transition ${scrolled ? "bg-black text-white" : "bg-[#ffd23f] text-black"}`}>Quote</a>
        </div>
      </div>
    </nav>
  );
}
