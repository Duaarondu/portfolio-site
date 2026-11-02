/**
 * AgentTrace.tsx — the hero panel. It prints how one answer moves through
 * the NFL Fantasy Agent, one log line at a time, like watching it run.
 *
 * LEARNING NOTE: "use client" marks this as a Client Component. By default
 * Next.js renders components on the server (fast, no JavaScript sent).
 * We need the browser here because the panel animates with state and a
 * timer — useState and useEffect only work in Client Components.
 */
"use client";

import { useEffect, useState } from "react";
import type { Stat, TraceStep } from "@/data/profile";

const LINE_MS = 520; // time between log lines

const agentColor: Record<TraceStep["agent"], string> = {
  planner: "text-agent",
  analyst: "text-agent",
  critic: "text-accent",
};

export function AgentTrace({ steps, stats }: { steps: TraceStep[]; stats: Stat[] }) {
  // How many lines have printed so far (0 → steps.length)
  const [shown, setShown] = useState(0);

  useEffect(() => {
    // Respect visitors who turned on "reduce motion": print everything at once
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setInterval(
      () => {
        setShown((n) => {
          if (reduce || n + 1 >= steps.length) clearInterval(timer);
          return reduce ? steps.length : Math.min(n + 1, steps.length);
        });
      },
      reduce ? 0 : LINE_MS,
    );
    // Cleanup: React calls this if the component unmounts
    return () => clearInterval(timer);
  }, [steps.length]);

  const done = shown === steps.length;

  return (
    <figure className="m-0 min-w-0 overflow-hidden rounded-lg border border-rule bg-surface">
      <figcaption className="border-b border-rule px-4 py-3 text-sm text-muted">
        How one answer moves through the NFL Fantasy Agent (illustration)
      </figcaption>

      <ol className="overflow-x-auto p-4 font-mono text-[13px] leading-7 sm:leading-8" aria-live="polite">
        {steps.map((step, i) => {
          const visible = i < shown;
          const isLast = i === shown - 1 && !done;
          const color =
            step.tone === "pass" ? "text-verified" : agentColor[step.agent];
          return (
            <li
              key={i}
              className={`grid grid-cols-[3.75rem_4.25rem_minmax(0,1fr)] gap-2 sm:grid-cols-[4.5rem_4.5rem_minmax(0,1fr)] transition-[opacity,translate] duration-300 ease-out-strong ${
                visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
              aria-hidden={!visible}
            >
              <span className="text-step">step {i + 1}</span>
              <span className={color}>{step.agent}</span>
              <span className={step.tone === "pass" ? "text-verified" : ""}>
                {step.text}
                {/* A blinking cursor on the line that just printed */}
                {isLast && <span className="ml-1 inline-block w-2 animate-pulse bg-ink">&nbsp;</span>}
              </span>
            </li>
          );
        })}
      </ol>

      <dl
        className={`grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] border-t border-rule transition-opacity duration-500 ease-out-strong ${
          done ? "opacity-100" : "opacity-0"
        }`}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="p-4">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="m-0">
              <a href={stat.source} target="_blank" rel="noreferrer" className="font-mono text-2xl font-bold text-ink transition-colors duration-150 hover:text-accent">
                {stat.value}
              </a>
              <span className="block text-[13px] text-muted">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
