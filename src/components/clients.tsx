"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

import clientLogos from "@/data/hotel-logos.json";

export default function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="clients" className="py-24 md:py-32 px-6 md:px-12 bg-[#efe9df]" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[13px] tracking-[0.3em] uppercase text-[#6f5a41] mb-4">
            Trusted By
          </p>
          <p className="text-[#6b6b6b] text-base font-light">
            And more leading hotel brands around the world
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6 items-center">
          {clientLogos.slice(8, 20).map((client, i) => (
            <motion.div
              key={client.src}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="relative aspect-[520/180]"
            >
              <Image src={client.src} alt={client.alt} fill sizes="180px" className="object-contain scale-[0.8] opacity-75 grayscale" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
