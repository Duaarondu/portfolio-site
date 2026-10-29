/**
 * ClaimCheck.tsx — the hero panel. It "verifies" each project number one
 * at a time, the same idea as the Critic agent in the NFL Fantasy Agent.
 *
 * LEARNING NOTE: "use client" marks this as a Client Component. By default
 * Next.js renders components on the server (fast, no JavaScript sent).
 * We need the browser here because the panel animates with state and a
 * timer — useState and useEffect only work in Client Components.
 */
"use client";

import { useEffect, useState } from "react";
import type { Claim } from "@/data/profile";

const STEP_MS = 650; // time between each claim being checked

export function ClaimCheck({ claims }: { claims: Claim[] }) {
  // How many claims have been verified so far (0 → claims.length)
  const [checked, setChecked] = useState(0);

  useEffect(() => {
    // Respect visitors who turned on "reduce motion" in their OS
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Show everything as verified right away (inside a callback, not
      // directly in the effect body, which React's lint rules discourage)
      const t = setTimeout(() => setChecked(claims.length), 0);
      return () => clearTimeout(t);
    }
    // Tick once per claim, then stop
    const timer = setInterval(() => {
      setChecked((n) => {
        if (n + 1 >= claims.length) clearInterval(timer);
        return Math.min(n + 1, claims.length);
      });
    }, STEP_MS);
    // Cleanup: React calls this if the component unmounts
    return () => clearInterval(timer);
  }, [claims.length]);

  const done = checked === claims.length;

  return (
    <section
      aria-labelledby="claim-check-title"
      className="rounded-lg border border-rule bg-surface p-5 sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
        <h2 id="claim-check-title" className="font-display text-lg font-bold">
          Claim check
        </h2>
        <p className="text-sm text-muted" aria-live="polite">
          {done ? `${claims.length} of ${claims.length} traced to source` : "Checking…"}
        </p>
      </div>

      <p className="mt-3 text-sm text-muted">
        My Critic agent won&apos;t let a number through unless it matches a source row. Same rule
        for the numbers about my work:
      </p>

      <ul className="mt-4 space-y-3">
        {claims.map((claim, i) => {
          const isChecked = i < checked;
          // Split the sentence around {value} so the number can be styled
          const [before, after] = claim.text.split("{value}");
          return (
            <li key={claim.value} className="grid grid-cols-[1.5rem_1fr] gap-x-3">
              <StatusMark checked={isChecked} />
              <div>
                <p className="leading-snug">
                  {before}
                  <span
                    className={`rounded px-1 font-semibold transition-colors duration-300 ${
                      isChecked ? "bg-verified-soft text-verified" : "text-ink"
                    }`}
                  >
                    {claim.value}
                  </span>
                  {after}
                </p>
                <a
                  href={claim.source.href}
                  className={`mt-0.5 inline-block font-mono text-xs text-muted underline-offset-2 transition-opacity duration-300 hover:text-verified hover:underline ${
                    isChecked ? "opacity-100" : "opacity-40"
                  }`}
                >
                  source: {claim.source.label}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** A small circle: hollow while pending, filled with a check once verified. */
function StatusMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={`mt-1 flex size-5 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
        checked ? "border-verified bg-verified" : "border-rule"
      }`}
    >
      <span className="sr-only">{checked ? "Verified:" : "Checking:"}</span>
      {checked && (
        <svg viewBox="0 0 12 12" className="size-3 text-paper" aria-hidden="true">
          <path
            d="M2.5 6.2 5 8.5 9.5 3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}
