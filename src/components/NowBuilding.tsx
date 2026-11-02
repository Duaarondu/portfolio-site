/**
 * NowBuilding.tsx — the "Now building" card (in CardGrid, under the dial).
 *
 * This is an async Server Component: it awaits the GitHub data on the
 * server (see src/lib/github.ts), then hands plain data to the client
 * component below, which handles the parts that need the browser:
 * "3 hours ago" times (they depend on the visitor's clock) and animation.
 *
 * Which project shows (set in profile.ts → nowBuilding):
 * - `current.name` filled in: that project, written by hand. If
 *   `current.repo` is set too, its commits come from GitHub.
 * - `current.name` empty: the public repo you pushed to most recently.
 */
import { profile } from "@/data/profile";
import { getNowBuilding, type NowBuilding as Data } from "@/lib/github";
import { NowBuildingView } from "./NowBuildingView";

export async function NowBuilding() {
  const settings = profile.nowBuilding;
  const { current } = settings;
  const byHand = current.name.trim() !== "";

  // By hand with no repo: nothing to ask GitHub
  const live =
    byHand && !current.repo
      ? null
      : await getNowBuilding({
          user: settings.githubUser,
          pinnedRepo: byHand ? current.repo : "",
          skipRepos: settings.skipRepos,
          commitCount: settings.commitCount,
        });

  let data: Data;
  if (byHand) {
    // Your words win; GitHub only adds commits, push time and language
    data = {
      name: current.name,
      description: current.description || live?.description || "",
      url: live?.url ?? (current.repo ? `https://github.com/${current.repo}` : ""),
      language: live?.language ?? null,
      pushedAt: live?.pushedAt ?? null,
      commits: live?.commits ?? [],
      source: live ? "github" : "manual",
    };
  } else {
    data = live ?? {
      ...settings.fallback,
      language: null,
      pushedAt: null,
      commits: [],
      source: "manual",
    };
  }

  return <NowBuildingView data={data} note={settings.note} />;
}
