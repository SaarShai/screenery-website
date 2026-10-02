"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sections } from "@/data/catalog";

export default function NavA() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const f = () => {
      setScrolled(window.scrollY > 40);
      // Current chapter: the last catalogue section whose top has passed under the header.
      let cur: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.slug);
        if (el && el.getBoundingClientRect().top < 120) cur = s.slug;
      }
      const after = document.getElementById("specs");
      if (after && after.getBoundingClientRect().top < 120) cur = null;
      setActive(cur);
    };
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  const i = sections.findIndex((s) => s.slug === active);

  // Phone chapter bar: slide the current chapter into view, centred where it can be.
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const b = bar.current;
    const a = b?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!b || !a) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    b.scrollTo({ left: a.offsetLeft - (b.clientWidth - a.offsetWidth) / 2, behavior: still ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 border-b bg-[#f6f1e8] transition-shadow duration-500 ${scrolled ? "border-[#d8d0c4] shadow-[0_1px_12px_rgba(23,21,15,0.06)]" : "border-transparent"}`}>
      <div className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between px-6 md:px-12">
        <a href="#"><Image src="/images/screenery-logo-dark.svg" alt="Screenery" width={200} height={41} className="h-7 w-auto md:h-8" priority /></a>
        <div className="flex items-center gap-8 whitespace-nowrap text-[12px] uppercase tracking-[0.14em] md:max-lg:gap-5 md:max-lg:text-[11px] md:max-lg:tracking-[0.1em]">
          {sections.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              aria-current={active === s.slug ? "true" : undefined}
              className={`hidden md:inline underline-offset-8 transition-colors hover:text-[#6f5a41] ${active === s.slug ? "underline decoration-[#8b7355] decoration-2" : ""}`}
            >
              {s.name}
            </a>
          ))}
          <a href="#specs" className="hidden lg:inline underline-offset-8 transition-colors hover:text-[#6f5a41]">Specifications</a>
          <a href="#contact" className="bg-[#17150f] px-5 py-3 text-[#f6f1e8] hover:bg-[#70593f] transition-colors">Quote</a>
        </div>
      </div>

      {/* Phone chapter bar: appears inside the catalogue, scrolls sideways */}
      {active && (
        <div ref={bar} className="relative flex items-center gap-5 overflow-x-auto [scrollbar-width:none] border-t border-[#d8d0c4] px-6 py-2.5 text-[12px] uppercase tracking-[0.14em] md:hidden">
          <span className="shrink-0 tabular-nums text-[#6f5a41]">0{i + 1}/0{sections.length}</span>
          {sections.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} aria-current={active === s.slug ? "true" : undefined} className={`shrink-0 ${active === s.slug ? "text-[#17150f] underline decoration-[#8b7355] decoration-2 underline-offset-8" : "text-[#5b574f]"}`}>
              {s.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
