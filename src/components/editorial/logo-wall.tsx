"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import clientLogos from "@/data/hotel-logos.json";

/** Hotel logos: they rise into place one after another, in a soft diagonal wave, when the row scrolls into view. */
export default function LogoWall() {
  const reduce = useReducedMotion();
  return (
    <ul className="mt-10 grid grid-cols-3 items-center gap-x-10 gap-y-9 sm:grid-cols-5 sm:gap-x-14 md:gap-y-12 lg:grid-cols-6">
      {clientLogos.map((c, i) => (
        <motion.li
          key={c.src}
          className="relative mx-auto aspect-[520/180] w-full max-w-[110px]"
          initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: ((i % 6) + Math.floor(i / 6)) * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={c.src} alt={c.alt} fill sizes="110px" className="object-contain opacity-60 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0" />
        </motion.li>
      ))}
    </ul>
  );
}
