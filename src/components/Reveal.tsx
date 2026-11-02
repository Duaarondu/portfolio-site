/**
 * Reveal.tsx — scroll-reveal building blocks.
 *
 * HOW IT WORKS
 * Motion's `whileInView` animates an element from its `initial` style to
 * its visible style the first time it scrolls into view (`viewport.once`).
 *
 *   <Reveal>                 one element fades and rises in
 *   <RevealGroup as="ul">    a list whose children appear one after another,
 *     <RevealItem as="li">   like lines printing in a log ("stagger")
 *   <Wipe>                   a heading uncovered left to right, like typing
 *
 * These are Client Components, but you can wrap Server Component content
 * in them: the children are still rendered on the server.
 */
"use client";

import { motion, type Variants } from "motion/react";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

const viewport = { once: true, amount: 0.2 } as const;

/** One element fades, rises a little and un-blurs when it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 12,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number; // how far it rises, in px
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={viewport}
      transition={{ duration: 0.5, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Variants: named animation states that a parent passes down to children */
const groupVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.045 } }, // subtle: 30–60ms reads as one motion
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: EASE_OUT } },
};

const groupTags = { div: motion.div, ul: motion.ul, ol: motion.ol, dl: motion.dl };
const itemTags = { div: motion.div, li: motion.li, article: motion.article };

/** A container whose RevealItem children appear one after another. */
export function RevealGroup({
  as = "div",
  children,
  className,
  ...rest
}: {
  as?: keyof typeof groupTags;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const Tag = groupTags[as];
  return (
    <Tag
      className={className}
      variants={groupVariants}
      initial="hidden"
      whileInView="shown"
      viewport={viewport}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** One item inside a RevealGroup. It inherits the group's timing. */
export function RevealItem({
  as = "div",
  children,
  className,
}: {
  as?: keyof typeof itemTags;
  children: React.ReactNode;
  className?: string;
}) {
  const Tag = itemTags[as];
  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}

const wipeVariants: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  // Travels across the heading, so it eases in AND out
  shown: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.6, ease: EASE_IN_OUT } },
};

/**
 * Uncovers its content left to right, like a line being typed.
 * The OUTER span watches for visibility: a fully clipped element counts as
 * invisible to the browser, so it could never trigger its own animation.
 */
export function Wipe({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="inline-block"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.8 }}
    >
      <motion.span className="inline-block" variants={wipeVariants}>
        {children}
      </motion.span>
    </motion.span>
  );
}
