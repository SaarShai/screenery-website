"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import type { Design } from "@/data/catalog";
import { enquire } from "@/lib/enquiry";

/** One design: a single 3:2 frame with every view (studio and room) as labelled thumbnails, plus a lightbox. */
export default function DesignCard({
  design,
  sizes,
  wide = false,
}: {
  design: Design;
  sizes: string;
  wide?: boolean;
}) {
  const views = [
    ...design.variants,
    ...design.rooms.map((image, i) => ({
      label: design.rooms.length > 1 ? `In the room ${i + 1}` : "In the room",
      image,
    })),
  ];
  const [i, setI] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const { image: shown, label } = views[i];
  // Frame is 3:2 like most shots; show odd-shaped shots whole instead of cropping the product.
  const fit =
    Math.abs(shown.w / shown.h - 1.5) > 0.1 ? "object-contain" : "object-cover";
  const step = (d: number) => setI((i + d + views.length) % views.length);

  return (
    <article
      className={
        wide
          ? "md:grid md:grid-cols-12 md:items-center md:gap-12"
          : "flex h-full flex-col"
      }
    >
      <div className={wide ? "md:col-span-7" : undefined}>
        {design.soon ? (
          <>
            <div className="flex aspect-[3/2] w-full flex-col items-center justify-center rounded-[6px] border border-dashed border-[#17150f]/20 bg-[#efe9df]">
              <p className="font-display text-[clamp(1.75rem,3vw,2.5rem)] italic leading-none text-[#8b7355]">
                Coming soon
              </p>
            </div>
            {!wide && <div aria-hidden className="mt-3 h-12" />}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => dialog.current?.showModal()}
              aria-label={`Enlarge ${design.name}: ${label}`}
              className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-[6px] bg-[#efe9df] shadow-[0_12px_30px_-10px_rgba(60,45,25,0.22)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-12px_rgba(60,45,25,0.3)]"
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

            {/* Views; in the grid the row keeps its height even with one view so cards line up */}
            {(views.length > 1 || !wide) && (
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
                      className="group/t relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-[3px] bg-[#efe9df]"
                    >
                      <Image
                        src={v.image.src}
                        alt=""
                        fill
                        sizes="72px"
                        className={`object-cover transition-opacity ${k === i ? "" : "opacity-60 group-hover/t:opacity-90"}`}
                      />
                      {/* The ring sits above the photo so the current view reads clearly */}
                      {k === i && (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-[3px] ring-2 ring-inset ring-[#17150f]"
                        />
                      )}
                    </button>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      <div
        className={
          wide
            ? "mt-4 md:col-span-5 md:mt-0"
            : "mt-4 flex flex-1 flex-col items-start"
        }
      >
        <p className="text-[12px] uppercase tracking-[0.14em] text-[#6f5a41]">
          {design.tagline}
        </p>
        <div className="mt-1.5 flex w-full items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl leading-tight">{design.name}</h3>
          {design.price && (
            <p className="shrink-0 text-[13px] font-medium">{design.price}</p>
          )}
        </div>
        <p className="mb-3 mt-2 text-[16px] leading-[25px] text-[#5b574f]">
          {design.description}
        </p>
        <button
          type="button"
          onClick={() => enquire(design.quoteName)}
          className="group/e mt-auto inline-flex items-center gap-2 py-2 text-[12px] uppercase tracking-[0.14em] underline decoration-[#17150f]/25 underline-offset-4 transition-colors hover:decoration-[#17150f]"
        >
          Enquire about {design.name}
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover/e:translate-x-1"
          >
            →
          </span>
        </button>
      </div>

      {!design.soon && (
        <dialog
          ref={dialog}
          aria-labelledby={title}
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
            <p id={title}>
              <span className="font-display text-lg">{design.name}</span>
              <span className="ml-3 uppercase tracking-[0.14em] text-white/70">
                {label}
              </span>
            </p>
            <div className="flex items-center gap-1">
              {views.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous view"
                    className="px-3 py-2 hover:text-white"
                  >
                    ←
                  </button>
                  <span className="tabular-nums text-white/70">
                    {i + 1} / {views.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next view"
                    className="px-3 py-2 hover:text-white"
                  >
                    →
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                aria-label="Close"
                className="ml-2 px-3 py-2 uppercase tracking-[0.14em] hover:text-white"
              >
                Close ✕
              </button>
            </div>
          </div>
        </dialog>
      )}
    </article>
  );
}
