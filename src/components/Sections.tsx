/**
 * Sections.tsx — the header, projects, toolkit and footer.
 *
 * LEARNING NOTE: These are Server Components (no "use client" at the top).
 * They render to plain HTML on the server. A component is just a function
 * that returns JSX (HTML-like syntax). Data comes in through "props" — the
 * { ... } argument — and Tailwind classes in className do the styling.
 *
 * The <Reveal>, <RevealGroup>, <RevealItem> and <Wipe> wrappers (from
 * Reveal.tsx) add the scroll animations without changing the content.
 */
import { profile, projectShortNames, type Project } from "@/data/profile";
import { AgentTrace } from "./AgentTrace";
import { Logo } from "./Logo";
import { MarqueeFooter } from "./MarqueeFooter";
import { Reveal, RevealGroup, RevealItem, Wipe } from "./Reveal";
import { YouTubeDemo } from "./YouTubeDemo";

/** Keeps every section the same width with the same side padding. */
function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-8 ${className}`}>{children}</div>;
}

/** Big section heading that wipes in. Has an id so the nav can link to it. */
function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none uppercase"
    >
      <Wipe>{children}</Wipe>
    </h2>
  );
}

const textLink =
  "underline decoration-rule decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-accent hover:text-accent";

/* ------------------------------------------------------------------ */

export function SiteHeader() {
  const nav = [
    { label: "About", href: "#about", phone: false }, // first thing you scroll into anyway
    { label: "Projects", href: "#projects", phone: true },
    { label: "Toolkit", href: "#toolkit", phone: false },
    { label: "Experience", href: "#experience", phone: false },
    { label: "Contact", href: "#contact", phone: true },
  ];
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/90 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-5 sm:gap-7">
          <nav aria-label="Main">
            <ul className="flex gap-4 font-sans text-[11px] font-medium tracking-[0.16em] uppercase sm:gap-7 sm:text-xs">
              {nav.map((item) => (
                <li key={item.href} className={item.phone ? "" : "hidden md:block"}>
                  <a href={item.href} className="text-muted transition-colors duration-150 hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Shows once profile.links.resume points at your PDF */}
          {profile.links.resume && (
            <a
              href={profile.links.resume}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-accent px-3 py-1.5 font-sans text-[11px] font-medium tracking-[0.16em] text-accent uppercase transition-[color,background-color,scale] duration-150 ease-out-strong hover:bg-accent hover:text-accent-ink active:scale-[0.97] sm:text-xs"
            >
              Resume
            </a>
          )}
        </div>
      </Container>
    </header>
  );
}

/* ------------------------------------------------------------------ */

/** The Planner → Analyst → Critic loop. A real sequence, so it's numbered. */
function AgentLoop() {
  return (
    <figure className="mt-10">
      <RevealGroup as="ol" className="grid gap-3 sm:grid-cols-3">
        {profile.agentLoop.map((agent, i) => (
          <RevealItem
            as="li"
            key={agent.name}
            className={`border bg-surface p-5 ${agent.name === "Critic" ? "border-accent" : "border-rule"}`}
          >
            <p className="font-display text-xl uppercase">
              <span className="mr-2 text-step">{i + 1}</span>
              <span className={agent.name === "Critic" ? "text-accent" : ""}>{agent.name}</span>
            </p>
            <p className="mt-1 text-sm text-muted">{agent.does}</p>
          </RevealItem>
        ))}
      </RevealGroup>
      <RevealGroup className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <RevealItem className="border border-dashed border-rule p-3 text-muted">
          <strong className="font-semibold text-accent">A number doesn&apos;t match?</strong> The
          Critic sends the draft back to the Analyst to revise, up to 3 rounds.
        </RevealItem>
        <RevealItem className="border border-dashed border-verified/50 p-3 text-muted">
          <strong className="font-semibold text-verified">Every number traced?</strong> The answer
          goes to the user with its sources cited.
        </RevealItem>
      </RevealGroup>
      <figcaption className="sr-only">
        The NFL Fantasy Agent pipeline: Planner, then Analyst, then Critic, with a revision loop
        from Critic back to Analyst.
      </figcaption>
    </figure>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-1.5 text-xs" aria-label="Tools used">
      {items.map((item) => (
        <li key={item} className="border border-rule px-2 py-0.5 text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function FeaturedProject() {
  const p = profile.featured;
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <SectionTitle id="projects">Projects</SectionTitle>
        <Reveal>
          <p className="mt-4 max-w-2xl text-lg text-muted">{profile.intro}</p>
        </Reveal>

        <article className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="min-w-0">
            <Reveal>
              <p className="font-sans text-xs font-medium tracking-[0.14em] uppercase text-step">
                {p.date} · {p.context}
              </p>
              <h3 className="mt-2 font-display text-[clamp(2rem,4vw,3rem)] leading-none uppercase">
                {p.name}
              </h3>
              <p className="mt-2 text-muted">{p.role}</p>
              <p className="mt-5 text-lg">{p.summary}</p>
            </Reveal>
            <RevealGroup
              as="ul"
              className="mt-6 list-disc space-y-2 pl-5 text-muted marker:text-step"
            >
              {p.bullets.map((b) => (
                <RevealItem as="li" key={b}>
                  {b}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <Reveal delay={0.1} className="min-w-0 lg:sticky lg:top-24">
            <AgentTrace steps={profile.trace} stats={profile.stats} />
          </Reveal>
        </article>

        {/* Demo video: only the thumbnail loads until someone clicks play */}
        <Reveal className="mt-12">
          <YouTubeDemo url={p.demoUrl ?? ""} title={`${p.name} demo`} />
        </Reveal>

        <AgentLoop />

        <Reveal className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Stack items={p.stack} />
          <a
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            className={`shrink-0 font-sans text-xs font-medium tracking-[0.14em] uppercase ${textLink}`}
          >
            View the code on GitHub
          </a>
        </Reveal>
      </Container>
    </section>
  );
}

function ProjectRow({ p }: { p: Project }) {
  return (
    <Reveal className="grid gap-4 border-t border-rule py-10 md:grid-cols-[16rem_1fr] md:gap-10">
      <div>
        <h3 className="font-display text-2xl leading-tight uppercase">{p.name}</h3>
        <p className="mt-2 text-sm text-muted">
          {p.date}
          <br />
          {p.role},{" "}
          {p.context.toLowerCase().startsWith("personal") ? "personal project" : p.context}
        </p>
      </div>
      <div>
        <p className="text-lg">{p.summary}</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted marker:text-step">
          {p.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Stack items={p.stack} />
          <a
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            className={`shrink-0 font-sans text-xs font-medium tracking-[0.14em] uppercase ${textLink}`}
          >
            Code on GitHub
          </a>
        </div>
      </div>
    </Reveal>
  );
}

export function OtherProjects() {
  return (
    <Container className="py-16 lg:py-24">
      <h2 className="mb-8 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-none uppercase">
        <Wipe>More projects</Wipe>
      </h2>
      {profile.projects.map((p) => (
        <ProjectRow key={p.slug} p={p} />
      ))}
    </Container>
  );
}

/* ------------------------------------------------------------------ */

export function Toolkit() {
  return (
    <section className="border-t border-rule py-16 lg:py-24">
      <Container>
        <SectionTitle id="toolkit">Toolkit</SectionTitle>
        <Reveal>
          <p className="mt-4 max-w-2xl text-muted">
            Each tool is listed with the project where I used it.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {profile.toolkit.map((group) => (
            <div key={group.name}>
              <Reveal>
                <h3 className="border-b border-ink/60 pb-2 font-sans text-sm font-semibold tracking-[0.12em] uppercase">
                  {group.name}
                </h3>
              </Reveal>
              <RevealGroup as="ul" className="mt-2">
                {group.tools.map((tool) => (
                  <RevealItem
                    as="li"
                    key={tool.name}
                    className="flex items-baseline justify-between gap-3 border-b border-rule py-2"
                  >
                    <span>{tool.name}</span>
                    <span className="shrink-0 text-right text-xs text-step">
                      {tool.usedIn.map((slug) => projectShortNames[slug]).join(", ")}
                    </span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function SiteFooter() {
  return (
    <footer>
      <MarqueeFooter />
      <p className="bg-night pb-6 text-center font-mono text-[11px] text-step">
        Built with Next.js, TypeScript, Tailwind CSS and Motion
      </p>
    </footer>
  );
}
