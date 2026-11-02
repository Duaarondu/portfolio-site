/**
 * Tests for the "Now building" logic in src/lib/github.ts.
 * They use made-up GitHub responses ("fixtures"), so they never call the
 * real API and always give the same answer.
 */
import { describe, expect, it } from "vitest";
import { pickRepo, toCommits, type GitHubCommit, type GitHubRepo } from "@/lib/github";

function repo(name: string, pushed: string, extra: Partial<GitHubRepo> = {}): GitHubRepo {
  return {
    name,
    full_name: `Duaarondu/${name}`,
    description: null,
    html_url: `https://github.com/Duaarondu/${name}`,
    language: "TypeScript",
    pushed_at: pushed,
    fork: false,
    archived: false,
    ...extra,
  };
}

describe("pickRepo", () => {
  it("picks the most recently pushed repo", () => {
    const repos = [repo("old", "2026-01-01T00:00:00Z"), repo("new", "2026-10-30T00:00:00Z")];
    expect(pickRepo(repos, [])?.name).toBe("new");
  });

  it("skips repos on the skip list, ignoring upper/lower case", () => {
    const repos = [repo("Portfolio-Site", "2026-10-30T00:00:00Z"), repo("wedding", "2026-10-29T00:00:00Z")];
    expect(pickRepo(repos, ["portfolio-site"])?.name).toBe("wedding");
  });

  it("skips forks and archived repos", () => {
    const repos = [
      repo("forked", "2026-10-30T00:00:00Z", { fork: true }),
      repo("archived", "2026-10-29T00:00:00Z", { archived: true }),
      repo("real", "2026-10-01T00:00:00Z"),
    ];
    expect(pickRepo(repos, [])?.name).toBe("real");
  });

  it("returns null when nothing is left", () => {
    expect(pickRepo([], [])).toBeNull();
  });
});

function commit(message: string, sha = "abcdef1234567"): GitHubCommit {
  return {
    sha,
    html_url: `https://github.com/Duaarondu/x/commit/${sha}`,
    commit: { message, author: { date: "2026-10-30T12:00:00Z" }, committer: null },
  };
}

describe("toCommits", () => {
  it("keeps only the first line and a 7-character sha", () => {
    const [c] = toCommits([commit("Add RSVP form\n\nLonger details here")], 5);
    expect(c.message).toBe("Add RSVP form");
    expect(c.sha).toBe("abcdef1");
  });

  it("shortens long messages with an ellipsis", () => {
    const [c] = toCommits([commit("x".repeat(120))], 5);
    expect(c.message.length).toBe(88);
    expect(c.message.endsWith("…")).toBe(true);
  });

  it("respects the limit", () => {
    const many = Array.from({ length: 10 }, (_, i) => commit(`commit ${i}`, `sha${i}000000`));
    expect(toCommits(many, 3)).toHaveLength(3);
  });
});
