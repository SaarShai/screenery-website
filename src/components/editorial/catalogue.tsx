import DesignCard from "@/components/catalog/design-card";
import Showcase from "@/components/editorial/showcase";
import WorldStrip from "@/components/editorial/world-strip";
import { sections } from "@/data/catalog";

export default function Catalogue() {
  return (
    <>
      {/* Catalogue sections */}
      {sections.map((s, i) => (
        <section
          key={s.slug}
          id={s.slug}
          className={`px-6 py-12 md:px-12 md:py-16 ${i % 2 ? "bg-[#efe9df]" : ""}`}
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">
              {s.name}
            </h2>

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
                    className={s.items.length === 1 ? "min-w-0 sm:col-span-2 xl:col-span-3" : "min-w-0"}
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
              </div>
            )}
            {s.world && <WorldStrip places={s.world} />}
          </div>
        </section>
      ))}
    </>
  );
}
