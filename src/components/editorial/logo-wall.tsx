"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { usePrefersStill } from "@/lib/use-prefers-still";
import allLogos from "@/data/hotel-logos.json";

// Brands with a testimonial show their logo there instead.
const quoted = new Set(["Kempinski", "Hilton", "Langham Hospitality Group", "St. Regis", "Mandarin Oriental"]);
const clientLogos = allLogos.filter((l) => !quoted.has(l.alt));

const COLS = 6;

/**
 * Hotel logos: when a third of the wall is on screen, they rise out of a blur one after
 * another in a diagonal wave from the top left, then settle. Hover brings back the colour.
 */
export default function LogoWall() {
  const reduce = usePrefersStill();
  const item: Variants = {
    hidden: { opacity: 0, y: 36, scale: 0.82, filter: "blur(10px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.1, delay: ((i % COLS) + Math.floor(i / COLS)) * 0.09, ease: [0.22, 1, 0.36, 1] },
    }),
  };
  return (
    <motion.ul
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-9 sm:gap-x-14 md:gap-y-12"
    >
      {clientLogos.map((c, i) => (
        // Rows of 3, 5 and 6; a short last row sits centred
        <motion.li key={c.src} custom={i} variants={item} className="flex basis-[calc((100%-5rem)/3)] justify-center sm:basis-[calc((100%-14rem)/5)] lg:basis-[calc((100%-17.5rem)/6)]">
          <div className="relative aspect-[520/180] w-full max-w-[110px]">
            <Image src={c.src} alt={c.alt} fill sizes="110px" className="object-contain opacity-60 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0" />
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
