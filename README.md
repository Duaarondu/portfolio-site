# Aaron Du — portfolio

Personal portfolio built with Next.js 16, TypeScript and Tailwind CSS 4.

**Want to learn how it's built?** Start with [BUILD_GUIDE.md](./BUILD_GUIDE.md).

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit the content

All text lives in `src/data/profile.ts`. Add a project, change a bullet, save, and the page updates.

## Where things are

```
src/app/layout.tsx           fonts, page title, <html> wrapper
src/app/page.tsx             section order
src/app/globals.css          colors (light + dark), fonts, focus styles
src/components/Sections.tsx  header, hero, projects, toolkit, experience, contact
src/components/ClaimCheck.tsx the animated "claim check" panel in the hero
src/data/profile.ts          every word on the site
```

## Deploy

Push to GitHub, then import the repo at vercel.com (Add New → Project → Deploy). Every later `git push` redeploys automatically. Full steps are in BUILD_GUIDE.md, Stage 8.
