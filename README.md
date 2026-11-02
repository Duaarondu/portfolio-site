# Aaron Du — portfolio

Personal portfolio built with Next.js 16, TypeScript, Tailwind CSS 4 and Motion.

**Want to learn how it's built?** Start with [BUILD_GUIDE.md](./BUILD_GUIDE.md).

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Check it

```bash
npm run lint       # code problems
npm run typecheck  # type errors
npm test           # tests in /tests (Vitest)
npm run build      # production build
```

GitHub Actions runs all four on every push (`.github/workflows/ci.yml`); Dependabot opens weekly update pull requests (`.github/dependabot.yml`).

## Edit the content

All text lives in `src/data/profile.ts`. Add a project, change a bullet, save, and the page updates. To add your photos, see BUILD_GUIDE.md, Stage 5b.

## Where things are

```
src/app/layout.tsx           fonts, page title, <html> wrapper
src/app/page.tsx             section order
src/app/globals.css          colors, fonts, marquee animation, focus styles
src/app/icon.svg             browser-tab icon (also favicon.ico, apple-icon.png)
src/components/Logo.tsx      cursive AD logo: writes itself in, click to go to top
src/components/Sections.tsx  header, projects, toolkit, footer
src/components/TitleScene.tsx scene 1: the staggered name title card
src/components/PhotoScene.tsx scene 2: pinned photo strip + sentence that fills in
src/components/NowBuilding.tsx "Now building" card under the contact dial, auto-updated from GitHub
src/components/Scene.tsx      wraps each section so it plays as its own scene
src/components/EndScene.tsx   the framed river photo with the faded logo, above the footer
src/components/CopyEmail.tsx   footer Email: copies the address instead of opening a mail app
src/lib/github.ts            fetches + caches the GitHub data (hourly)
src/components/AgentTrace.tsx the projects panel that prints the agent trace line by line
src/components/CardGrid.tsx  experience, banner and contact-dial cards
src/components/YouTubeDemo.tsx click-to-play YouTube demo (set featured.demoUrl)
src/components/Reveal.tsx     scroll-reveal wrappers (Reveal, RevealGroup, Wipe)
src/components/MarqueeFooter.tsx the scrolling footer strip
public/about/                your photos (photo-01.jpg … photo-13.jpg)
public/Aaron_Du_Resume.pdf   the resume the header button opens
src/data/profile.ts          every word on the site
src/app/llms.txt/route.ts    /llms.txt: a Markdown summary of the site for AI tools
tests/                       Vitest tests (GitHub logic + content checks)
.github/workflows/ci.yml     CI: lint, type check, tests and build on every push
```

## Deploy

Optional: add a `GITHUB_TOKEN` environment variable in Vercel (read-only, public repos) so the "Now building" card never hits GitHub's rate limit.

Push to GitHub, then import the repo at vercel.com (Add New → Project → Deploy). Every later `git push` redeploys automatically. Full steps are in BUILD_GUIDE.md, Stage 8.
