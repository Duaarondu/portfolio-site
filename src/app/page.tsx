/**
 * page.tsx — the home page ("/"). In the Next.js App Router, the folder
 * structure IS the URL structure: src/app/page.tsx is "/", and a file at
 * src/app/blog/page.tsx would become "/blog".
 *
 * This file just puts the sections in order. To reorder the site,
 * move these lines around.
 */
import {
  Contact,
  Experience,
  FeaturedProject,
  Hero,
  OtherProjects,
  SiteHeader,
  Toolkit,
} from "@/components/Sections";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero />
        <FeaturedProject />
        <OtherProjects />
        <Toolkit />
        <Experience />
      </main>
      <Contact />
    </>
  );
}
