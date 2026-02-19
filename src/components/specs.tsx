"use client";

import Image from "next/image";
import FadeInWhenVisible from "./fade-in-when-visible";

const specs = [
  { label: "Setup Time", value: "10\u201320 minutes", detail: "No tools\u00A0required" },
  { label: "Unit Weight", value: "12\u201315 kg", detail: "Below tipping risk\u00A0thresholds" },
  { label: "Storage", value: "155 \u00D7 105 cm", detail: "Compact, flat-pack\u00A0box" },
  { label: "Material", value: "100% Recycled PET", detail: "Over 80% from recycled\u00A0bottles" },
  { label: "Fire Safety", value: "B-s1, d0", detail: "Certified to EN\u00A013501" },
  { label: "VOC Emissions", value: "Extremely low", detail: "Certified to ASTM\u00A0D5116" },
  { label: "Heat Stability", value: "Up to 50\u00B0C", detail: "95% relative\u00A0humidity" },
  { label: "Sustainability", value: "100% Recyclable", detail: "Cradle to Cradle\u00A0Bronze" },
  { label: "Cleaning", value: "Easy care", detail: "Spray disinfectant, vacuum, sparkling\u00A0water" },
  { label: "Suitable For", value: "Versatile", detail: "Rooms, public spaces,\u00A0outdoors" },
];

const badges = [
  { src: "/images/hand-made.png", alt: "Hand Made with Love — Est. 2022", width: 700, height: 695 },
  { src: "/images/made-in-britain.png", alt: "Made in Britain", width: 245, height: 315 },
  { src: "/images/patented.png", alt: "Patented Design", width: 325, height: 315 },
  { src: "/images/sustainable.png", alt: "Sustainable Materials", width: 290, height: 315 },
];

export default function Specs() {
  return (
    <section id="specs" className="py-24 md:py-32 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeInWhenVisible>
          <p className="text-[13px] tracking-[0.3em] uppercase text-[#8b7355] mb-6">
            Technical Details
          </p>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-extralight leading-tight max-w-3xl mb-6">
            Engineered for&nbsp;hospitality
          </h2>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.15}>
          <p className="text-[#6b6b6b] text-lg max-w-2xl leading-relaxed font-light mb-16" style={{ textWrap: "balance" }}>
            High-performance luxury room dividers, made from 100% PET recycled panels.
            Used in nurseries, hospitals, and swimming&nbsp;pools.
          </p>
        </FadeInWhenVisible>

        {/* Material closeup images */}
        <FadeInWhenVisible delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            <div>
              <div className="overflow-hidden rounded-sm">
                <Image
                  src="/images/bright bevel closeup.jpg"
                  alt="Finely grooved surface detail of a Screenery panel"
                  width={640}
                  height={370}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 45vw, 220px"
                />
              </div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#8b7355] mt-2.5 font-light">
                Finely grooved
              </p>
            </div>
            <div>
              <div className="overflow-hidden rounded-sm">
                <Image
                  src="/images/bevel closeup.jpg"
                  alt="Intricate bevelling detail of a Screenery panel"
                  width={689}
                  height={398}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 45vw, 220px"
                />
              </div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#8b7355] mt-2.5 font-light">
                Intricate bevelling
              </p>
            </div>
            <div>
              <div className="overflow-hidden rounded-sm">
                <Image
                  src="/images/red texture closeup.jpg"
                  alt="Soft fabric feel texture of a Screenery panel"
                  width={640}
                  height={370}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 45vw, 220px"
                />
              </div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#8b7355] mt-2.5 font-light">
                Soft fabric feel
              </p>
            </div>
            <div>
              <div className="overflow-hidden rounded-sm">
                <Image
                  src="/images/double layer closeup.jpg"
                  alt="Double-layer color detail of a Screenery panel"
                  width={640}
                  height={370}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 45vw, 220px"
                />
              </div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#8b7355] mt-2.5 font-light">
                Double-layer colors
              </p>
            </div>
          </div>
        </FadeInWhenVisible>

        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left: diagram + box */}
          <FadeInWhenVisible delay={0.25}>
            <div>
              <div className="relative rounded-sm overflow-hidden">
                <Image
                  src="/images/model diagrams/diagrams-box.png"
                  alt="Screenery storage box dimensions: 155cm × 105cm — compact flat-pack design"
                  width={904}
                  height={662}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Right: specs table */}
          <div className="flex flex-col justify-center">
            <div className="space-y-0">
              {specs.map((spec, i) => (
                <FadeInWhenVisible key={spec.label} delay={i * 0.05}>
                  <div className="flex items-baseline justify-between py-4 border-b border-[#e5e2dc]">
                    <span className="text-[14px] tracking-wide flex-shrink-0">
                      {spec.label}
                    </span>
                    <div className="text-right ml-4">
                      <span className="text-[14px] font-light">
                        {spec.value}
                      </span>
                      <span className="text-[#6b6b6b] text-xs ml-2 font-light hidden sm:inline">
                        {spec.detail}
                      </span>
                    </div>
                  </div>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </div>

        {/* Badges row */}
        <FadeInWhenVisible delay={0.3}>
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {badges.map((badge) => (
              <div key={badge.alt} className="relative h-16 md:h-20 w-auto opacity-80 hover:opacity-100 transition-opacity">
                <Image
                  src={badge.src}
                  alt={badge.alt}
                  width={badge.width}
                  height={badge.height}
                  className="h-full w-auto object-contain"
                  sizes="80px"
                />
              </div>
            ))}
          </div>
        </FadeInWhenVisible>

        {/* Certifications strip */}
        <FadeInWhenVisible delay={0.4}>
          <div className="mt-10 flex justify-center">
            <div className="relative w-full max-w-lg opacity-80 hover:opacity-100 transition-opacity">
              <Image
                src="/images/certifications.png"
                alt="Fire Classification BS EN 13501-1, Cradle to Cradle Certified, ecobau eco-1, M1 Emission Class"
                width={1100}
                height={185}
                className="w-full h-auto"
                sizes="(max-width: 768px) 90vw, 500px"
              />
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}
