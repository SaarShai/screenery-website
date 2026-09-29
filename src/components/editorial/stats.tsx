const stats = [
  ["10–20 min", "Set-up, no tools"],
  ["12–15 kg", "Per unit"],
  ["100%", "Recycled PET"],
  ["B-s1, d0", "Fire rated"],
];

export default function Stats() {
  return (
    <>
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

    </>
  );
}
