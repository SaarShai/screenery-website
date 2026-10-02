"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { usePrefersStill } from "@/lib/use-prefers-still";

/**
 * The two carry boxes as live CSS 3D models, to one scale, in the style of the original box
 * drawing (public/images/model diagrams/diagrams-box.png): white board, ink edges, confetti,
 * the outlined Wanderland Screenery logo cut from that drawing, and a carry handle. Scrolling swings them round; the cursor turns them.
 * Sizes are outer, from ground truth/box-framework.md.
 */
const BOXES = [
  { name: "Primary box", note: "Most designs", w: 112, h: 71, d: 27 },
  { name: "Large box", note: "Designs with longer panels", w: 150, h: 106, d: 16 },
];

const ink = "#17150f";
const edge = `1px solid ${ink}`;

// Confetti from the original box: kind, position as a fraction of the face, turn.
const CONFETTI: [string, number, number, number][] = [
  ["n", 0.07, 0.12, 10], ["t", 0.22, 0.1, -15], ["o", 0.33, 0.18, 0], ["t", 0.48, 0.15, 20], ["t", 0.72, 0.14, -30],
  ["d", 0.12, 0.36, 0], ["n", 0.24, 0.32, 15], ["m", 0.6, 0.3, 0], ["n", 0.8, 0.36, -20], ["t", 0.9, 0.24, 90],
  ["t", 0.06, 0.55, 30], ["d", 0.86, 0.58, 0], ["n", 0.93, 0.7, 10], ["o", 0.06, 0.74, 0], ["n", 0.3, 0.84, -10],
  ["t", 0.14, 0.88, 0], ["d", 0.42, 0.76, 20], ["t", 0.55, 0.82, -20], ["n", 0.68, 0.9, 0], ["o", 0.6, 0.66, 0], ["d", 0.9, 0.88, 0],
];
const GLYPH: Record<string, string> = {
  t: "M2,18 L10,2 L18,18 Z",
  o: "M10,2 C16,8 15,18 10,18 C5,18 4,8 10,2 Z",
  d: "M4,2 V18 C20,18 20,2 4,2 Z",
  m: "M2,18 L6,3 L10,10 L14,3 L18,18 Z",
  n: "M2,6 h5 v8 h4 V3 h5 v15 H2 Z",
};

/** The printed face: confetti and logo, as on the original carton. */
function Print() {
  return (
    <>
      {CONFETTI.map(([k, u, v, r], i) => (
        <svg key={i} viewBox="0 0 20 20" className="absolute h-[7px] w-[7px]" style={{ left: `${u * 100}%`, top: `${v * 100}%`, transform: `rotate(${r}deg)` }} aria-hidden>
          <path d={GLYPH[k]} fill="none" stroke={ink} strokeWidth={2} />
        </svg>
      ))}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/model diagrams/box-logo.png" alt="" className="absolute left-1/2 top-1/2 w-[50%] -translate-x-1/2 -translate-y-1/2" />
    </>
  );
}

function Face({ w, h, transform, shade, children }: { w: number; h: number; transform: string; shade: string; children?: React.ReactNode }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 overflow-hidden [backface-visibility:hidden]"
      style={{ width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform, background: shade, border: edge }}
    >
      {children}
    </div>
  );
}

