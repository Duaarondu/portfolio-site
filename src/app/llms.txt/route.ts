/**
 * /llms.txt — a plain-text summary of the site for AI tools.
 *
 * llms.txt is a convention (llmstxt.org): a Markdown file at the root of a
 * site that tells AI assistants and agents what the site is about, without
 * them having to parse the HTML and animations. When a recruiter asks an
 * AI "tell me about Aaron Du's projects", this is the clean version it can
 * read.
 *
 * It's built from profile.ts, so it updates whenever the site's content
 * does. A folder named "llms.txt" with a route.ts inside becomes the URL
 * /llms.txt. Nothing here depends on the request, so Next.js builds it
 * once, at build time.
 */
import { profile } from "@/data/profile";

function build() {
  const p = profile;
  const lines: string[] = [];
  const list = (items: string[]) => items.forEach((i) => lines.push(`- ${i}`));

  lines.push(`# ${p.name}`, "");
  lines.push(`> ${p.intro}`, "");
  lines.push(`${p.workAuth}. ${p.banner.title}: ${p.banner.line}.`, "");

  lines.push("## Links", "");
  list([
    `[Resume (PDF)](${p.links.resume})`,
    `[GitHub](${p.links.github})`,
    `[LinkedIn](${p.links.linkedin})`,
    `Email: ${p.links.email}`,
  ]);
  lines.push("");

  lines.push("## Featured project", "");
  const f = p.featured;
  lines.push(`### [${f.name}](${f.repo})`, "");
  lines.push(`${f.context}. ${f.role}. ${f.date}.`, "", f.summary, "");
  list(f.bullets);
  lines.push("", `Stack: ${f.stack.join(", ")}`);
  if (f.demoUrl) lines.push(`Demo video: ${f.demoUrl}`);
  lines.push("");

  lines.push("## Other projects", "");
  for (const proj of p.projects) {
    lines.push(`### [${proj.name}](${proj.repo})`, "");
    lines.push(`${proj.context}. ${proj.role}. ${proj.date}.`, "", proj.summary, "");
    list(proj.bullets);
    lines.push("", `Stack: ${proj.stack.join(", ")}`, "");
  }

  lines.push("## Experience", "");
  for (const job of p.jobs) {
    lines.push(`### ${job.title}, ${job.company}`, "", `${job.location}. ${job.dates}.`, "");
    list(job.bullets);
    lines.push("");
  }

  lines.push("## Education", "");
  const e = p.education;
  lines.push(`${e.degree}, ${e.school} (${e.location}). ${e.graduation}.`, "");
  lines.push(`Coursework: ${e.coursework.join(", ")}`, "");

  lines.push("## Skills", "");
  for (const group of p.toolkit) {
    lines.push(`- ${group.name}: ${group.tools.map((t) => t.name).join(", ")}`);
  }
  lines.push("");

  return lines.join("\n");
}

export function GET() {
  return new Response(build(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
