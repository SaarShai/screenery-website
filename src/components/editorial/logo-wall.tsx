"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import clientLogos from "@/data/hotel-logos.json";

const COLS = 6;

/**
 * Hotel logos: when a third of the wall is on screen, they rise out of a blur one after
 * another in a diagonal wave from the top left, then settle. Hover brings back the colour.
 */
export default function LogoWall() {
  const reduce = useReducedMotion();
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
      className="mt-10 grid grid-cols-3 items-center gap-x-10 gap-y-9 sm:grid-cols-5 sm:gap-x-14 md:gap-y-12 lg:grid-cols-6"
    >
      {clientLogos.map((c, i) => (
        <motion.li key={c.src} custom={i} variants={item} className="relative mx-auto aspect-[520/180] w-full max-w-[110px]">
          <Image src={c.src} alt={c.alt} fill sizes="110px" className="object-contain opacity-60 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0" />
        </motion.li>
      ))}
    </motion.ul>
  );
}
