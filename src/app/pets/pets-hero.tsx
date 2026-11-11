"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import { usePrefersStill } from "@/lib/use-prefers-still";

// One slide for each style. `pos` is the object-position of the wide file on desktop, where the hero crops to about 2.25:1.
const SLIDES = [
  { file: "room-bespoke-alcove", name: "Toile de Jouy · Alcove", pos: "50% 58%", alt: "A black labrador asleep in a Toile de Jouy Alcove, blue on cream, with songbird and urn toppers, in a panelled hotel bedroom" },
  { file: "room-chinoiserie-suite", name: "Chinoiserie · Suite", pos: "50% 62%", alt: "A pug in a Chinoiserie Suite, sage green with blossom, with two bowls inside, in a city hotel bedroom" },
  { file: "room-travelposter-lobby", name: "Grand Tour · Alcove", pos: "50% 75%", alt: "A fox terrier with its lead in a Grand Tour Alcove, in a hotel lobby corner" },
  { file: "room-woodblock-suite", name: "Woodblock · Suite", pos: "50% 60%", alt: "A shiba inu in a Woodblock Suite, with two bowls inside, in a hotel room with pale timber" },
  { file: "room-botanical-alcove", name: "Botanical · Alcove", pos: "50% 60%", alt: "A tabby cat in a Botanical Alcove, in a garden-view hotel room" },
].map((s) => {
  const common = { alt: s.alt, sizes: "100vw", quality: 90 };
  return {
    ...s,
    wide: getImageProps({ ...common, src: `/pets/hotel/${s.file}.jpg`, width: 1672, height: 941 }).props,
    tall: getImageProps({ ...common, src: `/pets/hotel/${s.file}-portrait.jpg`, width: 1122, height: 1402 }).props,
  };
});
const HOLD = 6000; // ms each slide stays
const FADE = "opacity 1.2s ease-in-out, transform 1.8s ease-out";

/** The hero: five room images in turn, a slow cross-fade, and the caption below changes with the image. */
export default function PetsHero() {
  const still = usePrefersStill();
  const [[cur, prev], setPair] = useState<[number, number | null]>([0, null]);
  const [all, setAll] = useState(false); // slides 2 to 6 are added after the first paint
  const [held, setHeld] = useState(false); // pointer on the image, or the tab is hidden
  const touch = useRef(0);

  const go = (k: number) => {
    setAll(true);
    setPair(([c]) => (k === c ? [c, null] : [(k + SLIDES.length) % SLIDES.length, c]));
  };

  useEffect(() => {
    const t = setTimeout(() => setAll(true), 2500);
    const vis = () => setHeld(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => { clearTimeout(t); document.removeEventListener("visibilitychange", vis); };
  }, []);

  // The slide below stays only for the length of the fade, so a step back fades too.
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPair(([c]) => [c, null]), 1300);
    return () => clearTimeout(t);
  }, [cur, prev]);

  useEffect(() => {
    if (still || held) return;
    const t = setTimeout(() => setPair(([c]) => [(c + 1) % SLIDES.length, c]), HOLD);
    return () => clearTimeout(t);
  }, [cur, still, held]);

  return (
    <figure aria-roledescription="carousel" aria-label="The five styles in hotel rooms">
      <style>{"@keyframes pets-cap{from{opacity:0}to{opacity:1}}"}</style>
      <div
        className="relative w-full aspect-[4/5] md:aspect-auto md:h-[64vh] md:min-h-[460px] md:max-h-[700px] overflow-hidden bg-[#ece5d8]"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
        }}
      >
        {SLIDES.map((s, k) => {
          if (k > 0 && !all) return null;
          const on = k === cur, under = k === prev;
          return (
            <picture key={s.file} className="absolute inset-0"
              style={{
                zIndex: on ? 2 : under ? 1 : 0,
                opacity: on || under ? 1 : 0,
                transform: on || under ? "none" : "scale(1.03)",
                transition: on && !still ? FADE : "none",
              }}>
              <source media="(max-width: 767px)" srcSet={s.tall.srcSet} />
              {/* A wide file on desktop, an upright file on a phone. */}
              <img src={s.wide.src} srcSet={s.wide.srcSet} sizes="100vw" alt={on ? s.alt : ""} decoding="async"
                fetchPriority={k === 0 ? "high" : undefined} loading={k === 0 ? undefined : "lazy"}
                style={{ "--pos": s.pos } as React.CSSProperties}
                className="h-full w-full object-cover object-center md:object-[var(--pos)]" />
            </picture>
          );
        })}
      </div>
      <figcaption className="mx-auto max-w-7xl px-4 md:px-12 h-11 flex items-center justify-between gap-4">
        <span key={cur} aria-live="polite" style={still ? undefined : { animation: "pets-cap .5s ease" }} className="text-[11px] tracking-[0.12em] uppercase text-[#716a5e]">
          {SLIDES[cur].name}
        </span>
        <span className="flex -mr-2">
          {SLIDES.map((s, k) => (
            <button key={s.file} type="button" onClick={() => go(k)} aria-label={`Show ${s.name}`} aria-current={k === cur || undefined}
              className="h-11 w-7 flex items-center justify-center">
              <span className={`block w-4 transition-colors ${k === cur ? "h-[2px] bg-[#1b1915]" : "h-px bg-[#716a5e]/50"}`} />
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
