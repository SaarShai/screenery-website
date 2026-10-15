import Image from "next/image";
import { bySlug } from "@/data/catalog";

/** The 12 designs at a glance, as on page 2 of the catalogue; each links to its card in The Collection. */
export default function Lineup() {
  const items = bySlug("standard")?.items ?? [];
  return (
    <section id="lineup" className="px-6 py-12 md:px-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#6f5a41]">The Collection · {items.length} designs</p>
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((d) => (
            <a key={d.slug} href={`#standard-${d.slug}`} className="group block">
              <Image
                src={`/catalog/lineup/${d.slug}.jpg`}
                alt={d.name}
                width={960}
                height={640}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#17150f]">{d.name}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
