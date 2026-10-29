# Build this portfolio yourself

This guide walks you through building the site from an empty folder, one stage at a time. The finished code in this project is your answer key: try each stage first, then compare.

Plan on 3–5 hours spread over a few sessions. Each stage ends with something you can see in the browser.

**The stack**, and why AI engineers use it:

| Tool | What it does | Why it's the common choice |
|---|---|---|
| **Next.js 16** (App Router) | React framework: pages, routing, building | Most AI apps and demos ship on it; Vercel's AI SDK is built for it |
| **TypeScript** | JavaScript with types | Catches mistakes in your editor before you run anything |
| **Tailwind CSS 4** | Styling with small utility classes | Fast to iterate, no separate CSS files per component |
| **Git + GitHub** | Version control and hosting your code | Recruiters will click your repo |
| **Vercel** | Hosting | Free, deploys automatically on every `git push` |
| **Claude Code / Cursor** | AI coding assistants | Use them to *explain* code while learning, not to write it for you |

---

## Stage 0: Set up your machine

1. Install **Node.js 22 LTS** from nodejs.org. Check it worked:
   ```bash
   node --version   # should print v22.x or newer
   ```
2. Install **VS Code** and the extensions *Tailwind CSS IntelliSense* and *ESLint*.
3. Make sure you have **Git** (`git --version`) and a GitHub account. Create a free **Vercel** account by signing in with GitHub.

---

## Stage 1: Create the project

```bash
npx create-next-app@latest aaron-portfolio
```

Answer the prompts: use the recommended defaults (TypeScript, ESLint, Tailwind CSS, App Router), and say **Yes** to a `src/` directory.

```bash
cd aaron-portfolio
npm run dev
```

Open http://localhost:3000. You'll see the starter page.

**Tour of what you got:**

```
src/app/layout.tsx   wraps every page: <html>, <body>, fonts, page title
src/app/page.tsx     the home page "/"
src/app/globals.css  global styles and Tailwind setup
public/              images and files served as-is
package.json         your dependencies and scripts (dev, build, lint)
AGENTS.md            notes for AI coding assistants about this Next.js version
```

**Try it:** change the text in `src/app/page.tsx` and save. The browser updates instantly. That's *hot reload*.

> **Key idea: file-based routing.** The folder structure is the URL structure. `src/app/page.tsx` is `/`. If you create `src/app/about/page.tsx`, you get `/about`.

---

## Stage 2: Fonts and colors (the design system)

**Fonts.** Install them from npm so they're bundled with your site:

```bash
npm i @fontsource-variable/bricolage-grotesque @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono
```

