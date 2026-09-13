import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Image from "next/image";
import DesignCard from "@/components/catalog/design-card";
import { sections } from "@/data/catalog";
import NavB from "./nav";

const font = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-b" });

export const metadata: Metadata = { title: "Screenery™ — Catalogue (design B)" };

/** Tint per section; add a colour when you add a section. */
const tint: Record<string, string> = {
  standard: "#fff1c2",
  cities: "#dcefff",
  bedwrappers: "#ffe0e6",
  bespoke: "#e3f4e1",
};

export default function DesignB() {
  return (
    <main className={`${font.variable} bg-white text-black font-[family-name:var(--font-b)]`}>
      <NavB />

      {/* Hero */}
      <section className="relative min-h-[100svh] overflow-hidden bg-black text-white">
        <Image src="/images/best-space-in-room-w-boy-(large).jpg" alt="Spaceship Screenery in a hotel room" fill priority sizes="100vw" className="object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
        <div className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-32 md:px-10 md:pb-14">
          <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#ffd23f]" /> New: Cities collection
          </p>
          <h1 className="text-[clamp(3.2rem,11vw,10.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.04em]">
            Themed<br />rooms.<br /><span className="text-[#ffd23f]">Minutes.</span>
          </h1>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-sm text-lg leading-snug text-white/85">A felt play-screen that turns any hotel room into a family suite. Unfolds in minutes, packs flat at check-out.</p>
            <div className="flex gap-3">
              <a href="#standard" className="rounded-full bg-[#ffd23f] px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-black hover:bg-white transition-colors">Shop the collection</a>
              <a href="#contact" className="rounded-full border-2 border-white/70 px-6 py-3 text-[13px] font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">Get a quote</a>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y-2 border-black bg-[#ffd23f] py-3 text-[15px] font-extrabold uppercase tracking-[0.15em]">
        <div className="flex w-max animate-[bespoke-scroll_28s_linear_infinite] gap-10 whitespace-nowrap px-5">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Hand made in Britain", "100% recycled PET", "No tools", "12–15 kg", "Fire rated B-s1,d0", "Flat-pack storage", "Trusted by leading hotels"].map((t, i) => (
              <span key={`${k}-${i}`}>{t} <span className="mx-3">✦</span></span>
            )),
          )}
        </div>
      </div>

      {/* Sections */}
      {sections.map((s) => (
        <section key={s.slug} id={s.slug} className="scroll-mt-16 px-4 py-16 md:px-8 md:py-24" style={{ background: tint[s.slug] ?? "#f4f1ea" }}>
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-black/50">{s.kicker}</p>
                <h2 className="mt-2 text-[clamp(2.8rem,8vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">{s.name}</h2>
              </div>
              <p className="max-w-md text-[17px] leading-snug text-black/70">{s.intro}</p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {s.items.map((d) => (
                <DesignCard key={d.slug} design={d} skin="bold" accent="#ffffff" />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Contact */}
      <section id="contact" className="bg-black px-5 py-24 text-white md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2 md:items-center">
          <h2 className="text-[clamp(2.8rem,7vw,6.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]">Bring it to <span className="text-[#ffd23f]">your hotel.</span></h2>
          <form className="grid gap-3">
            {["Name", "Hotel / company", "Email"].map((l) => (
              <input key={l} placeholder={l} className="rounded-full border-2 border-white/30 bg-transparent px-5 py-3 text-base outline-none placeholder:text-white/50 focus:border-[#ffd23f]" />
            ))}
            <button type="button" className="mt-2 justify-self-start rounded-full bg-[#ffd23f] px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-black">Request quote</button>
          </form>
        </div>
      </section>
      <footer className="bg-black px-5 py-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50 md:px-10">© 2026 Screenery. Design option B.</footer>
    </main>
  );
}
