"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function TransformationsVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }

  return (
    <div className="relative mx-auto mt-12 max-w-5xl md:mt-14">
      <video
        ref={videoRef}
        src={visible ? "/videos/screenery-transformations-no-bars.mp4" : undefined}
        poster="/videos/screenery-transformations-no-bars-poster.jpg"
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="aspect-[3/2] w-full bg-white object-contain"
        aria-label="See rooms transformed with Screenery"
      />
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute right-3 bottom-3 flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-[#183c37] shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183c37]"
      >
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}
