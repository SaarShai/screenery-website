"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Design } from "@/data/catalog";

/** Bespoke: a gallery of past commissions, not products for sale, with one enquiry. */
export default function Showcase({ items }: { items: Design[] }) {
  const shots = items.flatMap((d) => [
    ...d.variants.map((v) => ({ d, label: v.label, image: v.image })),
    ...d.rooms.map((image) => ({ d, label: "In the room", image })),
  ]);
  const [i, setI] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const step = (n: number) => setI((i + n + shots.length) % shots.length);
  const open = (k: number) => {
    setI(k);
    dialog.current?.showModal();
  };
  const enquire = () => {
    window.dispatchEvent(new CustomEvent("enquire", { detail: "A bespoke design" }));
    document.getElementById("contact")?.scrollIntoView();
  };
  const shown = shots[i];

  return (
    <>
      {/* Projects: each commission's lead photo large, its other views as a strip */}
      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
        {items.map((d) => {
          const first = shots.findIndex((s) => s.d === d);
          const own = shots.filter((s) => s.d === d);
          return (
            <figure key={d.slug}>
              <button
                type="button"
                onClick={() => open(first)}
                aria-label={`Enlarge ${d.name}`}
                className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden bg-[#e4dccf]"
              >
                <Image src={own[0].image.src} alt={`${d.name}: ${own[0].label}`} fill sizes="(max-width: 640px) 100vw, 610px" className="object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none" />
              </button>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {own.slice(1, 5).map((s, k) => (
                  <button key={s.image.src} type="button" onClick={() => open(first + k + 1)} aria-label={`Enlarge ${d.name}: ${s.label}`} className="relative aspect-[3/2] cursor-zoom-in overflow-hidden bg-[#e4dccf]">
                    <Image src={s.image.src} alt="" fill sizes="150px" className="object-cover transition-opacity hover:opacity-85" />
                  </button>
                ))}
              </div>
              <figcaption className="mt-4">
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#6f5a41]">{d.tagline}</p>
                <h3 className="font-display mt-1.5 text-2xl leading-tight">{d.name}</h3>
                <p className="mt-2 text-[16px] leading-[25px] text-[#5b574f]">{d.description}</p>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="mt-16 flex flex-col items-start gap-5 border-t border-[#17150f]/10 pt-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display max-w-xl text-2xl leading-snug">Have a building, a mascot or a story in mind? We design it with you, from first sketch to finished set.</p>
        <button type="button" onClick={enquire} className="shrink-0 bg-[#17150f] px-6 py-4 text-[12px] uppercase tracking-[0.14em] text-[#f6f1e8] transition-colors hover:bg-[#70593f]">
          Enquire about a bespoke design →
        </button>
      </div>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-w-[94vw] bg-transparent p-0 text-[#f6f1e8] backdrop:bg-[#17150f]/90"
      >
        <Image src={shown.image.src} alt={`${shown.d.name}: ${shown.label}`} width={shown.image.w} height={shown.image.h} sizes="94vw" className="h-auto max-h-[82vh] w-auto max-w-[94vw] object-contain" />
        <div className="mt-3 flex items-center justify-between gap-6 text-[13px]">
          <p>
            <span className="font-display text-lg">{shown.d.name}</span>
            <span className="ml-3 uppercase tracking-[0.14em] text-white/70">{shown.d.tagline}</span>
          </p>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="px-3 py-2 hover:text-white">←</button>
            <span className="tabular-nums text-white/70">{i + 1} / {shots.length}</span>
            <button type="button" onClick={() => step(1)} aria-label="Next photo" className="px-3 py-2 hover:text-white">→</button>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="ml-2 px-3 py-2 uppercase tracking-[0.14em] hover:text-white">Close ✕</button>
          </div>
        </div>
      </dialog>
    </>
  );
}
