"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FadeInWhenVisible({
  children,
  delay = 0,
  y = 40,
  margin = "-80px",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  margin?: string;
}) {
  const ref = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isInView = useInView(ref, { once: true, margin: margin as any });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
