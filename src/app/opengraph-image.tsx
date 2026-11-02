/**
 * opengraph-image.tsx — the picture that shows when someone shares your
 * link (LinkedIn, iMessage, Slack, Discord, X...).
 *
 * Next.js sees this file name and, at build time, runs it to make a
 * 1200×630 PNG at /opengraph-image. It also adds the <meta> tags that
 * point to it, so you never write them by hand.
 *
 * ImageResponse turns JSX into an image. It understands a subset of CSS:
 * flexbox layout (every element with more than one child needs
 * display: "flex"), colors, gradients, borders, and fonts you load
 * yourself. Fonts must be .ttf, .otf or .woff (not .woff2).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { LETTERS, VIEWBOX } from "@/lib/logo";

export const alt = "Aaron Du — AI and software engineering. Computer Science student at NYIT.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site colors (same as globals.css)
const PAPER = "#111110";
const INK = "#efe8cf";
const MUTED = "#a29e86";
const ACCENT = "#f2b544";

// Files are read once, when this module loads at build time
const root = process.cwd();
// The same display font as the site's headings
const cinzel = await readFile(
  join(root, "node_modules/@fontsource/cinzel-decorative/files/cinzel-decorative-latin-400-normal.woff"),
);
// The site's body font, for the smaller lines (the static @fontsource
// package, because it ships .woff files; the site itself uses the
// variable .woff2 version)
const sans = await readFile(
  join(root, "node_modules/@fontsource/instrument-sans/files/instrument-sans-latin-500-normal.woff"),
);
// The river photo from the last scene, as the background
const photo = await readFile(join(root, "public", profile.endPhoto.src));
const photoUrl = `data:image/jpeg;base64,${photo.toString("base64")}`;

export default function OpenGraphImage() {

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: PAPER, position: "relative" }}>
        {/* Right half: the photo, fading into the dark background on the left */}
        <img
          src={photoUrl}
          alt=""
          width={680}
          height={630}
          style={{ position: "absolute", right: 0, top: 0, width: 680, height: 630, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 0,
            width: 360,
            height: 630,
            display: "flex",
            backgroundImage: `linear-gradient(90deg, ${PAPER}, rgba(17,17,16,0))`,
          }}
        />

        {/* Left: logo, name, what I do, the address */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            width: 700,
            height: "100%",
          }}
        >
          <svg viewBox={VIEWBOX} width={150} height={81} fill={ACCENT}>
            {LETTERS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>
          <div style={{ display: "flex", marginTop: 28, fontFamily: "Cinzel", fontSize: 96, lineHeight: 1, color: INK }}>
            AARON DU
          </div>
          <div style={{ display: "flex", marginTop: 26, fontFamily: "Instrument Sans", fontSize: 38, color: INK }}>
            AI and software engineering
          </div>
          <div style={{ display: "flex", marginTop: 10, fontFamily: "Instrument Sans", fontSize: 26, color: MUTED }}>
            CS student at NYIT · LLM agents
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 44,
              fontFamily: "Instrument Sans",
              fontSize: 22,
              letterSpacing: 5,
              color: ACCENT,
            }}
          >
            DUAARONDU.COM
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cinzel", data: cinzel, style: "normal", weight: 400 },
        { name: "Instrument Sans", data: sans, style: "normal", weight: 500 },
      ],
    },
  );
}
