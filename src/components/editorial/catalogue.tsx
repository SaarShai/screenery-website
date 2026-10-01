import DesignCard from "@/components/catalog/design-card";
import Showcase from "@/components/editorial/showcase";
import { sections } from "@/data/catalog";

export default function Catalogue() {
  return (
    <>
      {/* Catalogue sections */}
      {sections.map((s, i) => (
        <section
          key={s.slug}
          id={s.slug}
          className={`px-6 py-16 md:px-12 md:py-24 ${i % 2 ? "bg-[#efe9df]" : ""}`}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="text-[12px] uppercase tracking-[0.2em] text-[#6f5a41]">
                  0{i + 1} — {s.kicker}
                </p>
                <h2 className="font-display mt-4 text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
                  {s.name}
                </h2>
              </div>
              <p className="md:col-span-5 max-w-md text-[16px] leading-relaxed font-light text-[#5b574f]">
                {s.intro}
              </p>
            </div>

            {s.slug === "bespoke" ? (
              <Showcase items={s.items} />
            ) : (
              /* One design: a two-thirds feature. Four: a 2×2 grid. Otherwise three across. */
              <div
                className={`mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 ${s.items.length === 4 ? "" : "xl:grid-cols-3"}`}
              >
                {s.items.map((d) => (
                  <div
                    key={d.slug}
                    className={s.items.length === 1 ? "min-w-0 sm:col-span-2" : "min-w-0"}
                  >
                    <DesignCard
                      design={d}
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
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
