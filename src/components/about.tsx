"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeInWhenVisible from "./fade-in-when-visible";
import LazyVideo from "./lazy-video";

const benefits = [
  "A \u2018WOW\u2019 moment at room\u00A0arrival",
  "Quick set-up within\u00A0minutes",
  "Compact storage, durable and\u00A0reusable",
  "Perfect for large & small\u00A0rooms",
  "Sound dampening for adult\u00A0privacy",
  "Safety & sustainability\u00A0compliant",
  "Can serve as backdrops for seasonal events, kids clubs, parties, promotional\u00A0photoshoots",
];

export default function About() {
  const skylineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: skylineRef,
    offset: ["start end", "end start"],
  });
  // Gentle parallax: image moves up 40px as you scroll through
  const skylineY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section id="about" className="py-16 md:py-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <FadeInWhenVisible>
          <p className="text-[13px] tracking-[0.3em] uppercase text-[#8b7355] mb-6">
            Screenery™ 2026 Collection
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight max-w-4xl">
            An instant family&nbsp;suite.
          </h2>
        </FadeInWhenVisible>

        {/* Video + tagline text — video above on mobile, side by side on desktop */}
        <FadeInWhenVisible delay={0.2}>
          <div className="mt-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="md:flex-1 overflow-hidden rounded-sm">
              <LazyVideo
                src="/images/guests ad 1080p kindergartener.mp4"
                className="w-full h-auto rounded-sm"
              />
            </div>

            <div className="md:flex-1">
              <p
                className="text-[#6b6b6b] text-lg md:text-xl leading-relaxed font-light"
                style={{ textWrap: "balance" }}
              >
                A play area which delights kids and impresses parents.
                Divide the space. Ignite the&nbsp;imagination.
              </p>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Feature image — London skyline panorama with subtle parallax */}
        <FadeInWhenVisible delay={0.3}>
          <div
            ref={skylineRef}
            className="mt-16 w-full relative overflow-hidden rounded-sm"
          >
            <motion.div style={{ y: skylineY }}>
              <Image
                src="/images/best-london-skyline-in-room-w-kids-(large).jpg"
                alt="Screenery London skyline room divider with children in a hotel room"
                width={3200}
                height={1307}
                className="w-full h-auto scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              />
            </motion.div>
          </div>
        </FadeInWhenVisible>

        {/* Benefits list + hand-made stamp */}
        <FadeInWhenVisible delay={0.1}>
          <div className="mt-20 flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-16">
            <div className="max-w-2xl">
              {benefits.map((benefit, i) => (
                <FadeInWhenVisible key={i} delay={i * 0.06}>
                  <div className="flex items-start gap-4 py-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b7355] mt-2.5 flex-shrink-0" />
                    <p className="text-[15px] md:text-base leading-relaxed text-[#1a1a1a] font-light">
                      {benefit}
                    </p>
                  </div>
                </FadeInWhenVisible>
              ))}
            </div>

            <div className="flex-shrink-0 self-center md:self-start md:mt-4 animate-[wiggle_3s_ease-in-out_infinite]">
              <Image
                src="/images/hand-made.png"
                alt="Hand made stamp"
                width={700}
                height={695}
                className="w-24 h-24 md:w-28 md:h-28 object-contain opacity-80"
              />
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}
