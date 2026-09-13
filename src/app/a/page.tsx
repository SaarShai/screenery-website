import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Image from "next/image";
import DesignCard from "@/components/catalog/design-card";
import { sections } from "@/data/catalog";
import NavA from "./nav";

const display = Fraunces({ subsets: ["latin"], axes: ["opsz", "SOFT"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = { title: "Screenery™ — Catalogue (design A)" };

const stats = [
  ["10–20 min", "Set-up, no tools"],
  ["12–15 kg", "Per unit"],
  ["100%", "Recycled PET"],
  ["B-s1, d0", "Fire rated"],
];

export default function DesignA() {
  return (
    <main className={`${display.variable} ${body.variable} bg-[#f6f1e8] text-[#17150f] font-[family-name:var(--font-body)]`}>
      <NavA />

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

      {/* Stats ribbon */}
      <section className="border-y border-[#17150f]/10 bg-[#efe9df]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#17150f]/10 md:grid-cols-4">
          {stats.map(([v, l]) => (
            <div key={l} className="px-6 py-6 md:py-8">
              <p className="font-display text-2xl md:text-3xl">{v}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#5b574f]">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catalogue sections */}
      {sections.map((s, i) => (
        <section key={s.slug} id={s.slug} className={`scroll-mt-20 px-6 py-20 md:px-12 md:py-28 ${i % 2 ? "bg-[#efe9df]" : ""}`}>
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#8b7355]">0{i + 1} — {s.kicker}</p>
                <h2 className="font-display mt-4 text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em]">{s.name}</h2>
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

      {/* Contact */}
      <section id="contact" className="border-t border-[#17150f]/10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl grid gap-10 md:grid-cols-2 md:items-center">
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95]">Bring Screenery to <em className="italic font-light text-[#8b7355]">your hotel.</em></h2>
          <form className="grid gap-4">
            {["Name", "Hotel / company", "Email"].map((l) => (
              <label key={l} className="grid gap-1 text-[11px] uppercase tracking-[0.2em] text-[#5b574f]">
                {l}
                <input className="border-b border-[#17150f]/30 bg-transparent py-2 text-base tracking-normal text-[#17150f] outline-none focus:border-[#17150f]" />
              </label>
            ))}
            <button type="button" className="mt-4 justify-self-start bg-[#17150f] px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-[#f6f1e8]">Request quote</button>
          </form>
        </div>
      </section>

      <footer className="px-6 py-8 text-[11px] uppercase tracking-[0.2em] text-[#5b574f] md:px-12">© 2026 Screenery. Design option A.</footer>
    </main>
  );
}
