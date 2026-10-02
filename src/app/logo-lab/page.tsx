"use client";

import { useState } from "react";
import AnimatedLogo from "@/components/animated-logo";

/** Test page for the two logo animations; not linked from the site. */
export default function LogoLab() {
  const [replay, setReplay] = useState(0);
  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-12 md:px-12">
      <h1 className="font-display text-3xl">Logo animation: two variants</h1>
      <p className="mt-2 max-w-xl text-[15px] text-[#5b574f]">
        Entrance plays on load. On this page the periodic move runs every 5 seconds (on the site it would be every 12–15). Hover a logo to play it at once.
      </p>
      <button type="button" onClick={() => setReplay((r) => r + 1)} className="mt-6 bg-[#17150f] px-5 py-3 text-[12px] uppercase tracking-[0.14em] text-[#f6f1e8]">
        Replay entrance
      </button>
      {(["a", "b"] as const).map((v) => (
        <section key={v} className="mt-14 border-t border-[#17150f]/10 pt-10">
          <h2 className="text-[12px] uppercase tracking-[0.2em] text-[#6f5a41]">
            {v === "a" ? "A — Unfold, drop in, letter wave" : "B — Stand up, pop, doors swing"}
          </h2>
          <div className="mt-6 flex h-[72px] items-center border border-[#d8d0c4] bg-[#f6f1e8] px-6">
            <AnimatedLogo key={`h${replay}`} variant={v} every={5000} className="h-8 w-auto" />
            <span className="ml-auto text-[11px] uppercase tracking-[0.14em] text-[#5b574f]">header size</span>
          </div>
          <AnimatedLogo key={`l${replay}`} variant={v} every={5000} className="mt-10 w-full max-w-[720px]" />
        </section>
      ))}
    </main>
  );
}
