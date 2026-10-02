"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimationFrame, useInView, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import type { Section } from "@/data/catalog";
import { usePrefersStill } from "@/lib/use-prefers-still";

type Place = NonNullable<Section["world"]>[number];

const COPIES = 3; // the cities repeat round the loop so the conveyor never runs empty
const SPEED = 38; // px per second, left to right

/**
 * "Around the world": an endless conveyor of cities moving left to right. Each card swings on a
 * shallow curve as it travels: it comes in turned and smaller at the left, faces the viewer and
 * grows at the centre, then turns away at the right. Hover holds it; reduced
 * motion gets a still row to scroll by hand.
 */
export default function WorldStrip({ places }: { places: Place[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage);
  const still = usePrefersStill();
  const title = useId();
  const [i, setI] = useState(0);
  const hold = useRef(false);
  const [size, setSize] = useState({ view: 1200, card: 380 });
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const view = e.contentRect.width;
      setSize({ view, card: view < 640 ? Math.round(view * 0.72) : view < 1024 ? 340 : 380 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const offset = useMotionValue(0);
  useAnimationFrame((_, dt) => {
    if (still || hold.current || !inView) return;
    offset.set(offset.get() + (SPEED * Math.min(dt, 64)) / 1000);
  });
  const shown = places[i];
  const cards = Array.from({ length: COPIES }, () => places).flat();
  const step = size.card + 32;

  return (
    <div className="mt-14 md:mt-16">
      <div className="border-t border-[#17150f]/10 pt-10">
        <div>
          <h3 className="font-display text-[clamp(1.8rem,3.5vw,2.75rem)] leading-tight">Around the world</h3>
        </div>
      </div>

      {still ? (
        <ul className="-mx-6 mt-8 flex gap-6 overflow-x-auto px-6 pb-6 md:-mx-12 md:px-12">
          {places.map((p, k) => (
            <li key={p.city} className="w-[78vw] shrink-0 sm:w-[340px]">
              <CardBody p={p} onOpen={() => { setI(k); dialog.current?.showModal(); }} />
            </li>
          ))}
        </ul>
      ) : (
        <div
          ref={stage}
          className="relative -mx-6 mt-8 overflow-hidden [perspective:1200px] md:-mx-12"
          style={{ height: size.card / 1.5 + 110 }}
          onPointerEnter={() => (hold.current = true)}
          onPointerLeave={() => (hold.current = false)}
          onFocus={() => (hold.current = true)}
          onBlur={() => (hold.current = false)}
        >
          {cards.map((p, k) => (
            <Travel key={k} index={k} total={cards.length} step={step} size={size} offset={offset} hidden={k >= places.length}>
              <CardBody p={p} hidden={k >= places.length} onOpen={() => { setI(k % places.length); dialog.current?.showModal(); }} />
            </Travel>
          ))}
        </div>
      )}

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

/** One card's place on the conveyor: its curve, turn, size and fade come from where it is. */
function Travel({ index, total, step, size, offset, hidden, children }: { index: number; total: number; step: number; size: { view: number; card: number }; offset: MotionValue<number>; hidden: boolean; children: React.ReactNode }) {
  const loop = total * step;
  const x = useTransform(offset, (o) => ((((index * step + o) % loop) + loop) % loop) - step);
  // u: -1 at the left edge, 0 at the centre, +1 at the right edge
  const u = useTransform(x, (v) => (v + size.card / 2 - size.view / 2) / (size.view / 2));
  const rotateY = useTransform(u, (v) => Math.max(-1.4, Math.min(1.4, v)) * -26);
  const scale = useTransform(u, (v) => 1.06 - Math.min(Math.abs(v), 1.3) * 0.16);
  const y = useTransform(u, (v) => Math.min(v * v, 1.6) * 26);
  const zIndex = useTransform(u, (v) => 100 - Math.round(Math.abs(v) * 50));
  return (
    <motion.div aria-hidden={hidden || undefined} className="absolute left-0 top-2" style={{ width: size.card, x, y, rotateY, scale, zIndex }}>
      {children}
    </motion.div>
  );
}

function CardBody({ p, onOpen, hidden }: { p: Place; onOpen: () => void; hidden?: boolean }) {
  return (
    <>
      <button
        type="button"
        tabIndex={hidden ? -1 : undefined}
        onClick={onOpen}
        aria-label={`Enlarge ${p.city}`}
        className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-[6px] bg-[#e4dccf] shadow-[0_18px_40px_-14px_rgba(60,45,25,0.35)]"
      >
        <Image src={p.image.src} alt={`${p.city} play-screen`} fill sizes="(max-width: 640px) 72vw, 380px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
      </button>
      <p className="font-display mt-4 text-xl leading-tight">{p.city}</p>
      <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-[#6f5a41]">{p.note}</p>
    </>
  );
}
