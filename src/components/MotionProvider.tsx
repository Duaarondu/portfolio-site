/**
 * MotionProvider.tsx — site-wide animation settings.
 *
 * reducedMotion="user" tells Motion to follow the visitor's OS setting:
 * if they turned on "Reduce motion", elements still fade in but nothing
 * slides or moves.
 */
"use client";

import { MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
