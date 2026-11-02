/**
 * page.tsx — the home page ("/"). In the Next.js App Router, the folder
 * structure IS the URL structure: src/app/page.tsx is "/", and a file at
 * src/app/blog/page.tsx would become "/blog".
 *
 * This file puts the scenes and sections in order, like a storyboard.
 * To reorder the site, move these lines around.
 */
import { CardGrid } from "@/components/CardGrid";
import { EndScene } from "@/components/EndScene";
import { PhotoScene } from "@/components/PhotoScene";
import { Scene } from "@/components/Scene";
import {
  FeaturedProject,
  OtherProjects,
  SiteFooter,
  SiteHeader,
  Toolkit,
} from "@/components/Sections";
import { TitleScene } from "@/components/TitleScene";
import { profile } from "@/data/profile";

export default function Home() {
  const { about } = profile;
  return (
    <div id="top">
      <SiteHeader />
      <main>
        {/* Scene 1: name title card */}
        <TitleScene lines={profile.titleLines} />
        {/* Scene 2: pinned photo strip */}
        <PhotoScene doing={about.doing} sentence={about.sentence} photos={about.photos} />
        {/* Every section after that is its own scene: it fades and rises in
            as you arrive and fades out as you leave (see Scene.tsx) */}
        {/* Scene 3: the featured project */}
        <Scene>
          <FeaturedProject />
        </Scene>
        {/* Scene 4: more projects */}
        <Scene>
          <OtherProjects />
        </Scene>
        {/* Scene 5: toolkit */}
        <Scene>
          <Toolkit />
        </Scene>
        {/* Scene 6: experience, banner, contact dial, now building */}
        <Scene>
          <CardGrid />
        </Scene>
        {/* Scene 7: the river photo with the faded logo */}
        <Scene>
          <EndScene />
        </Scene>
      </main>
      {/* The scrolling footer strip with the links */}
      <SiteFooter />
    </div>
  );
}
