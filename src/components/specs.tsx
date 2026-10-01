"use client";

import Image from "next/image";
import FadeInWhenVisible from "./fade-in-when-visible";
import BoxDiagram from "./box-diagram";
import { certs } from "@/data/details";

/** The festive page's details, cut to three lines each for the home page. */
const brief = [
  { h: "Installation", p: ["5 to 15 minutes to set up or take apart. No tools needed. Modular, so it stores easily."] },
  { h: "Product properties", p: ["Lightweight, below tipping-risk thresholds, soft to the touch and safe for children."] },
  { h: "Material properties", p: ["Robust and shockproof, as used in nurseries, hospitals and pools. Flame proof B-s1,d0 (EN 13501), extremely low VOC (ASTM D5116)."] },
  { h: "Environment", p: ["100% recyclable PET, over 80% recycled content. eco-1 rated and Cradle to Cradle Bronze certified."] },
  { h: "Cleaning & care", p: ["Damp cloth, spray disinfectant or vacuum. Isopropyl alcohol lifts stains without harming the print; an iron at about 160 °C smooths dents."] },
  { h: "Durability & re-usability", p: ["Lasts for years, unlike cardboard or foam. Weatherproof and waterproof; the print does not fade."] },
];

export default function Specs() {
  return (
    <section id="specs" className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeInWhenVisible>
          <p className="text-[13px] tracking-[0.3em] uppercase text-[#6f5a41] mb-6">
            Technical Details
          </p>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.1}>
          <h2 className="font-display text-3xl md:text-5xl leading-tight max-w-3xl mb-6">
            Engineered for&nbsp;hospitality
          </h2>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.15}>
          <p
            className="text-[#6b6b6b] text-lg max-w-2xl leading-relaxed font-light mb-16"
            style={{ textWrap: "balance" }}
          >
            High-performance luxury room dividers, made from 100% recyclable
            felt panels. Used in nurseries, hospitals, and swimming&nbsp;pools.
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
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6f5a41] mt-2.5 font-light">
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
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6f5a41] mt-2.5 font-light">
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
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6f5a41] mt-2.5 font-light">
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
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#6f5a41] mt-2.5 font-light">
                Double-layer colors
              </p>
            </div>
          </div>
        </FadeInWhenVisible>

        <div className="grid gap-16 md:grid-cols-12 md:gap-16">
          {/* Left: the two shipping boxes, to scale */}
          <div className="md:col-span-6">
            <div className="md:sticky md:top-[calc(var(--nav-h)+3rem)]">
              <FadeInWhenVisible delay={0.25}>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em] text-[#6f5a41]">
                    Carry box
                  </p>
                  <div className="mt-6">
                    <BoxDiagram />
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </div>

          {/* Right: details, as on the festive page */}
          <div className="md:col-span-6 md:col-start-7">
            {brief.map((s, i) => (
              <FadeInWhenVisible key={s.h} delay={i * 0.04} y={20}>
                <div className="border-b border-[#e5e2dc] py-5 first:pt-0">
                  <h3 className="text-[14px] font-medium tracking-wide">
                    {s.h}
                  </h3>
                  {s.p.map((t, k) => (
                    <p
                      key={k}
                      className={`text-[15px] leading-[1.7] font-light text-[#5b574f] ${k ? "mt-3" : "mt-1.5"}`}
                    >
                      {t}
                    </p>
                  ))}
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <FadeInWhenVisible delay={0.2}>
          <div className="mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {certs.map(([f, alt]) => (
              <Image
                key={f}
                src={`/festive/${f}.png`}
                alt={alt}
                width={140}
                height={140}
                className="h-14 w-auto opacity-85 md:h-16"
              />
            ))}
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}
