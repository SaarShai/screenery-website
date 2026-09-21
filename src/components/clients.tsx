"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

import clientLogos from "@/data/hotel-logos.json";

export default function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="clients" className="py-24 md:py-32 px-8 md:px-16 lg:px-24 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[13px] tracking-[0.3em] uppercase text-[#8b7355] mb-4">
            Trusted By
          </p>
          <p className="text-[#6b6b6b] text-base font-light">
            Leading hotel brands around the world
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-6 gap-y-4 items-center">
          {clientLogos.map((client, i) => (
            <motion.div
              key={client.src}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="relative aspect-[520/180] opacity-50 hover:opacity-90 transition-opacity duration-500"
            >
              <Image src={client.src} alt={client.alt} fill sizes="180px" className="object-contain scale-[0.8]" />
            </motion.div>
          ))}
        </div>

        {/* World map showing client locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="max-w-md w-full opacity-40 hover:opacity-60 transition-opacity duration-500">
            <Image
              src="/images/world map.png"
              alt="World map showing Screenery client locations across the globe"
              width={1492}
              height={721}
              className="w-full h-auto"
              sizes="(max-width: 768px) 80vw, 400px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
