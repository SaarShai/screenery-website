"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Design } from "@/data/catalog";

/** One design: a single 3:2 frame with every view (studio and room) as labelled thumbnails, plus a lightbox. */
export default function DesignCard({ design, sizes }: { design: Design; sizes: string }) {
  const views = [
    ...design.variants,
    ...design.rooms.map((image, i) => ({ label: design.rooms.length > 1 ? `In the room ${i + 1}` : "In the room", image })),
  ];
  const [i, setI] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const { image: shown, label } = views[i];
  // Frame is 3:2 like most shots; show odd-shaped shots whole instead of cropping the product.
  const fit = Math.abs(shown.w / shown.h - 1.5) > 0.1 ? "object-contain" : "object-cover";
  const step = (d: number) => setI((i + d + views.length) % views.length);

  const enquire = () => {
    window.dispatchEvent(new CustomEvent("enquire", { detail: design.name }));
    document.getElementById("contact")?.scrollIntoView();
  };

  return (
    <article>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Enlarge ${design.name}: ${label}`}
        className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden bg-[#efe9df]"
      >
        <Image
          key={shown.src}
          src={shown.src}
          alt={`${design.name}: ${label}`}
          fill
          sizes={sizes}
          className={`${fit} animate-[fade_220ms_ease-out] transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:animate-none motion-reduce:transition-none`}
        />
      </button>

      {/* Views; the row keeps its height even with one view so cards line up */}
      <div className="mt-3 flex h-12 gap-2 overflow-x-auto [scrollbar-width:none]">
        {views.length > 1 &&
          views.map((v, k) => (
            <button
              key={k}
              type="button"
              onClick={() => setI(k)}
              aria-label={`${design.name}: ${v.label}`}
              aria-pressed={k === i}
              title={v.label}
              className={`relative h-12 w-[4.5rem] shrink-0 overflow-hidden bg-[#efe9df] transition-shadow ${k === i ? "ring-2 ring-inset ring-[#17150f]" : "hover:ring-1 hover:ring-inset hover:ring-[#17150f]/40"}`}
            >
              <Image src={v.image.src} alt="" fill sizes="72px" className="object-cover" />
            </button>
          ))}
      </div>

      <div className="mt-4">
        <p className="text-[12px] uppercase tracking-[0.14em] text-[#6f5a41]">{design.tagline}</p>
        <div className="mt-1.5 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl leading-tight">{design.name}</h3>
          {design.price && <p className="shrink-0 text-[13px] font-medium">{design.price}</p>}
        </div>
        <p className="mt-2 text-[16px] leading-[25px] text-[#5b574f]">{design.description}</p>
        <button
          type="button"
          onClick={enquire}
          className="group/e mt-3 inline-flex items-center gap-2 py-2 text-[12px] uppercase tracking-[0.14em] underline decoration-[#17150f]/25 underline-offset-4 transition-colors hover:decoration-[#17150f]"
        >
          Enquire about {design.name}
          <span aria-hidden className="transition-transform duration-200 group-hover/e:translate-x-1">→</span>
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
        <Image
          src={shown.src}
          alt={`${design.name}: ${label}`}
          width={shown.w}
          height={shown.h}
          sizes="94vw"
          className="h-auto max-h-[82vh] w-auto max-w-[94vw] object-contain"
        />
        <div className="mt-3 flex items-center justify-between gap-6 text-[13px]">
          <p>
            <span className="font-display text-lg">{design.name}</span>
            <span className="ml-3 uppercase tracking-[0.14em] text-white/70">{label}</span>
          </p>
          <div className="flex items-center gap-1">
            {views.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} aria-label="Previous view" className="px-3 py-2 hover:text-white">←</button>
                <span className="tabular-nums text-white/70">{i + 1} / {views.length}</span>
                <button type="button" onClick={() => step(1)} aria-label="Next view" className="px-3 py-2 hover:text-white">→</button>
              </>
            )}
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="ml-2 px-3 py-2 uppercase tracking-[0.14em] hover:text-white">Close ✕</button>
          </div>
        </div>
      </dialog>
    </article>
  );
}
