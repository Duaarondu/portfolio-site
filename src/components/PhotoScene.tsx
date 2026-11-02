/**
 * PhotoScene.tsx — scene 2, the pinned photo strip.
 *
 * HOW IT WORKS
 * 1. The <section> is several screens tall. A panel inside it uses
 *    `position: sticky; top: 0` and is one screen tall, so it stays pinned
 *    while you scroll through the section. You can't get past it until
 *    the strip has played through.
 * 2. Motion's `useScroll` reports how far you are through the section as a
 *    number from 0 to 1, like the play head of a video.
 * 3. `useTransform` turns that number into motion:
 *      - the photo strip slides from the right edge to past the left edge
 *      - the sentence fills in letter by letter (dim → cream)
 *
 * Scrolling back up plays it in reverse, like scrubbing a video.
 *
 * This scene runs even when the computer asks for reduced motion
 * (Windows "Animation effects" off). The strip only moves when you
 * scroll, so it never plays on its own, and it's the main way to see
 * the photos. The pop-up skips its rise and zoom in that mode (Motion
 * does that for us) and only fades in.
 */
"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { DoingLine, Photo } from "@/data/profile";
import { EASE_OUT } from "@/lib/motion";
import { Reveal } from "./Reveal";

type Props = { doing: DoingLine[]; sentence: string; photos: Photo[] };

const SCREENS_PER_PHOTO = 18; // scroll length per photo, in % of screen height (smaller = quicker)

// Motion blends between real colors, not CSS variables, so these match
// --dim and --ink in globals.css.
const DIM = "#3d3c34";
const INK = "#efe8cf";

export function PhotoScene({ doing, sentence, photos }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Where the strip starts: right under the left edge of the
  // "Studying Comp Sci @ NYIT" heading. The heading is right-aligned, so
  // its left edge depends on the screen width; we measure it.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [start, setStart] = useState<number | null>(null);

  // How far the strip travels: until its right end sits about a third of
  // the way across the screen. Re-measured whenever anything resizes.
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const track = trackRef.current;
    const heading = headingRef.current;
    if (!track || !heading) return;
    const measure = () => {
      const lines = heading.querySelectorAll<HTMLElement>("[data-line]");
      const left = Math.min(...[...lines].map((l) => l.getBoundingClientRect().left));
      setStart(left);
      setDistance(track.scrollWidth - window.innerWidth * 0.35);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(heading);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  // Split the sentence into words (kept together when lines wrap) and
  // count letters so each one gets its own slice of the scroll.
  const words = sentence.split(" ");
  const totalLetters = sentence.replace(/ /g, "").length;
  let letterIndex = 0;

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About me"
      className="relative h-(--scene-height)"
      style={{ "--scene-height": `${100 + photos.length * SCREENS_PER_PHOTO}svh` } as React.CSSProperties}
    >
      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] flex-col justify-between gap-8 overflow-hidden py-8 lg:py-12">
        {/* Top right: what I'm doing */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <Reveal>
            <h2
              ref={headingRef}
              className="text-right font-display text-[clamp(1.4rem,3vw,2.6rem)] leading-tight uppercase"
            >
              {doing.map((line) => (
                <span key={line.verb} className="block">
                  {/* data-line marks the text itself, so we can measure where it starts */}
                  <span data-line>
                    <span className="text-step">{line.verb}</span> {line.what}
                  </span>
                </span>
              ))}
            </h2>
          </Reveal>
        </div>

        {/* Middle: the photo strip, starting under the heading */}
        {/* Regular up/down scrolling slides it sideways; no scrollbar */}
        <div>
          <motion.ul
            ref={trackRef}
            style={{ x, "--start": start === null ? "42vw" : `${start}px` } as React.ComponentProps<typeof motion.ul>["style"]}
            className="flex w-max gap-3 pr-4 pl-(--start) sm:gap-4"
            aria-label="Photos"
          >
            {photos.map((photo, i) => (
              <PhotoFrame key={i} photo={photo} index={i} />
            ))}
          </motion.ul>
        </div>

        {/* Bottom left: the sentence that fills in */}
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
          <p
            className="max-w-xl font-display text-[clamp(1.25rem,2.4vw,2rem)] leading-snug uppercase"
            aria-label={sentence}
          >
            {words.map((word, w) => (
              // The space goes BETWEEN the word spans: a space at the end of
              // an inline-block gets swallowed, which glued the words together.
              <Fragment key={w}>
                <span className="inline-block whitespace-nowrap" aria-hidden="true">
                  {[...word].map((letter) => {
                    const i = letterIndex++;
                    // Letters fill from 5% to 85% of the scene
                    const start = 0.05 + (i / totalLetters) * 0.8;
                    return (
                      <FillLetter key={i} progress={scrollYProgress} range={[start, start + 0.02]}>
                        {letter}
                      </FillLetter>
                    );
                  })}
                </span>{" "}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

/** One letter whose color goes from dim to cream as you scroll. */
function FillLetter({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, [DIM, INK]);
  return (
    <motion.span style={{ color }}>
      {children}
    </motion.span>
  );
}

/**
 * A tall photo, or a numbered placeholder frame until you add one.
 * Each photo "pops up" (fades, rises and sharpens) the moment it slides
 * into view. whileInView uses the browser's IntersectionObserver, which
 * notices the photo entering even though it's the strip that moves.
 */
function PhotoFrame({ photo, index }: { photo: Photo; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  return (
    <motion.li
      initial={{ opacity: 0, y: 28, scale: 0.94, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className="relative aspect-[3/5] h-[min(46svh,24rem)] shrink-0 overflow-hidden bg-surface"
    >
      {photo.src ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          // Ask for images big enough for high-resolution and scaled screens
          sizes="(min-width: 1024px) 20rem, 60vw"
          quality={90}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1 border border-dashed border-rule p-2 text-center">
          <span className="font-display text-2xl text-step">{number}</span>
          <span className="font-mono text-[10px] break-all text-step">photo-{number}.jpg</span>
        </div>
      )}
    </motion.li>
  );
}
