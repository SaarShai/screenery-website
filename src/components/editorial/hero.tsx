import HeroSlides from "./hero-slides";
import { StatsRibbon } from "./stats";
import FoldingScreenMark from "@/components/folding-screen-mark";
import { sections } from "@/data/catalog";

export default function Hero() {
  return (
    <>
      {/* Hero: split, image left, type right */}
      <section className="relative grid min-h-[100svh] grid-cols-1 pt-[var(--nav-h)] lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)_auto]">
        <div className="relative min-h-[38svh] overflow-hidden sm:min-h-[45svh] lg:col-span-7 lg:row-start-1 lg:min-h-0">
          <HeroSlides />
          {/* A soft shadow at the foot of the picture, as if the page below lies over it */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-20 bg-gradient-to-t from-[#17150f]/50 via-[#17150f]/15 to-transparent" />
        </div>
        <StatsRibbon />
        <div className="flex flex-col justify-between px-6 pt-4 pb-10 md:px-12 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:pl-12 lg:pr-8 lg:pt-16">
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="pt-1 text-[12px] uppercase tracking-[0.2em] text-[#6f5a41]">Screenery™ — 2026 catalogue</p>
              <FoldingScreenMark className="w-[clamp(86px,16vw,150px)] shrink-0" />
            </div>
            <h1 className="font-display mt-4 sm:mt-6 text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.98] tracking-[-0.02em]">
              Themed rooms,<br />
              <em className="font-light italic text-[#8b7355]">within minutes.</em>
            </h1>
            <p className="mt-6 sm:mt-8 max-w-md text-[17px] leading-relaxed font-light text-[#5b574f]">
              Felt play-screens for hotels: a children&rsquo;s play area in minutes. Illustrated, hand-made in Britain, flat-packed when the guests check out.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-wrap gap-2">
              <a href="#standard" className="bg-[#17150f] px-3.5 py-3 text-[11px] uppercase tracking-[0.12em] text-[#f6f1e8] hover:bg-[#70593f] transition-colors">The collection</a>
              <a href="#contact" className="border border-[#17150f]/30 px-3.5 py-3 text-[11px] uppercase tracking-[0.12em] hover:border-[#17150f] transition-colors">Request a quote</a>
              <a href="/festive" className="group inline-flex items-center gap-1.5 bg-[#b23a3a] px-3.5 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white shadow-[inset_0_0_0_2px_#1f6b3a,inset_0_0_0_4px_#fff] animate-[festive-pulse_2.4s_ease-in-out_infinite] transition-colors hover:bg-[#9a2f2f] motion-reduce:animate-none">
                <span aria-hidden className="text-[13px] transition-transform duration-500 group-hover:rotate-180">❄</span>
                Festive special
                <span aria-hidden className="text-[13px] transition-transform duration-500 group-hover:-rotate-180">❄</span>
              </a>
            </div>
          </div>

          {/* Index of sections */}
          <ol className="mt-16 divide-y divide-[#17150f]/10 border-y border-[#17150f]/10">
            {sections.map((s, i) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="group flex items-baseline justify-between py-3 transition-colors hover:text-[#8b7355]">
                  <span className="font-display text-xl">
                    <span className="mr-4 text-[11px] tracking-[0.2em] text-[#6f5a41]">0{i + 1}</span>
                    {s.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#5b574f]">
                    {s.moreCities ? `${s.items.length + s.moreCities.length} cities` : `${s.items.length} ${s.items.length === 1 ? "design" : "designs"}`}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

    </>
  );
}
