/**
 * YouTubeDemo.tsx — a lightweight, click-to-play YouTube video.
 *
 * WHY: A normal YouTube embed loads about a megabyte of YouTube's code
 * the moment the page opens, even if nobody watches. This component
 * shows only the video's thumbnail image and a play button. The real
 * player (an <iframe>) is created only after someone clicks play, so
 * the page stays fast. This trick is called a "facade."
 *
 * It uses youtube-nocookie.com, YouTube's privacy-enhanced mode, which
 * doesn't set tracking cookies until the visitor plays the video.
 */
"use client";

import { useState } from "react";
import Image from "next/image";

/** Pull the video ID out of any common YouTube link. */
export function youTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([\w-]{11})/, // https://youtu.be/ID
    /[?&]v=([\w-]{11})/, // https://www.youtube.com/watch?v=ID
    /\/(?:embed|shorts|live)\/([\w-]{11})/, // /embed/ID, /shorts/ID, /live/ID
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function YouTubeDemo({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const id = youTubeId(url);

  // No link yet: a placeholder that says what goes here
  if (!id) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 border border-dashed border-rule bg-surface p-6 text-center">
        <PlayIcon />
        <p className="font-display text-lg uppercase">Demo video</p>
        <p className="font-mono text-xs text-step">Paste the YouTube link into featured.demoUrl in profile.ts</p>
      </div>
    );
  }

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-night">
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden bg-night"
    >
      {/* hqdefault.jpg exists for every video (maxresdefault doesn't always).
          If the thumbnail can't load, the card still shows the play button. */}
      {!thumbFailed && (
        <Image
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          fill
          sizes="(min-width: 1152px) 72rem, 100vw"
          onError={() => setThumbFailed(true)}
          className="object-cover opacity-80 transition-[scale,opacity] duration-700 ease-out-strong group-hover:scale-[1.02] group-hover:opacity-100"
        />
      )}
      {/* Darken the edges so the play button and label stand out */}
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-accent text-accent-ink transition-[scale] duration-200 ease-out-strong group-hover:scale-105 group-active:scale-95">
          <svg viewBox="0 0 24 24" className="ml-1 size-8" aria-hidden="true">
            <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
          </svg>
        </span>
      </span>
      <span className="absolute bottom-4 left-5 font-display text-lg text-cream uppercase">
        Watch the demo
      </span>
    </button>
  );
}

function PlayIcon() {
  return (
    <span className="flex size-14 items-center justify-center rounded-full border border-rule text-step">
      <svg viewBox="0 0 24 24" className="ml-0.5 size-6" aria-hidden="true">
        <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
      </svg>
    </span>
  );
}
