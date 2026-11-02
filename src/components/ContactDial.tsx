/**
 * ContactDial.tsx — your links arranged on a turning dial.
 *
 * HOW IT WORKS
 * Every link sits on an invisible circle whose center is off to the left.
 * The selected link is at the "3 o'clock" position (angle 0); the others
 * are spaced 28° apart above and below it. Each item's position comes
 * from trigonometry:
 *     x = cos(angle) × radius,   y = sin(angle) × radius
 * and its text is rotated by the same angle so it follows the curve.
 *
 * When the selection changes, every item gets a new angle and Motion
 * animates it there, so the whole dial turns. It turns on its own every
 * few seconds until you pick a link; the big name above opens it.
 *
 * Email is different: clicking it copies the address instead of using a
 * mailto: link, which opens whatever mail app or site the visitor's
 * browser is set to (often a Google sign-in page).
 */
"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { EASE_OUT, SNAPPY_SPRING } from "@/lib/motion";

export type DialLink = {
  label: string;
  href: string;
  copy?: string; // set this to copy the text instead of opening href
};

const STEP_DEGREES = 28;
const RADIUS = 105; // px
const AUTO_TURN_MS = 2600;

export function ContactDial({ links }: { links: DialLink[] }) {
  const [selected, setSelected] = useState(0);
  const [userPicked, setUserPicked] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  // Turn to the next link on a timer, until the visitor picks one
  useEffect(() => {
    if (userPicked || reduceMotion) return;
    const timer = setInterval(() => setSelected((s) => (s + 1) % links.length), AUTO_TURN_MS);
    return () => clearInterval(timer);
  }, [userPicked, reduceMotion, links.length]);

  const current = links[selected];
  const external = current.href.startsWith("http");

  // "Copied" goes back to the normal label after a moment
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy(text: string) {
    setUserPicked(true); // stop the dial turning away from Email
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      window.location.href = current.href; // clipboard blocked: fall back to mailto
    }
  }

  const bigClass =
    "mt-2 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-none uppercase transition-[color,scale] duration-150 ease-out-strong hover:text-accent active:scale-[0.98]";
  const bigName = (
    // key makes React swap the element, so the new name animates in
    <motion.span
      key={current.label}
      className="inline-block"
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    >
      {current.label}
    </motion.span>
  );

  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-surface px-6 pt-8 pb-4">
      <p
        className={`font-sans text-xs font-medium tracking-[0.14em] uppercase transition-colors duration-150 ${copied ? "text-verified" : "text-step"}`}
        aria-live="polite"
      >
        {copied ? "Copied to clipboard" : current.copy ? "Click to copy" : "Click to open"}
      </p>
      {current.copy ? (
        <button type="button" onClick={() => copy(current.copy!)} className={bigClass}>
          {bigName}
        </button>
      ) : (
        <a
          href={current.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
          className={bigClass}
        >
          {bigName}
        </a>
      )}
      {/* The address itself, so it can be read or selected by hand */}
      <p className="mt-2 h-5 font-sans text-sm text-muted select-all">{current.copy ?? ""}</p>

      {/* The dial. Its center is left of the card's middle. */}
      <ul className="relative mt-2 h-52 w-full max-w-xs" aria-label="Choose a link">
        {links.map((link, i) => {
          // Shortest distance around the dial, so it can wrap both ways
          let offset = i - selected;
          const half = links.length / 2;
          if (offset > half) offset -= links.length;
          if (offset < -half) offset += links.length;
          const angle = offset * STEP_DEGREES;
          const rad = (angle * Math.PI) / 180;
          const isSelected = offset === 0;
          return (
            <li key={link.label} className="absolute top-1/2 left-[22%]">
              <motion.button
                type="button"
                onClick={() => {
                  setSelected(i);
                  setUserPicked(true);
                }}
                aria-pressed={isSelected}
                className="absolute -translate-y-1/2 font-display text-base whitespace-nowrap uppercase origin-left"
                animate={{
                  x: Math.cos(rad) * RADIUS,
                  y: Math.sin(rad) * RADIUS,
                  rotate: angle,
                  opacity: Math.max(0.12, 1 - Math.abs(offset) * 0.38),
                  color: isSelected ? "#efe8cf" : "#858269",
                }}
                transition={SNAPPY_SPRING} // springs can be interrupted mid-turn
                whileTap={{ scale: 0.95 }} // a small press-down so the tap feels physical
              >
                {link.label}
              </motion.button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
