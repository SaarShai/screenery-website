import LogoWall from "./logo-wall";
import Testimonials from "./testimonials";

const stats = [
  ["5–15 min", "Set-up, no tools"],
  ["100%", "Recyclable felt"],
  ["Hand-made", "In Britain"],
  ["Suitable for", "Rooms, lobbies, event halls & outdoor spaces"],
];

export function StatsRibbon() {
  return (
    <div className="border-y border-[#17150f]/10 bg-[#efe9df] lg:col-span-7 lg:row-start-2">
      <div className="grid grid-cols-2 gap-px bg-[#17150f]/10 md:grid-cols-4">
        {stats.map(([v, l]) => (
          <div key={l} className="bg-[#efe9df] px-4 py-5 lg:px-3 xl:px-5">
            <p className="font-display text-[clamp(1.25rem,2.1vw,1.8rem)]">{v}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#5b574f]">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <section aria-label="Hotel clients" className="px-6 pt-12 pb-12 md:px-12 md:pt-14 md:pb-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-[12px] uppercase tracking-[0.2em] text-[#6f5a41]">Trusted by</p>
        <LogoWall />
      </div>
      <Testimonials />
    </section>
  );
}
