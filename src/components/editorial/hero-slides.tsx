"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePrefersStill } from "@/lib/use-prefers-still";

const SLIDES = [
  { src: "/images/princess-v33-hero.jpg", alt: "Princess Palace in a hotel suite" },
  { src: "/catalog/standard/space/room1.jpg", alt: "Spaceship in a hotel suite" },
  { src: "/catalog/standard/arabian/room1.jpg", alt: "Arabian Nights in a hotel room" },
  { src: "/catalog/standard/cafe/room1.jpg", alt: "Kids Cafe in a hotel restaurant" },
  { src: "/catalog/standard/birthday/room1.jpg", alt: "Birthday in a hotel room" },
  { src: "/catalog/standard/reading/room1.jpg", alt: "Reading Corner in a hotel lobby" },
  { src: "/catalog/standard/hospital/room1.jpg", alt: "Hospital in a hotel room" },
];
const HOLD = 5000; // ms each design stays on screen

/** The hero picture: a slow cross-fade through the designs. Reduced motion keeps the first one. */
export default function HeroSlides() {
  const still = usePrefersStill();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (still) return;
    const t = setInterval(() => setI((k) => (k + 1) % SLIDES.length), HOLD);
    return () => clearInterval(t);
  }, [still]);

  return SLIDES.map((s, k) => (
    <Image
      key={s.src}
      src={s.src}
      alt={k === i ? s.alt : ""}
      aria-hidden={k !== i || undefined}
      fill
      priority={k === 0}
      sizes="(max-width:1024px) 100vw, 58vw"
      className={`object-cover ease-out ${k === i ? "z-[1] scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
      // the new picture fades in on top and settles slowly; the old one drops out once it is covered
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: k === i ? "1400ms, 6000ms" : "0ms",
        transitionDelay: k === i ? "0ms" : "1400ms",
      }}
    />
  ));
}
