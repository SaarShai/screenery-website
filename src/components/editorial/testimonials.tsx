"use client";

import { useState } from "react";
import Image from "next/image";
import { testimonials, type Testimonial } from "@/data/testimonials";

/** Logos at a similar visual weight: equal ink area, capped in height and width. */
function Logo({ logo }: { logo: Testimonial["logo"] }) {
  const aspect = logo.w / logo.h;
  const h = Math.min(48, Math.max(14, Math.sqrt(4200 / aspect)) * (logo.scale ?? 1));
  const w = Math.min(180, h * aspect);
  return (
    <div className="flex h-12 items-center">
      <Image src={logo.src} alt={logo.alt} width={Math.round(w)} height={Math.round(w / aspect)} style={{ width: Math.round(w), height: Math.round(w / aspect) }} className="opacity-60 grayscale" />
    </div>
  );
}

/**
 * What hotels say: quotes drifting sideways in an endless bar under the logos. Hover or the
 * pause button stops it; reduced motion gets a still row to scroll by hand.
 */
export default function Testimonials() {
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  if (!n) return null;

  return (
    <div className="mt-14 md:mt-20">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6">
        <p className="text-[12px] uppercase tracking-[0.2em] text-[#6f5a41]">In their words</p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="py-2 text-[11px] uppercase tracking-[0.14em] text-[#5b574f] underline decoration-[#17150f]/20 underline-offset-4 hover:text-[#17150f] motion-reduce:hidden"
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>

      <div className="-mx-6 mt-6 overflow-hidden border-y border-[#17150f]/10 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] md:-mx-12 motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
        <ul
          className="flex w-max animate-[marquee_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none"
          style={{ animationDuration: `${n * 12}s`, animationPlayState: paused ? "paused" : undefined }}
        >
          {/* The list runs twice so the loop has no seam; the copy is hidden from screen readers */}
          {[...testimonials, ...testimonials].map((t, k) => (
            <li
              key={k}
              aria-hidden={k >= n || undefined}
              className={`flex w-[min(82vw,480px)] shrink-0 flex-col border-r border-[#17150f]/10 px-8 py-8 md:px-10 ${k >= n ? "motion-reduce:hidden" : ""}`}
            >
              <Logo logo={t.logo} />
              <blockquote className="mt-5 font-display text-[17px] italic leading-snug md:text-[19px]">&ldquo;{t.quote}&rdquo;</blockquote>
              {/* Attribution sits on a shared baseline at the foot of each quote */}
              <div className="mt-auto pt-5">
                <p className="text-[14px] font-medium">{t.name}</p>
                <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-[#6f5a41]">
                  {t.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
