"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Design } from "@/data/catalog";

type Shot = { d: Design; label: string; image: { src: string; w: number; h: number } };

/**
 * Bespoke: past commissions floating at different depths. Scrolling tips the stage and drifts
 * nearer photos faster; the cursor turns it. Reduced motion gets a plain grid.
 */
export default function Showcase({ items }: { items: Design[] }) {
  const shots: Shot[] = items.flatMap((d) => [
    ...d.variants.map((v) => ({ d, label: v.label, image: v.image })),
    ...d.rooms.map((image) => ({ d, label: "In the room", image })),
  ]);
  const n = shots.length;

  const [i, setI] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const go = (k: number) => setI((k + n) % n);
  const open = (k: number) => {
    setI(k);
    dialog.current?.showModal();
  };
  const enquire = () => {
    window.dispatchEvent(new CustomEvent("enquire", { detail: "A bespoke design" }));
    document.getElementById("contact")?.scrollIntoView();
  };

  // Scroll over the stage tips it and drifts each photo by its depth; the cursor turns it.
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const tipX = useTransform(p, [0, 1], [10, -6]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const turnY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 110, damping: 20 });
  const turnX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 110, damping: 20 });

  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const f = () => setNarrow(window.innerWidth < 768);
    f();
    addEventListener("resize", f);
    return () => removeEventListener("resize", f);
  }, []);
  const spots = narrow ? SPOTS_NARROW : SPOTS;

  const reduce = useReducedMotion();
  const shown = shots[i];

  return (
    <>
      {reduce ? (
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shots.map((s, k) => (
            <button key={s.image.src} type="button" onClick={() => open(k)} aria-label={`Enlarge ${s.d.name}`} className="relative aspect-[3/2] overflow-hidden">
              <Image src={s.image.src} alt={`${s.d.name}: ${s.label}`} fill sizes="(max-width: 640px) 100vw, 405px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : (
        <div
          ref={stage}
          className="relative mt-10 [perspective:1400px]"
          style={{ height: narrow ? undefined : "min(70vw, 980px)" }}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
        >
          <motion.div className={narrow ? "relative" : "absolute inset-0"} style={{ transformStyle: "preserve-3d", rotateX: tipX }}>
            <motion.div className={narrow ? "relative" : "absolute inset-0"} style={{ transformStyle: "preserve-3d", rotateX: turnX, rotateY: turnY }}>
              {shots.map((s, k) => (
                <Card key={s.image.src} shot={s} spot={spots[k % spots.length]} p={p} narrow={narrow} onOpen={() => open(k)} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}

      <div className="mt-10 flex flex-col items-start gap-5 border-t border-[#17150f]/10 pt-10 md:flex-row md:items-center md:justify-between">
        <p className="font-display max-w-xl text-2xl leading-snug">Have a building, a mascot or a story in mind? We design it with you, from first sketch to finished set.</p>
        <button type="button" onClick={enquire} className="shrink-0 bg-[#17150f] px-6 py-4 text-[12px] uppercase tracking-[0.14em] text-[#f6f1e8] transition-colors hover:bg-[#70593f]">
          Enquire about a bespoke design →
        </button>
      </div>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(i + 1);
          if (e.key === "ArrowLeft") go(i - 1);
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
            <button type="button" onClick={() => go(i - 1)} aria-label="Previous photo" className="px-3 py-2 hover:text-white">←</button>
            <span className="tabular-nums text-white/70">{i + 1} / {n}</span>
            <button type="button" onClick={() => go(i + 1)} aria-label="Next photo" className="px-3 py-2 hover:text-white">→</button>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="ml-2 px-3 py-2 uppercase tracking-[0.14em] hover:text-white">Close ✕</button>
          </div>
        </div>
      </dialog>
    </>
  );
}

/** Where each photo floats: left/top/width as % of the stage, depth in px, tilt in degrees. */
type Spot = { x: number; y: number; w: number; z: number; r: number };
const SPOTS: Spot[] = [
  { x: 2, y: 1, w: 40, z: 40, r: -3 },
  { x: 58, y: 4, w: 33, z: -160, r: 4 },
  { x: 30, y: 40, w: 37, z: 140, r: -1.5 },
  { x: 0, y: 69, w: 29, z: -90, r: 3 },
  { x: 66, y: 62, w: 32, z: 70, r: -4 },
];
/** Phones: one column, alternating sides, still at different depths. */
const SPOTS_NARROW: Spot[] = [
  { x: 0, y: 0, w: 86, z: 30, r: -2 },
  { x: 14, y: 0, w: 86, z: -60, r: 2.5 },
  { x: 0, y: 0, w: 86, z: 70, r: -1.5 },
  { x: 14, y: 0, w: 86, z: -30, r: 2 },
  { x: 0, y: 0, w: 86, z: 40, r: -2.5 },
];

/** One floating photo: nearer photos drift faster with scroll and lift toward the viewer on hover. */
function Card({ shot, spot, p, narrow, onOpen }: { shot: Shot; spot: Spot; p: MotionValue<number>; narrow: boolean; onOpen: () => void }) {
  const drift = (spot.z + 200) * (narrow ? 0.25 : 0.45);
  const y = useTransform(p, [0, 1], [drift, -drift]);
  return (
    <motion.figure
      className={narrow ? "relative mb-12" : "absolute"}
      style={{ ...(narrow ? { marginLeft: `${spot.x}%` } : { left: `${spot.x}%`, top: `${spot.y}%` }), width: `${spot.w}%`, y, z: spot.z, rotateZ: spot.r, transformStyle: "preserve-3d" }}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`Enlarge ${shot.d.name}`}
        whileHover={{ z: 60, rotateZ: -spot.r, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden bg-[#e4dccf] shadow-[0_40px_70px_-30px_rgba(23,21,15,0.55)]"
      >
        <Image src={shot.image.src} alt={`${shot.d.name}: ${shot.label}`} fill sizes="(max-width: 768px) 75vw, 520px" className="object-cover" />
      </motion.button>
      <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3">
        <span className="font-display text-lg leading-tight">{shot.d.name}</span>
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#6f5a41]">{shot.d.tagline}</span>
      </figcaption>
    </motion.figure>
  );
}
