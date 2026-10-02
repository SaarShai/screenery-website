"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Section } from "@/data/catalog";

type Place = NonNullable<Section["world"]>[number];

/** "Around the world": a sideways strip of cities made for other hotels, with arrows and a viewer. */
export default function WorldStrip({ places }: { places: Place[] }) {
  const row = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const scroll = (d: number) => row.current?.scrollBy({ left: d * row.current.clientWidth * 0.8, behavior: "smooth" });
  const shown = places[i];

  return (
    <div className="mt-24">
      <div className="flex items-end justify-between gap-6 border-t border-[#17150f]/10 pt-10">
        <div>
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#6f5a41]">More skylines</p>
          <h3 className="font-display mt-3 text-[clamp(1.8rem,3.5vw,2.75rem)] leading-tight">Around the world</h3>
        </div>
        {places.length > 2 && (
          <div className="flex gap-2">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous cities" className="h-11 w-11 border border-[#17150f]/25 transition-colors hover:border-[#17150f]">←</button>
            <button type="button" onClick={() => scroll(1)} aria-label="More cities" className="h-11 w-11 border border-[#17150f]/25 transition-colors hover:border-[#17150f]">→</button>
          </div>
        )}
      </div>

      <ul ref={row} className="-mx-6 mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:none] md:-mx-12 md:px-12">
        {places.map((p, k) => (
          <li key={p.city} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[400px]">
            <button
              type="button"
              onClick={() => {
                setI(k);
                dialog.current?.showModal();
              }}
              aria-label={`Enlarge ${p.city}`}
              className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-[6px] bg-[#e4dccf] shadow-[0_12px_30px_-10px_rgba(60,45,25,0.22)]"
            >
              <Image src={p.image.src} alt={`${p.city} play-screen`} fill sizes="(max-width: 640px) 78vw, 400px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
            </button>
            <p className="font-display mt-4 text-xl leading-tight">{p.city}</p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-[#6f5a41]">{p.note}</p>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto max-w-[94vw] bg-transparent p-0 text-[#f6f1e8] backdrop:bg-[#17150f]/90"
      >
        <Image src={shown.image.src} alt={`${shown.city} play-screen`} width={shown.image.w} height={shown.image.h} sizes="94vw" className="h-auto max-h-[82vh] w-auto max-w-[94vw] object-contain" />
        <div className="mt-3 flex items-center justify-between gap-6 text-[13px]">
          <p>
            <span className="font-display text-lg">{shown.city}</span>
            <span className="ml-3 uppercase tracking-[0.14em] text-white/70">{shown.note}</span>
          </p>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="px-3 py-2 uppercase tracking-[0.14em] hover:text-white">Close ✕</button>
        </div>
      </dialog>
    </div>
  );
}
