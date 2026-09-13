"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Design } from "@/data/catalog";

export type Skin = "editorial" | "bold";

/**
 * One design: hero (switchable by the three variant thumbnails) plus room shots.
 * Two skins share the behaviour; only the classes differ.
 */
export default function DesignCard({ design, skin, accent }: { design: Design; skin: Skin; accent?: string }) {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<"studio" | "room">("studio");
  const shown = view === "room" ? design.rooms[0] : design.variants[active].image;
  const editorial = skin === "editorial";

  return (
    <article className={editorial ? "group" : "group rounded-[28px] p-4 md:p-5 transition-colors"} style={editorial ? undefined : { background: accent ?? "#f4f1ea" }}>
      {/* Hero */}
      <div className={`relative overflow-hidden ${editorial ? "bg-[#efe9df] aspect-[4/3]" : "bg-white rounded-[20px] aspect-[4/3]"}`}>
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={shown.src}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={shown.src}
              alt={`${design.name}, ${view === "room" ? "in a hotel room" : design.variants[active].label}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
              className={view === "room" ? "object-cover" : "object-cover"}
            />
          </motion.div>
        </AnimatePresence>

        {/* Studio / room toggle (bold skin) */}
        {!editorial && design.rooms.length > 0 && (
          <div className="absolute left-3 top-3 flex rounded-full bg-white/85 p-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur">
            {(["studio", "room"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-3 py-1 transition ${view === v ? "bg-black text-white" : "text-black/70 hover:text-black"}`}
              >
                {v === "studio" ? "Studio" : "In room"}
              </button>
            ))}
          </div>
        )}
        {design.price && (
          <span className={`absolute right-3 top-3 text-[11px] tracking-[0.15em] uppercase ${editorial ? "bg-[#f6f1e8]/90 text-[#17150f] px-2 py-1" : "rounded-full bg-black text-white px-3 py-1 font-semibold"}`}>
            {design.price}
          </span>
        )}
      </div>

      {/* Variant thumbnails */}
      <div className={`mt-3 flex items-center gap-2 ${editorial ? "" : "justify-center"}`}>
        {design.variants.map((v, i) => {
          const on = i === active && view === "studio";
          return (
            <button
              key={i}
              onClick={() => {
                setActive(i);
                setView("studio");
              }}
              aria-label={`${design.name}: ${v.label}`}
              aria-pressed={on}
              title={v.label}
              className={
                editorial
                  ? `relative h-14 w-[4.5rem] overflow-hidden bg-[#efe9df] transition-opacity ${on ? "opacity-100 ring-1 ring-[#17150f]" : "opacity-60 hover:opacity-100"}`
                  : `relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-offset-2 transition ${on ? "ring-black" : "ring-transparent hover:ring-black/30"}`
              }
              style={editorial ? undefined : { ["--tw-ring-offset-color" as string]: accent ?? "#f4f1ea" }}
            >
              <Image src={v.image.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          );
        })}
        {editorial && design.rooms.length > 0 && (
          <button
            onClick={() => setView(view === "room" ? "studio" : "room")}
            className={`ml-auto text-[11px] uppercase tracking-[0.18em] underline-offset-4 hover:underline ${view === "room" ? "underline" : ""}`}
          >
            {view === "room" ? "Studio" : "In the room"}
          </button>
        )}
      </div>

      {/* Copy */}
      <div className={`mt-4 ${editorial ? "" : "text-center"}`}>
        <div className={editorial ? "flex items-baseline justify-between gap-4" : ""}>
          <h3 className={editorial ? "font-display text-2xl leading-none" : "text-xl font-bold tracking-tight"}>{design.name}</h3>
          <p className={`text-[11px] uppercase tracking-[0.2em] ${editorial ? "text-[#8b7355]" : "mt-0.5 text-black/50"}`}>{design.tagline}</p>
        </div>
        <p className={`mt-2 text-[14px] leading-relaxed ${editorial ? "text-[#5b574f] font-light" : "text-black/65 mx-auto max-w-[32ch]"}`}>{design.description}</p>
      </div>

      {/* Room shots (editorial: thin strip) */}
      {editorial && design.rooms.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {design.rooms.slice(0, 2).map((r, i) => (
            <button key={i} onClick={() => setView("room")} className={`relative aspect-[3/2] overflow-hidden bg-[#efe9df] ${design.rooms.length === 1 ? "col-span-2 aspect-[3/1]" : ""}`}>
              <Image src={r.src} alt={`${design.name} in a hotel room`} fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
