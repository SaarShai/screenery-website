"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const heroImages = [
  {
    src: "/images/best-princess-in-room-w-girl-(large).jpg",
    alt: "Screenery princess castle room divider in a luxury hotel suite",
  },
  {
    src: "/images/best-boy-in-castle-pod-(large).jpg",
    alt: "Boy reading inside a Screenery medieval castle room divider",
  },
  {
    src: "/images/spaceship-girl-and-toy-02.jpg",
    alt: "Girl stepping out of a Screenery spaceship room divider",
  },
  {
    src: "/images/best-arabian-nights-w--boy-in-room-(large-not-stretched).jpg",
    alt: "Screenery Arabian Nights room divider in a hotel room with child",
  },
  {
    src: "/images/better-girl-in-marine-pod-(small).jpg",
    alt: "Girl inside a Screenery marine-themed room divider",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor-follow: raw motion values updated on mousemove
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Smooth spring for a gentle, delayed follow
  const springX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 30 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Normalise to -1…1 from centre
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      // Max ±12px shift
      mouseX.set(nx * -24);
      mouseY.set(ny * -16);
    };
    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      {/* Ken Burns zoom + crossfade background images with cursor-follow */}
      <motion.div className="absolute inset-[-16px]" style={{ x: springX, y: springY }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 8, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[current].src}
              alt={heroImages[current].alt}
              fill
              className="object-cover"
              priority={current === 0}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/35 to-black/55 z-[1]" />

      {/* Content — aligned to same max-w and padding as navbar */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 md:px-16 lg:px-24">
        <div className="w-full max-w-6xl mx-auto text-center">
          {/* Main title — large, spanning full width */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-[clamp(2rem,5.5vw,5.5rem)] tracking-[0.2em] uppercase font-extralight leading-[1.1] drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
          >
            Themed Rooms Within&nbsp;Minutes
          </motion.h1>

          {/* Divider line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="w-20 h-[1px] bg-white/50 mx-auto mt-8 mb-8"
          />

          {/* Tagline — proportionally larger */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/90 text-lg md:text-2xl lg:text-[1.7rem] max-w-2xl mx-auto leading-relaxed font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            style={{ textWrap: "balance" }}
          >
            Transform any hotel room into a family-friendly suite&nbsp;&mdash; in minutes and in&nbsp;budget.
          </motion.p>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group"
        aria-label="Scroll down"
      >
        <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase group-hover:text-white/70 transition-colors">
          Scroll
        </span>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-white/40 group-hover:text-white/70 transition-colors"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M4 7L10 13L16 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.a>
    </section>
  );
}