function Box3D({ w, h, d, k, rx, ry }: { w: number; h: number; d: number; k: number; rx: MotionValue<number>; ry: MotionValue<number> }) {
  const W = w * k;
  const H = h * k;
  const D = d * k;
  return (
    <motion.div className="relative" style={{ width: W, height: H, transformStyle: "preserve-3d", rotateX: rx, rotateY: ry }}>
      <Face w={W} h={H} shade="#fffdf9" transform={`translateZ(${D / 2}px)`}>
        <Print />
      </Face>
      <Face w={W} h={H} shade="#f3eee6" transform={`rotateY(180deg) translateZ(${D / 2}px)`}>
        <Print />
      </Face>
      <Face w={D} h={H} shade="#e9e3d8" transform={`rotateY(90deg) translateZ(${W / 2}px)`}>
        {[0.25, 0.5, 0.75].map((v) => (
          <span key={v} className="absolute left-1/2 h-2 w-[3px] -translate-x-1/2 rounded-full border border-[#17150f]" style={{ top: `${v * 100}%` }} />
        ))}
      </Face>
      <Face w={D} h={H} shade="#e9e3d8" transform={`rotateY(-90deg) translateZ(${W / 2}px)`} />
      <Face w={W} h={D} shade="#f7f3ec" transform={`rotateX(90deg) translateZ(${H / 2}px)`} />
      <Face w={W} h={D} shade="#ddd5c8" transform={`rotateX(-90deg) translateZ(${H / 2}px)`} />
      {/* Carry handle, standing up from the top */}
      <div
        className="absolute left-1/2 top-1/2 rounded-t-full border-[3px] border-b-0 border-[#17150f]"
        style={{ width: 34, height: 16, marginLeft: -17, marginTop: -H / 2 - 16 }}
      />
      {/* Dimension lines, fixed to the front face */}
      <div className="pointer-events-none absolute left-0 top-0" style={{ width: W, transform: `translateZ(${D / 2}px) translateY(-30px)` }}>
        <div className="relative h-px bg-[#17150f]">
          <span className="absolute -left-px -top-[3px] h-[7px] w-px bg-[#17150f]" />
          <span className="absolute -right-px -top-[3px] h-[7px] w-px bg-[#17150f]" />
        </div>
        <p className="absolute -top-6 left-1/2 -translate-x-1/2 text-[13px] tabular-nums">{w}cm</p>
      </div>
      <div className="pointer-events-none absolute top-0" style={{ left: W + 14, height: H, transform: `translateZ(${D / 2}px)` }}>
        <div className="relative h-full w-px bg-[#17150f]">
          <span className="absolute -left-[3px] -top-px h-px w-[7px] bg-[#17150f]" />
          <span className="absolute -bottom-px -left-[3px] h-px w-[7px] bg-[#17150f]" />
        </div>
        <p className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] tabular-nums">{h}cm</p>
      </div>
    </motion.div>
  );
}

export default function BoxDiagram() {
  const stage = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1.4);
  const [stack, setStack] = useState(false);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    // Side by side when both boxes fit with room for their labels; otherwise one above the other.
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      const side = (w - 2 * 95 - 24) / (112 + 150);
      setStack(side < 1.1);
      setK(0.88 * Math.min(1.9, side < 1.1 ? (w - 95) / 150 : side)); // headroom for the turn
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const reduce = usePrefersStill();
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "end start"] });
  const swing = useTransform(scrollYProgress, [0, 1], reduce ? [-24, -24] : [-62, 28]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0.15);
  const turn = useTransform(() => swing.get() + mx.get() * 30);
  const ry = useSpring(turn, { stiffness: 90, damping: 18 });
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [-4, -24]), { stiffness: 90, damping: 18 });

  return (
    <div
      ref={stage}
      data-boxes
      className="relative w-full min-w-0 overflow-x-clip"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0.15);
      }}
    >
      <div className={`flex gap-6 ${stack ? "flex-col gap-10" : "justify-between"}`}>
        {BOXES.map((b) => (
          <div key={b.name} style={{ width: b.w * k + 95 }}>
            {/* Side by side the boxes share a baseline (the taller box's height); stacked, each takes its own */}
            <div className="flex items-end justify-start pb-6 pl-3 [perspective:1100px]" style={{ height: (stack ? b.h : 106) * k + 110 }}>
              <Box3D {...b} k={k} rx={rx} ry={ry} />
            </div>
            <p className="font-display mt-2 text-[17px] leading-tight">{b.name}</p>
            <p className="mt-1 text-[13px] font-light tabular-nums text-[#5b574f]">
              {b.w} × {b.h} × {b.d} cm
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#6f5a41]">{b.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
