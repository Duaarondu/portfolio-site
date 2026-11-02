/**
 * CardGrid.tsx — the grid of cards near the end of the page:
 *
 *   ┌──────────────┐ ┌──────────────┐
 *   │ Experience   │ │ Contact dial │
 *   │              │ ├──────────────┤
 *   ├──────────────┤ │ Now building │
 *   │ Banner photo │ │              │
 *   └──────────────┘ └──────────────┘
 *
 * Two flex columns side by side on wide screens, one column on phones.
 */
import Image from "next/image";
import { profile } from "@/data/profile";
import { ContactDial, type DialLink } from "./ContactDial";
import { NowBuilding } from "./NowBuilding";
import { Reveal, RevealGroup, RevealItem, Wipe } from "./Reveal";

function ExperienceCard() {
  return (
    <div id="experience" className="h-full scroll-mt-20 bg-surface p-6 sm:p-8">
      <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-none uppercase">
        <Wipe>Experience</Wipe>
      </h2>
      <RevealGroup as="ul" className="mt-8 flex flex-col gap-7">
        {profile.experience.map((item) => (
          <RevealItem as="li" key={item.name}>
            <div className="flex items-center gap-4">
              <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-rule bg-paper font-display text-lg text-accent">
                {item.logo ? (
                  <Image src={item.logo} alt="" fill sizes="56px" className="object-cover" />
                ) : (
                  item.initials
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl leading-tight uppercase">{item.name}</p>
                <p className="text-sm text-muted">{item.role}</p>
              </div>
              <div className="shrink-0 text-right text-sm tabular-nums">
                <p>{item.end}</p>
                {item.start && <p className="text-muted">{item.start}</p>}
              </div>
            </div>
            {item.details && item.details.length > 0 && (
              <ul className="mt-3 list-disc sm:ml-[4.5rem] space-y-1 pl-4 text-sm leading-relaxed text-muted marker:text-step">
                {item.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

function BannerCard() {
  const { banner } = profile;
  return (
    <div className="relative flex min-h-48 items-end justify-end overflow-hidden bg-surface p-6 sm:p-8">
      {banner.src ? (
        <>
          <Image src={banner.src} alt={banner.alt} fill sizes="(min-width: 1024px) 36rem, 100vw" className="object-cover" />
          {/* Darken the photo behind the text so it stays readable */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-black/10" />
        </>
      ) : null /* no photo set: the card is plain. Add one in profile.ts → banner.src */}
      <div className="relative text-right">
        <p className="font-display text-[clamp(2rem,4vw,3rem)] leading-none uppercase">{banner.title}</p>
        <p className="mt-2 font-sans text-xs font-medium tracking-[0.14em] uppercase">{banner.line}</p>
      </div>
    </div>
  );
}

export function CardGrid() {
  const { links } = profile;
  const dialLinks: DialLink[] = [
    { label: "Email", href: `mailto:${links.email}`, copy: links.email }, // copies the address
    { label: "LinkedIn", href: links.linkedin },
    { label: "GitHub", href: links.github },
    ...(links.x ? [{ label: "X", href: links.x }] : []),
    ...(links.discord ? [{ label: "Discord", href: links.discord }] : []),
  ];

  return (
    <section id="contact" aria-label="Experience and contact" className="scroll-mt-14 py-16 lg:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:px-8 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <Reveal className="flex-1">
            <ExperienceCard />
          </Reveal>
          <Reveal delay={0.1}>
            <BannerCard />
          </Reveal>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          {/* The dial takes up whatever height is left over */}
          <Reveal delay={0.15} className="flex-1 [&>div]:h-full">
            <ContactDial links={dialLinks} />
          </Reveal>
          {/* What I'm working on now, updated from GitHub */}
          <Reveal delay={0.2}>
            <NowBuilding />
          </Reveal>
        </div>
      </div>
      {/* Plain-text contact details, always readable and easy to copy */}
      <p className="mx-auto mt-8 w-full max-w-6xl px-4 text-sm text-muted sm:px-8">
        {links.email} · {profile.workAuth}, no sponsorship needed
      </p>
    </section>
  );
}
