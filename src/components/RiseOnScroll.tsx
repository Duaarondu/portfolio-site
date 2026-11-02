/**
 * RiseOnScroll.tsx — content that rises into place as you reach the end
 * of the page.
 *
 * Over the last DISTANCE pixels of scrolling (while the last photo is on
 * screen) it goes from 64px low and faded to its normal spot. It's tied
 * to scroll position, like the photo strip, so it moves only while you
 * scroll and plays even when the computer asks for reduced motion.
 */
"use client";

import { motion, useScroll, useTransform } from "motion/react";

const DISTANCE = 400; // px of scrolling the rise takes

/** 1 when you're DISTANCE px or more from the bottom of the page, 0 at the bottom */
function remaining(scrollY: number) {
  if (typeof window === "undefined") return 1; // on the server
  const left = document.documentElement.scrollHeight - window.innerHeight - scrollY;
  return Math.min(1, Math.max(0, left / DISTANCE));
}

export function RiseOnScroll({ children, className }: { children: React.ReactNode; className?: string }) {
  const { scrollY } = useScroll(); // the whole page's scroll position, in px
  const y = useTransform(() => remaining(scrollY.get()) * 64);
  const opacity = useTransform(() => 1 - remaining(scrollY.get()) * 0.8);
  return (
    <motion.div style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}
