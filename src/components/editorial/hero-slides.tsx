"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { usePrefersStill } from "@/lib/use-prefers-still";

const SLIDES = [
  { src: "/images/princess-v33-hero.jpg", alt: "Princess Palace in a hotel suite" },
  { src: "/catalog/standard/space/room1.jpg", alt: "Spaceship in a hotel suite" },
  { src: "/festive/hero.jpg", alt: "Gingerbread House and Biscuit Bed Wrapper in a hotel room" },
  { src: "/catalog/standard/arabian/hero.jpg", alt: "Arabian Nights in the studio" },
  { src: "/catalog/standard/cafe/room-v50-through-hatch.png", alt: "Kids Cafe in a hotel restaurant" },
  { src: "/catalog/standard/birthday/room1.jpg", alt: "Birthday in a hotel room" },
  { src: "/catalog/standard/reading/room1.jpg", alt: "Reading Corner in a hotel lobby" },
  { src: "/catalog/standard/hospital/room1.jpg", alt: "Hospital in a hotel room" },
];
const HOLD = 5500; // ms each design stays on screen
const STRIPS = 4; // the next picture unfolds in four panels, like a play-screen
const STAGGER = 0.14; // share of the reveal between one strip and the next

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Each strip drops from the top, left to right; together they make one staircase-shaped clip. */
function staircase(p: number) {
  const pts = ["0% 0%"];
  for (let s = 0; s < STRIPS; s++) {
    const local = Math.min(1, Math.max(0, (p - s * STAGGER) / (1 - (STRIPS - 1) * STAGGER)));
    const h = (ease(local) * 100).toFixed(2);
    pts.push(`${(s / STRIPS) * 100}% ${h}%`, `${((s + 1) / STRIPS) * 100}% ${h}%`);
  }
  pts.push("100% 0%");
  return `polygon(${pts.join(", ")})`;
}

/** The hero picture: the designs in turn, each unfolding over the last. Reduced motion keeps the first one. */
export default function HeroSlides() {
  const still = usePrefersStill();
  const [[cur, prev], setPair] = useState<[number, number | null]>([0, null]);
  const reveal = useMotionValue(1);
  const clip = useTransform(reveal, staircase);
  const zoom = useMotionValue(1); // the new picture settles slowly after it lands

  useEffect(() => {
    if (still) return;
    const t = setTimeout(() => {
      reveal.set(0);
      zoom.set(1.06);
      setPair(([c]) => [(c + 1) % SLIDES.length, c]);
      animate(reveal, 1, { duration: 1.7, ease: "linear" });
      animate(zoom, 1, { duration: 6, ease: [0.22, 1, 0.36, 1] });
    }, HOLD);
    return () => clearTimeout(t);
  }, [cur, still, reveal, zoom]);

  return SLIDES.map((s, k) => {
    const on = k === cur;
    const under = k === prev;
    return (
      <motion.div
        key={s.src}
        aria-hidden={!on || undefined}
        className="absolute inset-0 overflow-hidden"
        style={{
          zIndex: on ? 2 : under ? 1 : 0,
          visibility: on || under ? "visible" : "hidden",
          clipPath: on && prev !== null ? clip : "none",
        }}
      >
        <motion.div className="absolute inset-0" style={{ scale: on && prev !== null ? zoom : 1 }}>
          <Image src={s.src} alt={on ? s.alt : ""} fill priority={k === 0} sizes="(max-width:1024px) 100vw, 58vw" className="object-cover" />
        </motion.div>
      </motion.div>
    );
  });
}
