/**
 * MarqueeFooter.tsx — the scrolling strip at the very end of the page.
 *
 * HOW THE MARQUEE WORKS
 * The row of items is rendered TWICE, side by side. A CSS animation
 * (animate-marquee, defined in globals.css) slides the whole strip left by
 * exactly 50% — one copy's width — then jumps back to 0. Because the second
 * copy is identical, the jump is invisible, so it looks endless.
 *
 * The second copy is hidden from screen readers and keyboard focus, so
 * nobody hears or tabs through every link twice. Hovering pauses it.
 * Links open in a new tab so the site stays open behind them. Email
 * copies the address (see CopyEmail.tsx) instead of opening a mail app.
 * The strip rises into place as you scroll down to it (RiseOnScroll).
 * The marquee itself is pure CSS, no JavaScript.
 * The text uses the site's display face, Cinzel Decorative, whose swash
 * capitals give the strip its elegant look.
 */
import { profile } from "@/data/profile";
import { CopyEmail } from "./CopyEmail";
import { RiseOnScroll } from "./RiseOnScroll";

type Item = { label: string; href?: string; copy?: string };

function items(): Item[] {
  const { links } = profile;
  const list: (Item | null)[] = [
    { label: profile.footerLine },
    { label: "GitHub", href: links.github },
    { label: "Email", copy: links.email },
    links.x ? { label: "X", href: links.x } : null,
    { label: "LinkedIn", href: links.linkedin },
    links.discord ? { label: "Discord", href: links.discord } : null,
    { label: `Copyright ${profile.copyrightYear}` },
  ];
  return list.filter((i): i is Item => i !== null);
}

const linkClass =
  "cursor-pointer whitespace-nowrap uppercase underline-offset-8 transition-colors hover:text-accent hover:underline";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className={`flex shrink-0 items-center motion-reduce:flex-wrap motion-reduce:justify-center ${hidden ? "motion-reduce:hidden" : ""}`}
      aria-hidden={hidden || undefined}
    >
      {items().map((item) => (
        <li key={item.label} className="px-10 sm:px-16 lg:px-24 motion-reduce:px-6 motion-reduce:py-2">
          {item.copy ? (
            <CopyEmail
              email={item.copy}
              label={item.label}
              tabIndex={hidden ? -1 : undefined}
              className={linkClass}
            />
          ) : item.href ? (
            <a
              href={item.href}
              target="_blank" // new tab, so the site stays open
              rel="noreferrer"
              tabIndex={hidden ? -1 : undefined}
              className={linkClass}
            >
              {item.label}
            </a>
          ) : (
            <span className="whitespace-nowrap">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function MarqueeFooter() {
  return (
    <div className="overflow-hidden bg-night py-10 font-display text-2xl tracking-wide text-cream uppercase sm:py-14 sm:text-3xl">
      <RiseOnScroll>
      <nav aria-label="Footer" className="group">
        {/* w-max keeps the strip on one line; hover pauses the animation */}
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
          <Row />
          <Row hidden />
        </div>
      </nav>
      </RiseOnScroll>
    </div>
  );
}
