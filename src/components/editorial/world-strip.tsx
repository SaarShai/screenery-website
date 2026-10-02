"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, type Variants } from "framer-motion";
import type { Section } from "@/data/catalog";
import { usePrefersStill } from "@/lib/use-prefers-still";

type Place = NonNullable<Section["world"]>[number];

// Cards swing in from the right like turned pages and swing out to the left.
const card: Variants = {
  hidden: { opacity: 0, rotateY: 80, x: 140 },
  show: (k: number) => ({ opacity: 1, rotateY: 0, x: 0, transition: { type: "spring", stiffness: 70, damping: 16, delay: k * 0.18 } }),
  gone: { opacity: 0, rotateY: -80, x: -80, transition: { duration: 0.5, ease: [0.4, 0, 1, 1], opacity: { duration: 0.25 } } },
};

/**
 * "Around the world": cities made for other hotels. When the row comes into view the cards flip in
 * from the right one by one; then every few seconds the first card flips away and the next city
 * flips in at the right end. Hover or Pause holds it; reduced motion gets a still row.
 */
export default function WorldStrip({ places }: { places: Place[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { amount: 0.3 });
  const still = usePrefersStill();
  const title = useId();
  const n = places.length;
  const [i, setI] = useState(0);
  const [start, setStart] = useState(0); // keeps counting, so a city that comes round again is a new card
  const [hold, setHold] = useState(false);
  const [paused, setPaused] = useState(false);
  const [slots, setSlots] = useState(3);
  useEffect(() => {
    const f = () => setSlots(innerWidth < 640 ? 1 : innerWidth < 1024 ? 2 : 3);
    f();
    addEventListener("resize", f);
    return () => removeEventListener("resize", f);
  }, []);
  useEffect(() => {
    if (still || paused || hold || !inView) return;
    const t = setInterval(() => setStart((v) => v + 1), 4200);
    return () => clearInterval(t);
  }, [still, paused, hold, inView]);
  const shown = places[i];
  const visible = Array.from({ length: Math.min(slots, n) }, (_, j) => start + j);

  return (
    <div className="mt-24">
      <div className="flex items-end justify-between gap-6 border-t border-[#17150f]/10 pt-10">
        <div>
          <p className="text-[12px] uppercase tracking-[0.2em] text-[#6f5a41]">More skylines</p>
          <h3 className="font-display mt-3 text-[clamp(1.8rem,3.5vw,2.75rem)] leading-tight">Around the world</h3>
        </div>
        {!still && (
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            className="py-2 text-[11px] uppercase tracking-[0.14em] text-[#5b574f] underline decoration-[#17150f]/20 underline-offset-4 hover:text-[#17150f]"
          >
            {paused ? "Play" : "Pause"}
          </button>
        )}
      </div>

      <div
        ref={stage}
        className="mt-8 [perspective:1600px]"
        onPointerEnter={() => setHold(true)}
        onPointerLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
      >
        <ul className="grid gap-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((abs, j) => {
              const k = abs % n;
              const p = places[k];
              return (
                <motion.li
                  key={abs}
                  layout
                  custom={j}
                  variants={card}
                  initial={still ? false : "hidden"}
                  animate={still || inView ? "show" : "hidden"}
                  exit="gone"
                  style={{ transformOrigin: "left center" }}
                  className="min-w-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setI(k);
                      dialog.current?.showModal();
                    }}
                    aria-label={`Enlarge ${p.city}`}
                    className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-[6px] bg-[#e4dccf] shadow-[0_12px_30px_-10px_rgba(60,45,25,0.22)]"
                  >
                    <Image src={p.image.src} alt={`${p.city} play-screen`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
                  </button>
                  <p className="font-display mt-4 text-xl leading-tight">{p.city}</p>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-[#6f5a41]">{p.note}</p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
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
            <span className="ml-3 uppercase tracking-[0.14em] text-white/70">{shown.note}</span>
          </p>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="px-3 py-2 uppercase tracking-[0.14em] hover:text-white">Close ✕</button>
        </div>
      </dialog>
    </div>
  );
}
