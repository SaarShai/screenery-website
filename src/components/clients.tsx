"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const clientLogoNumbers = [1,2,3,4,5,6,7,8,9,10,12,14,15,16,17,18,19,20,21,22,23,24];

const clientLogos = clientLogoNumbers.map((n) => ({
  name: `Client ${n}`,
  logo: `/images/client logos/client-logos${String(n).padStart(2, "0")}.jpg`,
}));

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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-10 items-center">
          {clientLogos.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={160}
                height={100}
                className="w-full h-auto max-h-16 object-contain"
              />
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
