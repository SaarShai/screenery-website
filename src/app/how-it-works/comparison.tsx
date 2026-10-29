"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import styles from "./gallery.module.css";

type Scene = { id: string; title: string; width?: number; height?: number; flip?: boolean };

export default function Comparison({ id, title, width = 3, height = 2, flip = false }: Scene) {
  const [position, setPosition] = useState(40);
  const frame = useRef<HTMLDivElement>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    const bounds = frame.current?.getBoundingClientRect();
    if (bounds) setPosition(Math.round(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100))));
  }

  return (
    <section className={styles.scene} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <div
        ref={frame}
        className={`${styles.frame} ${flip ? styles.flipped : ""}`}
        style={{ aspectRatio: `${width} / ${height}` }}
        onPointerDown={(event) => { if (event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); move(event); }}
        onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event); }}
      >
        <Image src={`/gallery/${id}-after.webp`} alt={`${title} after the space is transformed`} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" />
        <div className={styles.before} style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <Image src={`/gallery/${id}-before.webp`} alt="" fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" />
        </div>
        <div className={styles.divider} style={{ left: `${position}%` }} aria-hidden="true">
          <span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 7-5 5 5 5M15 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </div>
        <input
          className={styles.slider}
          style={{ left: `${position}%` }}
          type="range" min="0" max="100" value={position}
          aria-label={`${title}: compare before and after`}
          aria-valuetext={`${position}% before, ${100 - position}% after`}
          onChange={(event) => setPosition(Number(event.target.value))}
        />
      </div>
    </section>
  );
}
