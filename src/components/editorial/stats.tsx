import Image from "next/image";
import clientLogos from "@/data/hotel-logos.json";

const stats = [
  ["5–15 min", "Set-up, no tools"],
  ["100%", "Recyclable felt"],
  ["Hand-finished", "In Britain"],
  ["Flat-pack", "155 × 105 cm box"],
];

export default function Stats() {
  return (
    <>
      {/* Stats ribbon */}
      <section className="border-y border-[#17150f]/10 bg-[#efe9df]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#17150f]/10 md:grid-cols-4">
          {stats.map(([v, l]) => (
            <div key={l} className="px-6 py-6 md:px-12 md:py-8">
              <p className="font-display text-2xl md:text-3xl">{v}</p>
              <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-[#5b574f]">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust row: the first eight hotel brands, before the catalogue */}
      <section aria-label="Hotel clients" className="px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:gap-12">
          <p className="shrink-0 text-[12px] uppercase tracking-[0.14em] text-[#6f5a41]">Trusted by</p>
          <ul className="grid flex-1 grid-cols-4 items-center gap-x-6 gap-y-4 md:grid-cols-8">
            {clientLogos.slice(0, 8).map((c) => (
              <li key={c.src} className="relative aspect-[520/180]">
                <Image src={c.src} alt={c.alt} fill sizes="140px" className="object-contain opacity-75 grayscale" />
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  );
}
