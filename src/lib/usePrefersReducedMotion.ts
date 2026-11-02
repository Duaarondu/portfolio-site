/**
 * usePrefersReducedMotion — true when the visitor's computer asks for
 * less motion (Windows "Animation effects" off, macOS "Reduce motion").
 *
 * Why not Motion's useReducedMotion? The server can't know the visitor's
 * setting, so it renders as if motion is allowed. If the browser's first
 * render used the real setting, the two wouldn't match and React would
 * log a "hydration" error. useSyncExternalStore fixes that: during
 * hydration it uses getServerSnapshot (false, same as the server), then
 * immediately re-renders with the real value.
 */
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches, // in the browser
    () => false, // on the server, and during hydration
  );
}
