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
      <section aria-label="Hotel clients" className="px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-[12px] uppercase tracking-[0.2em] text-[#6f5a41]">Trusted by</p>
          <ul className="mt-10 grid grid-cols-3 items-center gap-x-10 gap-y-9 sm:grid-cols-5 sm:gap-x-14 md:gap-y-12 lg:grid-cols-6">
            {clientLogos.map((c) => (
              <li key={c.src} className="relative mx-auto aspect-[520/180] w-full max-w-[110px]">
                <Image src={c.src} alt={c.alt} fill sizes="110px" className="object-contain opacity-60 grayscale" />
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  );
}
