/**
 * Logo.tsx — the cursive "AD" monogram in the top-left corner.
 *
 * The letters are real vector shapes (SVG paths), traced from the
 * Great Vibes script font (open-source, SIL Open Font License) and
 * overlapped so they read as one monogram. Because they're shapes, not
 * text, the logo looks the same everywhere and never waits for a font.
 * The shapes themselves live in src/lib/logo.ts, shared with the last
 * photo (EndScene.tsx) and the link-preview image (opengraph-image.tsx).
 * The browser-tab icon (src/app/icon.svg) uses the same shapes.
 *
 * On page load the logo "writes itself": Motion animates each letter's
 * outline from 0 to fully drawn (pathLength), then fills it in.
 * Clicking it glides back to the very top of the page.
 */
"use client";

import { motion } from "motion/react";
import { LETTERS, VIEWBOX } from "@/lib/logo";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";



export function Logo() {
  const reduceMotion = usePrefersReducedMotion();

  const toTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // stay on the page without adding #top to the URL
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <a
      href="#top"
      onClick={toTop}
      aria-label="Aaron Du, back to top"
      className="-my-1 block text-accent transition-transform duration-200 ease-out-strong hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]"
    >
      <svg viewBox={VIEWBOX} className="h-9 w-auto overflow-visible" aria-hidden="true">
        {LETTERS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={6}
            initial={{ pathLength: 0, fillOpacity: 0 }}
            animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{
              pathLength: { duration: 1.1, delay: 0.15 + i * 0.5, ease: "easeInOut" },
              fillOpacity: { duration: 0.5, delay: 0.85 + i * 0.5 },
            }}
          />
        ))}
      </svg>
    </a>
  );
}
