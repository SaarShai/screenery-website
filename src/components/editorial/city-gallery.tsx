"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import type { Section } from "@/data/catalog";

type Place = NonNullable<Section["moreCities"]>[number];

export default function CityGallery({ places }: { places: Place[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const [selected, setSelected] = useState(0);
  const shown = places[selected];

  return (
    <div className="mt-14 border-t border-[#17150f]/10 pt-10">
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
        {places.map((p, i) => (
          <article key={p.city} className="min-w-0">
            <button
              type="button"
              onClick={() => { setSelected(i); dialog.current?.showModal(); }}
              aria-label={`Enlarge ${p.city}`}
              className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-[6px] bg-[#e4dccf] shadow-[0_12px_30px_-10px_rgba(60,45,25,0.22)]"
            >
              <Image src={p.image.src} alt={`${p.city} play-screen`} fill sizes="(max-width: 1024px) 50vw, 290px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
            </button>
            <h3 className="font-display mt-4 text-lg leading-tight md:text-xl">{p.city}</h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#6f5a41]">{p.note}</p>
          </article>
        ))}
      </div>

      <dialog
        ref={dialog}
        aria-labelledby={title}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto max-w-[94vw] bg-transparent p-0 text-[#f6f1e8] backdrop:bg-[#17150f]/90"
      >
        <Image src={shown.image.src} alt={`${shown.city} play-screen`} width={shown.image.w} height={shown.image.h} sizes="94vw" className="h-auto max-h-[82vh] w-auto max-w-[94vw] object-contain" />
        <div className="mt-3 flex items-center justify-between gap-6 text-[13px]">
          <p id={title}>
            <span className="font-display text-lg">{shown.city}</span>
            <span className="block uppercase tracking-[0.14em] text-white/70 sm:ml-3 sm:inline">{shown.note}</span>
          </p>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="shrink-0 whitespace-nowrap px-3 py-2 uppercase tracking-[0.14em] hover:text-white">Close ✕</button>
        </div>
      </dialog>
    </div>
  );
}
