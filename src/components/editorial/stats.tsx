import Image from "next/image";
import clientLogos from "@/data/hotel-logos.json";

const stats = [
  ["5–15 min", "Set-up, no tools"],
  ["100%", "Recyclable felt"],
  ["Hand-made", "In Britain"],
  ["Suitable for", "Rooms, lobbies, event halls & outdoor spaces"],
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

      {/* Trust row: every hotel brand, in one place before the catalogue */}
      <section aria-label="Hotel clients" className="px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-start md:gap-12">
          <p className="shrink-0 text-[12px] md:pt-3 uppercase tracking-[0.14em] text-[#6f5a41]">Trusted by</p>
          <ul className="grid flex-1 grid-cols-3 items-center gap-x-6 gap-y-4 sm:grid-cols-5 lg:grid-cols-6">
            {clientLogos.map((c) => (
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
