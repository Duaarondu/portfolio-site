/**
 * TitleScene.tsx — scene 1, the title card.
 *
 * Two animations stack on each line:
 * 1. ON LOAD (inner span): lines slide in from alternating sides, one after
 *    another, like opening credits.
 * 2. ON SCROLL (outer div): as you scroll away, `useScroll` reports 0 → 1
 *    and `useTransform` pushes each line sideways (alternating directions)
 *    and fades it out, so the title "pulls apart" into the next scene.
 *
 * They're on separate elements so the two animations never fight over
 * the same `x` value.
 */
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { TitleLine } from "@/data/profile";
import { EASE_OUT } from "@/lib/motion";

export function TitleScene({ lines }: { lines: TitleLine[] }) {
  const ref = useRef<HTMLElement>(null);
  // 0 when the scene fills the screen, 1 when it has scrolled off the top
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center overflow-hidden py-16"
    >
      <h1 className="mx-auto w-full max-w-6xl px-4 font-display text-[clamp(2.6rem,12vw,8.5rem)] lg:text-[clamp(2.6rem,9.4vw,8.5rem)] leading-[0.98] tracking-tight uppercase sm:px-8">
        {lines.map((line, i) => (
          <Line key={line.text} line={line} index={i} progress={scrollYProgress} />
        ))}
      </h1>

      <motion.p
        style={{ opacity: cueOpacity }}
        className="absolute inset-x-0 bottom-6 text-center font-sans text-[11px] font-medium tracking-[0.3em] text-step uppercase"
        aria-hidden="true"
      >
        Scroll
      </motion.p>
    </section>
  );
}

function Line({
  line,
  index,
  progress,
}: {
  line: TitleLine;
  index: number;
  progress: MotionValue<number>;
}) {
  const direction = index % 2 === 0 ? -1 : 1; // even lines go left, odd go right
  const x = useTransform(progress, [0, 1], ["0vw", `${direction * 30}vw`]);
  const opacity = useTransform(progress, [0, 0.7], [1, 0]);

  return (
    <motion.span style={{ x, opacity, paddingLeft: `${line.indent}%` }} className="block">
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, x: direction * 48, filter: "blur(10px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.15 + index * 0.09, ease: EASE_OUT }}
      >
        {line.text}
      </motion.span>
    </motion.span>
  );
}
