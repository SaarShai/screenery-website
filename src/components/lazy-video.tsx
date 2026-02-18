"use client";

import { useRef, useState, useEffect } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
}

export default function LazyVideo({ src, className }: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // start loading 200px before it scrolls into view
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {shouldLoad ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={className}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        // Placeholder with same aspect ratio to prevent layout shift
        <div className={`${className} bg-[#e5e2dc]/30 aspect-video`} />
      )}
    </div>
  );
}
