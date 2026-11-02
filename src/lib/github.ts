/**
 * github.ts — reads your public GitHub activity for the "Now building" scene.
 *
 * HOW THE AUTO-UPDATE WORKS
 * 1. This code runs on the SERVER (never in the visitor's browser).
 * 2. It asks GitHub's public API for your repos, sorted by most recent push,
 *    and picks the newest one that isn't on your skip list (or the repo you
 *    pinned in profile.ts). Then it asks for that repo's latest commits.
 * 3. `"use cache"` + `cacheLife("hours")` saves the answer. Visitors get the
 *    saved copy instantly; at most about once an hour, Next.js quietly
 *    fetches a fresh copy in the background. So when you push code, the
 *    site catches up within the hour, with no redeploy.
 * 4. If GitHub can't be reached or says no, it returns null and the page
 *    uses the hand-written fallback from profile.ts instead.
 *
 * Optional: set a GITHUB_TOKEN environment variable (in Vercel: Settings →
 * Environment Variables) to a fine-grained token with read-only access to
 * public repos. Without one, GitHub allows 60 requests an hour per server
 * address, which shared hosting can run out of.
 */
import { cacheLife } from "next/cache";

export type Commit = { sha: string; message: string; date: string; url: string };

export type NowBuilding = {
  name: string;
  description: string;
  url: string;
  language: string | null;
  pushedAt: string | null; // ISO date of the last push
  commits: Commit[];
  source: "github" | "manual";
};

// The parts of GitHub's API responses we use
export type GitHubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};
export type GitHubCommit = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { date: string } | null; committer: { date: string } | null };
};

async function gitHub<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "aaron-du-portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, {
    headers,
    signal: AbortSignal.timeout(5000), // never hold up the page for long
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

/** Choose the repo to show: the pinned one, or the most recently pushed. */
export function pickRepo(repos: GitHubRepo[], skip: string[]): GitHubRepo | null {
  const skipLower = skip.map((s) => s.toLowerCase());
  return (
    repos
      .filter((r) => !r.fork && !r.archived && !skipLower.includes(r.name.toLowerCase()))
      .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))[0] ?? null
  );
}

/** Keep the first line of each commit message, trimmed to a readable length. */
export function toCommits(raw: GitHubCommit[], limit: number): Commit[] {
  return raw.slice(0, limit).map((c) => {
    const firstLine = c.commit.message.split("\n")[0].trim();
    return {
      sha: c.sha.slice(0, 7),
      message: firstLine.length > 90 ? `${firstLine.slice(0, 87)}…` : firstLine,
      date: c.commit.author?.date ?? c.commit.committer?.date ?? "",
      url: c.html_url,
    };
  });
}

export async function getNowBuilding(options: {
  user: string;
  pinnedRepo: string; // "owner/name", or "" to pick automatically
  skipRepos: string[];
  commitCount: number;
}): Promise<NowBuilding | null> {
  "use cache";
  cacheLife("hours");

  try {
    const repo = options.pinnedRepo
      ? await gitHub<GitHubRepo>(`/repos/${options.pinnedRepo}`)
      : pickRepo(
          await gitHub<GitHubRepo[]>(`/users/${options.user}/repos?sort=pushed&per_page=20&type=owner`),
          options.skipRepos,
        );
    if (!repo) return null;

    const commits = await gitHub<GitHubCommit[]>(
      `/repos/${repo.full_name}/commits?per_page=${options.commitCount}`,
    ).catch(() => [] as GitHubCommit[]); // a brand-new empty repo has no commits

    return {
      name: repo.name,
      description: repo.description ?? "",
      url: repo.html_url,
      language: repo.language,
      pushedAt: repo.pushed_at,
      commits: toCommits(commits, options.commitCount),
      source: "github",
    };
  } catch {
    return null; // fall back to the hand-written version in profile.ts
  }
}
