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
npm i @fontsource/cinzel-decorative @fontsource-variable/instrument-sans @fontsource-variable/jetbrains-mono
```

Then import them at the top of `layout.tsx` (compare with this project's version). Delete the `Geist` font code that came with the starter.

**Colors.** Replace `globals.css` with your own palette. Read the comments in this project's `globals.css`; the key trick is:

```css
:root { --accent: #f2b544; }                    /* define a variable */
@theme inline { --color-accent: var(--accent); } /* Tailwind turns it into text-accent, bg-accent ... */
```

Because every color is a variable, changing the whole site's look is a matter of editing a few lines. This design ("Trace") is dark-only; to add a light mode, redefine the same variables inside `@media (prefers-color-scheme: light) { :root { ... } }`.

**Check:** put `<h1 className="font-display text-6xl text-accent">Hello</h1>` in `page.tsx`. It should show in Cinzel Decorative (the swashy display face) in amber.

**Three fonts, three jobs:** Cinzel Decorative for titles and labels, Instrument Sans for paragraphs (decorative capitals are hard to read in long text), and JetBrains Mono only inside the agent trace, where it should look like a log.

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

## Stage 5: An interactive piece (the agent trace)

So far everything is a **Server Component**: rendered to HTML on the server, no JavaScript sent to the visitor. The agent-trace panel in the hero prints one log line at a time, so it needs the browser.

Open `src/components/AgentTrace.tsx` and read it top to bottom. The three ideas:

1. **`"use client"`** on line 1 makes it a Client Component.
2. **`useState`** holds a value that changes: how many lines have printed so far. When you call `setShown`, React re-renders the panel, and the next line's classes switch from `opacity-0` to `opacity-100`.
3. **`useEffect`** runs code after the component appears in the browser. Here it starts a timer that bumps the count every 520ms, and returns a cleanup function that stops the timer.

**Exercise:** change `LINE_MS` to `1200` and watch the difference. Then turn on "Reduce motion" in your OS accessibility settings and reload — every line appears at once. That's the `prefers-reduced-motion` check.

---

## Stage 5b: Scenes (the title card and the photo strip)

The top of the page works like a film: each part takes over the screen, and your scroll is the play head. It uses **Motion** (motion.dev, formerly Framer Motion), the most common animation library for React.

```bash
npm i motion
```

**Scene 1, the title card** (`src/components/TitleScene.tsx`). Each line has two animations on two nested elements:
- The inner `<motion.span>` slides in on page load (`initial` → `animate`), with each line a little later than the last, like opening credits.
- The outer one is driven by scroll. `useScroll({ target, offset: ["start start", "end start"] })` gives `scrollYProgress`, which goes from 0 to 1 as the scene scrolls away. `useTransform(scrollYProgress, [0, 1], ["0vw", "30vw"])` turns that into a sideways push, alternating left and right, so the title pulls apart.

They're on separate elements because two animations controlling the same `x` value on one element would fight each other.

The staggered layout is just padding: each line in `profile.ts` has an `indent` (a percentage of the width).

**Scene 2, the photo strip** (`src/components/PhotoScene.tsx`):
1. **A tall section with a sticky panel inside.** The `<section>` is several screens tall (35% of a screen per photo). The panel inside has `sticky top-14 h-[calc(100svh-3.5rem)]`, so it stays pinned under the header while you scroll through all that height.
2. **`useScroll` measures progress** through the section, from 0 to 1. Scrolling back up plays everything in reverse, like scrubbing a video.
3. **The strip slides.** `useTransform(scrollYProgress, [0, 1], [0, -distance])` moves the photo row left. `distance` is measured from the real layout with a `ResizeObserver`, so it stays right on any screen size.
4. **The sentence fills in letter by letter.** Each letter gets its own tiny slice of the progress and blends from `DIM` to `INK`. Motion can blend real colors like `#3d3c34` but not CSS variables, which is why those two colors are written out at the top of the file.

A bug worth knowing: the words first rendered glued together ("YOU'LLFINDME"). Each word is an `inline-block` (so it never splits across lines), and a space at the *end* of an inline-block gets swallowed. Moving the space *between* the word spans fixed it.

**Reduced motion:** the `motion-safe:` and `motion-reduce:` Tailwind prefixes turn off the pinning for people who turned on "Reduce motion." They get the full sentence and a photo row they can swipe.

**Adding your photos:**
1. Put your photos in `public/about/` named `photo-01.jpg` through `photo-10.jpg`. Tall portrait photos look best (the frames are about 9:19, like a phone screen). Resize big phone photos to about 1000px tall first.
2. In `src/data/profile.ts`, find `about.photos` and fill in each one:
   ```ts
   { src: "/about/photo-01.jpg", alt: "Snowboarding down a trail at Hunter Mountain" },
   ```
   The path starts with `/about/`, not `public/about/`, because everything in `public/` is served from the site root.
3. `alt` describes the photo for people using screen readers, in one short sentence.

Next.js's `<Image>` component automatically resizes and compresses your photos for each screen size.

**Exercises:**
- Change `SCREENS_PER_PHOTO` from 35 to 60 and notice the strip moves slower.
- Change `30vw` in `TitleScene.tsx` to `60vw` so the title flies apart harder.
- Add a sixth title line in `profile.ts`, like `{ text: "Builder", indent: 30 }`.

---

## Stage 5b-2: "Now building", the card that updates itself

The "Now building" card (in the card grid, under the contact dial) shows the project you're actively working on, its latest commits, and when you last pushed. You never edit it: push code to GitHub and the site catches up within about an hour.

**How it works** (`src/lib/github.ts`):
1. **It runs on the server.** `NowBuilding.tsx` is an `async` Server Component, so it can `await` data before the page is sent. The browser never talks to GitHub.
2. **It asks GitHub's public API two questions.** First, "which of Aaron's repos was pushed most recently?" (`/users/Duaarondu/repos?sort=pushed`). It skips forks, archived repos and anything in `skipRepos`, like this website's own repo, which would otherwise always win. Second, "what are that repo's latest commits?" (`/repos/owner/name/commits`).
3. **It caches the answer.** `"use cache"` plus `cacheLife("hours")` tells Next.js to save the result and reuse it. When you build, you'll see `Revalidate 1h` next to `/`: the page is static and fast, and about once an hour a visit triggers a quiet refresh in the background.
4. **It never breaks.** If GitHub is down or rate-limited, the function returns `null` and the page shows `nowBuilding.fallback` from `profile.ts`.

**Why times are filled in on the client:** "3 hours ago" depends on the visitor's clock, so the server can't know it. `NowBuildingView.tsx` is a Client Component that fills those in with `useEffect`, using the built-in `Intl.RelativeTimeFormat`.

**Settings in `profile.ts` → `nowBuilding`:**
- `current`: what you're working on, written by hand. Fill in `name` and `description`. If the project has a public repo, put it in `repo` (like `"Duaarondu/wedding-project"`) and the scene adds its latest commits and last-push time from GitHub automatically.
- Leave `current.name` empty to switch to fully automatic mode: the scene shows whichever public repo you pushed to most recently.
- `skipRepos`: repos automatic mode should never pick, like `portfolio-site` (this website) and `neetcode-submissions`.
- `note`: an optional line in your own words, like what you're stuck on or learning.

**Only public repos appear automatically.** For a private or not-yet-pushed project, use `current` by hand; when it goes public, add its `repo` and the commits appear on their own.

**Recommended once you deploy:** in Vercel, go to Settings → Environment Variables and add `GITHUB_TOKEN` with a fine-grained GitHub token that has read-only access to public repositories. Without it, GitHub allows 60 requests an hour per server address, and Vercel's servers are shared with other sites.

**Exercises:**
- Change `cacheLife("hours")` to `cacheLife("minutes")` and see the build output change from `1h`.
- Show the repo's star count: GitHub's repo response includes `stargazers_count`. Add it to the `NowBuilding` type and render it.

---

## Stage 5c: Scroll reveals, cards and the marquee footer

**Scroll reveals.** Open `src/components/Reveal.tsx`. It has four small wrappers you can put around any content:

| Wrapper | What it does |
|---|---|
| `<Reveal>` | Fades and rises in the first time it scrolls into view |
| `<RevealGroup as="ul">` + `<RevealItem as="li">` | Children appear one after another, like log lines printing |
| `<Wipe>` | Uncovers a heading left to right, like typing |

They use Motion's `whileInView`: the element starts at its `initial` style and animates to the visible style when it enters the screen. `viewport={{ once: true }}` means it only plays the first time.

The stagger works through **variants**: named states (`"hidden"`, `"shown"`) that a parent passes down. The group says "go to `shown`, one child every 0.07s" (`staggerChildren`), and each item knows what `shown` looks like.

A bug worth knowing about: the `Wipe` originally never played. A fully clipped element counts as invisible to the browser, so it could never trigger "I'm in view." The fix was to watch an unclipped outer span and animate the inner one. When an animation doesn't fire, check what the browser thinks is visible.

**How the motion is tuned.** All the timing follows design engineer Emil Kowalski's guidelines (his course is animations.dev). The shared settings live in `src/lib/motion.ts`:
- **Ease-out for anything appearing** (`EASE_OUT`): it starts fast and settles gently, so it feels responsive. Ease-in feels laggy, because nothing happens at first.
- **Short durations:** about 150 to 250ms for hovers and presses, 300 to 500ms for entrances.
- **Small starts:** things rise 8 to 12px and clear a light blur instead of flying in from far away.
- **Press feedback:** buttons shrink to about 97% while pressed (`active:scale-[0.97]`), so a click feels physical.
- **Animate only cheap properties** (transform, opacity, filter, clip-path), and list them explicitly (`transition-[opacity,translate]`), never `transition-all`.
- **Springs for things people interact with**, like the contact dial, because a spring can change direction smoothly if you click again mid-turn.

The same curves are available as Tailwind classes (`ease-out-strong`, `ease-in-out-strong`), defined in `globals.css`.

`src/components/MotionProvider.tsx` sets `reducedMotion="user"` for the whole site, so people with "Reduce motion" on see fades but no sliding.

**The cards** (`src/components/CardGrid.tsx`) are two flex columns that stack on phones. Two of them have their own small tricks:
- **Contact dial** (`ContactDial.tsx`): the links sit on an invisible circle. Each one's position is `x = cos(angle) × radius`, `y = sin(angle) × radius`, and its text is rotated by the same angle so it follows the curve. Changing the selection gives every item a new angle, and Motion's spring animation turns the dial. It turns by itself every few seconds until someone clicks a link.
- **Experience**: tiles show initials until you add a logo. Put an image in `public/logos/` and set `logo: "/logos/nyit.png"` on that row in `profile.ts`.

**The demo video** (`YouTubeDemo.tsx`) is a "facade." A normal YouTube embed loads about a megabyte of YouTube's code as soon as the page opens, even if nobody watches. This component shows only the thumbnail and a play button; clicking swaps in the real player. To add yours, paste the link into `featured.demoUrl` in `profile.ts`. Any YouTube link format works, because `youTubeId()` uses regular expressions to pull out the 11-character video ID. The thumbnail loads through Next's `<Image>`, which needs YouTube's image server allowed in `next.config.ts` (`images.remotePatterns`).

**The marquee footer.** Open `src/components/MarqueeFooter.tsx`. The trick is rendering the row of links **twice**, side by side, then sliding the whole strip left by exactly 50% (one copy) with a CSS animation, forever. When it jumps back to the start, the second copy is in exactly the spot the first one was, so you never see the jump. The animation itself is defined in `globals.css` as `--animate-marquee`, which gives you the `animate-marquee` class.

The second copy has `aria-hidden` and `tabIndex={-1}` so screen readers and keyboard users don't get every link twice. The labels use Cinzel Decorative, whose swash capitals give the strip its elegant look.

**Exercises:**
- Change `staggerChildren: 0.07` to `0.2` and watch lists print slower.
- Change the marquee speed: `38s` in `globals.css`. Smaller is faster.
- Add your X or Discord link in `profile.ts` (`links.x`, `links.discord`) and watch it appear in the footer.

---

## Fixing a hydration error: usePrefersReducedMotion

Next.js renders each page on the server first, then React "hydrates" it in the browser: it renders again and checks that both match. The server can't know whether the visitor's computer asks for reduced motion, so any component that renders differently based on that setting causes a red "hydration mismatch" error in dev.

`src/lib/usePrefersReducedMotion.ts` uses React's `useSyncExternalStore`: during hydration it returns the server's answer (`false`), then re-renders with the real setting. Use it instead of Motion's `useReducedMotion` whenever the answer changes what gets rendered.

## Stage 5c-2: every section is its own scene

`Scene.tsx` wraps the projects, toolkit and card sections in `page.tsx`. Each one is at least a screen tall (`min-h-svh`) and is tracked by two `useScroll` calls:

- **enter** goes 0 → 1 while the section's top travels from the bottom of the screen to just past the middle: it fades in, rises 80px and grows from 95% to full size.
- **exit** goes 0 → 1 while its bottom travels from just above the middle to the top of the screen: it fades down and shrinks slightly.

`useTransform(() => ...)` (the function form) combines both into one value, so a section can be entering and leaving at the same time if it's short. With reduced motion only the fade plays.

The last scene, `EndScene.tsx`, is a framed photo (`profile.ts → endPhoto`) that settles from 112% to 100% zoom as you scroll to it, with the AD logo in cream, blended into the photo with `mix-blend-overlay` so it takes on the sky's colors (it's lifted above center with a bottom margin). The footer strip rises in with `<RiseOnScroll>`, which is tied to scroll position so it plays even with reduced motion on. `object-[center_50%]` picks which part of the photo stays in the frame (0% = top, 100% = bottom). The footer strip with the links comes after it.

