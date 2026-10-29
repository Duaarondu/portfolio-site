/**
 * Sections.tsx — the building blocks of the page.
 *
 * LEARNING NOTE: These are Server Components (no "use client" at the top).
 * They render to plain HTML on the server, so they ship zero JavaScript
 * to the visitor. A component is just a function that returns JSX
 * (HTML-like syntax). Data comes in through "props" — the { ... }
 * argument — and Tailwind classes in className do all the styling.
 */
import { profile, projectShortNames, type Project } from "@/data/profile";
import { ClaimCheck } from "./ClaimCheck";

/** Keeps every section the same width with the same side padding. */
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-8 ${className}`}>{children}</div>;
}

/** Section heading with an id so the nav can link to it (#projects etc.) */
function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 font-display text-3xl font-bold tracking-tight sm:text-4xl">
      {children}
    </h2>
  );
}

const textLink =
  "underline decoration-rule decoration-2 underline-offset-4 hover:decoration-verified hover:text-verified";

/* ------------------------------------------------------------------ */

export function SiteHeader() {
  const nav = [
    { label: "Projects", href: "#projects" },
    { label: "Toolkit", href: "#toolkit" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <header className="sticky top-0 z-10 border-b border-rule bg-paper/90 backdrop-blur">
      <Container className="flex h-14 items-center justify-between gap-4">
        <a href="#top" className="font-display text-lg font-extrabold tracking-tight">
          {profile.name}
        </a>
        <nav aria-label="Main">
          <ul className="flex gap-4 text-sm sm:gap-6">
            {nav.map((item) => (
              <li key={item.href} className={item.label === "Toolkit" ? "hidden sm:block" : ""}>
                <a href={item.href} className="text-muted hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

/* ------------------------------------------------------------------ */

export function Hero() {
  const { links } = profile;
  return (
    <Container className="grid gap-10 pt-14 pb-16 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:pb-24">
      <div>
        <h1 className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          {profile.headline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">{profile.intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={`mailto:${links.email}`}
            className="rounded-md bg-ink px-5 py-2.5 font-medium text-paper hover:bg-verified"
          >
            Email me
          </a>
          <a href={links.github} className={textLink}>
            GitHub
          </a>
          <a href={links.linkedin} className={textLink}>
            LinkedIn
          </a>
        </div>
      </div>
      <ClaimCheck claims={profile.claims} />
    </Container>
  );
}

/* ------------------------------------------------------------------ */

/** The Planner → Analyst → Critic loop. A real sequence, so it's numbered. */
function AgentLoop() {
  return (
    <figure className="mt-8">
      <ol className="grid gap-3 sm:grid-cols-3">
        {profile.agentLoop.map((agent, i) => (
          <li
            key={agent.name}
            className={`relative rounded-md border p-4 ${
              agent.name === "Critic" ? "border-verified bg-verified-soft" : "border-rule bg-paper"
            }`}
          >
            <p className="font-display text-lg font-bold">
              <span className="mr-2 text-muted">{i + 1}</span>
              {agent.name}
            </p>
            <p className="mt-1 text-sm text-muted">{agent.does}</p>
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <p className="rounded-md border border-dashed border-rule p-3">
          <strong className="font-semibold">A number doesn&apos;t match?</strong> The Critic sends the
          draft back to the Analyst to revise, up to 3 rounds.
        </p>
        <p className="rounded-md border border-dashed border-verified p-3">
          <strong className="font-semibold text-verified">Every number traced?</strong> The answer
          goes to the user with its sources cited.
        </p>
      </div>
      <figcaption className="sr-only">
        The NFL Fantasy Agent pipeline: Planner, then Analyst, then Critic, with a revision loop
        from Critic back to Analyst.
      </figcaption>
    </figure>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-2 gap-y-1.5 text-sm" aria-label="Tools used">
      {items.map((item) => (
        <li key={item} className="rounded border border-rule px-2 py-0.5 text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function FeaturedProject() {
  const p = profile.featured;
  return (
    <section className="border-t border-rule bg-surface py-16 lg:py-24">
      <Container>
        <SectionTitle id="projects">Projects</SectionTitle>
        <article className="mt-10">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">{p.name}</h3>
          <p className="mt-1 text-muted">
            {p.context}. {p.role}, {p.date}.
          </p>
          <p className="mt-5 max-w-3xl text-lg">{p.summary}</p>
          <AgentLoop />
          <ul className="mt-8 max-w-3xl list-disc space-y-2 pl-5 marker:text-rule">
            {p.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Stack items={p.stack} />
            <a href={p.repo} className={`shrink-0 font-medium ${textLink}`}>
              View the code on GitHub
            </a>
          </div>
        </article>
      </Container>
    </section>
  );
}

function ProjectRow({ p }: { p: Project }) {
  return (
    <article className="grid gap-4 border-t border-rule py-8 md:grid-cols-[14rem_1fr] md:gap-10">
      <div>
        <h3 className="font-display text-xl font-bold">{p.name}</h3>
        <p className="mt-1 text-sm text-muted">
          {p.date}
          <br />
          {p.role}, {p.context.toLowerCase().startsWith('personal') ? 'personal project' : p.context}
        </p>
      </div>
      <div>
        <p className="font-medium">{p.summary}</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted marker:text-rule">
          {p.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Stack items={p.stack} />
          <a href={p.repo} className={`shrink-0 text-sm font-medium ${textLink}`}>
            Code on GitHub
          </a>
        </div>
      </div>
    </article>
  );
}

export function OtherProjects() {
  return (
    <Container className="py-12 lg:py-16">
      <h3 className="sr-only">More projects</h3>
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
        <p className="mt-3 max-w-2xl text-muted">
          Each tool is listed with the project where I used it.
        </p>
        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {profile.toolkit.map((group) => (
            <div key={group.name}>
              <h3 className="border-b border-ink pb-2 font-display text-lg font-bold">
                {group.name}
              </h3>
              <ul className="mt-2">
                {group.tools.map((tool) => (
                  <li
                    key={tool.name}
                    className="flex items-baseline justify-between gap-3 border-b border-rule py-2"
                  >
                    <span>{tool.name}</span>
                    <span className="shrink-0 text-right text-xs text-muted">
                      {tool.usedIn.map((slug) => projectShortNames[slug]).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Experience() {
  const edu = profile.education;
  return (
    <section className="border-t border-rule bg-surface py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTitle id="experience">Experience</SectionTitle>
          {profile.jobs.map((job) => (
            <article key={job.company} className="mt-8">
              <h3 className="font-display text-xl font-bold">{job.title}</h3>
              <p className="text-muted">
                {job.company}, {job.location}
                <br />
                {job.dates}
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 marker:text-rule">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Education</h2>
          <article className="mt-8">
            <h3 className="font-display text-xl font-bold">{edu.degree}</h3>
            <p className="text-muted">
              {edu.school}, {edu.location}
              <br />
              {edu.graduation}
            </p>
            <p className="mt-3">Coursework: {edu.coursework.join(", ")}.</p>
          </article>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function Contact() {
  const { links } = profile;
  return (
    <footer className="border-t border-rule py-16 lg:py-20">
      <Container>
        <SectionTitle id="contact">Let&apos;s talk</SectionTitle>
        <p className="mt-3 max-w-xl text-lg text-muted">
          I&apos;m looking for Summer 2027 internships in software and AI engineering in the New York
          City area. {profile.workAuth}, no sponsorship needed.
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-lg">
          <li>
            <a href={`mailto:${links.email}`} className={textLink}>
              {links.email}
            </a>
          </li>
          <li>
            <a href={links.github} className={textLink}>
              github.com/Duaarondu
            </a>
          </li>
          <li>
            <a href={links.linkedin} className={textLink}>
              linkedin.com/in/duaarondu
            </a>
          </li>
        </ul>
        <p className="mt-16 text-sm text-muted">
          Built with Next.js, TypeScript and Tailwind CSS. Deployed on Vercel.
        </p>
      </Container>
    </footer>
  );
}
