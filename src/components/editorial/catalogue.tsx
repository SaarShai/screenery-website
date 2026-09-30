import DesignCard from "@/components/catalog/design-card";
import { sections } from "@/data/catalog";

export default function Catalogue() {
  return (
    <>
      {/* Catalogue sections */}
      {sections.map((s, i) => (
        <section key={s.slug} id={s.slug} className={`px-6 py-16 md:px-12 md:py-24 ${i % 2 ? "bg-[#efe9df]" : ""}`}>
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="text-[12px] uppercase tracking-[0.2em] text-[#6f5a41]">0{i + 1} — {s.kicker}</p>
                <h2 className="font-display mt-4 text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] tracking-[-0.02em]">{s.name}</h2>
              </div>
              <p className="md:col-span-5 max-w-md text-[16px] leading-relaxed font-light text-[#5b574f]">{s.intro}</p>
            </div>

            <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
              {s.items.map((d) => (
                <DesignCard key={d.slug} design={d} skin="editorial" />
              ))}
            </div>
          </div>
        </section>
      ))}

    </>
  );
}
