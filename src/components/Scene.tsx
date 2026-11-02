/**
 * Scene.tsx — makes a section play like its own scene in a movie.
 *
 * Each scene is at least one screen tall. As it scrolls up into view it
 * fades in, rises and grows to full size; as it scrolls away it fades
 * back down while the next scene takes over.
 *
 * Two useScroll trackers watch the same section:
 *   enter: 0 when its top reaches the bottom of the screen,
 *          1 when its top is just past the middle
 *   exit:  0 when its bottom is just above the middle,
 *          1 when its bottom leaves the top of the screen
 * useTransform turns those into opacity, scale and y.
 *
 * Reduced motion: only the fade plays (no rising or zooming).
 */
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function Scene({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();

  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 0.55"] });
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ["end 0.45", "end start"] });

  const opacity = useTransform(() => Math.min(0.15 + 0.85 * enter.get(), 1 - 0.8 * exit.get()));
  const scale = useTransform(() => (0.95 + 0.05 * enter.get()) * (1 - 0.05 * exit.get()));
  const y = useTransform(() => (1 - enter.get()) * 80);

  return (
    <motion.div
      ref={ref}
      // Reduced motion: fade only (no rise or zoom)
      style={reduce ? { opacity } : { opacity, scale, y }}
      className="flex min-h-svh flex-col justify-center will-change-transform"
    >
      {children}
    </motion.div>
  );
}
