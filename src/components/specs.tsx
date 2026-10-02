"use client";

import Image from "next/image";
import { Award, Hand, Recycle } from "lucide-react";
import FadeInWhenVisible from "./fade-in-when-visible";
import BoxDiagram from "./box-diagram";
import { certs } from "@/data/details";

/** The festive page's details, cut to three lines each for the home page. */
const brief = [
  { h: "Installation", p: ["5 to 15 minutes to set up or take apart. No tools needed. Modular, so it stores easily."] },
  { h: "Product properties", p: ["Lightweight, below tipping-risk thresholds, soft to the touch and safe for children."] },
  { h: "Material properties", p: ["Robust and shockproof, as used in nurseries, hospitals and pools. Flame proof B-s1,d0 (EN 13501)."] },
  { h: "Environment", p: ["100% recyclable PET, over 80% recycled content. eco-1 rated and Cradle to Cradle Bronze certified."] },
  { h: "Cleaning & care", p: ["Damp cloth, spray disinfectant or vacuum. Isopropyl alcohol lifts stains without harming the print; an iron at about 160 °C smooths dents."] },
  { h: "Durability & re-usability", p: ["Lasts for years, unlike cardboard or foam. Weatherproof and waterproof; the print does not fade."] },
];

/** The Union flag, small, in its own colours. */
function UnionJack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={`${className} !h-auto !w-8 rounded-[2px]`} aria-hidden>
      <clipPath id="uj-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="uj-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#uj-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uj-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

const OFFICIAL = ["cert-fire-bs-en-13501", "cert-m1", "cert-cradle-to-cradle", "cert-eco-1"];
const PROMISES = [
  { Icon: Hand, label: "Hand-made" },
  { Icon: UnionJack, label: "Made in Britain" },
  { Icon: Award, label: "Patented" },
  { Icon: Recycle, label: "Sustainable" },
];

export default function Specs() {
  return (
    <section id="specs" className="py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeInWhenVisible>
          <h2 className="font-display text-3xl md:text-5xl leading-tight max-w-3xl mb-8 md:mb-10">
            Engineered for&nbsp;hospitality
          </h2>
        </FadeInWhenVisible>
        {/* Material closeup images */}
        <FadeInWhenVisible delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
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
          <div className="min-w-0 md:col-span-6">
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

        {/* Certified: the official marks as issued. Ours: four promises in the site's own line icons. */}
        <FadeInWhenVisible delay={0.2}>
          <div className="mt-12 md:mt-16 grid gap-px border border-[#e5e2dc] bg-[#e5e2dc] md:grid-cols-12">
            <div className="bg-[#f6f1e8] p-6 md:col-span-7 md:p-8">
              <p className="text-center text-[12px] uppercase tracking-[0.14em] text-[#6f5a41] lg:text-left">Certified</p>
              {/* Narrow: the wide fire mark centred on its own row, the three round marks centred below. Wide: one row. */}
              <div className="mt-6 grid grid-cols-3 place-items-center gap-x-6 gap-y-6 lg:flex lg:items-center lg:gap-x-8">
                {certs
                  .filter(([f]) => OFFICIAL.includes(f))
                  .map(([f, alt], i) => (
                    <Image
                      key={f}
                      src={`/festive/${f}.png`}
                      alt={alt}
                      width={140}
                      height={140}
                      className={i === 0 ? "col-span-3 h-12 w-auto md:h-14" : "h-14 w-auto md:h-16 lg:h-14"}
                    />
                  ))}
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-px bg-[#e5e2dc] md:col-span-5">
              {PROMISES.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3 bg-[#f6f1e8] p-5 md:p-6">
                  <Icon aria-hidden className="h-6 w-6 shrink-0 text-[#6f5a41]" strokeWidth={1.25} />
                  <span className="text-[13px] font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}