Then import them at the top of `layout.tsx` (compare with this project's version). Delete the `Geist` font code that came with the starter.

**Colors.** Replace `globals.css` with your own palette. Read the comments in this project's `globals.css`; the key trick is:

```css
:root { --ink: #172033; }                       /* define a variable */
@theme inline { --color-ink: var(--ink); }      /* Tailwind turns it into text-ink, bg-ink ... */
@media (prefers-color-scheme: dark) {
  :root { --ink: #e4e9f0; }                     /* dark mode just swaps the variable */
}
```

**Check:** put `<h1 className="font-display text-6xl text-ink">Hello</h1>` in `page.tsx`. It should show in Bricolage Grotesque in your ink color. Switch your computer to dark mode and watch it change.

---

## Stage 3: Put your content in one data file

Create `src/data/profile.ts`. Start small:

```ts
export type Project = {
  name: string;
  date: string;
  bullets: string[];
};

export const profile = {
  name: "Aaron Du",
  headline: "I build LLM agents that check their own work.",
  projects: [
    { name: "LIRR Live Train Visualizer", date: "February 2026", bullets: ["..."] },
  ] satisfies Project[],
};
```

> **Key idea: types.** `type Project` describes the shape of a project. If you write `nmae` instead of `name`, VS Code underlines it in red. `satisfies Project[]` tells TypeScript to check each item against that shape.

**Why one file?** When you finish a new project, you add it here and the site updates. You never touch layout code to change words.

---

## Stage 4: Your first components (the hero)

A **component** is a function that returns JSX (HTML-like code). Make `src/components/Sections.tsx`:

```tsx
import { profile } from "@/data/profile";

export function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-8">
      <h1 className="font-display text-6xl font-extrabold tracking-tight">
        {profile.headline}
      </h1>
    </div>
  );
}
```

Then use it in `page.tsx`:

```tsx
import { Hero } from "@/components/Sections";
export default function Home() {
  return <main><Hero /></main>;
}
```

Things to notice:
- `className` instead of `class` (JSX rule).
- `{profile.headline}` — curly braces drop JavaScript values into JSX.
- `sm:px-8` — Tailwind's prefix for "on screens at least 640px wide". This is how the site is responsive: design for phones first, then add `sm:`, `md:`, `lg:` overrides.
- `@/` is a shortcut for `src/`.

**Rendering a list:** this is the pattern you'll use everywhere:

```tsx
<ul>
  {profile.projects.map((p) => (
    <li key={p.name}>{p.name}</li>
  ))}
</ul>
```

`key` lets React track each item. Use something unique.

---

## Stage 5: An interactive piece (the claim check panel)

So far everything is a **Server Component**: rendered to HTML on the server, no JavaScript sent to the visitor. The claim-check panel animates, so it needs the browser.

Open `src/components/ClaimCheck.tsx` and read it top to bottom. The three ideas:

1. **`"use client"`** on line 1 makes it a Client Component.
2. **`useState`** holds a value that changes: how many claims are checked so far. When you call `setChecked`, React re-renders the panel.
3. **`useEffect`** runs code after the component appears in the browser. Here it starts a timer that bumps the count every 650ms, and returns a cleanup function that stops the timer.

**Exercise:** change `STEP_MS` to `1500` and watch the difference. Then turn on "Reduce motion" in your OS accessibility settings and reload — everything appears checked instantly. That's the `prefers-reduced-motion` check.

---

## Stage 6: Build the rest (try it yourself first)

For each section, write it yourself from the data, then compare with `Sections.tsx`:

1. **Header** with links to `#projects`, `#toolkit`, `#experience`, `#contact`. Give each section heading a matching `id`. `sticky top-0` keeps the header on screen.
2. **Featured project** with the Planner → Analyst → Critic loop. Hint: an `<ol>` with `grid sm:grid-cols-3`.
3. **Other projects** as rows. Hint: `grid md:grid-cols-[14rem_1fr]` gives a fixed left column.
4. **Toolkit** where every tool shows which project used it. This is the stage to try with no peeking.
5. **Experience, education, contact.**

When you're stuck, paste your code into Claude or Cursor and ask *"explain why this layout breaks on mobile"* rather than *"fix it"*. You'll learn faster.

---

## Stage 7: Check your work

```bash
npm run lint    # finds code problems
npm run build   # builds the production site; fails on type errors
```

Fix anything they report. Then test:
- Shrink the browser to phone width. Nothing should scroll sideways.
- Press **Tab** through the page. You should always see where focus is.
- Toggle dark mode.

---

## Stage 8: Put it on the internet

1. Create an empty repo on GitHub called `portfolio`.
2. Push your code:
   ```bash
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/Duaarondu/portfolio.git
   git push -u origin main
   ```
3. On vercel.com: **Add New → Project**, pick the `portfolio` repo, click **Deploy**. No settings needed; Vercel detects Next.js.
4. You'll get a URL like `portfolio-xyz.vercel.app`. In the project's **Settings → Domains** you can rename it or add your own domain later.

From now on, every `git push` redeploys the site automatically.

---

## Stage 9: Make it yours (next exercises)

Ranked from easiest to most valuable:

1. **Add the LIRR screenshot.** Put an image in `public/` and show it with Next's `<Image>` component.
2. **Add a project page.** Create `src/app/projects/nfl-agent/page.tsx` with a deeper write-up and a demo GIF.
3. **Add a link-preview image** (what shows when you paste the URL into LinkedIn): see the "Metadata and OG images" guide in the Next.js docs.
4. **Add analytics** with Vercel Analytics to see who visits.
5. **Make it AI-native:** add a small "Ask about my projects" chat box using the Vercel AI SDK and an LLM API, answering only from `profile.ts`. That turns the site itself into an AI engineering project you can talk about in interviews.

Read the official docs that ship with your install in `node_modules/next/dist/docs/` — they match your exact Next.js version.
