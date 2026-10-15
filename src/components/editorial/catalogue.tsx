import DesignCard from "@/components/catalog/design-card";
import Showcase from "@/components/editorial/showcase";
import CityGallery from "@/components/editorial/city-gallery";
import Lineup from "@/components/editorial/lineup";
import { sections } from "@/data/catalog";

export default function Catalogue() {
  return (
    <>
      <Lineup />
      {/* Catalogue sections */}
      {sections.map((s, i) => (
        <section
          key={s.slug}
          id={s.slug}
          className={`px-6 py-12 md:px-12 md:py-16 ${i % 2 ? "" : "bg-[#efe9df]"}`}
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
              {s.name}
            </h2>
            {s.subtitle && (
              <p className="mt-4 max-w-2xl text-[17px] font-light leading-relaxed text-[#5b574f]">{s.subtitle}</p>
            )}

            {s.slug === "bespoke" ? (
              <Showcase items={s.items} />
            ) : (
              /* One design: a two-thirds feature. Four: a 2×2 grid. Otherwise three across. */
              <div
                className={`mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 ${s.items.length === 4 ? "" : "xl:grid-cols-3"}`}
              >
                {s.items.map((d) => (
                  <div
                    key={d.slug}
                    id={`${s.slug}-${d.slug}`}
                    className={`scroll-mt-28 ${s.items.length === 1 ? "min-w-0 sm:col-span-2 xl:col-span-3" : "min-w-0"}`}
                  >
                    <DesignCard
                      design={d}
                      wide={s.items.length === 1}
                      sizes={
                        s.items.length === 1
                          ? "(max-width: 640px) 100vw, 850px"
                          : s.items.length === 4
                            ? "(max-width: 640px) 100vw, 610px"
                            : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 405px"
                      }
                    />
                  </div>
                ))}
                {/* Bedwrappers: the single and double bed models from the catalogue (page 18), in the cell after the five designs */}
                {s.slug === "bedwrappers" && (
                  <div className="flex min-w-0 flex-col justify-center">
                    <div className="grid grid-cols-2 items-end gap-6">
                      {[
                        { src: "bed-single.png", name: "Single", bed: "95 × 200", outer: "112 × 217", w: 900, h: 700 },
                        { src: "bed-double.png", name: "Double", bed: "151 × 208", outer: "168 × 225", w: 900, h: 655 },
                      ].map((b) => (
                        <figure key={b.name} className="text-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`/images/model diagrams/${b.src}`} alt={`${b.name} bedwrapper model`} width={b.w} height={b.h} className="h-auto w-full" />
                          <figcaption className="mt-2">
                            <p className="font-display text-[17px] leading-tight">{b.name}</p>
                            <p className="mt-1 text-[12px] font-light leading-snug tabular-nums text-[#5b574f]">
                              bed {b.bed} cm
                              <br />
                              outer {b.outer} cm
                            </p>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                    <p className="mt-6 text-center text-[11px] uppercase tracking-[0.14em] text-[#6f5a41]">Panel height 75 cm · single and double sizes</p>
                  </div>
                )}
              </div>
            )}
            {s.moreCities && <CityGallery places={s.moreCities} />}
          </div>
        </section>
      ))}
    </>
  );
}
