/**
 * NowBuildingView.tsx — the "Now building" card, under the contact dial.
 *
 * - A pulsing amber dot marks it as live.
 * - The project name wipes in.
 * - Up to three recent commits print in one at a time, like a terminal log.
 * - Times are shown relative to now ("3 hours ago"). The server doesn't
 *   know the visitor's clock, so they're filled in after the page loads
 *   (in useEffect) to avoid a mismatch between server and browser.
 */
"use client";

import { useEffect, useState } from "react";
import type { NowBuilding } from "@/lib/github";
import { Reveal, RevealGroup, RevealItem, Wipe } from "./Reveal";

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** "3 hours ago", "yesterday", "2 weeks ago"... */
function timeAgo(iso: string, now: number) {
  const seconds = (new Date(iso).getTime() - now) / 1000;
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

/** Turn "nfl-agent" into "nfl agent" for the big title. */
function titleFrom(name: string) {
  return name.replace(/[-_]+/g, " ");
}

export function NowBuildingView({ data, note }: { data: NowBuilding; note: string }) {
  // null until the browser has a clock to compare against
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 60_000); // keep "x minutes ago" fresh
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  const live = data.source === "github";
  const commits = data.commits.slice(0, 3); // the card has room for three

  return (
    <div id="now" aria-label="Now building" className="h-full scroll-mt-20 bg-surface p-6 sm:p-8">
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs font-medium tracking-[0.14em] uppercase">
        <span className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
            <span className="relative size-2.5 rounded-full bg-accent" />
          </span>
          Now building
        </span>
        {live && data.pushedAt && (
          <span className="text-step">
            Last push {now === null ? "recently" : timeAgo(data.pushedAt, now)}
          </span>
        )}
      </p>

      <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-none uppercase">
        <Wipe>{titleFrom(data.name)}</Wipe>
      </h2>

      <Reveal delay={0.1}>
        {data.description && <p className="mt-4 text-muted">{data.description}</p>}
        {note && <p className="mt-2">{note}</p>}
        {(data.language || data.url) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs font-medium tracking-[0.14em] uppercase">
            {data.language && <span className="border border-rule px-2 py-0.5 text-muted">{data.language}</span>}
            {data.url && (
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-rule underline-offset-4 transition-colors duration-150 hover:text-accent hover:decoration-accent"
              >
                Follow along on GitHub
              </a>
            )}
          </div>
        )}
      </Reveal>

      {commits.length > 0 && (
        <RevealGroup as="ol" className="mt-6 border-t border-rule font-mono text-[12px]">
          {commits.map((c) => (
            <RevealItem as="li" key={c.sha} className="border-b border-rule">
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-3 gap-y-0.5 py-2 transition-colors duration-150 hover:bg-paper"
              >
                <span className="text-accent">{c.sha}</span>
                <span className="min-w-0 truncate text-ink">{c.message}</span>
                <span className="col-start-2 text-step">
                  {c.date && now !== null ? timeAgo(c.date, now) : ""}
                </span>
              </a>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
