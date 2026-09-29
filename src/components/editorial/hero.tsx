import Image from "next/image";
import { sections } from "@/data/catalog";

export default function Hero() {
  return (
    <>
      {/* Hero: split, image left, type right */}
      <section className="relative grid min-h-[100svh] grid-cols-1 lg:grid-cols-12">
        <div className="relative order-2 lg:order-1 lg:col-span-7 min-h-[55svh] lg:min-h-0 overflow-hidden">
          <Image src="/images/best-princess-in-room-w-girl-(large).jpg" alt="Princess Palace in a hotel suite" fill priority sizes="(max-width:1024px) 100vw, 58vw" className="object-cover animate-[kenburns_24s_ease-in-out_infinite_alternate]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f6f1e8] to-transparent lg:hidden" />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col justify-between px-6 pt-28 pb-10 md:px-12 lg:pt-36">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#8b7355]">Screenery™ — 2026 catalogue</p>
            <h1 className="font-display mt-6 text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.95] tracking-[-0.02em]">
              Themed rooms,<br />
              <em className="font-light italic text-[#8b7355]">within minutes.</em>
            </h1>
            <p className="mt-8 max-w-md text-[17px] leading-relaxed font-light text-[#5b574f]">
              A felt play-screen that turns any hotel room into a family suite. Illustrated, hand-finished in Britain, flat-packed when the guests check out.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#standard" className="bg-[#17150f] px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-[#f6f1e8] hover:bg-[#8b7355] transition-colors">See the collection</a>
              <a href="#contact" className="border border-[#17150f]/30 px-6 py-3 text-[12px] uppercase tracking-[0.2em] hover:border-[#17150f] transition-colors">Request a quote</a>
            </div>
          </div>

          {/* Index of sections */}
          <ol className="mt-16 divide-y divide-[#17150f]/10 border-y border-[#17150f]/10">
            {sections.map((s, i) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="group flex items-baseline justify-between py-3 transition-colors hover:text-[#8b7355]">
                  <span className="font-display text-xl">
                    <span className="mr-4 text-[11px] tracking-[0.2em] text-[#8b7355]">0{i + 1}</span>
                    {s.name}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#5b574f]">{s.items.length} designs</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

    </>
  );
}
