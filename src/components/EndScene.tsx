/**
 * EndScene.tsx — the last scene before the footer strip: a framed photo
 * with the AD logo faded in the middle.
 *
 * - The photo (profile.ts → endPhoto) slowly settles from slightly zoomed
 *   in as you scroll to it (a Ken Burns-style move driven by scroll).
 *   object-position picks which part of the photo stays in the frame.
 * - The logo writes itself when it comes into view, blended into the
 *   photo (mix-blend-overlay) so it picks up the sky's colors. Clicking it goes back to the top.
 */
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { profile } from "@/data/profile";
import { LETTERS, VIEWBOX } from "@/lib/logo";

export function EndScene() {
  const { endPhoto } = profile;
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // 0 when the photo starts coming up, 1 when it's centered on screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  const toTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-label="The end" className="px-3 py-16 sm:px-6">
      <div
        ref={ref}
        className="relative mx-auto flex aspect-[4/5] w-full max-w-7xl items-center justify-center overflow-hidden rounded-sm sm:aspect-video"
      >
        {/* The scenery */}
        <motion.div style={{ scale: reduce ? 1 : photoScale }} className="absolute inset-0">
          <Image
            src={endPhoto.src}
            alt={endPhoto.alt}
            fill
            sizes="(min-width: 1300px) 80rem, 100vw"
            quality={90}
            className="object-cover object-[center_55%]"
          />
        </motion.div>
        {/* A light tint to set the mood */}
        <div className="absolute inset-0 bg-black/15" />

        {/* The logo, faded and lifted into the sky (the bottom margin pushes
            it up from center). mix-blend-overlay mixes it with the photo
            underneath, so it takes on the sky's own colors. */}
        <a
          href="#top"
          onClick={toTop}
          aria-label="Back to top"
          className="relative mb-[22%] block text-cream opacity-80 mix-blend-overlay sm:mb-[12%] transition-[opacity,scale] duration-300 ease-out-strong hover:opacity-100 active:scale-[0.97]"
        >
          <svg viewBox={VIEWBOX} className="h-[clamp(4rem,11vw,7.5rem)] w-auto overflow-visible" aria-hidden="true">
            {LETTERS.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={6}
                initial={{ pathLength: 0, fillOpacity: 0 }}
                whileInView={{ pathLength: 1, fillOpacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  pathLength: { duration: 1.3, delay: 0.2 + i * 0.55, ease: "easeInOut" },
                  fillOpacity: { duration: 0.6, delay: 1 + i * 0.55 },
                }}
              />
            ))}
          </svg>
        </a>
      </div>
    </section>
  );
}
