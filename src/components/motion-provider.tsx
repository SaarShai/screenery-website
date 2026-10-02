"use client";

import { MotionConfig } from "framer-motion";

/** Visitors who ask for reduced motion get fades without slides, swells or turns, site-wide. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