**Try it:** change `0.95` in `Scene.tsx` to `0.85` for a stronger zoom, or swap `endPhoto.src` for a different photo.

## Stage 5d: Your logo and tab icon

The cursive "AD" in the top-left corner and in the browser tab are the same shapes. They come from the **Great Vibes** script font (free and open-source under the SIL Open Font License, so it's fine to use for a logo).

**Why shapes and not text?** If the logo were typed text in a script font, it would flash in a fallback font while loading, and a favicon can't load fonts at all. So the A and D were converted into SVG **paths**: lists of drawing instructions ("move here, curve to there"). A short Python script using the `fontTools` library read each letter's outline from the font file and wrote out the path data, overlapping the D onto the A so they connect.

**The tab icon** uses Next.js's file conventions. Drop specially named files into `src/app/` and Next adds the right `<link>` tags to every page for you:

| File | Where it shows |
|---|---|
| `src/app/icon.svg` | Browser tabs (modern browsers) |
| `src/app/favicon.ico` | Older browsers and bookmarks |
| `src/app/apple-icon.png` (180×180) | iPhone home screen when someone saves your site |

Small icons need their own design. At 16 pixels, the elegant version looked like a smudge, so the tab icon packs the letters tighter, fills more of the square and adds a thin outline to thicken the strokes.

**The write-on animation** is in `src/components/Logo.tsx`. Each letter is a `<motion.path>`. Motion's special `pathLength` value goes from 0 (nothing drawn) to 1 (the full outline), which looks like a pen tracing the letter. Then `fillOpacity` goes from 0 to 1 to fill it in. The D starts half a second after the A.

**Back to top:** the logo is a real link (`href="#top"`), so it works even without JavaScript. The click handler upgrades it to a smooth `window.scrollTo({ top: 0 })` and stops `#top` from being added to the URL.

**Exercises:**
- Change the logo color by changing `text-accent` in `Logo.tsx` to `text-agent` or `text-cream`.
- Slow the writing down: change `duration: 1.1` to `2`.
- Replace `src/app/icon.svg` with your own design, then restart `npm run dev` and look at the tab.

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
npm run lint       # finds code problems
npm run typecheck  # checks every type (generates Next's route types first)
npm test           # runs the tests in /tests
npm run build      # builds the production site
```

**The tests** (`tests/*.test.ts`, run by Vitest):
- `github.test.ts` checks the "Now building" logic with made-up GitHub responses, so it never calls the real API.
- `profile.test.ts` checks your content: every photo path points at a real file, every photo has alt text, links use https, and no phone number slipped in.

Try breaking one on purpose: change `photo-07.jpg` to `photo-7.jpg` in `profile.ts` and run `npm test`. It fails and names the file. `npm run test:watch` re-runs the tests every time you save.

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

From now on, every `git push` redeploys the site automatically. That's the **CD** (continuous deployment) half of CI/CD.

### CI: GitHub checks every push

`.github/workflows/ci.yml` is a GitHub Actions workflow. On every push to `main` and every pull request, GitHub starts a fresh Linux machine, installs your packages with `npm ci` (exactly the versions in `package-lock.json`), and runs lint, type check, tests and build: the same four commands as Stage 7. Watch it in your repo's **Actions** tab. A green check means it all passed; a red X shows which step failed and why.

Together with Vercel that's the whole loop: push → CI checks it → Vercel deploys it. To stop broken code from going live at all, turn on branch protection: repo **Settings → Branches → Add rule** for `main`, check **Require status checks to pass**, and pick `check`. Then work on a branch, open a pull request, and merge only when it's green. Vercel gives every pull request its own preview link too.

### Dependabot: package updates

`.github/dependabot.yml` asks GitHub to open a pull request once a week when a package has an update (small updates are grouped into one). CI runs on it, so if it's green you can merge it.

### /llms.txt: a version of the site for AI tools

`src/app/llms.txt/route.ts` serves a plain Markdown summary of you at `/llms.txt`, built from `profile.ts`. It follows the llms.txt convention (llmstxt.org): AI assistants and agents can read your projects and experience cleanly instead of digging through HTML and animations.

---

### Link previews, Google and your domain

- `src/app/opengraph-image.tsx` draws the picture that shows when your link is shared (1200×630). It's JSX turned into a PNG by `ImageResponse`, built once at build time. To test it, run `npm run dev` and open http://localhost:3000/opengraph-image.
- `layout.tsx` sets `metadataBase` to `profile.siteUrl` (https://duaarondu.com) plus the title and description used in the preview. Next.js writes all the `og:` and `twitter:` tags for you.
- `sitemap.ts` and `robots.ts` become `/sitemap.xml` and `/robots.txt` for search engines.
- LinkedIn caches previews. If you change the image after sharing, paste your URL into linkedin.com/post-inspector to refresh it.

---

## Stage 9: Make it yours (next exercises)

Ranked from easiest to most valuable:

1. **Add the LIRR screenshot.** Put an image in `public/` and show it with Next's `<Image>` component.
2. **Add a project page.** Create `src/app/projects/nfl-agent/page.tsx` with a deeper write-up and a demo GIF.
3. **Add analytics** with Vercel Analytics to see who visits.
4. **Make it AI-native:** add a small "Ask about my projects" chat box using the Vercel AI SDK and an LLM API, answering only from `profile.ts`. That turns the site itself into an AI engineering project you can talk about in interviews.

Read the official docs that ship with your install in `node_modules/next/dist/docs/` — they match your exact Next.js version.
