/**
 * motion.ts — shared animation settings, so every animation on the site
 * moves with the same "feel".
 *
 * These follow design engineer Emil Kowalski's guidelines (animations.dev):
 * - EASE_OUT for anything appearing or responding to the visitor: it starts
 *   fast and settles gently, which feels responsive. Never ease-in for UI;
 *   starting slow feels laggy.
 * - EASE_IN_OUT for things that travel across the screen (like a wipe).
 * - Keep it quick: interactions ~150–250ms, entrances ~300–500ms.
 * - Start from a small offset with a slight blur, never from nothing.
 * The same curves exist in CSS as `ease-out-strong` / `ease-in-out-strong`
 * (see globals.css), so Tailwind classes and Motion match.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/** A spring that settles quickly with almost no bounce, for interactive UI. */
export const SNAPPY_SPRING = { type: "spring", duration: 0.45, bounce: 0.12 } as const;
